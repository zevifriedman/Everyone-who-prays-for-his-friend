const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// הגדרת השרת
const app = express();
const port = 3001;

// חיבור למסד הנתונים
mongoose.connect('mongodb://localhost/notifications', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MongoDB connected');
});

// הגדרת middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// הגדרת המסלול לטעינת kol.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html' ));
});

// API לשליחת התראה
app.post('/api/send-notification', (req, res) => {
  const { message } = req.body;

  // כאן תוכל להוסיף לוגיקה לשליחת התראה לכל המשתמשים
  // לדוגמה, תוכל לשמור את ההודעה במסד הנתונים ולשלוח אותה מאוחר יותר

  console.log('Notification message received:', message);

  // שליחה של תגובה ללקוח
  res.json({ status: 'success', message: 'Notification sent!' });
});

// הפעלת השרת
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
