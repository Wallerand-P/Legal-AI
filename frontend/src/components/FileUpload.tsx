// src/components/FileUpload.tsx
import React, { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface FileUploadProps {
  onFileSelected: (file: File, analysisResult: any) => void;
  isLoading: boolean;
  selectedRegulation: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, isLoading, selectedRegulation }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast({
        title: "Unsupported file type",
        description: "Only PDF files are allowed.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must not exceed 10 MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log(selectedRegulation);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("regulation", selectedRegulation);

      onFileSelected(file, null); // triggers loading spinner

      const response = await axios.post("http://localhost:8000/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onFileSelected(file, response.data);
    } catch (error) {
      console.error("Error while uploading file:", error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading the file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-2xl p-10 transition-all duration-200 ease-in-out flex flex-col items-center justify-center cursor-pointer",
        isDragActive ? "border-primary bg-muted/30" : "border-border bg-muted/50 hover:bg-muted"
      )}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf"
        onChange={handleFileInputChange}
        disabled={isLoading}
      />
      <Upload className={cn("h-16 w-16 mb-4", isDragActive ? "text-primary" : "text-muted-foreground")} />
      <p className="text-lg font-medium mb-1">
        {isDragActive ? "Drop your file here" : "Drag and drop your document here"}
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        PDF only, max size: 10 MB
      </p>
      <Button variant="outline" size="lg" disabled={isLoading} className="font-medium">
        Choose a file
      </Button>
    </div>
  );
};

export default FileUpload;
