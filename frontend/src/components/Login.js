import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Step 1: Get token
            const response = await axios.post('http://localhost:8000/api/token/', {
                username,
                password
            });

            const token = response.data.token;
            localStorage.setItem('token', token);

            // Step 2: Fetch current user info (username, is_staff)
            const userInfoResponse = await axios.get('http://localhost:8000/api/current-user/', {
                headers: { Authorization: `Token ${token}` }
            });

            localStorage.setItem('is_staff', userInfoResponse.data.is_staff);

            // Step 3: Redirect to home
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Invalid credentials or server error.');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h2>Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        id="username"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
        </div>
    );
};

export default Login;