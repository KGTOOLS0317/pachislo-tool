// hooks/useGogoJuggler3.ts
import React, { useState, useCallback, useEffect } from 'react';
import type { GogoJuggler3Input, GogoJuggler3FullResult } from '../types';
import { GameMode } from '../types';
import { initialGogoJuggler3Inputs } from '../constants/gogoJuggler3Constants';
import { calculateJugglerSeriesProbabilities } from '../services/jugglerSeriesCalculator';

const LOCAL_STORAGE_KEY = 'gogoJuggler3_inputs_v1';

export const useGogoJuggler3 = (
  setInputChangedSinceLastCalc: React.Dispatch<React.SetStateAction<boolean>>,
  currentGameMode: GameMode
) => {
  const [inputs, setInputs] = useState<GogoJuggler3Input>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return { ...initialGogoJuggler3Inputs, ...JSON.parse(saved) };
    } catch {}
    return initialGogoJuggler3Inputs;
  });

  const [probs, setProbs] = useState<GogoJuggler3FullResult | null>(null);

  useEffect(() => {
    if (currentGameMode === GameMode.GOGO_JUGGLER_3) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(inputs));
    }
  }, [inputs, currentGameMode]);

  const handleInputChange = useCallback((field: keyof GogoJuggler3Input, value: number | null) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setInputChangedSinceLastCalc(true);
  }, [setInputChangedSinceLastCalc]);

  const calculate = useCallback(() => {
    const res = calculateJugglerSeriesProbabilities(GameMode.GOGO_JUGGLER_3, inputs);
    setProbs(res);
    setInputChangedSinceLastCalc(false);
  }, [inputs, setInputChangedSinceLastCalc]);

  return { inputs, probs, setProbs, handleInputChange, calculate, reset: () => { setInputs(initialGogoJuggler3Inputs); setProbs(null); } };
};