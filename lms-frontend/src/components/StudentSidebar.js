import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaUpload,
  FaChalkboard,
  FaCalendarCheck,
  FaHome,
  FaSignOutAlt
} from 'react-icons/fa';
import './StudentSidebar.css';

function StudentSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="sidebar">
      <h2>Student Panel</h2>
      <ul>
        <li>
          <NavLink
            to="/student-dashboard"
            className={({ isActive }) => isActive ? 'active-link' : '' }
            end
          >
            <FaHome /> Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/student-dashboard/upload-assignment"
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <FaUpload /> Upload Assignment
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/student-dashboard/see-classes"
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <FaChalkboard /> See Classes
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/student-dashboard/see-attendance"
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <FaCalendarCheck /> See Attendance
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

export default StudentSidebar;
