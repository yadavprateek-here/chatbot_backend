import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './db/mongo';

import chatRouter from './routes/chat.route';
import tenantRouter from './routes/tenant.route';
import documentRouter from './routes/document.route';

const app = express();

app.use(cors());
app.use(express.json());


connectDB(); // 🔥 MongoDB connects here

// 🔹 APIs
app.use('/chat', chatRouter);
app.use('/api/tenants', tenantRouter);
app.use('/api', documentRouter); // 👈 THIS LINE

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});




