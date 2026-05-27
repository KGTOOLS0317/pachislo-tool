// components/ScenarioInputPanel.tsx
import React from 'react';
import type { MonkeyTurnVSetInput, MonkeyTurnVSettingInput, KingHanaHanaSInput, HanaHanaHououInput, MyJugglerVInput, DragonHanaHanaSenkouInput, StarHanaHanaInput, NewGetterMouseInput, ImJugglerExInput, GogoJuggler3Input, FunkyJugglerInput, HappyJugglerInput } from '../types';
import { GameMode } from '../types';
import { RivalMode as MonkeyTurnRivalMode } from '../constants/monkeyTurnVConstants';
import { MonkeyTurnVInputSection } from './inputs/MonkeyTurnVInputSection';
import { GenericSettingInputSection } from './inputs/GenericSettingInputSection';
import { NewGetterMouseInputSection } from './inputs/NewGetterMouseInputSection';

interface ScenarioInputPanelProps {
  gameMode: GameMode;
  // Monkey Turn V props
  monkeyTurnScenarioInputs?: MonkeyTurnVSetInput[]; 
  monkeyTurnSettingInputs?: MonkeyTurnVSettingInput; 
  monkeyTurnRivalMode?: MonkeyTurnRivalMode;
  onMonkeyTurnScenarioInputChange?: (round: number, field: keyof Omit<MonkeyTurnVSetInput, 'round'>, value: string | null) => void; 
  onMonkeyTurnSettingInputChange?: (field: keyof MonkeyTurnVSettingInput, value: number | null) => void; 
  onMonkeyTurnRivalModeChange?: (newMode: MonkeyTurnRivalMode) => void;
  onCalculateMonkeyTurnSettingsClick?: () => void;
  onResetMonkeyTurnSettingInputsClick?: () => void; 
  onResetMonkeyTurnScenarioInputsClick?: () => void; 
  // King Hana Hana S props
  kingHanaHanaInputs?: KingHanaHanaSInput;
  onKingHanaHanaInputChange?: (field: keyof KingHanaHanaSInput, value: any) => void;
  // Hana Hana Houou props
  hanaHanaHououInputs?: HanaHanaHououInput;
  onHanaHanaHououInputChange?: (field: keyof HanaHanaHououInput, value: any) => void;
  // My Juggler V props
  myJugglerVInputs?: MyJugglerVInput;
  onMyJugglerVInputChange?: (field: keyof MyJugglerVInput, value: any) => void;
  // Im Juggler EX props
  imJugglerExInputs?: ImJugglerExInput;
  onImJugglerExInputChange?: (field: keyof ImJugglerExInput, value: any) => void;
  // Gogo Juggler 3 props
  gogoJuggler3Inputs?: GogoJuggler3Input;
  onGogoJuggler3InputChange?: (field: keyof GogoJuggler3Input, value: any) => void;
  // Funky Juggler props
  funkyJugglerInputs?: FunkyJugglerInput;
  onFunkyJugglerInputChange?: (field: keyof FunkyJugglerInput, value: any) => void;
  // Dragon Hana Hana Senkou props
  dragonHanaHanaSenkouInputs?: DragonHanaHanaSenkouInput;
  onDragonHanaHanaSenkouInputChange?: (field: keyof DragonHanaHanaSenkouInput, value: any) => void;
  // Star Hana Hana props
  starHanaHanaInputs?: StarHanaHanaInput;
  onStarHanaHanaInputChange?: (field: keyof StarHanaHanaInput, value: any) => void;
  // New Getter Mouse props
  newGetterMouseInputs?: NewGetterMouseInput;
  onNewGetterMouseInputChange?: (field: keyof NewGetterMouseInput, value: any) => void;
  // Happy Juggler props
  happyJugglerInputs?: HappyJugglerInput;
  onHappyJugglerInputChange?: (field: keyof HappyJugglerInput, value: any) => void;
}

export const ScenarioInputPanel: React.FC<ScenarioInputPanelProps> = ({
  gameMode,
  monkeyTurnScenarioInputs,
  monkeyTurnSettingInputs,
  monkeyTurnRivalMode,
  kingHanaHanaInputs,
  hanaHanaHououInputs,
  myJugglerVInputs,
  imJugglerExInputs,
  gogoJuggler3Inputs,
  funkyJugglerInputs,
  dragonHanaHanaSenkouInputs,
  starHanaHanaInputs,
  newGetterMouseInputs,
  happyJugglerInputs,
  onMonkeyTurnScenarioInputChange,
  onMonkeyTurnSettingInputChange,
  onMonkeyTurnRivalModeChange,
  onKingHanaHanaInputChange,
  onHanaHanaHououInputChange,
  onMyJugglerVInputChange,
  onImJugglerExInputChange,
  onGogoJuggler3InputChange,
  onFunkyJugglerInputChange,
  onDragonHanaHanaSenkouInputChange,
  onStarHanaHanaInputChange,
  onNewGetterMouseInputChange,
  onHappyJugglerInputChange,
  onCalculateMonkeyTurnSettingsClick,
  onResetMonkeyTurnSettingInputsClick, 
  onResetMonkeyTurnScenarioInputsClick, 
}) => {

  return (
    <div className="bg-sky-100 p-3 sm:p-4 rounded-xl shadow-lg border border-sky-200">
      <h2 className="text-base sm:text-lg font-semibold mb-3 text-sky-600 border-b-2 border-sky-600/30 pb-2">
        入力情報
      </h2>
      {gameMode === GameMode.MONKEY_TURN_V && monkeyTurnScenarioInputs && monkeyTurnSettingInputs && typeof monkeyTurnRivalMode !== 'undefined' && onMonkeyTurnScenarioInputChange && onMonkeyTurnSettingInputChange && onMonkeyTurnRivalModeChange && onCalculateMonkeyTurnSettingsClick && onResetMonkeyTurnSettingInputsClick && onResetMonkeyTurnScenarioInputsClick && (
        <MonkeyTurnVInputSection
          scenarioInputs={monkeyTurnScenarioInputs}
          settingInputs={monkeyTurnSettingInputs}
          rivalMode={monkeyTurnRivalMode}
          onScenarioInputChange={onMonkeyTurnScenarioInputChange}
          onSettingInputChange={onMonkeyTurnSettingInputChange} 
          onRivalModeChange={onMonkeyTurnRivalModeChange}
          onCalculateSettingsClick={onCalculateMonkeyTurnSettingsClick}
          onResetSettingInputsClick={onResetMonkeyTurnSettingInputsClick}
          onResetScenarioInputsClick={onResetMonkeyTurnScenarioInputsClick}
        />
      )}
      {gameMode === GameMode.KING_HANA_HANA_S && kingHanaHanaInputs && onKingHanaHanaInputChange && (
        <GenericSettingInputSection gameMode={gameMode} inputs={kingHanaHanaInputs} onInputChange={onKingHanaHanaInputChange} />
      )}
      {gameMode === GameMode.HANA_HANA_HOUOU && hanaHanaHououInputs && onHanaHanaHououInputChange && (
         <GenericSettingInputSection gameMode={gameMode} inputs={hanaHanaHououInputs} onInputChange={onHanaHanaHououInputChange} />
      )}
      {gameMode === GameMode.MY_JUGGLER_V && myJugglerVInputs && onMyJugglerVInputChange && (
         <GenericSettingInputSection gameMode={gameMode} inputs={myJugglerVInputs} onInputChange={onMyJugglerVInputChange} />
      )}
      {gameMode === GameMode.IM_JUGGLER_EX && imJugglerExInputs && onImJugglerExInputChange && (
         <GenericSettingInputSection gameMode={gameMode} inputs={imJugglerExInputs} onInputChange={onImJugglerExInputChange} />
      )}
      {gameMode === GameMode.GOGO_JUGGLER_3 && gogoJuggler3Inputs && onGogoJuggler3InputChange && (
         <GenericSettingInputSection gameMode={gameMode} inputs={gogoJuggler3Inputs} onInputChange={onGogoJuggler3InputChange} />
      )}
      {gameMode === GameMode.FUNKY_JUGGLER && funkyJugglerInputs && onFunkyJugglerInputChange && (
         <GenericSettingInputSection gameMode={gameMode} inputs={funkyJugglerInputs} onInputChange={onFunkyJugglerInputChange} />
      )}
      {gameMode === GameMode.DRAGON_HANA_HANA_SENKOU && dragonHanaHanaSenkouInputs && onDragonHanaHanaSenkouInputChange && (
         <GenericSettingInputSection gameMode={gameMode} inputs={dragonHanaHanaSenkouInputs} onInputChange={onDragonHanaHanaSenkouInputChange} />
      )}
      {gameMode === GameMode.STAR_HANA_HANA && starHanaHanaInputs && onStarHanaHanaInputChange && (
         <GenericSettingInputSection gameMode={gameMode} inputs={starHanaHanaInputs} onInputChange={onStarHanaHanaInputChange} />
      )}
      {gameMode === GameMode.NEW_GETTER_MOUSE && newGetterMouseInputs && onNewGetterMouseInputChange && (
         <NewGetterMouseInputSection inputs={newGetterMouseInputs} onInputChange={onNewGetterMouseInputChange} />
      )}
      {gameMode === GameMode.HAPPY_JUGGLER && happyJugglerInputs && onHappyJugglerInputChange && (
         <GenericSettingInputSection gameMode={gameMode} inputs={happyJugglerInputs} onInputChange={onHappyJugglerInputChange} />
      )}
    </div>
  );
};
ScenarioInputPanel.displayName = 'ScenarioInputPanel';