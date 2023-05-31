import { Controller, Get, Param } from '@nestjs/common';

import { ProductsService } from './products.service';
import { Product } from './interfaces/product';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}
  @Get('')
  findAll(): Promise<Product[]> {
    return this.productService.listProducts();
  }
}
