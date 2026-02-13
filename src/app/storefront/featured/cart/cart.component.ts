import { Component } from '@angular/core';
import { FooterComponent } from "../../shared/footer/footer.component";
import { HeaderComponent } from "../../shared/header/header.component";
import { CartServiceService } from '../services/cart-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FooterComponent, HeaderComponent,CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
constructor(public cartService:CartServiceService){}
}
