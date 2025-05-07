import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'cursor_resume_analyzer',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function to store resume analysis data
export async function storeResumeAnalysis(userId: number, fileName: string, analysisResult: any) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // 1. Insert into resumes table
    const [resumeResult] = await connection.execute(
      'INSERT INTO resumes (user_id, file_name, ats_score) VALUES (?, ?, ?)',
      [userId, fileName, analysisResult.atsScore || 0]
    );
    const resumeId = (resumeResult as any).insertId;

    // 2. Store personal information
    if (analysisResult.personalInformation) {
      await connection.execute(
        'INSERT INTO personal_information (resume_id, name, email, phone, github, linkedin) VALUES (?, ?, ?, ?, ?, ?)',
        [
          resumeId,
          analysisResult.personalInformation.name,
          analysisResult.personalInformation.email,
          analysisResult.personalInformation.phone,
          analysisResult.personalInformation.github,
          analysisResult.personalInformation.linkedin
        ]
      );
    }

    // 3. Store professional summary
    if (analysisResult.professionalSummary) {
      await connection.execute(
        'INSERT INTO professional_summary (resume_id, summary_text) VALUES (?, ?)',
        [resumeId, analysisResult.professionalSummary]
      );
    }

    // 4. Store education
    if (analysisResult.education && Array.isArray(analysisResult.education)) {
      for (const edu of analysisResult.education) {
        await connection.execute(
          'INSERT INTO education (resume_id, institution, degree, location, duration, grade) VALUES (?, ?, ?, ?, ?, ?)',
          [resumeId, edu.institution, edu.degree, edu.location, edu.duration, edu.grade]
        );
      }
    }

    // 5. Store projects and their bullets
    if (analysisResult.projects && Array.isArray(analysisResult.projects)) {
      for (const project of analysisResult.projects) {
        const [projectResult] = await connection.execute(
          'INSERT INTO projects (resume_id, title, tech_stack, duration) VALUES (?, ?, ?, ?)',
          [resumeId, project.title, project.techStack, project.duration]
        );
        const projectId = (projectResult as any).insertId;

        if (project.bullets && Array.isArray(project.bullets)) {
          for (const bullet of project.bullets) {
            await connection.execute(
              'INSERT INTO project_bullets (project_id, bullet_text) VALUES (?, ?)',
              [projectId, bullet]
            );
          }
        }
      }
    }

    // 6. Store experience and their bullets
    if (analysisResult.experience && Array.isArray(analysisResult.experience)) {
      for (const exp of analysisResult.experience) {
        const [expResult] = await connection.execute(
          'INSERT INTO experience (resume_id, company, role, location, duration) VALUES (?, ?, ?, ?, ?)',
          [resumeId, exp.company, exp.role, exp.location, exp.duration]
        );
        const experienceId = (expResult as any).insertId;

        if (exp.bullets && Array.isArray(exp.bullets)) {
          for (const bullet of exp.bullets) {
            await connection.execute(
              'INSERT INTO experience_bullets (experience_id, bullet_text) VALUES (?, ?)',
              [experienceId, bullet]
            );
          }
        }
      }
    }

    // 7. Store technical skills
    if (analysisResult.technicalSkills) {
      const skillTypes = ['languages', 'frameworks', 'tools', 'ides'];
      for (const type of skillTypes) {
        const skills = analysisResult.technicalSkills[type] || [];
        for (const skill of skills) {
          await connection.execute(
            'INSERT INTO technical_skills (resume_id, skill_type, skill_name) VALUES (?, ?, ?)',
            [resumeId, type, skill]
          );
        }
      }
    }

    // 8. Store coursework
    if (analysisResult.coursework && Array.isArray(analysisResult.coursework)) {
      for (const course of analysisResult.coursework) {
        await connection.execute(
          'INSERT INTO coursework (resume_id, course_name) VALUES (?, ?)',
          [resumeId, course]
        );
      }
    }

    // 9. Store certifications
    if (analysisResult.certifications && Array.isArray(analysisResult.certifications)) {
      for (const cert of analysisResult.certifications) {
        await connection.execute(
          'INSERT INTO certifications (resume_id, cert_name) VALUES (?, ?)',
          [resumeId, cert]
        );
      }
    }

    // 10. Store job skills
    if (analysisResult.jobSkills && Array.isArray(analysisResult.jobSkills)) {
      for (const skill of analysisResult.jobSkills) {
        await connection.execute(
          'INSERT INTO job_skills (resume_id, skill_name) VALUES (?, ?)',
          [resumeId, skill]
        );
      }
    }

    // 11. Store analysis history
    await connection.execute(
      'INSERT INTO analysis_history (resume_id, job_description, match_percentage) VALUES (?, ?, ?)',
      [resumeId, analysisResult.jobDescription, analysisResult.matchPercentage || 0]
    );

    await connection.commit();
    return resumeId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Helper function to check if resume exists
export async function checkResumeExists(userId: number, fileName: string) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT resume_id FROM resumes WHERE user_id = ? AND file_name = ?',
      [userId, fileName]
    );
    return (rows as any[]).length > 0 ? (rows as any[])[0].resume_id : null;
  } finally {
    connection.release();
  }
}

// Export pool for server-side use only
export default pool; 