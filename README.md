# LeBazare - Boutique Artisanale E-commerce

Site e-commerce moderne pour LeBazare, une boutique artisanale de produits en matières naturelles (bois, paille, raphia).

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ installé
- Accès au store Shopify `lebazare-5325.myshopify.com`

### Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Build pour Production

```bash
# Créer un build optimisé
npm run build

# Lancer le serveur de production
npm start
```

## 🎨 Identité Visuelle

### Palette de Couleurs

- **beige** (`#F5F5DC`) - Fond principal
- **terracotta** (`#B85C38`) - Accents
- **ocre** (`#D2B48C`) - Bois clair
- **dark-text** (`#282828`) - Texte
- **accent-red** (`#C04000`) - Boutons

### Typographie

- **Playfair Display** (serif) - Titres H1, H2
- **Inter** (sans-serif) - Texte courant

## 🏗️ Structure du Projet

```
lebazare-shop/
├── app/                 # Pages Next.js (App Router)
│   ├── layout.tsx      # Layout racine
│   ├── page.tsx        # Page d'accueil
│   └── globals.css     # Styles globaux
├── components/          # Composants React réutilisables
├── lib/                 # Utilitaires et helpers
├── .env.local          # Variables d'environnement (non versionné)
├── next.config.mjs     # Configuration Next.js
├── tailwind.config.ts  # Configuration Tailwind CSS
└── tsconfig.json       # Configuration TypeScript
```

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet :

```env
SHOPIFY_STORE_DOMAIN=lebazare-5325.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=427d4f8e457ebe994efac53f84bf3124
```

⚠️ **Important** : Ce fichier est déjà pré-configuré mais n'est pas versionné pour des raisons de sécurité.

## 📦 Stack Technique

- **Framework** : Next.js 14.2.33 (App Router)
- **Style** : Tailwind CSS 3.3.6
- **Backend** : Shopify Headless (Storefront API)
- **Langage** : TypeScript 5.3.2
- **Hébergement** : Vercel (recommandé)

## 🛍️ Intégration Shopify

Le site utilise l'API Shopify Storefront pour :
- Récupérer les produits
- Gérer le panier
- Traiter les paiements

Les images produits sont automatiquement optimisées via `cdn.shopify.com`.

## 🔐 Sécurité

- ✅ Next.js mis à jour vers la version 14.2.33 (corrige les vulnérabilités critiques)
- ✅ Aucune vulnérabilité détectée (`npm audit`)
- ✅ Analyse CodeQL passée sans alerte
- ✅ Variables sensibles exclues du contrôle de version

## 📝 Prochaines Étapes

1. ✅ Structure de base configurée
2. 🔄 Intégration Shopify Storefront API (à venir)
3. 🔄 Pages produits et collections (à venir)
4. 🔄 Panier et checkout (à venir)
5. 🔄 Optimisation SEO (à venir)

## 🎯 Inspiration

Le style s'inspire de la boutique Etsy : [https://www.etsy.com/shop/LeBazare](https://www.etsy.com/shop/LeBazare)

---

**Créé avec** ❤️ **pour LeBazare**
