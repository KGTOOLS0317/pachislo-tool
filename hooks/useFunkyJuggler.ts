// hooks/useFunkyJuggler.ts
import React, { useState, useCallback, useEffect } from 'react';
import type { FunkyJugglerInput, FunkyJugglerFullResult } from '../types';
import { GameMode } from '../types';
import { initialFunkyJugglerInputs } from '../constants/funkyJugglerConstants';
import { calculateJugglerSeriesProbabilities } from '../services/jugglerSeriesCalculator';

const LOCAL_STORAGE_KEY = 'funkyJuggler_inputs_v1';

export const useFunkyJuggler = (
  setInputChangedSinceLastCalc: React.Dispatch<React.SetStateAction<boolean>>,
  currentGameMode: GameMode
) => {
  const [inputs, setInputs] = useState<FunkyJugglerInput>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return { ...initialFunkyJugglerInputs, ...JSON.parse(saved) };
    } catch {}
    return initialFunkyJugglerInputs;
  });

  const [probs, setProbs] = useState<FunkyJugglerFullResult | null>(null);

  useEffect(() => {
    if (currentGameMode === GameMode.FUNKY_JUGGLER) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(inputs));
    }
  }, [inputs, currentGameMode]);

  const handleInputChange = useCallback((field: keyof FunkyJugglerInput, value: number | null) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setInputChangedSinceLastCalc(true);
  }, [setInputChangedSinceLastCalc]);

  const calculate = useCallback(() => {
    const res = calculateJugglerSeriesProbabilities(GameMode.FUNKY_JUGGLER, inputs);
    setProbs(res);
    setInputChangedSinceLastCalc(false);
  }, [inputs, setInputChangedSinceLastCalc]);

  return { inputs, probs, setProbs, handleInputChange, calculate, reset: () => { setInputs(initialFunkyJugglerInputs); setProbs(null); } };
};