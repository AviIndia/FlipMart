import { AfterViewInit, Component } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-latest-product',
  standalone: true,
  imports: [],
  templateUrl: './latest-product.component.html',
  styleUrl: './latest-product.component.css'
})
export class LatestProductComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // latest product carousel active js
	$('.latest-product-active').slick({
		autoplay: false,
		infinite: true,
		fade: false,
		dots: false,
		arrows: true,
		prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
		slidesToShow: 5,
		responsive: [{
				breakpoint: 992,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
				}
			},
		]
	});
  }

}
