import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';

@Module({
    imports: [CartModule, OrderModule, ProductModule],
    controllers: [AppController],
    providers: []
})
export class AppModule {}
