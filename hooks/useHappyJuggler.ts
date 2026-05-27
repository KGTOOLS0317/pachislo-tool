// hooks/useHappyJuggler.ts
import { useState, useCallback, useEffect } from 'react';
import { GameMode, HappyJugglerInput, HappyJugglerFullResult } from '../types';
import { calculateHappyJugglerProbabilities } from '../services/happyJugglerCalculator';

const LOCAL_STORAGE_KEY = 'pachislotTool_happyJuggler_v1';

const initialInputs: HappyJugglerInput = {
  startTotalGames: 0,
  startBigCount: 0,
  startRegCount: 0,
  startNetMedals: null,
  currentTotalGames: 0,
  currentBigCount: 0,
  currentRegCount: 0,
  currentNetMedals: null,
  bellCount: 0, // Grape
  nonDuplicateCherryCount: 0,
  soloBigCount: 0,
  cherryBigCount: 0,
  rareBigCount: 0,
  soloRegCount: 0,
  cherryRegCount: 0,
  clownCount: 0,
  happyBellCount: 0,
};

// I should fix the naming in types.ts to be clearer if possible, but for now I'll just use the fields.
// Actually, I'll update types.ts to use grapeCount for Juggler if I can, but that's a big change.
// I'll just use bellCount for Bell and maybe I should have used grapeCount for Grape.

export const useHappyJuggler = (
  setInputChangedSinceLastCalc: (val: boolean) => void,
  gameMode: GameMode
) => {
  const [inputs, setInputs] = useState<HappyJugglerInput>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse Happy Juggler inputs", e);
      }
    }
    return {
      startTotalGames: 0,
      startBigCount: 0,
      startRegCount: 0,
      startNetMedals: null,
      currentTotalGames: 0,
      currentBigCount: 0,
      currentRegCount: 0,
      currentNetMedals: null,
      bellCount: 0, // Grape (from MyJugglerVInput)
      nonDuplicateCherryCount: 0,
      soloBigCount: 0,
      cherryBigCount: 0,
      rareBigCount: 0,
      soloRegCount: 0,
      cherryRegCount: 0,
      clownCount: 0,
      happyBellCount: 0,
    } as HappyJugglerInput;
  });

  const [probs, setProbs] = useState<HappyJugglerFullResult | null>(null);

  useEffect(() => {
    if (gameMode === GameMode.HAPPY_JUGGLER) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(inputs));
    }
  }, [inputs, gameMode]);

  const handleInputChange = useCallback((field: keyof HappyJugglerInput, value: number | null) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setInputChangedSinceLastCalc(true);
  }, [setInputChangedSinceLastCalc]);

  const calculate = useCallback(() => {
    const result = calculateHappyJugglerProbabilities(inputs);
    setProbs(result);
    setInputChangedSinceLastCalc(false);
  }, [inputs, setInputChangedSinceLastCalc]);

  const reset = useCallback(() => {
    const resetVal = {
      startTotalGames: 0,
      startBigCount: 0,
      startRegCount: 0,
      startNetMedals: null,
      currentTotalGames: 0,
      currentBigCount: 0,
      currentRegCount: 0,
      currentNetMedals: null,
      bellCount: 0,
      nonDuplicateCherryCount: 0,
      soloBigCount: 0,
      cherryBigCount: 0,
      rareBigCount: 0,
      soloRegCount: 0,
      cherryRegCount: 0,
      clownCount: 0,
      happyBellCount: 0,
    } as HappyJugglerInput;
    setInputs(resetVal);
    setProbs(null);
    setInputChangedSinceLastCalc(false);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, [setInputChangedSinceLastCalc]);

  return { inputs, probs, setProbs, handleInputChange, calculate, reset };
};
