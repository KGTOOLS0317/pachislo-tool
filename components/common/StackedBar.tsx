
// components/common/StackedBar.tsx
import React from 'react';
import type { KingHanaHanaSSettingProbabilities } from '../../types'; // Using KHH as a representative type

export const SHARED_SETTING_COLORS: Record<string, string> = { 
  "設定1": "bg-slate-400", 
  "設定2": "bg-sky-400",   
  "設定3": "bg-yellow-400", 
  "設定4": "bg-green-400",  
  "設定5": "bg-red-400",   
  "設定6": "bg-purple-400",
  "default": "bg-gray-300",
};

export const SHARED_TEXT_COLORS: Record<string, string> = {
  "設定1": "text-white",
  "設定2": "text-white",
  "設定3": "text-gray-800", 
  "設定4": "text-gray-800",
  "設定5": "text-white",
  "設定6": "text-white",
  "default": "text-gray-800",
};

// New constant for highlight colors
const SHARED_SETTING_HIGHLIGHT_COLORS: Record<string, { border: string; ring: string }> = {
  "設定1": { border: "border-slate-600 dark:border-slate-300", ring: "ring-slate-600 dark:ring-slate-300" },
  "設定2": { border: "border-sky-600 dark:border-sky-300",     ring: "ring-sky-600 dark:ring-sky-300" },
  "設定3": { border: "border-yellow-600 dark:border-yellow-300", ring: "ring-yellow-600 dark:ring-yellow-300" },
  "設定4": { border: "border-green-600 dark:border-green-300", ring: "ring-green-600 dark:ring-green-300" },
  "設定5": { border: "border-red-600 dark:border-red-300",     ring: "ring-red-600 dark:ring-red-300" },
  "設定6": { border: "border-purple-600 dark:border-purple-300", ring: "ring-purple-600 dark:ring-purple-300" },
  "default": { border: "border-gray-500 dark:border-gray-400", ring: "ring-gray-500 dark:ring-gray-400" },
};


export const StackedBar: React.FC<{ probabilities: KingHanaHanaSSettingProbabilities, names: string[], heightClass?: string, isOverallResult?: boolean }> = ({ probabilities, names, heightClass = "h-6 sm:h-8", isOverallResult = false }) => {
  const sortedProbabilities = Object.entries(probabilities)
    .filter(([name]) => names.includes(name))
    .sort(([nameA], [nameB]) => {
      const indexA = names.indexOf(nameA);
      const indexB = names.indexOf(nameB);
      return indexA - indexB;
    });

  if (sortedProbabilities.length === 0) return null;

  // Fix: Cast `p` to number as Object.entries may return `unknown` values.
  const maxProbability = Math.max(0, ...sortedProbabilities.map(([, p]) => p as number));

  return (
    <div className={`w-full ${heightClass} flex rounded shadow mb-1 relative overflow-hidden`} style={{ overflow: 'hidden' }} data-bar-container="true">
      {sortedProbabilities.map(([name, probability]) => {
        // Fix: Cast `probability` to number for arithmetic operation.
        const percentage = ((probability as number) * 100).toFixed(1);
        const pct = (probability as number) * 100;
        // Fix: Cast `probability` to number for arithmetic operation.
        const segmentWidth = `${Math.max(0.1, pct)}%`;
        const bgColor = SHARED_SETTING_COLORS[name] || SHARED_SETTING_COLORS["default"];
        const textColor = SHARED_TEXT_COLORS[name] || SHARED_TEXT_COLORS["default"];
        const isHighest = (probability as number) === maxProbability && (probability as number) > 0.0001;

        let highlightClasses = "";
        if (isHighest) {
            const highlightColors = SHARED_SETTING_HIGHLIGHT_COLORS[name] || SHARED_SETTING_HIGHLIGHT_COLORS["default"];
            let effectClasses = "";
            let ringThicknessClass = "";

            if (isOverallResult) {
                effectClasses = "transform scale-[1.015] shadow-xl";
                ringThicknessClass = "ring-2";
            } else {
                effectClasses = "shadow-md";
                ringThicknessClass = "ring-1";
            }
            highlightClasses = `${highlightColors.border} ${highlightColors.ring} ${ringThicknessClass} ring-offset-0 ${effectClasses} z-10`;
        }

        return (
          <div
            key={name}
            className={`h-full overflow-hidden ${bgColor} transition-all duration-700 ease-out ${highlightClasses}`}
            style={{ width: segmentWidth, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title={`${name}: ${percentage}%`}
            role="progressbar"
            aria-valuenow={parseFloat(percentage)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${name} probability: ${percentage}%`}
          >
            {pct >= 6 && (
              <span className={`text-xs sm:text-sm font-medium ${textColor} whitespace-nowrap px-1`} style={{ lineHeight: 1 }}>
                {percentage}%
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
StackedBar.displayName = 'StackedBar';