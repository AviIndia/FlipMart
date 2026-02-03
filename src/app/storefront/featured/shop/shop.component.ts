import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { ShopSidebarComponent } from "../shop-sidebar/shop-sidebar.component";
import { PopularBrandComponent } from "../../shared/popular-brand/popular-brand.component";
import { FooterComponent } from "../../shared/footer/footer.component";

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [HeaderComponent, ShopSidebarComponent, PopularBrandComponent, FooterComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {

}
