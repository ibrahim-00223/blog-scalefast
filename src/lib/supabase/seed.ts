import type { Article, Category, TipTapContent } from "@/types";

const now = "2026-04-29T09:00:00.000Z";

function paragraph(text: string) {
  return { type: "paragraph", content: [{ type: "text", text }] };
}

function heading(level: number, text: string) {
  return { type: "heading", attrs: { level }, content: [{ type: "text", text }] };
}

function content(title: string, intro: string): TipTapContent {
  return {
    type: "doc",
    content: [
      paragraph(intro),
      heading(2, "Ce qui compte vraiment"),
      paragraph("Les meilleures equipes GTM simplifient les decisions et reduisent les allers-retours."),
      heading(2, "Execution"),
      paragraph("La vitesse vient d un systeme lisible, d un pilotage hebdo et d une responsabilite claire."),
      heading(2, "FAQ"),
      heading(3, "Pourquoi ce sujet est critique ?"),
      paragraph("Parce que chaque friction dans le pipeline detruit du temps commercial utile."),
      heading(3, "Que faire en premier ?"),
      paragraph("Mesurer le delai entre signal et action, puis retirer une complexite par sprint."),
      heading(2, "Conclusion"),
      paragraph(`${title} est surtout un probleme d execution continue.`),
    ],
  };
}

export const demoCategories: Category[] = [
  { id: "cat-news", name: "News", slug: "news", description: "Actualite GTM, IA Sales, funding SaaS", color: "#7E22CE", created_at: now },
  { id: "cat-sales", name: "Sales", slug: "sales", description: "Outbound B2B, cold email, discovery call", color: "#1D4ED8", created_at: now },
  { id: "cat-gtm", name: "GTM Engineering", slug: "gtm-engineering", description: "Pipeline, stack GTM, RevOps, automation", color: "#15803D", created_at: now },
  { id: "cat-outils", name: "Outils", slug: "outils", description: "Reviews, comparatifs, tutoriels", color: "#B45309", created_at: now },
  { id: "cat-ressources", name: "Ressources", slug: "ressources", description: "Playbooks, templates, workflows", color: "#3B5BDB", created_at: now },
  { id: "cat-analyse", name: "Analyse", slug: "analyse", description: "Teardowns SaaS B2B, benchmarks", color: "#BE123C", created_at: now },
];

const baseArticles = [
  ["news", "Pourquoi les equipes GTM reduisent leur stack pour aller plus vite", "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80", "2026-04-16T08:00:00.000Z", 7],
  ["sales", "Le discovery call B2B qui ouvre un vrai deal", "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80", "2026-04-12T10:00:00.000Z", 8],
  ["gtm-engineering", "Construire un pipeline GTM qui survit aux changements", "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80", "2026-04-08T09:00:00.000Z", 9],
  ["outils", "Setup minimal pour une stack outbound maintenable", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80", "2026-04-03T07:30:00.000Z", 6],
  ["ressources", "Le playbook hebdo qui aligne marketing SDR et AE", "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80", "2026-03-28T11:15:00.000Z", 7],
  ["analyse", "Ce que les meilleurs blogs SaaS B2B font avant le premier paragraphe", "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80", "2026-03-24T08:45:00.000Z", 10],
] as const;

export const demoArticles: Article[] = baseArticles.map((entry, index) => {
  const category = demoCategories.find((item) => item.slug === entry[0])!;
  const title = entry[1];
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const excerpt = `Guide pratique: ${title.toLowerCase()} pour accelerer votre execution GTM.`;

  return {
    id: `article-${index + 1}`,
    title,
    slug,
    excerpt,
    content: content(title, excerpt),
    status: "published",
    category_id: category.id,
    author_id: "00000000-0000-0000-0000-000000000001",
    brief_subject: title,
    brief_audience: "Equipes GTM B2B",
    brief_message: "Executer plus vite avec moins de friction.",
    ai_plan: null,
    ai_plan_validated_at: null,
    meta_title: `${title} | Scalefast`,
    meta_description: excerpt,
    featured_image_url: entry[2],
    og_image_url: entry[2],
    published_at: entry[3],
    scheduled_at: null,
    reading_time_minutes: entry[4],
    created_at: entry[3],
    updated_at: now,
    category,
    author: {
      id: "00000000-0000-0000-0000-000000000001",
      full_name: "Equipe Scalefast",
      role: "admin",
      avatar_url: null,
      created_at: now,
    },
  };
});
