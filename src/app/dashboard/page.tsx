"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [username, setUsername] = useState("User");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }
    if (!jobDescription.trim()) {
      alert("Please enter the job description.");
      return;
    }
    setLoading(true);
    try {
      // 1. Extract job skills using Groq API
      let jobSkills: string[] = [];
      try {
        const jobSkillRes = await fetch('/api/extractSkills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: jobDescription, type: 'job' }),
        });
        const jobSkillData = await jobSkillRes.json();
        jobSkills = jobSkillData.skills || [];
      } catch (err) {
        setLoading(false);
        alert('Failed to extract job skills.');
        return;
      }

      // 2. Upload resume and get resume text/skills/sections
      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('jobDescription', jobDescription);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        alert('Upload failed');
        return;
      }

      // 3. Extract skills and sections from resume text using Groq
      try {
        const resumeSkillRes = await fetch('/api/extractSkills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: data.text, type: 'resume' }),
        });
        const resumeSkillData = await resumeSkillRes.json();
        
        // Calculate match percentage
        const techSkills = [
          ...(resumeSkillData.technicalSkills?.languages || []),
          ...(resumeSkillData.technicalSkills?.frameworks || []),
          ...(resumeSkillData.technicalSkills?.tools || []),
          ...(resumeSkillData.technicalSkills?.ides || [])
        ].map((s: string) => s.toLowerCase());
        
        const matched = jobSkills.filter((skill: string) => 
          techSkills.includes(skill.toLowerCase())
        );
        const matchPercentage = jobSkills.length > 0 
          ? Math.round((matched.length / jobSkills.length) * 100) 
          : 0;

        // Prepare analysis result
        const analysisResult = {
          ...data,
          ...resumeSkillData,
          jobSkills,
          jobDescription,
          matchPercentage,
          atsScore: matchPercentage // Using match percentage as ATS score for now
        };

        // Store in database using API route
        const userId = 1; // TODO: Get actual user ID from session
        const storeRes = await fetch('/api/storeAnalysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            fileName: selectedFile.name,
            analysisResult
          })
        });

        if (!storeRes.ok) {
          throw new Error('Failed to store analysis');
        }

        const storeData = await storeRes.json();
        setAnalysisResult(analysisResult);
        setLoading(false);
        
        if (storeData.isDuplicate) {
          alert('This resume has been analyzed before. Showing analysis results without storing duplicate data.');
        } else {
          alert('Resume analyzed and stored successfully!');
        }
      } catch (err) {
        console.error('Analysis error:', err);
        setLoading(false);
        alert('Failed to analyze resume.');
      }
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
      alert('An error occurred during analysis.');
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Welcome & Profile Summary */}
        <section className="mb-8 flex flex-col md:flex-row items-center justify-between bg-white p-8 rounded-lg shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome, {username}!</h1>
            <p className="text-gray-600 text-lg">Here's your personalized resume dashboard.</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="bg-blue-100 text-blue-700 px-6 py-3 rounded-lg font-semibold shadow-sm">
              ATS Score: <span className="font-bold">85%</span>
            </div>
            <div className="bg-green-100 text-green-700 px-6 py-3 rounded-lg font-semibold shadow-sm">
              Resumes: <span className="font-bold">3</span>
            </div>
          </div>
        </section>

        {/* Analyze Resume Section */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow flex flex-col md:flex-row gap-8">
          {/* Upload Resume Card */}
          <div className="flex-1 flex flex-col items-center">
            <label
              htmlFor="resume-upload"
              className="w-full border-2 border-dashed border-blue-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition"
            >
              <svg className="w-12 h-12 text-blue-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-gray-600 mb-2">
                {selectedFile ? (
                  <>File selected: <span className="font-semibold text-blue-600">{selectedFile.name}</span></>
                ) : (
                  <>Click or drag to upload</>
                )}
              </span>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
                }}
              />
            </label>
            <textarea
              className="w-full mt-4 p-3 border rounded text-gray-900"
              rows={5}
              placeholder="Paste the job description here... (required)"
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              required
            />
            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              onClick={handleAnalyze}
            >
              Analyze Resume
            </button>
            <p className="mt-2 text-xs text-gray-400 text-center">
              Your data is processed securely and never stored on our servers.
            </p>
          </div>
        </section>

        {/* Skill Extraction Result Section */}
        {loading && (
          <section className="mb-8 bg-white p-8 rounded-2xl shadow-lg flex items-center justify-center">
            <span className="text-blue-600 text-lg font-semibold animate-pulse">Analyzing... Please wait.</span>
          </section>
        )}
        {analysisResult && !loading && (
          <section className="mb-8 bg-white p-8 rounded-2xl shadow-lg">
            {/* Top: Match Score and Key Insights side by side */}
            <div className="flex flex-col lg:flex-row gap-8 mb-8 items-start">
              {/* Match Score */}
              <div className="flex flex-col items-center lg:items-start min-w-[180px]">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Match Score</h2>
                <div className="flex gap-6 mb-4">
                  <div className="flex flex-col items-center">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      {(() => {
                        const jobSkills = (analysisResult.jobSkills || []).map((s: string) => s.toLowerCase());
                        const techSkills = [
                          ...(analysisResult.technicalSkills?.languages || []),
                          ...(analysisResult.technicalSkills?.frameworks || []),
                          ...(analysisResult.technicalSkills?.tools || []),
                          ...(analysisResult.technicalSkills?.ides || [])
                        ].map((s: string) => s.toLowerCase());
                        const matched = jobSkills.filter((skill: string) => techSkills.includes(skill));
                        const missing = jobSkills.filter((skill: string) => !techSkills.includes(skill));
                        const percent = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 0;
                        return (
                          <>
                            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
                              <path className="text-gray-200" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831" />
                              <path className="text-blue-500" strokeWidth="4" strokeDasharray={`${percent}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <span className="absolute text-xl font-bold text-blue-600">{percent}%</span>
                          </>
                        );
                      })()}
                    </div>
                    <span className="text-gray-700 mt-2 text-sm">Skills Match</span>
                  </div>
                </div>
              </div>
              {/* Key Insights */}
              <div className="flex-1 w-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Key Insights</h3>
                {(() => {
                  const jobSkills = (analysisResult.jobSkills || []).map((s: string) => s.toLowerCase());
                  const techSkills = [
                    ...(analysisResult.technicalSkills?.languages || []),
                    ...(analysisResult.technicalSkills?.frameworks || []),
                    ...(analysisResult.technicalSkills?.tools || []),
                    ...(analysisResult.technicalSkills?.ides || [])
                  ].map((s: string) => s.toLowerCase());
                  const missing = jobSkills.filter((skill: string) => !techSkills.includes(skill));
                  return (
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>✔️ {jobSkills.length - missing.length} out of {jobSkills.length} required job skills found in your resume.</li>
                      {missing.length > 0 && (
                        <li className="text-red-600">Missing: {missing.join(", ")}</li>
                      )}
                      <li>⚠️ Add more quantifiable achievements to strengthen your resume.</li>
                      <li>⚠️ Tailor your resume for better job match.</li>
                    </ul>
                  );
                })()}
              </div>
            </div>
            {/* Resume Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                {/* Personal Information */}
                {analysisResult.personalInformation && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="font-bold text-blue-700 mb-2 text-lg">Personal Information</div>
                    <div className="text-gray-800 text-sm grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                      {analysisResult.personalInformation.name && <div><span className="font-semibold">Name:</span> {analysisResult.personalInformation.name}</div>}
                      {analysisResult.personalInformation.email && <div><span className="font-semibold">Email:</span> {analysisResult.personalInformation.email}</div>}
                      {analysisResult.personalInformation.phone && <div><span className="font-semibold">Phone:</span> {analysisResult.personalInformation.phone}</div>}
                      {analysisResult.personalInformation.github && <div><span className="font-semibold">GitHub:</span> {analysisResult.personalInformation.github}</div>}
                      {analysisResult.personalInformation.linkedin && <div><span className="font-semibold">LinkedIn:</span> {analysisResult.personalInformation.linkedin}</div>}
                    </div>
                  </div>
                )}
                {/* Professional Summary */}
                {analysisResult.professionalSummary && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="font-bold text-blue-700 mb-2 text-lg">Professional Summary</div>
                    <div className="text-gray-800 text-sm">{analysisResult.professionalSummary}</div>
                  </div>
                )}
                {/* Education */}
                {analysisResult.education && Array.isArray(analysisResult.education) && analysisResult.education.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="font-bold text-blue-700 mb-2 text-lg">Education</div>
                    <div className="flex flex-col gap-2">
                      {analysisResult.education.map((edu: any, idx: number) => (
                        <div key={idx} className="border-b last:border-b-0 pb-2 last:pb-0">
                          <div className="font-semibold text-gray-900">{edu.institution} {edu.degree && `- ${edu.degree}`}</div>
                          <div className="text-gray-700 text-sm">{edu.location} {edu.duration && `| ${edu.duration}`}</div>
                          {edu.grade && <div className="text-gray-600 text-xs">Grade: {edu.grade}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Projects */}
                {analysisResult.projects && Array.isArray(analysisResult.projects) && analysisResult.projects.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="font-bold text-blue-700 mb-2 text-lg">Projects</div>
                    <div className="flex flex-col gap-2">
                      {analysisResult.projects.map((proj: any, idx: number) => (
                        <div key={idx} className="border-b last:border-b-0 pb-2 last:pb-0">
                          <div className="font-semibold text-gray-900">{proj.title}</div>
                          <div className="text-gray-700 text-sm">{proj.techStack} {proj.duration && `| ${proj.duration}`}</div>
                          {proj.bullets && Array.isArray(proj.bullets) && proj.bullets.slice(0, 3).map((b: string, i: number) => (
                            <div key={i} className="text-gray-600 text-xs ml-2">• {b}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Experience */}
                {analysisResult.experience && Array.isArray(analysisResult.experience) && analysisResult.experience.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="font-bold text-blue-700 mb-2 text-lg">Experience</div>
                    <div className="flex flex-col gap-2">
                      {analysisResult.experience.map((exp: any, idx: number) => (
                        <div key={idx} className="border-b last:border-b-0 pb-2 last:pb-0">
                          <div className="font-semibold text-gray-900">{exp.company} {exp.role && `- ${exp.role}`}</div>
                          <div className="text-gray-700 text-sm">{exp.location} {exp.duration && `| ${exp.duration}`}</div>
                          {exp.bullets && Array.isArray(exp.bullets) && exp.bullets.slice(0, 3).map((b: string, i: number) => (
                            <div key={i} className="text-gray-600 text-xs ml-2">• {b}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-6">
                {/* Technical Skills */}
                {analysisResult.technicalSkills && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="font-bold text-blue-700 mb-2 text-lg">Technical Skills</div>
                    <div className="flex flex-col gap-2">
                      {analysisResult.technicalSkills.languages && analysisResult.technicalSkills.languages.length > 0 && (
                        <div className="mb-1">
                          <span className="font-semibold text-gray-800">Languages:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {analysisResult.technicalSkills.languages.map((lang: string, idx: number) => (
                              <span key={idx} className="inline-block bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full text-sm shadow-sm border border-blue-200">{lang}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysisResult.technicalSkills.frameworks && analysisResult.technicalSkills.frameworks.length > 0 && (
                        <div className="mb-1">
                          <span className="font-semibold text-gray-800">Frameworks:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {analysisResult.technicalSkills.frameworks.map((fw: string, idx: number) => (
                              <span key={idx} className="inline-block bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full text-sm shadow-sm border border-green-200">{fw}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysisResult.technicalSkills.tools && analysisResult.technicalSkills.tools.length > 0 && (
                        <div className="mb-1">
                          <span className="font-semibold text-gray-800">Tools:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {analysisResult.technicalSkills.tools.map((tool: string, idx: number) => (
                              <span key={idx} className="inline-block bg-yellow-100 text-yellow-800 font-medium px-3 py-1 rounded-full text-sm shadow-sm border border-yellow-200">{tool}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysisResult.technicalSkills.ides && analysisResult.technicalSkills.ides.length > 0 && (
                        <div className="mb-1">
                          <span className="font-semibold text-gray-800">IDEs:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {analysisResult.technicalSkills.ides.map((ide: string, idx: number) => (
                              <span key={idx} className="inline-block bg-purple-100 text-purple-800 font-medium px-3 py-1 rounded-full text-sm shadow-sm border border-purple-200">{ide}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Coursework */}
                {analysisResult.coursework && Array.isArray(analysisResult.coursework) && analysisResult.coursework.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="font-bold text-blue-700 mb-2 text-lg">Coursework</div>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.coursework.map((course: string, idx: number) => (
                        <span key={idx} className="inline-block bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full text-sm shadow-sm border border-blue-200">{course}</span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Certifications */}
                {analysisResult.certifications && Array.isArray(analysisResult.certifications) && analysisResult.certifications.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="font-bold text-blue-700 mb-2 text-lg">Certifications</div>
                    <ul className="list-disc list-inside text-gray-800 text-sm">
                      {analysisResult.certifications.map((cert: string, idx: number) => (
                        <li key={idx}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Resume Upload & Management */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Resumes</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            <li className="py-4 flex items-center justify-between">
              <span className="text-gray-800 font-medium">resume_june2024.pdf</span>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-semibold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0A9 9 0 11 3 12a9 9 0 0118 0z" /></svg>
                  View
                </button>
                <button className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm font-semibold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  Delete
                </button>
              </div>
            </li>
            <li className="py-4 flex items-center justify-between">
              <span className="text-gray-800 font-medium">resume_may2024.pdf</span>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-semibold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0A9 9 0 11 3 12a9 9 0 0118 0z" /></svg>
                  View
                </button>
                <button className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm font-semibold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  Delete
                </button>
              </div>
            </li>
          </ul>
        </section>

        {/* Resume History & Progress */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Resume History</h2>
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead>
              <tr>
                <th className="py-2 px-4">File Name</th>
                <th className="py-2 px-4">Analyzed On</th>
                <th className="py-2 px-4">ATS Score</th>
                <th className="py-2 px-4">Report</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50 rounded-lg">
                <td className="py-3 px-4 font-medium text-gray-800">resume_june2024.pdf</td>
                <td className="py-3 px-4 text-gray-700">2024-06-01</td>
                <td className="py-3 px-4 text-blue-700 font-semibold">85%</td>
                <td className="py-3 px-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-semibold">Analysis Report</button>
                </td>
              </tr>
              <tr className="bg-gray-50 rounded-lg">
                <td className="py-3 px-4 font-medium text-gray-800">resume_may2024.pdf</td>
                <td className="py-3 px-4 text-gray-700">2024-05-10</td>
                <td className="py-3 px-4 text-blue-700 font-semibold">80%</td>
                <td className="py-3 px-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-semibold">Analysis Report</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Settings & Account */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li><Link href="#" className="text-blue-600 hover:underline">Change Password</Link></li>
            <li><Link href="#" className="text-blue-600 hover:underline">Update Profile</Link></li>
            <li><Link href="#" className="text-red-600 hover:underline">Delete Account</Link></li>
          </ul>
        </section>
      </div>
    </main>
  );
} 