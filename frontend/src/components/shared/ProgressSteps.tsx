import React from "react";
import { CheckCircle2, UserCircle, Building, BarChart2, Upload } from "lucide-react";

interface ProgressStepsProps {
  currentStep: number;
  steps?: Array<{
    name: string;
    icon: React.ElementType;
  }>;
}

export const ProgressSteps = ({ 
  currentStep,
  steps = [
    { name: "Account", icon: UserCircle },
    { name: "Details", icon: Building },
    { name: "Metrics", icon: BarChart2 },
    { name: "Documents", icon: Upload }
  ]
}: ProgressStepsProps) => {
  return (
    <div className="flex justify-between items-center w-full mb-8 px-4">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = index + 1 <= currentStep;
        const isCompleted = index + 1 < currentStep;
        const isCurrent = index + 1 === currentStep;
        
        return (
          <React.Fragment key={step.name}>
            {/* Step Circle with Icon */}
            <div className="flex flex-col items-center gap-1 transition-all duration-500">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
                ${isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/25 scale-105'
                  : 'bg-muted text-muted-foreground'
                }
                ${isCurrent ? 'ring-4 ring-primary/20' : ''}
              `}>
                {isCompleted ? 
                  <CheckCircle2 className="h-6 w-6 animate-fadeIn" /> : 
                  <StepIcon className={`h-6 w-6 ${isCurrent ? 'animate-pulse' : ''}`} />
                }
              </div>
              <span className={`text-xs font-medium mt-1 transition-all duration-500 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {step.name}
              </span>
            </div>
            
            {/* Connector Line (not for the last item) */}
            {index < steps.length - 1 && (
              <div className="relative h-[3px] flex-1 mx-2">
                <div className="absolute inset-0 bg-muted rounded-full"></div>
                <div 
                  className={`absolute inset-0 bg-primary rounded-full transition-all duration-700 ease-in-out
                    ${index + 1 < currentStep ? 'w-full' : 'w-0'}
                  `}
                ></div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}; 