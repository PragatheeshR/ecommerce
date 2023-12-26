package com.fullstack.ecommerce.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;

@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception{

        //protect endpoints /api/orders/**
        httpSecurity.authorizeHttpRequests(configurer -> configurer
                .requestMatchers("/api/orders/**")
                .authenticated()
                .anyRequest().permitAll())
                .oauth2ResourceServer(oauthServer -> oauthServer.jwt(Customizer.withDefaults()));

        // + CORS filters
        httpSecurity.cors(Customizer.withDefaults());

        // + content negotiation strategy
        httpSecurity.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());

        // + non-empty response body for 401 (more friendly)
        Okta.configureResourceServer401ResponseBody(httpSecurity);

        // we are not using Cookies for session tracking >> disable CSRF
        httpSecurity.csrf(AbstractHttpConfigurer::disable);

        return httpSecurity.build();
    }
}
