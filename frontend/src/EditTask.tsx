import { useState } from 'react';
import { updateTask } from './api';
import type { Task, User } from './types';

interface EditTaskProps {
    token: string;
    task: Task;
    users: User[];
    role: string;
    onSaved: () => void;
    onCancel: () => void;
}

function EditTask({ token, task, users, role, onSaved, onCancel }: EditTaskProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [status, setStatus] = useState(task.status);
    const [priority, setPriority] = useState(task.priority);
    const [assignedUserId, setAssignedUserId] = useState(task.assignedUserId);
    const [error, setError] = useState('');
    

    async function handleSave() {
        setError('');

        try {
            await updateTask(token, {
                id: task.id,
                title,
                description,
                status,
                priority,
                assignedUserId
            });
            onSaved();
        } catch (err) {
            setError('Failed to save task');
        }
    }

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Edit task</h2>

                <input
                    className="input"
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    className="textarea"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                />

                <select
                    className="select input"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="DONE">DONE</option>
                </select>

                <select
                    className="select input"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                </select>

                {role === 'ADMIN' && (
                    <select
                        className="select input"
                        value={assignedUserId}
                        onChange={(e) => setAssignedUserId(e.target.value)}
                    >
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                )}

                {error && <p className="error">{error}</p>}

                <div className="modal-actions">
                    <button className="btn-link" onClick={onCancel}>Cancel</button>
                    <button className="btn-inline" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default EditTask;