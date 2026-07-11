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

        try {
            await register(username, password, email);
            onRegisterSuccess();
        } catch (err) {
            setError('Registration failed. Try a different username.');
        }
    }

    return (
        <div>
            <h2>Register</h2>

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

            <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={handleSubmit}>Register</button>

            {error && <p>{error}</p>}
        </div>
    );
}

export default Register;