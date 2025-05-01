import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaClipboard, FaFileAlt, FaUserCheck, FaSignOutAlt } from 'react-icons/fa';
import './TeacherSidebar.css';

function TeacherSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // Redirect to login
  };

  return (
    <div className="sidebar">
      <h2>Teacher Panel</h2>
      <ul>
        <li>
          <NavLink to="/teacher-dashboard" className={({ isActive }) => (isActive ? 'active-link' : '')} end>
            <FaHome /> Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/teacher-dashboard/manage-assignments" className={({ isActive }) => (isActive ? 'active-link' : '')}  >
            <FaClipboard /> Manage Assignments
          </NavLink>
        </li>
        <li>
          <NavLink to="/teacher-dashboard/manage-materials" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            <FaFileAlt /> Manage Materials
          </NavLink>
        </li>
        <li>
          <NavLink to="/teacher-dashboard/take-attendance" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            <FaUserCheck /> Take Attendance
          </NavLink>
        </li>
        <li>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default TeacherSidebar;
