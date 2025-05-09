"use client";
import { useState } from 'react';

interface CandidateDetailsProps {
  candidate: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    matchScore: number;
    status: 'new' | 'reviewed' | 'interviewed' | 'rejected' | 'hired';
    appliedDate: string;
    resumeUrl: string;
    skills: string[];
    experience: {
      company: string;
      role: string;
      duration: string;
      description: string;
    }[];
    education: {
      institution: string;
      degree: string;
      field: string;
      graduationYear: string;
    }[];
  };
  onStatusChange: (status: string) => void;
  onScheduleInterview: () => void;
  onReject: () => void;
}

export default function CandidateDetails({
  candidate,
  onStatusChange,
  onScheduleInterview,
  onReject,
}: CandidateDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{candidate.name}</h2>
            <p className="text-gray-600">{candidate.email}</p>
            {candidate.phone && <p className="text-gray-600">{candidate.phone}</p>}
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              candidate.status === 'new' ? 'bg-blue-100 text-blue-800' :
              candidate.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
              candidate.status === 'interviewed' ? 'bg-purple-100 text-purple-800' :
              candidate.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-green-100 text-green-800'
            }`}>
              {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Match: {candidate.matchScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Quick Actions */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={onScheduleInterview}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Schedule Interview
          </button>
          <button
            onClick={onReject}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reject Candidate
          </button>
          <select
            value={candidate.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="interviewed">Interviewed</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Experience</h3>
          <div className="space-y-4">
            {candidate.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900">{exp.role}</h4>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.duration}</p>
                <p className="mt-2 text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
          <div className="space-y-4">
            {candidate.education.map((edu, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.field}</p>
                <p className="text-sm text-gray-500">Graduated: {edu.graduationYear}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resume Preview */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Resume Preview</h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-800"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
          <div className={`border rounded-lg p-4 ${isExpanded ? 'h-[600px]' : 'h-[300px]'} overflow-auto`}>
            <iframe
              src={candidate.resumeUrl}
              className="w-full h-full"
              title="Resume Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 