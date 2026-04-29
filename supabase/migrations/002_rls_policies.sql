alter table public.articles enable row level security;
alter table public.profiles enable row level security;

create policy "Public read published articles"
on public.articles
for select
using (status = 'published');

create policy "Editors manage own articles"
on public.articles
for all
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

create policy "Admins have full access to articles"
on public.articles
for all
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);
