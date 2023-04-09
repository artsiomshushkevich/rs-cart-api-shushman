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

export const cartRowsToCarts = (rows: CartRow[], products: Product[]): Cart[] => {
    const carts: Cart[] = [];

    rows.forEach(row => {
        const cart = carts.find(cart => cart.id === row.cart_id);

        if (cart) {
            cart.items.push({
                product: products.find(product => product.id === row.product_id),
                count: row.count
            });
        } else {
            carts.push({
                id: row.cart_id,
                items: [
                    {
                        product: products.find(product => product.id === row.product_id),
                        count: row.count
                    }
                ]
            });
        }
    });

    return carts;
};
