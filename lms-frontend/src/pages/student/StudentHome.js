import React, { useState, useEffect } from 'react';
import './StudentHome.css'; 

const StudentHome = () => {
  const [userDetails, setUserDetails] = useState({});
  const [announcements, setAnnouncements] = useState([]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');

  const studentId = 31;  

  // Fetch user details
  useEffect(() => {
    fetch(`http://localhost:3001/api/user/${studentId}`)
      .then(res => res.json())
      .then(data => setUserDetails(data))
      .catch(err => console.error('Error fetching user details:', err));
  }, [studentId]);

  // Fetch announcements
  useEffect(() => {
    fetch('http://localhost:3001/api/announcements')
      .then(res => res.json())
      .then(data => setAnnouncements(data))
      .catch(err => console.error('Error fetching announcements:', err));
  }, []);

  // Handle password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
  
    // Basic validation
    if (newPassword !== confirmPassword) {
      setPasswordChangeMessage('Passwords do not match');
      return;
    }
  
    // Send the request to change the password
    fetch(`http://localhost:3001/api/change-password/${studentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPasswordChangeMessage('Password changed successfully');
          // Optionally, clear the form after successful password change
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          setPasswordChangeMessage(data.message || 'Error changing password');
        }
      })
      .catch(err => {
        console.error('Error changing password:', err);
        setPasswordChangeMessage('An error occurred. Please try again.');
      });
  };

  return (
    <div className="student-home">
      <div className="user-details-card">
        <h3>User Details</h3>
        <p>Name: {userDetails.name}</p>
        <p>Email: {userDetails.email}</p>
        <p>Role: {userDetails.role}</p>
      </div>

      <div className="announcements">
        <h3>Recent Announcements</h3>
        <ul>
          {announcements.map((announcement, index) => (
            <li key={index}>
              <h4>{announcement.title}</h4>
              <p>{announcement.message}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="password-change">
        <h3>Change Password</h3>
        {passwordChangeMessage && <p>{passwordChangeMessage}</p>}
        <form onSubmit={handlePasswordChange}>
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default StudentHome;
