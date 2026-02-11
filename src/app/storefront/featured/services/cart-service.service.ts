import { computed, Injectable, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  private url = 'http://localhost:3000';

  // 🧠 Cart State
  private cartItemsSignal = signal<any[]>([]);
  cartItems = this.cartItemsSignal.asReadonly();

  // 🛍 Count
  cartCount = computed(() =>
    this.cartItemsSignal().reduce((t, i) => t + i.quantity, 0)
  );

  // 💰 Total
  cartTotal = computed(() =>
    this.cartItemsSignal().reduce((t, i) => t + i.price * i.quantity, 0)
  );

  constructor(private api: ApiService) {
    this.loadGuestCart();
  }

  // ===============================
  // 🛒 MAIN ADD TO CART METHOD
  // ===============================

  addToCart(product: any) {

    const customerId = localStorage.getItem('customer_id');

    if (!customerId) {
      // 🟢 Guest Cart
      this.addToGuestCart(product);
    } else {
      // 🟢 Logged In Cart
      this.addToServerCart(product, customerId);
    }
  }

  // ===============================
  // 🟢 Guest Cart (LocalStorage)
  // ===============================

  private addToGuestCart(product: any) {

    const existing = this.cartItemsSignal()
      .find(i => i.product_id === product.id);

    if (existing) {

      this.cartItemsSignal.update(items =>
        items.map(i =>
          i.product_id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );

    } else {

      const newItem = {
        product_id: product.id,
        price: product.price,
        quantity: 1
      };

      this.cartItemsSignal.update(items => [...items, newItem]);
    }

    localStorage.setItem('guest_cart',
      JSON.stringify(this.cartItemsSignal()));
  }

  private loadGuestCart() {
    const data = localStorage.getItem('guest_cart');
    if (data) {
      this.cartItemsSignal.set(JSON.parse(data));
    }
  }

  // ===============================
  // 🟢 Server Cart (Login User)
  // ===============================

  private addToServerCart(product: any, customerId: string) {

    this.api.get<any[]>(`${this.url}/carts?customer_id=${customerId}`)
      .subscribe(carts => {

        if (!carts.length) {

          this.api.post<any>(`${this.url}/carts`, {
            customer_id: customerId
          }).subscribe(newCart => {

            this.insertItem(product, newCart.id);
          });

        } else {

          this.insertItem(product, carts[0].id);
        }
      });
  }

  private insertItem(product: any, cartId: number) {

    const existing = this.cartItemsSignal()
      .find(i => i.product_id === product.id);

    if (existing) {

      const updatedQty = existing.quantity + 1;

      this.api.patch(`${this.url}/cart_items/${existing.id}`, {
        quantity: updatedQty
      }).subscribe(() => {

        this.cartItemsSignal.update(items =>
          items.map(i =>
            i.product_id === product.id
              ? { ...i, quantity: updatedQty }
              : i
          )
        );
      });

    } else {

      const newItem = {
        cart_id: cartId,
        product_id: product.id,
        price: product.price,
        quantity: 1
      };

      this.api.post<any>(`${this.url}/cart_items`, newItem)
        .subscribe(created => {

          this.cartItemsSignal.update(items => [...items, created]);
        });
    }
  }
}
