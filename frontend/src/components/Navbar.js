import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const isStaff = localStorage.getItem('is_staff') === 'true';

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/logout/', {}, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
            // Proceed to frontend logout regardless of backend response
        }

        localStorage.removeItem('token');
        localStorage.removeItem('is_staff');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <span className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                    Shift Manager
                </span>

                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {token ? (
                            <>
                                {isStaff ? (
                                    <>
                                        <li className="nav-item">
                                            <button className="btn btn-outline-light me-2" onClick={() => navigate('/')}>
                                                Admin Dashboard
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <li className="nav-item">
                                        <button className="btn btn-outline-light me-2" onClick={() => navigate('/employee-dashboard')}>
                                            My Dashboard
                                        </button>
                                    </li>
                                )}

                                <li className="nav-item">
                                    <button className="btn btn-outline-danger" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <button className="btn btn-outline-primary me-2" onClick={() => navigate('/login')}>
                                        Login
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-success" onClick={() => navigate('/register')}>
                                        Register
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;