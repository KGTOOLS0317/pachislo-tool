
// hooks/useDragonHanaHanaSenkou.ts
// Fix: Import React to make React namespace available for types.
import React, { useState, useCallback, useEffect } from 'react';
import type { DragonHanaHanaSenkouInput, DragonHanaHanaSenkouFullResult } from '../types';
import { GameMode } from '../types';
import { initialDragonHanaHanaSenkouInputs } from '../constants/dragonHanaHanaSenkouConstants';
import { calculateDragonHanaHanaSenkouProbabilities } from '../services/dragonHanaHanaSenkouCalculator';

const LOCAL_STORAGE_KEY_DHH_INPUTS = 'dragonHanaHanaSenkou_inputs_v1';
const LOCAL_STORAGE_KEY_GAME_MODE = 'pachislotTool_gameMode_v2';

export const useDragonHanaHanaSenkou = (
  setInputChangedSinceLastCalc: React.Dispatch<React.SetStateAction<boolean>>,
  currentGameMode: GameMode
) => {
  const [dragonHanaHanaSenkouInputs, setDragonHanaHanaSenkouInputs] = useState<DragonHanaHanaSenkouInput>(() => {
    if (localStorage.getItem(LOCAL_STORAGE_KEY_GAME_MODE) === GameMode.DRAGON_HANA_HANA_SENKOU) {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY_DHH_INPUTS);
        if (saved) {
          const parsed = JSON.parse(saved) as DragonHanaHanaSenkouInput;
          const validatedInputs = {
            ...initialDragonHanaHanaSenkouInputs,
            ...parsed,
            startNetMedals: (typeof parsed.startNetMedals === 'number' || parsed.startNetMedals === null) ? parsed.startNetMedals : null,
            currentNetMedals: (typeof parsed.currentNetMedals === 'number' || parsed.currentNetMedals === null) ? parsed.currentNetMedals : null,
          };
          if (parsed && typeof parsed.currentTotalGames === 'number' && typeof parsed.startTotalGames === 'number') {
            return validatedInputs;
          }
        }
      } catch (error) { console.error("Failed to load DHH inputs from localStorage:", error); }
    }
    return initialDragonHanaHanaSenkouInputs;
  });

  const [dragonHanaHanaSenkouProbs, setDragonHanaHanaSenkouProbs] = useState<DragonHanaHanaSenkouFullResult | null>(null);

  useEffect(() => {
    if (currentGameMode === GameMode.DRAGON_HANA_HANA_SENKOU) {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY_DHH_INPUTS);
        if (saved) {
          const parsed = JSON.parse(saved) as DragonHanaHanaSenkouInput;
          const validatedInputs = {
            ...initialDragonHanaHanaSenkouInputs,
            ...parsed,
            startNetMedals: (typeof parsed.startNetMedals === 'number' || parsed.startNetMedals === null) ? parsed.startNetMedals : null,
            currentNetMedals: (typeof parsed.currentNetMedals === 'number' || parsed.currentNetMedals === null) ? parsed.currentNetMedals : null,
          };
          if (parsed && typeof parsed.currentTotalGames === 'number' && typeof parsed.startTotalGames === 'number') {
            setDragonHanaHanaSenkouInputs(validatedInputs);
          } else {
            setDragonHanaHanaSenkouInputs(initialDragonHanaHanaSenkouInputs);
          }
        } else {
          setDragonHanaHanaSenkouInputs(initialDragonHanaHanaSenkouInputs);
        }
      } catch (error) {
        console.error("Failed to load DHH inputs on game mode change:", error);
        setDragonHanaHanaSenkouInputs(initialDragonHanaHanaSenkouInputs);
      }
    }
  }, [currentGameMode]);

  useEffect(() => {
    if (currentGameMode === GameMode.DRAGON_HANA_HANA_SENKOU) {
      localStorage.setItem(LOCAL_STORAGE_KEY_DHH_INPUTS, JSON.stringify(dragonHanaHanaSenkouInputs));
    }
  }, [dragonHanaHanaSenkouInputs, currentGameMode]);

  const handleDragonHanaHanaSenkouInputChange = useCallback((field: keyof DragonHanaHanaSenkouInput, value: number | null) => {
    setDragonHanaHanaSenkouInputs(prev => ({ ...prev, [field]: value }));
    setInputChangedSinceLastCalc(true);
  }, [setInputChangedSinceLastCalc]);

  const calculateDragonHanaHanaSenkou = useCallback(() => {
    let calculationInputs = { ...dragonHanaHanaSenkouInputs };
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
      alert(`回転数、ボーナス回数、またはベル回数を1つ以上入力してください。(Dragon Hana Hana Senkou)`);
      return;
    }
    if (playedGames < 0 || playedBigCount < 0 || playedRegCount < 0) {
      alert("「現在のデータ」の数値は「開始時のデータ」の数値以上である必要があります。");
      return;
    }
    
    const probs = calculateDragonHanaHanaSenkouProbabilities(calculationInputs);
    setDragonHanaHanaSenkouProbs(probs);
    setInputChangedSinceLastCalc(false);
  }, [dragonHanaHanaSenkouInputs, setInputChangedSinceLastCalc]);

  const resetDragonHanaHanaSenkouInputsAndProbs = useCallback(() => {
    setDragonHanaHanaSenkouInputs(initialDragonHanaHanaSenkouInputs);
    setDragonHanaHanaSenkouProbs(null);
    setInputChangedSinceLastCalc(false);
  }, [setInputChangedSinceLastCalc]);

  return {
    dragonHanaHanaSenkouInputs,
    dragonHanaHanaSenkouProbs,
    setDragonHanaHanaSenkouProbs,
    handleDragonHanaHanaSenkouInputChange,
    calculateDragonHanaHanaSenkou,
    resetDragonHanaHanaSenkouInputsAndProbs,
  };
};