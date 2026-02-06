import { Routes } from '@angular/router';
import { HomeComponent } from './storefront/featured/home/home.component';
import { AboutUsComponent } from './storefront/featured/about-us/about-us.component';
import { ShopComponent } from './storefront/featured/shop/shop.component';
import { ContactUsComponent } from './storefront/featured/contact-us/contact-us.component';
import { LoginComponent } from './storefront/featured/login/login.component';
import { CartComponent } from './storefront/featured/cart/cart.component';
import { authguardGuard } from './authguard/authguard.guard';
import { MyAccountComponent } from './storefront/featured/my-account/my-account.component';
import { CheckoutComponent } from './storefront/featured/checkout/checkout.component';
import { guestGuard } from './authguard/guest.guard';

export const routes: Routes = [
    
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path:'home', component: HomeComponent},
    {path:'about-us', component: AboutUsComponent},
    {path:'shop', component: ShopComponent},
    {path:'login-register', component:LoginComponent, canActivate:[guestGuard]},
    {path:'cart', component:CartComponent, canActivate:[authguardGuard]},
    {path:'my-account', component:MyAccountComponent, canActivate:[authguardGuard]},
    {path:'checkout', component:CheckoutComponent, canActivate:[authguardGuard]},
    {path:'contact-us', component:ContactUsComponent},
];
