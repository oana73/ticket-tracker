package com.tickets.taskservice.repository;

import com.tickets.taskservice.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TaskRepository extends MongoRepository<Task, String> {
}