import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs-extra';
import AdmZip from 'adm-zip';
import { readData, writeData } from '../utils/fileUtils.js';

const router = express.Router();
const upload = multer({ dest: 'temp/' });

router.post('/upload', upload.fields([{ name: 'zip' }, { name: 'images' }]), async (req, res) => {
  try {
    const { name, level } = req.body;
    const studentId = uuidv4();
    const studentDir = path.join('uploads', level, studentId);

    await fs.ensureDir(studentDir);

    const zipPath = req.files['zip'][0].path;
    const zip = new AdmZip(zipPath);
    zip.getEntries().forEach(entry => {
      if (!entry.isDirectory) {
        const targetPath = path.join(studentDir, entry.entryName);
        fs.ensureDirSync(path.dirname(targetPath));
        fs.writeFileSync(targetPath, entry.getData());
      }
    });
    await fs.remove(zipPath);

    const imageFiles = req.files['images'] || [];
    const imageNames = [];
    for (let img of imageFiles) {
      const dest = path.join(studentDir, img.originalname);
      await fs.move(img.path, dest);
      imageNames.push(img.originalname);
    }

    const newStudent = {
      id: studentId,
      name,
      level,
      path: `${level}/${studentId}`,
      images: imageNames
    };

    const data = await readData();
    data.push(newStudent);
    await writeData(data);

    res.json({ success: true, student: newStudent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed.' });
  }
});

router.get('/', async (_req, res) => {
  const data = await readData();
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const data = await readData();
    const index = data.findIndex(student => student.id === studentId);

    if (index === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const student = data[index];
    const studentPath = path.join('uploads', student.path);

    await fs.remove(studentPath);

    data.splice(index, 1);
    await writeData(data);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed.' });
  }
});

export default router;
