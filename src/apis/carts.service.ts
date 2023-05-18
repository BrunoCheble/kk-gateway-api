import { HttpService } from '@nestjs/axios';
import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { CreateCartProductBody } from './dtos/create-cartproduct';
import { RemoveCartProductBody } from './dtos/remove-cartproduct';
import { Cart } from './interfaces/cart';
import { FindOneCart } from './dtos/findone-cart';
import { ProductsService } from './products.service';

@Injectable()
export class CartsService {
  private readonly logger = new Logger(CartsService.name);
  constructor(
    private readonly httpService: HttpService,
    @Inject(ProductsService)
    private readonly productService: ProductsService,
  ) {}

  async addToCart({
    shoppingCartId,
    productId,
    userId,
  }: CreateCartProductBody): Promise<Cart> {
    const product = await this.productService.findOne(productId);

    const { data } = await firstValueFrom(
      this.httpService
        .post<Cart>(`${process.env.URL_CART_API}/carts/add-to-cart`, {
          shoppingCartId,
          product,
          userId,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    return data;
  }

  async removeCartProduct({
    shoppingCartId,
    productId,
    userId,
  }: RemoveCartProductBody): Promise<Cart> {
    const product = await this.productService.findOne(productId);

    const { data } = await firstValueFrom(
      this.httpService
        .patch<Cart>(`${process.env.URL_CART_API}/carts/remove-from-cart`, {
          shoppingCartId,
          product,
          userId,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    return data;
  }

  async viewCart({ shoppingCartId, userId }: FindOneCart): Promise<Cart> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Cart>(`${process.env.URL_CART_API}/carts/${shoppingCartId}`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    if (data && data.userId !== userId) {
      throw new HttpException("You can't see that cart!", 400);
    }
    return data;
  }
}
