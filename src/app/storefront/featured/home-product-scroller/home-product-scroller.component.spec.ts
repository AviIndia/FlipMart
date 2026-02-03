import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProductScrollerComponent } from './home-product-scroller.component';

describe('HomeProductScrollerComponent', () => {
  let component: HomeProductScrollerComponent;
  let fixture: ComponentFixture<HomeProductScrollerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProductScrollerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeProductScrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
