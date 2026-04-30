export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  role: "admin" | "editor";
  avatar_url: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: TipTapContent | null;
  status: ArticleStatus;
  category_id: string | null;
  author_id: string | null;
  brief_subject: string | null;
  brief_audience: string | null;
  brief_message: string | null;
  ai_plan: AIPlan | null;
  ai_plan_validated_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  featured_image_url: string | null;
  og_image_url: string | null;
  published_at: string | null;
  scheduled_at: string | null;
  reading_time_minutes: number | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  author?: Profile;
  tags?: Tag[];
}

export type ArticleStatus =
  | "idea"
  | "plan"
  | "review"
  | "scheduled"
  | "published"
  | "archived";

export interface TipTapContent {
  type: "doc";
  content: TipTapNode[];
}

export interface TipTapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  text?: string;
  marks?: TipTapMark[];
}

export interface TipTapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface AIPlan {
  h1: string;
  angle: string;
  sections: PlanSection[];
  estimated_words: number;
  keywords: string[];
  tone: string;
}

export interface PlanSection {
  h2: string;
  description: string;
  h3s?: { title: string; description: string }[];
}

export interface ArticleAnalytics {
  id: string;
  article_id: string;
  date: string;
  sessions: number;
  pageviews: number;
  avg_time_seconds: number;
  bounce_rate: number | null;
  gsc_clicks: number;
  gsc_impressions: number;
  gsc_position: number | null;
}

export interface CategoryColors {
  bg: string;
  text: string;
  border?: string;
}

export const CATEGORY_COLORS: Record<string, CategoryColors> = {
  news: { bg: "#FDF4FF", text: "#7E22CE", border: "#E9D5FF" },
  sales: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  "gtm-engineering": { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  outils: { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
  ressources: { bg: "#EEF2FF", text: "#3B5BDB", border: "#C7D2FE" },
  analyse: { bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3" },
};

// ─── AI Pipeline types ────────────────────────────────────────────────────────

export type SSEAgentName = "keywords" | "redactor" | "validator";

export type SSEEvent =
  | { type: "pipeline_started" }
  | { type: "agent_started"; agent: SSEAgentName }
  | { type: "agent_progress"; agent: "redactor"; delta: string }
  | { type: "agent_completed"; agent: SSEAgentName; summary: string }
  | { type: "pipeline_completed"; articleId: string }
  | { type: "error"; message: string };

export interface KeywordsAgentOutput {
  primary_keyword: string;
  secondary_keywords: string[];
  angle: string;
  tone: string;
  estimated_words: number;
  h1: string;
  outline: { h2: string; h3s: string[] }[];
}

export interface ValidatorAgentOutput {
  score: number;
  issues: string[];
  suggestions: string[];
  approved: boolean;
}
