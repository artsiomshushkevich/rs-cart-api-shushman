import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { ProductModule } from '../product';

@Module({
    imports: [OrderModule, ProductModule],
    providers: [CartService],
    controllers: [CartController]
})
export class CartModule {}
