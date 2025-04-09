
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface LoadingAnalysisProps {
  fileName: string;
  progress?: number;
  className?: string;
  regulation?: string;
}

const LoadingAnalysis: React.FC<LoadingAnalysisProps> = ({ 
  fileName, 
  progress,
  className,
  regulation = "RGPD" 
}) => {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="mb-6">
        <Loader2 className="h-16 w-16 text-primary animate-spin-slow" />
      </div>

      <h3 className="text-lg font-medium mb-2">Analyse en cours</h3>
      <p className="text-muted-foreground text-sm text-center mb-4 max-w-sm">
        Nous analysons votre document "{fileName}" pour déterminer sa conformité avec la réglementation {regulation}.
        Veuillez patienter quelques instants...
      </p>

      {typeof progress === 'number' && (
        <div className="w-full max-w-md">
          <Progress value={progress} className="h-2 mb-1" />
          <p className="text-xs text-right text-muted-foreground">{progress}%</p>
        </div>
      )}
    </div>
  );
};

export default LoadingAnalysis;
