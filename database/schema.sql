-- Create resumes table
CREATE TABLE resumes (
    resume_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    file_name VARCHAR(255) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ats_score INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create personal_information table
CREATE TABLE personal_information (
    info_id INT PRIMARY KEY AUTO_INCREMENT,
    resume_id INT,
    name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    github VARCHAR(255),
    linkedin VARCHAR(255),
    FOREIGN KEY (resume_id) REFERENCES resumes(resume_id)
);

-- Create professional_summary table
CREATE TABLE professional_summary (
    summary_id INT PRIMARY KEY AUTO_INCREMENT,
    resume_id INT,
    summary_text TEXT,
    FOREIGN KEY (resume_id) REFERENCES resumes(resume_id)
);

-- Create education table
CREATE TABLE education (
    education_id INT PRIMARY KEY AUTO_INCREMENT,
    resume_id INT,
    institution VARCHAR(255),
    degree VARCHAR(255),
    location VARCHAR(255),
    duration VARCHAR(100),
    grade VARCHAR(50),
    FOREIGN KEY (resume_id) REFERENCES resumes(resume_id)
);

-- Create projects table
CREATE TABLE projects (
    project_id INT PRIMARY KEY AUTO_INCREMENT,
    resume_id INT,
    title VARCHAR(255),
    tech_stack TEXT,
    duration VARCHAR(100),
    FOREIGN KEY (resume_id) REFERENCES resumes(resume_id)
);

-- Create project_bullets table
CREATE TABLE project_bullets (
    bullet_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT,
    bullet_text TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

-- Create experience table
CREATE TABLE experience (
    experience_id INT PRIMARY KEY AUTO_INCREMENT,
    resume_id INT,
    company VARCHAR(255),
    role VARCHAR(255),
    location VARCHAR(255),
    duration VARCHAR(100),
    FOREIGN KEY (resume_id) REFERENCES resumes(resume_id)
);

-- Create experience_bullets table
CREATE TABLE experience_bullets (
    bullet_id INT PRIMARY KEY AUTO_INCREMENT,
    experience_id INT,
    bullet_text TEXT,
    FOREIGN KEY (experience_id) REFERENCES experience(experience_id)
);

-- Create technical_skills table
CREATE TABLE technical_skills (
    skill_id INT PRIMARY KEY AUTO_INCREMENT,
    resume_id INT,
    skill_type ENUM('languages', 'frameworks', 'tools', 'ides'),
    skill_name VARCHAR(100),
    FOREIGN KEY (resume_id) REFERENCES resumes(resume_id)
);

-- Create coursework table
CREATE TABLE coursework (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    resume_id INT,
    course_name VARCHAR(255),
    FOREIGN KEY (resume_id) REFERENCES resumes(resume_id)
);

-- Create certifications table
CREATE TABLE certifications (
    cert_id INT PRIMARY KEY AUTO_INCREMENT,
    resume_id INT,
    cert_name VARCHAR(255),
    FOREIGN KEY (resume_id) REFERENCES resumes(resume_id)
);

-- Create job_skills table
CREATE TABLE job_skills (
    skill_id INT PRIMARY KEY AUTO_INCREMENT,
    resume_id INT,
    skill_name VARCHAR(100),
    FOREIGN KEY (resume_id) REFERENCES resumes(resume_id)
);

-- Create analysis_history table
CREATE TABLE analysis_history (
    analysis_id INT PRIMARY KEY AUTO_INCREMENT,
    resume_id INT,
    analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    job_description TEXT,
    match_percentage INT,
    FOREIGN KEY (resume_id) REFERENCES resumes(resume_id)
); 