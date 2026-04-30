import Anthropic from "@anthropic-ai/sdk";
import type { TipTapContent } from "@/types";
import type { KeywordsAgentOutput, ValidatorAgentOutput } from "@/types";
import { markdownToTipTap } from "./tiptap-builder";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = "claude-sonnet-4-5";

// ─── Keywords Agent ───────────────────────────────────────────────────────────

/**
 * Analyses the article brief and returns an SEO keyword strategy + outline.
 * Uses Claude to produce a structured JSON output.
 */
export async function runKeywordsAgent(
  brief: { subject: string; audience: string; message: string },
  onProgress: (delta: string) => void
): Promise<KeywordsAgentOutput> {
  const prompt = `Tu es un expert SEO B2B pour Scalefast, une agence française spécialisée en GTM, RevOps et SaaS.

Analyse ce brief d'article et retourne UNIQUEMENT un objet JSON valide (pas de markdown, pas de texte autour) :

Brief :
- Sujet : ${brief.subject}
- Audience cible : ${brief.audience}
- Message clé : ${brief.message}

Retourne exactement ce JSON (remplace les valeurs) :
{
  "primary_keyword": "mot-clé principal SEO en français",
  "secondary_keywords": ["mot-clé 2", "mot-clé 3", "mot-clé 4", "mot-clé 5"],
  "angle": "angle unique et différenciant pour cet article",
  "tone": "professionnel",
  "estimated_words": 1800,
  "h1": "Titre de l'article optimisé SEO (H1)",
  "outline": [
    { "h2": "Titre section 1", "h3s": ["sous-section 1.1", "sous-section 1.2"] },
    { "h2": "Titre section 2", "h3s": ["sous-section 2.1", "sous-section 2.2"] },
    { "h2": "Titre section 3", "h3s": ["sous-section 3.1"] },
    { "h2": "Conclusion", "h3s": [] }
  ]
}

Retourne uniquement le JSON.`;

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  stream.on("text", (text: string) => onProgress(text));

  const fullText = await stream.finalText();

  const jsonMatch = fullText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Keywords agent: réponse JSON invalide.");
  }

  return JSON.parse(jsonMatch[0]) as KeywordsAgentOutput;
}

// ─── Redactor Agent ───────────────────────────────────────────────────────────

/**
 * Writes the full article in Markdown format based on the brief and keywords plan.
 * Streams text deltas via onProgress.
 */
export async function runRedactorAgent(
  input: {
    brief: { subject: string; audience: string; message: string };
    keywordsOutput: KeywordsAgentOutput;
  },
  onProgress: (delta: string) => void
): Promise<{ markdown: string; tipTapContent: TipTapContent }> {
  const outlineText = input.keywordsOutput.outline
    .map(
      (s) =>
        `## ${s.h2}${
          s.h3s.length > 0 ? "\n" + s.h3s.map((h) => `  ### ${h}`).join("\n") : ""
        }`
    )
    .join("\n\n");

  const prompt = `Tu es un rédacteur B2B senior pour Scalefast, spécialisé en GTM, RevOps et SaaS B2B.

Rédige un article complet, optimisé SEO, en français, en suivant précisément ces instructions :

**Brief :**
- Sujet : ${input.brief.subject}
- Audience : ${input.brief.audience}
- Message clé : ${input.brief.message}

**Stratégie SEO :**
- Mot-clé principal : ${input.keywordsOutput.primary_keyword}
- Mots-clés secondaires : ${input.keywordsOutput.secondary_keywords.join(", ")}
- Angle : ${input.keywordsOutput.angle}
- Ton : ${input.keywordsOutput.tone}
- Longueur cible : ${input.keywordsOutput.estimated_words} mots

**Plan à suivre :**
# ${input.keywordsOutput.h1}

${outlineText}

**Instructions de rédaction :**
- Commence directement par le titre H1 : # ${input.keywordsOutput.h1}
- Utilise Markdown : # pour H1, ## pour H2, ### pour H3
- Utilise **gras** pour les termes importants et les mots-clés
- Rédige une introduction percutante (2-3 phrases qui accrochent l'audience)
- Développe chaque section avec des exemples concrets et des données chiffrées quand c'est possible
- Intègre naturellement le mot-clé principal et les mots-clés secondaires
- Termine par un call-to-action clair orienté vers Scalefast
- N'inclus pas de code ou de tableaux Markdown complexes`;

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  stream.on("text", (text: string) => onProgress(text));

  const markdown = await stream.finalText();

  const tipTapContent = markdownToTipTap(markdown);
  return { markdown, tipTapContent };
}

// ─── Validator Agent ──────────────────────────────────────────────────────────

/**
 * Evaluates the generated article for SEO quality, structure, and readability.
 * Returns a score and actionable suggestions.
 */
export async function runValidatorAgent(
  input: {
    articleMarkdown: string;
    keywordsOutput: KeywordsAgentOutput;
  },
  onProgress: (delta: string) => void
): Promise<ValidatorAgentOutput> {
  // Limit article to 4000 chars to keep prompt within token budget
  const articlePreview = input.articleMarkdown.slice(0, 4000);

  const prompt = `Tu es un expert SEO B2B. Évalue cet article en français et retourne UNIQUEMENT un objet JSON valide.

**Paramètres SEO :**
- Mot-clé principal : ${input.keywordsOutput.primary_keyword}
- Mots-clés secondaires : ${input.keywordsOutput.secondary_keywords.join(", ")}
- Longueur cible : ${input.keywordsOutput.estimated_words} mots

**Article à évaluer :**
${articlePreview}

Retourne exactement ce JSON (remplace les valeurs) :
{
  "score": 85,
  "issues": ["problème constaté 1", "problème constaté 2"],
  "suggestions": ["amélioration suggérée 1", "amélioration suggérée 2"],
  "approved": true
}

**Critères de notation (score sur 100) :**
- Présence et densité du mot-clé principal (25 pts)
- Structure H2/H3 conforme au plan (20 pts)
- Longueur approximative atteinte (20 pts)
- Lisibilité et ton adapté à l'audience B2B (20 pts)
- Call-to-action présent en conclusion (15 pts)

approved = true si score >= 70.

Retourne uniquement le JSON.`;

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  stream.on("text", (text: string) => onProgress(text));

  const fullText = await stream.finalText();

  const jsonMatch = fullText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Validator agent: réponse JSON invalide.");
  }

  return JSON.parse(jsonMatch[0]) as ValidatorAgentOutput;
}
