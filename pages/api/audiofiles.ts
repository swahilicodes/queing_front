// pages/api/files.ts
import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const dirPath = path.join(process.cwd(), 'public/mp3');
  try {
    const files = fs.readdirSync(dirPath)
      .filter((file) => file.endsWith('.mp3'));
    res.status(200).json({ files });
  } catch (error) {
    res.status(500).json({ error: 'Error reading files' });
  }
}
