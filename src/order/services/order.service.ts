import { Injectable } from '@nestjs/common';
import { OrderToInsert } from '../models';
import { PoolClient } from 'pg';

const INSERT_ORDER = `
  insert into orders (id, user_id, cart_id, status, payment, address, comments, total)
  values ($1, $2, $3, $4, $5, $6, $7, $8)
`;

@Injectable()
export class OrderService {
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

    async create(data: OrderToInsert): Promise<boolean> {
        await this.getClient().query(INSERT_ORDER, [
            data.id,
            data.userId,
            data.cartId,
            data.status,
            data.payment,
            data.address,
            data.comments || '',
            data.total
        ]);

        return true;
    }
}
