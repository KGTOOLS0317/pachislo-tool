
// hooks/useKingHanaHanaS.ts
// Fix: Import React to make React namespace available for types.
import React, { useState, useCallback, useEffect } from 'react';
import type { KingHanaHanaSInput, KingHanaHanaSFullResult } from '../types';
import { GameMode } from '../types';
import { initialKingHanaHanaSInputs } from '../constants/kingHanaHanaSConstants';
import { calculateKingHanaHanaSProbabilities } from '../services/kingHanaHanaSCalculator';

const LOCAL_STORAGE_KEY_KHH_INPUTS = 'kingHanaHanaS_inputs_v6'; // Incremented version for new field
const LOCAL_STORAGE_KEY_GAME_MODE = 'pachislotTool_gameMode_v2';

export const useKingHanaHanaS = (
  setInputChangedSinceLastCalc: React.Dispatch<React.SetStateAction<boolean>>,
  currentGameMode: GameMode
) => {
  const [kingHanaHanaInputs, setKingHanaHanaInputs] = useState<KingHanaHanaSInput>(() => {
    if (localStorage.getItem(LOCAL_STORAGE_KEY_GAME_MODE) === GameMode.KING_HANA_HANA_S) {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY_KHH_INPUTS);
        if (saved) {
          const parsed = JSON.parse(saved) as KingHanaHanaSInput;
          // Ensure currentNetMedals is either number or null after parsing
          const validatedInputs = {
            ...initialKingHanaHanaSInputs,
            ...parsed,
            startNetMedals: (typeof parsed.startNetMedals === 'number' || parsed.startNetMedals === null) ? parsed.startNetMedals : null,
            currentNetMedals: (typeof parsed.currentNetMedals === 'number' || parsed.currentNetMedals === null) ? parsed.currentNetMedals : null,
          };
          if (parsed && typeof parsed.currentTotalGames === 'number' && typeof parsed.startTotalGames === 'number') {
            return validatedInputs;
          }
        }
      } catch (error) { console.error("Failed to load KHH inputs from localStorage:", error); }
    }
    return initialKingHanaHanaSInputs;
  });

  const [kingHanaHanaProbs, setKingHanaHanaProbs] = useState<KingHanaHanaSFullResult | null>(null);

  useEffect(() => {
    if (currentGameMode === GameMode.KING_HANA_HANA_S) {
      try {
        const savedInputs = localStorage.getItem(LOCAL_STORAGE_KEY_KHH_INPUTS);
        if (savedInputs) {
          const parsed = JSON.parse(savedInputs) as KingHanaHanaSInput;
          const validatedInputs = {
            ...initialKingHanaHanaSInputs,
            ...parsed,
            startNetMedals: (typeof parsed.startNetMedals === 'number' || parsed.startNetMedals === null) ? parsed.startNetMedals : null,
            currentNetMedals: (typeof parsed.currentNetMedals === 'number' || parsed.currentNetMedals === null) ? parsed.currentNetMedals : null,
          };
           if (parsed && typeof parsed.currentTotalGames === 'number' && typeof parsed.startTotalGames === 'number') {
            setKingHanaHanaInputs(validatedInputs);
          } else { setKingHanaHanaInputs(initialKingHanaHanaSInputs); }
        } else { setKingHanaHanaInputs(initialKingHanaHanaSInputs); }

      } catch (error) {
        console.error("Failed to load KHH data on game mode change:", error);
        setKingHanaHanaInputs(initialKingHanaHanaSInputs);
      }
    }
  }, [currentGameMode]);

  useEffect(() => {
    if (currentGameMode === GameMode.KING_HANA_HANA_S) {
      localStorage.setItem(LOCAL_STORAGE_KEY_KHH_INPUTS, JSON.stringify(kingHanaHanaInputs));
    }
  }, [kingHanaHanaInputs, currentGameMode]);


  const handleKingHanaHanaInputChange = useCallback((field: keyof KingHanaHanaSInput, value: number | null) => {
    setKingHanaHanaInputs(prev => ({ ...prev, [field]: value }));
    setInputChangedSinceLastCalc(true);
  }, [setInputChangedSinceLastCalc]);

  const calculateKingHanaHanaS = useCallback(() => {
    let calculationInputs = { ...kingHanaHanaInputs };
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
            // currentNetMedals should not be overridden here, it's independent
        };
    }

    const playedGames = calculationInputs.currentTotalGames - calculationInputs.startTotalGames;
    const playedBigCount = calculationInputs.currentBigCount - calculationInputs.startBigCount;
    const playedRegCount = calculationInputs.currentRegCount - calculationInputs.startRegCount;

    let hasAnyLampCount = [
      calculationInputs.regDuringSideLampBlueCount, calculationInputs.regDuringSideLampYellowCount, calculationInputs.regDuringSideLampGreenCount, calculationInputs.regDuringSideLampRedCount, calculationInputs.regDuringSideLampRainbowCount,
      calculationInputs.bigAfterSideLampBlueCount, calculationInputs.bigAfterSideLampYellowCount, calculationInputs.bigAfterSideLampGreenCount, calculationInputs.bigAfterSideLampRedCount, calculationInputs.bigAfterSideLampRainbowCount,
      calculationInputs.regAfterSideLampBlueCount, calculationInputs.regAfterSideLampYellowCount, calculationInputs.regAfterSideLampGreenCount, calculationInputs.regAfterSideLampRedCount, calculationInputs.regAfterSideLampRainbowCount
    ].some(count => count > 0);

    const hasPlayedData = playedGames > 0 || playedBigCount > 0 || playedRegCount > 0 ||
                          calculationInputs.bellCount > 0 ||
                          (calculationInputs.watermelonInBigCount > 0 || calculationInputs.bigBlankCount > 0 || (calculationInputs.retroSoundNumerator > 0 && calculationInputs.retroSoundDenominator > 0)) ||
                          hasAnyLampCount ||
                          (calculationInputs.currentNetMedals !== null && calculationInputs.currentNetMedals !== 0); // Consider net medals as played data

    const hasStartData = calculationInputs.startTotalGames > 0 || calculationInputs.startBigCount > 0 || calculationInputs.startRegCount > 0 || (calculationInputs.startNetMedals !== null && calculationInputs.startNetMedals !== 0);

    if (!hasStartData && !hasPlayedData) {
      alert(`回転数、ボーナス回数、またはその他の要素を1つ以上入力してください。(King Hana Hana S)`);
      setKingHanaHanaProbs(null); // Clear previous results if any
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

    const probs = calculateKingHanaHanaSProbabilities(calculationInputs);
    setKingHanaHanaProbs(probs);
    setInputChangedSinceLastCalc(false);
  }, [kingHanaHanaInputs, setInputChangedSinceLastCalc]);

  const resetKingHanaHanaSInputsAndProbs = useCallback(() => {
    setKingHanaHanaInputs(initialKingHanaHanaSInputs);
    setKingHanaHanaProbs(null);
    setInputChangedSinceLastCalc(false);
  }, [setInputChangedSinceLastCalc]);

  return {
    kingHanaHanaInputs,
    kingHanaHanaProbs,
    setKingHanaHanaProbs,
    handleKingHanaHanaInputChange,
    calculateKingHanaHanaS,
    resetKingHanaHanaSInputsAndProbs,
  };
};