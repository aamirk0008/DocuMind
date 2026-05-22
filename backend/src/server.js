import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import redis from './config/redis.js'; // boots connection
import './workers/ingestion.worker.js'; // boots the BullMQ worker

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});