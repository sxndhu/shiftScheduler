import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [shifts, setShifts] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        let url = 'http://localhost:8000/api/shifts/';
        if (filterDate) url += `?date=${filterDate}`;

        const res = await axios.get(url, {
          headers: { Authorization: `Token ${token}` },
        });

        setShifts(res.data);
        setError('');
      } catch {
        setError('Failed to load shifts.');
      }
    };

    fetchShifts();
  }, [filterDate, token]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Employee Dashboard</h2>

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <button
          className="btn btn-primary"
          onClick={() => navigate('/create-shift')}
        >
          Create New Shift
        </button>

        <div className="d-flex flex-column">
          <label htmlFor="filterDate" className="form-label fw-semibold mb-1">
            Filter Shifts by Date
          </label>
          <input
            type="date"
            id="filterDate"
            className="form-control"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            aria-label="Filter shifts by date"
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {shifts.length === 0 && !error ? (
        <p className="text-center fs-5">No shifts found for the selected date.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Break Hours</th>
                <th>Approved</th>
                <th>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr key={shift.id}>
                  <td>{shift.id}</td>
                  <td>{shift.date}</td>
                  <td>
                    {new Date(shift.start_time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td>
                    {new Date(shift.end_time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td>{shift.break_hours}</td>
                  <td>{shift.is_approved ? 'Yes' : 'No'}</td>
                  <td>{shift.total_hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
