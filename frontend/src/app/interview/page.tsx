'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useWebSpeech } from '@/hooks/useWebSpeech';
import AudioWaveform from '@/components/AudioWaveform';
import { Mic, MicOff, Loader2, ArrowRight, Play, CheckCircle, VideoOff, Video as VideoIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function InterviewRoom() {
  const router = useRouter();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [dialogues, setDialogues] = useState<{q_num: number, q: string, a: string}[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [questions, setQuestions] = useState<string[]>([]);
  const [config, setConfig] = useState<any>(null);
  const { isListening, transcript, startListening, stopListening, isSpeaking, speak } = useWebSpeech();
  
  const [finalAnswer, setFinalAnswer] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Start webcam
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error("Webcam error:", err));
    }

    const savedConfig = localStorage.getItem('interview_config');
    if (!savedConfig) {
      router.push('/setup');
      return;
    }
    const parsedConfig = JSON.parse(savedConfig);
    setConfig(parsedConfig);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    fetch(`${apiUrl}/api/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role_id: parsedConfig.roleId,
        role_title: parsedConfig.roleTitle,
        exp_level: parsedConfig.expLevel
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.questions) {
        setQuestions(data.questions);
      } else {
        alert("Failed to load questions. Is the backend running?");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Error contacting backend API.");
    })
    .finally(() => {
      setIsInitializing(false);
    });

    return () => {
      // Cleanup webcam on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [router]);

  useEffect(() => {
    // When question changes, speak it automatically, and start mic when done
    stopListening();
    if (!isInitializing && questions.length > 0 && currentQIndex < questions.length) {
      speak(questions[currentQIndex], () => {
        startListening();
      });
    }
  }, [currentQIndex, questions, isInitializing, speak, stopListening, startListening]);

  const handleNextQuestion = () => {
    stopListening();
    
    const combinedAnswer = (finalAnswer + " " + transcript).trim();
    const newDialogues = [...dialogues, {
      q_num: currentQIndex + 1,
      q: questions[currentQIndex],
      a: combinedAnswer || "No answer provided."
    }];
    setDialogues(newDialogues);
    setFinalAnswer("");
    
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      submitInterview(newDialogues);
    }
  };

  const submitInterview = async (finalDialogues: any) => {
    setIsEvaluating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiUrl}/api/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role_id: config.roleId,
          role_title: config.roleTitle,
          exp_level: config.expLevel,
          dialogues: finalDialogues
        })
      });
      
      if (!res.ok) throw new Error("Evaluation failed");
      const report = await res.json();
      
      const interviewData = { report, dialogues: finalDialogues, config, date: new Date().toISOString() };
      
      // Save for immediate view
      localStorage.setItem('interview_report', JSON.stringify(interviewData));
      
      // Save to history
      const historyStr = localStorage.getItem('interview_history');
      let history = historyStr ? JSON.parse(historyStr) : [];
      history.push(interviewData);
      localStorage.setItem('interview_history', JSON.stringify(history));

      router.push('/dashboard/latest');
      
    } catch (err) {
      console.error(err);
      alert("Failed to submit interview.");
      setIsEvaluating(false);
    }
  };

  if (isInitializing || isEvaluating) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center space-y-6 font-sans relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin flex items-center justify-center shadow-lg shadow-blue-900/20"
        >
          <Loader2 className="w-10 h-10 text-blue-400 animate-pulse" />
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-black tracking-tight mt-8"
        >
          {isInitializing ? "Connecting to AI..." : "Analyzing performance..."}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-slate-400 text-lg"
        >
          {isInitializing ? "Generating your specialized IT interview" : "Processing structured feedback"}
        </motion.p>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center font-sans">Error loading questions. Refresh to try again.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col p-4 md:p-8 font-sans h-screen overflow-hidden">
      
      {/* Header */}
      <header className="flex items-center justify-between mb-6 shrink-0 glass-card p-4 rounded-2xl border border-slate-800/80 shadow-sm z-10">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-black text-lg text-blue-400 shadow-md">
            AI
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-white">{config?.roleTitle} Interview</h1>
            <p className="text-xs text-slate-400 font-semibold tracking-widest uppercase">Question {currentQIndex + 1} of {questions.length}</p>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border ${isSpeaking ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : (isListening ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700')}`}>
          {isSpeaking ? 'AI is speaking...' : (isListening ? 'Mic is live' : 'Waiting')}
        </div>
      </header>

      {/* Video Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 min-h-0 relative z-10">
        
        {/* AI Video Pane */}
        <div className="relative glass-card rounded-3xl border border-slate-800/80 overflow-hidden flex flex-col items-center justify-center shadow-lg group">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-indigo-900/10"></div>
          
          {/* Abstract AI Avatar */}
          <div className={`w-40 h-40 md:w-56 md:h-56 rounded-full flex items-center justify-center transition-all duration-700 ${isSpeaking ? 'scale-110 shadow-[0_0_80px_rgba(59,130,246,0.3)] bg-blue-900/20' : 'bg-slate-900 shadow-inner'}`}>
             <div className={`w-full h-full rounded-full border-2 ${isSpeaking ? 'border-blue-400/50 border-dashed animate-[spin_4s_linear_infinite]' : 'border-slate-800'}`}></div>
             <div className={`absolute w-3/4 h-3/4 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 ${isSpeaking ? 'animate-pulse opacity-100 blur-md' : 'opacity-30 blur-xl'}`}></div>
          </div>

          <motion.div 
            key={currentQIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-6 left-6 right-6 z-10"
          >
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl shadow-lg">
              <p className="text-lg md:text-xl font-medium text-slate-200 leading-relaxed">
                "{questions[currentQIndex]}"
              </p>
            </div>
          </motion.div>
          
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 flex items-center shadow-sm">
            <VideoIcon className="w-3.5 h-3.5 mr-2 text-blue-400" />
            AI Interviewer
          </div>
        </div>

        {/* User Video Pane */}
        <div className="relative glass-card rounded-3xl border border-slate-800/80 overflow-hidden flex flex-col shadow-lg">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1] opacity-70 mix-blend-screen"
          ></video>
          
          {/* Fallback if no webcam */}
          <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 bg-slate-950">
            <VideoOff className="w-16 h-16 text-slate-700 mb-4" />
            <p className="text-slate-500 text-sm font-semibold">Webcam offline</p>
          </div>

          <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col gap-4">
            
            {/* Audio Waveform UI Canvas component */}
            <AudioWaveform isRecording={isListening} />

            {/* Live Transcript Overlay */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl shadow-lg max-h-32 overflow-y-auto">
              <p className="text-sm font-medium text-slate-300 leading-relaxed">
                {finalAnswer} <span className="text-blue-400 font-semibold">{transcript}</span>
                {!finalAnswer && !transcript && (
                  <span className="text-slate-500 italic flex items-center">
                    {isSpeaking ? "Listen to the AI's question..." : "Mic is open. Speak your answer..."}
                  </span>
                )}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {isListening ? (
                <button 
                  onClick={stopListening}
                  className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 py-3.5 rounded-xl font-bold flex items-center justify-center transition shadow-sm"
                >
                  <MicOff className="w-5 h-5 mr-2" /> Stop Mic
                </button>
              ) : (
                <button 
                  onClick={startListening}
                  disabled={isSpeaking}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 py-3.5 rounded-xl font-bold flex items-center justify-center transition disabled:opacity-50 shadow-sm"
                >
                  <Mic className="w-5 h-5 mr-2" /> Start Mic
                </button>
              )}
              
              <button 
                onClick={handleNextQuestion}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-extrabold flex items-center justify-center transition shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{currentQIndex === questions.length - 1 ? 'Submit' : 'Finish Answer'}</span>
                {currentQIndex === questions.length - 1 ? <CheckCircle className="w-5 h-5 ml-2" /> : <ArrowRight className="w-5 h-5 ml-2" />}
              </button>
            </div>
          </div>
          
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 flex items-center shadow-sm">
            <VideoIcon className="w-3.5 h-3.5 mr-2 text-teal-400" />
            You
          </div>
          
          {isListening && (
            <div className="absolute top-4 right-4 bg-rose-500 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center shadow-lg animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white mr-2"></span>
              Recording
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
