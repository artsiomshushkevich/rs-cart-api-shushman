import { Injectable } from '@nestjs/common';
import { Cart, CartRow } from '../models';
import { pool } from '../../shared';
import { ProductService } from '../../product/services';
import { cartRowsToCarts } from '../models-rules';
const SELECT_CARTS = 'select * from carts';

const SELECT_CART_BY_USER_ID = `
    ${SELECT_CARTS} 
    INNER JOIN cart_items
        ON carts.id = cart_items.cart_id
    WHERE user_id = $1
`;

// const DELETE_CART_BY_USER_ID = `delete from carts where user_id = $1`;

@Injectable()
export class CartService {
    constructor(private readonly productService: ProductService) {}

    async findByUserId(userId: string): Promise<Cart | null> {
        const result = await pool.query<CartRow>(SELECT_CART_BY_USER_ID, [userId]);
        console.log('result rows!!!', result.rows);

        const uniqueProducts = [...new Set(result.rows.map(row => row.product_id))];

        const products = await Promise.all(uniqueProducts.map(id => this.productService.findById(id)));
        console.log('producs!!!!!', products);
        return cartRowsToCarts(result.rows, products)[0] || null;
    }

    // createByUserId(userId: string) {
    //     // return new Promise(onResolve => {
    //     //     client.query('SELECT * FROM carts', [userId], (err, res) => {
    //     //         if (err) {
    //     //             console.log(err.stack);
    //     //         } else {
    //     //             onResolve(res.rows[0]);
    //     //         }
    //     //     });
    //     // });
    //     // const id = v4(v4());
    //     // const userCart = {
    //     //     id,
    //     //     items: []
    //     // };
    //     // this.userCarts[userId] = userCart;
    //     // return userCart;
    // }

    async findOrCreateByUserId(userId: string): Promise<any> {
        return await this.findByUserId(userId);
    }

    // updateByUserId(userId: string, { items }: Cart): Cart {
    //     return {} as any;
    //     // const { id, ...rest } = this.findOrCreateByUserId(userId);

    //     // const updatedCart = {
    //     //     id,
    //     //     ...rest,
    //     //     items: [...items]
    //     // };

    //     // this.userCarts[userId] = { ...updatedCart };

    //     // return { ...updatedCart };
    // }

    // removeByUserId(userId): any {
    //     const result = pool.query(DELETE_CART_BY_USER_ID, [userId]);

    //     return result;
    // }
}
