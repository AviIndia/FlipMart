import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:3000/orders';

  constructor(private api:ApiService) {}

  placeOrder(order: any): Observable<any> {
    return this.api.post(this.apiUrl, order);
  }
}
