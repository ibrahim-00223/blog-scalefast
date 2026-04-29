insert into public.categories (name, slug, description, color) values
  ('News', 'news', 'Actualite GTM, IA Sales, funding SaaS', '#7E22CE'),
  ('Sales', 'sales', 'Outbound B2B, cold email, discovery call', '#1D4ED8'),
  ('GTM Engineering', 'gtm-engineering', 'Pipeline, stack GTM, RevOps, automation', '#15803D'),
  ('Outils', 'outils', 'Reviews, comparatifs, tutoriels', '#B45309'),
  ('Ressources', 'ressources', 'Playbooks, templates, workflows', '#3B5BDB'),
  ('Analyse', 'analyse', 'Teardowns SaaS B2B, benchmarks', '#BE123C')
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  color = excluded.color;
