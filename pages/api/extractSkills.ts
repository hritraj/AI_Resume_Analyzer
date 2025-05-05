import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { text, type } = req.body;
  if (!text || !type) return res.status(400).json({ error: 'No text or type provided' });

  if (type === 'resume') {
    // Improved prompt: ask for organized, concise, and clear JSON output for specific sections
    const prompt = `Extract and organize the following sections from this resume text. Be concise and clear. Return a JSON object with these fields:
{
  "personalInformation": { "name": "", "email": "", "phone": "", "github": "", "linkedin": "" },
  "professionalSummary": "2-3 lines max",
  "education": [ { "institution": "", "degree": "", "location": "", "duration": "", "grade": "" } ],
  "projects": [ { "title": "", "techStack": "", "duration": "", "bullets": ["", "", ""] } ],
  "experience": [ { "company": "", "role": "", "location": "", "duration": "", "bullets": ["", "", ""] } ],
  "technicalSkills": { "languages": [], "frameworks": [], "tools": [], "ides": [] },
  "coursework": [],
  "certifications": []
}

Resume:
${text}`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1800,
        temperature: 0.2,
      }),
    });

    const data = await groqRes.json();
    let content = data.choices?.[0]?.message?.content || '';
    let parsed: any = {};
    try {
      // Find the first { ... } block in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // fallback: return empty structure
      parsed = {};
    }
    return res.status(200).json(parsed);
  } else if (type === 'job') {
    // Extract only skills from job description
    const prompt = `Extract only the required skills and technologies from this job description. Return ONLY a comma-separated list of skills, with NO extra text or explanation.\n\n${text}`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.2,
      }),
    });

    const data = await groqRes.json();
    let content = data.choices?.[0]?.message?.content || '';
    // Post-process: if there's a colon, use only the part after the first colon
    if (content.includes(':')) {
      content = content.split(':').slice(1).join(':').trim();
    }
    const skills = content.split(',').map((s: string) => s.trim()).filter(Boolean);
    return res.status(200).json({ skills });
  } else {
    return res.status(400).json({ error: 'Invalid type' });
  }
} 