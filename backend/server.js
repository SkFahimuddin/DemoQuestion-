const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const paperRoutes = require('./routes/paperRoutes');
const individualPaperRoutes = require('./routes/individualPaperRoutes');

const app = express();

// UPDATED CORS - Allow all origins for now (we'll restrict after deployment)
app.use(cors({
     origin: ['https://demo-question-ddz9.vercel.app/'], // Your actual frontend URL
     credentials: true
   }));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/paper', paperRoutes);
app.use('/api/individual-paper', individualPaperRoutes);

// ADD: Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Question Paper API is running',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb+srv://Fahim123:Fahim786@cluster0.rattrsg.mongodb.net/QuestionPaper';

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('Connected to MongoDB');
    app.listen(PORT, ()=> console.log('Server running on port', PORT));
  })
  .catch(err => console.error(err));

// Export for Vercel serverless
module.exports = app;