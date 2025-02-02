import { Controller, Get, Delete, Put, Body, Post, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { OrderService, Order } from '../order';
import { calculateCartTotal } from './models-rules';
import { CartService } from './services';
import { CartItem } from './models';
import { getPoolClient } from '../shared';

// as I didn't implement user API, hardcoded uuid will be  used down the controller (but it's stored in DB as required for the task)
const USER_UUID = 'f8c3834a-4cde-41a1-8274-aacba7651f20';

@Controller('api/profile/cart')
export class CartController {
    constructor(private cartService: CartService, private orderService: OrderService) {}

    @Get()
    async findUserCart() {
        const client = await getPoolClient();
        this.cartService.setClient(client);

        const cart = await this.cartService.findOrCreateByUserId(USER_UUID);

        this.cartService.releaseAndCleanClient();

        return {
            statusCode: HttpStatus.OK,
            message: 'OK',
            data: { cart, total: calculateCartTotal(cart) }
        };
    }

    @Put()
    async updateUserCart(@Body() body) {
        const client = await getPoolClient();
        this.cartService.setClient(client);

        const cart = await this.cartService.updateByUserId(USER_UUID, body as CartItem);

        this.cartService.releaseAndCleanClient();

        return {
            statusCode: HttpStatus.OK,
            message: 'OK',
            data: {
                cart,
                total: calculateCartTotal(cart)
            }
        };
    }

    @Delete()
    async clearUserCart() {
        const client = await getPoolClient();
        this.cartService.setClient(client);

        await this.cartService.removeByUserId(USER_UUID);

        this.cartService.releaseAndCleanClient();

        return {
            statusCode: HttpStatus.OK,
            message: 'OK'
        };
    }

    @Post('checkout')
    async checkout(@Body() body: any) {
        const client = await getPoolClient();
        this.cartService.setClient(client);
        this.orderService.setClient(client);

        try {
            await client.query('BEGIN');

            const cart = await this.cartService.findByUserId(USER_UUID);

            if (!(cart && cart.items.length)) {
                const statusCode = HttpStatus.BAD_REQUEST;

                return {
                    statusCode,
                    message: 'Cart is empty'
                };
            }

            const { id: cartId } = cart;
            const total = calculateCartTotal(cart);

            const order: Order = {
                id: uuidv4(),
                userId: USER_UUID,
                cartId: cartId,
                total,
                comments: body.address.comment || '',
                delivery: {
                    type: 'STANDARD',
                    address: {
                        address: body.address.address,
                        firstName: body.address.firstName,
                        lastName: body.address.lastName
                    }
                },
                payment: body.payment,
                status: 'IN_PROGRESS',
                items: cart.items
            };

            await this.orderService.create({
                id: order.id,
                userId: order.userId,
                cartId: order.cartId,
                total: order.total,
                comments: order.comments,
                address: JSON.stringify(order.delivery.address),
                payment: JSON.stringify(order.payment),
                status: order.status
            });

            // for demostration purposes
            if (order.comments === 'error') {
                throw new Error('error to demostrate rollback');
            }

            await this.cartService.updateStatus(cart.id, USER_UUID, 'ORDERED');

            await client.query('COMMIT');
            return {
                statusCode: HttpStatus.OK,
                message: 'OK',
                data: { order }
            };
        } catch (err) {
            await client.query('ROLLBACK');
            console.log(err);

            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error'
            };
        } finally {
            this.cartService.releaseAndCleanClient();
            this.orderService.setClient(null);
        }
    }
}
