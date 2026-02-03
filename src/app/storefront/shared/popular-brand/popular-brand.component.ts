import { AfterViewInit, Component } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-popular-brand',
  standalone: true,
  imports: [],
  templateUrl: './popular-brand.component.html',
  styleUrl: './popular-brand.component.css'
})
export class PopularBrandComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // brand slider active js
	var brand = $('.brand-active');
	brand.slick({
		infinite: true,
		arrows: true,
		autoplay: true,
		speed: 1000,
		pauseOnFocus: false,
		pauseOnHover: false,
		slidesToShow: 5,
		prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
		responsive: [{
				breakpoint: 992,
				settings: {
					slidesToShow: 4,
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 3,
					arrows: false,
				}
			},
			{
				breakpoint: 575,
				settings: {
					slidesToShow: 2,
					arrows: false,
				}
			},
			{
				breakpoint: 479,
				settings: {
					slidesToShow: 1,
					arrows: false,
				}
			},
		]
	});

	// latest blog carousel active js
	$('.blog-carousel-active2').slick({
		autoplay: false,
		infinite: true,
		fade: false,
		dots: false,
		arrows: true,
		prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
		slidesToShow: 4,
		responsive: [{
				breakpoint: 991,
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
