// src/components/FileUpload.tsx
import React, { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios"; // Make sure to install axios

interface FileUploadProps {
  onFileSelected: (file: File, analysisResult: any) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, isLoading }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
        description: "Only PDF files are accepted.",
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

    // Call the FastAPI endpoint to upload the file
    try {
      const formData = new FormData();
      formData.append("file", file);


      // Informe le parent qu'un fichier a été sélectionné (déclenche le spinner)
      onFileSelected(file, null); 

      const response = await axios.post("http://localhost:8000/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Transmet les résultats de l'API au composant parent
      onFileSelected(file, response.data);
      
      // Handle the response from the server
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-2xl p-10 transition-all duration-200 ease-in-out flex flex-col items-center justify-center cursor-pointer",
        isDragActive ? "drag-active" : "border-border bg-muted/50 hover:bg-muted"
      )}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
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
        {isDragActive ? "Drop your file here" : "Drop your privacy policy here"}
      </p>
      <p className="text-sm text-muted-foreground mb-4">PDF format only, max size: 10 MB</p>
      <Button variant="outline" size="lg" disabled={isLoading} className="font-medium">
        Choose a file
      </Button>
    </div>
  );
};

export default FileUpload;