import express from 'express';
import healthRoute from './routes/health.route';

const app = express();

app.use(express.json());

app.use('/api/health', healthRoute);

export default app;