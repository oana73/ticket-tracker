import { useState, useEffect } from 'react';
import { getTasks } from './api';
import type { Task } from './types';

interface TaskListProps {
    token: string;
    refreshKey :number;
}

function TaskList({ token, refreshKey }: TaskListProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTasks() {
            try {
                const data = await getTasks(token);
                setTasks(data);
            } catch (err) {
                setError('Failed to load tasks');
            } finally {
                setLoading(false);
            }
        }

        loadTasks();
    }, [token, refreshKey]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Tasks</h2>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <strong>{task.title}</strong> — {task.status} — {task.priority}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TaskList;