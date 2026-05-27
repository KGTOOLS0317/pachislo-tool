
// hooks/useMyJugglerV.ts
// Fix: Import React to make React namespace available for types.
import React, { useState, useCallback, useEffect } from 'react';
import type { MyJugglerVInput, MyJugglerVFullResult } from '../types';
import { GameMode } from '../types';
import { initialMyJugglerVInputs } from '../constants/myJugglerVConstants';
import { calculateMyJugglerVProbabilities } from '../services/myJugglerVCalculator';

const LOCAL_STORAGE_KEY_MJV_INPUTS = 'myJugglerV_inputs_v3'; // Incremented version
const LOCAL_STORAGE_KEY_GAME_MODE = 'pachislotTool_gameMode_v2';

export const useMyJugglerV = (
  setInputChangedSinceLastCalc: React.Dispatch<React.SetStateAction<boolean>>,
  currentGameMode: GameMode
) => {
  const [myJugglerVInputs, setMyJugglerVInputs] = useState<MyJugglerVInput>(() => {
    if (localStorage.getItem(LOCAL_STORAGE_KEY_GAME_MODE) === GameMode.MY_JUGGLER_V) {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY_MJV_INPUTS);
        if (saved) {
          const parsed = JSON.parse(saved) as MyJugglerVInput;
          const validatedInputs = {
            ...initialMyJugglerVInputs,
            ...parsed,
            startNetMedals: (typeof parsed.startNetMedals === 'number' || parsed.startNetMedals === null) ? parsed.startNetMedals : null,
            currentNetMedals: (typeof parsed.currentNetMedals === 'number' || parsed.currentNetMedals === null) ? parsed.currentNetMedals : null,
          };
          if (parsed && typeof parsed.currentTotalGames === 'number' && typeof parsed.startTotalGames === 'number') {
            return validatedInputs;
          }
        }
      } catch (error) { console.error("Failed to load MJV inputs from localStorage:", error); }
    }
    return initialMyJugglerVInputs;
  });

  const [myJugglerVProbs, setMyJugglerVProbs] = useState<MyJugglerVFullResult | null>(null);

  useEffect(() => {
    if (currentGameMode === GameMode.MY_JUGGLER_V) {
       try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY_MJV_INPUTS);
        if (saved) {
          const parsed = JSON.parse(saved) as MyJugglerVInput;
           const validatedInputs = {
            ...initialMyJugglerVInputs,
            ...parsed,
            startNetMedals: (typeof parsed.startNetMedals === 'number' || parsed.startNetMedals === null) ? parsed.startNetMedals : null,
            currentNetMedals: (typeof parsed.currentNetMedals === 'number' || parsed.currentNetMedals === null) ? parsed.currentNetMedals : null,
          };
          if (parsed && typeof parsed.currentTotalGames === 'number' && typeof parsed.startTotalGames === 'number') {
            setMyJugglerVInputs(validatedInputs);
          } else {
            setMyJugglerVInputs(initialMyJugglerVInputs);
          }
        } else {
          setMyJugglerVInputs(initialMyJugglerVInputs);
        }
      } catch (error) {
        console.error("Failed to load MJV inputs on game mode change:", error);
        setMyJugglerVInputs(initialMyJugglerVInputs);
      }
    }
  }, [currentGameMode]);

  useEffect(() => {
    if (currentGameMode === GameMode.MY_JUGGLER_V) {
      localStorage.setItem(LOCAL_STORAGE_KEY_MJV_INPUTS, JSON.stringify(myJugglerVInputs));
    }
  }, [myJugglerVInputs, currentGameMode]);

  const handleMyJugglerVInputChange = useCallback((field: keyof MyJugglerVInput, value: number | null) => {
    setMyJugglerVInputs(prev => ({ ...prev, [field]: value }));
    setInputChangedSinceLastCalc(true);
  }, [setInputChangedSinceLastCalc]);

  const calculateMyJugglerV = useCallback(() => {
    let calculationInputs = { ...myJugglerVInputs };
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
    const hasMyJugglerSpecificCounts = [
          calculationInputs.nonDuplicateCherryCount,
          calculationInputs.soloBigCount, calculationInputs.cherryBigCount,
          calculationInputs.soloRegCount, calculationInputs.cherryRegCount
      ].some(count => count > 0);
    const hasPlayedData = playedGames > 0 || playedBigCount > 0 || playedRegCount > 0 ||
                          calculationInputs.bellCount > 0 || hasMyJugglerSpecificCounts ||
                          (calculationInputs.currentNetMedals !== null && calculationInputs.currentNetMedals !== 0);

    const hasStartData = calculationInputs.startTotalGames > 0 || calculationInputs.startBigCount > 0 || calculationInputs.startRegCount > 0 || (calculationInputs.startNetMedals !== null && calculationInputs.startNetMedals !== 0);

    if (!hasStartData && !hasPlayedData) {
      alert(`回転数、ボーナス回数、またはその他の要素を1つ以上入力してください。(My Juggler V)`);
      return;
    }
    if (playedGames < 0 || playedBigCount < 0 || playedRegCount < 0) {
      alert("「現在のデータ」の数値は「開始時のデータ」の数値以上である必要があります。");
      return;
    }
    if (calculationInputs.soloBigCount + calculationInputs.cherryBigCount > playedBigCount && playedBigCount > 0) {
        alert("単独BIGとチェリーBIGの合計回数は、実際にプレイしたBIG回数以下である必要があります。");
        return;
    }
    if (calculationInputs.soloRegCount + calculationInputs.cherryRegCount > playedRegCount && playedRegCount > 0) {
        alert("単独REGとチェリーREGの合計回数は、実際にプレイしたREG回数以下である必要があります。");
        return;
    }
    const probs = calculateMyJugglerVProbabilities(calculationInputs);
    setMyJugglerVProbs(probs);
    setInputChangedSinceLastCalc(false);
  }, [myJugglerVInputs, setInputChangedSinceLastCalc]);

  const resetMyJugglerVInputsAndProbs = useCallback(() => {
    setMyJugglerVInputs(initialMyJugglerVInputs);
    setMyJugglerVProbs(null);
    setInputChangedSinceLastCalc(false);
  }, [setInputChangedSinceLastCalc]);

  return {
    myJugglerVInputs,
    myJugglerVProbs,
    setMyJugglerVProbs,
    handleMyJugglerVInputChange,
    calculateMyJugglerV,
    resetMyJugglerVInputsAndProbs,
  };
};