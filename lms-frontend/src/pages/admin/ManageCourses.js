import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageCourses.css';

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    course_name: '',
    course_code: '',
    teacher_id: ''
  });

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchCourses = () => {
    axios.get('http://localhost:3001/courses')
      .then(res => setCourses(res.data))
      .catch(() => alert('Error fetching courses'));
  };

  const fetchTeachers = () => {
    axios.get('http://localhost:3001/teachers')
      .then(res => setTeachers(res.data))
      .catch(() => alert('Error fetching teachers'));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/courses', formData)
      .then(() => {
        alert('Course added');
        setFormData({ course_name: '', course_code: '', teacher_id: '' });
        fetchCourses();
      })
      .catch(() => alert('Error adding course'));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/courses/${id}`)
      .then(() => fetchCourses())
      .catch(() => alert('Error deleting course'));
  };

  return (
    <div className="manage-courses">
      <h2>Manage Courses</h2>

      <form onSubmit={handleSubmit} className="course-form">
        <input
          type="text"
          name="course_name"
          value={formData.course_name}
          onChange={handleChange}
          placeholder="Course Name"
          required
        />
        <input
          type="text"
          name="course_code"
          value={formData.course_code}
          onChange={handleChange}
          placeholder="Course Code"
          required
        />
        <select
          name="teacher_id"
          value={formData.teacher_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Teacher</option>
          {teachers.map(teacher => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name} (ID: {teacher.id})
            </option>
          ))}
        </select>
        <button type="submit">Add Course</button>
      </form>

      <table className="courses-table">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Code</th><th>Action</th></tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.course_name}</td>
              <td>{course.course_code}</td>
              
              <td><button onClick={() => handleDelete(course.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageCourses;
