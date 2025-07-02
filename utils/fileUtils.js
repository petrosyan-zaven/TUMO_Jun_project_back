import fs from 'fs-extra';

const DATA_FILE = './data/students.json';

export const readData = () =>
  fs.readJson(DATA_FILE).catch(() => []);

export const writeData = (data) =>
  fs.writeJson(DATA_FILE, data, { spaces: 2 });
