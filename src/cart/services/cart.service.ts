import { Injectable } from '@nestjs/common';
import { Cart, CartItem, CartRow, CartStatus } from '../models';
import { ProductService } from '../../product/services';
import { cartRowsToCart } from '../models-rules';
import { PoolClient } from 'pg';

const SELECT_CARTS = 'select * from carts';

const SELECT_CART_BY_USER_ID = `
    ${SELECT_CARTS} 
    LEFT JOIN cart_items
        ON carts.id = cart_items.cart_id
    WHERE user_id = $1
`;

const INSERT_CART = `
    INSERT INTO carts (user_id)
    VALUES ($1)
`;

const DELETE_CART_BY_USER_ID = `delete from carts where user_id = $1`;

const UPDATE_CART_STATUS_BY_USER__CART_IDS = 'update carts set status = $1 where user_id = $2 and id = $3';

const INSERT_CART_ITEM_BY_CART_ID = 'insert into cart_items (cart_id, product_id, count) VALUES ($1, $2, $3)';

const DELETE_CART_ITEM_BY_CART_PRODUCT_IDS = 'DELETE FROM cart_items where cart_id = $1 and product_id = $2';

@Injectable()
export class CartService {
    constructor(private readonly productService: ProductService) {}

    private client: PoolClient | null;

    setClient(client: PoolClient | null) {
        this.client = client;
    }

    getClient() {
        return this.client;
    }

    releaseAndCleanClient() {
        if (this.client) {
            this.client.release();
            this.client = null;
        }
    }

    async findByUserId(userId: string): Promise<Cart | null> {
        const result = await this.getClient().query<CartRow>(SELECT_CART_BY_USER_ID, [userId]);

        const uniqueProducts = [...new Set(result.rows.map(row => row.product_id))].filter(product => !!product);

        const products = await Promise.all(uniqueProducts.map(id => this.productService.findById(id)));

        return cartRowsToCart(result.rows, products);
    }

    async createByUserId(userId: string) {
        await this.getClient().query(INSERT_CART, [userId]);

        return true;
    }

    async findOrCreateByUserId(userId: string): Promise<Cart> {
        const cart = await this.findByUserId(userId);

        if (!cart) {
            await this.createByUserId(userId);

            return await this.findByUserId(userId);
        }

        return cart;
    }

    async updateStatus(cartId: string, userId: string, status: CartStatus): Promise<boolean> {
        await this.getClient().query(UPDATE_CART_STATUS_BY_USER__CART_IDS, [status, userId, cartId]);

        return true;
    }

    async updateByUserId(userId: string, cartItem: CartItem): Promise<Cart> {
        const cart = await this.findOrCreateByUserId(userId);

        if (cartItem.count === 0) {
            await this.getClient().query(DELETE_CART_ITEM_BY_CART_PRODUCT_IDS, [cart.id, cartItem.product.id]);
            return {
                ...cart,
                items: cart.items.filter(item => item.product.id !== cartItem.product.id)
            };
        }

        await this.getClient().query(DELETE_CART_ITEM_BY_CART_PRODUCT_IDS, [cart.id, cartItem.product.id]);
        await this.getClient().query(INSERT_CART_ITEM_BY_CART_ID, [cart.id, cartItem.product.id, cartItem.count]);

        const existingItem = cart.items.find(item => item.product.id === cartItem.product.id);

        if (existingItem) {
            existingItem.count = cartItem.count;
        } else {
            cart.items.push(cartItem);
        }

        return cart;
    }

    async removeByUserId(userId) {
        await this.getClient().query(DELETE_CART_BY_USER_ID, [userId]);

        return true;
    }
}
