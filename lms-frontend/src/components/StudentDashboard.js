import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentHome from '../pages/student/StudentHome'; 
import SeeClasses from '../pages/student/SeeClasses';
import SeeAttendance from '../pages/student/SeeAttendance';
import UploadAssignment from '../pages/student/UploadAssignment';
import StudentSidebar from './StudentSidebar';
import './StudentDashboard.css';

const StudentDashboard = () => {
  return (
    <div className="student-dashboard">
      <StudentSidebar />
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<StudentHome />} />
          <Route path="upload-assignment" element={<UploadAssignment />} />
          <Route path="see-classes" element={<SeeClasses />} />
          <Route path="see-attendance" element={<SeeAttendance />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;
