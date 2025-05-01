import React, { useEffect, useState } from 'react';
import './SeeClasses.css'; // optional

const SeeClasses = () => {
  const [classes, setClasses] = useState([]);
  const studentId = 31; 

  useEffect(() => {
    fetch(`http://localhost:3001/api/classes/${studentId}`)
      .then(res => res.json())
      .then(data => setClasses(data))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div className="see-classes-container">
      <h2>Your Enrolled Classes</h2>
      <table className="classes-table">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Course Code</th>
            <th>Instructor</th>
            <th>Enrolled_at</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls, idx) => (
            <tr key={idx}>
              <td>{cls.course_name}</td>
              <td>{cls.course_code}</td>
              <td>{cls.instructor_name}</td>
              <td>{cls.enrolled_at || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SeeClasses;
