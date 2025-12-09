import React, { useState } from 'react';
import { Github, ArrowRight, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onStartReview: (url: string) => void;
  loading: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onStartReview, loading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onStartReview(url);
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-hf-dark transition-colors duration-700">
      
      {/* 
        === DYNAMIC BACKGROUND SYSTEM === 
      */}
      
      {/* 1. Base Background Image (Code/Tech) - Blurred */}
      <div className="absolute inset-0 z-0">
         <img 
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80" 
            alt="Code Background" 
            className="w-full h-full object-cover filter blur-[8px] scale-105 opacity-10 dark:opacity-20 transition-opacity duration-700"
         />
         {/* Dark overlay gradient to ensure text readability on pure black */}
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:from-transparent dark:via-hf-dark/80 dark:to-hf-dark"></div>
      </div>

      {/* 2. Ambient Blobs */}
      <div className="absolute inset-0 w-full h-full -z-0 pointer-events-none transition-opacity duration-1000">
        
        {/* LIGHT MODE BACKGROUND */}
        <div className="absolute inset-0 dark:opacity-0 transition-opacity duration-700">
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-200/40 rounded-full blur-[100px] mix-blend-multiply animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-hf-orange/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-blue-200/40 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-4000"></div>
        </div>

        {/* DARK MODE BACKGROUND - Vivid glows on Pure Black */}
        <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-700">
            <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-hf-orange/5 rounded-full blur-[120px] mix-blend-screen animate-blob"></div>
            <div className="absolute top-[10%] right-[-20%] w-[50vw] h-[50vw] bg-indigo-900/20 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[10%] w-[70vw] h-[70vw] bg-blue-900/10 rounded-full blur-[130px] mix-blend-screen animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* 3. Content */}
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center pb-20">
        
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full 
          bg-white/60 border border-white/50 text-gray-600
          dark:bg-white/5 dark:border-white/10 dark:text-gray-300
          backdrop-blur-md shadow-sm mb-10 animate-fade-in-up">
          <span className="flex h-2 w-2 relative mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hf-orange opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-hf-orange"></span>
          </span>
          <span className="text-xs font-bold tracking-wider uppercase">AI Audit System v2.0</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-[1.1] text-gray-900 dark:text-white drop-shadow-sm animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          Code Reviews, <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-hf-orange to-red-500">
            Reimagined.
          </span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed text-gray-600 dark:text-gray-400 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          Instant, comprehensive feedback on your repository. Powered by a multi-agent AI squad that reads, thinks, and reports like a senior engineer.
        </p>

        {/* Search Input Area */}
        <div className="w-full max-w-xl mx-auto relative group animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <div className="absolute -inset-1 bg-gradient-to-r from-hf-orange to-pink-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Github className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              placeholder="github.com/username/repo"
              className="block w-full pl-14 pr-36 py-5 text-lg 
                bg-white dark:bg-[#0A0A0A]
                border border-gray-200 dark:border-white/10
                rounded-full 
                text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600
                focus:ring-2 focus:ring-hf-orange/50 focus:border-hf-orange
                outline-none transition-all shadow-xl"
            />
            
            <div className="absolute right-2">
              <button
                type="submit"
                disabled={loading || !url}
                className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold rounded-full h-12 px-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md active:scale-95"
              >
                {loading ? '...' : 'Analyze'}
                {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-8 text-sm text-gray-500 dark:text-gray-500 flex items-center justify-center gap-2 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <ShieldCheck className="w-4 h-4" />
            <span>Secure. Read-only. No data storage.</span>
        </p>

      </div>
    </div>
  );
};