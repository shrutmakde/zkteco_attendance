const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const employeeRoutes = require('./routes/employeeRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const exportRoutes = require('./routes/export');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database connection and server start
const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = app; 