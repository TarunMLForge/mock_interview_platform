"use client";

import Link from 'next/link';
import { ArrowRight, Video, Code, Terminal, Database, Cloud, Shield, Network } from 'lucide-react';
import { motion } from 'framer-motion';

const techPills = [
  { name: 'MERN', icon: Code },
  { name: 'ML/AI', icon: Network },
  { name: 'DevOps', icon: Terminal },
  { name: 'Data Engineering', icon: Database },
  { name: 'Cloud', icon: Cloud },
  { name: 'Cybersecurity', icon: Shield },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
      
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 glass-card border-b-0 border-slate-800/50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-black tracking-tight flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-slate-100">Mock Interview Platform</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-400">
            <Link href="#features" className="hover:text-blue-400 transition-colors">Features</Link>
            <Link href="/dashboard/history" className="hover:text-blue-400 transition-colors">History</Link>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-6 pt-40 pb-20 relative z-10 flex flex-col items-center justify-center min-h-[90vh]">
        
        {/* Hero Section */}
        <div className="text-center space-y-8 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card text-blue-400 text-sm font-semibold mb-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>AI-Powered Technical Interview Simulator</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.1]"
          >
            Master Tech Interviews for <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-400">
              Any Role in Minutes
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Experience realistic technical interviews with our advanced AI. Get instant, actionable feedback and land your dream job faster.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3 max-w-3xl pt-4"
          >
            {techPills.map((pill, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-slate-300 text-sm hover:text-blue-400 transition-colors cursor-default">
                <pill.icon className="w-4 h-4" />
                {pill.name}
              </div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pt-8 flex items-center justify-center gap-4"
          >
            <Link 
              href="/setup" 
              className="inline-flex items-center space-x-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5"
            >
              <span>Start Mock Interview Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
