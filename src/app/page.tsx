import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Transform Your Resume with AI-Powered Analysis
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Get instant feedback, ATS scoring, and personalized recommendations to land your dream job.
              </p>
              <div className="flex gap-4">
                <Link href="/user-dashboard" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  For Job Seekers
                </Link>
                <Link href="/admin-dashboard" className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                  For Recruiters
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative h-[400px] w-full">
                <Image
                  src="/hero-image.png"
                  alt="Resume Analysis"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-10 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">How It Works</h2>
            <p className="text-center text-gray-600 mb-10">
              Our AI-powered platform makes it easy to optimize your resume for specific job opportunities
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-2xl font-bold">1</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">Upload Resume</h3>
                <p className="text-gray-600 text-sm">Upload your resume in PDF format</p>
              </div>
              <div>
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-2xl font-bold">2</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">Add Job Description</h3>
                <p className="text-gray-600 text-sm">Paste the job description you're interested in</p>
              </div>
              <div>
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-2xl font-bold">3</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">AI Analysis</h3>
                <p className="text-gray-600 text-sm">Our AI analyzes and compares your resume to the job</p>
              </div>
              <div>
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-2xl font-bold">4</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">Get Recommendations</h3>
                <p className="text-gray-600 text-sm">Receive tailored suggestions to improve your resume</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">For Job Seekers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">ATS Scoring</h3>
              <p className="text-gray-700">
                Get your resume scored by our advanced ATS system and improve your chances of getting noticed.
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Job Matching</h3>
              <p className="text-gray-700">
                See how well your resume matches job requirements and get personalized improvement suggestions.
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">💡</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Smart Recommendations</h3>
              <p className="text-gray-700">
                Receive AI-powered suggestions to enhance your resume's impact and effectiveness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">For Recruiters</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">📈</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Candidate Analytics</h3>
              <p className="text-gray-700">
                Get detailed insights and comparisons of candidate skills and achievements.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Smart Screening</h3>
              <p className="text-gray-700">
                Automatically identify the most suitable candidates based on your requirements.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Performance Metrics</h3>
              <p className="text-gray-700">
                Track and analyze candidate performance metrics across different parameters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Transform Your Hiring Process?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of job seekers and recruiters who are already using our AI-powered platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Get Started
            </Link>
            <Link href="/contact" className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
