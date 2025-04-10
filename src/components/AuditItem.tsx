import React, { useState } from "react";
import { 
  CheckCircle, 
  AlertTriangle, 
  ChevronDown, 
  ChevronRight,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AuditItemType = "positive" | "improvement";

interface AuditItemProps {
  type: AuditItemType;
  title: string;
  description?: string;
  gdprArticle?: string;
  recommendation?: string;
}

const AuditItem: React.FC<AuditItemProps> = ({
  type,
  title,
  description,
  gdprArticle,
  recommendation
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetails = !!description || !!gdprArticle || !!recommendation;

  return (
    <div className="border rounded-lg overflow-hidden mb-3">
      <div 
        className={cn(
          "px-4 py-3 flex items-center justify-between",
          type === "positive" ? "bg-success/10" : "bg-warning/10",
          hasDetails && "cursor-pointer hover:bg-opacity-70"
        )}
        onClick={() => hasDetails && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          {type === "positive" ? (
            <CheckCircle className="h-5 w-5 text-success mr-3 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-warning mr-3 flex-shrink-0" />
          )}
          <span className="font-medium">{title}</span>
        </div>
        {hasDetails && (
          <div>
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        )}
      </div>
      
      {hasDetails && isExpanded && (
        <div className="px-4 py-3 bg-muted/30 border-t">
          {description && <p className="text-sm mb-3">{description}</p>}
          
          {gdprArticle && (
            <div className="flex items-start mb-3">
              <BookOpen className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
              <div>
                <span className="text-xs font-medium text-muted-foreground">Related article:</span>
                <p className="text-sm">{gdprArticle}</p>
              </div>
            </div>
          )}
          
          {recommendation && (
            <div className="bg-card p-3 rounded-md mt-3">
              <span className="text-xs font-medium text-muted-foreground">Recommendation:</span>
              <p className="text-sm">{recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuditItem;
