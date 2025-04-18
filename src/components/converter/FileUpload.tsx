
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileVideo, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setUploading(true);
        
        try {
          // Upload the file to Supabase storage
          const { data, error } = await supabase.storage
            .from('videos')
            .upload(`uploads/${crypto.randomUUID()}-${file.name}`, file);

          if (error) throw error;

          // Create a conversion record
          const { data: conversion, error: conversionError } = await supabase
            .from('conversions')
            .insert([{
              original_filename: file.name,
              converted_filename: file.name.replace(/\.[^/.]+$/, ".mp4")
            }])
            .select()
            .single();

          if (conversionError) throw conversionError;

          // Get the public URL of the uploaded file
          const { data: { publicUrl } } = supabase.storage
            .from('videos')
            .getPublicUrl(data.path);

          // Start the conversion process
          const response = await supabase.functions.invoke('convert-video', {
            body: { videoUrl: publicUrl, conversionId: conversion.id }
          });

          if (!response.data?.success) {
            throw new Error('Conversion failed to start');
          }

          onFileSelect(file);
          toast({
            title: "File uploaded successfully",
            description: "Your video is being converted. You'll be notified when it's ready.",
          });
        } catch (error) {
          console.error('Upload error:', error);
          toast({
            title: "Upload failed",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setUploading(false);
        }
      }
    },
    [onFileSelect, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.h265', '.h265x', '.mp4', '.mkv', '.avi', '.mov', '.webm']
    },
    maxFiles: 1,
    multiple: false,
    disabled: uploading,
  });

  return (
    <div className="w-full max-w-xl mx-auto">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-all duration-300 ${
            isDragActive ? "border-neonBlue bg-neonBlue/10 animate-pulse-glow" : "border-white/20 hover:border-neonBlue/50"
          } glass cursor-pointer`}
        >
          <input {...getInputProps()} />
          <Upload
            className={`w-12 h-12 mb-4 ${
              isDragActive ? "text-neonBlue animate-pulse" : "text-muted-foreground"
            }`}
          />
          <p className="text-lg font-medium mb-2">Drag and drop your file here</p>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            Support for H265X, MP4, MKV, AVI, MOV, and WEBM files
          </p>
          <Button 
            type="button" 
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white"
          >
            Browse Files
          </Button>
          <p className="mt-6 text-neonBlue text-sm font-medium">100% free to use</p>
        </div>
      ) : (
        <div className="glass rounded-2xl p-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-white/10">
              <FileVideo className="w-8 h-8 text-neonBlue" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onFileSelect(null as unknown as File)}
              className="hover:bg-white/10"
            >
              <X className="w-5 h-5" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
