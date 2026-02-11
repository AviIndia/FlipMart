import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HomeSidebarService } from '../../featured/featured-services/home-sidebar/home-sidebar.service';
import { CommonModule } from '@angular/common';
import { CartServiceService } from '../../featured/services/cart-service.service';
declare var $: any;

@Component({
  selector: 'app-new-arrivals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-arrivals.component.html',
  styleUrl: './new-arrivals.component.css'
})
export class NewArrivalsComponent implements OnInit {
	  productData:any[]=[];
	  randomproductData:any[]=[];
	constructor(private productService:HomeSidebarService, private cartService:CartServiceService) { }
ngOnInit(): void {
	this.featuredProduct();
}

featuredProduct()
{
	this.productService.getRandomProducts().subscribe((data:any[])=>{
		this.productData=data;
		console.log(this.productData);
		setTimeout(() => {
			this.initFeaturedCarousel();
		  }	, 0);
	})
}

addToCart(item: any) {

  const product = {
    id: item.id,
    price: item.price.selling_price
  };
  console.log(item);
  this.cartService.addToCart(product);
}


initFeaturedCarousel() {
	$('.featured-carousel-active').slick({
		autoplay: false,
		infinite: true,
		fade: false,
		dots: false,
		arrows: true,
		prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
		slidesToShow: 4,
		responsive: [{
				breakpoint: 1200,
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
					arrows: false,
				}
			},
		]
	});
  }
}
 

