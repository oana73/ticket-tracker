import { useState } from 'react';
import { register } from './api';

interface RegisterProps {
    onRegisterSuccess: () => void;
}

function Register({ onRegisterSuccess }: RegisterProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit() {
        setError('');

        if (!username || !password || !email) {
            setError('All fields are required');
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            setError('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            await register(username, password, email);
            onRegisterSuccess();
        } catch (err) {
            setError('Registration failed. Try a different username.');
        }
    }

    return (
        <div className="auth-card">
            <h2>Register</h2>

            <input
                className="input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                className="input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <input
                className="input"
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button className="btn" onClick={handleSubmit}>Register</button>

            {error && <p>{error}</p>}
        </div>
    );
}

export default Register;