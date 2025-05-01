import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageTeachers.css';

function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    // Fetch teachers with courses
    axios.get('http://localhost:3001/teachers-with-courses')
      .then(res => setTeachers(res.data))
      .catch(err => alert('Error fetching teachers'));
  }, []);

  return (
    <div>
      <h2>All Teachers</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map(teacher => {
            // If the teacher has assigned courses, create a row for each course
            if (teacher.assigned_courses) {
              return teacher.assigned_courses.split(',').map((course, index) => (
                <tr key={`${teacher.teacher_id}-${index}`}>
                  {index === 0 ? (
                    <td rowSpan={teacher.assigned_courses.split(',').length}>{teacher.teacher_id}</td>
                  ) : null}
                  {index === 0 ? (
                    <td rowSpan={teacher.assigned_courses.split(',').length}>{teacher.teacher_name}</td>
                  ) : null}
                  {index === 0 ? (
                    <td rowSpan={teacher.assigned_courses.split(',').length}>{teacher.teacher_email}</td>
                  ) : null}
                  <td>{course.trim()}</td>
                </tr>
              ));
            } else {
              return (
                <tr key={teacher.teacher_id}>
                  <td>{teacher.teacher_id}</td>
                  <td>{teacher.teacher_name}</td>
                  <td>{teacher.teacher_email}</td>
                  <td>No courses assigned</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ManageTeachers;
