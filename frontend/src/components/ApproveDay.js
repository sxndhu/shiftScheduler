import React, { useState } from 'react';
import axios from 'axios';

const ApproveDay = () => {
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');

    const isStaff = localStorage.getItem('is_staff') === 'true';

if (!isStaff) {
    return (
        <div className="container mt-5">
            <h3>Unauthorized</h3>
            <p>You do not have permission to access this page.</p>
        </div>
    );
}

    const handleApprove = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8000/api/shifts/approve-day/',
                { date },
                {
                    headers: { Authorization: `Token ${token}` }
                }
            );
            setMessage(response.data.message);
            setError('');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                setError(err.response.data.error || err.response.data.message);
            } else {
                setError('Something went wrong.');
            }
            setMessage('');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Approve Shifts for a Day</h2>

            <div className="mb-3">
                <label htmlFor="dateInput" className="form-label">Select Date:</label>
                <input
                    type="date"
                    id="dateInput"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <button className="btn btn-warning" onClick={handleApprove}>
                Approve All Shifts for This Date
            </button>

            {message && <div className="alert alert-success mt-3">{message}</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
    );
};

export default ApproveDay;