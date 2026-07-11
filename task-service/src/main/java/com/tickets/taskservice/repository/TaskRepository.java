package com.tickets.taskservice.repository;

import com.tickets.taskservice.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByAssignedUserId(String assignedUserId);
}