import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const isStaff = localStorage.getItem('is_staff') === 'true';

    useEffect(() => {
        if (token) {
            if (isStaff) {
                navigate('/admin-dashboard');
            } else {
                navigate('/employee-dashboard');
            }
        }
    }, [token, isStaff, navigate]);

    return (
        <div className="container mt-5 text-center">
            <h1 className="mb-4">Shift Management System</h1>
            <p>Please login or register to continue.</p>
        </div>
    );
};

export default Home;