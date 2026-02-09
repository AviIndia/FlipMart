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
    return this.apiService.get<any>(this.url+'/buyers?customer_id='+customer_id).pipe(
      map(add=>add.length > 0 ? add[0].addresses :[])
    )
  }
}
