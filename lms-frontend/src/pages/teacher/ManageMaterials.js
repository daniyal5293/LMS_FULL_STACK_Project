import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import './ManageAssignments.css'; // reuse same styles

function ManageMaterial() {
  const [heading, setHeading] = useState('');
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = () => {
    axios.get('http://localhost:3001/get_materials')
      .then(res => setMaterials(res.data))
      .catch(err => {
        console.error('Error fetching materials:', err);
        alert('Could not load materials');
      });
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

    if (file && allowedTypes.includes(file.type)) {
      setDocument(file);
    } else {
      alert('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.');
      e.target.value = '';
    }
  };

  const handleSubmit = () => {
    if (!heading || !document) {
      return alert('Heading and document are required');
    }

    const formData = new FormData();
    formData.append('heading', heading);
    formData.append('document', document);

    setLoading(true);
    axios.post('http://localhost:3001/materials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(() => {
        alert('Material uploaded successfully!');
        setHeading('');
        setDocument(null);
      })
      .catch((err) => {
        console.error('Error uploading material:', err);
        alert('Error uploading material');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="manage-assignments">
      <h2>Upload Material</h2>
      <div className="form-group">
        <input
          type="text"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="Material Heading"
        />

        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt"
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Material'}
        </button>
      </div>
      <hr style={{
                margin: '2rem 0',
                borderTop: '2px solid #ddd',
                width: '100%',
            }} />
      <h3>Uploaded Materials</h3>
<ul>
  {materials.map((mat) => (
    <li key={mat.id}>
      {mat.title} — {new Date(mat.created_at).toLocaleString()}
      {' '}
      <a href={`http://localhost:3001/materials/${mat.id}/download`} target="_blank" rel="noopener noreferrer">
        Download
      </a>
    </li>
  ))}
</ul>
    </div>
  );
}

export default ManageMaterial;
