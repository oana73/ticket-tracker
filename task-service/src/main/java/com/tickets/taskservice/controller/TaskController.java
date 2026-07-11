package com.tickets.taskservice.controller;

import com.tickets.taskservice.model.Task;
import com.tickets.taskservice.service.TaskService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public Task createTask(@RequestBody Task task,
                           @RequestHeader("Authorization") String authHeader) {
        return taskService.createTask(task, authHeader);
    }

    @GetMapping
    public List<Task> getTasks(@RequestParam(required = false) String userId) {
        if (userId != null) {
            return taskService.getTasksByUserId(userId);
        }
        return taskService.getAllTasks();
    }
}