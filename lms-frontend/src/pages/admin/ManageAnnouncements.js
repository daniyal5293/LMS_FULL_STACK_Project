import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageAnnouncements.css'; // Custom CSS for styling

function ManageAnnouncements() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = () => {
    axios.get('http://localhost:3001/announcements')
      .then(res => setAnnouncements(res.data))
      .catch(err => alert('Error fetching announcements'));
  };

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert('Please fill in both title and message');
      return;
    }

    axios.post('http://localhost:3001/announcements', { title, message })
      .then(() => {
        alert('Announcement added successfully!');
        setTitle('');
        setMessage('');
        fetchAnnouncements();
      })
      .catch(err => alert('Error adding announcement'));
  };

  return (
    <div className="manage-announcements">
      <h2 className="page-title">Manage Announcements</h2>

      <form onSubmit={handleAddAnnouncement} className="announcement-form">
        <input 
          type="text" 
          placeholder="Announcement Title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
        />
        <textarea 
          placeholder="Announcement Message" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="form-textarea"
        ></textarea>
        <button type="submit" className="form-button">Add Announcement</button>
      </form>

      <div className="announcement-list">
        <h3 className="section-title">All Announcements</h3>
        {announcements.length === 0 ? (
          <p className="no-announcements">No announcements yet.</p>
        ) : (
          announcements.map((ann) => (
            <div className="announcement-card" key={ann.id}>
              <div className="announcement-title">{ann.title}</div>
              <div className="announcement-message">{ann.message}</div>
              <div className="announcement-date">
                Announced at: {new Date(ann.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ManageAnnouncements;
