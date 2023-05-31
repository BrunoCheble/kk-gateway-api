import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ApisModule } from '../src/apis/apis.module';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { Cart } from '../src/apis/interfaces/cart';

describe('Apis - /apis (e2e)', () => {
  const productId = 123456;

  const products = [
    {
      productId: 123456,
      price: 10,
    },
    {
      productId: 123457,
      price: 11,
    },
    {
      productId: 1234568,
      price: 12,
    },
  ];

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), ApisModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Get a products list [GET]', async () => {
    return request(app.getHttpServer())
      .get(`/products`)
      .expect(200)
      .expect(products);
  });

  it('Get a cart [GET /:id]', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/carts/add-to-cart')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send({
        productId,
      })
      .expect(201);

    const { shoppingCartId } = body as Cart;

    return request(app.getHttpServer())
      .get(`/carts/${shoppingCartId}`)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty('shoppingCartId');
        expect(body).toHaveProperty('products');
      });
  });

  it('Add a product to a new cart [POST /to-add-cart]', async () => {
    return request(app.getHttpServer())
      .post('/carts/add-to-cart')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send({
        productId,
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).toHaveProperty('shoppingCartId');
        expect(body).toHaveProperty('products');
      });
  });

  it('Add a product to an existing cart [POST /to-add-cart]', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/carts/add-to-cart')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send({
        productId,
      })
      .expect(201);

    const { shoppingCartId } = body as Cart;

    return request(app.getHttpServer())
      .post('/carts/add-to-cart')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send({
        productId,
        shoppingCartId,
      })
      .expect(201)
      .then(({ body }) => {
        const { products } = body as Cart;
        const [product] = products;
        expect(product.quantity).toBe(2);
      });
  });

  it('Remove a product from a cart [PATCH /remove-from-cart]', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/carts/add-to-cart')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send({
        productId,
      })
      .expect(201);

    const { shoppingCartId } = body as Cart;

    await request(app.getHttpServer())
      .post('/carts/add-to-cart')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send({
        productId,
        shoppingCartId,
      })
      .expect(201);

    return request(app.getHttpServer())
      .patch('/carts/remove-from-cart')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send({
        productId,
        shoppingCartId,
      })
      .expect(200)
      .then(({ body }) => {
        const { products } = body as Cart;
        const [product] = products;
        expect(product.quantity).toBe(1);
      });
  });
});
