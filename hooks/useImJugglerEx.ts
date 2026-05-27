// hooks/useImJugglerEx.ts
import React, { useState, useCallback, useEffect } from 'react';
import type { ImJugglerExInput, ImJugglerExFullResult } from '../types';
import { GameMode } from '../types';
import { initialImJugglerExInputs } from '../constants/imJugglerExConstants';
import { calculateJugglerSeriesProbabilities } from '../services/jugglerSeriesCalculator';

const LOCAL_STORAGE_KEY = 'imJugglerEx_inputs_v1';

export const useImJugglerEx = (
  setInputChangedSinceLastCalc: React.Dispatch<React.SetStateAction<boolean>>,
  currentGameMode: GameMode
) => {
  const [inputs, setInputs] = useState<ImJugglerExInput>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return { ...initialImJugglerExInputs, ...JSON.parse(saved) };
    } catch {}
    return initialImJugglerExInputs;
  });

  const [probs, setProbs] = useState<ImJugglerExFullResult | null>(null);

  useEffect(() => {
    if (currentGameMode === GameMode.IM_JUGGLER_EX) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(inputs));
    }
  }, [inputs, currentGameMode]);

  const handleInputChange = useCallback((field: keyof ImJugglerExInput, value: number | null) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setInputChangedSinceLastCalc(true);
  }, [setInputChangedSinceLastCalc]);

  const calculate = useCallback(() => {
    const res = calculateJugglerSeriesProbabilities(GameMode.IM_JUGGLER_EX, inputs);
    setProbs(res);
    setInputChangedSinceLastCalc(false);
  }, [inputs, setInputChangedSinceLastCalc]);

  return { inputs, probs, setProbs, handleInputChange, calculate, reset: () => { setInputs(initialImJugglerExInputs); setProbs(null); } };
};