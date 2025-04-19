
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
  const [statusMessage, setStatusMessage] = useState("Initializing conversion...");
  const { toast } = useToast();

  useEffect(() => {
    if (isConverting) {
      // Initialize progress animation
      setProgress(10);
      const timer = setTimeout(() => setProgress(25), 1000);
      
      console.log("Setting up realtime subscription for conversion progress");
      
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
            console.log("Received conversion update:", payload);
            
            if (payload.new.status === 'processing') {
              setProgress(50);
              setStatusMessage("Processing your video...");
            } else if (payload.new.status === 'completed') {
              setProgress(100);
              setStatusMessage("Conversion complete!");
              toast({
                title: "Conversion complete!",
                description: "Your video has been successfully converted to MP4.",
              });
              setTimeout(() => {
                onComplete();
              }, 1000);
            } else if (payload.new.status === 'error') {
              setStatusMessage(`Error: ${payload.new.error_message || "Conversion failed"}`);
              toast({
                title: "Conversion failed",
                description: payload.new.error_message || "There was an error converting your video.",
                variant: "destructive",
              });
            }
          }
        )
        .subscribe();

      return () => {
        clearTimeout(timer);
        console.log("Removing channel subscription");
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
          <h4 className="text-sm font-medium text-neonBlue">{statusMessage}</h4>
          <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress 
          value={progress} 
          className="h-2 bg-white/10"
        />
      </div>
      <p className="text-xs text-muted-foreground italic">
        Converting your file to MP4 format. This might take a few minutes depending on your file size...
      </p>
    </div>
  );
}
