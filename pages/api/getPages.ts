import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pagesDir = path.join(process.cwd(), 'pages');
    const pageFiles = getFiles(pagesDir).filter(file =>
      /\.(js|jsx|ts|tsx)$/.test(file)
    );

    const pages = pageFiles.map(file =>
      file.replace(pagesDir, '').replace(/\\/g, '/')
    );

    res.status(200).json({ pages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve pages' });
  }
}

function getFiles(dir: string, files_ = [] as string[]): string[] {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, files_);
    } else {
      files_.push(fullPath);
    }
  });

  return files_;
}
