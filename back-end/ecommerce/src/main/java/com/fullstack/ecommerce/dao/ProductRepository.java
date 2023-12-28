package com.fullstack.ecommerce.dao;

import com.fullstack.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;


//@CrossOrigin("https://localhost:4200") // this is to allow request from different port calls
@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategoryId(@Param("id") Long id,  Pageable pageable);

    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);
}
