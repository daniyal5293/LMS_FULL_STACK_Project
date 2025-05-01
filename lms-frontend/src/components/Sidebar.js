import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaBook, FaSignOutAlt, FaUserPlus, FaBullhorn, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li>
          <NavLink 
            to="/admin-dashboard" 
            className={({ isActive }) => isActive ? 'active-link' : ''}
            end
          >
            <FaHome /> Home
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/admin-dashboard/manage-courses" 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <FaBook /> Manage Courses
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/admin-dashboard/manage-users" 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <FaUsers /> Manage Users
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/admin-dashboard/manage-enrollments" 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <FaUserPlus /> Manage Enrollments
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/admin-dashboard/manage-teachers" 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <FaChalkboardTeacher /> Manage Teachers
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/admin-dashboard/manage-students" 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <FaUserGraduate /> Manage Students
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/admin-dashboard/manage-announcements" 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <FaBullhorn /> Manage Announcements
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

export default Sidebar;
