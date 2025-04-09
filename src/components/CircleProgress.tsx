
import React from "react";
import { cn } from "@/lib/utils";

interface CircleProgressProps {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const CircleProgress: React.FC<CircleProgressProps> = ({ 
  value, 
  size = "md", 
  className 
}) => {
  const sizeClasses = {
    sm: "text-2xl --size: 100px --thickness: 8px",
    md: "text-3xl --size: 160px --thickness: 12px",
    lg: "text-4xl --size: 220px --thickness: 16px",
  };

  // Ensure value is between 0 and 100
  const safeValue = Math.min(100, Math.max(0, value));
  
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-primary";
    return "text-warning";
  };

  return (
    <div 
      className={cn(
        "circle-progress", 
        sizeClasses[size], 
        className
      )} 
      style={{ "--progress": safeValue } as React.CSSProperties}
    >
      <div className="flex flex-col items-center">
        <span className={cn("font-bold", getScoreColor(safeValue))}>
          {safeValue}
        </span>
        <span className="text-xs text-muted-foreground mt-1">/ 100</span>
      </div>
    </div>
  );
};

export default CircleProgress;
