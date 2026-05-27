
// components/results/MonkeyTurnVScenarioResultsDisplay.tsx
import React from 'react';
import type { MonkeyTurnVScenarioProbabilities } from '../../types';
import { 
  ScenarioName as MonkeyTurnScenarioName, 
  ScenarioData as MonkeyTurnScenarioData,
  MTV_SCENARIO_NAMES // Import MTV_SCENARIO_NAMES
} from '../../constants/monkeyTurnVConstants';

interface MonkeyTurnVScenarioResultsDisplayProps {
  scenarioProbabilities: MonkeyTurnVScenarioProbabilities;
  scenarioDisplayNames: string[]; // e.g., MTV_SCENARIO_NAMES
  monkeyTurnScenariosData?: Record<MonkeyTurnScenarioName, MonkeyTurnScenarioData>;
}

// シナリオ名と画像パスのマッピング
// User provided filenames (in order, matching MTV_SCENARIO_NAMES)
const scenarioBaseFilenames = [
  "kakedashi", "osozaki", "kantogamashi", "derbyking", "tsukemaikousha",
  "gambler", "kouitenn", "douguchi_special", "keikai_heroine",
  "ippansen_no_oni", "aichi_no_kyojin", "saikyo_b2", "gyakugeki_no_teio", "teio"
];

// Dynamically create the scenarioImageMap
const scenarioImageMap: Partial<Record<MonkeyTurnScenarioName, string>> = {};
MTV_SCENARIO_NAMES.forEach((scenarioEnum, index) => {
  if (index < scenarioBaseFilenames.length) {
    scenarioImageMap[scenarioEnum] = `./zz_image/scenario/${index + 1}_${scenarioBaseFilenames[index]}.png`;
  }
});


const getRoundContinuationEmoji = (rate: number): string => {
  const percentage = Math.round(rate * 100); 
  if (percentage === 100) return '🟪';
  if (percentage === 80) return '🟥';
  if (percentage === 66) return '🟩';
  if (percentage === 50) return '🟨';
  if (percentage === 25) return '🟦';
  if (percentage === 10 || percentage === 2) return '⬜';
  return ' '; 
};

export const MonkeyTurnVScenarioResultsDisplay: React.FC<MonkeyTurnVScenarioResultsDisplayProps> = ({
  scenarioProbabilities,
  scenarioDisplayNames,
  monkeyTurnScenariosData
}) => {
  const filteredProbabilities = Object.entries(scenarioProbabilities)
    // Fix: Cast `probability` to number as Object.entries may return `unknown` values.
    .filter(([, probability]) => (probability as number) > 0) // Filter out scenarios with 0 probability
    .filter(([name]) => scenarioDisplayNames.includes(name))
    .sort(([nameA], [nameB]) => scenarioDisplayNames.indexOf(nameA) - scenarioDisplayNames.indexOf(nameB));

  if (filteredProbabilities.length === 0) {
    return (
      <div className="p-3 bg-white/70 rounded-lg border border-sky-300/60 shadow-md text-center">
        <p className="text-sm text-gray-700">該当するシナリオがありません。</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
       {filteredProbabilities.map(([scenarioNameKey, probability]) => {
        // Fix: Cast `probability` to number for arithmetic operations.
        const percentage = ((probability as number) * 100).toFixed(2);
        const barWidth = Math.max(0.5, (probability as number) * 100); 
        let barColor = 'bg-indigo-500'; 
        // Fix: Cast `probability` to number for comparisons.
        if ((probability as number) > 0.5) barColor = 'bg-pink-500';
        else if ((probability as number) > 0.25) barColor = 'bg-sky-500';
        else if ((probability as number) > 0.1) barColor = 'bg-yellow-400';

        const mtvScenarioKey = scenarioNameKey as MonkeyTurnScenarioName;
        const imageUrl = scenarioImageMap[mtvScenarioKey];
        
        let scenarioDisplayNamePart = scenarioNameKey;
        let emojiStringPart = "";

        if (!imageUrl && monkeyTurnScenariosData) {
            const scenarioDetail = monkeyTurnScenariosData[mtvScenarioKey];
            if (scenarioDetail?.lampRoundData) {
                const rounds = [1, 2, 3, 4, 5, 6, 7, 8];
                emojiStringPart = rounds.map(r => {
                    const rate = scenarioDetail.lampRoundData[r];
                    return rate !== undefined ? getRoundContinuationEmoji(rate) : ' '; 
                }).join('');
            }
        }

        return (
          <div key={scenarioNameKey} className="p-3 bg-white/70 rounded-lg border border-sky-300/60 shadow-md">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center flex-grow mr-1 min-w-0"> {/* min-w-0 for flex child truncation */}
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={scenarioNameKey} 
                    className="h-6 sm:h-7 object-contain mr-2 flex-shrink-0" 
                    loading="lazy"
                  />
                ) : (
                  <>
                    <span className="text-xs sm:text-sm font-medium text-gray-800 min-w-[7rem] sm:min-w-[8.5rem] flex-shrink-0 truncate" title={scenarioDisplayNamePart}>
                        {scenarioDisplayNamePart}
                    </span>
                    {emojiStringPart && (
                         <span className="text-xs sm:text-sm font-mono tracking-tight ml-1 sm:ml-2 truncate">
                            {emojiStringPart}
                        </span>
                    )}
                  </>
                )}
              </div>
              <span className="text-xs sm:text-sm font-bold text-pink-600 flex-shrink-0">
                  {percentage}%
              </span>
            </div>
            <div className="w-full bg-sky-200/70 rounded-full h-2 sm:h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                style={{ width: `${barWidth}%` }}
                role="progressbar"
                aria-valuenow={parseFloat(percentage)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${scenarioNameKey} probability: ${percentage}%`}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
MonkeyTurnVScenarioResultsDisplay.displayName = 'MonkeyTurnVScenarioResultsDisplay';