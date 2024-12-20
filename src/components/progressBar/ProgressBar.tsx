// src/ProgressBar.tsx
import React from "react";

interface ProgressBarProps {
  maxValue: number;
  completedValue: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  maxValue,
  completedValue,
}) => {
  const percentage = (completedValue / maxValue) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        {/*   <span>RTE {percentage.toFixed(0)}%</span> */}
        <div></div>
        <span className="text-right text-xs">
          Total a recaudar: {maxValue} Wusdt
        </span>
      </div>
      <div className="relative w-full h-4 bg-gray-200 rounded">
        <div
          className="absolute h-full bg-green-500 rounded"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
