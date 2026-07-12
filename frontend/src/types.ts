export interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    assignedUserId: string;
}

export interface LoginResponse {
    token: string;
    username: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}