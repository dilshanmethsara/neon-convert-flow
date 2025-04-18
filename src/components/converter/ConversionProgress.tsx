
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

interface ConversionProgressProps {
  isConverting: boolean;
  onComplete: () => void;
}

export function ConversionProgress({ isConverting, onComplete }: ConversionProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isConverting) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          // Simulate progress
          const newProgress = prevProgress + Math.random() * 2;
          
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onComplete();
            }, 500);
            return 100;
          }
          
          return newProgress;
        });
      }, 200);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isConverting, onComplete]);

  if (!isConverting) {
    return null;
  }

  return (
    <div className="w-full max-w-xl mx-auto p-6 space-y-4 glass rounded-2xl animate-fade-in">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium text-neonBlue">Converting...</h4>
          <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress 
          value={progress} 
          className="h-2 bg-white/10"
        />
      </div>
      <p className="text-xs text-muted-foreground italic">
        Converting your file to MP4 format. This might take a moment...
      </p>
    </div>
  );
}
