import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { Cart } from '../models';

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

    findOrCreateByUserId(userId: string): any {
        console.log(JSON.stringify(process.env));
        const client = new Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectionTimeoutMillis: 5000
        });

        return client
            .connect()
            .then(() => console.log('connected'))
            .catch(err => console.error('connection error', err.stack));

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
        const { id, ...rest } = this.findOrCreateByUserId(userId);

        const updatedCart = {
            id,
            ...rest,
            items: [...items]
        };

        this.userCarts[userId] = { ...updatedCart };

        return { ...updatedCart };
    }

    removeByUserId(userId): void {
        this.userCarts[userId] = null;
    }
}
