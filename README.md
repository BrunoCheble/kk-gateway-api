# Gateway API

### Notations

- You can execute **test:e2e**
- The AUTH_TOKEN is **eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c**

## Endpoints

**Get all products**
[GET] - http://localhost:3003/products

**View the Cart**

[GET] - http://localhost:3003/carts/:id

[AUTH] - Bearer <AUTH_TOKEN>

**Add a product to cart**

[POST] - http://localhost:3003/carts/add-to-cart

[AUTH] - Bearer <AUTH_TOKEN>

[BODY] - {

shoppingCartId?: Number,

productId: Number,

}

**NOTE:** *If the shoppingCartId attribute exists, add one product to the cart; otherwise, create a new cart with the added product*

**Remove a product from cart**

[PATCH] - http://localhost:3002/carts/remove-from-cart

[AUTH] - Bearer <AUTH_TOKEN>

[BODY] - {

shoppingCartId: Number,

productId: Number, 

}

**NOTE:** *If quantity product is zero, delete the product from cart and if there isn’t any product delete cart*
