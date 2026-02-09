import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent {

  buyer_name:any;
constructor(private route:Router){}
  ngOnInit():void
  {
    this.buyer_name = localStorage.getItem('cust_name')
  }

logout() {
  localStorage.clear();
  
  this.route.navigate(['/home']);
}

}
