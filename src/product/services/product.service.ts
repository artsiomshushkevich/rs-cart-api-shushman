import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Product } from '../../shared/types';

@Injectable()
export class ProductService {
    constructor(private readonly httpService: HttpService) {}

    async findById(id: string): Promise<Product> {
        console.log(`${process.env.PRODUCTS_API_URL}/product/${id}`);
        const response: AxiosResponse<Product> = await this.httpService
            .get(`${process.env.PRODUCTS_API_URL}/product/${id}`)
            .toPromise();

        return response.data;
    }
}
