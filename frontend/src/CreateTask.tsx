import { useEffect, useState } from 'react';
import { createTask, getUsers } from './api';
import type { User } from './types';

interface CreateTaskProps {
    token: string;
    role: string;
    onTaskCreated: () => void;
}

function CreateTask({ token, role, onTaskCreated }: CreateTaskProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('MEDIUM');
    const [assignedUserId, setAssignedUserId] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadUsers() {
            if (role !== 'ADMIN') {
                return;
            }

            try {
                const data = await getUsers(token);
                setUsers(data);
            } catch (err) {
                setError('Failed to load users');
            }
        }

        loadUsers();
    }, [token, role]);

    async function handleSubmit() {
        setError('');

        try {
            await createTask(token, title, description, priority, assignedUserId);
            setTitle('');
            setDescription('');
            setAssignedUserId('');
            onTaskCreated();
        } catch (err) {
            setError('Failed to create task. Check that the user exists.');
        }
    }

    return (
        <div>
            <h2>Create task</h2>

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
            </select>

            {role === 'ADMIN' &&(
                <select
                    value={assignedUserId}
                    onChange={(e) => setAssignedUserId(e.target.value)}
                >
                    <option value="">Assign to myself</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.username}
                        </option>
                    ))}
                </select>)}

            <button onClick={handleSubmit}>Create</button>

            {error && <p>{error}</p>}
        </div>
    );
}

export default CreateTask;