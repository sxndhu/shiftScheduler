import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditShiftForm from './EditShiftForm';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [editingShift, setEditingShift] = useState(null);
  const [error, setError] = useState('');
  const [showUserManagement, setShowUserManagement] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
    fetchShifts();
  }, [filterDate, token]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/users/', {
        headers: { Authorization: `Token ${token}` },
      });
      setUsers(res.data);
    } catch {
      setError('Failed to load users.');
    }
  };

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

  const handleUpdateShift = (updatedShift) => {
    setShifts((prevShifts) =>
      prevShifts.map((shift) =>
        shift.id === updatedShift.id ? updatedShift : shift
      )
    );
    setEditingShift(null);
  };

  const handleDeleteShift = (deletedShiftId) => {
    setShifts((prevShifts) =>
      prevShifts.filter((shift) => shift.id !== deletedShiftId)
    );
    setEditingShift(null);
  };

  const handleDeleteFromRow = async (shiftId) => {
    if (!window.confirm('Are you sure you want to delete this shift?')) return;

    try {
      await axios.delete(`http://localhost:8000/api/shifts/${shiftId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setShifts((prev) => prev.filter((shift) => shift.id !== shiftId));
      if (editingShift?.id === shiftId) setEditingShift(null);
      alert('Shift deleted successfully.');
    } catch {
      alert('Failed to delete shift.');
    }
  };

  const handleDeleteUser = async (username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) return;

    try {
      await axios.delete(`http://localhost:8000/api/employees/${username}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.username !== username));
      alert(`User "${username}" deleted successfully.`);
    } catch {
      alert('Failed to delete user.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Admin Dashboard</h2>

      <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
        <button
          className="btn btn-primary"
          onClick={() => navigate('/create-shift')}
        >
          Create New Shift
        </button>

        <button
          className="btn btn-success"
          onClick={() => navigate('/admin-create-user')}
        >
          Create Employee
        </button>

        <button
          className="btn btn-warning"
          onClick={() => navigate('/approve-day')}
        >
          Approve Shifts
        </button>

        <button
          className="btn btn-danger"
          onClick={() => setShowUserManagement((prev) => !prev)}
        >
          {showUserManagement ? 'Hide User Management' : 'Manage Users'}
        </button>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-md-4">
          <label htmlFor="filterDate" className="form-label fw-semibold">
            Filter Shifts by Date
          </label>
          <div className="input-group">
            <input
              type="date"
              id="filterDate"
              className="form-control"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              aria-label="Filter shifts by date"
            />
            {filterDate && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => setFilterDate('')}
                aria-label="Clear date filter"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {showUserManagement && (
        <div className="mb-5">
          <h3 className="mb-3">User Management</h3>

          {users.length === 0 ? (
            <p className="text-center fs-5">No users found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Username</th>
                    <th>Is Admin</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.username}>
                      <td>{user.username}</td>
                      <td>{user.is_staff ? 'Yes' : 'No'}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteUser(user.username)}
                          aria-label={`Delete user ${user.username}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!showUserManagement && (
        <>
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
                    <th>Assigned To</th>
                    <th>Approved</th>
                    <th>Total Hours</th>
                    <th className="text-center">Actions</th>
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
                      <td>{shift.assigned_to}</td>
                      <td>{shift.is_approved ? 'Yes' : 'No'}</td>
                      <td>{shift.total_hours}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-primary me-2 mb-1"
                          onClick={() => setEditingShift(shift)}
                          aria-label={`Edit shift ${shift.id}`}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger mb-1"
                          onClick={() => handleDeleteFromRow(shift.id)}
                          aria-label={`Delete shift ${shift.id}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {editingShift && (
            <div className="mt-4">
              <EditShiftForm
                shift={editingShift}
                users={users}
                onUpdate={handleUpdateShift}
                onDelete={handleDeleteShift}
                onCancel={() => setEditingShift(null)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
