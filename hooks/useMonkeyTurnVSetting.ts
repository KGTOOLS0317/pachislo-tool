
// hooks/useMonkeyTurnVSetting.ts
// Fix: Import React to make React namespace available for types.
import React, { useState, useCallback, useEffect } from 'react';
import type { MonkeyTurnVSettingInput, MonkeyTurnVSettingFullResult, MonkeyTurnVScenarioProbabilities } from '../types';
import { GameMode } from '../types';
import { initialMonkeyTurnVSettingInputs } from '../constants/monkeyTurnVConstants';
import { calculateMonkeyTurnVSettingProbabilities } from '../services/monkeyTurnVSettingCalculator';

const LOCAL_STORAGE_KEY_MTV_SETTING_INPUTS = 'monkeyTurnV_settingInputs_v1';
const LOCAL_STORAGE_KEY_GAME_MODE = 'pachislotTool_gameMode_v2'; // To check if MTV was the last active mode

export const useMonkeyTurnVSetting = (
  setInputChangedSinceLastCalc: React.Dispatch<React.SetStateAction<boolean>>,
  currentGameMode: GameMode, // Used to determine if initial load from localStorage is relevant
  setOtherProbs: (probs: MonkeyTurnVScenarioProbabilities | null) => void // Setter for scenario probabilities
) => {
  const [monkeyTurnSettingInputs, setMonkeyTurnSettingInputs] = useState<MonkeyTurnVSettingInput>(() => {
    if (currentGameMode === GameMode.MONKEY_TURN_V) {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY_MTV_SETTING_INPUTS);
        if (saved) {
          const parsed = JSON.parse(saved) as MonkeyTurnVSettingInput;
          // Basic validation for the parsed object structure
          if (parsed && typeof parsed.gamesPlayed === 'number') { 
            return { ...initialMonkeyTurnVSettingInputs, ...parsed };
          }
        }
      } catch (error) { console.error("Failed to load MTV setting inputs from localStorage:", error); }
    }
    return initialMonkeyTurnVSettingInputs;
  });

  const [monkeyTurnSettingProbs, setMonkeyTurnSettingProbs] = useState<MonkeyTurnVSettingFullResult | null>(null);

  useEffect(() => {
    if (localStorage.getItem(LOCAL_STORAGE_KEY_GAME_MODE) === GameMode.MONKEY_TURN_V) {
      localStorage.setItem(LOCAL_STORAGE_KEY_MTV_SETTING_INPUTS, JSON.stringify(monkeyTurnSettingInputs));
    }
  }, [monkeyTurnSettingInputs]);

  const handleMonkeyTurnSettingInputChange = useCallback((field: keyof MonkeyTurnVSettingInput, value: number) => {
    setMonkeyTurnSettingInputs(prev => ({ ...prev, [field]: value }));
    setInputChangedSinceLastCalc(true);
  }, [setInputChangedSinceLastCalc]);

  const handleCalculateMonkeyTurnSettings = useCallback(() => {
    if (monkeyTurnSettingInputs.gamesPlayed <= 0 && monkeyTurnSettingInputs.coin5Count <= 0 && monkeyTurnSettingInputs.ochiCount <=0 && monkeyTurnSettingInputs.kehaiCount <=0) {
        alert("設定推測のための条件（ゲーム数、5枚役、落ち、気配のいずれか）を1つ以上入力してください。");
        return;
    }
    if (monkeyTurnSettingInputs.ochiCount < 0 || monkeyTurnSettingInputs.kehaiCount < 0 || monkeyTurnSettingInputs.coin5Count < 0 || monkeyTurnSettingInputs.gamesPlayed < 0) {
      alert("入力値は0以上である必要があります。");
      return;
    }
    if (monkeyTurnSettingInputs.coin5Count > monkeyTurnSettingInputs.gamesPlayed && monkeyTurnSettingInputs.gamesPlayed > 0) {
        alert("5枚役回数はゲーム数以下である必要があります。");
        return;
    }

    const probs = calculateMonkeyTurnVSettingProbabilities(monkeyTurnSettingInputs);
    setMonkeyTurnSettingProbs(probs);
    setOtherProbs(null); // Clear scenario probabilities
    setInputChangedSinceLastCalc(false);
  }, [monkeyTurnSettingInputs, setInputChangedSinceLastCalc, setOtherProbs]);

  const resetMonkeyTurnSettingInputsAndProbs = useCallback(() => {
    setMonkeyTurnSettingInputs(initialMonkeyTurnVSettingInputs);
    setMonkeyTurnSettingProbs(null);
    setInputChangedSinceLastCalc(false);
  }, [initialMonkeyTurnVSettingInputs, setInputChangedSinceLastCalc]);

  // Effect to load data if game mode changes to MTV after initial load
  useEffect(() => {
    if (currentGameMode === GameMode.MONKEY_TURN_V) {
      const savedInputs = localStorage.getItem(LOCAL_STORAGE_KEY_MTV_SETTING_INPUTS);
      try {
          if (savedInputs) {
              const parsed = JSON.parse(savedInputs) as MonkeyTurnVSettingInput;
              if (parsed && typeof parsed.gamesPlayed === 'number') {
                  setMonkeyTurnSettingInputs({ ...initialMonkeyTurnVSettingInputs, ...parsed });
              } else { setMonkeyTurnSettingInputs(initialMonkeyTurnVSettingInputs); }
          } else { setMonkeyTurnSettingInputs(initialMonkeyTurnVSettingInputs); }
      } catch { setMonkeyTurnSettingInputs(initialMonkeyTurnVSettingInputs); }
    }
  }, [currentGameMode]);

  return {
    monkeyTurnSettingInputs,
    monkeyTurnSettingProbs,
    handleMonkeyTurnSettingInputChange,
    handleCalculateMonkeyTurnSettings,
    resetMonkeyTurnSettingInputsAndProbs,
    setMonkeyTurnSettingProbs, // Expose setter for App.tsx to clear
  };
};