import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import quizRoutes from './routes/quizRoutes';
import feedbackRoutes from './routes/feedbackRoutes';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Log de requisições para facilitar o diagnóstico de conectividade
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Body:', JSON.stringify(req.body));
  }
  next();
});

app.get('/', (req, res) => {
  res.send('OlympIA Backend em TypeScript está ON!');
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/feedback', feedbackRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`OlympIA Backend ON!`);
    console.log(`Local: http://localhost:${PORT}`);
});