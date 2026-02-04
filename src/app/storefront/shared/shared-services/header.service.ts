import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
public apiUrl = 'http://localhost:3000/category';
  constructor(private apiServices: ApiService) { }

  
  getCategories() 
  {
    return this.apiServices.get(this.apiUrl);
  }
  }  
