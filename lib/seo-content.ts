/**
 * SEO Content Data for LeBazare
 * This file contains optimized SEO content for category pages and FAQs
 * Based on Gemini + ChatGPT Deep Research recommendations
 */

export interface CategorySEOContent {
    slug: string;
    title: string;
    metaTitle: string;
    metaDescription: string;
    heroTitle: string;
    heroSubtitle: string;
    seoContent: string; // 300-500 words of SEO-optimized content
    faqs: Array<{
        question: string;
        answer: string;
    }>;
    keywords: string[];
}

export const categorySEOContent: Record<string, CategorySEOContent> = {
    'Luminaire': {
        slug: 'luminaires',
        title: 'Luminaires en Paille & Osier',
        metaTitle: 'Luminaires Artisanaux Marocains | Suspensions en Paille & Osier - LeBazare',
        metaDescription: 'Découvrez notre collection de luminaires artisanaux marocains : suspensions en paille, abat-jour en osier, appliques en raphia. Fait main au Maroc, livraison 48h.',
        heroTitle: 'Luminaires',
        heroSubtitle: 'Suspensions en paille tressée, abat-jour naturels',
        seoContent: `## Luminaires Artisanaux Marocains : L'Art de la Lumière Naturelle

Nos luminaires en paille et osier sont bien plus que de simples sources de lumière. Ils sont le fruit d'un savoir-faire ancestral transmis de génération en génération par les artisans du Maroc.

### Le Savoir-Faire des Vanniers Marocains

Chaque suspension, abat-jour et applique de notre collection est entièrement tressé à la main par des artisans qualifiés. Les matériaux utilisés – paille de doum, feuilles de palmier, raphia naturel – sont récoltés de manière durable dans les régions rurales du Maroc.

### Pourquoi Choisir un Luminaire en Fibres Naturelles ?

Les luminaires en paille et osier offrent une lumière tamisée et chaleureuse, idéale pour créer une atmosphère bohème chic. Contrairement aux luminaires industriels, chaque pièce est unique, avec ses propres variations de texture et de teinte.

**Avantages de nos luminaires artisanaux :**
- Matériaux 100% naturels et éco-responsables
- Jeu de lumière unique grâce au tressage ajouré
- Légèreté et facilité d'installation
- Pièces uniques introuvables ailleurs

### Comment Installer une Suspension en Paille ?

L'installation est simple : nos luminaires sont livrés avec un câble électrique standard et une douille E27. Ils peuvent être accrochés à un crochet de plafond existant ou via un kit de fixation (non fourni). Pour les locataires, nous recommandons les crochets auto-adhésifs spécial plafond.`,
        faqs: [
            {
                question: "Comment nettoyer une suspension en paille ?",
                answer: "Utilisez un chiffon sec ou un plumeau pour dépoussiérer régulièrement. Si nécessaire, passez un chiffon légèrement humide puis laissez sécher à l'air libre. N'utilisez jamais de produits chimiques ni d'eau en grande quantité."
            },
            {
                question: "Quelle ampoule utiliser avec un luminaire en osier ?",
                answer: "Nous recommandons les ampoules LED (E27) qui ne chauffent pas et préservent les fibres naturelles. Optez pour une température de couleur chaude (2700-3000K) pour une ambiance cosy."
            },
            {
                question: "Est-ce que la paille jaunit avec le temps ?",
                answer: "Légèrement, c'est normal et même recherché. Le jaunissement doux donne un caractère vintage apprécié. Pour ralentir ce processus, évitez l'exposition directe au soleil."
            },
            {
                question: "Peut-on utiliser ces luminaires en extérieur ?",
                answer: "Uniquement sous abri fermé (véranda, pergola couverte). Les fibres naturelles ne résistent pas à la pluie ni à l'humidité prolongée."
            }
        ],
        keywords: ['luminaire paille', 'suspension osier', 'abat-jour naturel', 'luminaire bohème', 'suspension marocaine', 'lampe artisanale']
    },
    'Mobilier': {
        slug: 'mobilier',
        title: 'Mobilier Artisanal Marocain',
        metaTitle: 'Mobilier Artisanal Marocain | Tabourets, Chaises en Bois - LeBazare',
        metaDescription: 'Mobilier artisanal marocain : tabourets en bois et corde, chaises tressées, bancs. Pièces uniques faites main par des artisans, expédiées depuis la France.',
        heroTitle: 'Mobilier',
        heroSubtitle: 'Tabourets, chaises et assises artisanales',
        seoContent: `## Mobilier Artisanal Marocain : L'Authenticité au Service de Votre Intérieur

Le mobilier artisanal marocain est reconnu mondialement pour son élégance intemporelle et sa robustesse. Nos pièces – tabourets, chaises, bancs et rangements – sont fabriquées à la main par des artisans maîtrisant des techniques séculaires.

### Les Bois Nobles du Mobilier Marocain

Nos artisans travaillent principalement le **bois d'eucalyptus** (léger et résistant), le **citronnier** (noble et parfumé) et le **thuya** (emblématique d'Essaouira). Ces essences sont sélectionnées pour leur durabilité et leur beauté naturelle.

### Le Tabouret Beldi : Icône du Style Marocain

Le tabouret marocain, ou "tabouret beldi", combine une structure en bois massif et une assise en corde tressée ou en feuilles de palmier. Son design ergonomique et sa hauteur idéale (40-45 cm) le rendent polyvalent : siège d'appoint, repose-pieds, table basse.

**Nos types de mobilier :**
- **Tabourets** : En bois clair ou foncé, assise tressée colorée ou naturelle
- **Chaises** : Hautes ou basses, dossier tressé ou bois sculpté
- **Bancs** : Format entrée ou salle à manger
- **Malles et rangements** : En osier ou palmier tressé

### Entretien du Mobilier en Bois et Corde

Pour préserver vos meubles artisanaux, essuyez régulièrement avec un chiffon sec. En cas de tache, utilisez de l'eau savonneuse en petite quantité et séchez immédiatement. Une fois par an, vous pouvez nourrir le bois avec de l'huile de lin ou de la cire d'abeille.`,
        faqs: [
            {
                question: "Ce mobilier peut-il être utilisé en extérieur ?",
                answer: "Nous recommandons une utilisation en intérieur ou sous abri couvert. Le bois et les fibres naturelles peuvent se détériorer avec l'humidité et le soleil direct."
            },
            {
                question: "Quel poids peut supporter un tabouret marocain ?",
                answer: "Nos tabourets sont conçus pour supporter jusqu'à 110 kg. L'assise tressée et la structure en bois massif garantissent une solidité optimale."
            },
            {
                question: "Les tabourets sont-ils livrés montés ?",
                answer: "Oui, tous nos meubles sont livrés entièrement montés et prêts à l'emploi. Aucun assemblage requis."
            },
            {
                question: "D'où provient le bois utilisé ?",
                answer: "Le bois provient de forêts marocaines gérées durablement. Nous privilégions l'eucalyptus (croissance rapide) et le citronnier issu de vergers."
            }
        ],
        keywords: ['mobilier marocain', 'tabouret artisanal', 'chaise tressée', 'banc bois', 'meuble fait main', 'tabouret beldi']
    },
    'Sacs & Accessoires': {
        slug: 'sacs-accessoires',
        title: 'Sacs & Vannerie Artisanale',
        metaTitle: 'Sacs en Paille & Paniers Artisanaux Marocains - LeBazare',
        metaDescription: 'Sacs cabas en paille, paniers en osier, vannerie marocaine. Accessoires artisanaux fait main : rangements déco, paniers à linge. Livraison rapide.',
        heroTitle: 'Sacs & Accessoires',
        heroSubtitle: 'Paniers, cabas et vannerie artisanale',
        seoContent: `## Vannerie et Sacs Artisanaux Marocains : L'Art du Tressage

La vannerie marocaine est un art ancestral qui transforme les fibres végétales en objets du quotidien aussi beaux que fonctionnels. Nos sacs, paniers et accessoires en paille sont tressés à la main par des artisanes de coopératives du sud du Maroc.

### Les Fibres de la Vannerie Marocaine

Nos artisanes utilisent principalement :
- **Le doum** (feuilles de palmier nain) : très résistant, idéal pour les paniers
- **L'osier** : flexible et élégant pour les sacs
- **Le raphia** : doux et colorable pour les finitions décoratives
- **Le jonc** : naturellement brillant pour les cabas chics

### Notre Collection de Sacs et Paniers

**Sacs cabas** : Nos sacs en paille tressée avec anses en cuir sont parfaits pour l'été ou les courses. Les modèles brodés de sequins ajoutent une touche bohème chic.

**Paniers de rangement** : Du petit panier de bureau à la grande malle de rangement, chaque pièce allie utilité et esthétique. Idéaux pour organiser la maison avec style.

**Paniers muraux** : Tendance déco incontournable, les paniers muraux créent un mur d'inspiration bohème sans percer.

### Pourquoi Choisir la Vannerie Artisanale ?

Chaque panier est unique, porteur de l'histoire et du savoir-faire de son artisane. En achetant de la vannerie artisanale, vous soutenez directement les coopératives de femmes au Maroc et contribuez à préserver un patrimoine immatériel précieux.`,
        faqs: [
            {
                question: "Comment nettoyer un panier en osier ?",
                answer: "Dépoussiérez régulièrement avec une brosse douce ou un aspirateur à faible puissance. Pour les taches, utilisez un chiffon légèrement humide avec du savon doux, puis laissez sécher complètement à l'air libre."
            },
            {
                question: "Les sacs en paille sont-ils solides ?",
                answer: "Oui, nos sacs sont tressés serré et renforcés aux points de tension. Les anses en cuir véritable sont cousues main pour une durabilité maximale."
            },
            {
                question: "Peut-on laver un sac en paille ?",
                answer: "Nous déconseillons le lavage à l'eau. Nettoyez les taches localement avec un chiffon humide. Pour les anses en cuir, utilisez occasionnellement un baume cuir."
            },
            {
                question: "D'où viennent les sequins sur les sacs brodés ?",
                answer: "Les sequins sont cousus à la main par les artisanes. Chaque motif est unique et reflète la créativité de l'artisane qui l'a réalisé."
            }
        ],
        keywords: ['sac paille', 'panier osier', 'vannerie marocaine', 'cabas artisanal', 'panier rangement', 'sac bohème']
    },
    'Décoration': {
        slug: 'decoration',
        title: 'Décoration Bohème Artisanale',
        metaTitle: 'Décoration Bohème & Artisanat Marocain - LeBazare',
        metaDescription: 'Décoration bohème artisanale : miroirs, objets déco, paniers muraux. Artisanat marocain authentique pour un intérieur unique. Livraison France 48h.',
        heroTitle: 'Décoration',
        heroSubtitle: 'Objets déco et accessoires bohèmes',
        seoContent: `## Décoration Bohème : Créez un Intérieur Unique et Chaleureux

La décoration bohème, ou "boho chic", célèbre l'authenticité, les matériaux naturels et le mélange des cultures. Nos objets décoratifs marocains s'intègrent parfaitement dans cet univers, apportant chaleur et caractère à votre intérieur.

### Les Incontournables de la Déco Bohème

**Miroirs en laiton** : Le miroir "œil de sorcière" ou les cadres en laiton ciselé apportent une touche orientale raffinée.

**Paniers muraux** : Composez un mur de paniers aux teintes naturelles pour une décoration tendance et facile à réaliser.

**Objets en céramique** : Les poteries de Tamegroute (glaçure verte unique) ou de Safi ajoutent de la couleur et de l'artisanat authentique.

### Comment Réussir sa Déco Bohème ?

1. **Mixez les textures** : Associez osier, laiton, lin et bois pour un effet layering réussi
2. **Privilégiez les couleurs terre** : Terracotta, ocre, beige et vert sauge créent une harmonie naturelle
3. **Ajoutez des plantes** : La verdure complète parfaitement le style bohème
4. **Osez les pièces uniques** : Un seul objet artisanal fort vaut mieux que plusieurs décos industrielles

### L'Artisanat Marocain dans la Tendance 2025

Les tendances déco 2025 confirment le retour aux matériaux naturels et à l'artisanat. Le "slow design" et le "handmade" sont au cœur des recherches des décorateurs. Nos pièces artisanales répondent à cette quête d'authenticité.`,
        faqs: [
            {
                question: "Comment accrocher des paniers muraux sans percer ?",
                answer: "Utilisez des crochets adhésifs de qualité (type Command 3M) adaptés au poids du panier. Pour les grands paniers, préférez les clous ou vis pour plus de sécurité."
            },
            {
                question: "Comment nettoyer le laiton sans l'abîmer ?",
                answer: "Frottez délicatement avec un demi-citron saupoudré de sel fin, rincez à l'eau claire et séchez immédiatement. Pour conserver la patine, n'utilisez aucun produit."
            },
            {
                question: "Les objets en céramique sont-ils alimentaires ?",
                answer: "Nos céramiques décoratives ne sont pas recommandées pour un usage alimentaire quotidien. Pour vaisselle, vérifiez la mention 'food safe' dans la description produit."
            },
            {
                question: "Puis-je mélanger artisanat marocain et déco scandinave ?",
                answer: "Absolument ! Le mix bohème-scandinave ('scandi-boho') est très tendance. Les tons neutres du scandinave mettent en valeur les textures artisanales."
            }
        ],
        keywords: ['décoration bohème', 'déco marocaine', 'artisanat déco', 'miroir laiton', 'paniers muraux', 'style boho']
    }
};

/**
 * Get SEO content for a specific category
 */
export function getCategorySEOContent(category: string): CategorySEOContent | undefined {
    return categorySEOContent[category];
}

/**
 * Get FAQ items for a category (for FAQSchema component)
 */
export function getCategoryFAQs(category: string): Array<{ question: string; answer: string }> {
    return categorySEOContent[category]?.faqs || [];
}

/**
 * Get all categories with SEO content
 */
export function getAllCategoriesWithSEO(): string[] {
    return Object.keys(categorySEOContent);
}
