import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';

const startServer = async () => {
  try {
    await connectDB();

    console.log('✅ MongoDB connected successfully');

    app.listen(env.PORT, 'localhost', () => {
      console.log(`🚀 Server running on http://localhost:${env.PORT}`);
      console.log(`🌱 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();