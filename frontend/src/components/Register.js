import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:8000/api/register/', { username, password });
            alert('Registered successfully! Please login.');
            navigate('/login');
        } catch (error) {
            alert('Registration failed!');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Register</h2>
            <div className="mb-3">
                <input className="form-control" placeholder="Username" value={username}
                    onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
                <input type="password" className="form-control" placeholder="Password" value={password}
                    onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="btn btn-success" onClick={handleRegister}>Register</button>
        </div>
    );
};

export default Register;