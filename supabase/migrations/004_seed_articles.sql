insert into public.articles (
  title,
  slug,
  excerpt,
  status,
  category_id,
  meta_title,
  meta_description,
  featured_image_url,
  og_image_url,
  published_at,
  reading_time_minutes
)
select
  seed.title,
  seed.slug,
  seed.excerpt,
  'published',
  c.id,
  seed.meta_title,
  seed.meta_description,
  seed.featured_image_url,
  seed.og_image_url,
  seed.published_at::timestamptz,
  seed.reading_time_minutes
from (
  values
    ('Pourquoi les equipes GTM reduisent leur stack pour aller plus vite', 'pourquoi-les-equipes-gtm-reduisent-leur-stack-pour-aller-plus-vite', 'Guide pratique pour accelerer votre execution GTM.', 'Pourquoi les equipes GTM reduisent leur stack pour aller plus vite | Scalefast', 'Guide pratique pour accelerer votre execution GTM.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80', '2026-04-16T08:00:00.000Z', 7, 'news'),
    ('Le discovery call B2B qui ouvre un vrai deal', 'le-discovery-call-b2b-qui-ouvre-un-vrai-deal', 'Framework discovery pour convertir plus de deals.', 'Le discovery call B2B qui ouvre un vrai deal | Scalefast', 'Framework discovery pour convertir plus de deals.', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80', '2026-04-12T10:00:00.000Z', 8, 'sales'),
    ('Construire un pipeline GTM qui survit aux changements', 'construire-un-pipeline-gtm-qui-survit-aux-changements', 'Pipeline lisible et modifiable sans casser l execution.', 'Construire un pipeline GTM qui survit aux changements | Scalefast', 'Pipeline lisible et modifiable sans casser l execution.', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80', '2026-04-08T09:00:00.000Z', 9, 'gtm-engineering'),
    ('Setup minimal pour une stack outbound maintenable', 'setup-minimal-pour-une-stack-outbound-maintenable', 'Stack outbound simple, fiable et actionnable.', 'Setup minimal pour une stack outbound maintenable | Scalefast', 'Stack outbound simple, fiable et actionnable.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80', '2026-04-03T07:30:00.000Z', 6, 'outils'),
    ('Le playbook hebdo qui aligne marketing SDR et AE', 'le-playbook-hebdo-qui-aligne-marketing-sdr-et-ae', 'Rituel hebdo pour garder une execution GTM alignee.', 'Le playbook hebdo qui aligne marketing SDR et AE | Scalefast', 'Rituel hebdo pour garder une execution GTM alignee.', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80', '2026-03-28T11:15:00.000Z', 7, 'ressources'),
    ('Ce que les meilleurs blogs SaaS B2B font avant le premier paragraphe', 'ce-que-les-meilleurs-blogs-saas-b2b-font-avant-le-premier-paragraphe', 'Les patterns editoriaux qui augmentent retention et SEO.', 'Ce que les meilleurs blogs SaaS B2B font avant le premier paragraphe | Scalefast', 'Les patterns editoriaux qui augmentent retention et SEO.', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80', '2026-03-24T08:45:00.000Z', 10, 'analyse')
) as seed(title, slug, excerpt, meta_title, meta_description, featured_image_url, og_image_url, published_at, reading_time_minutes, category_slug)
join public.categories c on c.slug = seed.category_slug
on conflict (slug) do update
set
  title = excluded.title,
  excerpt = excluded.excerpt,
  category_id = excluded.category_id,
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description,
  featured_image_url = excluded.featured_image_url,
  og_image_url = excluded.og_image_url,
  published_at = excluded.published_at,
  reading_time_minutes = excluded.reading_time_minutes;
