import React from 'react';

interface StepIndicatorProps {
  currentStep: number; // The current active step
  totalSteps: number; // Total number of steps
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center mt-4">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
            index < currentStep
              ? 'bg-blue-600 text-white' // Completed steps
              : index === currentStep
              ? 'bg-blue-400 text-white' // Current step
              : 'bg-gray-300 text-gray-600' // Inactive steps
          }`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;