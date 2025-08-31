import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB  from './lib/db.js';
dotenv.config();  
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS first
app.use(cors({
  origin: true, // Allow all origins for now, restrict in production
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configure JSON parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Error handling middleware for JSON parsing errors
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    console.error('JSON parsing error:', error.message);
    return res.status(400).json({ error: 'Invalid JSON format' });
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
