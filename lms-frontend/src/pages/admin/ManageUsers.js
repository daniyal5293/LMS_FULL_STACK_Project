import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageUsers.css';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3001/users');
      setUsers(res.data);
    } catch (error) {
      alert('Error fetching users');
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = { ...formData };
  
      // If editing and password is empty, remove it from payload
      if (editingUserId && !payload.password) {
        delete payload.password;
      }
  
      if (editingUserId) {
        await axios.put(`http://localhost:3001/users/${editingUserId}`, payload);
        alert('User updated successfully!'); // ✅
      } else {
        await axios.post('http://localhost:3001/users', payload);
        alert('User added successfully!'); // ✅
      }
  
      fetchUsers();
      setFormData({ name: '', email: '', password: '', role: 'student' });
      setEditingUserId(null);
    } catch (error) {
      alert('Error adding or updating user');
      console.error(error);
    }
  };
  
  

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // You can set a password placeholder for editing
      role: user.role,
    });
    setEditingUserId(user.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/users/${id}`);
      fetchUsers();
    } catch (error) {
      alert('Error deleting user');
    }
  };

  return (
    <div className="manage-users">
      <h2>{editingUserId ? 'Edit User' : 'Add New User'}</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input name="password" value={formData.password} onChange={handleChange} placeholder="Password"  required={!editingUserId} />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">{editingUserId ? 'Update User' : 'Add User'}</button>
        {editingUserId && (
  <button type="button" onClick={() => {
    setFormData({ name: '', email: '', password: '', role: 'student' });
    setEditingUserId(null);
  }}>
    Cancel
  </button>
)}

      </form>

      <h3>All Users</h3>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Edit</button>
                <button onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageUsers;
