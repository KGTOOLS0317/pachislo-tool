
// services/monkeyTurnVSettingCalculator.ts
import type { 
    MonkeyTurnVSettingInput, 
    MonkeyTurnVSettingSettingProbabilities, 
    MonkeyTurnVSettingFullResult, 
    MonkeyTurnVSettingProbabilitiesBreakdown, 
    ObservedRates 
} from '../types';
import { 
    MonkeyTurnVSetting,
    MONKEY_TURN_V_SETTINGS_NAMES,
    MONKEY_TURN_V_IDEAL_RATES
} from '../constants/monkeyTurnVConstants';

const MIN_LIKELIHOOD = 1e-10; // Minimum likelihood to avoid zero multiplication

const normalizeProbabilities = (probs: MonkeyTurnVSettingSettingProbabilities): MonkeyTurnVSettingSettingProbabilities => {
  const normalized: MonkeyTurnVSettingSettingProbabilities = {};
  let total = Object.values(probs).reduce((sum, p) => sum + p, 0);

  if (total === 0 || isNaN(total) || !isFinite(total)) {
    const numSettings = Object.keys(probs).length;
    const val = numSettings > 0 ? 1 / numSettings : 0;
    for (const key in probs) {
      normalized[key] = val;
    }
  } else {
    for (const key in probs) {
      normalized[key] = probs[key] / total;
    }
  }
  return normalized;
};

function getLogLikelihoodForBinomial(k: number, n: number, p: number): number {
  if (p < 0 || p > 1) return -Infinity; 
  if (k < 0 || n < 0 || k > n) return -Infinity; 

  if (n === 0) return (k === 0) ? 0 : -Infinity; 

  let logL = 0;

  if (p === 0) return (k === 0) ? 0 : -Infinity;
  if (p === 1) return (k === n) ? 0 : -Infinity;

  if (k > 0) {
    logL += k * Math.log(p);
  }
  if (n - k > 0) {
    logL += (n - k) * Math.log(1 - p);
  }
  
  return isFinite(logL) ? logL : -Infinity;
}

export const calculateMonkeyTurnVSettingProbabilities = (
  inputs: MonkeyTurnVSettingInput,
  selectedSettings?: string[]
): MonkeyTurnVSettingFullResult => {
  const activeSettings = (selectedSettings && selectedSettings.length > 0)
    ? MONKEY_TURN_V_SETTINGS_NAMES.filter(s => selectedSettings.includes(s))
    : MONKEY_TURN_V_SETTINGS_NAMES;

  const overallLikelihoods: MonkeyTurnVSettingSettingProbabilities = {};
  const breakdownLikelihoods: MonkeyTurnVSettingProbabilitiesBreakdown = {};
  const observedRates: ObservedRates = {};
  const activeElementKeys: string[] = [];

  const elementNames = ["5枚役 確率", "落ち/気配 確率"];
  elementNames.forEach(name => breakdownLikelihoods[name] = {});

  activeSettings.forEach(setting => {
    overallLikelihoods[setting] = 1.0;
    elementNames.forEach(name => breakdownLikelihoods[name][setting] = 1.0);
  });

  const defaultResult: MonkeyTurnVSettingFullResult = {
    overallProbabilities: normalizeProbabilities(activeSettings.reduce((acc, s) => { acc[s] = 1.0; return acc; }, {} as MonkeyTurnVSettingSettingProbabilities)),
    breakdownProbabilities: elementNames.reduce((acc, name) => {
      acc[name] = normalizeProbabilities(activeSettings.reduce((sAcc, s) => { sAcc[s] = 1.0; return sAcc; }, {} as MonkeyTurnVSettingSettingProbabilities));
      return acc;
    }, {} as MonkeyTurnVSettingProbabilitiesBreakdown),
    activeElementKeys: [],
  };

  const { gamesPlayed, coin5Count, ochiCount, kehaiCount } = inputs;

  if (gamesPlayed <= 0 && coin5Count <= 0 && ochiCount <= 0 && kehaiCount <= 0) {
    return defaultResult;
  }
  if (gamesPlayed < 0 || coin5Count < 0 || ochiCount < 0 || kehaiCount < 0) {
      return defaultResult;
  }
  if (coin5Count > gamesPlayed && gamesPlayed > 0) {
      return defaultResult;
  }

  if (gamesPlayed > 0 && coin5Count >= 0) {
    activeElementKeys.push("5枚役 確率");
    if (coin5Count > 0) observedRates["5枚役 確率"] = `1/${(gamesPlayed / coin5Count).toFixed(1)}`;
    else observedRates["5枚役 確率"] = "-";
  } else if (coin5Count > 0) { // gamesPlayed <= 0 but coin5Count > 0
    activeElementKeys.push("5枚役 確率");
    observedRates["5枚役 確率"] = "-"; // Mark as active but rate is undefined
  } else {
     observedRates["5枚役 確率"] = "-";
  }


  const totalOchiKehai = ochiCount + kehaiCount;
  if (totalOchiKehai > 0) {
    activeElementKeys.push("落ち/気配 確率");
    observedRates["落ち/気配 確率"] = `落:${ochiCount} 気:${kehaiCount} (落率:${(ochiCount / totalOchiKehai * 100).toFixed(1)}%)`;
  } else if (ochiCount > 0 || kehaiCount > 0) { // Should not happen with non-negative inputs
    activeElementKeys.push("落ち/気配 確率");
    observedRates["落ち/気配 確率"] = "-";
  } else {
     observedRates["落ち/気配 確率"] = "-";
  }

  observedRates["総合"] = `G:${gamesPlayed} 5枚:${coin5Count} 落:${ochiCount} 気:${kehaiCount}`;


  elementNames.forEach(elementName => {
    const tempLogLikelihoods: MonkeyTurnVSettingSettingProbabilities = {};

    activeSettings.forEach(setting => {
      const idealRates = MONKEY_TURN_V_IDEAL_RATES[setting as MonkeyTurnVSetting];
      let logL = 0;

      switch (elementName) {
        case "5枚役 確率":
          if (gamesPlayed > 0) {
            logL = getLogLikelihoodForBinomial(coin5Count, gamesPlayed, idealRates.coin5Rate);
          } else if (coin5Count > 0) {
            logL = -Infinity;
          }
          break;
        case "落ち/気配 確率":
          if (totalOchiKehai > 0) {
            logL = getLogLikelihoodForBinomial(ochiCount, totalOchiKehai, idealRates.ochiRate);
          } else if (ochiCount > 0 || kehaiCount > 0) {
            logL = -Infinity;
          }
          break;
      }
      tempLogLikelihoods[setting] = logL;
    });

    const maxLogL = Math.max(...Object.values(tempLogLikelihoods).filter(isFinite));

    if (isFinite(maxLogL)) {
        activeSettings.forEach(setting => {
            if (isFinite(tempLogLikelihoods[setting])) {
                breakdownLikelihoods[elementName][setting] = Math.exp(tempLogLikelihoods[setting] - maxLogL);
            } else {
                 breakdownLikelihoods[elementName][setting] = 0;
            }
            if (breakdownLikelihoods[elementName][setting] < MIN_LIKELIHOOD && activeElementKeys.includes(elementName)) {
                breakdownLikelihoods[elementName][setting] = MIN_LIKELIHOOD;
            } else if (!activeElementKeys.includes(elementName)) {
                 breakdownLikelihoods[elementName][setting] = 1.0; // Default if not active
            }
        });
    } else {
        activeSettings.forEach(setting => {
            breakdownLikelihoods[elementName][setting] = (activeElementKeys.includes(elementName) ? 0 : 1.0);
        });
    }
    breakdownLikelihoods[elementName] = normalizeProbabilities(breakdownLikelihoods[elementName]);
  });


  activeSettings.forEach(setting => {
    let product = 1.0;
    activeElementKeys.forEach(elementName => { // Only multiply by active elements
      product *= (breakdownLikelihoods[elementName][setting] || MIN_LIKELIHOOD);
    });
    overallLikelihoods[setting] = product;
  });

  const finalResult: MonkeyTurnVSettingFullResult = {
    overallProbabilities: normalizeProbabilities(overallLikelihoods),
    breakdownProbabilities: breakdownLikelihoods, 
    activeElementKeys: [...new Set(activeElementKeys)], // Ensure unique
  };

  if (Object.keys(observedRates).length > 0 && Object.values(observedRates).some(rate => rate !== "-")) {
    finalResult.observedRates = observedRates;
  }

  return finalResult;
};