import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems : CartItem[] = [];
  totalQty : number = 0;
  totalPrice : number = 0;

  constructor(private cartService : CartService) { }

  ngOnInit(): void {

    this.getCartItems();
  }

  getCartItems() {
    // this.cartService.cartItemsdata.subscribe(
      
    //   data => {
    //     console.log("info"+data);
    //     this.cartItems = data}
      
    // );
    this.totalQty  = 0;
    this.totalPrice  = 0;

    this.cartItems = this.cartService.cartItems;

    this.cartItems.forEach(cartItem => {

      

      this.totalQty += cartItem.quantity;
      this.totalPrice += cartItem.unitPrice * cartItem.quantity;

      this.totalPrice.toFixed(2);
    });

    

  }
  addToCart(cartItem : CartItem){
    this.cartService.addToCart(cartItem);
    this.getCartItems();
  }

  removeFromCart(cartItem : CartItem){
    console.log("inside the remove CARt");
   // cartItem.quantity--;
      this.cartService.removeFromCart(cartItem);
      this.getCartItems();
  }

  remove(cartItem :CartItem){
    this.cartService.remove(cartItem);
    this.getCartItems();
  }

}
