import React, { useState } from 'react';
import axios from 'axios';

const AdminCreateUser = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [is_staff, setIsStaff] = useState(false);

    const handleCreate = async () => {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:8000/api/admin-create-user/', {
            username, password, is_staff
        }, {
            headers: { Authorization: `Token ${token}` }
        });
        alert('User created successfully');
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Admin Create User</h2>

            <div className="mb-3">
                <input className="form-control" placeholder="Username" value={username}
                    onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div className="mb-3">
                <input type="password" className="form-control" placeholder="Password" value={password}
                    onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" checked={is_staff}
                    onChange={(e) => setIsStaff(e.target.checked)} />
                <label className="form-check-label">Is Staff (Admin)</label>
            </div>

            <button className="btn btn-success" onClick={handleCreate}>Create User</button>
        </div>
    );
};

export default AdminCreateUser;