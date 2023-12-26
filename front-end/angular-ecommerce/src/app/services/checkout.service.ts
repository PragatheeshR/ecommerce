import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Purchase } from '../common/purchase';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseURL =  environment.baseBackEndUrl+"/checkout/purchase";

  constructor(private httpClient : HttpClient){

  }

  placeOrder(purchase : Purchase) : Observable<any>{

    console.log(purchase.customer);
    console.log(purchase.order);
    console.log(purchase.shippingAddress);
    console.log(purchase.billingAddress);
    console.log(purchase.orderItems);
    console.log(JSON.stringify(purchase));


    return this.httpClient.post<Purchase>(this.purchaseURL, purchase);
  }

}
