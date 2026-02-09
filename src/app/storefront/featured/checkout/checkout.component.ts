import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { StorefrontService } from '../services/storefront.service';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  buyerAddress:any[]=[];
  selectedAddressId: number | null = null;
  constructor(private api:StorefrontService){}
  ngOnInit():void
  {
    this.getSingleUserAddress();
  }

  getSingleUserAddress()
  {
    const role = localStorage.getItem('role');
    const customer_id = localStorage.getItem('cust_id');
    this.api.singleBuyer(customer_id).subscribe({
      next:(res:any[])=>{
        this.buyerAddress = res;
        console.log(this.buyerAddress);
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }
}
