'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, AlertTriangle, Lightbulb, User, ArrowLeft, Video, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ExportPdfButton from '@/components/ExportPdfButton';

export default function Dashboard({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate slight loading for skeleton effect if we want to show it off
    const saved = localStorage.getItem('interview_report');
    if (saved) {
      setTimeout(() => {
        setData(JSON.parse(saved));
        setIsLoading(false);
      }, 800);
    } else {
      router.push('/');
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12 font-sans flex flex-col space-y-10 max-w-5xl mx-auto">
        <div className="flex justify-between items-center bg-slate-900/50 p-8 rounded-[2rem] border border-slate-800 animate-pulse">
           <div className="space-y-4">
             <div className="h-6 w-32 bg-slate-800 rounded"></div>
             <div className="h-10 w-64 bg-slate-800 rounded"></div>
             <div className="h-4 w-96 bg-slate-800 rounded"></div>
           </div>
           <div className="h-24 w-24 bg-slate-800 rounded-3xl"></div>
        </div>
        <div className="space-y-8">
           <div className="h-8 w-48 bg-slate-800 rounded animate-pulse"></div>
           {[1,2,3].map(i => (
             <div key={i} className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8 space-y-6 animate-pulse">
                <div className="h-6 w-3/4 bg-slate-800 rounded"></div>
                <div className="h-20 w-full bg-slate-800 rounded-2xl"></div>
                <div className="grid grid-cols-2 gap-8">
                   <div className="h-32 bg-slate-800 rounded-2xl"></div>
                   <div className="h-32 bg-slate-800 rounded-2xl"></div>
                </div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { report, dialogues } = data;
  const overallScore = report.overall_score || 0;

  let scoreColor = "text-blue-400 bg-blue-500/10 border-blue-500/20";
  if (overallScore < 70) scoreColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
  if (overallScore < 50) scoreColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12 font-sans relative">
      <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[20%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        
        {/* Top actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center text-slate-400 hover:text-blue-400 transition-colors text-xs font-semibold tracking-wider uppercase glass-card px-4 py-2 rounded-full border border-slate-800/80">
              <ArrowLeft className="w-4 h-4 mr-2" /> Home
            </Link>
            <Link href="/dashboard/history" className="inline-flex items-center text-slate-400 hover:text-blue-400 transition-colors text-xs font-semibold tracking-wider uppercase glass-card px-4 py-2 rounded-full border border-slate-800/80">
              History
            </Link>
          </div>
          
          <ExportPdfButton targetId="pdf-report-content" />
        </div>
        
        <div id="pdf-report-content" className="space-y-10 bg-slate-950 text-slate-50">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start justify-between glass-card p-8 rounded-[2rem] border border-slate-800/80 shadow-lg gap-8">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Interview Analysis</h1>
              <p className="text-slate-300 text-lg leading-relaxed font-medium">{report.summary}</p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-3xl border border-slate-800 shrink-0 shadow-inner w-full md:w-auto">
              <span className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-3">Overall Score</span>
              <div className={`text-6xl font-black px-8 py-5 rounded-2xl border ${scoreColor} shadow-lg flex items-baseline`}>
                {overallScore}<span className="text-3xl opacity-50 ml-1">/100</span>
              </div>
            </div>
          </div>

          {/* Question Breakdown */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white pl-2 flex items-center">
              <CheckCircle className="w-6 h-6 mr-3 text-blue-500" />
              Detailed Breakdown
            </h2>
            
            {dialogues.map((d: any, idx: number) => {
              const fb = report.breakdown.find((b: any) => b.q_num === d.q_num) || {};
              
              return (
                <div key={idx} className="glass-card rounded-3xl border border-slate-800/80 overflow-hidden shadow-lg transition hover:shadow-blue-900/20">
                  
                  {/* Q&A Section */}
                  <div className="p-6 md:p-8 border-b border-slate-800/50 bg-slate-900/40">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex flex-shrink-0 items-center justify-center text-blue-400 mt-1 shadow-sm border border-blue-500/20">
                        <Video className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">{d.q}</h3>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex flex-shrink-0 items-center justify-center text-slate-400 border border-slate-700 mt-1 shadow-sm">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="bg-slate-800/50 p-5 md:p-6 rounded-2xl border border-slate-700 w-full shadow-inner">
                        <p className="text-slate-300 font-medium leading-relaxed whitespace-pre-wrap text-lg">{d.a}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Feedback Section */}
                  <div className="p-6 md:p-8 grid lg:grid-cols-2 gap-8 bg-slate-900/60">
                    
                    <div className="space-y-8">
                      <div>
                        <div className="flex items-center space-x-3 text-rose-400 font-bold mb-4">
                          <XCircle className="w-6 h-6" />
                          <h4 className="text-lg">Identified Mistakes</h4>
                        </div>
                        <ul className="space-y-3">
                          {fb.mistakes?.length > 0 ? fb.mistakes.map((m: string, i: number) => (
                            <li key={i} className="flex items-start space-x-3 text-slate-300 bg-rose-950/30 p-4 rounded-xl border border-rose-900/50 text-sm shadow-sm font-medium">
                              <span className="text-rose-400 font-bold text-lg leading-none mt-0.5">•</span>
                              <span className="leading-relaxed">{m}</span>
                            </li>
                          )) : (
                            <li className="text-slate-500 italic text-sm px-2">No major mistakes identified.</li>
                          )}
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center space-x-3 text-amber-400 font-bold mb-4">
                          <AlertTriangle className="w-6 h-6" />
                          <h4 className="text-lg">Missing Technical Terms</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {fb.missing_terms?.length > 0 ? fb.missing_terms.map((t: string, i: number) => (
                            <span key={i} className="bg-amber-950/30 text-amber-300 border border-amber-900/50 px-4 py-2 rounded-xl text-sm font-semibold tracking-wide shadow-sm">
                              {t}
                            </span>
                          )) : (
                            <span className="text-slate-500 italic text-sm px-2">Vocabulary was sufficient.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col h-full">
                      <div className="flex items-center space-x-3 text-teal-400 font-bold mb-4">
                        <Lightbulb className="w-6 h-6" />
                        <h4 className="text-lg">Ideal Benchmark Answer</h4>
                      </div>
                      <div className="bg-teal-950/30 text-teal-100 p-6 md:p-8 rounded-2xl border border-teal-900/50 h-full leading-relaxed shadow-sm text-lg font-medium">
                        {fb.perfect_ans || "Not provided."}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
