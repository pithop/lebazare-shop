// Produits d'exemple pour démonstration
// Ces produits seront utilisés si l'API Shopify n'est pas disponible

export const exampleProducts = [
  {
    id: 'example-1',
    title: 'Panier en Raphia Naturel Tressé',
    handle: 'panier-raphia-naturel-tresse',
    category: 'Vannerie',
    description: 'Magnifique panier artisanal tissé à la main en raphia naturel. Chaque pièce est unique et apporte une touche bohème authentique à votre intérieur. Parfait pour le rangement ou comme élément décoratif.',
    images: {
      edges: [
        {
          node: {
            url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop',
            altText: 'Panier en raphia naturel tressé à la main'
          }
        }
      ]
    },
    priceRange: {
      minVariantPrice: {
        amount: '35.00',
        currencyCode: 'EUR'
      }
    },
    variants: {
      edges: [
        {
          node: {
            id: 'variant-1',
            title: 'Default',
            priceV2: {
              amount: '35.00',
              currencyCode: 'EUR'
            },
            availableForSale: true
          }
        }
      ]
    }
  },
  {
    id: 'example-2',
    title: 'Suspension Murale en Paille',
    handle: 'suspension-murale-paille',
    category: 'Luminaires',
    description: 'Décoration murale unique en paille tressée. Design bohème et naturel qui apporte une touche chaleureuse à votre espace. Fabriqué à la main avec des matériaux durables.',
    images: {
      edges: [
        {
          node: {
            url: 'https://images.unsplash.com/photo-1615874694520-474822394e73?w=800&h=800&fit=crop',
            altText: 'Suspension murale en paille tressée'
          }
        }
      ]
    },
    priceRange: {
      minVariantPrice: {
        amount: '42.00',
        currencyCode: 'EUR'
      }
    },
    variants: {
      edges: [
        {
          node: {
            id: 'variant-2',
            title: 'Default',
            priceV2: {
              amount: '42.00',
              currencyCode: 'EUR'
            },
            availableForSale: true
          }
        }
      ]
    }
  },
  {
    id: 'example-3',
    title: 'Boîte de Rangement en Bois',
    handle: 'boite-rangement-bois',
    category: 'Bois',
    description: 'Boîte artisanale en bois naturel avec couvercle. Idéale pour ranger vos petits objets avec style. Chaque boîte est façonnée à la main et possède son caractère unique.',
    images: {
      edges: [
        {
          node: {
            url: 'https://images.unsplash.com/photo-1565794327396-44cf3c272c9b?w=800&h=800&fit=crop',
            altText: 'Boîte de rangement en bois naturel'
          }
        }
      ]
    },
    priceRange: {
      minVariantPrice: {
        amount: '28.00',
        currencyCode: 'EUR'
      }
    },
    variants: {
      edges: [
        {
          node: {
            id: 'variant-3',
            title: 'Default',
            priceV2: {
              amount: '28.00',
              currencyCode: 'EUR'
            },
            availableForSale: true
          }
        }
      ]
    }
  },
  {
    id: 'example-4',
    title: 'Set de Dessous de Plat en Raphia',
    handle: 'set-dessous-plat-raphia',
    category: 'Art de la table',
    description: 'Ensemble de 4 dessous de plat en raphia tressé. Protégez votre table avec style grâce à ces accessoires artisanaux et naturels. Résistants à la chaleur et faciles à nettoyer.',
    images: {
      edges: [
        {
          node: {
            url: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&h=800&fit=crop',
            altText: 'Set de dessous de plat en raphia tressé'
          }
        }
      ]
    },
    priceRange: {
      minVariantPrice: {
        amount: '24.00',
        currencyCode: 'EUR'
      }
    },
    variants: {
      edges: [
        {
          node: {
            id: 'variant-4',
            title: 'Set de 4',
            priceV2: {
              amount: '24.00',
              currencyCode: 'EUR'
            },
            availableForSale: true
          }
        }
      ]
    }
  },
  {
    id: 'example-5',
    title: 'Miroir Rond en Bois et Raphia',
    handle: 'miroir-rond-bois-raphia',
    category: 'Décoration',
    description: 'Miroir décoratif avec cadre en bois et détails en raphia. Pièce centrale parfaite pour une décoration bohème et naturelle. Diamètre 40cm.',
    images: {
      edges: [
        {
          node: {
            url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&h=800&fit=crop',
            altText: 'Miroir rond avec cadre en bois et raphia'
          }
        }
      ]
    },
    priceRange: {
      minVariantPrice: {
        amount: '56.00',
        currencyCode: 'EUR'
      }
    },
    variants: {
      edges: [
        {
          node: {
            id: 'variant-5',
            title: 'Diamètre 40cm',
            priceV2: {
              amount: '56.00',
              currencyCode: 'EUR'
            },
            availableForSale: true
          }
        }
      ]
    }
  },
  {
    id: 'example-6',
    title: 'Plateau en Bois de Manguier',
    handle: 'plateau-bois-manguier',
    category: 'Art de la table',
    description: 'Grand plateau de service en bois de manguier massif. Parfait pour servir vos boissons et collations avec élégance. Finition naturelle huilée.',
    images: {
      edges: [
        {
          node: {
            url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&h=800&fit=crop',
            altText: 'Plateau en bois de manguier massif'
          }
        }
      ]
    },
    priceRange: {
      minVariantPrice: {
        amount: '45.00',
        currencyCode: 'EUR'
      }
    },
    variants: {
      edges: [
        {
          node: {
            id: 'variant-6',
            title: 'Grand',
            priceV2: {
              amount: '45.00',
              currencyCode: 'EUR'
            },
            availableForSale: true
          }
        }
      ]
    }
  },
  {
    id: 'example-7',
    title: 'Corbeille à Pain en Paille',
    handle: 'corbeille-pain-paille',
    category: 'Vannerie',
    description: 'Corbeille à pain artisanale en paille naturelle. Garde votre pain frais tout en ajoutant une touche rustique à votre table. Lavable et durable.',
    images: {
      edges: [
        {
          node: {
            url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop',
            altText: 'Corbeille à pain en paille naturelle'
          }
        }
      ]
    },
    priceRange: {
      minVariantPrice: {
        amount: '32.00',
        currencyCode: 'EUR'
      }
    },
    variants: {
      edges: [
        {
          node: {
            id: 'variant-7',
            title: 'Moyen',
            priceV2: {
              amount: '32.00',
              currencyCode: 'EUR'
            },
            availableForSale: true
          }
        }
      ]
    }
  },
  {
    id: 'example-8',
    title: 'Vase en Bois Sculpté',
    handle: 'vase-bois-sculpte',
    category: 'Décoration',
    description: 'Vase décoratif en bois sculpté à la main. Chaque pièce est unique avec ses propres veines et nuances naturelles. Parfait pour des fleurs séchées ou comme objet décoratif.',
    images: {
      edges: [
        {
          node: {
            url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&h=800&fit=crop',
            altText: 'Vase en bois sculpté artisanalement'
          }
        }
      ]
    },
    priceRange: {
      minVariantPrice: {
        amount: '38.00',
        currencyCode: 'EUR'
      }
    },
    variants: {
      edges: [
        {
          node: {
            id: 'variant-8',
            title: 'Petit',
            priceV2: {
              amount: '38.00',
              currencyCode: 'EUR'
            },
            availableForSale: true
          }
        }
      ]
    }
  }
];
