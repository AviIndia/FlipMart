import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api-service.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorefrontService {

  private url = 'http://localhost:3000';
  constructor(private apiService:ApiService) { }

  buyerLogin(email:string,password:string):Observable<any>
  {
    console.log(email, password)
    return this.apiService.get<any>(this.url+'/buyers?email='+email+'&password='+password);
  }
  singleBuyer(customer_id:any):Observable<any>
  {
    console.log(customer_id);
    return this.apiService.get<any>(this.url+'/buyers?customer_id='+customer_id)
  }

  
 
  buyerOrder(customer_id:any){
  return this.apiService.get<any[]>(`${this.url}/orders?customer_id=${customer_id}`,
   
  );
}
getProducts() {
  return this.apiService.get<any[]>(`${this.url}/products`);
}
/* updateBuyerAddress(buyerId: number, data: any) {
  return this.apiService.put(`${this.url}/buyers?customer_id=${buyerId}`,data);
} */
updateBuyerAddress(id:any, data: any) {
  return this.apiService.put(`${this.url}/buyers/${id}`, data);
}

}
