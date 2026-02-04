import { AfterViewInit, Component } from '@angular/core';
import { HomeSidebarService } from '../featured-services/home-sidebar/home-sidebar.service';
import { CommonModule } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-latest-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './latest-product.component.html',
  styleUrl: './latest-product.component.css'
})
export class LatestProductComponent implements AfterViewInit {

latestProductData:any[]=[];

  constructor(private homeSidebarService:HomeSidebarService) { }
ngOnInit(): void {
	this.latestProducts();
}
	latestProducts() {
	this.homeSidebarService.latestproducts().subscribe((data:any[])=>{
		this.latestProductData = data;
		console.log('latest Product',this.latestProductData);
		setTimeout(() => {
			this.initCategoryCarousel();
		}, 0);
	})
  }

  ngAfterViewInit(): void {
    // latest product carousel active js
	
  }


  initCategoryCarousel() {
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
