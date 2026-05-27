// components/ScenarioResultsDisplay.tsx
import React, { useState } from 'react';
import type { 
  GenericProbabilities, 
  GenericResultsDisplayProps, 
  KingHanaHanaSFullResult, 
  HanaHanaHououFullResult,
  MyJugglerVFullResult,
  ImJugglerExFullResult,
  GogoJuggler3FullResult,
  FunkyJugglerFullResult,
  HappyJugglerFullResult,
  DragonHanaHanaSenkouFullResult,
  StarHanaHanaFullResult,
  NewGetterMouseFullResult,
  MonkeyTurnVSettingFullResult, 
  MonkeyTurnVScenarioProbabilities,
  MonkeyTurnVSetInput,
  KingHanaHanaSInput,
  HanaHanaHououInput,
  MyJugglerVInput,
  ImJugglerExInput,
  GogoJuggler3Input,
  FunkyJugglerInput,
  HappyJugglerInput,
  DragonHanaHanaSenkouInput,
  StarHanaHanaInput,
  NewGetterMouseInput,
  MonkeyTurnVSettingInput,
} from '../types'; 
import { GameMode } from '../types'; 
import { 
    ScenarioName as MonkeyTurnScenarioName, 
    ScenarioData as MonkeyTurnScenarioData,
    CharacterName as MonkeyTurnCharacterName,
    LampColor as MonkeyTurnLampColor,
    RivalMode as MonkeyTurnRivalMode,
    characterImageMap,
} from '../constants/monkeyTurnVConstants'; 

// Import new specific display components
import { SettingResultsDisplay } from './results/SettingResultsDisplay';
import { MonkeyTurnVScenarioResultsDisplay } from './results/MonkeyTurnVScenarioResultsDisplay';

declare const html2canvas: any;

interface ScenarioResultsDisplayPropsExtended extends GenericResultsDisplayProps {
  gameMode: GameMode;
  kingHanaHanaInputs?: KingHanaHanaSInput;
  hanaHanaHououInputs?: HanaHanaHououInput;
  myJugglerVInputs?: MyJugglerVInput;
  imJugglerExInputs?: ImJugglerExInput;
  gogoJuggler3Inputs?: GogoJuggler3Input;
  funkyJugglerInputs?: FunkyJugglerInput;
  happyJugglerInputs?: HappyJugglerInput;
  dragonHanaHanaSenkouInputs?: DragonHanaHanaSenkouInput;
  starHanaHanaInputs?: StarHanaHanaInput;
  newGetterMouseInputs?: NewGetterMouseInput;
  monkeyTurnSettingInputs?: MonkeyTurnVSettingInput;
  monkeyTurnScenariosData?: Record<MonkeyTurnScenarioName, MonkeyTurnScenarioData>; 
}

const getMonkeyTurnScenarioSummaryChar = (charName: MonkeyTurnCharacterName | null): string => {
  if (!charName) return '';
  const specialChars: Partial<Record<MonkeyTurnCharacterName, string>> = {
    [MonkeyTurnCharacterName.DOGUCHI_SR]: "父",
    [MonkeyTurnCharacterName.MONOCHROME_ENOKI]: "ノ",
    [MonkeyTurnCharacterName.HATANO_SUMI]: "♡",
  };
  return specialChars[charName] || charName.charAt(0);
};

const getMonkeyTurnScenarioSummaryLampDisplay = (lampColor: MonkeyTurnLampColor | null): string => {
  if (!lampColor) return '';
  if (lampColor === MonkeyTurnLampColor.RAINBOW) return "🌈";
  if (lampColor.length > 1) return lampColor.slice(1); 
  return lampColor; 
};

const renderMonkeyTurnScenarioInputSummaryElements = (
  inputs: MonkeyTurnVSetInput[] | undefined,
  rivalMode: MonkeyTurnRivalMode | undefined,
  imageMap: Partial<Record<MonkeyTurnCharacterName, string>>
): React.ReactElement | null => {
  if (!inputs || typeof rivalMode === 'undefined') return null;

  const summaryParts: (string | React.ReactNode)[] = [];
  summaryParts.push(rivalMode === MonkeyTurnRivalMode.PRESENT ? "洞◯" : "洞✕");

  let hasContentAfterRivalMode = false;

  inputs.forEach((input) => {
    const roundNumber = input.round;
    const character = input.startScreen;
    const lamp = input.lampColor;

    const showRoundEntry = 
      character || 
      (lamp && roundNumber !== 8) || 
      (lamp && roundNumber === 8 && lamp === MonkeyTurnLampColor.RAINBOW && character);

    if (showRoundEntry) {
      hasContentAfterRivalMode = true;
      summaryParts.push(<span key={`r${roundNumber}-prefix`} className="ml-1.5">{`R${roundNumber}`}</span>);

      if (character && imageMap[character]) {
        summaryParts.push(
          <img
            key={`r${roundNumber}-char-${character}`}
            src={imageMap[character]}
            alt={character}
            className="inline-block h-4 w-auto object-contain rounded-sm ml-0.5 align-middle"
            loading="lazy"
          />
        );
      } else if (character) {
        summaryParts.push(<span key={`r${roundNumber}-char-text-${character}`} className="ml-0.5 text-xs">{getMonkeyTurnScenarioSummaryChar(character)}</span>);
      }

      if (lamp && (roundNumber !== 8 || (roundNumber === 8 && lamp === MonkeyTurnLampColor.RAINBOW && character))) {
        summaryParts.push(<span key={`r${roundNumber}-lamp-${lamp}`} className="ml-0.5 text-xs">{getMonkeyTurnScenarioSummaryLampDisplay(lamp)}</span>);
      }
    }
  });
  
  const isDefaultScenarioInputs = inputs.every(inp => !inp.startScreen && (inp.round === 8 ? inp.lampColor === MonkeyTurnLampColor.RAINBOW : !inp.lampColor));

  if (!hasContentAfterRivalMode) {
    if (rivalMode === MonkeyTurnRivalMode.NOT_PRESENT && isDefaultScenarioInputs) {
      return null;
    }
    return (
        <p className="text-xs text-slate-600 mb-2 font-mono text-right pr-1 flex items-center justify-end flex-wrap" style={{ lineHeight: '1.6' }}>
            {summaryParts[0]}
        </p>
    );
  }

  return (
    <p className="text-xs text-slate-600 mb-2 font-mono text-right pr-1 flex items-center justify-end flex-wrap" style={{ lineHeight: '1.6' }}>
      {summaryParts.map((part, index) => (
        <React.Fragment key={index}>{part}</React.Fragment>
      ))}
    </p>
  );
};


export const ScenarioResultsDisplay = React.forwardRef<HTMLDivElement, ScenarioResultsDisplayPropsExtended>(
  ({ probabilities, names, gameMode, resultTitle, kingHanaHanaInputs, hanaHanaHououInputs, myJugglerVInputs, imJugglerExInputs, gogoJuggler3Inputs, funkyJugglerInputs, happyJugglerInputs, dragonHanaHanaSenkouInputs, starHanaHanaInputs, newGetterMouseInputs, monkeyTurnSettingInputs, monkeyTurnScenariosData, inputChangedSinceLastCalc, monkeyTurnScenarioInputs, monkeyTurnRivalMode }, ref) => {
    
    const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

    const isMonkeyTurnV = gameMode === GameMode.MONKEY_TURN_V;
    
    let settingFullResult: KingHanaHanaSFullResult | HanaHanaHououFullResult | MyJugglerVFullResult | HappyJugglerFullResult | MonkeyTurnVSettingFullResult | DragonHanaHanaSenkouFullResult | StarHanaHanaFullResult | NewGetterMouseFullResult | null = null;
    let scenarioProbabilities: MonkeyTurnVScenarioProbabilities | null = null;

    if (probabilities && 'overallProbabilities' in probabilities) { 
        settingFullResult = probabilities as KingHanaHanaSFullResult | HanaHanaHououFullResult | MyJugglerVFullResult | MonkeyTurnVSettingFullResult | DragonHanaHanaSenkouFullResult | StarHanaHanaFullResult | NewGetterMouseFullResult;
    } else if (isMonkeyTurnV && probabilities) {
        scenarioProbabilities = probabilities as MonkeyTurnVScenarioProbabilities;
    }

    const resultTitleToDisplay = resultTitle || (isMonkeyTurnV && scenarioProbabilities ? "シナリオ予測結果" : "設定推測結果");
    const showSaveButton = !!settingFullResult;

    const handleSaveImage = async () => {
      const resultsElement = ref && typeof ref !== 'function' ? ref.current : null;
      if (!resultsElement) return;
      if (typeof html2canvas !== 'function') return;
      
      const originalCursor = resultsElement.style.cursor;
      resultsElement.style.cursor = 'wait';
      const originalOverflow = resultsElement.style.overflow;
      resultsElement.style.overflow = 'visible'; 

      try {
        const canvas = await html2canvas(resultsElement, { useCORS: true, backgroundColor: '#f0f9ff', scale: 3 });
        const imageMimeType = 'image/png';
        if (navigator.share && typeof navigator.canShare === 'function') {
          const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, imageMimeType));
          if (blob) {
            const file = new File([blob], `results.png`, { type: imageMimeType });
            if (navigator.canShare({ files: [file] })) {
              try {
                await navigator.share({ files: [file], title: '設定推測結果' });
                return; 
              } catch (e) {}
            }
          }
        }
        setPreviewImageUrl(canvas.toDataURL(imageMimeType));
        setShowImagePreviewModal(true);
      } catch (error) {
      } finally {
        if (resultsElement) { resultsElement.style.cursor = originalCursor; resultsElement.style.overflow = originalOverflow; }
      }
    };

    if (!probabilities) {
       return (
        <div ref={ref} className="mt-6 p-3 sm:p-4 bg-sky-50 rounded-xl shadow-lg border border-sky-200 text-center">
          <p className="text-gray-700 text-sm sm:text-base">入力条件に基づいて予測ボタンを押してください。</p>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">(Please press the predict button based on your input.)</p>
        </div>
      );
    }
    
    const mtvScenarioInputSummaryElements = (isMonkeyTurnV && scenarioProbabilities) 
        ? renderMonkeyTurnScenarioInputSummaryElements(monkeyTurnScenarioInputs, monkeyTurnRivalMode, characterImageMap)
        : null;

    let currentInputDataForSettingResults: any = undefined;
    if (settingFullResult) {
      if (gameMode === GameMode.KING_HANA_HANA_S) currentInputDataForSettingResults = kingHanaHanaInputs;
      else if (gameMode === GameMode.HANA_HANA_HOUOU) currentInputDataForSettingResults = hanaHanaHououInputs;
      else if (gameMode === GameMode.MY_JUGGLER_V) currentInputDataForSettingResults = myJugglerVInputs;
      else if (gameMode === GameMode.IM_JUGGLER_EX) currentInputDataForSettingResults = imJugglerExInputs;
      else if (gameMode === GameMode.GOGO_JUGGLER_3) currentInputDataForSettingResults = gogoJuggler3Inputs;
      else if (gameMode === GameMode.FUNKY_JUGGLER) currentInputDataForSettingResults = funkyJugglerInputs;
      else if (gameMode === GameMode.HAPPY_JUGGLER) currentInputDataForSettingResults = happyJugglerInputs;
      else if (gameMode === GameMode.DRAGON_HANA_HANA_SENKOU) currentInputDataForSettingResults = dragonHanaHanaSenkouInputs;
      else if (gameMode === GameMode.STAR_HANA_HANA) currentInputDataForSettingResults = starHanaHanaInputs;
      else if (gameMode === GameMode.NEW_GETTER_MOUSE) currentInputDataForSettingResults = newGetterMouseInputs;
      else if (gameMode === GameMode.MONKEY_TURN_V) currentInputDataForSettingResults = monkeyTurnSettingInputs;
    }

    return (
      <div ref={ref} className="mt-6 p-3 sm:p-4 bg-sky-50 rounded-xl shadow-lg border border-sky-200">
        <div className="flex justify-between items-center mb-1 border-b-2 border-sky-600/30 pb-2">
          <h2 className="text-lg sm:text-xl font-semibold text-sky-600">{resultTitleToDisplay}</h2>
          {showSaveButton && (
            <button onClick={handleSaveImage} className="ml-3 sm:ml-4 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-medium rounded-md shadow-md focus:outline-none text-xs sm:text-sm">
              画像保存
            </button>
          )}
        </div>
        
        {inputChangedSinceLastCalc && (
          <div className="my-2 p-2 bg-yellow-100 border border-yellow-300 text-yellow-700 text-xs sm:text-sm rounded-md text-center">
            入力値が変更されました。再計算してください。
          </div>
        )}

        {mtvScenarioInputSummaryElements}

        {showImagePreviewModal && previewImageUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setShowImagePreviewModal(false)}>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-lg w-full text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">画像プレビュー</h3>
              <img src={previewImageUrl} alt="設定推測結果" className="max-w-full h-auto max-h-[60vh] mx-auto border border-gray-300 rounded mb-3" />
              <p className="text-sm text-gray-700 mb-4">画像を長押しして保存してください。</p>
              <button onClick={() => setShowImagePreviewModal(false)} className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-150">閉じる</button>
            </div>
          </div>
        )}

        {settingFullResult ? (
          <SettingResultsDisplay settingFullResult={settingFullResult} allSettingNames={names} gameMode={gameMode} currentInputs={currentInputDataForSettingResults} />
        ) : scenarioProbabilities && isMonkeyTurnV ? ( 
          <MonkeyTurnVScenarioResultsDisplay scenarioProbabilities={scenarioProbabilities} scenarioDisplayNames={names} monkeyTurnScenariosData={monkeyTurnScenariosData} />
        ) : (
             <p className="text-gray-700 text-sm sm:text-base">結果を計算中です。</p>
        )}
      </div>
    );
  }
);

ScenarioResultsDisplay.displayName = 'ScenarioResultsDisplay';