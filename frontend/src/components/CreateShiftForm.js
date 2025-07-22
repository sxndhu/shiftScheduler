import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateShiftForm = ({ onSuccess }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [breakHours, setBreakHours] = useState(0);
  const [date, setDate] = useState('');
  const [assignedTo, setAssignedTo] = useState(''); // selected user
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('is_staff') === 'true';

  // Fetch users if admin
  useEffect(() => {
    if (isAdmin) {
      axios.get('http://localhost:8000/api/users/', {
        headers: { Authorization: `Token ${token}` }
      })
      .then(res => {
        setUsers(res.data);
        if (res.data.length > 0) setAssignedTo(res.data[0].username);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load users');
      });
    }
  }, [isAdmin, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        break_hours: parseFloat(breakHours),
        date: date,
      };

      if (isAdmin) {
        payload.assigned_to = assignedTo;
      }

      const res = await axios.post('http://localhost:8000/api/shifts/', payload, {
        headers: { Authorization: `Token ${token}` }
      });

      console.log('Shift create response:', res);
      onSuccess(res.data);

      // Clear form after success
      setStartTime('');
      setEndTime('');
      setBreakHours(0);
      setDate('');
      if (isAdmin && users.length > 0) {
        setAssignedTo(users[0].username);
      } else {
        setAssignedTo('');
      }
    } catch (err) {
      console.error('Create shift error:', err.response || err);
      setError('Failed to create shift. Check your inputs.');
    }
  };

  return (
    <div className="card p-4 mb-4">
      <h4>Create New Shift</h4>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">Start Time</label>
          <input
            type="datetime-local"
            className="form-control"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">End Time</label>
          <input
            type="datetime-local"
            className="form-control"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
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
            onChange={e => setBreakHours(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date (YYYY-MM-DD)</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>

        {isAdmin && (
          <div className="mb-3">
            <label className="form-label">Assign To</label>
            <select
              className="form-select"
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              required
            >
              {users.map(user => (
                <option key={user.username} value={user.username}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" className="btn btn-primary">Create Shift</button>
      </form>
    </div>
  );
};

export default CreateShiftForm;