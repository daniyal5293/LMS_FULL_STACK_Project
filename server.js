//server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const db = require('./db');
const app = express();
const PORT = 3001;
app.use(cors()); 
app.use(express.json());
const fs = require('fs');



// Multer setup for file upload
const storage = multer.memoryStorage();  // Store file in memory
const upload = multer({ storage });

app.post('/assignments', upload.single('document'), (req, res) => {
  const { course_id, title, description, due_date } = req.body;
  let document = null;

  if (req.file) {
    document = req.file.buffer;  // Store the file buffer (binary content)
  }

  if (!course_id || !title || !due_date) {
    return res.status(400).send('Course ID, Title, and Due Date are required');
  }

  const sql = `
    INSERT INTO assignments (course_id, title, description, due_date, document)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [course_id, title, description, due_date, document], (err, result) => {
    if (err) {
      console.error('Error adding assignment:', err);
      return res.status(500).send({ message: 'Error creating assignment', error: err }); // More detailed error response
    }
    res.status(201).send({ message: 'Assignment created successfully', assignmentId: result.insertId });
  });
});



// Route for uploading material

app.post('/materials', upload.single('document'), (req, res) => {
  const { heading } = req.body;
  let document = null;

  if (req.file) {
    document = req.file.buffer;
  }

  if (!heading || !document) {
    return res.status(400).send('Heading and document are required');
  }

  const sql = `
    INSERT INTO materials (title, file_content)
    VALUES (?, ?)
  `;
  db.query(sql, [heading, document], (err, result) => {
    if (err) {
      console.error('Error uploading material:', err);
      return res.status(500).send({ message: 'Error uploading material', error: err });
    }
    res.status(201).send({ message: 'Material uploaded successfully', materialId: result.insertId });
  });
});


// Route for fetching all materials
app.get('/get_materials', (req, res) => {
  const sql = `SELECT id, title, created_at FROM materials ORDER BY created_at DESC`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching materials:', err);
      return res.status(500).send({ message: 'Error fetching materials' });
    }

    res.send(results);
  });
});



// inserting Admin
// app.get('/insert-admin', (req, res) => {
//     const name = 'Admin';
//     const email = 'admin@gmail.com';
//     const password = bcrypt.hashSync('admin123', 10);
//     const role = 'admin';

//     const sql = "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)";

//     db.query(sql, [name, email,password, role], (err, result) => {
//         if(err) res.status(500).send("Inserted ERROR :" + err.message);
//         res.send(' Admin inserted with ID: ' + result.insertId);
//     });
// });


//inserting teacher
// app.get('/insert-teacher', (req, res) => {
//     const name = 'teacher User';
//     const email = 'teacher@example.com';
//     const password = bcrypt.hashSync('teacher123', 10);
//     const role = 'teacher';

//     const sql = "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)";

//     db.query(sql, [name, email,password, role], (err, result) => {
//         if(err) res.status(500).send("Inserted ERROR :" + err.message);
//         res.send('teacher inserted with ID: ' + result.insertId);
//     });
// });





// Login Route

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Error querying the database:", err);
            return res.status(500).send('Server error');
        }

        // If no user found with the given email
        if (results.length === 0) {
            console.log(`No user found with email: ${email}`);
            return res.status(401).send('Invalid email or password');
        }

        const user = results[0];
        
        // Checking password match
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            console.log(`Password mismatch for email: ${email}`);
            return res.status(401).send('Invalid email or password');
        }

        // Removing password from the user object before sending it to the frontend
        delete user.password;
        
        // Send response back to frontend
        console.log(`User ${user.name} logged in successfully`);
        res.json({ message: 'Login successful', user });
    });
});







// Route for getting all courses
app.get('/courses', (req, res) => {
    db.query('SELECT * FROM courses', (err, results) => {
      if (err) return res.status(500).send('Server error');
      res.json(results);
    });
  });
  

  // Add a course and assign a teacher
app.post('/courses', (req, res) => {
  const { course_name, course_code, teacher_id } = req.body;

  const sqlCourse = "INSERT INTO courses (course_name, course_code) VALUES (?, ?)";
  db.query(sqlCourse, [course_name, course_code], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error adding course');
    }

    const courseId = result.insertId; // Newly created course id
    const sqlTeacherCourse = "INSERT INTO teacher_courses (teacher_id, course_id) VALUES (?, ?)";
    db.query(sqlTeacherCourse, [teacher_id, courseId], (err2, result2) => {
      if (err2) {
        console.log(err2);
        return res.status(500).send('Error assigning course to teacher');
      }
      res.status(200).send('Course added and assigned to teacher successfully');
    });
  });
});

  
  // Route for deleting a course
  app.delete('/courses/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM courses WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).send('Error deleting course');
      res.status(200).send('Course deleted');
    });
  });
  

  
 
  

  
// 📥 Add New User
app.post('/users', (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    const values = [name, email, hashedPassword, role];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).send('Error adding user: ' + err.message);
        res.send({ message: 'User added successfully', userId: result.insertId });
    });
});

// 📦 Get All Users
app.get('/users', (req, res) => {
    db.query("SELECT id, name, email, role FROM users", (err, results) => {
        if (err) return res.status(500).send('Error fetching users: ' + err.message);
        res.json(results);
    });
});


// PUT: Update user
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
  
    let sql;
    let values;
  
    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      sql = `UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?`;
      values = [name, email, hashedPassword, role, id];
    } else {
      sql = `UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?`;
      values = [name, email, role, id];
    }
  
    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).send('Error updating user: ' + err.message);
      }
      res.send(`User with ID: ${id} updated successfully`);
    });
  });
  
  
  
  // DELETE: Delete user
  app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';
  
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.status(500).send('Error deleting user: ' + err.message);
      }
      res.send(`User with ID: ${id} deleted successfully`);
    });
  });
  

//get teachers
app.get('/teachers', (req, res) => {
    db.query("SELECT id, name, email FROM users WHERE role = 'teacher'", (err, results) => {
      if (err) {
        console.error('❌ Error in /teachers:', err.message);
        return res.status(500).send('Error fetching teachers');
      }
      console.log('✅ Teachers fetched successfully');
      res.json(results);
    });
  });
  
  
//get student 
app.get('/students', (req, res) => {
    db.query("SELECT id, name, email FROM users WHERE role = 'student'", (err, results) => {
      if (err) return res.status(500).send('Error fetching students');
      res.json(results);
    });
  });
  
// Get all teachers with their assigned courses
app.get('/teachers-with-courses', (req, res) => {
  const sql = `
      SELECT 
          users.id AS teacher_id,
          users.name AS teacher_name,
          users.email AS teacher_email,
          GROUP_CONCAT(courses.course_name) AS assigned_courses
      FROM users
      LEFT JOIN teacher_courses ON users.id = teacher_courses.teacher_id
      LEFT JOIN courses ON teacher_courses.course_id = courses.id
      WHERE users.role = 'teacher'
      GROUP BY users.id;
  `;
  
  db.query(sql, (err, results) => {
      if (err) {
          console.error('Error fetching teachers with courses:', err);
          return res.status(500).send('Server error');
      }
      res.json(results);
  });
});



// 📥 Enroll a student in a course
app.post('/enrollments', (req, res) => {
  const { student_id, course_id } = req.body;

  // Check if the student is already enrolled in the course
  const checkEnrollmentSql = 'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?';
  db.query(checkEnrollmentSql, [student_id, course_id], (err, results) => {
    if (err) {
      return res.status(500).send('Error checking enrollment: ' + err.message);
    }

    if (results.length > 0) {
      // Student is already enrolled in this course
      return res.status(400).send('This student is already enrolled in this course');
    }

    // If not enrolled, proceed to insert the new enrollment record
    const sql = 'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)';
    db.query(sql, [student_id, course_id], (err, result) => {
      if (err) {
        return res.status(500).send('Error enrolling student: ' + err.message);
      }
      res.send({ message: 'Student enrolled successfully', enrollmentId: result.insertId });
    });
  });
});


// 📦 Get all enrollments with student + course info
app.get('/enrollments', (req, res) => {
  const sql = `
    SELECT e.id, u.name AS student_name, c.course_name 
    FROM enrollments e
    JOIN users u ON e.student_id = u.id
    JOIN courses c ON e.course_id = c.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send('Error fetching enrollments: ' + err.message);
    res.json(results);
  });
});


// POST: Add new announcement using stored procedure
app.post('/announcements', (req, res) => {
  const { title, message } = req.body;
  const sql = "CALL AddAnnouncement(?, ?)";
  db.query(sql, [title, message], (err, result) => {
      if (err) return res.status(500).send('Error adding announcement: ' + err.message);
      res.send({ message: 'Announcement added successfully' });
  });
});

app.get('/announcements', (req, res) => {
  db.query('SELECT * FROM announcements ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Error fetching announcements:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});


app.get('/api/counts', (req, res) => {
  db.query('SELECT COUNT(*) as count FROM users', (err, users) => {
      if (err) return res.status(500).json({ error: 'Error fetching users' });

      db.query('SELECT COUNT(*) as count FROM users WHERE role = "teacher"', (err, teachers) => {
          if (err) return res.status(500).json({ error: 'Error fetching teachers' });

          db.query('SELECT COUNT(*) as count FROM users WHERE role = "student"', (err, students) => {
              if (err) return res.status(500).json({ error: 'Error fetching students' });

              db.query('SELECT COUNT(*) as count FROM courses', (err, courses) => {
                  if (err) return res.status(500).json({ error: 'Error fetching courses' });

                  db.query('SELECT COUNT(*) as count FROM enrollments', (err, enrollments) => {
                      if (err) return res.status(500).json({ error: 'Error fetching enrollments' });

                      res.json({
                          users: users[0].count,
                          teachers: teachers[0].count,
                          students: students[0].count,
                          courses: courses[0].count,
                          enrollments: enrollments[0].count,
                      });
                  });
              });
          });
      });
  });
});


// Temporary teacher classes fetch
app.get('/teacher/classes', async (req, res) => {
  try {
    // Replace teacher_id=1 with real teacher login ID later
    const [rows] = await db.promise().query(
      `SELECT courses.id AS course_id, courses.course_name, 'BSSE-4B' AS class_name 
       FROM courses
       WHERE teacher_id = 1`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});





// GET route to fetch assignments for a specific course
app.get('/assignments/:course_id', (req, res) => {
  const course_id = req.params.course_id;

  const sql = `
    SELECT * FROM assignments WHERE course_id = ?
  `;
  db.query(sql, [course_id], (err, results) => {
    if (err) {
      console.error('Error fetching assignments:', err);
      return res.status(500).send('Error fetching assignments.');
    }
    res.json(results);
  });
});

app.get('/assignments', (req, res) => {
  const query = 'SELECT * FROM assignments ORDER BY created_at DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching assignments:', err);
      res.status(500).json({ error: 'Error fetching assignments' });
      return;
    }
    res.status(200).json(results);
  });
});


app.get('/teacher/:teacherId/courses', (req, res) => {
  const { teacherId } = req.params;
  const sql = `
    SELECT c.id, c.course_name
    FROM courses c
    JOIN teacher_courses tc ON c.id = tc.course_id
    WHERE tc.teacher_id = ?
  `;
  db.query(sql, [teacherId], (err, results) => {
    if (err) return res.status(500).send('Error fetching courses');
    res.send(results);
  });
});
app.get('/course/:courseId/students', (req, res) => {
  const { courseId } = req.params;
  const sql = `
    SELECT u.id, u.name
    FROM users u
    JOIN enrollments e ON u.id = e.student_id
    WHERE e.course_id = ? AND u.role = 'student'
  `;
  db.query(sql, [courseId], (err, results) => {
    if (err) return res.status(500).send('Error fetching students');
    res.send(results);
  });
});
app.post('/attendance', (req, res) => {
  const { course_id, date, marked_by, records } = req.body;
  if (!course_id || !date || !marked_by || !Array.isArray(records)) {
    return res.status(400).send('Missing required fields');
  }

  const values = records.map(r => [r.student_id, course_id, date, r.status, marked_by]);

  const sql = `
    INSERT INTO attendance (student_id, course_id, date, status, marked_by)
    VALUES ?
    ON DUPLICATE KEY UPDATE status = VALUES(status)
  `;

  db.query(sql, [values], (err) => {
    if (err) return res.status(500).send('Error saving attendance');
    res.send({ message: 'Attendance recorded successfully' });
  });
});



// 1. Fetch assignments with submission status for a student
app.get('/api/student/:studentId/assignments', (req, res) => {
  const { studentId } = req.params;

  const query = `
    SELECT 
      a.id AS assignment_id,
      a.title,
      a.description,
      a.due_date,
      c.course_name,
      s.id AS submission_id
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    JOIN assignments a ON c.id = a.course_id
    LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = ?
    WHERE e.student_id = ?`;

  db.query(query, [studentId, studentId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. Submit an assignment
app.post('/api/student/:studentId/submit', (req, res) => {
  const { studentId } = req.params;
  const { assignmentId, submissionText } = req.body;

  const insertQuery = `
    INSERT INTO submissions (student_id, assignment_id, submission_text)
    VALUES (?, ?, ?)`;

  db.query(insertQuery, [studentId, assignmentId, submissionText], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Assignment submitted successfully.' });
  });
});


// Node.js/Express example: GET /api/attendance/:studentId
app.get('/api/attendance/:studentId', (req, res) => {
  const studentId = req.params.studentId;
  const query = `
    SELECT c.id AS course_id, c.course_name AS course_name, a.status
    FROM attendance a
    JOIN courses c ON a.course_id = c.id
    WHERE a.student_id = ?
  `;

  db.execute(query, [studentId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const result = {};
    results.forEach(row => {
      if (!result[row.course_id]) {
        result[row.course_id] = {
          course_name: row.course_name,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0
        };
      }
      result[row.course_id].total += 1;
      result[row.course_id][row.status.toLowerCase()] += 1;
    });

    res.json(Object.values(result));
  });
});


// 1. Fetch All Announcements
app.get('/api/announcements', (req, res) => {
  const query = 'SELECT * FROM announcements ORDER BY created_at DESC';

  db.execute(query, (err, results) => {
    if (err) {
      console.error('Error fetching announcements:', err);
      return res.status(500).json({ message: 'Failed to fetch announcements' });
    }

    res.json(results);
  });
});

app.get('/api/classes/:studentId', (req, res) => {
  const studentId = req.params.studentId;

  const sql = `
    SELECT 
      c.course_name,
      c.course_code,
      u.name AS instructor_name,
      e.enrolled_at
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    JOIN teacher_courses tc ON c.id = tc.course_id
    JOIN users u ON tc.teacher_id = u.id
    WHERE e.student_id = ?
  `;

  db.execute(sql, [studentId], (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});





app.post('/api/change-password/:studentId', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const studentId = req.params.studentId;

  db.query(
    'SELECT password FROM users WHERE id = ?',
    [studentId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (results.length === 0) return res.status(404).json({ message: 'Student not found' });

      const hashedPassword = results[0].password;

      // Compare encrypted password
      bcrypt.compare(currentPassword, hashedPassword, (err, isMatch) => {
        if (err) return res.status(500).json({ message: 'Error checking password' });
        if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

        // Hash new password before updating
        bcrypt.hash(newPassword, 10, (err, newHashedPassword) => {
          if (err) return res.status(500).json({ message: 'Error hashing new password' });

          db.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [newHashedPassword, studentId],
            (err) => {
              if (err) return res.status(500).json({ message: 'Error updating password' });
              res.json({ message: 'Password changed successfully' });
            }
          );
        });
      });
    }
  );
});




// 1. Fetch All Announcements
app.get('/api/announcements', (req, res) => {
  const query = 'SELECT * FROM announcements ORDER BY created_at DESC';

  db.execute(query, (err, results) => {
    if (err) {
      console.error('Error fetching announcements:', err);
      return res.status(500).json({ message: 'Failed to fetch announcements' });
    }

    res.json(results);
  });
});


// 2. Get User Details by studentId
app.get('/api/user/:studentId', (req, res) => {
  const { studentId } = req.params;

  const query = 'SELECT * FROM users WHERE id = ?';

  db.execute(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ message: 'Failed to fetch user details' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  });
});


//  Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
