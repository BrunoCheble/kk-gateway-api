import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Product } from './interfaces/product';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(private readonly httpService: HttpService) {}

  async findOne(productId: number): Promise<Product> {
    const { data: product } = await firstValueFrom(
      this.httpService
        .get<Product>(`${process.env.URL_PRODUCT_API}/products/${productId}`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    if (!product) {
      throw new HttpException('Product not found!', 400);
    }

    return product;
  }

  async listProducts(): Promise<Product[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Product[]>(`${process.env.URL_PRODUCT_API}/products`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    return data;
  }
}
