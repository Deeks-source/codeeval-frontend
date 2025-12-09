import React, { useState, useRef, useEffect } from 'react';
import { Hero } from './components/Hero';
import { AgentSimulation } from './components/AgentSimulation';
import { Report } from './components/Report';
import { AppState, FinalReport } from './types';
import { generateReview } from './services/geminiService';
import { Network, ChevronRight, Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [report, setReport] = useState<FinalReport | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const analysisPromise = useRef<Promise<FinalReport> | null>(null);

  useEffect(() => {
    // Check system preference on load
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false); // Default to light mode unless system says dark, but user can toggle
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleStartReview = async (url: string) => {
    setAppState(AppState.SIMULATING);
    analysisPromise.current = generateReview(url);
  };

  const handleSimulationComplete = async () => {
    if (analysisPromise.current) {
      try {
        const data = await analysisPromise.current;
        setReport(data);
        setAppState(AppState.REPORT_READY);
      } catch (error) {
        console.error("Failed to retrieve report", error);
        setAppState(AppState.ERROR);
      }
    } else {
        setAppState(AppState.ERROR);
    }
  };

  const handleRestart = () => {
    setReport(null);
    setAppState(AppState.IDLE);
    analysisPromise.current = null;
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} h-full`}>
      <div className="min-h-screen font-sans selection:bg-hf-orange selection:text-white bg-gray-50 dark:bg-hf-dark text-gray-900 dark:text-white transition-colors duration-700">
        
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 transition-all duration-300">
            {/* Backdrop: Uses pure black in dark mode */}
            <div className={`absolute inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5 transition-all duration-500`}></div>
            <div className="relative max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
              {/* Logo */}
              <div 
                className="flex items-center space-x-3 cursor-pointer group"
                onClick={handleRestart}
              >
                <div className="bg-gradient-to-tr from-hf-orange to-red-500 text-white p-2 rounded-xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Network className="w-5 h-5" />
                </div>
                <span className="text-gray-900 dark:text-white font-bold text-xl tracking-tight group-hover:text-hf-orange transition-colors">CodeAgent</span>
              </div>

              {/* Action Buttons & Theme Toggle */}
              <div className="flex items-center space-x-4">
                <button 
                  onClick={toggleTheme}
                  className="p-2.5 rounded-full text-gray-500 hover:bg-black/5 dark:text-gray-400 dark:hover:bg-white/10 transition-all duration-300 hover:rotate-12"
                  aria-label="Toggle Theme"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </nav>

        <main className="flex-grow pt-20">
          {appState === AppState.IDLE && (
            <Hero onStartReview={handleStartReview} loading={false} />
          )}

          {appState === AppState.SIMULATING && (
            <AgentSimulation onComplete={handleSimulationComplete} />
          )}

          {appState === AppState.REPORT_READY && report && (
            <Report data={report} onRestart={handleRestart} />
          )}
          
          {appState === AppState.ERROR && (
            <div className="min-h-[80vh] flex items-center justify-center flex-col p-4 relative overflow-hidden bg-white dark:bg-hf-dark">
                <div className="absolute inset-0 pointer-events-none">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 text-center">
                    <h2 className="text-3xl font-bold text-red-500 mb-4">Connection Failed</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
                        We couldn't connect to the agent network. Please check your URL and try again.
                    </p>
                    <button 
                        onClick={handleRestart}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-red-500/30"
                    >
                        Retry Audit
                    </button>
                </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;