// components/inputs/MonkeyTurnVInputSection.tsx
import React, { useState } from 'react';
import type { MonkeyTurnVSetInput, MonkeyTurnVSettingInput } from '../../types';
import {
  CharacterName as MonkeyTurnCharacterName,
  LampColor as MonkeyTurnLampColor,
  RivalMode as MonkeyTurnRivalMode,
  CHARACTERS as MONKEY_TURN_CHARACTERS,
  LAMP_COLORS as MONKEY_TURN_LAMP_COLORS,
  characterImageMap,
  MONKEY_TURN_V_SETTINGS_NAMES,
} from '../../constants/monkeyTurnVConstants';
import { CompactNumberInput } from '../common/CompactNumberInput';
// InputCard will be used if layout requires it, but for now, base classes are directly applied.

interface MonkeyTurnVInputSectionProps {
  scenarioInputs: MonkeyTurnVSetInput[]; 
  settingInputs: MonkeyTurnVSettingInput; 
  rivalMode: MonkeyTurnRivalMode;
  onScenarioInputChange: (round: number, field: keyof Omit<MonkeyTurnVSetInput, 'round'>, value: string | null) => void; 
  onSettingInputChange: (field: keyof MonkeyTurnVSettingInput, value: number) => void; 
  onRivalModeChange: (newMode: MonkeyTurnRivalMode) => void;
  selectedSettings: string[];
  onSelectedSettingsChange: (setting: string) => void;
  onCalculateSettingsClick: () => void;
  onResetSettingInputsClick: () => void;
  onResetScenarioInputsClick: () => void;
}

export const MonkeyTurnVInputSection: React.FC<MonkeyTurnVInputSectionProps> = ({
  scenarioInputs,
  settingInputs,
  rivalMode,
  onScenarioInputChange,
  onSettingInputChange,
  onRivalModeChange,
  selectedSettings,
  onSelectedSettingsChange,
  onCalculateSettingsClick,
  onResetSettingInputsClick,
  onResetScenarioInputsClick,
}) => {
  const settingButtonColors: Record<string, { active: string; inactive: string }> = {
    '設定1': { active: 'bg-slate-400 text-white', inactive: 'bg-slate-100 text-slate-400 border border-slate-300' },
    '設定2': { active: 'bg-sky-400 text-white',   inactive: 'bg-sky-50 text-sky-300 border border-sky-200' },
    '設定4': { active: 'bg-green-400 text-white',  inactive: 'bg-green-50 text-green-300 border border-green-200' },
    '設定5': { active: 'bg-red-400 text-white',    inactive: 'bg-red-50 text-red-300 border border-red-200' },
    '設定6': { active: 'bg-purple-400 text-white', inactive: 'bg-purple-50 text-purple-300 border border-purple-200' },
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTargetRound, setModalTargetRound] = useState<number | null>(null);

  const handleOpenModal = (round: number) => {
    setModalTargetRound(round);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalTargetRound(null);
  };

  const handleSelectCharacter = (character: MonkeyTurnCharacterName | null) => {
    if (modalTargetRound !== null) { // Ensure modalTargetRound is not null
      onScenarioInputChange(modalTargetRound, 'startScreen', character);
    }
    handleCloseModal();
  };

  const rivalModeOptions = [{value: MonkeyTurnRivalMode.NOT_PRESENT, label: "非滞在"}, {value: MonkeyTurnRivalMode.PRESENT, label: "滞在中🚤"}];
  const commonLabelClassSmall = "text-[10px] sm:text-xs font-medium text-gray-600 mr-0.5 whitespace-nowrap";
  const smallResetButtonClass = "ml-2 text-xs px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-400";
  const cardBaseClasses = `p-2.5 rounded-lg border border-sky-300/60 shadow-md bg-white`;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2 border-b border-sky-600/20 pb-1">
          <h3 className="text-sm font-semibold text-sky-700">
            入力設定1（設定推測用）
          </h3>
          <button
            onClick={onResetSettingInputsClick}
            className={smallResetButtonClass}
            aria-label="入力設定1をリセット"
            title="入力設定1をリセット"
          >
            リセット
          </button>
        </div>
        <div className={cardBaseClasses}>
          <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-2">
            <CompactNumberInput
              id="mtvGamesPlayed"
              visualLabel="G数"
              value={settingInputs.gamesPlayed}
              onChange={(val) => onSettingInputChange('gamesPlayed', val)}
              placeholder="0"
              inputClassName="w-14 sm:w-16" 
              labelClassName={commonLabelClassSmall}
            />
            <CompactNumberInput
              id="mtvCoin5Count"
              visualLabel="5枚役"
              value={settingInputs.coin5Count}
              onChange={(val) => onSettingInputChange('coin5Count', val)}
              placeholder="0"
              inputClassName="w-10 sm:w-12" 
              labelClassName={commonLabelClassSmall}
            />
            <CompactNumberInput
              id="mtvOchiCount"
              visualLabel="落ち"
              value={settingInputs.ochiCount}
              onChange={(val) => onSettingInputChange('ochiCount', val)}
              placeholder="0"
              inputClassName="w-8 sm:w-10" 
              labelClassName={commonLabelClassSmall}
            />
            <CompactNumberInput
              id="mtvKehaiCount"
              visualLabel="気配"
              value={settingInputs.kehaiCount}
              onChange={(val) => onSettingInputChange('kehaiCount', val)}
              placeholder="0"
              inputClassName="w-8 sm:w-10" 
              labelClassName={commonLabelClassSmall}
            />
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] sm:text-xs font-medium text-gray-500 whitespace-nowrap">設定絞り込み:</span>
          {MONKEY_TURN_V_SETTINGS_NAMES.map(setting => {
            const isSelected = selectedSettings.includes(setting);
            const colors = settingButtonColors[setting] ?? { active: 'bg-gray-400 text-white', inactive: 'bg-gray-100 text-gray-400 border border-gray-300' };
            return (
              <button
                key={setting}
                onClick={() => onSelectedSettingsChange(setting)}
                className={`text-xs px-2 py-0.5 rounded font-medium transition-all ${isSelected ? colors.active : colors.inactive}`}
                title={isSelected ? `${setting}を除外` : `${setting}を対象に追加`}
              >
                {setting}
              </button>
            );
          })}
        </div>
        <div className="mt-3">
          <button
            onClick={onCalculateSettingsClick}
            className="w-full px-6 py-2.5 sm:px-7 sm:py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold rounded-lg shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-opacity-70 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 text-sm sm:text-base"
            aria-label="設定を推測する (Predict Settings)"
          >
            設定を推測する
          </button>
        </div>
      </div>

      <div>
          <div className="flex justify-between items-center mb-2 border-b border-sky-600/20 pb-1">
          <h3 className="text-sm font-semibold text-sky-700">
            入力設定2（シナリオ推測用）
          </h3>
          <button
            onClick={onResetScenarioInputsClick}
            className={smallResetButtonClass}
            aria-label="入力設定2をリセット"
            title="入力設定2をリセット"
          >
            リセット
          </button>
        </div>
        <div className={`mb-3 flex items-center space-x-2 p-2.5 rounded-lg border border-sky-300/60 shadow-md bg-white`}>
          <label htmlFor="rivalMode" className="text-sm font-medium text-gray-700 whitespace-nowrap">ライバルモード洞口</label>
          <select id="rivalMode" name="rivalMode" value={rivalMode} onChange={(e) => onRivalModeChange(e.target.value as MonkeyTurnRivalMode)} className="flex-grow p-2 bg-white border border-sky-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-gray-800 text-xs sm:text-sm appearance-none" aria-label="ライバルモード選択">
            {rivalModeOptions.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}
          </select>
        </div>
        <h4 className="text-xs font-medium mb-1.5 text-gray-600">ラウンド開始画面とランプの色</h4>
        <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4">
          {[0, 1].map(col => (
            <div key={`col-${col}`} className="space-y-3 sm:space-y-4">
              {scenarioInputs.slice(col * 4, (col + 1) * 4).map((setInput) => (
                <div key={setInput.round} className={cardBaseClasses}>
                  <p className="font-semibold text-blue-600 mb-1.5 text-center text-xs sm:text-sm">ROUND {setInput.round.toString().padStart(2, '0')}</p>
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center justify-between space-x-1 sm:space-x-2">
                      <label htmlFor={`startScreenBtn-${setInput.round}`} className="text-xs font-medium text-gray-600 whitespace-nowrap">画面</label>
                      <button
                        id={`startScreenBtn-${setInput.round}`}
                        onClick={() => handleOpenModal(setInput.round)}
                        className="flex-grow p-1.5 bg-white border border-sky-300 rounded-md shadow-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-gray-700 text-xs text-left flex items-center justify-between"
                        aria-label={`ROUND ${setInput.round.toString().padStart(2, '0')} 画面選択`}
                      >
                        {setInput.startScreen && characterImageMap[setInput.startScreen] ? (
                          <>
                            <span className="truncate mr-1">{setInput.startScreen}</span>
                            <img
                              src={characterImageMap[setInput.startScreen]}
                              alt={setInput.startScreen}
                              className="h-4 w-auto sm:h-5 object-contain rounded-sm flex-shrink-0"
                              loading="lazy"
                            />
                          </>
                        ) : setInput.startScreen ? (
                          <span className="truncate">{setInput.startScreen}</span>
                        ) : (
                          "選択なし"
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between space-x-1 sm:space-x-2">
                      <label htmlFor={`lampColor-${setInput.round}`} className="text-xs font-medium text-gray-600 whitespace-nowrap">色</label>
                      <select id={`lampColor-${setInput.round}`} value={setInput.lampColor || ''} onChange={(e) => onScenarioInputChange(setInput.round, 'lampColor', e.target.value || null)} disabled={setInput.round === 8} className={`flex-grow p-1.5 bg-white border border-sky-300 rounded-md shadow-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-gray-700 text-xs appearance-none ${setInput.round === 8 ? 'disabled:bg-slate-200 disabled:text-slate-500 cursor-not-allowed' : ''}`} aria-label={`ROUND${setInput.round.toString().padStart(2, '0')} 色選択`}>
                        <option value="">選択なし</option>
                        {MONKEY_TURN_LAMP_COLORS.map(color => (<option key={color} value={color}>{color}</option>))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && modalTargetRound !== null && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" 
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`modal-title-round-${modalTargetRound}`}
        >
          <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-sm max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <h3 id={`modal-title-round-${modalTargetRound}`} className="text-base sm:text-lg font-semibold text-sky-700 mb-3 flex-shrink-0">
              ROUND {modalTargetRound} 開始画面選択
            </h3>
            <div className="overflow-y-auto custom-scroll flex-grow mb-3">
              <div className="grid grid-cols-3 gap-2">
                {MONKEY_TURN_CHARACTERS.map(char => {
                  const imageSrc = characterImageMap[char];
                  const isSelected = scenarioInputs.find(inp => inp.round === modalTargetRound)?.startScreen === char;
                  
                  return (
                    <button
                      key={char}
                      onClick={() => handleSelectCharacter(char)}
                      className={`
                        p-1 sm:p-1.5 rounded-md transition-colors duration-150 ease-in-out
                        flex flex-col items-center justify-center 
                        h-16 sm:h-20 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75
                        ${isSelected 
                            ? 'bg-sky-500 text-white font-semibold border-2 border-sky-700' 
                            : 'bg-slate-50 hover:bg-sky-100 text-gray-700 border border-slate-300 hover:border-sky-300'
                        }
                      `}
                      aria-pressed={isSelected}
                      title={char}
                    >
                      {imageSrc ? (
                        <>
                          <img 
                            src={imageSrc} 
                            alt={char} 
                            className="w-auto h-9 sm:h-11 object-contain mb-0.5 rounded"
                            loading="lazy"
                          />
                          <span className="block font-medium text-xs sm:text-sm leading-tight truncate w-full text-center mt-0.5">{char}</span>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <span className="block font-medium text-xs sm:text-sm leading-tight truncate w-full text-center">{char}</span>
                          </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <button
                onClick={() => handleSelectCharacter(null)}
                className="w-full px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-md shadow-sm transition-colors duration-150 ease-in-out text-sm"
                aria-label="選択をクリア"
              >
                選択なし
              </button>
              <button
                onClick={handleCloseModal}
                className="w-full px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md shadow-md transition-colors duration-150 ease-in-out text-sm"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
MonkeyTurnVInputSection.displayName = 'MonkeyTurnVInputSection';
