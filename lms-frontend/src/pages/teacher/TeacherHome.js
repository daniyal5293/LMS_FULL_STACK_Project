import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TeacherHome.css';

function TeacherHome() {
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    // Fetch announcements from the backend
    axios.get('http://localhost:3001/announcements')
      .then(res => setAnnouncements(res.data))
      .catch(err => console.error('Error fetching announcements:', err));

    // Fetch assignments from the backend
    axios.get('http://localhost:3001/assignments')
      .then(res => setAssignments(res.data))
      .catch(err => console.error('Error fetching assignments:', err));
  }, []);

  return (
    <div className="teacher-home">
      <h2>Announcements</h2>
      <div className="announcement-cards">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="announcement-card">
            <h3>{announcement.title}</h3>
            <p>{announcement.message}</p>
            <small>{new Date(announcement.created_at).toLocaleDateString()}</small>
          </div>
        ))}
      </div>

      <h2>Assignments</h2>
      <div className="assignment-cards">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="assignment-card">
            <h3>{assignment.title}</h3>
            <p>{assignment.description}</p>
            <small>Deadline: {new Date(assignment.deadline).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeacherHome;
