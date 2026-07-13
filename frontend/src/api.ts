import type { Task, LoginResponse, User } from './types';

const USER_API = 'http://localhost:8081/api/users';
const TASK_API = 'http://localhost:8082/api/tasks';

export async function login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${USER_API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        throw new Error('Invalid username or password');
    }

    return response.json();
}

export async function getTasks(token: string): Promise<Task[]> {
    const response = await fetch(TASK_API, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        throw new Error('Failed to load tasks');
    }

    return response.json();
}

export async function createTask(
    token: string,
    title: string,
    description: string,
    priority: string,
    assignedUserId: string
): Promise<Task> {
    const response = await fetch(TASK_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, priority, assignedUserId })
    });

    if (!response.ok) {
        throw new Error('Failed to create task');
    }

    return response.json();
}

export async function deleteTask(token: string, taskId: string): Promise<void> {
    const response = await fetch(`${TASK_API}/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        throw new Error('Failed to delete task');
    }
}

export async function register(
    username: string,
    password: string,
    email: string
): Promise<void> {
    const response = await fetch(`${USER_API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email })
    });

    if (!response.ok) {
        throw new Error('Registration failed');
    }
}

export async function getUsers(token: string): Promise<User[]> {
    const response = await fetch(USER_API, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        throw new Error('Failed to load users');
    }

    return response.json();
}

export async function getMyTasks(token: string): Promise<Task[]> {
    const response = await fetch(`${TASK_API}/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        throw new Error('Failed to load tasks');
    }

    return response.json();
}

export async function updateTask(token: string, task: Task): Promise<Task> {
    const response = await fetch(`${TASK_API}/${task.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(task)
    });

    if (!response.ok) {
        throw new Error('Failed to update task');
    }

    return response.json();
}