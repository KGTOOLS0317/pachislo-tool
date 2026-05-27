// services/newGetterMouseCalculator.ts
import type { NewGetterMouseInput, NewGetterMouseSettingProbabilities, NewGetterMouseFullResult, NewGetterMouseProbabilitiesBreakdown, ObservedRates } from '../types';
import { 
  NewGetterMouseSetting,
  NEW_GETTER_MOUSE_SETTINGS_NAMES,
  NEW_GETTER_MOUSE_IDEAL_RATES,
  GAMES_PER_BIG_BONUS_GETTER_MOUSE,
} from '../constants/newGetterMouseConstants';

const MIN_LIKELIHOOD = 1e-10;

const normalizeProbabilities = (probs: NewGetterMouseSettingProbabilities): NewGetterMouseSettingProbabilities => {
  const normalized: NewGetterMouseSettingProbabilities = {};
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
  if (p === 0) return (k === 0) ? 0 : -Infinity;
  if (p === 1) return (k === n) ? 0 : -Infinity;
  
  let logL = 0;
  if (k > 0) logL += k * Math.log(p);
  if (n - k > 0) logL += (n - k) * Math.log(1 - p);
  
  return isFinite(logL) ? logL : -Infinity;
}

export const calculateNewGetterMouseProbabilities = (
  inputs: NewGetterMouseInput
): NewGetterMouseFullResult => {
  const overallLikelihoods: NewGetterMouseSettingProbabilities = {};
  const breakdownLikelihoods: NewGetterMouseProbabilitiesBreakdown = {};
  const observedRates: ObservedRates = {};
  const activeElementKeys = new Set<string>();

  const playedGames = (inputs.currentTotalGames || 0) - (inputs.startTotalGames || 0);
  const playedBigCount = (inputs.currentBigCount || 0) - (inputs.startBigCount || 0);
  const playedRegCount = (inputs.currentRegCount || 0) - (inputs.startRegCount || 0);
  
  const useSpecificBigTriggers = (inputs.triggerRed7ReplayCount || 0) > 0 ||
                               (inputs.triggerNezumiOrangeACount || 0) > 0 ||
                               (inputs.triggerNezumiRichimeCCount || 0) > 0;
  
  const useSpecificRegTriggers = (inputs.triggerBarRichimeCCount || 0) > 0;

  const elementNames = [
    "オレンジA", "オレンジB", "スイカ", "チェリー",
    "斜めオレンジ", "イチロー狙い", "葉月ちゃん",
    "開始時データ"
  ];

  if (useSpecificBigTriggers) {
    elementNames.push("赤7+リプレイ", "ねずみ+オレンジA", "ねずみ+リーチ目役C", "契機不明BIG");
  } else {
    elementNames.push("BIG確率");
  }

  if (useSpecificRegTriggers) {
    elementNames.push("BAR+リーチ目役C", "契機不明REG");
  } else {
    elementNames.push("REG確率");
  }

  elementNames.forEach(name => breakdownLikelihoods[name] = {});

  NEW_GETTER_MOUSE_SETTINGS_NAMES.forEach(setting => {
    overallLikelihoods[setting] = 1.0;
    elementNames.forEach(name => breakdownLikelihoods[name][setting] = 1.0);
  });

  const addActiveElement = (key: string, count: number, trials: number) => {
    if ((count > 0 && trials >= 0) || (count >= 0 && trials > 0)) {
      activeElementKeys.add(key);
      if (trials > 0 && count > 0) {
        observedRates[key] = `1/${(trials / count).toFixed(1)}`;
      } else {
        observedRates[key] = `-`;
      }
    }
  };
  
  if (useSpecificBigTriggers) {
    addActiveElement("赤7+リプレイ", inputs.triggerRed7ReplayCount || 0, playedGames);
    addActiveElement("ねずみ+オレンジA", inputs.triggerNezumiOrangeACount || 0, playedGames);
    addActiveElement("ねずみ+リーチ目役C", inputs.triggerNezumiRichimeCCount || 0, playedGames);
    const unknownBigCount = playedBigCount - (inputs.triggerRed7ReplayCount || 0) - (inputs.triggerNezumiOrangeACount || 0) - (inputs.triggerNezumiRichimeCCount || 0);
    addActiveElement("契機不明BIG", unknownBigCount, playedGames);
  } else {
    addActiveElement("BIG確率", playedBigCount, playedGames);
  }

  if (useSpecificRegTriggers) {
    addActiveElement("BAR+リーチ目役C", inputs.triggerBarRichimeCCount || 0, playedGames);
    const unknownRegCount = playedRegCount - (inputs.triggerBarRichimeCCount || 0);
    addActiveElement("契機不明REG", unknownRegCount, playedGames);
  } else {
    addActiveElement("REG確率", playedRegCount, playedGames);
  }

  addActiveElement("オレンジA", inputs.orangeACount || 0, playedGames);
  addActiveElement("オレンジB", inputs.orangeBCount || 0, playedGames);
  addActiveElement("スイカ", inputs.suikaCount || 0, playedGames);
  addActiveElement("チェリー", inputs.cherryCount || 0, playedGames);
  addActiveElement("斜めオレンジ", inputs.bonusDiagonalOrangeCount || 0, playedBigCount * GAMES_PER_BIG_BONUS_GETTER_MOUSE);
  addActiveElement("イチロー狙い", inputs.bonusIchiroCount || 0, inputs.bonusIchiroOpportunityCount || 0);
  addActiveElement("葉月ちゃん", inputs.bonusHazukiCount || 0, playedBigCount);
  
  if (inputs.startTotalGames > 0) {
    activeElementKeys.add("開始時データ");
  }

  // --- Likelihood Calculation Loop ---
  elementNames.forEach(elementName => {
    const tempLogLikelihoods: NewGetterMouseSettingProbabilities = {};
    const isElementActive = activeElementKeys.has(elementName);

    NEW_GETTER_MOUSE_SETTINGS_NAMES.forEach(setting => {
      const idealRates = NEW_GETTER_MOUSE_IDEAL_RATES[setting as NewGetterMouseSetting];
      let logL = 0;
      if (isElementActive) {
        let k=0, n=0, p=0;
        switch (elementName) {
          case "BIG確率": k = playedBigCount; n = playedGames; p = idealRates.big; break;
          case "REG確率": k = playedRegCount; n = playedGames; p = idealRates.reg; break;
          case "契機不明BIG": 
            k = playedBigCount - (inputs.triggerRed7ReplayCount || 0) - (inputs.triggerNezumiOrangeACount || 0) - (inputs.triggerNezumiRichimeCCount || 0);
            n = playedGames; 
            p = idealRates.unknownBig;
            break;
          case "契機不明REG":
            k = playedRegCount - (inputs.triggerBarRichimeCCount || 0);
            n = playedGames;
            p = idealRates.unknownReg;
            break;
          case "オレンジA": k = inputs.orangeACount || 0; n = playedGames; p = idealRates.orangeA; break;
          case "オレンジB": k = inputs.orangeBCount || 0; n = playedGames; p = idealRates.orangeB; break;
          case "スイカ": k = inputs.suikaCount || 0; n = playedGames; p = idealRates.suika; break;
          case "チェリー": k = inputs.cherryCount || 0; n = playedGames; p = idealRates.cherry; break;
          case "斜めオレンジ": k = inputs.bonusDiagonalOrangeCount || 0; n = playedBigCount * GAMES_PER_BIG_BONUS_GETTER_MOUSE; p = idealRates.bonusDiagonalOrange; break;
          case "イチロー狙い": k = inputs.bonusIchiroCount || 0; n = inputs.bonusIchiroOpportunityCount || 0; p = idealRates.bonusIchiro; break;
          case "葉月ちゃん": k = inputs.bonusHazukiCount || 0; n = playedBigCount; p = idealRates.bonusHazuki; break;
          case "赤7+リプレイ": k = inputs.triggerRed7ReplayCount || 0; n = playedGames; p = idealRates.triggerRed7Replay; break;
          case "ねずみ+オレンジA": k = inputs.triggerNezumiOrangeACount || 0; n = playedGames; p = idealRates.triggerNezumiOrangeA; break;
          case "ねずみ+リーチ目役C": k = inputs.triggerNezumiRichimeCCount || 0; n = playedGames; p = idealRates.triggerNezumiRichimeC; break;
          case "BAR+リーチ目役C": k = inputs.triggerBarRichimeCCount || 0; n = playedGames; p = idealRates.triggerBarRichimeC; break;
          case "開始時データ":
            if (inputs.startTotalGames > 0) {
              const logLBig = getLogLikelihoodForBinomial(inputs.startBigCount || 0, inputs.startTotalGames, idealRates.big);
              const logLReg = getLogLikelihoodForBinomial(inputs.startRegCount || 0, inputs.startTotalGames, idealRates.reg);
              logL = (isFinite(logLBig) && isFinite(logLReg)) ? logLBig + logLReg : -Infinity;
            }
            break;
        }
        if (elementName !== "開始時データ") {
            logL = getLogLikelihoodForBinomial(k, n, p);
        }
      }
      tempLogLikelihoods[setting] = logL;
    });

    const maxLogL = Math.max(...Object.values(tempLogLikelihoods).filter(isFinite));
    
    if (isFinite(maxLogL)) {
        NEW_GETTER_MOUSE_SETTINGS_NAMES.forEach(setting => {
            if (isFinite(tempLogLikelihoods[setting])) {
                breakdownLikelihoods[elementName][setting] = Math.exp(tempLogLikelihoods[setting] - maxLogL);
            } else {
                 breakdownLikelihoods[elementName][setting] = 0; 
            }
            if (breakdownLikelihoods[elementName][setting] < MIN_LIKELIHOOD && isElementActive) {
                 breakdownLikelihoods[elementName][setting] = MIN_LIKELIHOOD;
            } else if (!isElementActive) {
                 breakdownLikelihoods[elementName][setting] = 1.0; 
            }
        });
    } else { 
        NEW_GETTER_MOUSE_SETTINGS_NAMES.forEach(setting => {
            breakdownLikelihoods[elementName][setting] = isElementActive ? 0 : 1.0; 
        });
    }
    breakdownLikelihoods[elementName] = normalizeProbabilities(breakdownLikelihoods[elementName]);
  });

  NEW_GETTER_MOUSE_SETTINGS_NAMES.forEach(setting => {
    let product = 1.0;
    activeElementKeys.forEach(elementName => { 
      product *= (breakdownLikelihoods[elementName][setting]); 
    });
    overallLikelihoods[setting] = product;
  });

  const finalResult: NewGetterMouseFullResult = {
    overallProbabilities: normalizeProbabilities(overallLikelihoods),
    breakdownProbabilities: breakdownLikelihoods, 
    activeElementKeys: [...activeElementKeys].sort((a,b) => elementNames.indexOf(a) - elementNames.indexOf(b)),
    observedRates
  };
  
  if (inputs.currentNetMedals !== null && playedGames > 0) {
    finalResult.estimatedPayout = inputs.currentNetMedals;
  } else if (playedGames > 0) {
    const idealRatesS1 = NEW_GETTER_MOUSE_IDEAL_RATES[NewGetterMouseSetting.SETTING_1];
    const investment = playedGames * 3;
    const replayCount = playedGames / 7.3; // Assume standard replay rate
    
    let orangeCount = (inputs.orangeACount || 0) + (inputs.orangeBCount || 0) > 0 ? (inputs.orangeACount || 0) + (inputs.orangeBCount || 0) : playedGames * (idealRatesS1.orangeA + idealRatesS1.orangeB);
    let suikaCount = (inputs.suikaCount || 0) > 0 ? (inputs.suikaCount || 0) : playedGames * idealRatesS1.suika;
    let cherryCount = (inputs.cherryCount || 0) > 0 ? (inputs.cherryCount || 0) : playedGames * idealRatesS1.cherry;

    const payoutValue = (225 * playedBigCount) + 
                        (73 * playedRegCount) + 
                        (8 * orangeCount) + 
                        (1 * suikaCount) +   
                        (8 * cherryCount) +
                        (3 * replayCount);
    finalResult.estimatedPayout = payoutValue - investment;
  } else {
    finalResult.estimatedPayout = null;
  }

  return finalResult;
};