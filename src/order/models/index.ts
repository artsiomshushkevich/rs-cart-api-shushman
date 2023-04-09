import { CartItem } from '../../cart/models';

export type Order = {
    id?: string;
    userId: string;
    cartId: string;
    items: CartItem[];
    payment: {
        type: string;
        address?: any;
        creditCard?: any;
    };
    delivery: {
        type: string;
        address: any;
    };
    comments: string;
    status: string;
    total: number;
};

export type OrderToInsert = {
    id: string;
    userId: string;
    cartId: string;
    payment: string;
    comments?: string;
    total: number;
    status: string;
    address: string;
};
