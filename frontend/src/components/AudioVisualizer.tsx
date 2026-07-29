import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isRecording: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isRecording }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext>();
  const analyserRef = useRef<AnalyserNode>();
  const streamRef = useRef<MediaStream>();

  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          streamRef.current = stream;
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          analyserRef.current = audioContextRef.current.createAnalyser();
          
          const source = audioContextRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);
          analyserRef.current.fftSize = 256;
          
          visualize();
        })
        .catch(err => console.error("Error accessing mic for visualizer", err));
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.beginPath();
          ctx.moveTo(0, canvas.height / 2);
          ctx.lineTo(canvas.width, canvas.height / 2);
          ctx.strokeStyle = '#4b5563'; // gray-600
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }
    }
    
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording]);

  const visualize = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyserRef.current!.getByteTimeDomainData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#10b981'; // emerald-500
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      
      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * (canvas.height / 2);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };
    
    draw();
  };

  return (
    <div className="w-full flex justify-center items-center h-24 bg-gray-900 rounded-xl overflow-hidden shadow-inner border border-gray-800">
      <canvas ref={canvasRef} width={400} height={80} className="w-full max-w-sm" />
    </div>
  );
};
