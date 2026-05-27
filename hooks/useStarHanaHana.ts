
// hooks/useStarHanaHana.ts
// Fix: Import React to make React namespace available for types.
import React, { useState, useCallback, useEffect } from 'react';
import type { StarHanaHanaInput, StarHanaHanaFullResult } from '../types';
import { GameMode } from '../types';
import { initialStarHanaHanaInputs } from '../constants/starHanaHanaConstants';
import { calculateStarHanaHanaProbabilities } from '../services/starHanaHanaCalculator';

const LOCAL_STORAGE_KEY_SHH_INPUTS = 'starHanaHana_inputs_v1';
const LOCAL_STORAGE_KEY_GAME_MODE = 'pachislotTool_gameMode_v2';

export const useStarHanaHana = (
  setInputChangedSinceLastCalc: React.Dispatch<React.SetStateAction<boolean>>,
  currentGameMode: GameMode
) => {
  const [starHanaHanaInputs, setStarHanaHanaInputs] = useState<StarHanaHanaInput>(() => {
    if (localStorage.getItem(LOCAL_STORAGE_KEY_GAME_MODE) === GameMode.STAR_HANA_HANA) {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SHH_INPUTS);
        if (saved) {
          const parsed = JSON.parse(saved) as StarHanaHanaInput;
          const validatedInputs = {
            ...initialStarHanaHanaInputs,
            ...parsed,
            startNetMedals: (typeof parsed.startNetMedals === 'number' || parsed.startNetMedals === null) ? parsed.startNetMedals : null,
            currentNetMedals: (typeof parsed.currentNetMedals === 'number' || parsed.currentNetMedals === null) ? parsed.currentNetMedals : null,
          };
          if (parsed && typeof parsed.currentTotalGames === 'number' && typeof parsed.startTotalGames === 'number') {
            return validatedInputs;
          }
        }
      } catch (error) { console.error("Failed to load SHH inputs from localStorage:", error); }
    }
    return initialStarHanaHanaInputs;
  });

  const [starHanaHanaProbs, setStarHanaHanaProbs] = useState<StarHanaHanaFullResult | null>(null);

  useEffect(() => {
    if (currentGameMode === GameMode.STAR_HANA_HANA) {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SHH_INPUTS);
        if (saved) {
          const parsed = JSON.parse(saved) as StarHanaHanaInput;
           const validatedInputs = {
            ...initialStarHanaHanaInputs,
            ...parsed,
            startNetMedals: (typeof parsed.startNetMedals === 'number' || parsed.startNetMedals === null) ? parsed.startNetMedals : null,
            currentNetMedals: (typeof parsed.currentNetMedals === 'number' || parsed.currentNetMedals === null) ? parsed.currentNetMedals : null,
          };
          if (parsed && typeof parsed.currentTotalGames === 'number' && typeof parsed.startTotalGames === 'number') {
            setStarHanaHanaInputs(validatedInputs);
          } else {
            setStarHanaHanaInputs(initialStarHanaHanaInputs);
          }
        } else {
          setStarHanaHanaInputs(initialStarHanaHanaInputs);
        }
      } catch (error) {
        console.error("Failed to load SHH inputs on game mode change:", error);
        setStarHanaHanaInputs(initialStarHanaHanaInputs);
      }
    }
  }, [currentGameMode]);

  useEffect(() => {
    if (currentGameMode === GameMode.STAR_HANA_HANA) {
      localStorage.setItem(LOCAL_STORAGE_KEY_SHH_INPUTS, JSON.stringify(starHanaHanaInputs));
    }
  }, [starHanaHanaInputs, currentGameMode]);

  const handleStarHanaHanaInputChange = useCallback((field: keyof StarHanaHanaInput, value: number | null) => {
    setStarHanaHanaInputs(prev => ({ ...prev, [field]: value }));
    setInputChangedSinceLastCalc(true);
  }, [setInputChangedSinceLastCalc]);

  const calculateStarHanaHana = useCallback(() => {
    let calculationInputs = { ...starHanaHanaInputs };
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

    const hasPlayedData = playedGames > 0 || playedBigCount > 0 || playedRegCount > 0 ||
                          calculationInputs.bellCount > 0 ||
                          (calculationInputs.currentNetMedals !== null && calculationInputs.currentNetMedals !== 0);
    const hasStartData = calculationInputs.startTotalGames > 0 || calculationInputs.startBigCount > 0 || calculationInputs.startRegCount > 0 || (calculationInputs.startNetMedals !== null && calculationInputs.startNetMedals !== 0);

    if (!hasStartData && !hasPlayedData) {
      alert(`回転数、ボーナス回数、またはベル回数を1つ以上入力してください。(Star Hana Hana)`);
      return;
    }
    if (playedGames < 0 || playedBigCount < 0 || playedRegCount < 0) {
      alert("「現在のデータ」の数値は「開始時のデータ」の数値以上である必要があります。");
      return;
    }
    
    const probs = calculateStarHanaHanaProbabilities(calculationInputs);
    setStarHanaHanaProbs(probs);
    setInputChangedSinceLastCalc(false);
  }, [starHanaHanaInputs, setInputChangedSinceLastCalc]);

  const resetStarHanaHanaInputsAndProbs = useCallback(() => {
    setStarHanaHanaInputs(initialStarHanaHanaInputs);
    setStarHanaHanaProbs(null);
    setInputChangedSinceLastCalc(false);
  }, [setInputChangedSinceLastCalc]);

  return {
    starHanaHanaInputs,
    starHanaHanaProbs,
    setStarHanaHanaProbs,
    handleStarHanaHanaInputChange,
    calculateStarHanaHana,
    resetStarHanaHanaInputsAndProbs,
  };
};