
import React, { useState } from "react";
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



// Mock data for demonstration purposes
const mockAuditData = {
  score: 78,
  positivePoints: [
    {
      type: "positive" as const,
      title: "Finalités de traitement clairement définies",
      description: "Votre politique de confidentialité explique de façon exhaustive les finalités pour lesquelles vous collectez des données personnelles.",
      gdprArticle: "Article 5(1)(b) - Les données à caractère personnel doivent être collectées pour des finalités déterminées, explicites et légitimes."
    },
    {
      type: "positive" as const,
      title: "Durées de conservation spécifiées",
      description: "Les durées de conservation des différentes catégories de données sont bien précisées.",
      gdprArticle: "Article 13(2)(a) - Informer la personne concernée sur la durée de conservation des données à caractère personnel."
    },
    {
      type: "positive" as const,
      title: "Information sur les droits des personnes",
      description: "Les droits d'accès, de rectification et d'effacement sont clairement mentionnés."
    }
  ],
  improvementPoints: [
    {
      type: "improvement" as const,
      title: "Base légale des traitements incomplète",
      description: "Certaines opérations de traitement sont mentionnées sans préciser leur base légale (consentement, contrat, intérêt légitime, etc.).",
      gdprArticle: "Article 6 - Un traitement n'est licite que si l'une des conditions de l'article 6 est remplie.",
      recommendation: "Précisez pour chaque traitement de données la base légale correspondante parmi celles définies à l'article 6 du RGPD."
    },
    {
      type: "improvement" as const,
      title: "Transferts hors UE insuffisamment détaillés",
      description: "Les garanties appropriées pour les transferts de données hors UE ne sont pas suffisamment détaillées.",
      gdprArticle: "Articles 44 à 49 - Transferts de données à caractère personnel vers des pays tiers ou à des organisations internationales.",
      recommendation: "Indiquez précisément les pays hors UE vers lesquels les données sont transférées ainsi que les garanties mises en œuvre (clauses contractuelles types, etc.)."
    }
  ]
};

const Index = () => {
  const [auditData, setAuditData] = useState<any | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [auditComplete, setAuditComplete] = useState(false);
  const [selectedRegulation, setSelectedRegulation] = useState("rgpd");
  const { toast } = useToast();

  const handleFileSelected = (file: File, analysisResult: any) => {
    setFileInfo({ file, name: file.name });
    setIsAnalyzing(true); // 👈 on déclenche le loader direct
  
    if (analysisResult) {
      setAuditData(analysisResult);
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
    "rgpd": "RGPD (UE)",
    "ccpa": "CCPA (Californie)",
    "lgpd": "LGPD (Brésil)",
    "pdpa": "PDPA (Singapour)",
    "pipeda": "PIPEDA (Canada)"
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Audit de conformité règlementaire
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
            />
          )}

          {isAnalyzing && fileInfo && (
            <LoadingAnalysis 
              fileName={fileInfo.name} 
              progress={analysisProgress} 
              className="my-16"
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
