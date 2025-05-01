import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageAssignments.css';

function ManageAssignments() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [document, setDocument] = useState(null); // New state for the file
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    // Fetch courses
    axios.get('http://localhost:3001/courses')
      .then(res => setCourses(res.data))
      .catch(err => alert('Error fetching courses'));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

    if (file && allowedTypes.includes(file.type)) {
      setDocument(file); // Set the selected file
    } else {
      alert('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.');
      e.target.value = ''; // Clear the input
    }
  };

  const handleSubmit = () => {
    console.log('Selected Course:', selectedCourse);
    console.log('Title:', title);
    console.log('Due Date:', dueDate);

    if (!selectedCourse || !title || !dueDate) {
      return alert('All fields are required');
    }

    const formData = new FormData();
    formData.append('course_id', selectedCourse); // Use selectedCourse id
    formData.append('title', title);
    formData.append('description', description);
    formData.append('due_date', dueDate);
    if (document) {
      formData.append('document', document); // Append the file if selected
    }

    setLoading(true); // Start loading

    axios.post('http://localhost:3001/assignments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set header for file upload
      },
    })
      .then(() => {
        alert('Assignment added successfully!');
        setTitle(''); // Reset form fields after submission
        setDescription('');
        setDueDate('');
        setDocument(null); // Reset the file input
        setSelectedCourse(''); // Reset course selection
      })
      .catch(err => {
        console.error('Error creating assignment:', err);
        alert('Error creating assignment');
      })
      .finally(() => {
        setLoading(false); // End loading
      });
  };

  return (
    <div className="manage-assignments">
      <h2>Manage Assignments</h2>
      <div className="form-group">
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)} // Set the course id here
        >
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}> {/* Use course.id as value */}
              {course.course_name}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Assignment Title"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Assignment Description"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <input
          type="file"
          onChange={handleFileChange} // Handle file input change
          accept=".pdf,.doc,.docx,.txt" // Accepts these file types
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Adding Assignment...' : 'Add Assignment'}
        </button>
      </div>
    </div>
  );
}

export default ManageAssignments;
