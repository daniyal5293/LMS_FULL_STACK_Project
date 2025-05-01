import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import ManageCourses from '../pages/admin/ManageCourses';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageTeachers from '../pages/admin/ManageTeachers';
import ManageStudents from '../pages/admin/ManageStudents';
import AdminHome from '../pages/admin/AdminHome';
import './AdminDashboard.css';
import ManageEnrollments from '../pages/admin/ManageEnrollments';
import ManageAnnouncements from '../pages/admin/ManageAnnouncements';


function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="manage-courses" element={<ManageCourses />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-teachers" element={<ManageTeachers />} />
          <Route path="manage-students" element={<ManageStudents />} />
          <Route path="manage-enrollments" element={<ManageEnrollments />} />
          <Route path="manage-announcements" element={< ManageAnnouncements />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;
