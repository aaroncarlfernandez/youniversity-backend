const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const connectDB = require('./config/db.js');

// Load env variables
dotenv.config({ path: './config/config.env' });

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server running in ' + PORT));

// Connect to database
connectDB();

app.use('/api/users', require('./routes/UserRoutes.js'));
app.use('/api/courses', require('./routes/CourseRoutes.js'));
app.use('/api/degrees', require('./routes/DegreeRoutes.js'));
