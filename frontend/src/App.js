import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminCreateUser from './components/AdminCreateUser';
import CreateShiftForm from './components/CreateShiftForm';
import ApproveDay from './components/ApproveDay';
import UserList from './components/UserList';
import Home from './components/Home';
import Navbar from './components/Navbar';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
    const token = localStorage.getItem('token');

    return (
        <Router>
           <Navbar />
            <Routes>
                 <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin-create-user" element={<AdminCreateUser />} />
                <Route path="/create-shift" element={<CreateShiftForm />} />
                <Route path="/approve-day" element={<ApproveDay />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;