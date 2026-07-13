package com.tickets.taskservice.service;

import com.tickets.taskservice.model.Task;
import com.tickets.taskservice.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final RestTemplate restTemplate;

    @Value("${user-service.url}")
    private String userServiceUrl;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
        this.restTemplate = new RestTemplate();
    }

    public Task createTask(Task task, String authHeader) {

        if (task.getAssignedUserId() == null || task.getAssignedUserId().isBlank()) {
            String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
            task.setAssignedUserId(currentUserId);
        } else {
            boolean userExists = checkUserExists(task.getAssignedUserId(), authHeader);

            if (!userExists) {
                throw new RuntimeException("Assigned user does not exist: " + task.getAssignedUserId());
            }
        }

        if (task.getStatus() == null) {
            task.setStatus("TODO");
        }

        return taskRepository.save(task);
    }


    private boolean checkUserExists(String userId, String authHeader) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authHeader);

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            restTemplate.exchange(
                    userServiceUrl + "/api/users/" + userId,
                    HttpMethod.GET,
                    entity,
                    Object.class
            );

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getMyTasks() {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        return taskRepository.findByAssignedUserId(currentUserId);
    }



    public void deleteTask(String id) {

        taskRepository.deleteById(id);
    }

    public List<Task> getTasksByUserId(String userId){
        return taskRepository.findByAssignedUserId(userId);
    }

    public Task updateTask(String id, Task updatedTask) {

        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found: " + id));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = auth.getName();

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        boolean isOwner = currentUserId.equals(existingTask.getAssignedUserId());

        if (!isAdmin && !isOwner) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only edit your own tasks");
        }

        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setDescription(updatedTask.getDescription());
        existingTask.setStatus(updatedTask.getStatus());
        existingTask.setPriority(updatedTask.getPriority());

        if (isAdmin) {
            existingTask.setAssignedUserId(updatedTask.getAssignedUserId());
        }

        return taskRepository.save(existingTask);
    }

}