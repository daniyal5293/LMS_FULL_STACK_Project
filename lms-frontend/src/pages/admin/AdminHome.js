import React, { useEffect, useState } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2'; // <-- Bar imported here
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement, // <-- BarElement registered here
    Title,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement, // <-- BarElement registered here
    Title,
    ChartDataLabels
);

function AdminHome() {
    const [stats, setStats] = useState({
        users: 0,
        teachers: 0,
        students: 0,
        courses: 0,
        enrollments: 0,
    });

    useEffect(() => {
        fetch('http://localhost:3001/api/counts')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error('Error fetching counts:', err));
    }, []);

    const lineChartData = {
        labels: ['Users', 'Teachers', 'Students'],
        datasets: [
            {
                label: 'User Stats',
                data: [stats.users, stats.teachers, stats.students],
                borderColor: '#4bc0c0',
                backgroundColor: '#4bc0c080',
                tension: 0.3,
                fill: true,
            },
        ],
    };

    const pieChartData = {
        labels: ['Courses', 'Enrollments'],
        datasets: [
            {
                data: [stats.courses, stats.enrollments],
                backgroundColor: ['#36A2EB', '#FF6384'],
                borderWidth: 1,
            },
        ],
    };

    const pieChartOptions = {
        plugins: {
            datalabels: {
                formatter: (value, context) => {
                    const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1) + '%';
                    return percentage;
                },
                color: '#fff',
                font: {
                    weight: 'bold',
                    size: 14,
                },
            },
            legend: {
                position: 'bottom',
                labels: {
                    font: { size: 14 },
                },
            },
            title: {
                display: true,
                text: 'Courses vs Enrollments',
                font: {
                    size: 18,
                },
            },
        },
    };

    const barChartData = {
        labels: ['Users', 'Teachers', 'Students', 'Courses', 'Enrollments'],
        datasets: [
            {
                label: 'Total Counts',
                data: [
                    stats.users,
                    stats.teachers,
                    stats.students,
                    stats.courses,
                    stats.enrollments,
                ],
                backgroundColor: [
                    '#4bc0c0',   // Users
                    '#36a2eb',   // Teachers
                    '#ff6384',   // Students
                    '#ffcd56',   // Courses
                    '#9966ff',   // Enrollments
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: '📈 Overall Statistics',
                font: {
                    size: 20,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.parsed.y}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>📊 Admin Dashboard</h2>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                gap: '1rem',
                marginBottom: '2rem',
            }}>
                {[ 
                    { label: 'Users', value: stats.users },
                    { label: 'Teachers', value: stats.teachers },
                    { label: 'Students', value: stats.students },
                    { label: 'Courses', value: stats.courses },
                    { label: 'Enrollments', value: stats.enrollments },
                ].map((item, idx) => (
                    <div key={idx} style={{
                        backgroundColor: '#f4f4f4',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        width: '180px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        textAlign: 'center',
                    }}>
                        <h4 style={{ marginBottom: '0.5rem' }}>{item.label}</h4>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{item.value}</p>
                    </div>
                ))}
            </div>
 {/* Horizontal line */}
 <hr style={{
                margin: '2rem 0',
                borderTop: '2px solid #ddd',
                width: '100%',
            }} />
            {/* Histogram / Bar Chart */}
            <div style={{
                width: '800px',
                maxWidth: '100%',
                margin: 'auto',
                backgroundColor: '#f8f9fa',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}>
                <Bar data={barChartData} options={barChartOptions} />
            </div>

            {/* Horizontal line */}
            <hr style={{
                margin: '2rem 0',
                borderTop: '2px solid #ddd',
                width: '100%',
            }} />

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '2rem',
                marginBottom: '2rem',
            }}>
                <div style={{ width: '500px', maxWidth: '100%' }}>
                    <Line data={lineChartData} />
                </div>
 {/* Horizontal line */}
 <hr style={{
                margin: '2rem 0',
                borderTop: '2px solid #ddd',
                width: '100%',
            }} />
                <div style={{ width: '400px', maxWidth: '100%' }}>
                    <Pie data={pieChartData} options={pieChartOptions} />
                </div>
            </div>
        </div>
    );
}

export default AdminHome;
