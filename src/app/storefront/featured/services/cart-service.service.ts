import { computed, Injectable, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  private url = 'http://localhost:3000';

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

  // =====================================
  // 🛒 MAIN ADD TO CART
  // =====================================

  addToCart(product: any) {

    const customerId = localStorage.getItem('customer_id');

    if (!customerId) {
      this.addToGuestCart(product);
    } else {
      this.addToServerCart(product, customerId);
    }
  }

  // =====================================
  // 🟢 Guest Cart
  // =====================================

  private addToGuestCart(product: any) {

  console.log("Product received:", product);

  const sellingPrice =
    product?.price?.selling_price ??
    product?.selling_price ??
    product?.price ??
    0;

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
      price: Number(sellingPrice),
      quantity: 1
    };

    this.cartItemsSignal.update(items => [...items, newItem]);
  }

  localStorage.setItem(
    'guest_cart',
    JSON.stringify(this.cartItemsSignal())
  );

  console.log("Saved Cart:", this.cartItemsSignal());
}

  private loadGuestCart() {
    const data = localStorage.getItem('guest_cart');
    if (data) {
      this.cartItemsSignal.set(JSON.parse(data));
    }
  }

  // =====================================
  // 🔵 Server Cart
  // =====================================

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

    this.api.get<any[]>(
      `${this.url}/cart_items?cart_id=${cartId}&product_id=${product.id}`
    ).subscribe(items => {

      if (items.length) {

        const existing = items[0];
        const updatedQty = existing.quantity + 1;

        this.api.patch(
          `${this.url}/cart_items/${existing.id}`,
          { quantity: updatedQty }
        ).subscribe(() => {

          this.cartItemsSignal.update(list =>
            list.map(i =>
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
          price: product.price.selling_price,
          quantity: 1
        };

        this.api.post<any>(
          `${this.url}/cart_items`,
          newItem
        ).subscribe(created => {

          this.cartItemsSignal.update(list => [...list, created]);
        });
      }

    });
  }

  // =====================================
  // ❌ REMOVE
  // =====================================

  removeFromCart(item: any) {

    const customerId = localStorage.getItem('customer_id');

    if (!customerId) {

      this.cartItemsSignal.update(items =>
        items.filter(i => i.product_id !== item.product_id)
      );

      localStorage.setItem(
        'guest_cart',
        JSON.stringify(this.cartItemsSignal())
      );

    } else {

      this.api.delete( `${this.url}/cart_items/${item.id}`).subscribe(() => {

        this.cartItemsSignal.update(items =>
          items.filter(i => i.product_id !== item.product_id)
        );
      });
    }
  }
// =====================================
// 🔄 MERGE GUEST CART AFTER LOGIN
// =====================================

mergeGuestCartAfterLogin(customerId: string) {

  const guestCart = localStorage.getItem('guest_cart');

  if (!guestCart) return;

  const items = JSON.parse(guestCart);

  items.forEach((item: any) => {

    const product = {
      id: item.product_id,
      price: item.price
    };

    this.addToServerCart(product, customerId);
  });

  // clear guest cart
  localStorage.removeItem('guest_cart');
  this.cartItemsSignal.set([]);
}

}
