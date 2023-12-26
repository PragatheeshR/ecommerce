package com.fullstack.ecommerce.config;

import com.fullstack.ecommerce.entity.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class ProductConfiguration implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public ProductConfiguration(EntityManager entityManager){
        this.entityManager = entityManager;
    }



    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedActions = {HttpMethod.PUT, HttpMethod.DELETE, HttpMethod.POST};

        //disabling above mentioned http calls for Product Class


        disableHttpMethods(Product.class,config, unsupportedActions);

        //disabling above mentioned http calls for ProductCategory Class

        disableHttpMethods(ProductCategory.class,config, unsupportedActions);

        // disabling all the unsupported HTTP calls
        disableHttpMethods(Country.class,config, unsupportedActions);

        disableHttpMethods(State.class,config, unsupportedActions);

        disableHttpMethods(Order.class, config, unsupportedActions);
        //call an internal helper method to expose the ID's of ProductCategory
        exposeId(config);
    }

    private static void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] unsupportedActions) {
        config.getExposureConfiguration().
                forDomainType(theClass)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(unsupportedActions)))
                .withCollectionExposure(((metdata, httpMethods) -> httpMethods.disable(unsupportedActions)));
    }

    private void exposeId(RepositoryRestConfiguration config) {

        Set<EntityType<?>> entityTypes = entityManager.getMetamodel().getEntities();

        List<Class>  classList = new ArrayList<>();

        for(EntityType entityType : entityTypes){
            classList.add(entityType.getJavaType());
        }

        Class[] domainTypes =  classList.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
