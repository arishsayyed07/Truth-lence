
export interface ForensicAnalysis {
  overallScore: number; // 0 to 100, where 100 is "Definitely Deepfake"
  confidence: number;
  detections: {
    eyes: FeatureAnalysis;
    mouth: FeatureAnalysis;
    skin: FeatureAnalysis;
    lighting: FeatureAnalysis;
  };
  anomalies: Array<{
    timestamp: number;
    description: string;
    severity: 'low' | 'medium' | 'high';
    coordinates: { x: number, y: number, radius: number };
  }>;
  summary: string;
  recommendation: string;
}

export interface FeatureAnalysis {
  score: number; // 0 to 100
  status: 'natural' | 'suspicious' | 'manipulated';
  observation: string;
}

export interface FrameData {
  timestamp: number;
  dataUrl: string;
}
