// components/ReferenceTables.tsx
import React, { useState } from 'react';
import { 
  ScenarioName as MonkeyTurnScenarioName, 
  CharacterName as MonkeyTurnCharacterName, 
  ScenarioData as MonkeyTurnScenarioData, 
  ROUND08_CONFIRMING_CHARACTER, 
  BLUE_BACKGROUND_R8_CHARS,
  MTV_SCENARIO_NAMES // Use the renamed constant
} from '../constants/monkeyTurnVConstants';
import { GameMode } from '../types';

interface ReferenceTablesProps {
  gameMode: GameMode; // To decide whether to render
  monkeyTurnScenariosData?: Record<MonkeyTurnScenarioName, MonkeyTurnScenarioData>;
  monkeyTurnScenarioNames?: MonkeyTurnScenarioName[]; // This will be MTV_SCENARIO_NAMES from App.tsx
  monkeyTurnCharacters?: MonkeyTurnCharacterName[];
}

const getContinuationRateCellStyle = (rate: number): string => {
  const percentage = rate * 100;
  if (percentage === 100) return 'bg-purple-100 text-purple-700 font-semibold';
  if (percentage >= 80) return 'bg-red-100 text-red-700';
  if (percentage >= 66) return 'bg-green-100 text-green-700';
  if (percentage >= 50) return 'bg-yellow-100 text-yellow-700';
  if (percentage >= 25) return 'bg-blue-100 text-blue-700';
  return 'bg-gray-100 text-gray-700';
};

const getScenarioNameCellStyle = (scenarioName: MonkeyTurnScenarioName): string => {
  // Check for emoji prefix to determine style
  if (scenarioName.startsWith("🔵")) return getContinuationRateCellStyle(0.25); // Blue emoji
  if (scenarioName.startsWith("🟡")) return getContinuationRateCellStyle(0.50); // Yellow emoji
  if (scenarioName.startsWith("🟢")) return getContinuationRateCellStyle(0.66); // Green emoji
  if (scenarioName.startsWith("🔴")) return getContinuationRateCellStyle(0.80); // Red emoji
  if (scenarioName.startsWith("⚫")) return getContinuationRateCellStyle(1.00); // Black emoji (for Teio)
  return 'bg-white text-gray-700'; // Default fallback
};

const truncateDisplayName = (fullName: string, textLength: number = 4): string => {
  const emojiMatch = fullName.match(/^([^\p{L}\p{N}\s]+)/u); 
  let emojiPrefix = "";
  let namePart = fullName;

  if (emojiMatch) {
    emojiPrefix = emojiMatch[0];
    namePart = fullName.substring(emojiPrefix.length);
  }

  if (namePart.length > textLength) {
    namePart = namePart.substring(0, textLength);
  }

  return emojiPrefix + namePart;
};

const getCharacterRateCellStyle = (
  rate?: number,
  characterName?: MonkeyTurnCharacterName,
  scenarioName?: MonkeyTurnScenarioName
): string => {
  let baseStyle = '';
  if (rate === undefined || rate === null || rate <= 0) {
    baseStyle = 'bg-gray-100 text-gray-400';
  } else if (rate >= 0.3) {
    baseStyle = 'bg-sky-600 text-white font-semibold';
  } else if (rate >= 0.2) {
    baseStyle = 'bg-sky-500 text-white';
  } else if (rate >= 0.1) {
    baseStyle = 'bg-sky-400 text-sky-900';
  } else if (rate > 0.05) {
    baseStyle = 'bg-sky-300 text-sky-800';
  } else if (rate > 0) {
    baseStyle = 'bg-sky-200 text-sky-700';
  } else {
    baseStyle = 'bg-gray-100 text-gray-400'; 
  }

  let highlightStyle = '';
  if (characterName && scenarioName) {
    const confirmRule = ROUND08_CONFIRMING_CHARACTER[scenarioName];
    let isConfirming = false;

    if (confirmRule) {
      if (confirmRule === "ANY_BLUE_BG") {
        if (BLUE_BACKGROUND_R8_CHARS.includes(characterName)) {
          isConfirming = true;
        }
      } else if (Array.isArray(confirmRule)) {
        if (confirmRule.includes(characterName)) {
          isConfirming = true;
        }
      } else { 
        if (characterName === confirmRule) {
          isConfirming = true;
        }
      }
    }

    if (isConfirming) {
      highlightStyle = 'font-bold underline';
    }
  }

  return `${baseStyle} ${highlightStyle}`.trim();
};


export const ReferenceTables: React.FC<ReferenceTablesProps> = ({
  gameMode,
  monkeyTurnScenariosData,
  monkeyTurnScenarioNames = MTV_SCENARIO_NAMES,
  monkeyTurnCharacters
}) => {
  const [showRoundTable, setShowRoundTable] = useState(false);

  if (gameMode !== GameMode.MONKEY_TURN_V || !monkeyTurnScenariosData || !monkeyTurnCharacters) {
    return null;
  }

  const rounds = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="mt-6 md:mt-8 space-y-6 md:space-y-8">
      {/* Table 1: Scenario Continuation Rates per Round (collapsed by default) */}
      <div className="p-3 sm:p-4 bg-sky-50 rounded-xl shadow-lg border border-sky-200">
        <div className="flex justify-between items-center border-b-2 border-sky-600/30 pb-2 mb-1">
          <h2 className="text-base sm:text-lg font-semibold text-sky-600">
            シナリオ別 ラウンド毎継続期待度
          </h2>
          <button
            onClick={() => setShowRoundTable(prev => !prev)}
            className="text-xs px-2.5 py-1 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded border border-sky-300 focus:outline-none"
          >
            {showRoundTable ? '非表示' : '表示する'}
          </button>
        </div>
        {showRoundTable && <div className="overflow-x-auto custom-scroll pb-2">
          <table className="min-w-full w-max text-xs border-collapse">
            <thead>
              <tr className="bg-sky-100">
                <th scope="col" className="sticky left-0 z-10 bg-sky-100 p-1 sm:p-1.5 font-semibold border border-sky-300 text-left whitespace-nowrap text-xs sm:text-sm">シナリオ</th>
                {rounds.map(round => (
                  <th scope="col" key={`header-round-${round}`} className="p-1 sm:p-1.5 font-semibold border border-sky-300 text-center whitespace-nowrap text-xs min-w-[30px] sm:min-w-[35px]">
                    R{round}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monkeyTurnScenarioNames.map((scenarioName) => (
                <tr key={scenarioName}>
                  <td 
                    scope="row" 
                    className={`sticky left-0 z-10 p-1 sm:p-1.5 border border-sky-300 whitespace-nowrap font-medium text-xs sm:text-sm ${getScenarioNameCellStyle(scenarioName)}`}
                  >
                    {truncateDisplayName(scenarioName, 4)}
                  </td>
                  {rounds.map(round => {
                    const rate = monkeyTurnScenariosData[scenarioName]?.lampRoundData?.[round];
                    // Alternate row background for data cells, but not for the first (scenario name) cell
                    const dataCellAlternatingBg = monkeyTurnScenarioNames.indexOf(scenarioName) % 2 === 0 ? 'bg-white' : 'bg-sky-50/50';
                    return (
                      <td key={`${scenarioName}-round-${round}`} className={`p-1 sm:p-1.5 border border-sky-300 text-center text-xs ${rate !== undefined ? getContinuationRateCellStyle(rate) : `${dataCellAlternatingBg} text-gray-500`}`}>
                        {rate !== undefined ? `${(rate * 100).toFixed(0)}%` : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </div>

      {/* Table 2: Character Appearance Rates per Scenario */}
      <div className="p-3 sm:p-4 bg-sky-50 rounded-xl shadow-lg border border-sky-200">
        <h2 className="text-base sm:text-lg font-semibold mb-3 text-sky-600 border-b-2 border-sky-600/30 pb-2">
          開始画面キャラ別 シナリオ選択期待度 (R1-R7)
        </h2>
        <div className="overflow-x-auto custom-scroll pb-2">
          <table className="min-w-full w-max text-xs border-collapse">
            <thead>
              <tr className="bg-sky-100">
                <th scope="col" className="sticky top-0 left-0 z-20 bg-sky-100 p-1 sm:p-1.5 font-semibold border border-sky-300 text-left whitespace-nowrap text-xs sm:text-sm">開始画面</th>
                {monkeyTurnScenarioNames.map(scenarioName => (
                  <th
                    scope="col"
                    key={`header-char-${scenarioName}`}
                    className="sticky top-0 z-10 bg-sky-100 font-semibold border border-sky-300 text-center"
                    style={{
                      writingMode: 'vertical-rl', textOrientation: 'mixed', whiteSpace: 'nowrap',
                      minWidth: '28px', maxWidth: '34px', minHeight: '160px',
                      padding: '5px 1px', fontSize: '9.5px', lineHeight: '1.2',
                      textAlign: 'center', verticalAlign: 'middle',
                    }}
                  >
                    {truncateDisplayName(scenarioName, 4)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monkeyTurnCharacters.map((characterName, rowIndex) => (
                <tr key={characterName} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-sky-50/50'}>
                  <td scope="row" className="sticky left-0 z-10 p-1 sm:p-1.5 border border-sky-300 whitespace-nowrap font-medium text-gray-700 text-xs sm:text-sm" style={{ backgroundColor: rowIndex % 2 === 0 ? '#FFFFFF' : '#F0F9FFCC' }}>
                    {truncateDisplayName(characterName, 5)}
                  </td>
                  {monkeyTurnScenarioNames.map(scenarioNameKey => {
                    const rate = monkeyTurnScenariosData[scenarioNameKey]?.characterAppearanceRates?.[characterName];
                    const displayRate = rate !== undefined && rate > 0 ? `${(rate * 100).toFixed(1)}` : '-';
                    return (
                      <td
                        key={`${characterName}-${scenarioNameKey}`}
                        className={`p-1 border border-sky-300 text-center text-xs ${getCharacterRateCellStyle(rate, characterName, scenarioNameKey)}`}
                      >
                        {displayRate}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};