// src/components/student/UploadAssignment.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UploadAssignment.css';
const UploadAssignment = () => {
  const studentId = 31; 
  const [assignments, setAssignments] = useState([]);
  const [submissionText, setSubmissionText] = useState({});
  const [submitted, setSubmitted] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:3001/api/student/${studentId}/assignments`)
      .then(res => {
        setAssignments(res.data);
        const submittedMap = {};
        res.data.forEach(a => submittedMap[a.assignment_id] = !!a.submission_id);
        setSubmitted(submittedMap);
      })
      .catch(err => console.error('Error fetching assignments:', err));
  }, [studentId]);

  const handleSubmit = async (assignmentId) => {
    try {
      await axios.post(`http://localhost:3001/api/student/${studentId}/submit`, {
        assignmentId,
        submissionText: submissionText[assignmentId] || ''
      });
      setSubmitted(prev => ({ ...prev, [assignmentId]: true }));
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  return (
    <div className="upload-assignment">
      <h2>Upload Assignments</h2>
      {assignments.map(a => (
        <div key={a.assignment_id} className="assignment-card">
          <h3>{a.title} ({a.course_name})</h3>
          <p>{a.description}</p>
          <p><strong>Due:</strong> {a.due_date}</p>

          {submitted[a.assignment_id] ? (
            <p style={{ color: 'green' }}><strong>Status:</strong> DONE</p>
          ) : (
            <>
              <p style={{ color: 'red' }}><strong>Status:</strong> PENDING</p>
              <textarea
                placeholder="Enter submission text..."
                value={submissionText[a.assignment_id] || ''}
                onChange={(e) => setSubmissionText({ ...submissionText, [a.assignment_id]: e.target.value })}
              />
              <button onClick={() => handleSubmit(a.assignment_id)}>Submit</button>
            </>
            
          )}
           <hr style={{
            margin: '2rem 0',
            borderTop: '2px solid #ddd',
            width: '100%',
        }} />
        </div>
          
      ))}
    
    </div>
  );
};

export default UploadAssignment;
