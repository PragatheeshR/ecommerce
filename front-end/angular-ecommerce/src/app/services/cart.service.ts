import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

 cartItems : CartItem[] = [];
 cartItemsdata : Subject<CartItem[]> = new Subject<CartItem[]>();
 //storage : Storage = sessionStorage; //session storage
 storage : Storage = localStorage; //localStorage storage
  

  totalPrice :Subject<number> = new BehaviorSubject<number>(0); //Subject is  subclass of observable. We can use Subject to publish Events in our code
  totalQty :Subject<number> = new BehaviorSubject<number>(0);

  constructor() { 
    //read dataa from storage
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if(data != null){
      this.cartItems = data;

      //compte totals
      this.computeCartTotals();
    }
  }

  addToCart(cartItem : CartItem){
    let existingItem:CartItem[];

    existingItem =  this.cartItems.filter(a => a.id == cartItem.id);

    console.log(existingItem);

    if(existingItem.length == 0){
      console.log('Not Existing in Cart');
      this.cartItems.push(cartItem);
    }
    else{
      console.log(' Existing in Cart');
      existingItem[0].quantity += 1;
    }
   this.computeCartTotals();   

  }

  removeFromCart(cartItem : CartItem){

    let existingItem:CartItem;

    existingItem =  this.cartItems.filter(a => a.id == cartItem.id).at(0)!;
    existingItem.quantity--;
    if(existingItem.quantity == 0){
       this.remove(cartItem);
    }
    this.computeCartTotals();

  }

  remove(cartItem : CartItem){
     let index = this.cartItems.findIndex(item => item.id == cartItem.id);

     if(index != -1){
      this.cartItems.splice(index, 1);
     }
     this.computeCartTotals();


  }

  

  computeCartTotals() {

    let totalPrice : number = 0;
    let totalQty : number = 0;

    this.cartItems.forEach(a => {
      totalPrice +=  (a.unitPrice * a.quantity);
      totalQty +=  a.quantity;
    });
   // Publish the data to all the subscribers
   
   console.log(`${totalPrice}, ${totalQty}`);

   this.totalPrice.next(totalPrice);
   this.totalQty.next(totalQty);
   console.log(` For Product Details Page : ${this.cartItems}`);
   this.cartItemsdata.next(this.cartItems);
   //to persist cart data in web storage
   this.persistCartItems();


  }

   persistCartItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
}
