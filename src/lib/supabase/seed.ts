import type { Article, Category, TipTapContent } from "@/types";

const now = "2026-04-29T09:00:00.000Z";

function p(text: string) {
  return { type: "paragraph", content: [{ type: "text", text }] };
}

function h2(text: string) {
  return { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text }] };
}

function h3(text: string) {
  return { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text }] };
}

function ul(items: string[]) {
  return {
    type: "bulletList",
    content: items.map((item) => ({
      type: "listItem",
      content: [{ type: "paragraph", content: [{ type: "text", text: item }] }],
    })),
  };
}

function ol(items: string[]) {
  return {
    type: "orderedList",
    content: items.map((item) => ({
      type: "listItem",
      content: [{ type: "paragraph", content: [{ type: "text", text: item }] }],
    })),
  };
}

function quote(text: string) {
  return {
    type: "blockquote",
    content: [{ type: "paragraph", content: [{ type: "text", text }] }],
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

const article1Content: TipTapContent = {
  type: "doc",
  content: [
    p("En 2024, l'equipe GTM moyenne utilise 12 a 18 outils differents. CRM, sequencer, enrichissement, intent data, scoring, BI... Chaque couche ajoutait de la promesse. Le resultat : des pipelines lents, des donnees fragmentees et des SDR qui passent 40 % de leur temps a synchroniser des spreadsheets plutot qu'a prospecter. En 2025, le mouvement inverse est en train de s'imposer."),
    h2("Pourquoi la stack complexe tue la vitesse GTM"),
    p("La complexite operationnelle a un cout cache : chaque outil supplementaire cree une nouvelle surface de friction. Un signal d'intent arrive dans l'outil A, doit etre enrichi dans B, pousse dans le CRM C, puis declenche une sequence dans D. A chaque etape, un risque de perte de donnee, un delai, une formation supplementaire pour les nouvelles recrues."),
    p("Les recherches de Bain & Company montrent que les entreprises avec des stacks simplifiees atteignent leurs quotas 23 % plus rapidement que leurs concurrents plus outilles. La raison est simple : moins d'outils = moins de friction = plus de temps sur les activites a haute valeur."),
    quote("La vraie metrique de votre stack n'est pas le nombre de features disponibles. C'est le temps median entre un signal d'achat et le premier contact qualifie de votre equipe."),
    h2("Les 3 patterns de simplification qui fonctionnent"),
    h3("1. La consolidation CRM-first"),
    p("Le mouvement le plus commun : tout rapatrier dans HubSpot ou Salesforce et supprimer les outils satellites. Les equipes qui reussissent cette consolidation gardent en general 3 a 4 outils core : CRM + sequencer natif, un outil d'enrichissement (Clay ou Apollo), et un outil de call intelligence (Gong ou Chorus). Point."),
    ul([
      "CRM central avec sequences natives : HubSpot Sales Hub, Salesloft ou Outreach selon le volume",
      "Enrichissement et prospection : Clay pour les workflows complexes, Apollo pour le volume simple",
      "Intelligence conversationnelle : Gong si ACV > 20k€, enregistrement basique sinon",
      "BI GTM : Tableau de bord natif CRM ou Metabase si besoin de croisements custom",
    ]),
    h3("2. La suppression des outils d'intent redondants"),
    p("Bombora, G2, 6sense, Demandbase... beaucoup d'equipes paient pour 2 ou 3 sources d'intent qui se recoupent a 70 %. L'exercice recommande : mesurer sur 90 jours le taux de conversion par source d'intent, puis garder uniquement celle avec le meilleur signal-to-noise ratio. Pour la plupart des startups B2B, une seule source d'intent bien activee surpasse trois sources mal exploitees."),
    h3("3. L'automatisation du handoff Marketing > SDR"),
    p("Le gap le plus couteux dans les organisations GTM n'est pas dans les outils mais dans les transferts. Un MQL qui attend 48h avant d'etre contacte par un SDR perd 80 % de sa valeur. Les equipes les plus performantes ont reduit ce delai a moins de 5 minutes via des workflows Zapier ou Make qui declenchent automatiquement l'affectation et la premiere sequence."),
    h2("Le framework de decision : garder ou couper ?"),
    p("Avant de couper un outil, posez ces 4 questions a votre equipe :"),
    ol([
      "Cet outil produit-il une donnee qu'aucun autre outil ne peut generer ?",
      "Quel est le temps hebdomadaire reel passe sur cet outil par utilisateur actif ?",
      "Si on le supprimait demain, quel processus serait bloque dans les 7 jours ?",
      "Le ROI mesure (pipeline influence, deals closes, temps economise) justifie-t-il le cout + la charge cognitive ?",
    ]),
    p("Si la reponse aux questions 1 et 4 est non, c'est un candidat a la suppression. Commencez par les outils avec moins de 3 utilisateurs actifs par semaine — ce sont generalement les zombies budgetaires les plus faciles a eliminer."),
    h2("Ce que les meilleures equipes GTM font differemment"),
    p("Les equipes top performers qu'on observe chez Scalefast partagent un trait commun : elles ont un 'outil champion' par fonction GTM. Un seul outil pour prospecter, un seul pour qualifier, un seul pour closer, un seul pour analyser. Pas deux. Pas 'selon les AE'. Un seul, maitrise par toute l'equipe."),
    p("Cette discipline force a vraiment exploiter les features avancees de chaque outil plutot que d'en gratter la surface sur 12 plateformes. Un SDR qui connait Clay a 80 % de ses capacites est 3x plus productif qu'un SDR qui connait vaguement 8 outils."),
    h2("FAQ"),
    h3("Combien d'outils une equipe SDR de 5 personnes devrait-elle utiliser ?"),
    p("En general, 3 a 5 outils suffisent : un CRM avec sequences, un outil d'enrichissement/prospection, un outil de call recording, et eventuellement une source d'intent si le budget le permet. Au-dela de 6 outils actifs pour une equipe de cette taille, le ROI marginal de chaque outil supplementaire devient negatif."),
    h3("Comment convaincre un CEO de couper des outils qu'il a lui-meme achetes ?"),
    p("Presentez des donnees d'usage reel, pas des opinions. Exportez les logs de connexion des 90 derniers jours, calculez le cout par utilisateur actif, et montrez l'equivalence en temps SDR. Un outil a 800€/mois avec 2 utilisateurs actifs = 400€ par utilisateur, soit probablement plus que le cout d'une heure de prospection humaine qualifiee."),
    h3("Quels outils ne faut-il surtout pas couper meme en periode de reduction de couts ?"),
    p("Le CRM est intouchable — c'est la memoire de votre pipeline. L'outil de call intelligence si vous avez des deals > 15k€ ACV, parce que c'est votre seule source de verite sur ce qui se dit vraiment dans les deals. Et l'outil d'enrichissement si votre prospection outbound est un canal principal."),
    h2("Conclusion"),
    p("La simplification de stack n'est pas une tendance d'economie budgetaire. C'est un avantage competitif. Les equipes GTM qui auront gagne en 2026 ne seront pas celles qui auront le plus d'outils, mais celles qui auront la meilleure execution sur les outils qu'elles maitrisent vraiment. Auditez votre stack ce mois-ci. Chaque outil superflu est un frein cache a votre vitesse d'execution."),
  ],
};

const article2Content: TipTapContent = {
  type: "doc",
  content: [
    p("La plupart des discovery calls B2B echouent avant meme d'avoir commence. Le SDR arrive avec une liste de questions standardisees, le prospect repond en mode automatique, et les deux repartent sans avoir vraiment compris l'essentiel : est-ce que ce deal peut se faire, et si oui, pourquoi maintenant ? Voici comment structurer un discovery call qui cree reellement de la valeur pour les deux parties."),
    h2("L'erreur fondamentale : le discovery comme interrogatoire"),
    p("La majorite des formations sales enseignent des listes de questions BANT (Budget, Authority, Need, Timeline) ou MEDDIC comme si le discovery etait un formulaire a remplir. Le probleme : un prospect intelligent detecte immediatement quand il est 'qualifie' plutot qu'ecoute. Le resultat est une conversation de surface qui ne revele rien de la vraie douleur."),
    p("Les meilleurs closers que nous coachons font l'inverse : ils arrivent avec un point de vue sur le business du prospect, posent 2-3 questions ouvertes structurantes, et laissent l'essentiel de la conversation entre les mains du prospect. Leur role : ecouter, reformuler, approfondir."),
    quote("Un bon discovery call n'est pas celui ou vous avez pose le plus de questions. C'est celui ou le prospect vous a dit quelque chose qu'il n'avait jamais dit a voix haute."),
    h2("La structure en 5 phases qui fonctionne"),
    h3("Phase 1 : L'ancrage (5 minutes)"),
    p("Commencez par poser le cadre, pas par vous presenter. 'Voila ce qu'on va faire ensemble aujourd'hui : je vais vous poser quelques questions sur votre situation actuelle, vous pouvez m'interrompre et me questionner a tout moment, et si on voit une opportunite reelle d'aller plus loin ensemble, on verra comment ca peut se presenter. Est-ce que ca vous convient ?' Ce cadrage simple transfere le pouvoir de la conversation et reduit la defensive du prospect."),
    h3("Phase 2 : La situation actuelle (10 minutes)"),
    p("L'objectif ici n'est pas de collecter des donnees mais de comprendre le contexte dans lequel opere votre interlocuteur. Questions structurantes :"),
    ul([
      "Comment est structuree votre equipe commerciale aujourd'hui, et comment ca a evolue sur les 18 derniers mois ?",
      "Qu'est-ce qui drive principalement votre pipeline en ce moment — inbound, outbound, partenaires, evenements ?",
      "Quels sont les 2-3 projets prioritaires de votre direction pour les 6 prochains mois ?",
    ]),
    p("Ces questions ne parlent pas encore de votre produit. Elles dessinent la carte du terrain dans lequel vous allez proposer votre solution."),
    h3("Phase 3 : La douleur reelle (15 minutes)"),
    p("C'est le coeur du discovery. La plupart des prospects articulen une douleur de surface ('on n'a pas assez de leads') qui cache une douleur plus profonde ('notre taux de conversion MQL-to-SQL est a 8 % et personne ne comprend pourquoi'). Votre job : creuser jusqu'a la douleur qui justifie un changement urgent."),
    ul([
      "Qu'est-ce qui vous a fait accepter ce call aujourd'hui — il devait y avoir une raison ?",
      "Si on imagine que dans 12 mois rien n'a change sur ce sujet, qu'est-ce qui se passe concretement pour vous ?",
      "Qu'avez-vous deja essaye pour resoudre ce probleme, et pourquoi ca n'a pas suffi ?",
    ]),
    p("La troisieme question est particulierement puissante : elle revele les tentatives precedentes, les contraintes organisationnelles, et les biais de solution deja formes chez le prospect."),
    h3("Phase 4 : L'impact et les enjeux (10 minutes)"),
    p("Une douleur sans impact quantifie est difficile a budgeter. Aidez le prospect a chiffrer lui-meme l'enjeu. 'Si votre taux de conversion passait de 8 % a 15 % sur votre volume actuel de MQL, qu'est-ce que ca representerait en pipeline supplementaire sur un trimestre ?' Laissez le prospect faire le calcul — il sera bien plus convaincu par son propre chiffre que par le votre."),
    h3("Phase 5 : La prochaine etape concreteConcrète (5 minutes)"),
    p("Ne terminez jamais un discovery call sans une prochaine etape datee et qualifiee. 'La prochaine etape logique serait de vous presenter notre approche sur votre cas specifique avec les bons interlocuteurs de votre cote. Qui faudrait-il avoir dans la salle pour que ca soit utile ?' Cette question revele le processus de decision et identifie les champions potentiels."),
    h2("Les 5 signaux qui indiquent un deal serieux"),
    p("Apres des centaines de discovery calls analyses chez nos clients, voici les signaux predictifs les plus fiables d'un deal qui avancera :"),
    ul([
      "Le prospect mentionne un evenement declencheur recent (fusion, nouvelle direction, objectif rate, budget debloque)",
      "Il peut chiffrer l'impact du probleme sans que vous le poussiez",
      "Il nomme spontanement d'autres personnes impactees dans son organisation",
      "Il pose des questions sur votre implementation ou votre onboarding (pas seulement sur le prix)",
      "Il accepte de bloquer du temps pour la prochaine etape avant meme la fin de l'appel",
    ]),
    h2("Ce qu'il ne faut jamais faire pendant un discovery"),
    p("Evitez ces erreurs qui tuent les deals avant qu'ils commencent :"),
    ul([
      "Pitcher votre solution avant d'avoir compris le probleme — le prospect se ferme immediatement",
      "Accepter 'on verra' comme prochaine etape — c'est la mort douce du deal",
      "Poser deux questions en meme temps — le prospect repond a la plus simple et vous perdez la profonde",
      "Interrompre un silence — les meilleurs insights emergent souvent apres 5 secondes de silence",
      "Omettre de confirmer le budget et l'autorite de decision avant la fin du premier call",
    ]),
    h2("FAQ"),
    h3("Combien de temps devrait durer un premier discovery call ?"),
    p("Entre 30 et 45 minutes pour la plupart des deals B2B SaaS. En dessous de 30 minutes, vous ne pouvez pas creuser suffisamment la douleur. Au-dela de 60 minutes, l'energie baisse et le prospect commence a sentir qu'il est en train de passer un entretien. Les 45 minutes sont l'ideal : assez de temps pour aller en profondeur, assez court pour rester intense."),
    h3("Comment gerer un prospect qui ne veut pas repondre aux questions ?"),
    p("C'est souvent le signe d'un manque de confiance ou d'une attente non satisfaite. Revenez au cadrage : 'J'ai l'impression que vous attendiez peut-etre quelque chose de different de cet appel — est-ce que je peux vous demander ce qui vous serait le plus utile aujourd'hui ?' Cette question reset la dynamique et revele souvent ce que le prospect veut vraiment."),
    h3("Doit-on envoyer un agenda avant le call ?"),
    p("Oui, mais un agenda minimaliste. Pas une liste de 15 questions. Envoyez juste : l'objectif du call (comprendre votre situation et voir si on peut vous aider), la structure (votre situation, vos enjeux, prochaines etapes), et la duree. Cela professionnalise l'interaction sans rigidifier la conversation."),
    h2("Conclusion"),
    p("Un discovery call reussi n'est pas celui ou vous avez valide votre checklist BANT. C'est celui ou le prospect a articule sa douleur profonde, compris l'impact de ne pas agir, et choisi de vous faire confiance pour la prochaine etape. C'est une competence qui se travaille : enregistrez vos calls, ecoutez les 10 premieres minutes, et demandez-vous combien de temps vous avez parle versus ecoute. Si c'est plus de 40 %, vous pitchez trop tot."),
  ],
};

const article3Content: TipTapContent = {
  type: "doc",
  content: [
    p("La plupart des pipelines GTM sont construits pour le contexte du moment : la taille d'equipe actuelle, la cible ICP du trimestre, les outils choisis ce mois-ci. Six mois plus tard, l'equipe a double, l'ICP a change, deux outils ont ete remplace — et le pipeline ressemble a un Frankenstein incoherent. Comment construire une architecture GTM qui tient dans le temps ?"),
    h2("Les 4 raisons pour lesquelles les pipelines s'effondrent"),
    p("Avant de construire, il faut comprendre pourquoi la plupart des pipelines ne survivent pas a 18 mois d'execution :"),
    ul([
      "Dependance aux personnes : le pipeline repose sur la memoire d'un RevOps ou d'un SDR senior qui finit par partir",
      "Logique hard-codee : les regles de routage et de scoring sont dans le CRM sans documentation, impossibles a auditer",
      "Manque de feedback loops : personne ne sait si les signaux d'entree du pipeline predisent encore les deals closes",
      "Outils-first : le pipeline a ete construit autour des features d'un outil specifique plutot qu'autour du parcours acheteur",
    ]),
    h2("Le principe de separation : signaux, logique, execution"),
    p("Le framework le plus robuste que nous avons implemente chez nos clients GTM repose sur une separation stricte en trois couches :"),
    h3("Couche 1 : Les signaux"),
    p("Tous les signaux entrants (visite site, intent data, engagement email, demande demo, fin de trial...) sont centralises dans un seul endroit avant d'etre traites. En pratique, c'est souvent un webhook Supabase ou une table Segment qui collecte tous les events. L'avantage : quand vous changez d'outil de capture, la logique aval ne bouge pas."),
    h3("Couche 2 : La logique"),
    p("Le scoring, le routing, les regles de qualification sont dans du code ou des workflows explicites et documentes, pas dans des regles CRM imbriquees. Clay et n8n sont excellents pour ca : les workflows sont lisibles, versionnables, et compris par toute l'equipe sans etre dans la tete d'un seul admin Salesforce."),
    h3("Couche 3 : L'execution"),
    p("Les sequences, les taches SDR, les notifications Slack — tout ce qui est visible et actionnable pour les equipes commerciales. Cette couche peut changer sans toucher aux couches 1 et 2. Vous pouvez migrer de Outreach a Salesloft sans revoir votre logique de scoring."),
    h2("Les 5 composants d'un pipeline resilient"),
    h3("1. Un ICP document et maintenu"),
    p("L'ICP doit etre un document vivant, pas un slide de deck de fundraising. Il doit inclure : les signaux d'entree qui predisent les deals closes (pas les deals signes, les deals fermes-gagne), les titres et niveaux de seniority qui apparaissent systematiquement dans les deals > 6 mois de retention, et les exclusions explicites (secteurs, tailles, cas d'usage qui closent mais churne a 6 mois)."),
    h3("2. Un modele de scoring evolutif"),
    p("Votre scoring d'il y a 6 mois est probablement faux aujourd'hui. Les signaux predictifs changent avec votre produit, votre marche et votre equipe. Instaurez une review trimestrielle du modele de scoring : comparez les scores assigns aux leads 90 jours avant closing avec le resultat final (gagne, perdu, fantome). Ajustez les poids en consequence."),
    h3("3. Des SLA inter-equipes ecrits"),
    p("La vitesse de votre pipeline est determinee par son maillon le plus lent. Documentez et trackez :"),
    ul([
      "Marketing > SDR : delai max entre MQL et premier contact (cible : < 5 min pour les hot leads)",
      "SDR > AE : delai max entre SQL et premier call AE (cible : < 24h)",
      "AE > Closing : duree maximale d'un deal en phase de negociation avant escalade (cible : selon ACV)",
    ]),
    h3("4. Un systeme de detection de stagnation"),
    p("Chaque deal qui reste plus longtemps que votre cycle de vente median dans une stage donnee est un signal d'alarme. Automatisez les alertes : si un deal est en 'Proposal Sent' depuis > 14 jours sans activite, une tache est cree automatiquement pour l'AE et son manager est notifie. Ces alertes proactives sauvent 15 a 20 % des deals qui seraient autrement tombes dans l'oubli."),
    h3("5. Une documentation du pipeline accessible a tous"),
    p("Le RevOps ne devrait pas etre le seul a comprendre comment le pipeline fonctionne. Chaque SDR doit savoir pourquoi un lead lui a ete affecte, chaque AE doit comprendre le scoring d'entree de son deal. Cette transparence cree une culture data qui permet a chacun d'ameliorer le systeme plutot que de le subir."),
    h2("Migration sans interruption : comment changer un pipeline en cours d'execution"),
    p("La partie la plus delicate : faire evoluer le pipeline sans stopper l'execution. Notre approche en 4 phases :"),
    ol([
      "Shadow mode : faire tourner la nouvelle logique en parallele de l'ancienne pendant 2 semaines sans l'activer — comparez les sorties",
      "Pilot sur un segment : appliquer la nouvelle logique sur 20 % du volume entrant (ex: un marche geo ou une taille d'entreprise specifique)",
      "Mesure et ajustement : apres 30 jours, comparer les taux de conversion du segment pilot vs le reste",
      "Bascule progressive : migrer 50 %, puis 100 % uniquement si les metriques du pilot sont superieures ou equivalentes",
    ]),
    h2("FAQ"),
    h3("A quelle frequence faut-il auditer son pipeline GTM ?"),
    p("Un audit leger (metriques de conversion par stage, SLA tenus, qualite des donnees CRM) chaque mois. Un audit profond (modele de scoring, definition ICP, logique de routing) chaque trimestre. Un audit strategique (architecture globale, adequation stack/volume) une fois par an ou lors de changements majeurs : nouveau produit, nouveau marche, doublement de l'equipe."),
    h3("Quel CRM est le plus adapte pour un pipeline qui doit scaler ?"),
    p("Il n'y a pas de reponse universelle. HubSpot excelle pour les equipes < 30 commerciaux avec des processus relativement standards. Salesforce devient pertinent au-dela, avec des besoins de customisation complexes ou des integrations enterprise. Ce qui compte plus que le CRM : la discipline de saisie des donnees et la gouvernance des regles d'attribution."),
    h3("Comment gerer les leads qui ne correspondent plus a l'ICP actuel mais qui sont deja dans le pipeline ?"),
    p("Ne les supprimez pas, archivez-les avec un tag specifique. Reactivez-les lors de campagnes de nurturing legeres (1 email par mois maximum). Dans 10 a 15 % des cas, une evolution de leur contexte (levee de fonds, changement de direction, croissance rapide) les remettra dans une fenetre d'achat."),
    h2("Conclusion"),
    p("Un pipeline GTM robuste n'est pas celui qui fonctionne aujourd'hui. C'est celui qui peut absorber une nouvelle ICP, un doublement d'equipe, ou une migration d'outil sans repartir de zero. Investissez dans la separation des couches, la documentation explicite, et les feedback loops trimestriels. C'est un investissement de 2 a 3 sprints qui vous economise 6 mois de reconstruction dans 18 mois."),
  ],
};

const article4Content: TipTapContent = {
  type: "doc",
  content: [
    p("L'equipement d'une equipe outbound B2B est devenu une obsession pour beaucoup de directeurs commerciaux. Chaque trimestre, un nouvel outil promet de resoudre les problemes de deliverabilite, d'enrichissement ou de personnalisation. Le resultat : des stacks a 15 000€/mois qui underperforment par rapport a des setups minimalistes a 2 000€/mois bien executes. Voici le setup qu'on recommande chez Scalefast."),
    h2("Le principe du setup minimal"),
    p("Un setup minimal ne signifie pas un setup pauvre. Il signifie un setup ou chaque outil a une mission unique, claire, et non redondante avec les autres. L'objectif est d'avoir la surface la plus petite possible pour generer le volume et la qualite dont vous avez besoin — et de pouvoir onboarder un nouveau SDR en moins d'une journee."),
    quote("La complexite de votre stack outbound est inversement proportionnelle a la vitesse d'execution de vos SDR."),
    h2("Les 5 outils du setup minimal recommande"),
    h3("1. CRM : HubSpot Sales Hub Starter ou Pro"),
    p("Pour la plupart des equipes outbound B2B jusqu'a 20 commerciaux, HubSpot couvre 90 % des besoins : sequences email, tracking d'ouvertures, taches de follow-up, pipeline deals, et integrations natives avec les autres outils du stack. Evitez Salesforce tant que vous n'avez pas de besoins specifiques de customisation enterprise — le cout de configuration et de maintenance est disproportionne pour une equipe en croissance."),
    p("Cout : 90-500€/mois selon la taille de l'equipe et la tier choisie."),
    h3("2. Enrichissement et prospection : Clay"),
    p("Clay a change la donne pour les equipes outbound en 2024-2025. C'est un spreadsheet intelligent qui aggregate 50+ sources de donnees (LinkedIn, Apollo, Clearbit, Hunter, News APIs...) pour enrichir automatiquement vos listes de prospects. Ce qui prenait 3h a un SDR (rechercher une entreprise, trouver les bons contacts, enrichir les emails, verifier les informations) prend maintenant 3 minutes."),
    ul([
      "Recherche ICP au-dela de LinkedIn Sales Navigator avec des filtres custom (techno utilisee, financement recent, offres d'emploi publiees)",
      "Enrichissement automatique : email pro, numero direct, profil LinkedIn, actualite recente de l'entreprise",
      "Personnalisation a l'echelle : generation de snippets de personalisation via GPT-4 integre, bases sur les donnees enrichies",
      "Waterfall de verification d'email : teste successivement 8 fournisseurs pour maximiser le taux de deliverabilite",
    ]),
    p("Cout : 149-800€/mois selon le volume. ROI immediat sur le temps SDR economise."),
    h3("3. Sequencer email : Instantly ou Lemlist"),
    p("Pour les volumes outbound (> 100 emails/jour par SDR), les sequencers natifs CRM ne suffisent plus. Instantly est devenu la reference pour les equipes qui font du volume avec une obsession deliverabilite : rotation automatique des boites d'envoi, warmup integre, et un dashboard de monitoring des taux d'ouverture et de reponse par campagne."),
    p("Lemlist reste pertinent si vous faites des campagnes multicanal (email + LinkedIn + cold calling) avec un volume plus modere et un besoin de personnalisation visuelle forte (images personnalisees dans les emails)."),
    p("Cout : 97-400€/mois. Budget 3-4 adresses email par SDR pour la rotation."),
    h3("4. Infrastructure email : Google Workspace + domaines secondaires"),
    p("La partie la plus negligee et pourtant la plus critique : votre infrastructure d'envoi. Regles absolues :"),
    ul([
      "Ne jamais envoyer de cold outbound depuis votre domaine principal — un blacklistage detruirait votre email transactionnel et marketing",
      "Creer 2-3 domaines secondaires semantiquement proches de votre domaine principal (ex: getscalefast.com, scalefast-sales.com)",
      "Warmup systematique sur 4-6 semaines avant d'utiliser une nouvelle boite d'envoi",
      "Limiter a 30-40 emails froids par jour par adresse d'envoi — au-dela, les taux de spam augmentent exponentiellement",
    ]),
    p("Cout : 12€/mois par boite Google Workspace + ~15€/an par domaine secondaire. Investissement minimal pour proteger votre deliverabilite."),
    h3("5. Tracking et analytics : tableau de bord CRM + Metabase (optionnel)"),
    p("Avant d'ajouter une couche BI supplementaire, exploitez a fond les rapports natifs de votre CRM. HubSpot couvre la plupart des besoins : taux de reponse par sequence, pipeline par SDR, conversion par source. N'ajoutez Metabase ou Looker que si vous avez des besoins de croisement de donnees que votre CRM ne peut pas satisfaire nativement."),
    h2("Ce que vous n'avez probablement pas besoin d'acheter"),
    p("Outils frequemment sur-achetes par les equipes outbound B2B :"),
    ul([
      "LinkedIn Sales Navigator Premium + Apollo + Hunter : Apollo couvre 80 % des besoins de Sales Nav pour 1/5e du prix",
      "Bombora ou 6sense intent data : pertinent uniquement si vous avez le volume et le processus pour activer les signaux. La plupart des equipes < 50 personnes n'ont pas la bande passante pour l'exploiter correctement",
      "Outreach ou Salesloft si vous avez < 10 AE : trop complexes et trop chers pour des equipes early-stage",
      "Des outils de 'AI personalization' en plus de Clay : Clay fait deja ca tres bien nativement",
    ]),
    h2("Comment evaluer si un nouvel outil en vaut le cout"),
    p("Avant d'acheter, appliquez ce test en 3 questions :"),
    ol([
      "Quel probleme specifique resout cet outil que les outils deja en place ne peuvent pas resoudre ?",
      "Quel est le temps d'integration et d'adoption realiste pour mon equipe (pas la promesse du vendor) ?",
      "Si je mesurais le ROI de cet outil sur 90 jours, quelle metrique regarderais-je et quelle valeur devrais-je voir pour le garder ?",
    ]),
    p("Si vous ne pouvez pas repondre clairement a la question 3 avant d'acheter, ne l'achetez pas."),
    h2("FAQ"),
    h3("Quel budget prevoir pour une equipe de 3 SDR ?"),
    p("Un setup minimal efficace pour 3 SDR : HubSpot Starter (90€), Clay Pro (400€), Instantly Pro (200€), 9 boites Gmail Workspace (108€), 3 domaines secondaires (5€). Total : environ 800€/mois, soit 267€ par SDR. C'est nettement inferieur aux 600-1200€ par SDR que beaucoup d'equipes depensent avec des stacks gonflees."),
    h3("Faut-il utiliser LinkedIn Sales Navigator ?"),
    p("LinkedIn Sales Navigator reste utile pour les AE qui font du social selling actif et du suivi de comptes strategiques. Pour la prospection a volume des SDR, Clay aggregate deja les donnees LinkedIn sans necessite de licence Sales Nav par SDR. Economie potentielle : 1 000-2 000€/mois pour une equipe de 5 SDR."),
    h3("Comment gerer les problemes de deliverabilite des emails froids ?"),
    p("En 2025, la deliverabilite des cold emails est un enjeu majeur. Les 4 actions qui font 80 % du travail : setup SPF/DKIM/DMARC sur tous vos domaines d'envoi, warmup obligatoire de 4-6 semaines sur chaque nouvelle boite, verification systematique des emails avant envoi (Clay ou NeverBounce), et taux de spam target < 0.1 % (surveille via Google Postmaster Tools)."),
    h2("Conclusion"),
    p("Le meilleur setup outbound n'est pas le plus sophistique. C'est celui que votre equipe execute de maniere consistante, dont les donnees sont fiables, et que vous pouvez faire evoluer sans tout reconstruire. Commencez minimal, mesurez ce qui fonctionne, et ajoutez de la complexite uniquement quand vous avez atteint les limites du setup actuel — pas avant."),
  ],
};

const article5Content: TipTapContent = {
  type: "doc",
  content: [
    p("L'alignement entre marketing, SDR et AE est le probleme numero un des organisations GTM B2B en croissance. Chaque equipe a ses propres metriques, ses propres priorites, ses propres definitions du succes — et le resultat est un pipeline ou les leads tombent dans les failles organisationnelles. Un playbook hebdo bien structure resout ce probleme en 90 minutes par semaine."),
    h2("Pourquoi l'alignement GTM est si difficile a maintenir"),
    p("Le probleme n'est pas un manque de bonne volonte. C'est structural. Marketing est evalue sur le volume de MQL, les SDR sur le nombre de SQL et de meetings, les AE sur le pipeline closed-won. Ces metriques individuelles peuvent toutes etre vertes pendant que le pipeline global est rouge."),
    p("Exemple reel chez un client SaaS B2B en Serie A : marketing generait 300 MQL/mois (objectif atteint), les SDR convertissaient 12 % en SQL (objectif atteint), mais les AE closaient seulement 8 % des SQLs (objectif rate). Le diagnostic apres audit : les definitions de MQL et SQL n'avaient jamais ete alignees. Les SDR passaient des leads qui n'etaient pas prets a acheter, les AE perdaient du temps sur des deals non-qualifies."),
    quote("Le vrai indicateur de sante d'un pipeline GTM n'est pas le MQL ou le SQL. C'est le taux de conversion SQL-to-Close, mesure par cohorte sur 90 jours."),
    h2("La structure du playbook hebdo"),
    h3("Lundi matin : la revue pipeline (30 min)"),
    p("Qui : RevOps + responsable SDR + 1 AE representatif. Objectif : identifier les blocages, les deals en stagnation, et les signals d'alerte avant qu'ils deviennent des problemes. Agenda type :"),
    ul([
      "Revue des deals > age median de vente par stage (5 min) : lister les deals qui stagnent, affecter une action concrete",
      "Analyse des MQL de la semaine precedente (5 min) : taux de contact, taux de qualification, retours qualitatifs des SDR sur la qualite des leads",
      "Forecast rapide : gap vs objectif du mois, actions correctrices si necessaire",
      "Blocages SDR : lead non-contactable, objection nouvelle, segment difficile — escalade si necessaire",
    ]),
    h3("Mercredi : le debrief content-to-pipeline (20 min)"),
    p("Qui : marketing + 1-2 SDR. Objectif : creer une boucle de feedback entre ce que marketing produit et ce que les SDR vivent dans leurs conversations. Questions cles :"),
    ul([
      "Quelles objections les SDR entendent-ils le plus cette semaine ?",
      "Quels contenus les prospects mentionnent-ils (webinaires, articles, cas clients) ?",
      "Quels messaging testent les SDR qui fonctionnent (ou pas) ?",
    ]),
    p("Ce debrief de 20 minutes informe directement les priorites editoriales et messaging de la semaine suivante. Marketing arrete de creer du contenu dans le vide."),
    h3("Vendredi : le win/loss review (40 min, bimensuel)"),
    p("Tous les 15 jours, analysez en profondeur 3 deals closes-gagnes et 3 deals closes-perdus de la periode. Ce rituel est le plus neglige et le plus precieux. Il revele :"),
    ul([
      "Pourquoi les deals qu'on pense avoir closes sont reellement closes (souvent differents de ce qu'on pense)",
      "Les vraies raisons de perte (pas 'trop cher' — ca, c'est rarement la vraie raison)",
      "Les patterns ICP qui emergen dans les wins vs les losses",
      "Les sequences et messages qui ont cree de l'engagement vs ceux qui ont genere du silence",
    ]),
    h2("Les metriques de l'alignement GTM : ce qu'il faut tracker"),
    p("Plutot qu'une dashboard de 40 metriques que personne ne lit, concentrez-vous sur ces 7 indicateurs cles :"),
    ul([
      "Taux de MQL-to-SQL : si < 20 %, probleme de qualite des leads marketing ou de definition du MQL",
      "Delai MQL-to-first-contact : si > 2h pour les hot leads, probleme de process SDR ou de volume",
      "Taux de SQL-to-meeting-booked : si < 30 %, probleme de qualification SDR ou de pitch",
      "Taux de meeting-to-opportunity : si < 60 %, les meetings ne sont pas avec les bons interlocuteurs",
      "Taux de opportunity-to-close : benchmark de 20-25 % pour un SaaS B2B mid-market",
      "Age median par stage : identifier les stages ou les deals meurent le plus souvent",
      "Win rate par source de lead : quelle source genere les deals qui closent le mieux ?",
    ]),
    h2("Comment lancer le playbook sans resistance organisationnelle"),
    p("La principale resistance a l'alignement GTM vient des managers qui voient ces rituels comme du temps pris sur l'execution. Voici comment contourner ca :"),
    ol([
      "Commencez sans forcer : lancez le playbook avec seulement les volontaires (souvent 1-2 personnes de chaque equipe) pendant 4 semaines",
      "Montrez les resultats concrets apres le premier mois : metriques ameliorees, deals debloques, feedbacks qualitatifs",
      "Invitez les sceptiques a observer une seance avant de les forcer a participer",
      "Nommez un 'champion' de l'alignement dans chaque equipe — ce n'est pas necessairement le manager",
    ]),
    h2("Template de compte-rendu hebdo"),
    p("Envoyez un resume de 5 lignes maximum apres chaque revue pipeline du lundi. Format recommande :"),
    ul([
      "Pipe semaine : [X] nouveaux MQL / [Y] SQL generes / [Z] meetings bookes",
      "Deals en alerte : [liste des deals qui stagnent avec action et owner]",
      "Signal marketing cette semaine : [campagne, contenu, evenement qui a genere de l'engagement]",
      "Objectif de la semaine : [une action concrete par equipe pour avancer le pipe]",
      "Metric de la semaine : [une seule metrique a ameliorer, partout visible]",
    ]),
    h2("FAQ"),
    h3("Comment gerer les conflits entre marketing et sales sur la qualite des leads ?"),
    p("La source de conflit numero un en GTM. La solution : co-definir la definition du MQL ensemble, avec des criteres objectifs et mesurables (titre, taille entreprise, engagement minimal, etc.) et la reviser ensemble chaque trimestre. Marketing s'engage sur la qualite, pas seulement le volume. Sales s'engage a un SLA de contact et un feedback systematique sur la qualite percue."),
    h3("Que faire si les SDR ne donnent pas de feedback sur les leads ?"),
    p("Le feedback ne vient pas naturellement — il faut le structurer. Implementez un systeme de disposition sur chaque lead contacte : 'Qualifie', 'Pas le bon moment', 'Pas l'ICP', 'Non-contactable', 'Concurrent'. Ces dispositions alimentent automatiquement le reporting marketing sans demander aux SDR de rediger des commentaires."),
    h3("Ce playbook fonctionne-t-il pour des equipes distribuees ou en remote ?"),
    p("Absolument — souvent mieux qu'en presentiel parce que les rituels asynchrones (compte-rendu ecrit, dashboard partage) compensent le manque de visibilite spontanee d'un bureau commun. L'essentiel : des outils partages accessibles en temps reel par toutes les equipes, et une culture de documentation des decisions plutot que de les garder dans les tetes."),
    h2("Conclusion"),
    p("L'alignement GTM n'est pas un projet ponctuel. C'est un systeme de rituels reguliers qui maintiennent la coherence entre des equipes avec des incentives naturellement differents. Le playbook hebdo decrit ici prend 90 minutes par semaine. Ce qu'il vous evite : des semaines de travail perdues sur des leads qui ne convertiront jamais, des tensions entre equipes qui se rejettent la faute, et des fins de trimestre en panique. 90 minutes par semaine pour ca, c'est le meilleur ROI de votre calendrier."),
  ],
};

const article6Content: TipTapContent = {
  type: "doc",
  content: [
    p("Il y a une difference radicale entre les blogs SaaS B2B qui generent du pipeline — des leads qualifies, des demandes de demo, des conversations commerciales — et ceux qui generent du trafic sans conversion. Cette difference n'est pas dans la qualite de l'ecriture ou la frequence de publication. Elle se joue avant le premier paragraphe, dans des decisions strategiques que la plupart des equipess ne prennent jamais explicitement."),
    h2("La hierarchie des decisions : ce qui se passe avant d'ecrire"),
    p("Analyser les 50 meilleurs blogs SaaS B2B de ces 3 dernieres annees (Intercom, HubSpot, Gong, Drift, Notion, Loom, Superhuman...) revele un pattern constant : chaque article performant repose sur au moins 3 decisions explicites qui precede la redaction."),
    h3("Decision 1 : L'intention de recherche cible"),
    p("Les blogs qui convertissent ne ciblent pas des mots-cles. Ils ciblent des intentions de recherche precises dans un parcours d'achat defini. Un article sur 'comment creer un pipeline commercial' cible une intention de decouverte generale. Un article sur 'comment calculer le taux de conversion SQL-to-close dans HubSpot' cible une intention precise d'un professionnel qui gere activement ce probleme."),
    p("La regle : plus l'intention est specifique et situee dans un contexte d'execution, plus le taux de conversion du trafic est eleve. L'audience est plus petite, mais elle est en train de resoudre exactement le probleme que vous pouvez resoudre."),
    h3("Decision 2 : La personne et le moment du parcours"),
    p("Les meilleurs blogs SaaS B2B segmentent leur contenu par persona ET par moment du parcours acheteur. Un article pour un SDR en debut de carriere et un article pour un VP Sales en evaluation d'outils ne s'ecrivent pas pareil, ne se referencing pas pareil, et ne convertissent pas pareil."),
    p("Le cadre en 3 moments :"),
    ul([
      "Awareness : le lecteur realise qu'il a un probleme ou une opportunite. Contenu : analyses de tendances, benchmarks, 'pourquoi X est devenu critique'",
      "Consideration : le lecteur cherche des approches pour resoudre son probleme. Contenu : frameworks, comparatifs, methodes etape par etape",
      "Decision : le lecteur evalue des solutions specifiques. Contenu : cas clients, comparatifs directs, ROI calculateurs, demos interactives",
    ]),
    h3("Decision 3 : L'angle differentiel"),
    p("Chaque sujet a deja ete traite des dizaines de fois. Ce qui distingue le blog Gong du blog de consulting generique sur les memes sujets : un angle proprietaire. Gong publie des insights bases sur leur analyse de millions de calls de vente enregistres. Intercom parle du product-led growth depuis leur experience directe de l'avoir applique. Drift a construit son autorite sur le conversational marketing qu'ils ont conceptualise."),
    quote("L'angle differentiel d'un article doit repondre a la question : pourquoi serait-ce cette equipe specifique qui ecrit cet article plutot que n'importe qui d'autre ?"),
    h2("L'architecture SEO qui precede la redaction"),
    h3("La recherche semantique au-dela des mots-cles"),
    p("Les outils de keyword research montrent le volume de recherche. Ce qu'ils ne montrent pas : les questions satellites, les formulations alternatives, les termes que votre audience utilise dans les conversations reelles mais pas dans les recherches Google. Les meilleures equipes content extraient ces insights de 3 sources :"),
    ul([
      "Transcriptions de calls de vente et de CSM : termes exacts utilises par les prospects pour decrire leurs problemes",
      "Forums et communautes (Slack communities, LinkedIn, Reddit r/sales, r/B2Bmarketing) : les vraies questions posees sans filtre marketing",
      "Suivi des recherches internes sur leur propre site : ce que les visiteurs cherchent quand ils sont deja sur votre blog",
    ]),
    h3("La structure de contenu comme signal SEO"),
    p("Les meilleurs blogs SaaS B2B structurent leurs articles pour correspondre a la facon dont Google comprend la completude d'une reponse. Ca implique :"),
    ul([
      "Couvrir toutes les sous-questions que Google identifie comme liees a la question principale (visible dans le 'People Also Ask')",
      "Inclure des definitions explicites des termes techniques pour les snippets featurs",
      "Structurer les listes et tableaux pour faciliter l'extraction des donnees structurees",
      "Ajouter une section FAQ qui capture les requetes conversationnelles longue traine",
    ]),
    h2("L'EEAT avant la redaction : ce qui credibilise le contenu"),
    p("Depuis les mises a jour Google de 2022-2024, l'Experience, l'Expertise, l'Autorite et la Fiabilite (EEAT) sont des signaux de ranking directs. Ce qui distingue un article avec fort EEAT :"),
    h3("L'experience proprietary"),
    p("Les articles les plus performants citent des donnees internes (analyses de X deals, etudes sur Y clients, benchmarks propres) que personne d'autre ne peut avoir. Un blog SaaS B2B qui n'exploite pas ses propres donnees clients passe a cote de sa principale source d'avantage competitif editorial."),
    h3("La signature d'expert"),
    p("Les Google Quality Raters verifieront l'auteur et son expertise reelle. Un article signe par un VP Sales avec 15 ans d'experience et un LinkedIn public avec des recommandations concretes sera mieux evalue qu'un article generique signe 'The Team'. Investissez dans les pages auteurs et les bylines verifiables."),
    h3("Les sources primaires"),
    p("Citez des etudes, des donnees, des rapports — et privilegiez les sources primaires (votre propre recherche, des etudes academiques, des rapports d'analystes) aux articles secondaires. Chaque lien externe vers une source credible renforce votre EEAT."),
    h2("La distribution : ce que les meilleurs font differemment"),
    p("Un article publie sans distribution ne genere pas de trafic, meme avec le meilleur SEO au monde dans les premieres semaines. Les blogs SaaS B2B les plus performants ont une strategie de distribution systematique :"),
    ul([
      "Distribution SDR : transformer les insights cles de l'article en cold email snippets et sequences LinkedIn",
      "Atomisation : decouper l'article en 5-7 posts LinkedIn, 1-2 threads, 1 newsletter issue",
      "Distribution paid amplification : boost LinkedIn ou Twitter/X sur les articles d'acquisition qui ciblent des decisionnaires",
      "SEO interne : linker systematiquement les nouveaux articles depuis les articles existants les plus performants",
    ]),
    h2("FAQ"),
    h3("Quelle longueur d'article vise-t-on pour le SEO B2B ?"),
    p("La longueur optimale depend de la complexite du sujet et de la concurrence. En general, pour un sujet B2B competitif, un article de 1 800 a 3 000 mots couvre suffisamment le champ semantique pour ranker. Au-dela de 3 500 mots, l'engagement baisse sans gain SEO proportionnel. Ce qui compte plus que la longueur : la completude semantique (toutes les sous-questions traitees) et la precision des informations."),
    h3("A quelle frequence publier pour un blog B2B qui vise le SEO ?"),
    p("La regularite prime sur la frequence. Un article de qualite par semaine avec une distribution seri euse est plus efficace que 3 articles mediocres. Le blog Intercom a construit son autorite sur 1 a 2 articles tres travailles par semaine pendant 5 ans. La regle : publiez a la frequence que vous pouvez maintenir sur 24 mois sans degrader la qualite."),
    h3("Comment mesurer le ROI d'un article de blog B2B ?"),
    p("Trackez 4 metriques par article : le trafic organique sur 90 jours (signal SEO), le taux de conversion vers une action CTA (demo, newsletter, ressource telechargee), le pipeline influenced (deals qui ont touche cet article dans leur parcours), et les backlinks naturels generes. Un article qui genere 0 conversions directes mais influence 20 % des deals closes a une valeur pipeline reelle, meme invisible dans Google Analytics."),
    h2("Conclusion"),
    p("Les meilleurs blogs SaaS B2B ne sont pas de meilleurs blogueurs. Ce sont de meilleures organisations qui ont decide que le contenu est un actif commercial, pas un effort de relations publiques. Chaque article est un investissement avec un ROI mesurable : trafic organique, pipeline influenced, autorite sectorielle. Commencez par les decisions strategiques — intention, persona, angle differentiel — et la qualite de la redaction suivra naturellement. L'inverse ne fonctionne pas."),
  ],
};

const articleData = [
  {
    catSlug: "news",
    title: "Pourquoi les equipes GTM reduisent leur stack pour aller plus vite",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
    date: "2026-04-16T08:00:00.000Z",
    readingTime: 11,
    excerpt: "En 2024, une equipe GTM moyenne utilise 14 outils. En 2025, les meilleurs reduisent ce nombre de moitie — et accelerent. Analyse du mouvement de simplification qui redessine les stacks commerciales B2B.",
    metaTitle: "Pourquoi les equipes GTM reduisent leur stack | Scalefast",
    metaDescription: "En 2025, les equipes GTM les plus rapides ne sont pas les plus outillees. Analyse du mouvement de simplification des stacks commerciales B2B et le framework pour auditer la votre.",
    content: article1Content,
  },
  {
    catSlug: "sales",
    title: "Le discovery call B2B qui ouvre un vrai deal",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80",
    date: "2026-04-12T10:00:00.000Z",
    readingTime: 12,
    excerpt: "La plupart des discovery calls B2B echouent avant d'avoir commence. Structure en 5 phases, signaux d'un deal serieux, et erreurs a ne jamais commettre — le guide complet pour transformer vos premiers appels en pipelines qualifies.",
    metaTitle: "Discovery call B2B : la structure en 5 phases | Scalefast",
    metaDescription: "Comment structurer un discovery call B2B pour qualifier les vrais deals, detecter les signaux d'achat, et obtenir une prochaine etape concrete. Guide pratique avec framework et FAQ.",
    content: article2Content,
  },
  {
    catSlug: "gtm-engineering",
    title: "Construire un pipeline GTM qui survit aux changements",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
    date: "2026-04-08T09:00:00.000Z",
    readingTime: 13,
    excerpt: "Pourquoi la plupart des pipelines GTM s'effondrent a 18 mois, et comment construire une architecture en 3 couches (signaux, logique, execution) qui survit aux changements d'equipe, d'outils et d'ICP.",
    metaTitle: "Pipeline GTM resilient : architecture 3 couches | Scalefast",
    metaDescription: "Comment construire un pipeline GTM qui ne s'effondre pas lors des changements d'equipe, de CRM ou d'ICP. Framework en 3 couches : signaux, logique, execution — avec guide de migration sans interruption.",
    content: article3Content,
  },
  {
    catSlug: "outils",
    title: "Setup minimal pour une stack outbound maintenable",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
    date: "2026-04-03T07:30:00.000Z",
    readingTime: 10,
    excerpt: "5 outils, moins de 800€/mois pour 3 SDR, et une efficacite superieure aux stacks a 15 000€/mois. Le setup outbound minimal recommande par Scalefast : CRM, enrichissement, sequencer, infrastructure email et analytics.",
    metaTitle: "Stack outbound B2B minimale : 5 outils essentiels | Scalefast",
    metaDescription: "Le setup outbound minimal pour une equipe SDR B2B : HubSpot, Clay, Instantly, infrastructure email et analytics. Moins de 800€/mois pour 3 SDR avec un ROI mesurable et un onboarding en 1 journee.",
    content: article4Content,
  },
  {
    catSlug: "ressources",
    title: "Le playbook hebdo qui aligne marketing, SDR et AE",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80",
    date: "2026-03-28T11:15:00.000Z",
    readingTime: 11,
    excerpt: "90 minutes par semaine pour eliminer les leads qui tombent dans les failles organisationnelles. Le playbook de 3 rituels (revue pipeline lundi, debrief content mercredi, win/loss review bimensuel) et les 7 metriques d'alignement GTM a tracker.",
    metaTitle: "Playbook alignement Marketing SDR AE | Scalefast",
    metaDescription: "Le playbook hebdo en 3 rituels pour aligner marketing, SDR et AE : 90 minutes par semaine pour arreter de perdre des leads dans les failles inter-equipes. Templates inclus.",
    content: article5Content,
  },
  {
    catSlug: "analyse",
    title: "Ce que les meilleurs blogs SaaS B2B font avant le premier paragraphe",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    date: "2026-03-24T08:45:00.000Z",
    readingTime: 13,
    excerpt: "Analyse des blogs SaaS B2B qui generent du pipeline : les 3 decisions strategiques qui precedent chaque article, l'architecture SEO EEAT, et la distribution systematique qui transforme le contenu en actif commercial mesurable.",
    metaTitle: "Ce que les meilleurs blogs SaaS B2B font differemment | Scalefast",
    metaDescription: "Analyse des blogs SaaS B2B qui generent du vrai pipeline. Les 3 decisions avant la redaction, l'architecture SEO EEAT, et la distribution systematique — pour transformer votre blog en actif commercial.",
    content: article6Content,
  },
] as const;

export const demoArticles: Article[] = articleData.map((entry, index) => {
  const category = demoCategories.find((c) => c.slug === entry.catSlug)!;
  const slug = entry.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return {
    id: `article-${index + 1}`,
    title: entry.title,
    slug,
    excerpt: entry.excerpt,
    content: entry.content,
    status: "published",
    category_id: category.id,
    author_id: "00000000-0000-0000-0000-000000000001",
    brief_subject: entry.title,
    brief_audience: "Equipes GTM B2B SaaS",
    brief_message: "Executer plus vite avec moins de friction.",
    ai_plan: null,
    ai_plan_validated_at: null,
    meta_title: entry.metaTitle,
    meta_description: entry.metaDescription,
    featured_image_url: entry.image,
    og_image_url: entry.image,
    published_at: entry.date,
    scheduled_at: null,
    reading_time_minutes: entry.readingTime,
    created_at: entry.date,
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
