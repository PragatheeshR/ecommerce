import { CartItem } from "./cart-item";

export class OrderItem {

    imageURL : string;
    quantity : number;
    unitPrice : number;
    productId : number;

    constructor(cartItem : CartItem){
        this.imageURL = cartItem.imageURL;
        this.quantity = cartItem.quantity;
        this.unitPrice = cartItem.unitPrice;
        this.productId = cartItem.id;
    }
    

}
