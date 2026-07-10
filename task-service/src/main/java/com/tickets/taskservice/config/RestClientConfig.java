package com.tickets.taskservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestClient;

public class RestClientConfig {
    @Bean
    public RestClient userServiceRestClient(){
        return RestClient.builder()
                .baseUrl("http://localhost:8081")
                .build();
    }
}
