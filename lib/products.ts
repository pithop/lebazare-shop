import { shopifyFetch } from './shopify';
import { Product } from './types';

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            priceV2 {
              amount
              currencyCode
            }
            availableForSale
          }
        }
      }
    }
  }
`;

export async function getAllProducts(limit: number = 20): Promise<Product[]> {
  const response = await shopifyFetch<{
    products: {
      edges: Array<{ node: Product }>;
    };
  }>({
    query: PRODUCTS_QUERY,
    variables: { first: limit },
  });

  return response.products.edges.map((edge) => edge.node);
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const response = await shopifyFetch<{
    productByHandle: Product | null;
  }>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });

  return response.productByHandle;
}
