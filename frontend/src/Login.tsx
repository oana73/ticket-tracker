import { useState } from 'react';
import { login } from './api';

interface LoginProps {
    onLoginSuccess: (token: string, username: string) => void;
}

function Login({ onLoginSuccess }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit() {
        setError('');

        try {
            const response = await login(username, password);
            onLoginSuccess(response.token, response.username);
        } catch (err) {
            setError('Invalid username or password');
        }
    }

    return (
        <div>
            <h2>Login</h2>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleSubmit}>Login</button>

            {error && <p>{error}</p>}
        </div>
    );
}

export default Login;