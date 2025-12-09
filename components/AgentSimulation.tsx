import React, { useEffect, useState } from 'react';
import { AGENTS, MOCK_REPORT_DELAY_MS } from '../constants';
import { CheckCircle2, Loader2, Lock } from 'lucide-react';

interface AgentSimulationProps {
  onComplete: () => void;
}

export const AgentSimulation: React.FC<AgentSimulationProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // We want to progress through agents. 
    // If we are at the last agent, we trigger onComplete after the delay.
    if (currentIndex >= AGENTS.length) {
      // Small buffer after last agent before showing report
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, MOCK_REPORT_DELAY_MS);

    return () => clearTimeout(timer);
  }, [currentIndex, onComplete]);

  // Calculate progress percentage
  const progress = Math.min(((currentIndex) / AGENTS.length) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-hf-dark flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-700">
      
      {/* 
        === DYNAMIC BACKGROUND SYSTEM === 
      */}
      <div className="absolute inset-0 w-full h-full -z-0 pointer-events-none transition-opacity duration-1000">
        {/* LIGHT MODE BACKGROUND */}
        <div className="absolute inset-0 dark:opacity-0 transition-opacity duration-700">
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-200/40 rounded-full blur-[100px] mix-blend-multiply animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-hf-orange/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-blue-200/40 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-4000"></div>
        </div>

        {/* DARK MODE BACKGROUND */}
        <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-700">
            <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-hf-orange/5 rounded-full blur-[120px] mix-blend-screen animate-blob"></div>
            <div className="absolute top-[10%] right-[-20%] w-[50vw] h-[50vw] bg-indigo-900/20 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[10%] w-[70vw] h-[70vw] bg-blue-900/10 rounded-full blur-[130px] mix-blend-screen animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="max-w-7xl w-full z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Analyzing Repository Structure</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">Our multi-agent system is auditing your codebase...</p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto w-full bg-gray-200 dark:bg-white/5 h-1.5 rounded-full mb-16 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-hf-orange to-pink-500 transition-all duration-700 ease-out shadow-[0_0_20px_rgba(255,87,34,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Agents Grid (Flex Wrap for Centering) */}
        <div className="flex flex-wrap justify-center gap-6">
          {AGENTS.map((agent, index) => {
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;
            const isPending = index > currentIndex;
            const Icon = agent.icon;

            return (
              <div 
                key={agent.id}
                className={`
                  relative p-6 rounded-2xl border transition-all duration-500 w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)]
                  flex flex-col
                  ${isActive 
                    ? 'bg-white dark:bg-hf-cardDark border-hf-orange shadow-xl shadow-hf-orange/10 dark:shadow-[0_0_30px_rgba(255,87,34,0.15)] scale-105 z-10' 
                    : isCompleted 
                      ? 'bg-white/80 dark:bg-[#0A0A0A] border-green-500/30 opacity-80' 
                      : 'bg-gray-100 dark:bg-[#050505] border-gray-200 dark:border-white/5 opacity-60 blur-[1px]'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-hf-orange/10 dark:bg-hf-orange/20' : 'bg-gray-100 dark:bg-white/5'}`}>
                    <Icon className={`w-6 h-6 ${isActive ? 'text-hf-orange' : isCompleted ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`} />
                  </div>
                  <div className="text-right">
                    {isActive && <Loader2 className="w-5 h-5 text-hf-orange animate-spin" />}
                    {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {isPending && <Lock className="w-4 h-4 text-gray-400 dark:text-gray-600" />}
                  </div>
                </div>
                
                <h3 className={`font-bold text-lg mb-1 ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-300'}`}>
                  {agent.name}
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">{agent.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {agent.description}
                </p>

                {isActive && (
                  <div className="absolute inset-0 border-2 border-hf-orange rounded-2xl animate-pulse-slow pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};