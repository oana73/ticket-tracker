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


    function handleLoginSuccess(newToken: string, newUsername: string, newRole: string) {
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
                <div>
                    <Register onRegisterSuccess={() => setShowRegister(false)} />
                    <button onClick={() => setShowRegister(false)}>Back to login</button>
                </div>
            );
        }

        return (
            <div>
                <Login onLoginSuccess={handleLoginSuccess} />
                <button onClick={() => setShowRegister(true)}>Create account</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Task Manager</h1>
            <p>Logged in as: {username} <button onClick={handleLogout}>Logout</button></p>
            <CreateTask token={token} role={role} onTaskCreated={handleTasksChanged} />
             <div>
                <button onClick={() => setView('my')}>My tasks</button>
                <button onClick={() => setView('all')}>Explore</button>
            </div>
            <TaskList token={token} refreshKey={refreshKey} role={role} view={view} onTaskDeleted={handleTasksChanged}/>
        </div>
    );
}



export default App;