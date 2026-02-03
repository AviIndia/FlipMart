import { AfterViewInit, Component } from '@angular/core';
import { PopularBrandComponent } from "../../shared/popular-brand/popular-brand.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { HeaderComponent } from "../../shared/header/header.component";
declare var $: any;
@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [PopularBrandComponent, FooterComponent, HeaderComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    	// testimonial carousel active js
	$('.testimonial-carousel-active').slick({
		autoplay: false,
		infinite: true,
		fade: false,
		dots: true,
		arrows: false,
		slidesToShow: 1
	});
  }

}
