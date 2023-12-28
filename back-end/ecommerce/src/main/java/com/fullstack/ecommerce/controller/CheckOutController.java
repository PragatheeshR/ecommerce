package com.fullstack.ecommerce.controller;

import com.fullstack.ecommerce.dto.PaymentInfo;
import com.fullstack.ecommerce.dto.Purchase;
import com.fullstack.ecommerce.dto.PurchaseResponse;
import com.fullstack.ecommerce.service.CheckoutService;
import com.nimbusds.oauth2.sdk.http.HTTPResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//@CrossOrigin("https://localhost:4200") //using config clss
@RestController
@RequestMapping("/api/checkout")
public class CheckOutController {

    private CheckoutService checkoutService;

    @Autowired
    public CheckOutController(CheckoutService checkoutService){
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase){

       // System.out.println(purchase.getProduct().getId());
        System.out.println(purchase);

        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);
        return purchaseResponse;

    }

    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfo paymentInfo) throws StripeException {

        PaymentIntent paymentIntent = checkoutService.createPaymentIntent(paymentInfo);
        String data = paymentIntent.toJson();
        System.out.println("data from intent "+data);

        return new ResponseEntity<>(data, HttpStatus.OK);

    }

}
