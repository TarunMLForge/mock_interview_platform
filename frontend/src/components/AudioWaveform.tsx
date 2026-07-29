"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

interface AudioWaveformProps {
  isRecording: boolean;
}

export default function AudioWaveform({ isRecording }: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isRecording) return;

    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let microphone: MediaStreamAudioSourceNode;
    let animationFrame: number;

    const startAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const draw = () => {
          animationFrame = requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const barWidth = (canvas.width / bufferLength) * 2;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = (dataArray[i] / 255) * canvas.height;

            const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
            gradient.addColorStop(0, "#3b82f6"); // blue-500
            gradient.addColorStop(1, "#60a5fa"); // blue-400

            ctx.fillStyle = gradient;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#3b82f6";
            
            ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
            x += barWidth;
          }
        };

        draw();
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setError("Microphone access denied.");
      }
    };

    startAudio();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (audioContext && audioContext.state !== "closed") audioContext.close();
    };
  }, [isRecording]);

  return (
    <div className="flex flex-col items-center justify-center p-4 glass-card rounded-2xl w-full max-w-md mx-auto slate-glow">
      <div className="flex items-center gap-3 mb-4">
        {isRecording ? (
          <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 animate-pulse">
            <Mic className="w-6 h-6" />
          </div>
        ) : (
          <div className="p-3 rounded-full bg-slate-800 text-slate-400">
            <MicOff className="w-6 h-6" />
          </div>
        )}
        <span className={`text-sm font-medium ${isRecording ? 'text-blue-400' : 'text-slate-400'}`}>
          {isRecording ? "Listening..." : "Microphone Off"}
        </span>
      </div>
      
      <canvas
        ref={canvasRef}
        width={300}
        height={60}
        className={`w-full h-[60px] rounded-lg ${!isRecording ? 'opacity-30' : 'opacity-100 transition-opacity duration-300'}`}
      />
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}
