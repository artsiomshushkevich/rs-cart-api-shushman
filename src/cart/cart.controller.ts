import { Controller, Get, Delete, Put, Body, Req, Post, HttpStatus } from '@nestjs/common';
// import { Request } from 'express';
import { OrderService } from '../order';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services';
import { CartItem } from './models';

// as I didn't impmenet user API hardcoded uuid is used (but it's stored in DB as required for the task)
const USER_UUID = 'f8c3834a-4cde-41a1-8274-aacba7651f20';

@Controller('api/profile/cart')
export class CartController {
    constructor(private cartService: CartService, private orderService: OrderService) {}

    @Get()
    async findUserCart() {
        const cart = await this.cartService.findOrCreateByUserId(USER_UUID);

        return {
            statusCode: HttpStatus.OK,
            message: 'OK',
            data: { cart, total: calculateCartTotal(cart) }
        };
    }

    @Put()
    async updateUserCart(@Body() body) {
        const cart = await this.cartService.updateByUserId(USER_UUID, body as CartItem);

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
        await this.cartService.removeByUserId(USER_UUID);

        return {
            statusCode: HttpStatus.OK,
            message: 'OK'
        };
    }

    // @Post('checkout')
    // checkout(@Req() req: Request, @Body() body) {
    //     const userId = '';
    //     const cart = this.cartService.findByUserId(userId);

    //     if (!(cart && cart.items.length)) {
    //         const statusCode = HttpStatus.BAD_REQUEST;
    //         req.statusCode = statusCode;

    //         return {
    //             statusCode,
    //             message: 'Cart is empty'
    //         };
    //     }

    //     const { id: cartId, items } = cart;
    //     const total = calculateCartTotal(cart);
    //     const order = this.orderService.create({
    //         ...body, // TODO: validate and pick only necessary data
    //         userId,
    //         cartId,
    //         items,
    //         total
    //     });
    //     this.cartService.removeByUserId(userId);

    //     return {
    //         statusCode: HttpStatus.OK,
    //         message: 'OK',
    //         data: { order }
    //     };
    // }
}
