// hooks/useNewGetterMouse.ts
import React, { useState, useCallback, useEffect } from 'react';
import type { NewGetterMouseInput, NewGetterMouseFullResult } from '../types';
import { GameMode } from '../types';
import { initialNewGetterMouseInputs } from '../constants/newGetterMouseConstants';
import { calculateNewGetterMouseProbabilities } from '../services/newGetterMouseCalculator';

const LOCAL_STORAGE_KEY_NGM_INPUTS = 'newGetterMouse_inputs_v1';
const LOCAL_STORAGE_KEY_GAME_MODE = 'pachislotTool_gameMode_v2';

export const useNewGetterMouse = (
  setInputChangedSinceLastCalc: React.Dispatch<React.SetStateAction<boolean>>,
  currentGameMode: GameMode
) => {
  const [newGetterMouseInputs, setNewGetterMouseInputs] = useState<NewGetterMouseInput>(() => {
    if (localStorage.getItem(LOCAL_STORAGE_KEY_GAME_MODE) === GameMode.NEW_GETTER_MOUSE) {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY_NGM_INPUTS);
        if (saved) {
          const parsed = JSON.parse(saved) as NewGetterMouseInput;
          const validatedInputs = {
            ...initialNewGetterMouseInputs,
            ...parsed,
            currentNetMedals: (typeof parsed.currentNetMedals === 'number' || parsed.currentNetMedals === null) ? parsed.currentNetMedals : null,
          };
          if (parsed && typeof parsed.currentTotalGames === 'number') {
            return validatedInputs;
          }
        }
      } catch (error) { console.error("Failed to load NGM inputs from localStorage:", error); }
    }
    return initialNewGetterMouseInputs;
  });

  const [newGetterMouseProbs, setNewGetterMouseProbs] = useState<NewGetterMouseFullResult | null>(null);

  useEffect(() => {
    if (currentGameMode === GameMode.NEW_GETTER_MOUSE) {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY_NGM_INPUTS);
        if (saved) {
          const parsed = JSON.parse(saved) as NewGetterMouseInput;
          const validatedInputs = {
            ...initialNewGetterMouseInputs,
            ...parsed,
            currentNetMedals: (typeof parsed.currentNetMedals === 'number' || parsed.currentNetMedals === null) ? parsed.currentNetMedals : null,
          };
          if (parsed && typeof parsed.currentTotalGames === 'number') {
            setNewGetterMouseInputs(validatedInputs);
          } else {
            setNewGetterMouseInputs(initialNewGetterMouseInputs);
          }
        } else {
          setNewGetterMouseInputs(initialNewGetterMouseInputs);
        }
      } catch (error) {
        console.error("Failed to load NGM inputs on game mode change:", error);
        setNewGetterMouseInputs(initialNewGetterMouseInputs);
      }
    }
  }, [currentGameMode]);

  useEffect(() => {
    if (currentGameMode === GameMode.NEW_GETTER_MOUSE) {
      localStorage.setItem(LOCAL_STORAGE_KEY_NGM_INPUTS, JSON.stringify(newGetterMouseInputs));
    }
  }, [newGetterMouseInputs, currentGameMode]);

  const handleNewGetterMouseInputChange = useCallback((field: keyof NewGetterMouseInput, value: number | null) => {
    setNewGetterMouseInputs(prev => ({ ...prev, [field]: value }));
    setInputChangedSinceLastCalc(true);
  }, [setInputChangedSinceLastCalc]);

  const calculateNewGetterMouse = useCallback(() => {
    let calculationInputs = { ...newGetterMouseInputs };
    if (
        (calculationInputs.startTotalGames > 0 || calculationInputs.startBigCount > 0 || calculationInputs.startRegCount > 0) &&
        calculationInputs.currentTotalGames === 0 &&
        calculationInputs.currentBigCount === 0 &&
        calculationInputs.currentRegCount === 0
    ) {
        calculationInputs = {
            ...calculationInputs,
            currentTotalGames: calculationInputs.startTotalGames,
            currentBigCount: calculationInputs.startBigCount,
            currentRegCount: calculationInputs.startRegCount,
        };
    }
    const playedGames = calculationInputs.currentTotalGames - calculationInputs.startTotalGames;
    const playedBigCount = calculationInputs.currentBigCount - calculationInputs.startBigCount;
    const playedRegCount = calculationInputs.currentRegCount - calculationInputs.startRegCount;
    
    const hasAnyCounts = Object.entries(calculationInputs).some(([key, val]) => {
      if (key === 'currentNetMedals') return false;
      return typeof val === 'number' && val > 0;
    });
    
    if (!hasAnyCounts && calculationInputs.currentNetMedals === null) {
      alert(`回転数、ボーナス回数、またはその他の要素を1つ以上入力してください。(New Getter Mouse)`);
      return;
    }
    if (playedGames < 0 || playedBigCount < 0 || playedRegCount < 0) {
      alert("「現在のデータ」の数値は「開始時のデータ」の数値以上である必要があります。");
      return;
    }
    
    const probs = calculateNewGetterMouseProbabilities(calculationInputs);
    setNewGetterMouseProbs(probs);
    setInputChangedSinceLastCalc(false);
  }, [newGetterMouseInputs, setInputChangedSinceLastCalc]);

  const resetNewGetterMouseInputsAndProbs = useCallback(() => {
    setNewGetterMouseInputs(initialNewGetterMouseInputs);
    setNewGetterMouseProbs(null);
    setInputChangedSinceLastCalc(false);
  }, [setInputChangedSinceLastCalc]);

  return {
    newGetterMouseInputs,
    newGetterMouseProbs,
    setNewGetterMouseProbs,
    handleNewGetterMouseInputChange,
    calculateNewGetterMouse,
    resetNewGetterMouseInputsAndProbs,
  };
};