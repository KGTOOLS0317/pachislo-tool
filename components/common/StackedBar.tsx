
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

// Inline border colors for image-capture-safe highlight (box-shadow/ring not rendered by html-to-image)
const HIGHLIGHT_BORDER_COLORS: Record<string, string> = {
  "設定1": "#1e293b",
  "設定2": "#075985",
  "設定3": "#713f12",
  "設定4": "#14532d",
  "設定5": "#7f1d1d",
  "設定6": "#3b0764",
  "default": "#1f2937",
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

  const BAR_HEIGHT = '1.5rem';

  return (
    <div
      className={`w-full ${heightClass} flex rounded shadow mb-1 relative overflow-hidden`}
      style={{ height: BAR_HEIGHT, overflow: 'hidden' }}
      data-bar-container="true"
    >
      {sortedProbabilities.map(([name, probability]) => {
        const percentage = ((probability as number) * 100).toFixed(1);
        const pct = (probability as number) * 100;
        const segmentWidth = `${Math.max(0.1, pct)}%`;
        const bgColor = SHARED_SETTING_COLORS[name] || SHARED_SETTING_COLORS["default"];
        const textColor = SHARED_TEXT_COLORS[name] || SHARED_TEXT_COLORS["default"];
        const isHighest = (probability as number) === maxProbability && (probability as number) > 0.0001;
        const borderColor = HIGHLIGHT_BORDER_COLORS[name] || HIGHLIGHT_BORDER_COLORS["default"];
        const borderWidth = isOverallResult ? '3px' : '2px';

        return (
          <div
            key={name}
            className={`overflow-hidden ${bgColor} transition-all duration-700 ease-out`}
            style={{
              width: segmentWidth,
              height: BAR_HEIGHT,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
            title={`${name}: ${percentage}%`}
            role="progressbar"
            aria-valuenow={parseFloat(percentage)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${name} probability: ${percentage}%`}
          >
            {isHighest && (
              <div style={{ position: 'absolute', inset: 0, border: `${borderWidth} solid ${borderColor}`, zIndex: 10, pointerEvents: 'none' }} />
            )}
            {pct >= 6 && (
              <span
                className={`text-xs font-medium ${textColor} whitespace-nowrap px-1`}
                style={{ lineHeight: 1, display: 'block', position: 'relative', zIndex: 11 }}
              >
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