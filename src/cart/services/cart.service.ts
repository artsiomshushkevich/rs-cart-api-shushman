import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { Cart } from '../models';
import { getPoolClient } from 'src/utils/pgpool';

@Injectable()
export class CartService {
    private userCarts: Record<string, Cart> = {};

    findByUserId(userId: string): Cart {
        return this.userCarts[userId];
    }

    createByUserId(userId: string) {
        // return new Promise(onResolve => {
        //     client.query('SELECT * FROM carts', [userId], (err, res) => {
        //         if (err) {
        //             console.log(err.stack);
        //         } else {
        //             onResolve(res.rows[0]);
        //         }
        //     });
        // });
        // const id = v4(v4());
        // const userCart = {
        //     id,
        //     items: []
        // };
        // this.userCarts[userId] = userCart;
        // return userCart;
    }

    async findOrCreateByUserId(userId: string): Promise<any> {
        const client = await getPoolClient();
        const result = await client.query('SELECT * FROM carts');
        client.release();

        return result;

        // return new Promise(onResolve => {
        //     client.query('SELECT * FROM carts', (err, res) => {
        //         if (err) {
        //             console.log(err.stack);
        //         } else {
        //             onResolve(JSON.stringify(res));
        //         }
        //     });
        // });

        // return this.createByUserId(userId);
    }

    updateByUserId(userId: string, { items }: Cart): Cart {
        return {} as any;
        // const { id, ...rest } = this.findOrCreateByUserId(userId);

        // const updatedCart = {
        //     id,
        //     ...rest,
        //     items: [...items]
        // };

        // this.userCarts[userId] = { ...updatedCart };

        // return { ...updatedCart };
    }

    removeByUserId(userId): void {
        this.userCarts[userId] = null;
    }
}
