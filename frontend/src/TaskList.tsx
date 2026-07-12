import { useState, useEffect } from 'react';
import { getTasks, deleteTask, getMyTasks } from './api';
import type { Task } from './types';

interface TaskListProps {
    token: string;
    refreshKey: number;
    role: string;
    view: string;
    onTaskDeleted: () => void;
}

function TaskList({ token, refreshKey, role, view, onTaskDeleted }: TaskListProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        async function loadTasks() {
            setLoading(true);
            try {
                const data = view === 'my'
                    ? await getMyTasks (token)
                    : await getTasks(token);
                setTasks(data);
            } catch (err) {
                setError('Failed to load tasks');
            } finally {
                setLoading(false);
            }
        }

        loadTasks();
    }, [token, refreshKey, view]);

    async function handleDelete(taskId: string) {
        try {
            await deleteTask(token, taskId);
            onTaskDeleted();
        } catch (err) {
            setError('Failed to delete task');
        }
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>{view === 'my' ? 'My tasks' : 'All tasks'}</h2>
            {error && <p>{error}</p>}
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <strong>{task.title}</strong> — {task.status} — {task.priority} — user: {task.assignedUserId}
                        {role === 'ADMIN' && (
                            <button onClick={() => handleDelete(task.id)}>Delete</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TaskList;