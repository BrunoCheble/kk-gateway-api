import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { ProductsController } from './products.controller';
import { CartsService } from './carts.service';
import { ProductsService } from './products.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CartsService, ProductsService],
  controllers: [CartsController, ProductsController],
})
export class ApisModule {}
