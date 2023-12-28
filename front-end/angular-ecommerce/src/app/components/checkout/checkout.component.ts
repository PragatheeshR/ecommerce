import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Country } from 'src/app/common/country';
import { Customer } from 'src/app/common/customer';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { CustomValidator } from 'src/app/validators/custom-validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalQty: number = 0;
  totalPrice: number = 0;
  countries: Country[] = [];
  states: State[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  isDisabled : boolean = false;

  //initialize Stripe API

  stripe = Stripe(environment.stripePublishableKey);
  paymentInfo: PaymentInfo = new PaymentInfo(0, "");
  cardElement: any;
  displayError: any = "";

  constructor(private formBuilder: FormBuilder, private shopFormService: ShopFormService,
    private cartService: CartService,
    private checkOutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {

    //setup Stripe Form

    this.setUpStripeForm();

    this.getCartDetails();
    const email = JSON.parse(this.storage.getItem('userEmail'));

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidator.notOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(3), CustomValidator.notOnlyWhiteSpace]),
        email: new FormControl(email)

      }),

      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.maxLength(10), Validators.required]),
        city: new FormControl('', [Validators.maxLength(10), Validators.required]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{6}')]),

      }),

      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']

      }),

      creditCardDetails: this.formBuilder.group({
        cardType: [''],
        cardNumber: [''],
        cvv: [''],
        expDate: ['']
      })
    });

    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Countries " + JSON.stringify(data));
        this.countries = data;
      }
    );





  }

  setUpStripeForm() {
    // get a ahandle to Stripe elem

    var elements = this.stripe.elements();

    //create a card element

    this.cardElement = elements.create('card', { hidePostalCode: true });

    //add an instance of Card UI component into card-element div 
    this.cardElement.mount('#card-element');

    this.cardElement.on('change', (event: any) => {

      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = "";
      }
      else if (event.error) {

        this.displayError.textContent = event.error.message;
      }

    })
  }
  getCartDetails() {

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQty.subscribe(
      data => {
        console.log(data);
        this.totalQty = data
      }
    );
  }




  onSubmit() {

    {
      let purchase = new Purchase();
      let customer = new Customer();

      //fill Customer
      customer = this.checkoutFormGroup.controls["customer"].value;
      purchase.customer = customer;
      //****************************** */
      //fill Order
      let order = new Order();

      order.totalPrice = this.totalPrice;
      order.totalQuantity = this.totalQty;

      purchase.order = order;

      const cartItems = this.cartService.cartItems;
      let orderItem = [];

      this.cartService.cartItems.forEach(cartItem => {
        orderItem.push(new OrderItem(cartItem));

        purchase.orderItems = orderItem;

        //create Purchase

        purchase.shippingAddress = this.checkoutFormGroup.controls["shippingAddress"].value;
        const shipCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
        const shipState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
        purchase.shippingAddress.state = shipState.name
        purchase.shippingAddress.country = shipCountry.name;

        purchase.billingAddress = this.checkoutFormGroup.controls["billingAddress"].value;
        const billCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
        const billState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
        purchase.billingAddress.state = billState.name
        purchase.billingAddress.country = billCountry.name;

        //compute toatl amount
        this.paymentInfo.amount = this.totalPrice * 100;
        this.paymentInfo.currency = "INR";


        if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {
          this.isDisabled = true; 
          this.checkOutService.createPaymentIntent(this.paymentInfo).subscribe(
            intentResponse => {
              console.log(`got thr intrnt content ${intentResponse}`);
              this.stripe.confirmCardPayment(intentResponse.client_secret,
                {
                  payment_method: {
                    card: this.cardElement,
                    billing_details: {
                      email: purchase.customer.email,
                      name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                      address: {
                        line1: purchase.billingAddress.street,
                        city: purchase.billingAddress.city,
                        state: purchase.billingAddress.state,
                        postal_code: purchase.billingAddress.zipCode,
                        country: this.shippingAddressCountry.value.code
                      }
                    }
                  }
                }, { handleActions: false })
                .then((result: any) => {
                  if (result.error) {
                    alert(`There is an error: ${result.error.message}`);
                    this.isDisabled = false;
                  }
                  else {
                    this.checkOutService.placeOrder(purchase).subscribe(
                      {
                        next: respose => {
                          alert(`Your Order has been placed \n Order tracking number: ${respose.orderTrackingNumber}`)
                          this.resetcart();
                          this.isDisabled = false;
                        },
                        error: err => {
                          alert(`Your Order is having error: ${err.message}`);
                          this.isDisabled = false;
                        }
                      }
                    );
                  }
                })
            }
          );
        }


      });

      return;

    }
    console.log(this.checkoutFormGroup.get('customer')!.value);
    console.log(this.checkoutFormGroup.get('shippingAddress')!.value);
  }
  resetcart() {
    //reset form data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQty.next(0);

    //reset cart data

    this.checkoutFormGroup.reset();
    this.cartService.persistCartItems();

    //back to main page
    this.router.navigateByUrl("/products");
  }


  copyShippingAddrToBillingAddr(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  getStates(formGroupName: string) {

    console.log("Searching got COuntry");

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countrName = formGroup?.value.country.name;

    console.log("Searching got COuntry" + countrName);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        console.log("Searching got DATA" + data);
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
          console.log("Searching got this.billingAddressStates" + this.billingAddressStates);
        }
        formGroup?.get('state')?.setValue(data[0]);
      }
    );


  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street') }

  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city') }

  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state') }

  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country') }

  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode') }


}
