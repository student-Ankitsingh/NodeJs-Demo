const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
const authRoutes = require('./Routers/userRutes');
const profileRoutes = require('../src/Routers/profileRautes')
const loginRoutes = require('../src/Routers/loginRoutes'); 
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json()); 
app.use(bodyParser.json());
connectDB();

app.use(cors());
app.use(cors({
    origin: 'http://localhost:4000'
  }));
app.use('/api/users', authRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/profile', profileRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

