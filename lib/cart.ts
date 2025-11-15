import { shopifyFetch } from './shopify';
import { Cart } from './types';

const CREATE_CART_MUTATION = `
  mutation CreateCart($lineItems: [CartLineInput!]) {
    cartCreate(input: { lines: $lineItems }) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

const ADD_TO_CART_MUTATION = `
  mutation AddToCart($cartId: ID!, $lineItems: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lineItems) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

const UPDATE_CART_MUTATION = `
  mutation UpdateCart($cartId: ID!, $lineId: ID!, $quantity: Int!) {
    cartLinesUpdate(
      cartId: $cartId
      lines: [{ id: $lineId, quantity: $quantity }]
    ) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

const REMOVE_FROM_CART_MUTATION = `
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export async function createCart(variantId: string, quantity: number = 1): Promise<Cart> {
  const response = await shopifyFetch<{
    cartCreate: { cart: Cart };
  }>({
    query: CREATE_CART_MUTATION,
    variables: {
      lineItems: [
        {
          merchandiseId: variantId,
          quantity,
        },
      ],
    },
  });

  return response.cartCreate.cart;
}

export async function addToCart(cartId: string, variantId: string, quantity: number = 1): Promise<Cart> {
  const response = await shopifyFetch<{
    cartLinesAdd: { cart: Cart };
  }>({
    query: ADD_TO_CART_MUTATION,
    variables: {
      cartId,
      lineItems: [
        {
          merchandiseId: variantId,
          quantity,
        },
      ],
    },
  });

  return response.cartLinesAdd.cart;
}

export async function updateCartItem(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  const response = await shopifyFetch<{
    cartLinesUpdate: { cart: Cart };
  }>({
    query: UPDATE_CART_MUTATION,
    variables: {
      cartId,
      lineId,
      quantity,
    },
  });

  return response.cartLinesUpdate.cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const response = await shopifyFetch<{
    cartLinesRemove: { cart: Cart };
  }>({
    query: REMOVE_FROM_CART_MUTATION,
    variables: {
      cartId,
      lineIds,
    },
  });

  return response.cartLinesRemove.cart;
}
