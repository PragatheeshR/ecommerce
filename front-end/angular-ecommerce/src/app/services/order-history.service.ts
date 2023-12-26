import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl =  environment.baseBackEndUrl+'/orders';
  constructor(private httpClient : HttpClient) { }

  getOrderHistory(email : string) : Observable<GetOrderHistoryResponse>{

    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`;
    return this.httpClient.get<GetOrderHistoryResponse>(orderHistoryUrl);
  }
}

interface GetOrderHistoryResponse{
  _embedded:{
    orders: OrderHistory[];
  }
}
