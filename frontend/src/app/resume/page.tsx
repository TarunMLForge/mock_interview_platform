import Link from 'next/link';
import { ArrowLeft, FileText, Upload, Sparkles, CheckCircle, BarChart, Video } from 'lucide-react';

export default function ResumeToolkit() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-slate-900 font-sans selection:bg-teal-500/30">
      <nav className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xl font-black tracking-tighter flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-slate-800">Mock Interview</span>
          </div>
          <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 flex items-center transition">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">Optimize your IT resume for ATS</h1>
          <p className="text-lg text-slate-600 font-medium">Upload your resume to get instant feedback on structure, tech keywords, and formatting.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-16 shadow-sm text-center transition hover:shadow-md">
          <div className="w-24 h-24 bg-teal-50 rounded-full mx-auto flex items-center justify-center mb-6">
            <Upload className="w-10 h-10 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Upload your Resume</h2>
          <p className="text-slate-500 mb-8 font-medium">PDF, DOCX, or TXT up to 5MB</p>
          
          <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-teal-500/30 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2">
            <FileText className="w-5 h-5" /> Browse Files
          </button>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-amber-200 transition">
            <Sparkles className="w-8 h-8 text-amber-500 mb-4" />
            <h3 className="font-bold text-lg mb-2 text-slate-900">IT Keyword Analysis</h3>
            <p className="text-slate-600 text-sm font-medium">We analyze top tech job descriptions and your resume to find missing technical keywords.</p>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-emerald-200 transition">
            <CheckCircle className="w-8 h-8 text-emerald-500 mb-4" />
            <h3 className="font-bold text-lg mb-2 text-slate-900">ATS Compatibility</h3>
            <p className="text-slate-600 text-sm font-medium">Ensure your format is readable by top Applicant Tracking Systems used by tech companies.</p>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-indigo-200 transition">
            <BarChart className="w-8 h-8 text-indigo-500 mb-4" />
            <h3 className="font-bold text-lg mb-2 text-slate-900">Impact Scoring</h3>
            <p className="text-slate-600 text-sm font-medium">Get an objective score out of 100 on how strong your project and experience bullets are.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
