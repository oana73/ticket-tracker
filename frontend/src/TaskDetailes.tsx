import type { Task, User } from './types';

interface TaskDetailsProps {
    task: Task;
    users: User[];
    onClose: () => void;
}

function TaskDetails({ task, users, onClose }: TaskDetailsProps) {
    const user = users.find(u => u.id === task.assignedUserId);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>{task.title}</h2>

                <div className="detail-row">
                    <span className="detail-label">Status</span>
                    <span className="status">{task.status}</span>
                </div>

                <div className="detail-row">
                    <span className="detail-label">Priority</span>
                    <span className={'priority ' + task.priority}>{task.priority}</span>
                </div>

                <div className="detail-row">
                    <span className="detail-label">Assigned to</span>
                    <span>{user ? user.username : 'unknown'}</span>
                </div>

                <div className="detail-block">
                    <span className="detail-label">Description</span>
                    <p className="detail-text">
                        {task.description || 'No description.'}
                    </p>
                </div>

                <div className="modal-actions">
                    <button className="btn-inline" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default TaskDetails;