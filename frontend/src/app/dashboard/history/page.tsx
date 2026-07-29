'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('interview_history');
    if (saved) {
      setHistory(JSON.parse(saved).reverse());
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-slate-900 p-6 md:p-12 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition text-sm font-semibold tracking-wider uppercase mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 flex items-center gap-4">
            <Clock className="w-10 h-10 text-indigo-500" />
            Interview History
          </h1>
        </div>

        {history.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 shadow-sm">
            You haven't completed any interviews yet.
            <div className="mt-6">
              <Link href="/setup" className="inline-block bg-indigo-600 text-white font-extrabold px-8 py-3 rounded-full hover:bg-indigo-700 transition shadow-md hover:-translate-y-0.5">Start an Interview</Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {history.map((h, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:border-indigo-300 transition shadow-sm hover:shadow-md group">
                <div className="space-y-2 mb-4 md:mb-0">
                  <h3 className="text-xl font-bold text-slate-900">{h.config?.roleTitle || 'Interview'}</h3>
                  <div className="flex items-center text-sm text-slate-500 gap-3">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-semibold text-slate-600">{h.config?.expLevel || 'Unknown'}</span>
                    <span>{h.date ? new Date(h.date).toLocaleString() : 'Recent'}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Score</span>
                    <span className="text-2xl font-black text-indigo-600">{h.report?.overall_score || 0}<span className="text-sm text-slate-400">/100</span></span>
                  </div>
                  <button 
                    onClick={() => {
                      localStorage.setItem('interview_report', JSON.stringify(h));
                      window.location.href = '/dashboard/latest';
                    }}
                    className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition text-indigo-600 shadow-sm group-hover:scale-105"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
