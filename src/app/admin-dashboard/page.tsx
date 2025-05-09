"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface JobPosting {
  id: number;
  title: string;
  department: string;
  location: string;
  status: 'open' | 'closed' | 'draft';
  applicants: number;
  postedDate: string;
}

interface Candidate {
  id: number;
  name: string;
  email: string;
  matchScore: number;
  status: 'new' | 'reviewed' | 'interviewed' | 'rejected' | 'hired';
  appliedDate: string;
  resumeUrl: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch job postings and candidates data
    setLoading(false);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <section className="mb-8 flex flex-col md:flex-row items-center justify-between bg-white p-8 rounded-lg shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Recruiter Dashboard</h1>
            <p className="text-gray-600 text-lg">Manage job postings and screen candidates efficiently.</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Post New Job
            </button>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="mb-8 bg-white rounded-lg shadow">
          <nav className="flex border-b">
            <button
              className={`px-6 py-4 font-semibold ${
                activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-6 py-4 font-semibold ${
                activeTab === 'jobs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('jobs')}
            >
              Job Postings
            </button>
            <button
              className={`px-6 py-4 font-semibold ${
                activeTab === 'candidates' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('candidates')}
            >
              Candidates
            </button>
            <button
              className={`px-6 py-4 font-semibold ${
                activeTab === 'analytics' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Content Sections */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Job Postings</h3>
              <p className="text-3xl font-bold text-blue-600">12</p>
              <p className="text-sm text-gray-600 mt-2">+2 from last week</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Applicants</h3>
              <p className="text-3xl font-bold text-blue-600">156</p>
              <p className="text-sm text-gray-600 mt-2">+23 from last week</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Match Score</h3>
              <p className="text-3xl font-bold text-blue-600">78%</p>
              <p className="text-sm text-gray-600 mt-2">+5% from last week</p>
            </div>

            {/* Recent Activity */}
            <div className="md:col-span-3 bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">New application for Senior Developer</p>
                    <p className="text-sm text-gray-600">John Doe - 2 hours ago</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Match: 92%
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Job posting created: Product Manager</p>
                    <p className="text-sm text-gray-600">You - 5 hours ago</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Job Postings</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Create New Job
                </button>
              </div>
            </div>
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-4 font-semibold text-gray-900">Title</th>
                    <th className="pb-4 font-semibold text-gray-900">Department</th>
                    <th className="pb-4 font-semibold text-gray-900">Location</th>
                    <th className="pb-4 font-semibold text-gray-900">Status</th>
                    <th className="pb-4 font-semibold text-gray-900">Applicants</th>
                    <th className="pb-4 font-semibold text-gray-900">Posted Date</th>
                    <th className="pb-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobPostings.map((job) => (
                    <tr key={job.id} className="border-b last:border-b-0">
                      <td className="py-4 text-gray-900">{job.title}</td>
                      <td className="py-4 text-gray-600">{job.department}</td>
                      <td className="py-4 text-gray-600">{job.location}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          job.status === 'open' ? 'bg-green-100 text-green-800' :
                          job.status === 'closed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 text-gray-600">{job.applicants}</td>
                      <td className="py-4 text-gray-600">{job.postedDate}</td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800">Edit</button>
                          <button className="text-red-600 hover:text-red-800">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Candidates</h2>
                <div className="flex gap-4">
                  <select className="border rounded-lg px-4 py-2">
                    <option>All Jobs</option>
                    <option>Senior Developer</option>
                    <option>Product Manager</option>
                  </select>
                  <select className="border rounded-lg px-4 py-2">
                    <option>All Status</option>
                    <option>New</option>
                    <option>Reviewed</option>
                    <option>Interviewed</option>
                    <option>Rejected</option>
                    <option>Hired</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-4 font-semibold text-gray-900">Name</th>
                    <th className="pb-4 font-semibold text-gray-900">Email</th>
                    <th className="pb-4 font-semibold text-gray-900">Match Score</th>
                    <th className="pb-4 font-semibold text-gray-900">Status</th>
                    <th className="pb-4 font-semibold text-gray-900">Applied Date</th>
                    <th className="pb-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate.id} className="border-b last:border-b-0">
                      <td className="py-4 text-gray-900">{candidate.name}</td>
                      <td className="py-4 text-gray-600">{candidate.email}</td>
                      <td className="py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {candidate.matchScore}%
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          candidate.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          candidate.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                          candidate.status === 'interviewed' ? 'bg-purple-100 text-purple-800' :
                          candidate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 text-gray-600">{candidate.appliedDate}</td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800">View</button>
                          <button className="text-green-600 hover:text-green-800">Schedule</button>
                          <button className="text-red-600 hover:text-red-800">Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hiring Funnel */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring Funnel</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Applications</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Screening</span>
                  <span className="font-semibold">45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Interviews</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Offers</span>
                  <span className="font-semibold">3</span>
                </div>
              </div>
            </div>

            {/* Skill Distribution */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Skills</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">JavaScript</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">React</span>
                  <span className="font-semibold">72%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Node.js</span>
                  <span className="font-semibold">65%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Python</span>
                  <span className="font-semibold">58%</span>
                </div>
              </div>
            </div>

            {/* Time to Hire */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Time to Hire</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average</span>
                  <span className="font-semibold">23 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Fastest</span>
                  <span className="font-semibold">12 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Slowest</span>
                  <span className="font-semibold">45 days</span>
                </div>
              </div>
            </div>

            {/* Application Sources */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Sources</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">LinkedIn</span>
                  <span className="font-semibold">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Direct</span>
                  <span className="font-semibold">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Referrals</span>
                  <span className="font-semibold">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Other</span>
                  <span className="font-semibold">10%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 