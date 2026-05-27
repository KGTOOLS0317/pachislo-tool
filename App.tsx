// App.tsx - Updated to 1.3.5
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { ScenarioInputPanel } from './components/ScenarioInputPanel';
import { ScenarioResultsDisplay } from './components/ScenarioResultsDisplay';
import { ReferenceTables } from './components/ReferenceTables';
import { VersionHistoryModal } from './components/VersionHistoryModal';
import { TheoreticalValuesModal } from './components/TheoreticalValuesModal'; 
import { GameMode, GAME_MODE_OPTIONS, GAME_RESULT_TITLES } from './constants';
import { APP_VERSION, APP_VERSIONS_HISTORY } from './version';
import type {
  HanaHanaHououInput,
  HanaHanaHououFullResult,
  MyJugglerVInput,
  MyJugglerVFullResult,
  ImJugglerExInput,
  ImJugglerExFullResult,
  GogoJuggler3Input,
  GogoJuggler3FullResult,
  FunkyJugglerInput,
  FunkyJugglerFullResult,
  GenericProbabilities,
  VersionInfo,
  MonkeyTurnVScenarioProbabilities,
  MonkeyTurnVSettingFullResult,
  KingHanaHanaSInput,
  KingHanaHanaSFullResult,
  DragonHanaHanaSenkouInput,
  DragonHanaHanaSenkouFullResult,
  StarHanaHanaInput,
  StarHanaHanaFullResult,
  NewGetterMouseInput,
  NewGetterMouseFullResult,
  HappyJugglerInput,
  HappyJugglerFullResult,
} from './types';

// Custom Hooks
import { useMonkeyTurnVScenario } from './hooks/useMonkeyTurnVScenario';
import { useMonkeyTurnVSetting } from './hooks/useMonkeyTurnVSetting';
import { useKingHanaHanaS } from './hooks/useKingHanaHanaS';
import { useHanaHanaHouou } from './hooks/useHanaHanaHouou'; 
import { useMyJugglerV } from './hooks/useMyJugglerV';     
import { useImJugglerEx } from './hooks/useImJugglerEx';
import { useGogoJuggler3 } from './hooks/useGogoJuggler3';
import { useFunkyJuggler } from './hooks/useFunkyJuggler';
import { useDragonHanaHanaSenkou } from './hooks/useDragonHanaHanaSenkou';
import { useStarHanaHana } from './hooks/useStarHanaHana';
import { useNewGetterMouse } from './hooks/useNewGetterMouse';
import { useHappyJuggler } from './hooks/useHappyJuggler';

// Constants
import { SCENARIOS_DATA as MTV_SCENARIOS_DATA, CHARACTERS as MTV_CHARACTERS, MTV_SCENARIO_NAMES, MONKEY_TURN_V_SETTINGS_NAMES } from './constants/monkeyTurnVConstants';
import { KING_HANA_HANA_SETTINGS_NAMES } from './constants/kingHanaHanaSConstants';
import { HANA_HANA_HOUOU_SETTINGS_NAMES } from './constants/hanaHanaHououConstants';
import { MY_JUGGLER_V_SETTINGS_NAMES } from './constants/myJugglerVConstants';
import { IM_JUGGLER_EX_SETTINGS_NAMES } from './constants/imJugglerExConstants';
import { GOGO_JUGGLER_3_SETTINGS_NAMES } from './constants/gogoJuggler3Constants';
import { FUNKY_JUGGLER_SETTINGS_NAMES } from './constants/funkyJugglerConstants';
import { DRAGON_HANA_HANA_SENKOU_SETTINGS_NAMES } from './constants/dragonHanaHanaSenkouConstants';
import { STAR_HANA_HANA_SETTINGS_NAMES } from './constants/starHanaHanaConstants';
import { NEW_GETTER_MOUSE_SETTINGS_NAMES } from './constants/newGetterMouseConstants';
import { HAPPY_JUGGLER_SETTINGS_NAMES } from './constants/happyJugglerConstants';


const LOCAL_STORAGE_KEY_GAME_MODE = 'pachislotTool_gameMode_v2';

const App: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>(() => {
    const savedGameMode = localStorage.getItem(LOCAL_STORAGE_KEY_GAME_MODE);
    return savedGameMode && Object.values(GameMode).includes(savedGameMode as GameMode)
      ? (savedGameMode as GameMode)
      : GameMode.MY_JUGGLER_V;
  });

  const [inputChangedSinceLastCalc, setInputChangedSinceLastCalc] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showTheoreticalValues, setShowTheoreticalValues] = useState(false); 

  // Refs to hold setters to break circular dependencies during hook initialization
  const setMonkeyTurnSettingProbsRef = useRef<((probs: MonkeyTurnVSettingFullResult | null) => void) | null>(null);
  const setMonkeyTurnScenarioProbsRef = useRef<((probs: MonkeyTurnVScenarioProbabilities | null) => void) | null>(null);

  // Hooks initialization
  const { monkeyTurnScenarioInputs, monkeyTurnRivalMode, monkeyTurnScenarioProbs, handleMonkeyTurnScenarioInputChange, handleMonkeyTurnRivalModeChange, handleCalculateMonkeyTurnScenarios, resetMonkeyTurnScenarioInputsAndProbs, setMonkeyTurnScenarioProbs } = useMonkeyTurnVScenario(
    setInputChangedSinceLastCalc, 
    gameMode, 
    (probs) => setMonkeyTurnSettingProbsRef.current?.(probs as MonkeyTurnVSettingFullResult | null)
  );
  
  const { monkeyTurnSettingInputs, monkeyTurnSettingProbs, handleMonkeyTurnSettingInputChange, handleCalculateMonkeyTurnSettings, resetMonkeyTurnSettingInputsAndProbs, setMonkeyTurnSettingProbs } = useMonkeyTurnVSetting(
    setInputChangedSinceLastCalc, 
    gameMode, 
    (probs) => setMonkeyTurnScenarioProbsRef.current?.(probs as MonkeyTurnVScenarioProbabilities | null)
  );

  // Update refs after hooks are initialized
  useEffect(() => {
    setMonkeyTurnSettingProbsRef.current = setMonkeyTurnSettingProbs;
    setMonkeyTurnScenarioProbsRef.current = setMonkeyTurnScenarioProbs;
  }, [setMonkeyTurnSettingProbs, setMonkeyTurnScenarioProbs]);
  const { kingHanaHanaInputs, kingHanaHanaProbs, handleKingHanaHanaInputChange, calculateKingHanaHanaS, resetKingHanaHanaSInputsAndProbs, setKingHanaHanaProbs } = useKingHanaHanaS(setInputChangedSinceLastCalc, gameMode);
  const { hanaHanaHououInputs, hanaHanaHououProbs, handleHanaHanaHououInputChange, calculateHanaHanaHouou, resetHanaHanaHououInputsAndProbs, setHanaHanaHououProbs } = useHanaHanaHouou(setInputChangedSinceLastCalc, gameMode);
  const { myJugglerVInputs, myJugglerVProbs, handleMyJugglerVInputChange, calculateMyJugglerV, resetMyJugglerVInputsAndProbs, setMyJugglerVProbs } = useMyJugglerV(setInputChangedSinceLastCalc, gameMode);
  const { inputs: imJugglerInputs, probs: imJugglerProbs, setProbs: setImJugglerProbs, handleInputChange: handleImJugglerInputChange, calculate: calculateImJuggler, reset: resetImJuggler } = useImJugglerEx(setInputChangedSinceLastCalc, gameMode);
  const { inputs: gogoJugglerInputs, probs: gogoJugglerProbs, setProbs: setGogoJugglerProbs, handleInputChange: handleGogoJugglerInputChange, calculate: calculateGogoJuggler, reset: resetGogoJuggler } = useGogoJuggler3(setInputChangedSinceLastCalc, gameMode);
  const { inputs: funkyJugglerInputs, probs: funkyJugglerProbs, setProbs: setFunkyJugglerProbs, handleInputChange: handleFunkyJugglerInputChange, calculate: calculateFunkyJuggler, reset: resetFunkyJuggler } = useFunkyJuggler(setInputChangedSinceLastCalc, gameMode);
  const { dragonHanaHanaSenkouInputs, dragonHanaHanaSenkouProbs, handleDragonHanaHanaSenkouInputChange, calculateDragonHanaHanaSenkou, resetDragonHanaHanaSenkouInputsAndProbs, setDragonHanaHanaSenkouProbs } = useDragonHanaHanaSenkou(setInputChangedSinceLastCalc, gameMode);
  const { starHanaHanaInputs, starHanaHanaProbs, handleStarHanaHanaInputChange, calculateStarHanaHana, resetStarHanaHanaInputsAndProbs, setStarHanaHanaProbs } = useStarHanaHana(setInputChangedSinceLastCalc, gameMode);
  const { newGetterMouseInputs, newGetterMouseProbs, handleNewGetterMouseInputChange, calculateNewGetterMouse, resetNewGetterMouseInputsAndProbs, setNewGetterMouseProbs } = useNewGetterMouse(setInputChangedSinceLastCalc, gameMode);
  const { inputs: happyJugglerInputs, probs: happyJugglerProbs, setProbs: setHappyJugglerProbs, handleInputChange: handleHappyJugglerInputChange, calculate: calculateHappyJuggler, reset: resetHappyJuggler } = useHappyJuggler(setInputChangedSinceLastCalc, gameMode);

  const resultsDisplayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_GAME_MODE, gameMode);
    setInputChangedSinceLastCalc(false); 
    document.body.classList.remove('page-bg-mtv', 'page-bg-khh', 'page-bg-hhh', 'page-bg-mjv', 'page-bg-imj', 'page-bg-ggj', 'page-bg-fkj', 'page-bg-dhh', 'page-bg-shh', 'page-bg-ngm', 'page-bg-hpj');
    switch (gameMode) {
      case GameMode.MONKEY_TURN_V: document.body.classList.add('page-bg-mtv'); break;
      case GameMode.KING_HANA_HANA_S: document.body.classList.add('page-bg-khh'); break;
      case GameMode.HANA_HANA_HOUOU: document.body.classList.add('page-bg-hhh'); break;
      case GameMode.MY_JUGGLER_V: document.body.classList.add('page-bg-mjv'); break;
      case GameMode.IM_JUGGLER_EX: document.body.classList.add('page-bg-imj'); break;
      case GameMode.GOGO_JUGGLER_3: document.body.classList.add('page-bg-ggj'); break;
      case GameMode.FUNKY_JUGGLER: document.body.classList.add('page-bg-fkj'); break;
      case GameMode.DRAGON_HANA_HANA_SENKOU: document.body.classList.add('page-bg-dhh'); break;
      case GameMode.STAR_HANA_HANA: document.body.classList.add('page-bg-shh'); break;
      case GameMode.NEW_GETTER_MOUSE: document.body.classList.add('page-bg-ngm'); break;
      case GameMode.HAPPY_JUGGLER: document.body.classList.add('page-bg-hpj'); break;
    }
  }, [gameMode]);

  const handleGameModeChange = useCallback((newMode: GameMode) => {
    setGameMode(newMode);
    setMonkeyTurnScenarioProbs(null);
    setMonkeyTurnSettingProbs(null);
    setKingHanaHanaProbs(null);
    setHanaHanaHououProbs(null);
    setMyJugglerVProbs(null);
    setImJugglerProbs(null);
    setGogoJugglerProbs(null);
    setFunkyJugglerProbs(null);
    setDragonHanaHanaSenkouProbs(null);
    setStarHanaHanaProbs(null);
    setNewGetterMouseProbs(null);
    setHappyJugglerProbs(null);
  }, [setMonkeyTurnScenarioProbs, setMonkeyTurnSettingProbs, setKingHanaHanaProbs, setHanaHanaHououProbs, setMyJugglerVProbs, setImJugglerProbs, setGogoJugglerProbs, setFunkyJugglerProbs, setDragonHanaHanaSenkouProbs, setStarHanaHanaProbs, setNewGetterMouseProbs, setHappyJugglerProbs]);

  const handleCalculateGeneric = useCallback(() => {
    if (gameMode === GameMode.KING_HANA_HANA_S) calculateKingHanaHanaS();
    else if (gameMode === GameMode.HANA_HANA_HOUOU) calculateHanaHanaHouou();
    else if (gameMode === GameMode.MY_JUGGLER_V) calculateMyJugglerV();
    else if (gameMode === GameMode.IM_JUGGLER_EX) calculateImJuggler();
    else if (gameMode === GameMode.GOGO_JUGGLER_3) calculateGogoJuggler();
    else if (gameMode === GameMode.FUNKY_JUGGLER) calculateFunkyJuggler();
    else if (gameMode === GameMode.DRAGON_HANA_HANA_SENKOU) calculateDragonHanaHanaSenkou();
    else if (gameMode === GameMode.STAR_HANA_HANA) calculateStarHanaHana();
    else if (gameMode === GameMode.NEW_GETTER_MOUSE) calculateNewGetterMouse();
    else if (gameMode === GameMode.HAPPY_JUGGLER) calculateHappyJuggler();
  }, [gameMode, calculateKingHanaHanaS, calculateHanaHanaHouou, calculateMyJugglerV, calculateImJuggler, calculateGogoJuggler, calculateFunkyJuggler, calculateDragonHanaHanaSenkou, calculateStarHanaHana, calculateNewGetterMouse, calculateHappyJuggler]);

  const handleReset = useCallback(() => {
    if (gameMode === GameMode.MONKEY_TURN_V) { resetMonkeyTurnScenarioInputsAndProbs(); resetMonkeyTurnSettingInputsAndProbs(); }
    else if (gameMode === GameMode.KING_HANA_HANA_S) resetKingHanaHanaSInputsAndProbs();
    else if (gameMode === GameMode.HANA_HANA_HOUOU) resetHanaHanaHououInputsAndProbs();
    else if (gameMode === GameMode.MY_JUGGLER_V) resetMyJugglerVInputsAndProbs();
    else if (gameMode === GameMode.IM_JUGGLER_EX) resetImJuggler();
    else if (gameMode === GameMode.GOGO_JUGGLER_3) resetGogoJuggler();
    else if (gameMode === GameMode.FUNKY_JUGGLER) resetFunkyJuggler();
    else if (gameMode === GameMode.DRAGON_HANA_HANA_SENKOU) resetDragonHanaHanaSenkouInputsAndProbs();
    else if (gameMode === GameMode.STAR_HANA_HANA) resetStarHanaHanaInputsAndProbs();
    else if (gameMode === GameMode.NEW_GETTER_MOUSE) resetNewGetterMouseInputsAndProbs();
    else if (gameMode === GameMode.HAPPY_JUGGLER) resetHappyJuggler();
    setInputChangedSinceLastCalc(false);
  }, [gameMode, resetMonkeyTurnScenarioInputsAndProbs, resetMonkeyTurnSettingInputsAndProbs, resetKingHanaHanaSInputsAndProbs, resetHanaHanaHououInputsAndProbs, resetMyJugglerVInputsAndProbs, resetImJuggler, resetGogoJuggler, resetFunkyJuggler, resetDragonHanaHanaSenkouInputsAndProbs, resetStarHanaHanaInputsAndProbs, resetNewGetterMouseInputsAndProbs, resetHappyJuggler]);

  useEffect(() => {
    let currentProbs: GenericProbabilities | null = null;
    if (gameMode === GameMode.MONKEY_TURN_V) currentProbs = monkeyTurnScenarioProbs || monkeyTurnSettingProbs;
    else if (gameMode === GameMode.KING_HANA_HANA_S) currentProbs = kingHanaHanaProbs;
    else if (gameMode === GameMode.HANA_HANA_HOUOU) currentProbs = hanaHanaHououProbs;
    else if (gameMode === GameMode.MY_JUGGLER_V) currentProbs = myJugglerVProbs;
    else if (gameMode === GameMode.IM_JUGGLER_EX) currentProbs = imJugglerProbs;
    else if (gameMode === GameMode.GOGO_JUGGLER_3) currentProbs = gogoJugglerProbs;
    else if (gameMode === GameMode.FUNKY_JUGGLER) currentProbs = funkyJugglerProbs;
    else if (gameMode === GameMode.DRAGON_HANA_HANA_SENKOU) currentProbs = dragonHanaHanaSenkouProbs;
    else if (gameMode === GameMode.STAR_HANA_HANA) currentProbs = starHanaHanaProbs;
    else if (gameMode === GameMode.NEW_GETTER_MOUSE) currentProbs = newGetterMouseProbs;
    else if (gameMode === GameMode.HAPPY_JUGGLER) currentProbs = happyJugglerProbs;
    if (currentProbs && resultsDisplayRef.current && !inputChangedSinceLastCalc) resultsDisplayRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [monkeyTurnScenarioProbs, monkeyTurnSettingProbs, kingHanaHanaProbs, hanaHanaHououProbs, myJugglerVProbs, imJugglerProbs, gogoJugglerProbs, funkyJugglerProbs, dragonHanaHanaSenkouProbs, starHanaHanaProbs, newGetterMouseProbs, happyJugglerProbs, gameMode, inputChangedSinceLastCalc]);

  let currentProbabilities: GenericProbabilities | null = null;
  let currentNames: string[] = [];
  let currentResultTitle: string | undefined = undefined;

  if (gameMode === GameMode.MONKEY_TURN_V) {
    if (monkeyTurnScenarioProbs && !monkeyTurnSettingProbs) { currentProbabilities = monkeyTurnScenarioProbs; currentNames = MTV_SCENARIO_NAMES; currentResultTitle = "シナリオ予測結果"; }
    else if (monkeyTurnSettingProbs) { currentProbabilities = monkeyTurnSettingProbs; currentNames = MONKEY_TURN_V_SETTINGS_NAMES; currentResultTitle = "モンキーターンV 設定推測"; }
  } else if (gameMode === GameMode.KING_HANA_HANA_S) { currentProbabilities = kingHanaHanaProbs; currentNames = KING_HANA_HANA_SETTINGS_NAMES; currentResultTitle = GAME_RESULT_TITLES[gameMode]; }
  else if (gameMode === GameMode.HANA_HANA_HOUOU) { currentProbabilities = hanaHanaHououProbs; currentNames = HANA_HANA_HOUOU_SETTINGS_NAMES; currentResultTitle = GAME_RESULT_TITLES[gameMode]; }
  else if (gameMode === GameMode.MY_JUGGLER_V) { currentProbabilities = myJugglerVProbs; currentNames = MY_JUGGLER_V_SETTINGS_NAMES; currentResultTitle = GAME_RESULT_TITLES[gameMode]; }
  else if (gameMode === GameMode.IM_JUGGLER_EX) { currentProbabilities = imJugglerProbs; currentNames = IM_JUGGLER_EX_SETTINGS_NAMES; currentResultTitle = GAME_RESULT_TITLES[gameMode]; }
  else if (gameMode === GameMode.GOGO_JUGGLER_3) { currentProbabilities = gogoJugglerProbs; currentNames = GOGO_JUGGLER_3_SETTINGS_NAMES; currentResultTitle = GAME_RESULT_TITLES[gameMode]; }
  else if (gameMode === GameMode.FUNKY_JUGGLER) { currentProbabilities = funkyJugglerProbs; currentNames = FUNKY_JUGGLER_SETTINGS_NAMES; currentResultTitle = GAME_RESULT_TITLES[gameMode]; }
  else if (gameMode === GameMode.DRAGON_HANA_HANA_SENKOU) { currentProbabilities = dragonHanaHanaSenkouProbs; currentNames = DRAGON_HANA_HANA_SENKOU_SETTINGS_NAMES; currentResultTitle = GAME_RESULT_TITLES[gameMode]; }
  else if (gameMode === GameMode.STAR_HANA_HANA) { currentProbabilities = starHanaHanaProbs; currentNames = STAR_HANA_HANA_SETTINGS_NAMES; currentResultTitle = GAME_RESULT_TITLES[gameMode]; }
  else if (gameMode === GameMode.NEW_GETTER_MOUSE) { currentProbabilities = newGetterMouseProbs; currentNames = NEW_GETTER_MOUSE_SETTINGS_NAMES; currentResultTitle = GAME_RESULT_TITLES[gameMode]; }
  else if (gameMode === GameMode.HAPPY_JUGGLER) { currentProbabilities = happyJugglerProbs; currentNames = HAPPY_JUGGLER_SETTINGS_NAMES; currentResultTitle = GAME_RESULT_TITLES[gameMode]; }

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 text-gray-800 min-h-screen">
        <Header currentGameMode={gameMode} onGameModeChange={handleGameModeChange} />
        <main className="mt-1 sm:mt-2 space-y-6 md:space-y-8">
          <ScenarioInputPanel
            gameMode={gameMode}
            monkeyTurnScenarioInputs={monkeyTurnScenarioInputs}
            monkeyTurnSettingInputs={monkeyTurnSettingInputs}
            monkeyTurnRivalMode={monkeyTurnRivalMode}
            onMonkeyTurnScenarioInputChange={handleMonkeyTurnScenarioInputChange}
            onMonkeyTurnSettingInputChange={handleMonkeyTurnSettingInputChange}
            onMonkeyTurnRivalModeChange={handleMonkeyTurnRivalModeChange}
            onCalculateMonkeyTurnSettingsClick={handleCalculateMonkeyTurnSettings}
            onResetMonkeyTurnSettingInputsClick={resetMonkeyTurnSettingInputsAndProbs}
            onResetMonkeyTurnScenarioInputsClick={resetMonkeyTurnScenarioInputsAndProbs}
            kingHanaHanaInputs={kingHanaHanaInputs}
            onKingHanaHanaInputChange={handleKingHanaHanaInputChange}
            hanaHanaHououInputs={hanaHanaHououInputs}
            onHanaHanaHououInputChange={handleHanaHanaHououInputChange}
            myJugglerVInputs={myJugglerVInputs}
            onMyJugglerVInputChange={handleMyJugglerVInputChange}
            imJugglerExInputs={imJugglerInputs}
            onImJugglerExInputChange={handleImJugglerInputChange}
            gogoJuggler3Inputs={gogoJugglerInputs}
            onGogoJuggler3InputChange={handleGogoJugglerInputChange}
            funkyJugglerInputs={funkyJugglerInputs}
            onFunkyJugglerInputChange={handleFunkyJugglerInputChange}
            dragonHanaHanaSenkouInputs={dragonHanaHanaSenkouInputs}
            onDragonHanaHanaSenkouInputChange={handleDragonHanaHanaSenkouInputChange}
            starHanaHanaInputs={starHanaHanaInputs}
            onStarHanaHanaInputChange={handleStarHanaHanaInputChange}
            newGetterMouseInputs={newGetterMouseInputs}
            onNewGetterMouseInputChange={handleNewGetterMouseInputChange}
            happyJugglerInputs={happyJugglerInputs}
            onHappyJugglerInputChange={handleHappyJugglerInputChange}
          />
          <div className="flex items-center space-x-3 sm:space-x-4 pt-1 sm:pt-2">
            {gameMode === GameMode.MONKEY_TURN_V ? (
              <button onClick={handleCalculateMonkeyTurnScenarios} className="px-6 py-2.5 sm:px-7 sm:py-3 bg-gradient-to-r from-sky-50 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-xl focus:outline-none focus:ring-4 focus:ring-sky-300 focus:ring-opacity-70 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 text-sm sm:text-base">シナリオを予測する</button>
            ) : (
              <button onClick={handleCalculateGeneric} className="px-6 py-2.5 sm:px-8 sm:py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-xl focus:outline-none focus:ring-4 focus:ring-sky-300 focus:ring-opacity-70 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 text-sm sm:text-lg">設定を推測する</button>
            )}
            <button onClick={handleReset} className="px-6 py-2.5 sm:px-7 sm:py-3 bg-gradient-to-r from-slate-500 to-slate-700 hover:from-slate-600 hover:to-slate-800 text-white font-semibold rounded-lg shadow-xl focus:outline-none focus:ring-4 focus:ring-slate-300 focus:ring-opacity-70 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 text-sm sm:text-base">リセット</button>
          </div>
          {(currentProbabilities || inputChangedSinceLastCalc) && (
            <ScenarioResultsDisplay
              ref={resultsDisplayRef}
              probabilities={currentProbabilities}
              names={currentNames}
              gameMode={gameMode}
              resultTitle={currentResultTitle}
              inputChangedSinceLastCalc={inputChangedSinceLastCalc && !!currentProbabilities}
              kingHanaHanaInputs={kingHanaHanaInputs}
              hanaHanaHououInputs={hanaHanaHououInputs}
              myJugglerVInputs={myJugglerVInputs}
              imJugglerExInputs={imJugglerInputs}
              gogoJuggler3Inputs={gogoJugglerInputs}
              funkyJugglerInputs={funkyJugglerInputs}
              dragonHanaHanaSenkouInputs={dragonHanaHanaSenkouInputs}
              starHanaHanaInputs={starHanaHanaInputs}
              newGetterMouseInputs={newGetterMouseInputs}
              happyJugglerInputs={happyJugglerInputs}
              monkeyTurnSettingInputs={gameMode === GameMode.MONKEY_TURN_V && monkeyTurnSettingProbs ? monkeyTurnSettingInputs : undefined}
              monkeyTurnScenariosData={gameMode === GameMode.MONKEY_TURN_V ? MTV_SCENARIOS_DATA : undefined}
              monkeyTurnScenarioInputs={gameMode === GameMode.MONKEY_TURN_V && monkeyTurnScenarioProbs ? monkeyTurnScenarioInputs : undefined}
              monkeyTurnRivalMode={gameMode === GameMode.MONKEY_TURN_V && monkeyTurnScenarioProbs ? monkeyTurnRivalMode : undefined}
            />
          )}
          <ReferenceTables gameMode={gameMode} monkeyTurnScenariosData={MTV_SCENARIOS_DATA} monkeyTurnScenarioNames={MTV_SCENARIO_NAMES} monkeyTurnCharacters={MTV_CHARACTERS} />
        </main>
        <footer className="text-center mt-8 sm:mt-10 py-4 sm:py-5 border-t border-gray-300/30">
          <p className="text-xs text-gray-600 mt-1.5 sm:mt-2 leading-relaxed max-w-xl mx-auto px-2">当ツールは入力された情報に基づいて確率を算出するツールです。参考程度に活用してください。</p>
          <p className="text-xs text-gray-600 mt-2 sm:mt-3">&copy; {new Date().getFullYear()} パチスロ判別ツール. All Rights Reserved.</p>
          <div className="text-xs text-gray-500 mt-1 flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center space-x-2">
              <span>Version: {APP_VERSION}</span>
              <button onClick={() => setShowVersionHistory(true)} className="text-sky-600 hover:text-sky-700 underline focus:outline-none">更新履歴</button>
              <button onClick={() => setShowTheoreticalValues(true)} className="text-sky-600 hover:text-sky-700 underline focus:outline-none">理論値</button>
            </div>
          </div>
        </footer>
        {showVersionHistory && <VersionHistoryModal isOpen={showVersionHistory} onClose={() => setShowVersionHistory(false)} versions={APP_VERSIONS_HISTORY} currentVersion={APP_VERSION} />}
        {showTheoreticalValues && <TheoreticalValuesModal isOpen={showTheoreticalValues} onClose={() => setShowTheoreticalValues(false)} gameMode={gameMode} />}
      </div>
  );
};

export default App;