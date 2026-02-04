import { Injectable } from '@angular/core';
import { ApiService } from '../../../../core/services/api-service.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeSidebarService {
  private apiUrl = 'http://localhost:3000/products';
  constructor(private apiService:ApiService) { }

getProductsByCategory(categoryId: string) {
  return this.apiService.get<any[]>(this.apiUrl).pipe(
    map(products => products.filter(p => p.category_id === categoryId && p.status === 'publish')
    )
  );
}
getRandomProducts(limit: number = 10) {
  return this.apiService.get<any[]>(this.apiUrl).pipe(
    map(products =>
      products
        .filter(p => p.status === 'publish')
        .sort(() => 0.5 - Math.random())
        .slice(0, limit)
    )
  );
}
gettwocatProducts(cat_id:string,cat_id2:string,limit:number=10) {
  return this.apiService.get<any[]>(this.apiUrl).pipe(
    map(products =>products.filter(p=>p.category_id === cat_id || p.category_id ===cat_id2 && p.status ==='publish').slice(0,limit))
  )
}

latestproducts(limit: number = 10) {
  return this.apiService.get<any[]>(this.apiUrl).pipe(
    map(products =>
      products
        .filter(p => p.status === 'publish')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit)
    )
  );     
}
}
