import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/students')
      .then(res => setStudents(res.data))
      .catch(err => alert('Error fetching students'));
  }, []);

  return (
    <div>
      <h2>All Students</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th></tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default ManageStudents;
