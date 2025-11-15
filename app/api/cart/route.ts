import { NextRequest, NextResponse } from 'next/server';
import { createCart, addToCart } from '@/lib/cart';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, variantId, quantity } = body;

    if (!variantId) {
      return NextResponse.json(
        { error: 'Variant ID is required' },
        { status: 400 }
      );
    }

    let cart;

    if (cartId) {
      // Add to existing cart
      try {
        cart = await addToCart(cartId, variantId, quantity || 1);
      } catch (error) {
        // If cart doesn't exist anymore, create a new one
        console.error('Error adding to cart, creating new cart:', error);
        cart = await createCart(variantId, quantity || 1);
      }
    } else {
      // Create new cart
      cart = await createCart(variantId, quantity || 1);
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Cart API error:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
