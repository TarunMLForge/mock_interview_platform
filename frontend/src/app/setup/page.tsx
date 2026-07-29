'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DOMAIN_TAXONOMY } from '@/lib/domains';
import { ArrowRight, Settings, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SetupPage() {
  const router = useRouter();
  const [primaryField, setPrimaryField] = useState<string>('');
  const [roleId, setRoleId] = useState<string>('');
  const [customRole, setCustomRole] = useState<string>('');
  const [expLevel, setExpLevel] = useState<string>('Mid-Level');

  const fields = Object.keys(DOMAIN_TAXONOMY);
  const roles = primaryField ? DOMAIN_TAXONOMY[primaryField as keyof typeof DOMAIN_TAXONOMY] : [];

  const handleStart = () => {
    const roleTitle = customRole || (roles.find(r => r.id === roleId)?.title || 'Software Engineer');
    const finalRoleId = customRole ? 'custom' : roleId;
    
    localStorage.setItem('interview_config', JSON.stringify({
      roleId: finalRoleId,
      roleTitle,
      expLevel
    }));
    
    router.push('/interview');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* Ambient background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full glass-card p-8 md:p-12 rounded-[2rem] relative z-10"
      >
        
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-blue-400 transition-colors text-sm font-semibold tracking-wider uppercase mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-12">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-sm slate-glow">
            <Settings className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Configure Your Interview</h1>
            <p className="text-slate-400 mt-2 text-lg">Select your IT domain, role, and experience level to begin.</p>
          </div>
        </div>

        <div className="space-y-10">
          {/* Primary Field */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">1. Primary Tech Field</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fields.map(field => (
                <button
                  key={field}
                  onClick={() => { setPrimaryField(field); setRoleId(''); setCustomRole(''); }}
                  className={`p-5 rounded-2xl border text-left transition-all ${primaryField === field ? 'bg-blue-900/40 border-blue-500 text-blue-300 scale-[1.02] shadow-lg shadow-blue-900/20' : 'glass-card border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:border-slate-600'}`}
                >
                  <span className="font-semibold text-lg">{field}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Specialized Role */}
          {primaryField && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 mt-8">2. Specialized Role</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => { setRoleId(role.id); setCustomRole(''); }}
                    className={`p-5 rounded-2xl border text-left transition-all ${roleId === role.id ? 'bg-indigo-900/40 border-indigo-500 text-indigo-300 shadow-lg scale-[1.02]' : 'glass-card border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:border-slate-600'}`}
                  >
                    <span className="font-medium text-lg">{role.title}</span>
                  </button>
                ))}
                
                <button
                    onClick={() => { setRoleId('custom'); }}
                    className={`p-5 rounded-2xl border text-left transition-all ${roleId === 'custom' ? 'bg-purple-900/40 border-purple-500 text-purple-300 shadow-lg scale-[1.02]' : 'glass-card border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:border-slate-600'}`}
                  >
                    <span className="font-medium text-lg">Other / Custom Role...</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Custom Role Input */}
          {roleId === 'custom' && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pt-4">
              <input 
                type="text" 
                placeholder="e.g. Prompt Engineer, Cloud Architect" 
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full glass-card border border-slate-700 rounded-2xl p-5 text-white text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
              />
            </motion.div>
          )}

          {/* Experience Level */}
          {(roleId && roleId !== 'custom' || customRole) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-slate-800/50 pt-8 mt-8">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">3. Experience Level</label>
              <div className="flex flex-wrap gap-4">
                {['Junior', 'Mid-Level', 'Senior', 'Lead / Staff'].map(level => (
                  <button
                    key={level}
                    onClick={() => setExpLevel(level)}
                    className={`px-8 py-4 rounded-full border transition-all font-bold text-lg ${expLevel === level ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/30 scale-[1.02]' : 'glass-card border-slate-700/50 text-slate-400 hover:bg-slate-800/50 hover:border-slate-600 hover:text-slate-300'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

        </div>

        {/* Start Button */}
        <div className="mt-14 flex justify-end">
          <button
            onClick={handleStart}
            disabled={!roleId && !customRole}
            className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-full font-extrabold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/30"
          >
            <span>Enter Video Interview</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
