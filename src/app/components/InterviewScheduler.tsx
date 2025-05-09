"use client";
import { useState } from 'react';

interface InterviewSchedulerProps {
  candidate: {
    id: number;
    name: string;
    email: string;
  };
  onSchedule: (interviewData: any) => void;
  onCancel: () => void;
}

export default function InterviewScheduler({
  candidate,
  onSchedule,
  onCancel,
}: InterviewSchedulerProps) {
  const [interviewData, setInterviewData] = useState({
    type: 'technical',
    date: '',
    time: '',
    duration: '60',
    interviewers: [''],
    location: 'online',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInterviewData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterviewerChange = (index: number, value: string) => {
    const newInterviewers = [...interviewData.interviewers];
    newInterviewers[index] = value;
    setInterviewData(prev => ({ ...prev, interviewers: newInterviewers }));
  };

  const addInterviewer = () => {
    setInterviewData(prev => ({
      ...prev,
      interviewers: [...prev.interviewers, ''],
    }));
  };

  const removeInterviewer = (index: number) => {
    setInterviewData(prev => ({
      ...prev,
      interviewers: prev.interviewers.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule(interviewData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Schedule Interview with {candidate.name}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Interview Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Interview Type
          </label>
          <select
            id="type"
            name="type"
            value={interviewData.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="technical">Technical Interview</option>
            <option value="behavioral">Behavioral Interview</option>
            <option value="system-design">System Design Interview</option>
            <option value="coding">Coding Interview</option>
            <option value="hr">HR Interview</option>
          </select>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={interviewData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={interviewData.time}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (minutes)
          </label>
          <select
            id="duration"
            name="duration"
            value={interviewData.duration}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
          </select>
        </div>

        {/* Interviewers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interviewers
          </label>
          {interviewData.interviewers.map((interviewer, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="email"
                value={interviewer}
                onChange={(e) => handleInterviewerChange(index, e.target.value)}
                required
                placeholder="interviewer@company.com"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeInterviewer(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addInterviewer}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            + Add Interviewer
          </button>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <select
            id="location"
            name="location"
            value={interviewData.location}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="online">Online (Video Call)</option>
            <option value="office">Office</option>
            <option value="phone">Phone Call</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={interviewData.notes}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Add any specific instructions or topics to cover..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Schedule Interview
          </button>
        </div>
      </form>
    </div>
  );
} 