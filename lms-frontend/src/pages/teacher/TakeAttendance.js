import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TakeAttendance.css';

function TakeAttendance() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  localStorage.setItem('userId', '15');

  // Correct way to get the value
  const teacherId = localStorage.getItem('userId'); // Replace with actual logged-in teacher ID logic\
  // localStorage.setItem('userId', '2'); // use your actual teacher id


  // Fetch teacher's courses
  useEffect(() => {
    if (!teacherId) return;
    axios.get(`http://localhost:3001/teacher/${teacherId}/courses`)
      .then(res => setCourses(res.data))
      .catch(err => console.error('Error fetching courses:', err));
  }, [teacherId]);

  // Fetch students on course selection
  useEffect(() => {
    if (!selectedCourse) return;
    axios.get(`http://localhost:3001/course/${selectedCourse}/students`)
      .then(res => {
        setStudents(res.data);
        const initialAttendance = {};
        res.data.forEach(s => initialAttendance[s.id] = 'Present');
        setAttendance(initialAttendance);
      })
      .catch(err => console.error('Error fetching students:', err));
  }, [selectedCourse]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    const records = Object.entries(attendance).map(([student_id, status]) => ({
      student_id: parseInt(student_id),
      status
    }));

    try {
      await axios.post('http://localhost:3001/attendance', {
        course_id: selectedCourse,
        date,
        marked_by: teacherId,
        records
      });
      alert('Attendance submitted successfully!');
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Error submitting attendance.');
    }
  };

  return (
    <div className="attendance-container">
  <h2>Take Attendance</h2>

  <label>Select Course:</label>
  <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
    <option value="">-- Select Course --</option>
    {courses.map(course => (
      <option key={course.id} value={course.id}>
        {course.course_name}
      </option>
    ))}
  </select>

  <label>Date:</label>
  <input type="date" value={date} onChange={e => setDate(e.target.value)} />

  {students.length > 0 && (
    <div>
      <h3>Students</h3>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>
                <select
                  value={attendance[student.id] || 'Present'}
                  onChange={e => handleStatusChange(student.id, e.target.value)}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Excused">Excused</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleSubmit}>Submit Attendance</button>
    </div>
  )}
</div>

  );
}

export default TakeAttendance;
