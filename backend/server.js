const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const paperRoutes = require('./routes/paperRoutes');
const individualPaperRoutes = require('./routes/individualPaperRoutes');

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB connection with caching for serverless
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const MONGO = process.env.MONGO_URI || 'mongodb+srv://Fahim123:Fahim786@cluster0.rattrsg.mongodb.net/QuestionPaper';
  
  try {
    const conn = await mongoose.connect(MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    cachedDb = conn;
    console.log('MongoDB Connected');
    return conn;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

// Connect to DB before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/paper', paperRoutes);
app.use('/api/individual-paper', individualPaperRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Question Paper API is running',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'API is working',
    endpoints: [
      '/api/auth/signup',
      '/api/auth/login',
      '/api/questions/submit',
      '/api/paper/generate'
    ]
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  connectToDatabase().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

// Export for Vercel
module.exports = app;