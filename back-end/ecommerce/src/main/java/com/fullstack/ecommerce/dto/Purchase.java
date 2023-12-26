package com.fullstack.ecommerce.dto;

import com.fullstack.ecommerce.entity.*;
import lombok.Data;

import java.util.List;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Product product;
    private Order order;
    private List<OrderItem> orderItems;
}
