
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { FileUpload } from "@/components/converter/FileUpload";
import { ConversionProgress } from "@/components/converter/ConversionProgress";
import { ConversionResult } from "@/components/converter/ConversionResult";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  
  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setIsConverted(false);
  };
  
  const handleConvert = () => {
    if (selectedFile) {
      setIsConverting(true);
    }
  };
  
  const handleConversionComplete = () => {
    setIsConverting(false);
    setIsConverted(true);
  };
  
  const handleReset = () => {
    setSelectedFile(null);
    setIsConverting(false);
    setIsConverted(false);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container max-w-6xl mx-auto py-10 px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold mb-3 text-glow">H265X to MP4 Converter</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Convert your H265X video files to MP4 format with our easy-to-use tool. Just upload your file and click convert!
            </p>
          </div>
          
          <div className="space-y-6">
            {!isConverted && (
              <FileUpload 
                onFileSelect={handleFileSelect} 
                selectedFile={selectedFile} 
              />
            )}
            
            {!isConverting && !isConverted && selectedFile && (
              <div className="flex justify-center mt-6">
                <Button 
                  onClick={handleConvert}
                  className="bg-neonBlue hover:bg-neonBlue/80 text-black font-medium px-8 py-6 text-lg animate-pulse-glow btn-glow"
                >
                  Convert Now
                </Button>
              </div>
            )}
            
            {isConverting && (
              <ConversionProgress 
                isConverting={isConverting} 
                onComplete={handleConversionComplete} 
              />
            )}
            
            {isConverted && selectedFile && (
              <ConversionResult 
                originalFileName={selectedFile.name} 
                onReset={handleReset} 
              />
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
