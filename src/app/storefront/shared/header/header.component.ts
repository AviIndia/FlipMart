import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderService } from '../shared-services/header.service';
import { CartServiceService } from '../../featured/services/cart-service.service';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink,RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  categoryData:any[]=[];
  isHome = false;
 isLoggedIn = false;
cust_name: string = 'My Account';
constructor(private route:Router, private headerService: HeaderService,public cartService:CartServiceService) { }
ngOnInit(): void {

const role = localStorage.getItem('role');

  if (role) {
    this.cust_name = localStorage.getItem('cust_name') || 'My Account';
    this.isLoggedIn = true;
  } else {
    this.cust_name = 'My Account';
    this.isLoggedIn = false;
  }
    this.getCategoriesData()


   // initial load
    this.isHome = this.route.url === '/home';

    this.route.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe(event => {
        this.isHome = event.urlAfterRedirects === '/home';
      });
}

logout() {
  localStorage.clear();
  this.isLoggedIn = false;
  this.cust_name = 'My Account';
  this.route.navigate(['/home']);
}



  ngAfterViewInit(): void {

    const $window = $(window);

    // ============================
    // Sticky menu + Scroll top
    // ============================
    $window.off('scroll.header').on('scroll.header', () => {
      const scrollTop = $window.scrollTop();

      // Sticky menu
      if (scrollTop < 300) {
        $('.sticky').removeClass('is-sticky');
      } else {
        $('.sticky').addClass('is-sticky');
      }

      // Scroll to top button
      if (scrollTop > 600) {
        $('.scroll-top').removeClass('not-visible');
      } else {
        $('.scroll-top').addClass('not-visible');
      }
    });

    // ============================
    // Responsive Mean Menu
    // ============================
    jQuery('#mobile-menu').meanmenu({
      meanMenuContainer: '.mobile-menu',
      meanScreenWidth: '991'
    });

    // ============================
    // Mini cart toggle
    // ============================
    $('.mini-cart-btn')
      .off('click.cart')
      .on('click.cart', function (event: Event) {
        event.preventDefault();
        event.stopPropagation();
        $('.cart-list').slideToggle();
      });

    // Close cart on outside click
    $(document)
      .off('click.cartOutside')
      .on('click.cartOutside', function () {
        $('.cart-list').slideUp();
      });

    // ============================
    // Dropdown slide animation
    // ============================
    $('.dropdown')
  .off('show.bs.dropdown hide.bs.dropdown')
  .on('show.bs.dropdown', function (event: Event) {
    const target = event.currentTarget as HTMLElement;

    $(target)
      .find('.dropdown-menu')
      .first()
      .stop(true, true)
      .slideDown(300);
  })
  .on('hide.bs.dropdown', function (event: Event) {
    const target = event.currentTarget as HTMLElement;

    $(target)
      .find('.dropdown-menu')
      .first()
      .stop(true, true)
      .slideUp(300);
  });



  // ============================
// Category Menu
// ============================

const categoryToggle = $('.category-toggle');
const categoryMenu = $('.category-menu');

// Toggle submenu based on screen size
const categorySubMenuToggle = () => {
  const screenSize = $window.width() ?? 0;

  if (screenSize <= 991) {
    $('.category-menu .menu-item-has-children > a').each(
  (_: number, el: HTMLElement) => {
    const $el = $(el);

    if (!$el.find('.menu-expand').length) {
      $el.prepend('<span class="expand menu-expand"></span>');
    }
  }
);


    $('.category-menu .menu-item-has-children ul').slideUp();
  } else {
    $('.category-menu .menu-item-has-children > a .menu-expand').remove();
    $('.category-menu .menu-item-has-children ul').slideDown();
  }
};

// Init + resize
$window
  .off('load.category resize.category')
  .on('load.category resize.category', categorySubMenuToggle);

// Category main toggle
categoryToggle
  .off('click.category')
  .on('click.category', () => {
    categoryMenu.slideToggle();
  });

// Category submenu toggle (event delegation)
$('.category-menu')
  .off('click.categorySub')
  .on('click.categorySub', 'li a, li a .menu-expand', (e: Event) => {
    const target = e.currentTarget as HTMLElement;
    const $el = $(target).hasClass('menu-expand')
      ? $(target).parent()
      : $(target);

    if ($el.parent().hasClass('menu-item-has-children')) {
      if ($el.attr('href') === '#' || $(target).hasClass('menu-expand')) {

        if ($el.siblings('ul:visible').length) {
          $el.siblings('ul').slideUp();
        } else {
          $el
            .parents('li')
            .siblings('li')
            .find('ul:visible')
            .slideUp();

          $el.siblings('ul').slideDown();
        }
      }
    }

    if ($(target).hasClass('menu-expand') || $el.attr('href') === '#') {
      e.preventDefault();
    }
  });


  }

  // ============================
  // Cleanup on destroy
  // ============================
  ngOnDestroy(): void {
    $(window).off('scroll.header');
    $(document).off('click.cartOutside');
    $('.mini-cart-btn').off('click.cart');
    $('.dropdown').off('show.bs.dropdown hide.bs.dropdown');
  }



  /* ---------------------- load data of category--------------- */

  getCategoriesData(){
    this.headerService.getCategories().subscribe((res:any)=>{
      this.categoryData=res;
      console.log('category data',this.categoryData);
    }, (error: any) => {
      console.log('Error while fetching category data', error);
    });
  }
}
