import { Product } from '../../shared/types';
import { Cart, CartItem, CartRow } from '../models';

/**
 * @param {Cart} cart
 * @returns {number}
 */
export function calculateCartTotal(cart: Cart): number {
    return cart
        ? cart.items.reduce((acc: number, { product: { price }, count }: CartItem) => {
              return (acc += price * count);
          }, 0)
        : 0;
}

export const cartRowsToCart = (rows: CartRow[], products: Product[]): Cart | null => {
    let cart: Cart | null;

    rows.forEach(row => {
        if (cart && products.length) {
            cart.items.push({
                product: products.find(product => product.id === row.product_id),
                count: row.count
            });
        } else if (!cart && products.length) {
            cart = {
                id: row.cart_id,
                items: [
                    {
                        product: products.find(product => product.id === row.product_id),
                        count: row.count
                    }
                ]
            };
        } else if (!cart && !products.length) {
            cart = {
                id: row.id,
                items: []
            };
        }
    });

    return cart;
};
