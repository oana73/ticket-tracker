package com.tickets.userservice.controller;


import com.tickets.userservice.model.User;
import com.tickets.userservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    public final UserService userService;

    public UserController(UserService userService){
        this.userService =  userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user){
        User savedUser = userService.register(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials){
        String username = credentials.get("username");
        String password = credentials.get("password");

        Optional<User> userOptional = userService.login(username,password);

        if(userOptional.isPresent()){
            return ResponseEntity.ok(userOptional.get());
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid username or password");
            return ResponseEntity.status(401).body(error);
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id){
        Optional<User> userOptional = userService.findById(id);

        if(userOptional.isPresent()){
            return ResponseEntity.ok(userOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
}
