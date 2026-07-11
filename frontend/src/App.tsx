import { useState } from 'react';
import Login from './Login';
import TaskList from './TaskList';
import CreateTask from './CreateTask';
import Register from './Register';

function App() {
    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [showRegister, setShowRegister] = useState(false);

    function handleLoginSuccess(newToken: string, newUsername: string) {
        setToken(newToken);
        setUsername(newUsername);
    }

    function handleTaskCreated() {
        setRefreshKey(refreshKey + 1);
    }

    function handleLogout() {
        setToken('');
        setUsername('');
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
            <CreateTask token={token} onTaskCreated={handleTaskCreated} />
            <TaskList token={token} refreshKey={refreshKey} />
        </div>
    );
}



export default App;