package com.tickets.userservice.repository;

import com.tickets.userservice.model.User;
import com.tickets.userservice.security.JwtService;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);


}
