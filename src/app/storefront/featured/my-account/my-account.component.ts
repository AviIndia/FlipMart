import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent {

}
