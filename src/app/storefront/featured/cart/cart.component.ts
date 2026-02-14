import { Component } from '@angular/core';
import { FooterComponent } from "../../shared/footer/footer.component";
import { HeaderComponent } from "../../shared/header/header.component";
import { CartServiceService } from '../services/cart-service.service';
import { CommonModule } from '@angular/common';
import { StorefrontService } from '../services/storefront.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  products: any[] = [];
constructor(public cartService:CartServiceService,private api:StorefrontService){}

ngOnInit() {
  this.loadProducts();
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
      product_name: product?.product_name,
      description:product?.description,
      image: product?.image,
      price: cartItem.price,
      quantity: cartItem.quantity
    };
  });
}
}
