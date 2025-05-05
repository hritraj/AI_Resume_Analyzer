import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile, Fields, Files, IncomingForm } from 'formidable';
import fs from 'fs-extra';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const config = {
  api: { bodyParser: false },
};

const SKILL_LIST = [
  "python", "java", "sql", "aws", "javascript", "react", "node", "leadership", "communication", "problem-solving"
];

const SECTION_LIST = ["summary", "experience", "education", "skills"];

async function extractText(filePath: string, mimetype: string) {
  if (mimetype === "application/pdf") {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimetype === "application/msword"
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  return "";
}

function parseForm(req: NextApiRequest, form: typeof IncomingForm) {
  const instance = new form();
  return new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
    instance.parse(req, (err: any, fields: Fields, files: Files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.ensureDir(uploadDir);

  const form = new IncomingForm({
    multiples: false,
    uploadDir,
    keepExtensions: true,
    filename: (name: string, ext: string, part: any, form: any) => part.originalFilename || `${name}${ext}`,
  });

  try {
    const { fields, files } = await parseForm(req, IncomingForm);

    if (!files.resume) {
      res.status(500).json({ error: 'Upload failed' });
      return;
    }
    const file = Array.isArray(files.resume) ? files.resume[0] : files.resume as FormidableFile;
    const filePath = file.filepath as string;
    const mimetype = file.mimetype as string;
    if (!filePath || !mimetype) {
      res.status(500).json({ error: 'File path or mimetype not found' });
      return;
    }

    let text = '';
    try {
      text = await extractText(filePath, mimetype);
    } catch (e) {
      res.status(500).json({ error: 'Failed to extract text from resume.' });
      return;
    }

    // Skill extraction (simple keyword match)
    const foundSkills = SKILL_LIST.filter(skill =>
      text.toLowerCase().includes(skill)
    );

    // Section checks
    const foundSections = SECTION_LIST.filter(section =>
      text.toLowerCase().includes(section)
    );

    res.status(200).json({
      message: 'File uploaded and analyzed successfully',
      skills: foundSkills,
      sections: foundSections,
      sectionCompleteness: SECTION_LIST.map(section => ({
        section,
        present: foundSections.includes(section),
      })),
      text,
    });
  } catch (e) {
    res.status(500).json({ error: 'Unexpected server error.' });
  }
}