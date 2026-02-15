
import { FrameData } from "../types";

export const extractFrames = (videoFile: File, count: number = 4): Promise<FrameData[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(videoFile);
    video.load();

    video.onloadedmetadata = async () => {
      const duration = video.duration;
      const frames: FrameData[] = [];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error("Failed to create canvas context"));
        return;
      }

      for (let i = 0; i < count; i++) {
        const time = (duration / (count + 1)) * (i + 1);
        video.currentTime = time;
        
        await new Promise((res) => {
          video.onseeked = res;
        });

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        frames.push({
          timestamp: time,
          dataUrl: canvas.toDataURL('image/jpeg', 0.8)
        });
      }

      resolve(frames);
    };

    video.onerror = reject;
  });
};
