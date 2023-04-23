import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';

@Module({
    imports: [ConfigModule.forRoot(), CartModule, OrderModule, ProductModule],
    controllers: [AppController],
    providers: []
})
export class AppModule {}
