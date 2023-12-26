package com.fullstack.ecommerce.service;

import com.fullstack.ecommerce.dao.CustomerRepository;
import com.fullstack.ecommerce.dto.Purchase;
import com.fullstack.ecommerce.dto.PurchaseResponse;
import com.fullstack.ecommerce.entity.Customer;
import com.fullstack.ecommerce.entity.Order;
import com.fullstack.ecommerce.entity.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CheckOutServiceImpl implements CheckoutService{


    @Autowired
    private CustomerRepository customerRepository;


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

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
