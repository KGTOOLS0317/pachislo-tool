
// hooks/useMonkeyTurnVScenario.ts
// Fix: Import React to make React namespace available for types.
import * as React from 'react';
import { useState, useCallback, useMemo, useEffect } from 'react';
import type { MonkeyTurnVSetInput, MonkeyTurnVScenarioProbabilities, MonkeyTurnVSettingFullResult } from '../types';
import { GameMode } from '../types';
import { 
  CharacterName as MonkeyTurnCharacterName,
  LampColor as MonkeyTurnLampColor,
  RivalMode as MonkeyTurnRivalMode,
} from '../constants/monkeyTurnVConstants';
import { calculateMonkeyTurnVProbabilities } from '../services/scenarioCalculator';

const LOCAL_STORAGE_KEY_MTV_SCENARIO_INPUTS = 'monkeyTurnV_scenarioInputs_v1';
const LOCAL_STORAGE_KEY_MTV_RIVAL_MODE = 'monkeyTurnV_rivalMode';
const LOCAL_STORAGE_KEY_GAME_MODE = 'pachislotTool_gameMode_v2'; // To check if MTV was the last active mode

export const useMonkeyTurnVScenario = (
  setInputChangedSinceLastCalc: React.Dispatch<React.SetStateAction<boolean>>,
  currentGameMode: GameMode, // Used to determine if initial load from localStorage is relevant
  setOtherProbs: (probs: MonkeyTurnVSettingFullResult | null) => void // Setter for setting probabilities
) => {
  const initialMonkeyTurnVScenarioInputs: MonkeyTurnVSetInput[] = useMemo(() => 
    Array(8).fill(null).map((_, index) => ({
      round: index + 1,
      startScreen: null, 
      lampColor: index === 7 ? MonkeyTurnLampColor.RAINBOW : null,
  })), []);

  const [monkeyTurnScenarioInputs, setMonkeyTurnScenarioInputs] = useState<MonkeyTurnVSetInput[]>(() => {
    if (currentGameMode === GameMode.MONKEY_TURN_V) {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY_MTV_SCENARIO_INPUTS);
        if (saved) {
          const parsed = JSON.parse(saved) as MonkeyTurnVSetInput[];
          if (Array.isArray(parsed) && parsed.length === 8) {
             return parsed.map((item: any, index: number) => ({
                round: index + 1,
                startScreen: item.startScreen && Object.values(MonkeyTurnCharacterName).includes(item.startScreen as MonkeyTurnCharacterName) ? item.startScreen : null,
                lampColor: index === 7 ? MonkeyTurnLampColor.RAINBOW : (item.lampColor && Object.values(MonkeyTurnLampColor).includes(item.lampColor as MonkeyTurnLampColor) ? item.lampColor : null),
            }));
          }
        }
      } catch (error) { console.error("Failed to load MTV scenario inputs from localStorage:", error); }
    }
    return initialMonkeyTurnVScenarioInputs;
  });

  const [monkeyTurnRivalMode, setMonkeyTurnRivalMode] = useState<MonkeyTurnRivalMode>(() => {
    if (currentGameMode === GameMode.MONKEY_TURN_V) {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY_MTV_RIVAL_MODE);
        if (saved && Object.values(MonkeyTurnRivalMode).includes(saved as MonkeyTurnRivalMode)) {
          return saved as MonkeyTurnRivalMode;
        }
      } catch (error) { console.error("Failed to load MTV rival mode from localStorage:", error); }
    }
    return MonkeyTurnRivalMode.NOT_PRESENT;
  });
  
  const [monkeyTurnScenarioProbs, setMonkeyTurnScenarioProbs] = useState<MonkeyTurnVScenarioProbabilities | null>(null);

  useEffect(() => {
    // Save to localStorage only if Monkey Turn V is the active game mode
    if (localStorage.getItem(LOCAL_STORAGE_KEY_GAME_MODE) === GameMode.MONKEY_TURN_V) {
      localStorage.setItem(LOCAL_STORAGE_KEY_MTV_SCENARIO_INPUTS, JSON.stringify(monkeyTurnScenarioInputs));
    }
  }, [monkeyTurnScenarioInputs]);

  useEffect(() => {
    if (localStorage.getItem(LOCAL_STORAGE_KEY_GAME_MODE) === GameMode.MONKEY_TURN_V) {
      localStorage.setItem(LOCAL_STORAGE_KEY_MTV_RIVAL_MODE, monkeyTurnRivalMode);
    }
  }, [monkeyTurnRivalMode]);

  const handleMonkeyTurnScenarioInputChange = useCallback((round: number, field: keyof Omit<MonkeyTurnVSetInput, 'round'>, value: string | null) => {
    if (round === 8 && field === 'lampColor') return; // 8R lamp is fixed to Rainbow unless startScreen is also set for Teio. Handled in UI.
    setMonkeyTurnScenarioInputs(prev => prev.map(input => input.round === round ? { ...input, [field]: value } : input));
    setInputChangedSinceLastCalc(true);
  }, [setInputChangedSinceLastCalc]);

  const handleMonkeyTurnRivalModeChange = useCallback((newMode: MonkeyTurnRivalMode) => {
    setMonkeyTurnRivalMode(newMode);
    setInputChangedSinceLastCalc(true);
  }, [setInputChangedSinceLastCalc]);

  const handleCalculateMonkeyTurnScenarios = useCallback(() => {
    const hasAnyInput = monkeyTurnScenarioInputs.some(input => input.startScreen !== null || input.lampColor !== null) || monkeyTurnRivalMode !== MonkeyTurnRivalMode.NOT_PRESENT;
    // Check if any user-changeable fields (R1-R7 any field, R8 startScreen) have input. R8 lampColor is fixed unless screen is set (Teio).
    const userChangeableInput = monkeyTurnScenarioInputs.slice(0, 7).some(input => input.startScreen !== null || input.lampColor !== null) || (monkeyTurnScenarioInputs[7].startScreen !== null);
    
    // Alert if no meaningful input is provided by the user. 
    // The fixed R8 Rainbow lamp is not considered a user input for this check unless a start screen is also selected.
    if (!hasAnyInput && !userChangeableInput && monkeyTurnRivalMode === MonkeyTurnRivalMode.NOT_PRESENT) {
        return;
    }
    const probs = calculateMonkeyTurnVProbabilities(monkeyTurnScenarioInputs, monkeyTurnRivalMode);
    setMonkeyTurnScenarioProbs(probs);
    setOtherProbs(null); // Clear setting probabilities
    setInputChangedSinceLastCalc(false);
  }, [monkeyTurnScenarioInputs, monkeyTurnRivalMode, setInputChangedSinceLastCalc, setOtherProbs]);

  const resetMonkeyTurnScenarioInputsAndProbs = useCallback(() => {
    setMonkeyTurnScenarioInputs(initialMonkeyTurnVScenarioInputs);
    setMonkeyTurnRivalMode(MonkeyTurnRivalMode.NOT_PRESENT);
    setMonkeyTurnScenarioProbs(null);
    setInputChangedSinceLastCalc(false);
  }, [initialMonkeyTurnVScenarioInputs, setInputChangedSinceLastCalc]);

  // Effect to load data if game mode changes to MTV after initial load
  useEffect(() => {
    if (currentGameMode === GameMode.MONKEY_TURN_V) {
      const savedInputs = localStorage.getItem(LOCAL_STORAGE_KEY_MTV_SCENARIO_INPUTS);
      if (savedInputs) {
        try {
          const parsed = JSON.parse(savedInputs) as MonkeyTurnVSetInput[];
            if (Array.isArray(parsed) && parsed.length === 8) {
               setMonkeyTurnScenarioInputs(parsed.map((item: any, index: number) => ({
                  round: index + 1,
                  startScreen: item.startScreen && Object.values(MonkeyTurnCharacterName).includes(item.startScreen as MonkeyTurnCharacterName) ? item.startScreen : null,
                  lampColor: index === 7 ? MonkeyTurnLampColor.RAINBOW : (item.lampColor && Object.values(MonkeyTurnLampColor).includes(item.lampColor as MonkeyTurnLampColor) ? item.lampColor : null),
              })));
            } else { setMonkeyTurnScenarioInputs(initialMonkeyTurnVScenarioInputs); }
        } catch { setMonkeyTurnScenarioInputs(initialMonkeyTurnVScenarioInputs); }
      } else {
        setMonkeyTurnScenarioInputs(initialMonkeyTurnVScenarioInputs);
      }

      const savedRivalMode = localStorage.getItem(LOCAL_STORAGE_KEY_MTV_RIVAL_MODE);
      if (savedRivalMode && Object.values(MonkeyTurnRivalMode).includes(savedRivalMode as MonkeyTurnRivalMode)) {
        setMonkeyTurnRivalMode(savedRivalMode as MonkeyTurnRivalMode);
      } else {
        setMonkeyTurnRivalMode(MonkeyTurnRivalMode.NOT_PRESENT);
      }
    }
  }, [currentGameMode, initialMonkeyTurnVScenarioInputs]);


  return {
    monkeyTurnScenarioInputs,
    monkeyTurnRivalMode,
    monkeyTurnScenarioProbs,
    handleMonkeyTurnScenarioInputChange,
    handleMonkeyTurnRivalModeChange,
    handleCalculateMonkeyTurnScenarios,
    resetMonkeyTurnScenarioInputsAndProbs,
    setMonkeyTurnScenarioProbs, // Expose setter for App.tsx to clear
  };
};