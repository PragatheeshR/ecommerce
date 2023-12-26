import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice : number = 0.00;
  totalQty : number = 0.00;

  constructor(private cartService : CartService) { }

  ngOnInit(): void {
    this.cartStatus();
  }

  cartStatus() {

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQty.subscribe(
      data => {
        console.log(data);
        this.totalQty = data}
    );
  }

}
