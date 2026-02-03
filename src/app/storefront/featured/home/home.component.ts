import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { HomeHeroComponent } from '../home-hero/home-hero.component';
import { HomeSidebarComponent } from "../home-sidebar/home-sidebar.component";
import { NewArrivalsComponent } from "../../shared/new-arrivals/new-arrivals.component";
import { HomeProductScrollerComponent } from "../home-product-scroller/home-product-scroller.component";
import { LatestProductComponent } from "../latest-product/latest-product.component";
import { PopularBrandComponent } from "../../shared/popular-brand/popular-brand.component";
import { FooterComponent } from "../../shared/footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, HomeHeroComponent, HomeSidebarComponent, NewArrivalsComponent, HomeProductScrollerComponent, LatestProductComponent, PopularBrandComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
