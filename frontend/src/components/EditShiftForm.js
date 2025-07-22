import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EditShiftForm = ({ shift, users, onUpdate, onDelete, onCancel }) => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [breakHours, setBreakHours] = useState(0);
    const [assignedTo, setAssignedTo] = useState('');
    const [date, setDate] = useState('');

    const token = localStorage.getItem('token');

    // Format datetime to "YYYY-MM-DDTHH:mm" for datetime-local input
    const formatDateTimeLocal = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const tzOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    };

    useEffect(() => {
        if (shift) {
            setStartTime(formatDateTimeLocal(shift.start_time));
            setEndTime(formatDateTimeLocal(shift.end_time));
            setBreakHours(shift.break_hours);
            setAssignedTo(shift.assigned_to || '');
            setDate(shift.date || '');
        }
    }, [shift]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const shiftData = {
            start_time: new Date(startTime).toISOString(),
            end_time: new Date(endTime).toISOString(),
            break_hours: parseFloat(breakHours),
            assigned_to: assignedTo,
            date: date
        };

        try {
            await api.put(`shifts/${shift.id}/`, shiftData, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            alert('Shift updated successfully!');
            onUpdate();
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                alert(`Failed to update shift: ${JSON.stringify(error.response.data)}`);
            } else {
                alert('Failed to update shift.');
            }
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this shift?')) return;

        try {
            await api.delete(`shifts/${shift.id}/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            alert('Shift deleted successfully!');
            onDelete();
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                alert(`Failed to delete shift: ${JSON.stringify(error.response.data)}`);
            } else {
                alert('Failed to delete shift.');
            }
        }
    };

    return (
        <div className="card mt-4">
            <div className="card-body">
                <h5 className="card-title">Edit Shift</h5>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Assign To</label>
                        <select
                            className="form-select"
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                            required
                        >
                            <option value="">Select Employee</option>
                            {users.map(user => (
                                <option key={user.username} value={user.username}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Start Time</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">End Time</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Break Hours</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="form-control"
                            value={breakHours}
                            onChange={(e) => setBreakHours(e.target.value)}
                            required
                        />
                        <small className="text-muted">Example: 0.25 for 15 mins, 0.75 for 45 mins</small>
                    </div>

                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">Update Shift</button>
                        <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete Shift</button>
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditShiftForm;