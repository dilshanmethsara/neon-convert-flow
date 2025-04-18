
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ConversionProgressProps {
  isConverting: boolean;
  onComplete: () => void;
}

export function ConversionProgress({ isConverting, onComplete }: ConversionProgressProps) {
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (isConverting) {
      const channel = supabase
        .channel('conversion-progress')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'conversions',
          },
          (payload) => {
            if (payload.new.status === 'completed') {
              setProgress(100);
              toast({
                title: "Conversion complete!",
                description: "Your video has been successfully converted to MP4.",
              });
              onComplete();
            } else if (payload.new.status === 'processing') {
              setProgress(50);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isConverting, onComplete, toast]);

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
