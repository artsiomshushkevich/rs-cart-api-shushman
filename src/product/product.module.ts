import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductService } from './services';

@Module({
    imports: [HttpModule],
    exports: [ProductService],
    providers: [ProductService],
    controllers: []
})
export class ProductModule {}
