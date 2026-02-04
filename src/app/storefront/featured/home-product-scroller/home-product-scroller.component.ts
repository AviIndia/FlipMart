import { AfterViewInit, Component } from '@angular/core';
import { HomeSidebarService } from '../featured-services/home-sidebar/home-sidebar.service';
import { CommonModule } from '@angular/common';

declare var $: any;
@Component({
  selector: 'app-home-product-scroller',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-product-scroller.component.html',
  styleUrl: './home-product-scroller.component.css'
})
export class HomeProductScrollerComponent {

  twoProductCategory:any[]=[];
  
  constructor(private productService:HomeSidebarService) { }

  ngOnInit(): void {  
   this.randomProducts();
 }




randomProducts() {
    this.productService.gettwocatProducts('6','4').subscribe(data => {
      this.twoProductCategory = data;
      console.log(this.twoProductCategory);

      // ⏳ wait until *ngFor renders DOM
      setTimeout(() => {
        this.initCategoryCarousel();
      });
    });
  }

  initCategoryCarousel() {
   $('.featured-carousel-active2').each(function (this: HTMLElement) {
      const $carousel = $(this);

      if (!$carousel.length || $carousel.children().length === 0) return;
      if ($carousel.hasClass('slick-initialized')) return;

      const rows = $carousel.attr('data-row')
        ? parseInt($carousel.attr('data-row')!, 10)
        : 1;

      $carousel.slick({
        infinite: true,
        arrows: true,
        dots: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        rows: rows,
        prevArrow:
          '<button class="slick-prev"><i class="fa fa-angle-left"></i></button>',
        nextArrow:
          '<button class="slick-next"><i class="fa fa-angle-right"></i></button>',
        responsive: [
          { breakpoint: 1200, settings: { slidesToShow: 3 } },
          { breakpoint: 768, settings: { slidesToShow: 2 } },
          { breakpoint: 480, settings: { slidesToShow: 1, arrows: false } }
        ]
      });
    });
  }
}


