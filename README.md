# Resume Analyzer

A modern web application that analyzes resumes against job descriptions using AI, providing detailed insights and ATS compatibility scores.

## Features

- Resume parsing and analysis
- Job description matching
- ATS compatibility scoring
- Technical skills extraction
- Education and experience analysis
- Project and certification tracking
- MySQL database integration
- Modern, responsive UI

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- MySQL
- Groq API for AI analysis

## Prerequisites

- Node.js 18+
- MySQL Server
- npm or yarn

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/resume-analyzer.git
cd resume-analyzer
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

```
MYSQL_HOST=localhost
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=cursor_resume_analyzer
```

4. Set up the database:
   Run the SQL commands in `database/schema.sql` to create the necessary tables.

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
resume-analyzer/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── dashboard/
│   │   └── page.tsx
│   ├── components/
│   └── lib/
├── public/
├── database/
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
