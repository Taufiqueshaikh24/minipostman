import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import v1Routes from './routes/v1/index.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,              
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json()); 
app.use(morgan('dev'));
app.use(cookieParser()); 

app.use('/api/v1', v1Routes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mini Postman API running' });
});

export default app;
