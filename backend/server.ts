import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import conquistaRoutes from './routes/conquistaRoutes';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('OlympIA Backend em TypeScript está ON!');
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/conquistas', conquistaRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`OlympIA Backend ON!`);
    console.log(`Local: http://localhost:${PORT}`);
});