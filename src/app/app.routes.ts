import { Routes } from '@angular/router';
import { HomeComponent } from './storefront/featured/home/home.component';
import { AboutUsComponent } from './storefront/featured/about-us/about-us.component';
import { ShopComponent } from './storefront/featured/shop/shop.component';
import { ContactUsComponent } from './storefront/featured/contact-us/contact-us.component';

export const routes: Routes = [
    
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path:'home', component: HomeComponent},
    {path:'about-us', component: AboutUsComponent},
    {path:'shop', component: ShopComponent},
    {path:'contact-us', component:ContactUsComponent},
];
