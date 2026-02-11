import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { Router } from '@angular/router';
import { StorefrontService } from '../services/storefront.service';
import { CommonModule } from '@angular/common';
import { forkJoin, map } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [HeaderComponent, FooterComponent,CommonModule,ReactiveFormsModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent {

  buyer_name:any;
  customer_id:any;
  buyerAddressdata:any[]=[];
  buyerOrderdata:any[]=[];
  addressForm!:FormGroup;
  buyerProfile!:FormGroup;
  buyerData:any;
constructor(private route:Router, private api:StorefrontService, private fb:FormBuilder){}
  ngOnInit():void
  {
    this.buyer_name = localStorage.getItem('cust_name');
    this.customer_id = localStorage.getItem('cust_id');
    this.buyerAddress();
    this.buyerOrder();

    /* ----- add / Edit address ------ */
    this.addressForm = this.fb.group({
      customer_id:[this.customer_id],
      name:[''],
      address:[''],
      mobile:[''],
      state:[''],
      city:[''],
      pincode:[''],
      type:['']

    });
    this.buyerProfile = this.fb.group({
      customer_id:[''],
      name:[''],
      email:[''],
      mobile:[''],
      password:['']
    })
    this.editBuyerprofile();
  }

logout() {
  localStorage.clear();
  
  this.route.navigate(['/home']);
}

buyerAddress()
{
  this.api.singleBuyer(this.customer_id).subscribe({
    next:(data:any)=>{
      this.buyerAddressdata = data[0].addresses;
      console.log(this.buyerAddressdata);
    },
    error:(err)=>{
      console.log(err);
    }
  })
}

/* ------------ order details------------ */
buyerOrder() {
  forkJoin({ orders: this.api.buyerOrder(this.customer_id),products: this.api.getProducts()}).pipe(
    map(({ orders, products }) => {
      return orders.map(order => { const product = products.find(p => p.id === order.product_id);
      return {...order,product_name: product?.product_name,brand: product?.brand,image: product?.image };
      
      });
    })
  ) .subscribe({
    next: (data) => {
      this.buyerOrderdata = data;
      console.log(this.buyerOrderdata);
    },
    error: (err) => {
      console.log(err);
    }
  });
}

/* ---------------- post address----------- */
addbuyerAddress() {
  if (this.addressForm.invalid) { return;}

  const newAddress = {
    address_id: 'ADDR' + Math.floor(Math.random() * 1000),
    ...this.addressForm.value,
    isDefault: false
  };

  this.api.singleBuyer(this.customer_id).subscribe({
    next: (buyers) => {
      const buyer = buyers[0]; // only one buyer per customer_id

      if (!buyer) { alert('Buyer not found'); return; }

      const updatedBuyer = {...buyer,addresses: [...(buyer.addresses || []), newAddress] };

      this.api.updateBuyerAddress(buyer.id, updatedBuyer).subscribe({
        next: () => {
          alert('Address Added Successfully');
          this.addressForm.reset();
          this.buyerAddress(); // reload addresses
        },
        error: err => console.log(err)
      });
    },
    error: err => console.log(err)
  });
}

editBuyerprofile()
{
  const id = localStorage.getItem('cust_id')
  this.api.singleBuyer(id).subscribe({
    next:(data:any)=>{
      this.buyerData = data[0];
      console.log(this.buyerData);
      this.buyerProfile.patchValue({
        customer_id:this.buyerData.customer_id,
        name:this.buyerData.name,
        email:this.buyerData.email,
        mobile:this.buyerData.mobile,
        password:this.buyerData.password
      })
    },
    error:(err)=>{
      console.log(err)
    }
  })

}

updateBuyerprofile()
{
  if(this.buyerProfile.invalid) return
  const id  = localStorage.getItem('id')?.toString();
  this.api.updateBuyerAddress(id,this.buyerProfile.value).subscribe({
    next:(data:any)=>{
      alert("Buyer Details Updated");
      console.log(data)
    },
    error:(err)=>{
      console.log(err)
    }
  })
}
}
