# Guide d'Installation et de Test Local - LeBazare

## 📥 Cloner le Projet depuis GitHub

### 1. Sur votre machine Ubuntu locale:

```bash
# Cloner le repository
git clone https://github.com/pithop/lebazare-shop.git

# Accéder au répertoire
cd lebazare-shop

# Vérifier que vous êtes sur la bonne branche
git checkout copilot/create-ecommerce-site-lebazare
```

## 🛠️ Installation des Prérequis

### 1. Installer Node.js et npm (si pas déjà installé)

```bash
# Vérifier si Node.js est installé
node --version
npm --version

# Si non installé, installer Node.js (version 18 ou supérieure recommandée)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier l'installation
node --version  # devrait afficher v18.x.x ou supérieur
npm --version   # devrait afficher 9.x.x ou supérieur
```

### 2. Installer les dépendances du projet

```bash
# Dans le répertoire lebazare-shop
npm install
```

## 🔧 Configuration

### 1. Créer le fichier .env.local

Le fichier `.env.local` contient vos identifiants Shopify. Il n'est pas inclus dans le repository pour des raisons de sécurité.

```bash
# Créer le fichier .env.local à la racine du projet
nano .env.local
```

Ou avec n'importe quel éditeur de texte, créez le fichier `.env.local` avec ce contenu:

```env
SHOPIFY_STORE_DOMAIN=lebazare-5325.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=427d4f8e457ebe994efac53f84bf3124
```

Sauvegardez le fichier (Ctrl+O puis Ctrl+X si vous utilisez nano).

## 🚀 Lancer le Projet en Mode Développement

### 1. Démarrer le serveur de développement

```bash
npm run dev
```

Vous devriez voir:

```
▲ Next.js 14.2.33
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 1284ms
```

### 2. Ouvrir dans le navigateur

Ouvrez votre navigateur et allez sur:
```
http://localhost:3000
```

## 🌐 Pages Disponibles

Une fois le serveur démarré, vous pouvez accéder à:

- **Page d'accueil**: `http://localhost:3000`
- **Catalogue produits**: `http://localhost:3000/produits`
- **À propos**: `http://localhost:3000/a-propos`
- **Contact**: `http://localhost:3000/contact`
- **Panier**: `http://localhost:3000/panier`

## 🏗️ Build pour Production

### 1. Créer un build optimisé

```bash
npm run build
```

### 2. Lancer le serveur de production

```bash
npm start
```

Le site sera accessible sur `http://localhost:3000`

## 📁 Structure du Projet

```
lebazare-shop/
├── app/                      # Pages Next.js (App Router)
│   ├── layout.tsx           # Layout racine avec Header & Footer
│   ├── page.tsx             # Page d'accueil
│   ├── produits/            # Section produits
│   │   ├── page.tsx        # Liste des produits
│   │   └── [handle]/       # Pages produit individuelles
│   ├── a-propos/            # Page à propos
│   ├── contact/             # Page contact
│   ├── panier/              # Page panier
│   └── api/                 # API routes
├── components/               # Composants réutilisables
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── AddToCartButton.tsx
├── lib/                      # Utilitaires
│   ├── shopify.ts           # Client GraphQL Shopify
│   ├── products.ts          # Requêtes produits
│   ├── cart.ts              # Gestion panier
│   └── types.ts             # Types TypeScript
├── .env.local               # Variables d'environnement (à créer)
├── package.json             # Dépendances
├── tailwind.config.ts       # Configuration Tailwind
└── tsconfig.json            # Configuration TypeScript
```

## 🔍 Vérifier que Tout Fonctionne

### 1. Vérifier les logs du serveur

Dans le terminal où tourne `npm run dev`, vous devriez voir:
- Aucune erreur
- Les requêtes qui s'affichent quand vous naviguez

### 2. Tester les pages

- ✅ La page d'accueil s'affiche avec le design beige et les couleurs personnalisées
- ✅ Le header et footer sont présents sur toutes les pages
- ✅ La navigation fonctionne entre les pages
- ✅ La page produits affiche le message "Impossible de charger les produits" si le store Shopify n'a pas de produits

### 3. Ouvrir les outils de développement du navigateur

Appuyez sur `F12` ou `Ctrl+Shift+I` pour ouvrir les DevTools et vérifier:
- Console: pas d'erreurs rouges critiques
- Network: les requêtes se chargent correctement

## ❓ Résolution de Problèmes

### Erreur: "Port 3000 déjà utilisé"

```bash
# Tuer le processus sur le port 3000
sudo lsof -ti:3000 | xargs kill -9

# Ou utiliser un autre port
PORT=3001 npm run dev
```

### Erreur: "Cannot find module"

```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Erreur: ".env.local not found"

- Assurez-vous d'avoir créé le fichier `.env.local` à la racine du projet
- Vérifiez qu'il contient les bonnes variables d'environnement

### Les produits ne se chargent pas

C'est normal si votre store Shopify n'a pas encore de produits. Le site affichera un message gracieux avec un lien vers Etsy.

## 🌍 Déploiement sur Vercel (Production)

### 1. Installer Vercel CLI

```bash
npm install -g vercel
```

### 2. Déployer

```bash
vercel
```

Suivez les instructions à l'écran. Vercel détectera automatiquement qu'il s'agit d'un projet Next.js.

### 3. Configurer les variables d'environnement

Dans le dashboard Vercel:
1. Allez dans Settings > Environment Variables
2. Ajoutez:
   - `SHOPIFY_STORE_DOMAIN`: `lebazare-5325.myshopify.com`
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN`: `427d4f8e457ebe994efac53f84bf3124`

## 📞 Besoin d'Aide?

Si vous rencontrez des problèmes:

1. Vérifiez que Node.js version 18+ est installé
2. Vérifiez que le fichier `.env.local` existe et contient les bonnes variables
3. Essayez de supprimer `node_modules` et réinstaller avec `npm install`
4. Consultez les logs dans le terminal pour voir les erreurs spécifiques

## 🎉 Félicitations!

Si tout fonctionne, vous devriez voir le site LeBazare s'afficher avec:
- Design bohème avec couleurs personnalisées (beige, terracotta, ocre)
- Polices Google Fonts (Playfair Display + Inter)
- Navigation fonctionnelle
- Pages complètes et responsive

Le projet est maintenant prêt pour le développement et le déploiement! 🚀
