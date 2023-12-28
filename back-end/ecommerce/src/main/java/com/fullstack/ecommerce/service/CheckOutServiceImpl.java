package com.fullstack.ecommerce.service;

import com.fullstack.ecommerce.dao.CustomerRepository;
import com.fullstack.ecommerce.dto.PaymentInfo;
import com.fullstack.ecommerce.dto.Purchase;
import com.fullstack.ecommerce.dto.PurchaseResponse;
import com.fullstack.ecommerce.entity.Customer;
import com.fullstack.ecommerce.entity.Order;
import com.fullstack.ecommerce.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.logging.Logger;

@Service
public class CheckOutServiceImpl implements CheckoutService{



    private CustomerRepository customerRepository;

    public CheckOutServiceImpl(CustomerRepository customerRepository, @Value("${stripe.key.secret}") String secretKey){

        this.customerRepository = customerRepository;

        //initailize Stripe API with secret Key
        Stripe.apiKey = secretKey;

    }


    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        Order order = purchase.getOrder();
        System.out.println("#############"+purchase.getProduct());

        String getTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(getTrackingNumber);

        purchase.getOrderItems().forEach(order::addOrderItem);

        order.setShippingAddress(purchase.getShippingAddress());
        System.out.println(purchase.getShippingAddress().getZipCode());
        order.setBillingAddress(purchase.getBillingAddress());

        Customer customer = purchase.getCustomer();

        Customer existingCustomer = customerRepository.findByEmail(customer.getEmail());

        if(existingCustomer != null){
            customer = existingCustomer;
        }

        customer.addOrder(order);

        customerRepository.save(customer);


        return new PurchaseResponse(getTrackingNumber);
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");
        Map<String, Object> map = new HashMap<>();
        map.put("amount", paymentInfo.getAmount());
        map.put("currency", paymentInfo.getCurrency());
        map.put("payment_method_types", paymentMethodTypes);
        System.out.println("In the create Payment Intent");
        System.out.println(map);
        return PaymentIntent.create(map);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
