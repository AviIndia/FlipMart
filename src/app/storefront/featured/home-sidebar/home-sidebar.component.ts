import { AfterViewInit, Component } from '@angular/core';
import { HomeSidebarService } from '../featured-services/home-sidebar/home-sidebar.service';
import { CommonModule } from '@angular/common';

declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-home-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-sidebar.component.html',
  styleUrl: './home-sidebar.component.css'
})
export class HomeSidebarComponent implements AfterViewInit {
  productData:any[]=[];
  bestSellerData:any[]=[];
  constructor(private homeSidebarService: HomeSidebarService) { }
  ngOnInit(): void {
    this.getHotDealsProduct();
    this.getBestSellerProduct()
  }

  /* --------------- HOT DEALS------------------ */

  getHotDealsProduct(){
   this.homeSidebarService.getProductsByCategory("3").subscribe((data:any[])=>{
    this.productData=data;
    console.log(this.productData);
     // wait until *ngFor renders
      setTimeout(() => {
        this.initDealCarousel();
      }, 0);
   })
  }

  /* ---------------- BEST SELLER ---------------- */
  getBestSellerProduct(){
   this.homeSidebarService.getProductsByCategory("5").subscribe((data:any[])=>{
    this.bestSellerData=data;
    console.log(this.bestSellerData);
     // wait until *ngFor renders
      setTimeout(() => {
        this.initBestSellerCarousel();
      }, 0);
   })
  }


initDealCarousel() {
  const $el = $('.deals-carousel-active');

  if ($el.hasClass('slick-initialized')) {
    $el.slick('unslick'); // important
  }

  $el.slick({
    autoplay: false,
    infinite: true,
    fade: false,
    dots: false,
    arrows: true,
    prevArrow:
      '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
    nextArrow:
      '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
    appendArrows: '.slick-append',
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 }
      }
    ]
  });
}

initBestSellerCarousel() {
  $('.category-carousel-active').each(
    (_: number, el: HTMLElement) => {
      const $carousel = $(el);

      // 🔐 prevent double init
      if ($carousel.hasClass('slick-initialized')) {
        $carousel.slick('unslick');
      }

      const $arrowContainer = $carousel
        .siblings('.section-title-2')
        .find('.category-append');

      const rowAttr = $carousel.attr('data-row');
      const rows = rowAttr ? parseInt(rowAttr, 10) : 1;

      $carousel.slick({
        infinite: true,
        arrows: true,
        dots: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        rows: rows,
        prevArrow:
          '<button class="slick-prev"><i class="fa fa-angle-left"></i></button>',
        nextArrow:
          '<button class="slick-next"><i class="fa fa-angle-right"></i></button>',
        appendArrows: $arrowContainer,
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
              rows: 3
            }
          },
          {
            breakpoint: 576,
            settings: {
              slidesToShow: 1,
              rows: 3
            }
          }
        ]
      });
    }
  );
}

  ngAfterViewInit(): void {
    // deal carousel active js
	

  
// blog carousel active js
$('.blog-carousel-active').each(
  (_: number, el: HTMLElement) => {
    const $carousel = $(el);
    const $arrowContainer = $carousel
      .siblings('.section-title-2')
      .find('.category-append');

    const rowAttr = $carousel.attr('data-row');
    const rows = rowAttr ? parseInt(rowAttr, 10) : 1;

    $carousel.slick({
      infinite: true,
      arrows: true,
      dots: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      rows: rows,
      prevArrow:
        '<button class="slick-prev"><i class="fa fa-angle-left"></i></button>',
      nextArrow:
        '<button class="slick-next"><i class="fa fa-angle-right"></i></button>',
      appendArrows: $arrowContainer
    });
  }
);

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
