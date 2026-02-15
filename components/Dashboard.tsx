
import React from 'react';
import { ForensicAnalysis, FrameData, FeatureAnalysis } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { HeatmapOverlay } from './HeatmapOverlay';

interface DashboardProps {
  results: ForensicAnalysis;
  frames: FrameData[];
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ results, frames, onReset }) => {
  const isSynthetic = results.overallScore >= 50;

  const radarData = [
    { subject: 'Eyes', value: results.detections.eyes.score },
    { subject: 'Mouth', value: results.detections.mouth.score },
    { subject: 'Skin', value: results.detections.skin.score },
    { subject: 'Lighting', value: results.detections.lighting.score },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'natural': return 'text-green-500';
      case 'suspicious': return 'text-yellow-500';
      case 'manipulated': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-1000">
      {/* Classification Header */}
      <div className={`mb-8 p-1 rounded-2xl ${isSynthetic ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
        <div className={`border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 ${isSynthetic ? 'bg-red-950/20' : 'bg-green-950/20'}`}>
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isSynthetic ? 'bg-red-500 text-black shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-green-500 text-black shadow-[0_0_30px_rgba(34,197,94,0.5)]'}`}>
              <span className="text-4xl font-black">{isSynthetic ? '!' : '✓'}</span>
            </div>
            <div>
              <p className="text-xs font-bold mono text-gray-400 tracking-widest uppercase mb-1">Media_Classification</p>
              <h2 className={`text-4xl md:text-5xl font-black italic tracking-tighter ${isSynthetic ? 'text-red-500' : 'text-green-500'}`}>
                {isSynthetic ? 'AI_GENERATED' : 'ORIGINAL_VIDEO'}
              </h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold mono text-gray-500 tracking-widest uppercase mb-1">Confidence_Level</p>
            <p className="text-3xl font-black mono text-white">{(results.confidence * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2">
        <div>
          <h1 className="text-xl font-bold mono tracking-tighter text-white uppercase">Forensic_Report_#TLR-{Math.floor(Math.random() * 10000)}</h1>
          <p className="text-gray-500 text-[10px] mono">AUTHENTICATED_AT: {new Date().toISOString()}</p>
        </div>
        <button 
          onClick={onReset}
          className="bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-2 rounded-full text-[10px] mono transition-colors uppercase tracking-widest text-gray-300"
        >
          &lt; START_NEW_VERIFICATION /&gt;
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Overall Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#111] border border-white/10 p-6 rounded-2xl relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-1 h-full ${isSynthetic ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <h2 className="text-gray-500 text-[10px] font-bold uppercase mb-4 tracking-widest mono">Synthetic_Probability</h2>
            <div className="flex items-baseline gap-2">
              <span className={`text-6xl font-black ${isSynthetic ? 'text-red-500' : 'text-green-500'}`}>
                {results.overallScore}%
              </span>
              <span className="text-gray-500 mono text-sm font-bold uppercase tracking-widest">Weight</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-4 leading-relaxed uppercase mono">
              Neural signature analysis detected markers consistent with {isSynthetic ? 'synthetic image synthesis models.' : 'camera-captured organic light distribution.'}
            </p>
          </div>

          <div className="bg-[#111] border border-white/10 p-6 rounded-2xl h-[300px]">
            <h2 className="text-gray-500 text-[10px] font-bold uppercase mb-4 tracking-widest mono">Forensic_Signature_Map</h2>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#999', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <Radar
                  name="Artifacts"
                  dataKey="value"
                  stroke={isSynthetic ? "#ef4444" : "#22c55e"}
                  fill={isSynthetic ? "#ef4444" : "#22c55e"}
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Center Column - Visual Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111] border border-white/10 p-6 rounded-2xl">
            <h2 className="text-gray-500 text-[10px] font-bold uppercase mb-4 tracking-widest mono">Artifact_Heatmap_Overlay</h2>
            <div className="grid grid-cols-2 gap-4">
              {frames.slice(0, 4).map((frame, idx) => (
                <div key={idx} className="relative group border border-white/5 rounded-lg overflow-hidden aspect-video bg-black shadow-inner">
                  <img src={frame.dataUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={`Frame ${idx}`} />
                  <HeatmapOverlay anomalies={results.anomalies} />
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-[8px] mono border border-white/10">
                    FRAME_TS: {frame.timestamp.toFixed(2)}s
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl">
              <h2 className="text-gray-500 text-[10px] font-bold uppercase mb-4 tracking-widest mono">Anomaly_Stream</h2>
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                {results.anomalies.map((anomaly, idx) => (
                  <div key={idx} className="border-l border-white/10 pl-4 py-1 hover:bg-white/5 transition-colors rounded-r-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[8px] px-1.5 py-0.5 rounded mono font-bold ${anomaly.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {anomaly.severity.toUpperCase()}
                      </span>
                      <span className="text-[8px] text-gray-500 mono tracking-widest">OFFSET: {anomaly.timestamp.toFixed(2)}s</span>
                    </div>
                    <p className="text-[10px] text-gray-300 leading-tight">{anomaly.description}</p>
                  </div>
                ))}
                {results.anomalies.length === 0 && (
                  <p className="text-[10px] text-gray-500 italic mono">No significant pixel-level anomalies flagged.</p>
                )}
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl">
              <h2 className="text-gray-500 text-[10px] font-bold uppercase mb-4 tracking-widest mono">Biometric_Matrix</h2>
              <div className="space-y-4">
                {Object.entries(results.detections).map(([key, value]) => {
                  const data = value as FeatureAnalysis;
                  return (
                    <div key={key} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="capitalize text-gray-400 mono font-bold">{key}</span>
                        <span className={`font-black mono tracking-widest ${getStatusColor(data.status)}`}>{data.status.toUpperCase()}</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${data.score > 70 ? 'bg-red-500' : data.score > 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${data.score}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-gray-500 italic leading-tight">{data.observation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-[#111] border border-white/10 p-8 rounded-2xl">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-gray-500 text-[10px] font-bold uppercase mb-4 tracking-widest mono">Forensic_Summary</h2>
            <p className="text-gray-300 leading-relaxed text-sm italic font-light">
              "{results.summary}"
            </p>
          </div>
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h2 className="text-gray-500 text-[10px] font-bold uppercase mb-4 tracking-widest mono">Action_Protocol</h2>
            <p className="text-gray-400 text-xs mb-6 mono leading-relaxed uppercase tracking-tight">
              {results.recommendation}
            </p>
            <button className="w-full bg-white text-black font-black py-4 rounded-lg text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-all active:scale-[0.98] shadow-lg">
              EXPORT_OFFICIAL_VERDICT (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
