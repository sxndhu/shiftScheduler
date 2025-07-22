import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/users/', {
                headers: { Authorization: `Token ${token}` }
            });
            setUsers(response.data);
        };

        fetchUsers();
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">User List</h2>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Is Staff</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.username}</td>
                            <td>{user.is_staff ? 'Admin' : 'Employee'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;