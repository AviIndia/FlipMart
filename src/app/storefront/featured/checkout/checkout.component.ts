import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { StorefrontService } from '../services/storefront.service';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartServiceService } from '../services/cart-service.service';
import { OrderService } from '../services/order.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule,FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
products: any[] = [];
  buyerAddress:any[]=[];
  selectedAddressId: any;

selectedPayment: string = 'COD';

  constructor(private api:StorefrontService,public cartService: CartServiceService,private orderApi:OrderService){}
  ngOnInit():void
  {
    this.getSingleUserAddress();this.loadProducts();
  }

  getSingleUserAddress()
  {
    const role = localStorage.getItem('role');
    const customer_id = localStorage.getItem('customer_id');
    this.api.singleBuyer(customer_id).subscribe({
      next:(res:any[])=>{
        this.buyerAddress = res[0].addresses;
        console.log(this.buyerAddress);
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

loadProducts() {
  this.api.getProducts().subscribe({
    next:(data:any)=>{
      this.products = data;
      console.log(data);
    },
    error:(err)=>{
      console.log(err)
    }
  })
}

  cartWithProduct() {
    return this.cartService.cartItems().map(cartItem => {

      const product = this.products.find(
        p => p.id === cartItem.product_id
      );

      return {
        ...cartItem,
        product_name: product?.product_name
      };
    });
  }

  placeOrder() {

  if (!this.selectedAddressId) {
    alert("Please select address");
    return;
  }

  const customerId = localStorage.getItem('customer_id');

  if (!customerId) {
    alert("User not logged in");
    return;
  }

  const orderId = 'ORD' + Math.floor(1000 + Math.random() * 9000);

  const cartItems = this.cartService.cartItems(); // ✅ get signal value

  cartItems.forEach(item => {

    const orderData = {
      order_id: orderId,
      product_id: item.product_id,
      customer_id: customerId,
      qty: item.quantity,
      price: item.price,
      total_price: item.price * item.quantity,
      payment_type: this.selectedPayment,
      address_id: this.selectedAddressId,
      expected_delivery_date: this.getExpectedDeliveryDate()
    };

    this.orderApi.placeOrder(orderData)
      .subscribe({
        next: (res) => console.log('Order saved', res),
        error: (err) => console.error(err)
      });

  });

  alert("Order Placed Successfully 🎉");

  this.cartService.clearCart(customerId);
}
 getExpectedDeliveryDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toISOString().split('T')[0];
  }
}
