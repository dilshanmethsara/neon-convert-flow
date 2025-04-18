
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConversionResultProps {
  originalFileName: string;
  onReset: () => void;
}

export function ConversionResult({ originalFileName, onReset }: ConversionResultProps) {
  const convertedFileName = originalFileName.split('.').slice(0, -1).join('.') + '.mp4';
  
  // In a real app, this would be a actual download link to the converted file
  const handleDownload = () => {
    // Mock download by creating a blob and initiating download
    const blob = new Blob(["Dummy content for demo purposes"], { type: "video/mp4" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = convertedFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 space-y-6 glass rounded-2xl animate-fade-in">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-electricGreen/20 mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-electricGreen h-8 w-8"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-glow-green mb-2">Conversion Complete!</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Your file has been successfully converted to MP4 format
        </p>
      </div>
      
      <div className="p-4 rounded-lg bg-white/5 text-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-muted-foreground">Original File:</span>
          <span className="font-medium truncate">{originalFileName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Converted File:</span>
          <span className="font-medium text-electricGreen truncate">{convertedFileName}</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleDownload}
          className="flex-1 bg-electricGreen hover:bg-electricGreen/80 text-black font-medium btn-glow animate-pulse-glow-green"
        >
          <Download className="mr-2 h-5 w-5" />
          Download MP4
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="flex-1 border-white/20 hover:bg-white/10"
        >
          Convert Another File
        </Button>
      </div>
    </div>
  );
}
