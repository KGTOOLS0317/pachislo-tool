
// hooks/useHanaHanaHouou.ts
// Fix: Import React to make React namespace available for types.
import React, { useState, useCallback, useEffect } from 'react';
import type { HanaHanaHououInput, HanaHanaHououFullResult } from '../types';
import { GameMode } from '../types';
import { initialHanaHanaHououInputs } from '../constants/hanaHanaHououConstants';
import { calculateHanaHanaHououProbabilities } from '../services/hanaHanaHououCalculator';

const LOCAL_STORAGE_KEY_HHH_INPUTS = 'hanaHanaHouou_inputs_v2'; // Incremented version
const LOCAL_STORAGE_KEY_GAME_MODE = 'pachislotTool_gameMode_v2';

export const useHanaHanaHouou = (
  setInputChangedSinceLastCalc: React.Dispatch<React.SetStateAction<boolean>>,
  currentGameMode: GameMode
) => {
  const [hanaHanaHououInputs, setHanaHanaHououInputs] = useState<HanaHanaHououInput>(() => {
    if (localStorage.getItem(LOCAL_STORAGE_KEY_GAME_MODE) === GameMode.HANA_HANA_HOUOU) {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY_HHH_INPUTS);
        if (saved) {
          const parsed = JSON.parse(saved) as HanaHanaHououInput;
           const validatedInputs = {
            ...initialHanaHanaHououInputs,
            ...parsed,
            startNetMedals: (typeof parsed.startNetMedals === 'number' || parsed.startNetMedals === null) ? parsed.startNetMedals : null,
            currentNetMedals: (typeof parsed.currentNetMedals === 'number' || parsed.currentNetMedals === null) ? parsed.currentNetMedals : null,
          };
          if (parsed && typeof parsed.currentTotalGames === 'number' && typeof parsed.startTotalGames === 'number') {
            return validatedInputs;
          }
        }
      } catch (error) { console.error("Failed to load HHH inputs from localStorage:", error); }
    }
    return initialHanaHanaHououInputs;
  });

  const [hanaHanaHououProbs, setHanaHanaHououProbs] = useState<HanaHanaHououFullResult | null>(null);

  useEffect(() => {
    if (currentGameMode === GameMode.HANA_HANA_HOUOU) {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY_HHH_INPUTS);
        if (saved) {
          const parsed = JSON.parse(saved) as HanaHanaHououInput;
          const validatedInputs = {
            ...initialHanaHanaHououInputs,
            ...parsed,
            startNetMedals: (typeof parsed.startNetMedals === 'number' || parsed.startNetMedals === null) ? parsed.startNetMedals : null,
            currentNetMedals: (typeof parsed.currentNetMedals === 'number' || parsed.currentNetMedals === null) ? parsed.currentNetMedals : null,
          };
           if (parsed && typeof parsed.currentTotalGames === 'number' && typeof parsed.startTotalGames === 'number') {
            setHanaHanaHououInputs(validatedInputs);
          } else {
            setHanaHanaHououInputs(initialHanaHanaHououInputs);
          }
        } else {
          setHanaHanaHououInputs(initialHanaHanaHououInputs);
        }
      } catch (error) {
        console.error("Failed to load HHH inputs on game mode change:", error);
        setHanaHanaHououInputs(initialHanaHanaHououInputs);
      }
    }
  }, [currentGameMode]);

  useEffect(() => {
    if (currentGameMode === GameMode.HANA_HANA_HOUOU) {
      localStorage.setItem(LOCAL_STORAGE_KEY_HHH_INPUTS, JSON.stringify(hanaHanaHououInputs));
    }
  }, [hanaHanaHououInputs, currentGameMode]);

  const handleHanaHanaHououInputChange = useCallback((field: keyof HanaHanaHououInput, value: number | null) => {
    setHanaHanaHououInputs(prev => ({ ...prev, [field]: value }));
    setInputChangedSinceLastCalc(true);
  }, [setInputChangedSinceLastCalc]);

  const calculateHanaHanaHouou = useCallback(() => {
    let calculationInputs = { ...hanaHanaHououInputs };
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
    const hasAnyLampCount = [
      calculationInputs.regDuringSideLampBlueCount, calculationInputs.regDuringSideLampYellowCount, calculationInputs.regDuringSideLampGreenCount, calculationInputs.regDuringSideLampRedCount, calculationInputs.regDuringSideLampRainbowCount,
      calculationInputs.bigAfterSideLampBlueCount, calculationInputs.bigAfterSideLampYellowCount, calculationInputs.bigAfterSideLampGreenCount, calculationInputs.bigAfterSideLampRedCount, calculationInputs.bigAfterSideLampRainbowCount,
      calculationInputs.regAfterSideLampBlueCount, calculationInputs.regAfterSideLampYellowCount, calculationInputs.regAfterSideLampGreenCount, calculationInputs.regAfterSideLampRedCount, calculationInputs.regAfterSideLampRainbowCount
    ].some(count => count > 0);
    const hasPlayedData = playedGames > 0 || playedBigCount > 0 || playedRegCount > 0 ||
                          calculationInputs.bellCount > 0 ||
                          (calculationInputs.watermelonInBigCount > 0 || calculationInputs.bigBlankCount > 0 || (calculationInputs.retroSoundNumerator > 0 && calculationInputs.retroSoundDenominator > 0)) ||
                          hasAnyLampCount ||
                          (calculationInputs.currentNetMedals !== null && calculationInputs.currentNetMedals !== 0);

    const hasStartData = calculationInputs.startTotalGames > 0 || calculationInputs.startBigCount > 0 || calculationInputs.startRegCount > 0 || (calculationInputs.startNetMedals !== null && calculationInputs.startNetMedals !== 0);

    if (!hasStartData && !hasPlayedData) {
      alert(`回転数、ボーナス回数、またはその他の要素を1つ以上入力してください。(Hana Hana Houou)`);
      return;
    }
    if (playedGames < 0 || playedBigCount < 0 || playedRegCount < 0) {
      alert("「現在のデータ」の数値は「開始時のデータ」の数値以上である必要があります。");
      return;
    }
     if (calculationInputs.retroSoundNumerator > 0 && calculationInputs.retroSoundDenominator <= 0) {
      alert("レトロサウンドの分母（BIG回数またはレトロ機会）は0より大きい値を入力してください。");
      return;
    }
     if (calculationInputs.retroSoundNumerator > calculationInputs.retroSoundDenominator && calculationInputs.retroSoundDenominator > 0) {
      alert("レトロサウンドの発生回数はBIG回数（分母）以下である必要があります。");
      return;
    }
    const probs = calculateHanaHanaHououProbabilities(calculationInputs);
    setHanaHanaHououProbs(probs);
    setInputChangedSinceLastCalc(false);
  }, [hanaHanaHououInputs, setInputChangedSinceLastCalc]);

  const resetHanaHanaHououInputsAndProbs = useCallback(() => {
    setHanaHanaHououInputs(initialHanaHanaHououInputs);
    setHanaHanaHououProbs(null);
    setInputChangedSinceLastCalc(false);
  }, [setInputChangedSinceLastCalc]);

  return {
    hanaHanaHououInputs,
    hanaHanaHououProbs,
    setHanaHanaHououProbs,
    handleHanaHanaHououInputChange,
    calculateHanaHanaHouou,
    resetHanaHanaHououInputsAndProbs,
  };
};