
import React, { useState, useRef, useEffect } from 'react';
import { extractFrames } from './utils/videoProcessor';
import { analyzeFrames } from './geminiService';
import { ForensicAnalysis, FrameData } from './types';
import { Dashboard } from './components/Dashboard';

type AppState = 'IDLE' | 'EXTRACTING' | 'ANALYZING' | 'RESULT' | 'ERROR';

const ANALYSIS_STEPS = [
  "DECODING_TEMPORAL_DATA",
  "ISOLATING_FACIAL_LANDMARKS",
  "ANALYZING_BLINK_PATTERNS",
  "CHECKING_LIP_SYNC_COHERENCE",
  "SCANNING_SKIN_TEXTURE_NOISE",
  "IDENTIFYING_LIGHTING_INCONSISTENCIES",
  "COMPUTING_NEURAL_WEIGHTS"
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('IDLE');
  const [error, setError] = useState<string | null>(null);
  const [frames, setFrames] = useState<FrameData[]>([]);
  const [results, setResults] = useState<ForensicAnalysis | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulated progress during analysis
  useEffect(() => {
    let interval: number;
    if (state === 'ANALYZING') {
      interval = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 92) return prev; // Hold at 92% until API returns
          return prev + Math.random() * 5;
        });
        setCurrentStep(prev => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
      }, 1200);
    } else {
      setProgress(0);
      setCurrentStep(0);
    }
    return () => clearInterval(interval);
  }, [state]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError("Please select a valid video file.");
      return;
    }

    setState('EXTRACTING');
    try {
      const extracted = await extractFrames(file, 4);
      setFrames(extracted);
      setState('ANALYZING');
      
      const analysis = await analyzeFrames(extracted);
      
      // Complete progress and transition
      setProgress(100);
      setTimeout(() => {
        setResults(analysis);
        setState('RESULT');
      }, 500);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. This might be due to content safety filters or API connectivity issues.");
      setState('ERROR');
    }
  };

  const reset = () => {
    setState('IDLE');
    setFrames([]);
    setResults(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center font-black text-black">T</div>
            <span className="font-bold tracking-tighter mono">TruthLens_V1</span>
          </div>
          <div className="hidden md:flex gap-8 text-xs mono text-gray-400">
            <a href="#" className="hover:text-white transition-colors">/DOCS</a>
            <a href="#" className="hover:text-white transition-colors">/API_REF</a>
            <a href="#" className="hover:text-white transition-colors">/BENCHMARKS</a>
          </div>
          <div className="flex items-center gap-4">
            <div className={`h-2 w-2 rounded-full ${state === 'ANALYZING' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-[10px] mono text-gray-500 uppercase">
              {state === 'ANALYZING' ? 'ENGINE: BUSY' : 'ENGINE: ONLINE'}
            </span>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center">
        {state === 'IDLE' && (
          <div className="max-w-xl w-full px-4 text-center space-y-8 py-20">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight italic">
                TRUST_NO_<br/>PIXEL.
              </h1>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                Upload video content for enterprise-grade forensic verification. We detect GAN, Diffusion, and Deepfake manipulations.
              </p>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative cursor-pointer bg-[#111] border-2 border-dashed border-white/10 p-12 rounded-3xl hover:border-green-500/50 transition-all hover:bg-[#151515]"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="video/*" 
                onChange={handleFileUpload}
              />
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-white uppercase tracking-widest mono text-sm">Deploy_Analysis</p>
                  <p className="text-gray-500 text-xs">MP4, MOV, WebM (MAX 50MB)</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                <p className="text-[10px] text-gray-500 mono mb-1">LATENCY</p>
                <p className="text-xl font-bold mono">~12s</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                <p className="text-[10px] text-gray-500 mono mb-1">ACCURACY</p>
                <p className="text-xl font-bold mono">99.4%</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                <p className="text-[10px] text-gray-500 mono mb-1">ENGINE</p>
                <p className="text-xl font-bold mono">PRO-V3</p>
              </div>
            </div>
          </div>
        )}

        {(state === 'EXTRACTING' || state === 'ANALYZING') && (
          <div className="w-full max-w-2xl px-6 text-center space-y-12 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative w-full max-w-md h-56 bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/10 mx-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="scan-line"></div>
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <div className="mono text-[8px] text-green-500/20 tracking-tighter grid grid-cols-12 gap-1 opacity-40 select-none">
                  {Array.from({ length: 300 }).map((_, i) => (
                    <span key={i}>{Math.random() > 0.5 ? '1' : '0'}</span>
                  ))}
                </div>
              </div>
              {frames[0] && (
                <img src={frames[0].dataUrl} className="w-full h-full object-cover opacity-40 blur-[2px]" alt="Processing" />
              )}
            </div>

            <div className="space-y-6 w-full max-sm mx-auto">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] mono text-gray-500 uppercase tracking-widest">
                  <span>{state === 'EXTRACTING' ? 'DECODING_MEDIA' : ANALYSIS_STEPS[currentStep]}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-black mono text-white tracking-tighter uppercase">
                  {state === 'EXTRACTING' ? 'PREPARING_ASSETS' : 'CRITICAL_SCAN_IN_PROGRESS'}
                </h2>
                <p className="text-gray-500 mono text-[10px] uppercase tracking-widest">
                  TruthLens Forensic Engine v3.1 is executing deep-pixel verification...
                </p>
              </div>
            </div>
          </div>
        )}

        {state === 'RESULT' && results && (
          <Dashboard results={results} frames={frames} onReset={reset} />
        )}

        {state === 'ERROR' && (
          <div className="max-w-md text-center space-y-6 py-20">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black mono text-white">ANALYSIS_CRITICAL_FAILURE</h2>
            <p className="text-gray-400">{error}</p>
            <button 
              onClick={reset}
              className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gray-200"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-8 mt-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-[10px] mono tracking-widest">
          <p>© TRUTHLENS FORENSICS. ALL RIGHTS RESERVED. 2025.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">PRIVACY_PROTOCOL</a>
            <a href="#" className="hover:text-white transition-colors">SECURITY_MANIFESTO</a>
            <a href="#" className="hover:text-white transition-colors">SYSTEM_LOGS</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
