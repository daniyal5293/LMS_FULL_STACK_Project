import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageEnrollments.css';

function ManageEnrollments() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/students').then(res => setStudents(res.data));
    axios.get('http://localhost:3001/courses').then(res => setCourses(res.data));
    fetchEnrollments();
  }, []);

  const fetchEnrollments = () => {
    axios.get('http://localhost:3001/enrollments').then(res => setEnrollments(res.data));
  };
  const handleEnroll = () => {
    if (!selectedStudent || !selectedCourse) return alert('Select student and course');
  
    // Make the API request to enroll the student
    axios.post('http://localhost:3001/enrollments', {
      student_id: selectedStudent,
      course_id: selectedCourse
    })
    .then(() => {
      alert('Enrolled!');
      fetchEnrollments(); // Fetch the updated list of enrollments
    })
    .catch(err => {
      // If enrollment failed, check if it's a specific error
      if (err.response && err.response.status === 400) {
        alert(err.response.data); // Display the error message from the backend
      } else {
        alert('Enrollment failed');
      }
    });
  };
  

  return (
    <div className="enrollment-container">
      <h2>Enroll Student in Course</h2>

      <div className="form-group">
        <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
          <option value="">Select Student</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
          <option value="">Select Course</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
        </select>

        <button onClick={handleEnroll}>Enroll</button>
      </div>

      <h3>All Enrollments</h3>
      <table>
        <thead>
          <tr><th>ID</th><th>Student</th><th>Course</th></tr>
        </thead>
        <tbody>
          {enrollments.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.student_name}</td>
              <td>{e.course_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageEnrollments;
