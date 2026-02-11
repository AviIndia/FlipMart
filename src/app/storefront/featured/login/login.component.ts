import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StorefrontService } from '../services/storefront.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, FooterComponent,CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!:FormGroup;
  constructor(private fb:FormBuilder,private loginApi:StorefrontService,private router:Router){}
  ngOnInit():void
  {
    this.loginForm = this.fb.group({
      email:['',Validators.required],
      password:['',Validators.required]

    })
  }
  buyerLogin()
  {
    if(this.loginForm.invalid)return;
    const {email , password} = this.loginForm.value
    console
    this.loginApi.buyerLogin(email,password).subscribe({
      next:(data)=>{
        if(data && data.length>0)
        {
          const buyer = data[0];
          localStorage.setItem('id',buyer.id)
          localStorage.setItem('cust_id',buyer.customer_id);
          localStorage.setItem('cust_name',buyer.name);
          localStorage.setItem('email',buyer.email);
          localStorage.setItem('role',buyer.role);
          this.router.navigate(['/cart'])
        }
        else{
          alert("Please Check your login details!")
        }

      },
      error:(err)=>{
        console.log(err)
      }
    })
  }
}
