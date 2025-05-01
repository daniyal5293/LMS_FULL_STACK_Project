import React, { useEffect, useState } from 'react';
import './SeeAttendance.css';

function SeeAttendance() {
    const [attendanceData, setAttendanceData] = useState([]);
    const studentId = 31; // hardcoded for now

    useEffect(() => {
        fetch(`http://localhost:3001/api/attendance/${studentId}`)
            .then(res => res.json())
            .then(data => setAttendanceData(data))
            .catch(err => console.error('Failed to fetch attendance', err));
    }, []);

    return (
        <div style={{
            padding: '2rem',
            fontFamily: 'Segoe UI, sans-serif',
            marginLeft: '250px', // ✅ important!
            boxSizing: 'border-box',
            minHeight: '100vh'
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>📅 Attendance Summary</h2>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                justifyContent: 'center'
            }}>
                {attendanceData.map((course, idx) => {
                    const percent = ((course.present / course.total) * 100).toFixed(1);
                    return (
                        <div key={idx} style={{
                            backgroundColor: '#f9f9f9',
                            borderRadius: '12px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            padding: '1.5rem',
                            width: '300px',
                            textAlign: 'center',
                        }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>{course.course_name}</h3>
                            <p style={{ fontSize: '1.2rem' }}>
                                <strong>{percent}%</strong> Present
                            </p>
                            <div style={{ textAlign: 'left', marginTop: '1rem', fontSize: '0.95rem' }}>
                                <p><strong>Total Classes:</strong> {course.total}</p>
                                <p><strong>Present:</strong> {course.present}</p>
                                <p><strong>Absent:</strong> {course.absent}</p>
                                <p><strong>Late:</strong> {course.late}</p>
                                <p><strong>Excused:</strong> {course.excused}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SeeAttendance;
