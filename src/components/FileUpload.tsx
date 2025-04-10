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

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, isLoading, selectedRegulation}) => {
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
        title: "Type de fichier non pris en charge",
        description: "Seuls les fichiers PDF sont autorisés.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille du fichier ne doit pas dépasser 10 Mo.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log(selectedRegulation)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("regulation", selectedRegulation);

      onFileSelected(file, null); // déclenche le spinner

      const response = await axios.post("http://localhost:8000/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onFileSelected(file, response.data);
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier :", error);
      toast({
        title: "Échec de l'envoi",
        description: "Une erreur est survenue lors du téléversement du fichier.",
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
        {isDragActive ? "Déposez votre fichier ici" : "Glissez-déposez votre politique de confidentialité ici"}
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        Format PDF uniquement, taille max : 10 Mo
      </p>
      <Button variant="outline" size="lg" disabled={isLoading} className="font-medium">
        Choisir un fichier
      </Button>
    </div>
  );
};

export default FileUpload;
