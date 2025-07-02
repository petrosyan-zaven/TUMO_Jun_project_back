import express from 'express';
import path from 'path';
import fs from 'fs/promises';

const router = express.Router();

router.get('/:level/:id/js-files', async (req, res) => {
  const { level, id } = req.params;
  const projectPath = path.join('uploads', level, id);
  try {
    const files = await fs.readdir(projectPath);
    const jsFiles = files.filter(file => file.endsWith('.js'));
    res.json({ jsFiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list JS files' });
  }
});

router.get('/:level/:id/js-files/:fileName', async (req, res) => {
  const { level, id, fileName } = req.params;
  const filePath = path.join('uploads', level, id, fileName);

  try {
    const code = await fs.readFile(filePath, 'utf-8');
    res.json({ code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read JS file' });
  }
});

export default router;
