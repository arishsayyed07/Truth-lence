
import React from 'react';

interface HeatmapOverlayProps {
  anomalies: Array<{
    coordinates: { x: number, y: number, radius: number };
    severity: string;
    description: string;
  }>;
}

export const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({ anomalies }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {anomalies.map((anomaly, idx) => (
          <g key={idx}>
            <circle
              cx={anomaly.coordinates.x}
              cy={anomaly.coordinates.y}
              r={anomaly.coordinates.radius}
              fill={anomaly.severity === 'high' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(234, 179, 8, 0.4)'}
              className="animate-pulse"
            />
            <circle
              cx={anomaly.coordinates.x}
              cy={anomaly.coordinates.y}
              r={0.5}
              fill="white"
            />
            <line
              x1={anomaly.coordinates.x}
              y1={anomaly.coordinates.y}
              x2={anomaly.coordinates.x + 5}
              y2={anomaly.coordinates.y - 5}
              stroke="white"
              strokeWidth="0.2"
            />
          </g>
        ))}
      </svg>
    </div>
  );
};
