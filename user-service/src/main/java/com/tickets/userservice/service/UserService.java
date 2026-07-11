package com.tickets.userservice.service;

import com.tickets.userservice.model.User;
import com.tickets.userservice.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public User register(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        return userRepository.save(user);
    }

    public Optional<User> login(String username, String rawPassword){
        Optional<User> userOptional = userRepository.findByUsername(username);
        if(userOptional.isPresent()){
            User user = userOptional.get();
            if(passwordEncoder.matches(rawPassword, user.getPassword())){
                return Optional.of(user);
            }
        }
    return Optional.empty();
    }
    public Optional<User> findById(String id){
        return userRepository.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}

