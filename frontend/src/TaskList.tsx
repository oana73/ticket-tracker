import { useState, useEffect } from 'react';
import { getTasks, deleteTask, getMyTasks, getUsers } from './api';
import type { Task, User } from './types';
import { getRoleFromToken, getUserIdFromToken } from './auth';
import EditTask from './EditTask';
import TaskDetails from './TaskDetailes';

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
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [viewingTask, setViewingTask] = useState<Task | null>(null);

    const currentUserId = getUserIdFromToken(token);

    function canEdit(task: Task): boolean {
        return role === 'ADMIN' || task.assignedUserId === currentUserId;
    }
    
    function getUsername(userId: string): string {
        const user = users.find(u => u.id === userId);
        return user ? user.username : 'unknown';
    }

    const activeTasks = tasks.filter(t => t.status !== 'DONE');
    const doneTasks = tasks.filter(t => t.status === 'DONE');

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

    useEffect(() => {

        getUsers(token)
            .then(setUsers)
            .catch(() => {});
    }, [token, role]);

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
            <div className="card">
                <h2>{view === 'my' ? 'My tasks' : 'All tasks'}</h2>

                {error && <p className="error">{error}</p>}

                <ul className="task-list">
                    {activeTasks.map(task => (
                        <li key={task.id} className="task">
                            <div className="task-main">
                                <span
                                    className="task-title clickable"
                                    onClick={() => setViewingTask(task)}
                                >
                                    {task.title}
                                </span>
                                <span className="task-meta">
                                    assigned to {getUsername(task.assignedUserId)}
                                </span>
                            </div>

                            <span className={'priority ' + task.priority}>{task.priority}</span>
                            <span className="status">{task.status}</span>

                            {canEdit(task) && (
                                <button className="btn-edit" onClick={() => setEditingTask(task)}>
                                    Edit
                                </button>
                            )}

                            {role === 'ADMIN' && (
                                <button className="btn-danger" onClick={() => handleDelete(task.id)}>
                                    Delete
                                </button>
                            )}
                        </li>
                    ))}
                </ul>

                {activeTasks.length === 0 && <p className="empty">No active tasks.</p>}
            </div>

            {doneTasks.length > 0 && (
                <div className="card done-section">
                    <h2>Done</h2>
                    <ul className="task-list">
                        {doneTasks.map(task => (
                            <li key={task.id} className="task done">
                                <div className="task-main">
                                    <span
                                        className={canEdit(task) ? 'task-title clickable' : 'task-title'}
                                        onClick={() => canEdit(task) && setEditingTask(task)}
                                    >
                                        {task.title}
                                    </span>
                                    <span className="task-meta">
                                        assigned to {getUsername(task.assignedUserId)}
                                    </span>
                                </div>

                                {role === 'ADMIN' && (
                                    <button className="btn-danger" onClick={() => handleDelete(task.id)}>
                                        Delete
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {editingTask && (
                <EditTask
                    token={token}
                    task={editingTask}
                    users={users}
                    role={role}
                    onSaved={() => {
                        setEditingTask(null);
                        onTaskDeleted();
                    }}
                    onCancel={() => setEditingTask(null)}
                />
            )}

            {viewingTask && (
                <TaskDetails
                    task={viewingTask}
                    users={users}
                    onClose={() => setViewingTask(null)}
                />
            )}
        </div>
    );
}

export default TaskList;