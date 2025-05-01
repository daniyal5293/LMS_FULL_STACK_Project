import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';
import TeacherHome from '../pages/teacher/TeacherHome';
import ManageAssignments from '../pages/teacher/ManageAssignments';
import ManageMaterials from '../pages/teacher/ManageMaterials';
import TakeAttendance from '../pages/teacher/TakeAttendance';
import './TeacherDashboard.css';
// other imports like AdminDashboard etc...

function App() {
 return (

     <div className="teacher-dashboard">
       <TeacherSidebar />
       <div className="teacher-content">
         <Routes>
           <Route path="/" element={<TeacherHome />} />
           <Route path="manage-assignments" element={<ManageAssignments />} />
           <Route path="manage-materials" element={<ManageMaterials />} />
           <Route path="take-attendance" element={<TakeAttendance />} />
         </Routes>
       </div>
     </div>
   );
}

export default App;
