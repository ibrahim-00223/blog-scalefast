import type { Article, Category } from "@/types";

const BASE_URL = "https://scalefast.fr";

export function articleSchema(article: Article, category: Category) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.meta_description || article.excerpt,
    image: article.featured_image_url,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: {
      "@type": "Organization",
      name: "Scalefast",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Scalefast",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/icon.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${category.slug}/${article.slug}`,
    },
  };
}

export function breadcrumbSchema(category: Category, article?: Article) {
  const items = [
    { "@type": "ListItem", position: 1, name: "Blog", item: `${BASE_URL}/blog` },
    {
      "@type": "ListItem",
      position: 2,
      name: category.name,
      item: `${BASE_URL}/blog/${category.slug}`,
    },
  ];

  if (article) {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: article.title,
      item: `${BASE_URL}/blog/${category.slug}/${article.slug}`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Scalefast",
    url: BASE_URL,
    logo: `${BASE_URL}/icon.png`,
    sameAs: ["https://www.linkedin.com/company/scalefast"],
  };
}
