import React from "react";
import { Download, Home } from "lucide-react";
import CircleProgress from "./CircleProgress";
import AuditItem, { AuditItemType } from "./AuditItem";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface AuditPoint {
  type: AuditItemType;
  title: string;
  description?: string;
  gdprArticle?: string;
  recommendation?: string;
}

interface AuditResultsProps {
  score: number;
  positivePoints: AuditPoint[];
  improvementPoints: AuditPoint[];
  onDownloadReport?: () => void;
  onReturnHome?: () => void;
  hasReport: boolean;
}

const AuditResults: React.FC<AuditResultsProps> = ({
  score,
  positivePoints,
  improvementPoints,
  onDownloadReport,
  onReturnHome,
  hasReport
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <CircleProgress value={score} size="lg" />
        <h2 className="text-xl font-medium mt-4">Compliance Score</h2>
        <p className="text-muted-foreground">
          {score >= 80 
            ? "Your policy is generally compliant with regulatory requirements"
            : score >= 60
            ? "Your policy needs some improvements to be fully compliant"
            : "Your policy contains significant compliance issues"}
        </p>
      </div>

      <div className="bg-card rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Audit Summary</h2>
        <Separator className="mb-6" />

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-success mr-2"></span>
            Positive Findings
          </h3>
          <div className="space-y-2">
            {positivePoints.map((point, index) => (
              <AuditItem
                key={`positive-${index}`}
                type={point.type}
                title={point.title}
                description={point.description}
                gdprArticle={point.gdprArticle}
                recommendation={point.recommendation}
              />
            ))}
          </div>
        </div>

        <div className="mb-2">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-warning mr-2"></span>
            Improvement Areas
          </h3>
          <div className="space-y-2">
            {improvementPoints.map((point, index) => (
              <AuditItem
                key={`improve-${index}`}
                type={point.type}
                title={point.title}
                description={point.description}
                gdprArticle={point.gdprArticle}
                recommendation={point.recommendation}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {hasReport && (
          <Button 
            onClick={onDownloadReport} 
            size="lg" 
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF Report
          </Button>
        )}
        
        <Button 
          onClick={onReturnHome} 
          variant="outline" 
          size="lg" 
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default AuditResults;
