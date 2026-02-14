import { Injectable, signal, computed } from '@angular/core';
import { ApiService } from '../../../core/services/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  private url = 'http://localhost:3000';

  // ================================
  // 🧠 STATE
  // ================================

  private cartItemsSignal = signal<any[]>([]);
  cartItems = this.cartItemsSignal.asReadonly();

  cartCount = computed(() =>
    this.cartItemsSignal().reduce((t, i) => t + i.quantity, 0)
  );

  cartTotal = computed(() =>
    this.cartItemsSignal().reduce((t, i) => t + i.price * i.quantity, 0)
  );

  constructor(private api: ApiService) {
    this.initializeCart();
  }

  // ======================================
  // 🚀 INITIAL LOAD
  // ======================================

  private initializeCart() {
    const customerId = localStorage.getItem('customer_id');

    if (customerId) {
      this.loadServerCart(customerId);
    } else {
      this.loadGuestCart();
    }
  }

  // ======================================
  // 🛒 MAIN ADD TO CART
  // ======================================

  addToCart(product: any) {
    const customerId = localStorage.getItem('customer_id');

    if (!customerId) {
      this.addToGuestCart(product);
    } else {
      this.addToServerCart(product, customerId);
    }
  }

  // ======================================
  // 🟢 GUEST CART
  // ======================================

  private addToGuestCart(product: any) {

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
  }

  private loadGuestCart() {
    const data = localStorage.getItem('guest_cart');
    if (data) {
      this.cartItemsSignal.set(JSON.parse(data));
    }
  }

  // ======================================
  // 🔵 SERVER CART
  // ======================================

  private addToServerCart(product: any, customerId: string) {

    this.getOrCreateCart(customerId, (cartId: number) => {

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

            this.loadServerCart(customerId);
          });

        } else {

          const newItem = {
            cart_id: cartId,
            product_id: product.id,
            price: product?.price?.selling_price ?? product.price,
            quantity: 1
          };

          this.api.post(`${this.url}/cart_items`, newItem)
            .subscribe(() => {

              this.loadServerCart(customerId);
            });
        }
      });
    });
  }

  private getOrCreateCart(customerId: string, callback: (cartId: number) => void) {

    this.api.get<any[]>(
      `${this.url}/carts?customer_id=${customerId}`
    ).subscribe(carts => {

      if (carts.length) {
        callback(carts[0].id);
      } else {

        this.api.post<any>(
          `${this.url}/carts`,
          { customer_id: customerId }
        ).subscribe(newCart => {

          callback(newCart.id);
        });
      }
    });
  }

  loadServerCart(customerId: string) {

    this.api.get<any[]>(
      `${this.url}/carts?customer_id=${customerId}`
    ).subscribe(carts => {

      if (!carts.length) {
        this.cartItemsSignal.set([]);
        return;
      }

      const cartId = carts[0].id;

      this.api.get<any[]>(
        `${this.url}/cart_items?cart_id=${cartId}`
      ).subscribe(items => {

        this.cartItemsSignal.set(items);
      });
    });
  }

  // ======================================
  // ❌ REMOVE
  // ======================================

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

      this.api.delete(
        `${this.url}/cart_items/${item.id}`
      ).subscribe(() => {

        this.loadServerCart(customerId);
      });
    }
  }

  // ======================================
  // 🔄 MERGE GUEST CART AFTER LOGIN
  // ======================================

  mergeGuestCartAfterLogin(customerId: string) {

    const guestCart = localStorage.getItem('guest_cart');
    if (!guestCart) return;

    const items = JSON.parse(guestCart);

    this.getOrCreateCart(customerId, (cartId: number) => {

      items.forEach((item: any) => {

        this.api.get<any[]>(
          `${this.url}/cart_items?cart_id=${cartId}&product_id=${item.product_id}`
        ).subscribe(existing => {

          if (existing.length) {

            const updatedQty =
              existing[0].quantity + item.quantity;

            this.api.patch(
              `${this.url}/cart_items/${existing[0].id}`,
              { quantity: updatedQty }
            ).subscribe();

          } else {

            this.api.post(
              `${this.url}/cart_items`,
              {
                cart_id: cartId,
                product_id: item.product_id,
                price: item.price,
                quantity: item.quantity
              }
            ).subscribe();
          }
        });
      });

      localStorage.removeItem('guest_cart');
      this.loadServerCart(customerId);
    });
  }


  /* ---------------- Increase ------------------ */
  increaseQty(item: any) {

  const customerId = localStorage.getItem('customer_id');

  if (!customerId) {

    // 🟢 Guest cart
    this.cartItemsSignal.update(items =>
      items.map(i =>
        i.product_id === item.product_id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );

    localStorage.setItem(
      'guest_cart',
      JSON.stringify(this.cartItemsSignal())
    );

  } else {

    // 🔵 Server cart
    const updatedQty = item.quantity + 1;

    this.api.patch(
      `${this.url}/cart_items/${item.id}`,
      { quantity: updatedQty }
    ).subscribe(() => {

      this.loadServerCart(customerId);
    });
  }
}
/* ------------------- Decrease ------------------------- */
decreaseQty(item: any) {

  const customerId = localStorage.getItem('customer_id');

  if (item.quantity <= 1) {
    this.removeFromCart(item);
    return;
  }

  if (!customerId) {

    // 🟢 Guest cart
    this.cartItemsSignal.update(items =>
      items.map(i =>
        i.product_id === item.product_id
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
    );

    localStorage.setItem(
      'guest_cart',
      JSON.stringify(this.cartItemsSignal())
    );

  } else {

    // 🔵 Server cart
    const updatedQty = item.quantity - 1;

    this.api.patch(
      `${this.url}/cart_items/${item.id}`,
      { quantity: updatedQty }
    ).subscribe(() => {

      this.loadServerCart(customerId);
    });
  }
}
// 🚚 Shipping Cost
shippingCost = computed(() => {
  return this.cartTotal() > 500 ? 0 : 70;
});

// 💰 Grand Total
grandTotal = computed(() => {
  return this.cartTotal() + this.shippingCost();
});


clearCart(customerId?: string) {

  // ✅ Clear signal correctly
  this.cartItemsSignal.set([]);

  // Clear guest cart
  localStorage.removeItem('guest_cart');

  if (!customerId) return;

  // 🔵 Clear server cart properly
  this.api.get<any[]>(
    `${this.url}/carts?customer_id=${customerId}`
  ).subscribe(carts => {

    if (!carts.length) return;

    const cartId = carts[0].id;

    this.api.get<any[]>(
      `${this.url}/cart_items?cart_id=${cartId}`
    ).subscribe(items => {

      items.forEach(item => {
        this.api.delete(
          `${this.url}/cart_items/${item.id}`
        ).subscribe();
      });

    });
  });
}

}
