create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  color text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content jsonb,
  status text not null default 'idea' check (status in ('idea', 'plan', 'review', 'scheduled', 'published', 'archived')),
  category_id uuid references public.categories(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  brief_subject text,
  brief_audience text,
  brief_message text,
  ai_plan jsonb,
  ai_plan_validated_at timestamptz,
  meta_title text,
  meta_description text,
  featured_image_url text,
  og_image_url text,
  published_at timestamptz,
  scheduled_at timestamptz,
  reading_time_minutes integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
