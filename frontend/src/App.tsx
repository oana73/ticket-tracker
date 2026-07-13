import { useState } from 'react';
import Login from './Login';
import TaskList from './TaskList';
import CreateTask from './CreateTask';
import Register from './Register';
import { getRoleFromToken } from './auth';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [refreshKey, setRefreshKey] = useState(0);
    const [showRegister, setShowRegister] = useState(false);
    const [view, setView] = useState('my');

    const role = getRoleFromToken(token);

    function handleLoginSuccess(newToken: string, newUsername: string) {
        localStorage.setItem('token', newToken);
        localStorage.setItem('username', newUsername);

        setToken(newToken);
        setUsername(newUsername);
    }

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');

        setToken('');
        setUsername('');
    }

    function handleTasksChanged() {
        setRefreshKey(refreshKey + 1);
    }

    if (!token) {
        if (showRegister) {
            return (
                <div className="auth-page">
                    <div>
                        <Register onRegisterSuccess={() => setShowRegister(false)} />
                        <button className="btn-link" onClick={() => setShowRegister(false)}>
                            Back to login
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="auth-page">
                <div>
                    <Login onLoginSuccess={handleLoginSuccess} />
                    <button className="btn-link" onClick={() => setShowRegister(true)}>
                        Create account
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="header">
                <h1>Task Manager</h1>
                <div className="user-info">
                    <span>{username}</span>
                    <span className="badge">{role}</span>
                    <button className="logout" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <CreateTask token={token} role={role} onTaskCreated={handleTasksChanged} />

            <div className="tabs">
                <button
                    className={view === 'my' ? 'tab active' : 'tab'}
                    onClick={() => setView('my')}
                >
                    My tasks
                </button>
                <button
                    className={view === 'all' ? 'tab active' : 'tab'}
                    onClick={() => setView('all')}
                >
                    Explore
                </button>
            </div>

            <TaskList
                token={token}
                refreshKey={refreshKey}
                role={role}
                view={view}
                onTaskDeleted={handleTasksChanged}
            />
        </div>
    );
}

export default App;