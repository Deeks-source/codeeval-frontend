import React from 'react';
import { FinalReport, DetailedFinding } from '../types';
import { Check, X, ShieldAlert, AlertTriangle, Github, Activity, Lightbulb, FileCode, CheckCircle2, AlertCircle } from 'lucide-react';

interface ReportProps {
  data: FinalReport;
  onRestart: () => void;
}

const SplitFindingCard: React.FC<{ finding: DetailedFinding }> = ({ finding }) => {
  const isSecurity = finding.category === 'SECURITY_RISK';

  // Helper to render suggestion text and separate the code block
  const renderSuggestionContent = (text: string) => {
    const parts = text.split('```');
    const explanation = parts[0];
    const code = parts.length > 1 ? parts[1].replace(/^python\n/, '') : null;
    const footer = parts.length > 2 ? parts[2] : null;

    return (
      <div className="space-y-3">
        <p className="whitespace-pre-wrap">{explanation}</p>
        {code && (
           <div className="rounded-md border border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-500/5 overflow-hidden">
             <div className="px-3 py-1 bg-green-100 dark:bg-green-500/20 border-b border-green-200 dark:border-green-500/30 text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">
               Suggested Fix
             </div>
             <pre className="p-3 overflow-x-auto text-xs font-mono text-gray-800 dark:text-gray-300">
               {code}
             </pre>
           </div>
        )}
        {footer && <p className="whitespace-pre-wrap">{footer}</p>}
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] overflow-hidden shadow-sm dark:shadow-none transition-all duration-300">
      
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-start gap-4 bg-gray-50/50 dark:bg-white/5">
        <div className={`mt-1 p-1.5 rounded-lg flex-shrink-0 ${isSecurity ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400'}`}>
           {isSecurity ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        </div>
        <div className="flex-1">
           <h4 className="text-base font-semibold text-gray-900 dark:text-white leading-snug">
              {finding.statement}
           </h4>
        </div>
        <div className={`
           px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap
           ${isSecurity 
               ? 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20' 
               : 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20'
           }
        `}>
           {finding.category.replace('_', ' ')}
        </div>
      </div>

      {/* Split Pane Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-white/5">
        
        {/* Left: The Problem */}
        <div className="p-6 bg-red-50/10 dark:bg-red-500/5 relative group">
           <div className="flex items-center gap-2 mb-3 text-xs font-mono text-gray-500 dark:text-gray-400">
              <FileCode className="w-3 h-3" />
              <span>{finding.file_name}</span>
              <span className="text-gray-300 dark:text-white/20">|</span>
              <span>{finding.line_numbers}</span>
           </div>
           
           <div className="relative rounded-lg overflow-hidden border border-red-200 dark:border-red-500/20 bg-white dark:bg-black/40">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-500"></div>
              <pre className="p-4 overflow-x-auto code-scroll text-xs font-mono text-gray-800 dark:text-gray-300">
                 {finding.code_snippet}
              </pre>
           </div>
           <div className="absolute top-6 right-6 text-red-500/20 dark:text-red-500/10 pointer-events-none">
              <AlertCircle className="w-24 h-24" />
           </div>
        </div>

        {/* Right: The Solution */}
        <div className="p-6 bg-green-50/10 dark:bg-green-500/5 relative">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
               <Lightbulb className="w-3 h-3" />
               Recommendation
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
               {renderSuggestionContent(finding.suggestion)}
            </div>
             <div className="absolute top-6 right-6 text-green-500/20 dark:text-green-500/10 pointer-events-none">
              <CheckCircle2 className="w-24 h-24" />
           </div>
        </div>

      </div>
    </div>
  );
};

export const Report: React.FC<ReportProps> = ({ data, onRestart }) => {
  
  const criticalCount = data.detailed_findings.filter(f => f.category === 'SECURITY_RISK').length;
  const weaknessCount = data.detailed_findings.filter(f => f.category === 'WEAKNESS').length;
  
  // Parse key takeaways from the string (assuming markdown bullet format "- **Title**: ...")
  const keyTakeawaysList = data.key_takeaways
    .split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(line => line.replace(/^- /, ''));

  return (
    <div className="min-h-screen pb-20 relative bg-gray-50 dark:bg-hf-dark text-gray-900 dark:text-white selection:bg-hf-orange selection:text-white transition-colors duration-700">
        
        {/* BACKGROUND SYSTEM */}
      <div className="absolute inset-0 w-full h-full -z-0 pointer-events-none transition-opacity duration-1000">
        <div className="absolute inset-0 dark:opacity-0 transition-opacity duration-700">
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-200/40 rounded-full blur-[100px] mix-blend-multiply animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-hf-orange/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000"></div>
        </div>
        <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-700">
            <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-hf-orange/5 rounded-full blur-[120px] mix-blend-screen animate-blob"></div>
            <div className="absolute top-[10%] right-[-20%] w-[50vw] h-[50vw] bg-indigo-900/20 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-2000"></div>
        </div>
      </div>
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 relative z-10">
        
        {/* NAV */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
            <button 
                onClick={onRestart}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium"
            >
                <div className="w-8 h-8 rounded-full bg-white dark:bg-white/5 flex items-center justify-center border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
                    <Github className="w-4 h-4" />
                </div>
                <span className="font-mono">{data.repoUrl.replace('https://github.com/', '')}</span>
            </button>
            <div className="text-xs text-gray-500 dark:text-gray-600 uppercase tracking-widest font-bold">Confidential Audit Report</div>
        </div>

        {/* TOP DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
            
            {/* VERDICT CARD */}
            <div className="lg:col-span-6 bg-white dark:bg-[#0A0A0A] rounded-2xl p-8 border border-gray-200 dark:border-white/10 relative overflow-hidden group shadow-sm dark:shadow-none flex flex-col justify-center">
                <div className={`absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br ${data.hired ? 'from-green-500/20' : 'from-red-500/20'} to-transparent blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2`}></div>
                
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Final Verdict</h2>
                <div className="flex items-center gap-4">
                    <span className={`text-5xl md:text-7xl font-black tracking-tight ${data.hired ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                        {data.verdict}
                    </span>
                    {data.hired ? <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" /> : <X className="w-12 h-12 text-red-600 dark:text-red-500" />}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        <strong className="text-gray-900 dark:text-white block mb-1">Compliance Decision:</strong> 
                        {data.rule_compliance_decision}
                    </p>
                </div>
            </div>

            {/* SCORE CARD */}
            <div className="lg:col-span-3 bg-white dark:bg-[#0A0A0A] rounded-2xl p-8 border border-gray-200 dark:border-white/10 flex flex-col items-center justify-center relative shadow-sm dark:shadow-none">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 w-full text-center">Code Quality Score</h2>
                <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100 dark:text-white/5" />
                        <circle 
                            cx="80" cy="80" r="70" 
                            stroke="currentColor" 
                            strokeWidth="12" 
                            fill="transparent" 
                            strokeDasharray={440} 
                            strokeDashoffset={440 - (440 * data.candidate_score) / 100} 
                            className={`${data.candidate_score > 70 ? 'text-green-500' : data.candidate_score > 50 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000 ease-out`} 
                            strokeLinecap="round" 
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">{data.candidate_score}</span>
                        <span className="text-xs text-gray-500 font-bold uppercase mt-1">/ 100</span>
                    </div>
                </div>
            </div>

            {/* STATS CARD */}
            <div className="lg:col-span-3 flex flex-col gap-6">
                <div className="flex-1 bg-white dark:bg-[#0A0A0A] rounded-2xl p-6 border border-gray-200 dark:border-white/10 flex items-center justify-between shadow-sm dark:shadow-none">
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{criticalCount}</h3>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Security Risks</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-500">
                        <ShieldAlert className="w-5 h-5" />
                    </div>
                </div>
                <div className="flex-1 bg-white dark:bg-[#0A0A0A] rounded-2xl p-6 border border-gray-200 dark:border-white/10 flex items-center justify-between shadow-sm dark:shadow-none">
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{weaknessCount}</h3>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Weaknesses</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-hf-orange/10 flex items-center justify-center text-hf-orange">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>

        {/* SUMMARY & TAKEAWAYS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="flex flex-col h-full">
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-hf-orange" />
                    Executive Summary
                 </h3>
                 <div className="text-gray-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-[#0A0A0A] p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none flex-grow">
                    {data.overall_summary.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4 last:mb-0">{paragraph}</p>
                    ))}
                 </div>
            </div>
            <div className="flex flex-col h-full">
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-hf-orange" />
                    Key Takeaways
                 </h3>
                 <ul className="space-y-4 bg-white dark:bg-[#0A0A0A] p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none flex-grow">
                    {keyTakeawaysList.map((point, i) => {
                        // Extract bold text like **Security Vulnerability**
                        const parts = point.split('**:');
                        const title = parts.length > 1 ? parts[0] + '**' : null;
                        const content = parts.length > 1 ? parts.slice(1).join('**:') : point;

                        return (
                            <li key={i} className="flex items-start gap-3">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-hf-orange flex-shrink-0"></span>
                                <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {title && <strong className="text-gray-900 dark:text-white font-bold">{title.replace(/\*\*/g, '')}: </strong>}
                                    {content}
                                </span>
                            </li>
                        );
                    })}
                 </ul>
            </div>
        </div>

        {/* DETAILED FINDINGS */}
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
                <span className="w-1 h-8 bg-hf-orange rounded-full"></span>
                Detailed Analysis
            </h2>
            
            {/* List of Statements (TOC style) */}
            <div className="mb-8 bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-white/10 p-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Issues Identified</h3>
                <div className="space-y-2">
                    {data.detailed_findings.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                             {f.category === 'SECURITY_RISK' ? 
                                <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0" /> : 
                                <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                             }
                             <span className="text-gray-700 dark:text-gray-300 truncate">{f.statement}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Finding Cards */}
            <div className="space-y-8">
                {data.detailed_findings.map((finding, idx) => (
                    <SplitFindingCard key={idx} finding={finding} />
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};