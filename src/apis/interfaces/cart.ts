import { CartItem } from './cartitem';

export interface Cart {
  shoppingCartId: number;
  userId: number;
  totalPrice: number;
  totalQuantity: number;
  products: CartItem[];
}
