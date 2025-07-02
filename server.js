import express from 'express';
import cors from 'cors';
import path from 'path';
import studentRoutes from './routes/students.js';
import codeRoutes from './routes/code.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/code', codeRoutes);

app.use('/students', studentRoutes);

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
