import { useState } from 'react';
import { createTask } from './api';

interface CreateTaskProps {
    token: string;
    onTaskCreated: () => void;
}

function CreateTask({ token, onTaskCreated }: CreateTaskProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('MEDIUM');
    const [assignedUserId, setAssignedUserId] = useState('');
    const [error, setError] = useState('');

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

            <input
                type="text"
                placeholder="Assigned user ID"
                value={assignedUserId}
                onChange={(e) => setAssignedUserId(e.target.value)}
            />

            <button onClick={handleSubmit}>Create</button>

            {error && <p>{error}</p>}
        </div>
    );
}

export default CreateTask;