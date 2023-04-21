import type { Product } from '../../shared/types';

export type CartItem = {
    product: Product;
    count: number;
};

export type Cart = {
    id: string;
    items: CartItem[];
};

export type CartStatus = 'ORDERED' | 'OPEN';

export type CartRow = {
    id: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
    cart_status: CartStatus;
    cart_id: string;
    product_id: string;
    count: number;
};
