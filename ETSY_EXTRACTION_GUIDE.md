# Guide: Extraire les Produits de la Boutique Etsy

## 🎯 Objectif

Ce guide vous aide à extraire les produits de la boutique Etsy LeBazare pour les afficher sur le nouveau site web.

## 📋 Méthodes d'Extraction

### Méthode 1: Scraping Web Automatisé (Recommandé)

Créez un script pour extraire les données publiques de la boutique Etsy.

#### Script Node.js d'Extraction

```javascript
// etsy-scraper.js
const https = require('https');
const fs = require('fs');

const ETSY_SHOP_URL = 'https://www.etsy.com/shop/LeBazare';

async function scrapeEtsyShop() {
  console.log('🔍 Extraction des produits de la boutique Etsy LeBazare...');
  
  // Note: Cette méthode récupère les données publiques via l'API Etsy
  // Vous aurez besoin d'une clé API Etsy pour un accès complet
  
  const etsyApiKey = 'VOTRE_CLE_API_ETSY'; // À obtenir sur https://www.etsy.com/developers
  
  // Endpoint pour récupérer les produits d'une boutique
  const shopName = 'LeBazare';
  const url = `https://openapi.etsy.com/v3/application/shops/${shopName}/listings/active`;
  
  // Configuration de la requête
  const options = {
    headers: {
      'x-api-key': etsyApiKey,
      'Accept': 'application/json'
    }
  };
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    // Formater les produits pour le site web
    const products = data.results.map(listing => ({
      id: listing.listing_id,
      title: listing.title,
      description: listing.description,
      price: listing.price.amount / listing.price.divisor,
      currency: listing.price.currency_code,
      images: listing.images.map(img => ({
        url: img.url_fullxfull,
        alt: listing.title
      })),
      url: listing.url,
      handle: listing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tags: listing.tags
    }));
    
    // Sauvegarder dans un fichier JSON
    fs.writeFileSync('etsy-products.json', JSON.stringify(products, null, 2));
    
    console.log(`✅ ${products.length} produits extraits avec succès!`);
    console.log('📄 Fichier sauvegardé: etsy-products.json');
    
    return products;
  } catch (error) {
    console.error('❌ Erreur lors de l\'extraction:', error);
  }
}

// Exécuter le script
scrapeEtsyShop();
```

### Méthode 2: Extraction Manuelle via le Navigateur

Si vous ne voulez pas coder, vous pouvez extraire manuellement:

#### Étape 1: Installer une Extension de Scraping

1. **Web Scraper** (Chrome Extension)
   - Installer: https://chrome.google.com/webstore/detail/web-scraper
   - Gratuit et facile à utiliser

2. **Data Miner** (Chrome/Firefox)
   - Installer: https://dataminer.io/
   - Interface visuelle

#### Étape 2: Configurer le Scraper

Configuration pour Web Scraper:

```json
{
  "selectors": [
    {
      "id": "product",
      "type": "SelectorElement",
      "parentSelectors": ["_root"],
      "selector": ".listing-link",
      "multiple": true
    },
    {
      "id": "title",
      "type": "SelectorText",
      "parentSelectors": ["product"],
      "selector": "h3"
    },
    {
      "id": "price",
      "type": "SelectorText",
      "parentSelectors": ["product"],
      "selector": ".currency-value"
    },
    {
      "id": "image",
      "type": "SelectorImage",
      "parentSelectors": ["product"],
      "selector": "img"
    },
    {
      "id": "link",
      "type": "SelectorLink",
      "parentSelectors": ["product"],
      "selector": "a"
    }
  ]
}
```

### Méthode 3: Obtenir une Clé API Etsy (Officiel)

Pour une extraction complète et légale:

#### Créer un Compte Développeur Etsy

1. Allez sur: https://www.etsy.com/developers/
2. Cliquez sur "Register as a developer"
3. Créez une application
4. Obtenez votre clé API (API Key)

#### Utiliser l'API Etsy v3

```bash
# Installer les dépendances
npm install axios dotenv

# Créer .env
echo "ETSY_API_KEY=votre_cle_api_ici" > .env
```

```javascript
// etsy-api-extractor.js
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const ETSY_API_KEY = process.env.ETSY_API_KEY;
const SHOP_NAME = 'LeBazare';

async function getShopListings() {
  try {
    // Récupérer les produits actifs
    const response = await axios.get(
      `https://openapi.etsy.com/v3/application/shops/${SHOP_NAME}/listings/active`,
      {
        headers: {
          'x-api-key': ETSY_API_KEY
        },
        params: {
          includes: 'images,shipping_profile',
          limit: 100
        }
      }
    );

    const listings = response.data.results;
    
    // Formater pour votre site
    const products = listings.map(listing => ({
      shopify_title: listing.title,
      shopify_description: listing.description,
      shopify_price: (listing.price.amount / listing.price.divisor).toFixed(2),
      shopify_images: listing.images?.map(img => img.url_fullxfull).join(','),
      shopify_handle: listing.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
      shopify_tags: listing.tags?.join(','),
      shopify_vendor: 'LeBazare',
      shopify_type: 'Artisanat'
    }));

    // Sauvegarder en JSON
    fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
    
    // Sauvegarder en CSV pour Shopify
    const csv = convertToShopifyCSV(products);
    fs.writeFileSync('shopify-import.csv', csv);
    
    console.log(`✅ ${products.length} produits extraits!`);
    console.log('📁 Fichiers créés:');
    console.log('   - products.json (format JSON)');
    console.log('   - shopify-import.csv (pour import Shopify)');
    
    return products;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

function convertToShopifyCSV(products) {
  const headers = [
    'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type',
    'Tags', 'Published', 'Option1 Name', 'Option1 Value',
    'Variant Price', 'Variant Inventory Qty', 'Image Src'
  ].join(',');
  
  const rows = products.map(p => [
    p.shopify_handle,
    `"${p.shopify_title}"`,
    `"${p.shopify_description}"`,
    p.shopify_vendor,
    p.shopify_type,
    `"${p.shopify_tags}"`,
    'TRUE',
    'Title',
    'Default Title',
    p.shopify_price,
    '10',
    p.shopify_images?.split(',')[0] || ''
  ].join(','));
  
  return [headers, ...rows].join('\n');
}

// Exécuter
getShopListings();
```

## 📝 Importer les Produits dans Shopify

Une fois les produits extraits:

### Option 1: Import CSV dans Shopify

```bash
# 1. Se connecter à l'admin Shopify
https://lebazare-5325.myshopify.com/admin

# 2. Aller dans Products > Import
# 3. Uploader shopify-import.csv
# 4. Mapper les colonnes
# 5. Importer
```

### Option 2: Créer des Produits via l'API

```javascript
// shopify-import.js
const products = require('./products.json');
const { shopifyFetch } = require('./lib/shopify');

async function importProducts() {
  for (const product of products) {
    const mutation = `
      mutation productCreate($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    
    const variables = {
      input: {
        title: product.shopify_title,
        descriptionHtml: product.shopify_description,
        vendor: product.shopify_vendor,
        productType: product.shopify_type,
        tags: product.shopify_tags.split(','),
        variants: [
          {
            price: product.shopify_price,
            inventoryQuantities: {
              availableQuantity: 10,
              locationId: "gid://shopify/Location/VOTRE_LOCATION_ID"
            }
          }
        ],
        images: product.shopify_images.split(',').map(url => ({ src: url }))
      }
    };
    
    try {
      const result = await shopifyFetch({ query: mutation, variables });
      console.log(`✅ Produit créé: ${product.shopify_title}`);
    } catch (error) {
      console.error(`❌ Erreur: ${product.shopify_title}`, error);
    }
  }
}

importProducts();
```

## 🔒 Important - Considérations Légales

**⚠️ Attention:**
1. Vous avez le droit d'extraire vos propres produits de votre boutique
2. Les images et descriptions appartiennent au propriétaire de la boutique
3. Assurez-vous d'avoir l'autorisation du propriétaire de la boutique
4. Respectez les conditions d'utilisation d'Etsy

## 🚀 Utilisation Recommandée

Pour éviter des problèmes légaux, la meilleure approche est:

1. **Demander gentiment à votre frère** les données (même si vous voulez faire une surprise)
2. **Utiliser l'API Etsy officielle** avec une clé API
3. **Créer les produits manuellement** dans Shopify (plus sûr)

## 📞 Alternative: Surprise Progressive

Au lieu d'extraire tous les produits:

1. **Créer 3-5 produits d'exemple** manuellement
2. **Montrer le prototype** à votre frère
3. **Lui demander de fournir** les données complètes une fois convaincu
4. **Importer ensemble** tous les produits

Cela évite les problèmes légaux et vous permet quand même de faire une belle surprise!

## 📦 Exemple de Produit Manuel

Pour créer quelques produits d'exemple sans API:

```javascript
// example-products.js
const exampleProducts = [
  {
    title: "Panier en Raphia Naturel",
    description: "Magnifique panier artisanal tissé à la main en raphia naturel. Parfait pour le rangement ou la décoration bohème.",
    price: "35.00",
    currency: "EUR",
    images: [
      "https://placehold.co/800x800/D2B48C/FFFFFF?text=Panier+Raphia"
    ],
    handle: "panier-raphia-naturel",
    tags: ["raphia", "panier", "artisanat", "bohème"]
  },
  {
    title: "Suspension Murale en Paille",
    description: "Décoration murale unique en paille tressée. Design bohème pour apporter une touche naturelle à votre intérieur.",
    price: "42.00",
    currency: "EUR",
    images: [
      "https://placehold.co/800x800/F5F5DC/B85C38?text=Suspension+Paille"
    ],
    handle: "suspension-murale-paille",
    tags: ["paille", "décoration", "mural", "bohème"]
  },
  {
    title: "Boîte de Rangement en Bois",
    description: "Boîte artisanale en bois naturel avec couvercle. Idéale pour ranger vos petits objets avec style.",
    price: "28.00",
    currency: "EUR",
    images: [
      "https://placehold.co/800x800/D2B48C/282828?text=Boite+Bois"
    ],
    handle: "boite-rangement-bois",
    tags: ["bois", "rangement", "artisanal"]
  }
];

module.exports = exampleProducts;
```

## 🎁 Conclusion

Pour votre surprise:

1. **Créez 3-5 produits d'exemple** avec de belles photos placeholder
2. **Montrez le site fonctionnel** à votre frère
3. **Proposez d'importer** ensemble tous ses produits Etsy
4. **Utilisez l'API officielle** avec son accord

Cela vous permet de garder la surprise tout en restant légal et éthique! 🎉
