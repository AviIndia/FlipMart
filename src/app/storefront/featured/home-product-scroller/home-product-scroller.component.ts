import { AfterViewInit, Component } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-home-product-scroller',
  standalone: true,
  imports: [],
  templateUrl: './home-product-scroller.component.html',
  styleUrl: './home-product-scroller.component.css'
})
export class HomeProductScrollerComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // category Carousel For 3 row
	$('.category-carousel-active').each(
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

}
