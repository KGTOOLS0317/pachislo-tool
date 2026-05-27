// components/inputs/GenericSettingInputSection.tsx
import React, { useState } from 'react';
import type { KingHanaHanaSInput, HanaHanaHououInput, MyJugglerVInput, DragonHanaHanaSenkouInput, StarHanaHanaInput, HappyJugglerInput } from '../../types';
import { GameMode, KingHanaHanaSideLampColor } from '../../types';
import { CompactNumberInput } from '../common/CompactNumberInput';

interface GenericSettingInputSectionProps {
  gameMode: GameMode;
  inputs: KingHanaHanaSInput | HanaHanaHououInput | MyJugglerVInput | DragonHanaHanaSenkouInput | StarHanaHanaInput;
  onInputChange: (field: string, value: any) => void;
}

export const GenericSettingInputSection: React.FC<GenericSettingInputSectionProps> = ({
  gameMode,
  inputs,
  onInputChange,
}) => {
  const [showStartInputs, setShowStartInputs] = useState(false);

  const isMyJuggler = gameMode === GameMode.MY_JUGGLER_V;
  const isImJuggler = gameMode === GameMode.IM_JUGGLER_EX;
  const isGogoJuggler = gameMode === GameMode.GOGO_JUGGLER_3;
  const isFunkyJuggler = gameMode === GameMode.FUNKY_JUGGLER;
  const isHappyJuggler = gameMode === GameMode.HAPPY_JUGGLER;
  const isJugglerSeries = isMyJuggler || isImJuggler || isGogoJuggler || isFunkyJuggler || isHappyJuggler;

  const isKingHanaSOrHououOrDragonOrStar = 
    gameMode === GameMode.KING_HANA_HANA_S || 
    gameMode === GameMode.HANA_HANA_HOUOU ||
    gameMode === GameMode.DRAGON_HANA_HANA_SENKOU ||
    gameMode === GameMode.STAR_HANA_HANA;

  const jugglerInputs = isJugglerSeries ? (inputs as MyJugglerVInput) : undefined;
  const happyInputs = isHappyJuggler ? (inputs as HappyJugglerInput) : undefined;
  const allHanaInputs = isKingHanaSOrHououOrDragonOrStar ? (inputs as KingHanaHanaSInput) : undefined;
  const baseHanaInputs = inputs as KingHanaHanaSInput; 

  const commonLabelClass = "text-[10px] sm:text-xs font-medium text-gray-700 mr-0.5 whitespace-nowrap";
  const sectionTitleClass = "text-sm font-medium text-gray-700"; 
  const wideInputClass = "w-10 sm:w-12"; 
  const netMedalsInputClass = "w-14 sm:w-16"; 

  const lampColorFields = [
      { label: "🔵", fieldSuffix: "BlueCount", colorEnum: KingHanaHanaSideLampColor.BLUE},
      { label: "🟡", fieldSuffix: "YellowCount", colorEnum: KingHanaHanaSideLampColor.YELLOW},
      { label: "🟢", fieldSuffix: "GreenCount", colorEnum: KingHanaHanaSideLampColor.GREEN},
      { label: "🔴", fieldSuffix: "RedCount", colorEnum: KingHanaHanaSideLampColor.RED},
      { label: "🌈", fieldSuffix: "RainbowCount", colorEnum: KingHanaHanaSideLampColor.RAINBOW},
  ];
  
  const lampSections = [
      { title: "REG中サイドランプ✨", typePrefix: "regDuringSideLamp" },
      { title: "BIG後フェザーランプ🪽", typePrefix: "bigAfterSideLamp" },
      { title: "REG後フェザーランプ🪽", typePrefix: "regAfterSideLamp" },
  ];

  const cardContentClassBase = "p-2 rounded-md shadow-sm border border-gray-200 bg-white"; 

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between mb-1">
           <h4 className={`${sectionTitleClass}`}>
            開始時のデータ
          </h4>
          <button onClick={() => setShowStartInputs(!showStartInputs)} className="ml-2 text-xs px-2 py-0.5 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400" aria-expanded={showStartInputs} aria-controls="generic-start-inputs">
            {showStartInputs ? '閉じる' : '入力'}
          </button>
        </div>
        {showStartInputs && (
          <div id="generic-start-inputs" className={cardContentClassBase}>
            <div className="flex items-center justify-start space-x-1 flex-wrap gap-y-1">
              <CompactNumberInput id="startTotalGames" visualLabel="G数" value={baseHanaInputs.startTotalGames} onChange={(val) => onInputChange('startTotalGames', val)} placeholder="0" inputClassName="w-14 sm:w-16" labelClassName={commonLabelClass} min={0}/>
              <CompactNumberInput id="startBigCount" visualLabel="BIG" value={baseHanaInputs.startBigCount} onChange={(val) => onInputChange('startBigCount', val)} placeholder="0" inputClassName="w-8 sm:w-10" labelClassName={commonLabelClass} min={0}/>
              <CompactNumberInput id="startRegCount" visualLabel="REG" value={baseHanaInputs.startRegCount} onChange={(val) => onInputChange('startRegCount', val)} placeholder="0" inputClassName="w-8 sm:w-10" labelClassName={commonLabelClass} min={0}/>
              <CompactNumberInput id="startNetMedals" visualLabel="差枚" value={baseHanaInputs.startNetMedals} onChange={(val) => onInputChange('startNetMedals', val)} placeholder="0" inputClassName="w-14 sm:w-16" labelClassName={commonLabelClass} inputMode="text" />
            </div>
          </div>
        )}
      </div>
      <div>
          <h4 className={`${sectionTitleClass} mb-1`}>現在のデータ</h4>
          <div className={cardContentClassBase}>
              <div className="flex items-center justify-start space-x-1 flex-wrap gap-y-1">
                  <CompactNumberInput id="currentTotalGames" visualLabel="G数" value={baseHanaInputs.currentTotalGames} onChange={(val) => onInputChange('currentTotalGames', val)} placeholder="0" inputClassName="w-14 sm:w-16" labelClassName={commonLabelClass} min={0}/>
                  <CompactNumberInput id="currentBigCount" visualLabel="BIG" value={baseHanaInputs.currentBigCount} onChange={(val) => onInputChange('currentBigCount', val)} placeholder="0" inputClassName="w-8 sm:w-10" labelClassName={commonLabelClass} min={0}/>
                  <CompactNumberInput id="currentRegCount" visualLabel="REG" value={baseHanaInputs.currentRegCount} onChange={(val) => onInputChange('currentRegCount', val)} placeholder="0" inputClassName="w-8 sm:w-10" labelClassName={commonLabelClass} min={0}/>
                  <CompactNumberInput id="currentNetMedals" visualLabel="差枚" value={baseHanaInputs.currentNetMedals} onChange={(val) => onInputChange('currentNetMedals', val)} placeholder="0" inputClassName={netMedalsInputClass} labelClassName={commonLabelClass} inputMode="text" />
              </div>
          </div>
      </div>
      <div>
          <h4 className={`${sectionTitleClass} mb-1`}>小役</h4>
          <div className={cardContentClassBase}>
            <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-2">
              <div>
                <CompactNumberInput 
                  id={"bellCount"} 
                  visualLabel={isJugglerSeries ? "🍇" : "🔔"} 
                  value={baseHanaInputs.bellCount} 
                  onChange={(val) => onInputChange('bellCount', val)} 
                  placeholder="0" 
                  inputClassName="w-10 sm:w-12" 
                  labelClassName={`${commonLabelClass} text-sm sm:text-base`}
                  min={0}
                />
              </div>
              {isHappyJuggler && happyInputs && (
                <>
                  <div>
                    <CompactNumberInput 
                      id="nonDuplicateCherryCount_happy"
                      visualLabel="非重🍒" 
                      value={happyInputs.nonDuplicateCherryCount}
                      onChange={(val) => onInputChange('nonDuplicateCherryCount', val)}
                      placeholder="0" 
                      inputClassName="w-10 sm:w-12" 
                      labelClassName={`${commonLabelClass} text-sm sm:text-base`}
                      min={0}
                    />
                  </div>
                  <div>
                    <CompactNumberInput 
                      id="clownCount"
                      visualLabel="🤡" 
                      value={happyInputs.clownCount}
                      onChange={(val) => onInputChange('clownCount', val)}
                      placeholder="0" 
                      inputClassName="w-10 sm:w-12" 
                      labelClassName={`${commonLabelClass} text-sm sm:text-base`}
                      min={0}
                    />
                  </div>
                  <div>
                    <CompactNumberInput 
                      id="bellCount_actual"
                      visualLabel="🔔" 
                      value={happyInputs.happyBellCount}
                      onChange={(val) => onInputChange('happyBellCount', val)}
                      placeholder="0" 
                      inputClassName="w-10 sm:w-12" 
                      labelClassName={`${commonLabelClass} text-sm sm:text-base`}
                      min={0}
                    />
                  </div>
                </>
              )}
              {isJugglerSeries && !isFunkyJuggler && !isHappyJuggler && jugglerInputs && (
                <div>
                  <CompactNumberInput 
                    id="nonDuplicateCherryCount"
                    visualLabel="非重🍒" 
                    value={jugglerInputs.nonDuplicateCherryCount}
                    onChange={(val) => onInputChange('nonDuplicateCherryCount', val)}
                    placeholder="0" 
                    inputClassName="w-10 sm:w-12" 
                    labelClassName={`${commonLabelClass} text-sm sm:text-base`}
                    min={0}
                  />
                </div>
              )}
              {isKingHanaSOrHououOrDragonOrStar && allHanaInputs && (
                <>
                  <div>
                    <CompactNumberInput id="watermelonInBigCount" visualLabel="B中🍉" value={allHanaInputs.watermelonInBigCount} onChange={(val) => onInputChange('watermelonInBigCount', val)} placeholder="0" inputClassName="w-7 sm:w-8" 
                    labelClassName={`${commonLabelClass} text-sm sm:text-base`}
                    min={0}
                    />
                  </div>
                  <div className="flex items-center">
                    <label htmlFor="retroSoundNumerator" className={`${commonLabelClass} text-base`}>🎶</label>
                    <CompactNumberInput id="retroSoundNumerator" visualLabel="" value={allHanaInputs.retroSoundNumerator} onChange={(val) => onInputChange('retroSoundNumerator', val)} placeholder="0" inputClassName="w-6" labelClassName="sr-only" min={0}/>
                    <span className="mx-0.5 text-gray-600">/</span>
                    <CompactNumberInput id="retroSoundDenominator" visualLabel="" value={allHanaInputs.retroSoundDenominator} onChange={(val) => onInputChange('retroSoundDenominator', val)} placeholder="0" inputClassName="w-8" labelClassName="sr-only" min={0}/>
                  </div>
                  <div>
                  <CompactNumberInput id="bigBlankCount" visualLabel="はずれ" value={allHanaInputs.bigBlankCount} onChange={(val) => onInputChange('bigBlankCount', val)} placeholder="0" inputClassName="w-6" 
                  labelClassName={commonLabelClass}
                  min={0}
                  />
                  </div>
                </>
              )}
            </div>
          </div>
      </div>

      {isJugglerSeries && jugglerInputs && (
        <>
          <div>
            <h4 className={`${sectionTitleClass} mb-1`}>BIG当選契機</h4>
            <div className={cardContentClassBase}>
              <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-2">
                <div>
                  <CompactNumberInput 
                    id="soloBigCount"
                    visualLabel="単独" 
                    value={jugglerInputs.soloBigCount}
                    onChange={(val) => onInputChange('soloBigCount', val)}
                    placeholder="0" 
                    inputClassName={wideInputClass} 
                    labelClassName={commonLabelClass}
                    min={0}
                  />
                </div>
                <div>
                  <CompactNumberInput 
                    id="cherryBigCount"
                    visualLabel="🍒" 
                    value={jugglerInputs.cherryBigCount}
                    onChange={(val) => onInputChange('cherryBigCount', val)}
                    placeholder="0" 
                    inputClassName={wideInputClass} 
                    labelClassName={`${commonLabelClass} text-sm`}
                    min={0}
                  />
                </div>
                {!isHappyJuggler && (
                  <div>
                    <CompactNumberInput 
                      id="rareBigCount"
                      visualLabel={isFunkyJuggler ? "レア役重複" : "レア役"} 
                      value={jugglerInputs.rareBigCount}
                      onChange={(val) => onInputChange('rareBigCount', val)}
                      placeholder="0" 
                      inputClassName={wideInputClass} 
                      labelClassName={commonLabelClass}
                      min={0}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {!isGogoJuggler && (
            <div>
              <h4 className={`${sectionTitleClass} mb-1`}>REG当選契機</h4>
              <div className={cardContentClassBase}>
                <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-2">
                  <div>
                    <CompactNumberInput 
                      id="soloRegCount"
                      visualLabel="単独" 
                      value={jugglerInputs.soloRegCount}
                      onChange={(val) => onInputChange('soloRegCount', val)}
                      placeholder="0" 
                      inputClassName={wideInputClass} 
                      labelClassName={commonLabelClass}
                      min={0}
                    />
                  </div>
                  <div>
                    <CompactNumberInput 
                      id="cherryRegCount"
                      visualLabel="🍒" 
                      value={jugglerInputs.cherryRegCount}
                      onChange={(val) => onInputChange('cherryRegCount', val)}
                      placeholder="0" 
                      inputClassName={wideInputClass} 
                      labelClassName={`${commonLabelClass} text-sm`}
                      min={0}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {isKingHanaSOrHououOrDragonOrStar && allHanaInputs && lampSections.map(section => (
          <div key={section.typePrefix} className="mt-3">
              <h4 className={`${sectionTitleClass} mb-1`}>
                {section.title}
              </h4>
              <div className={cardContentClassBase}>
                  <div className="flex flex-wrap items-center justify-start sm:justify-around gap-x-1.5 gap-y-2">
                      {lampColorFields.map(lamp => {
                          const fieldName = `${section.typePrefix}${lamp.fieldSuffix}` as keyof KingHanaHanaSInput;
                          return (
                              <CompactNumberInput
                                  key={fieldName}
                                  id={fieldName}
                                  visualLabel={lamp.label}
                                  value={allHanaInputs[fieldName] as number}
                                  onChange={(val) => onInputChange(fieldName, val)}
                                  placeholder="0"
                                  inputClassName="w-8"
                                  labelClassName={`${commonLabelClass} text-lg`} 
                                  min={0}
                              />
                          );
                      })}
                  </div>
              </div>
          </div>
      ))}
    </div>
  );
};
GenericSettingInputSection.displayName = 'GenericSettingInputSection';