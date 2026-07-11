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