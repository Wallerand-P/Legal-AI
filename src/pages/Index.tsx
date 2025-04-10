
import React, { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import FileUpload from "@/components/FileUpload";
import LoadingAnalysis from "@/components/LoadingAnalysis";
import AuditResults from "@/components/AuditResults";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

interface FileInfo {
  file: File;
  name: string;
}


const Index = () => {
  const [auditData, setAuditData] = useState<any | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [auditComplete, setAuditComplete] = useState(false);
  const [selectedRegulation, setSelectedRegulation] = useState("rgpd");
  const { toast } = useToast();

  const progressRef = useRef(0);
  
  const handleFileSelected = (file: File, analysisResult: any) => {
    setFileInfo({ file, name: file.name });
    setIsAnalyzing(true); // déclenche le loader direct
    setAnalysisProgress(0);
    setAuditComplete(false);
    progressRef.current = 0;

    // Simulation de progression
    const interval = setInterval(() => {
      if (progressRef.current < 90) {
        progressRef.current += 5;
        setAnalysisProgress(progressRef.current);
      } else {
        clearInterval(interval);
      }
    }, 300);
  
    if (analysisResult) {
      setAuditData(analysisResult);
      clearInterval(interval);
      setAnalysisProgress(100);
      setTimeout(() => {
        setIsAnalyzing(false);
        setAuditComplete(true);
      }, 500); // petit délai pour laisser le loader s'afficher un moment
    }
  };


  const handleDownloadReport = () => {
    // In a real app, this would generate and download a PDF
    toast({
      title: "Téléchargement du rapport",
      description: "Le rapport détaillé de conformité sera téléchargé dans quelques instants.",
    });
  };

  const handleReturnHome = () => {
    // Reset the application state to the initial state
    setFileInfo(null);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setAuditComplete(false);
  };

  // Map of regulation codes to display names
  const regulations = {
    "rgpd": "RGPD",
    "ccpa": "CCPA",
    "lgpd": "LGPD",
    "pdpa": "PDPA",
    "pipeda": "PIPEDA"
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            Legal AI - Audit de conformité règlementaire
          </h1>
          <div className="flex justify-center items-center gap-2 text-muted-foreground text-lg mx-auto">
            <p className="whitespace-nowrap">Déposez votre document juridique pour évaluer sa conformité avec</p>
            <Select 
              value={selectedRegulation} 
              onValueChange={setSelectedRegulation}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionnez une réglementation" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(regulations).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-12">
          {!fileInfo && !isAnalyzing && !auditComplete && (
            <FileUpload 
              onFileSelected={handleFileSelected}
              isLoading={isAnalyzing}
              selectedRegulation={selectedRegulation}
            />
          )}

          {isAnalyzing && fileInfo && (
            <LoadingAnalysis 
              fileName={fileInfo.name} 
              progress={analysisProgress} 
              className="my-16"
              regulation={regulations[selectedRegulation]}
            />
          )}

          {auditComplete && (
            <AuditResults 
              score={auditData?.score ?? 0}
              positivePoints={auditData?.positivePoints ?? []}
              improvementPoints={auditData?.improvementPoints ?? []}
              onDownloadReport={handleDownloadReport}
              onReturnHome={handleReturnHome}
              hasReport={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
