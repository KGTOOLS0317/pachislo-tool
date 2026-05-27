// services/hanaHanaHououCalculator.ts
import type { HanaHanaHououInput, HanaHanaHououSettingProbabilities, HanaHanaHououFullResult, HanaHanaHououProbabilitiesBreakdown, ObservedRates } from '../types';
import { KingHanaHanaSideLampColor } from '../types'; // KingHanaHanaSideLampColor is shared
import { 
  HanaHanaHououSetting, // Use Houou-specific setting enum (though structurally same as KHH)
  HANA_HANA_HOUOU_SETTINGS_NAMES,
  HANA_HANA_HOUOU_IDEAL_RATES,
  GAMES_PER_BIG_BONUS_HOUOU,
  // Lamp probabilities are re-exported from KHH constants within hanaHanaHououConstants
  REG_DURING_SIDE_LAMP_PROBS,
  BIG_AFTER_FEATHER_LAMP_PROBS,
  REG_AFTER_FEATHER_LAMP_PROBS
} from '../constants/hanaHanaHououConstants';

const MIN_LIKELIHOOD = 1e-10; 

const normalizeProbabilities = (probs: HanaHanaHououSettingProbabilities): HanaHanaHououSettingProbabilities => {
  const normalized: HanaHanaHououSettingProbabilities = {};
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

function getLogLikelihoodForMultinomial(
    observedCounts: Record<string, number>,
    totalOpportunities: number,
    probTableForSetting: Record<KingHanaHanaSideLampColor, number>
): number {
    if (totalOpportunities <= 0) {
      const anyLampsObserved = Object.values(observedCounts).some(count => count && count > 0);
      return anyLampsObserved ? -Infinity : 0;
    }
    let logL = 0;
    let sumOfObservedCounts = 0;
    const allLampKeys = Object.values(KingHanaHanaSideLampColor);

    for (const colorKey of allLampKeys) {
        if (colorKey === KingHanaHanaSideLampColor.NONE) continue;
        const count = observedCounts[colorKey] || 0;
        sumOfObservedCounts += count;
    }
    if (sumOfObservedCounts > totalOpportunities) return -Infinity;
    const observedNoneCount = totalOpportunities - sumOfObservedCounts;

    for (const colorKey of allLampKeys) {
        const color = colorKey as KingHanaHanaSideLampColor;
        const probForThisColor = probTableForSetting[color];
        let countForThisColor = (color === KingHanaHanaSideLampColor.NONE) ? observedNoneCount : (observedCounts[color] || 0);
        if (probForThisColor < 0 || probForThisColor > 1) return -Infinity;
        if (probForThisColor === 0) {
            if (countForThisColor > 0) return -Infinity;
        } else {
            if (countForThisColor > 0) logL += countForThisColor * Math.log(probForThisColor);
        }
    }
    return isFinite(logL) ? logL : -Infinity;
}

export const calculateHanaHanaHououProbabilities = (
  inputs: HanaHanaHououInput
): HanaHanaHououFullResult => {
  const overallLikelihoods: HanaHanaHououSettingProbabilities = {};
  const breakdownLikelihoods: HanaHanaHououProbabilitiesBreakdown = {};
  const observedRates: ObservedRates = {};
  const activeElementKeys: string[] = [];

  const elementNames = [
    "BIG確率", "REG確率", "ベル🔔 確率", "BIG中スイカ 確率", "BIG中ハズレ 確率", "レトロ🎶 確率",
    "REG中サイドランプ", "BIG後フェザーランプ", "REG後フェザーランプ", "開始時データ", "開始時ベル確率"
  ];
  elementNames.forEach(name => breakdownLikelihoods[name] = {});

  HANA_HANA_HOUOU_SETTINGS_NAMES.forEach(setting => {
    overallLikelihoods[setting] = 1.0;
    elementNames.forEach(name => breakdownLikelihoods[name][setting] = 1.0);
  });

  const playedGames = inputs.currentTotalGames - inputs.startTotalGames;
  const playedBigCount = inputs.currentBigCount - inputs.startBigCount;
  const playedRegCount = inputs.currentRegCount - inputs.startRegCount;
  
 // Calculate observed rates & determine active elements
  // BIG確率
  if (inputs.startTotalGames > 0 || playedGames > 0 || playedBigCount > 0 || inputs.currentBigCount > 0) {
    activeElementKeys.push("BIG確率");
    if (playedGames > 0 && playedBigCount >= 0) { 
        observedRates["BIG確率"] = playedBigCount > 0 ? `1/${(playedGames / playedBigCount).toFixed(1)}` : "-";
    } else {
        observedRates["BIG確率"] = "-";
    }
  } else {
    observedRates["BIG確率"] = "-";
  }

  // REG確率
  if (inputs.startTotalGames > 0 || playedGames > 0 || playedRegCount > 0 || inputs.currentRegCount > 0) {
    activeElementKeys.push("REG確率");
    if (playedGames > 0 && playedRegCount >= 0) { 
        observedRates["REG確率"] = playedRegCount > 0 ? `1/${(playedGames / playedRegCount).toFixed(1)}` : "-";
    } else {
        observedRates["REG確率"] = "-";
    }
  } else {
    observedRates["REG確率"] = "-";
  }

  // ベル🔔 確率
  if (inputs.bellCount > 0) {
    activeElementKeys.push("ベル🔔 確率");
    if (playedGames > 0) { // Only calculate rate if games were played
      observedRates["ベル🔔 確率"] = `1/${(playedGames / inputs.bellCount).toFixed(2)}`;
    } else {
      observedRates["ベル🔔 確率"] = "-"; // Bell count without games played
    }
  } else {
    observedRates["ベル🔔 確率"] = "-";
  }

  const totalBigGamesForSubCounters = playedBigCount * GAMES_PER_BIG_BONUS_HOUOU; 
  // BIG中スイカ 確率
  if (inputs.watermelonInBigCount > 0 || playedBigCount > 0 ) {
    activeElementKeys.push("BIG中スイカ 確率");
    const bigGamesForRate = playedBigCount * GAMES_PER_BIG_BONUS_HOUOU;
    if (bigGamesForRate > 0 && inputs.watermelonInBigCount >= 0) {
        observedRates["BIG中スイカ 確率"] = inputs.watermelonInBigCount > 0 ? `1/${(bigGamesForRate / inputs.watermelonInBigCount).toFixed(1)}` : "-";
    } else {
        observedRates["BIG中スイカ 確率"] = "-";
    }
  } else {
    observedRates["BIG中スイカ 確率"] = "-";
  }

  // BIG中ハズレ 確率
  if (inputs.bigBlankCount > 0 || playedBigCount > 0 ) {
     activeElementKeys.push("BIG中ハズレ 確率");
     const bigGamesForRate = playedBigCount * GAMES_PER_BIG_BONUS_HOUOU;
    if (bigGamesForRate > 0 && inputs.bigBlankCount >= 0) {
        observedRates["BIG中ハズレ 確率"] = inputs.bigBlankCount > 0 ? `1/${(bigGamesForRate / inputs.bigBlankCount).toFixed(1)}` : "-";
    } else {
        observedRates["BIG中ハズレ 確率"] = "-";
    }
  } else {
    observedRates["BIG中ハズレ 確率"] = "-";
  }

  // レトロ🎶 確率
  if (inputs.retroSoundNumerator > 0 || inputs.retroSoundDenominator > 0) {
    activeElementKeys.push("レトロ🎶 確率");
    if (inputs.retroSoundDenominator > 0 && inputs.retroSoundNumerator >= 0) {
        observedRates["レトロ🎶 確率"] = inputs.retroSoundNumerator > 0 ? `1/${(inputs.retroSoundDenominator / inputs.retroSoundNumerator).toFixed(1)}` : "-";
    } else {
        observedRates["レトロ🎶 確率"] = "-";
    }
  } else {
    observedRates["レトロ🎶 確率"] = "-";
  }

  const regDuringLampsArray = [inputs.regDuringSideLampBlueCount, inputs.regDuringSideLampYellowCount, inputs.regDuringSideLampGreenCount, inputs.regDuringSideLampRedCount, inputs.regDuringSideLampRainbowCount];
  const regDuringLampsObserved = regDuringLampsArray.some(c => c > 0);
  if (playedRegCount > 0 || regDuringLampsObserved) {
      activeElementKeys.push("REG中サイドランプ");
  }
  
  const bigAfterLampsArray = [inputs.bigAfterSideLampBlueCount, inputs.bigAfterSideLampYellowCount, inputs.bigAfterSideLampGreenCount, inputs.bigAfterSideLampRedCount, inputs.bigAfterSideLampRainbowCount];
  const bigAfterLampsObserved = bigAfterLampsArray.some(c => c > 0);
  let opportunitiesForBigAfterLamp = 0;
  if (playedBigCount > 0) {
    opportunitiesForBigAfterLamp = (inputs.startBigCount === 0) ? Math.max(0, playedBigCount - 1) : playedBigCount;
  }
  if (playedBigCount > 0 && (opportunitiesForBigAfterLamp > 0 || bigAfterLampsObserved)) {
      activeElementKeys.push("BIG後フェザーランプ");
  }

  const regAfterLampsArray = [inputs.regAfterSideLampBlueCount, inputs.regAfterSideLampYellowCount, inputs.regAfterSideLampGreenCount, inputs.regAfterSideLampRedCount, inputs.regAfterSideLampRainbowCount];
  const regAfterLampsObserved = regAfterLampsArray.some(c => c > 0);
  let opportunitiesForRegAfterLamp = 0;
  if (playedRegCount > 0) {
    opportunitiesForRegAfterLamp = playedRegCount;
  }
  if (playedRegCount > 0 && (opportunitiesForRegAfterLamp > 0 || regAfterLampsObserved)) {
      activeElementKeys.push("REG後フェザーランプ");
  }

  // 開始時データ
  if (inputs.startTotalGames > 0) {
    activeElementKeys.push("開始時データ");
    const startTotalBonuses = inputs.startBigCount + inputs.startRegCount;
    if (startTotalBonuses > 0) {
      observedRates["開始時データ"] = `1/${(inputs.startTotalGames / startTotalBonuses).toFixed(1)}`;
    } else {
      observedRates["開始時データ"] = "-";
    }
  } else {
    observedRates["開始時データ"] = "-";
  }
  
  // 開始時ベル確率
  if (inputs.startTotalGames > 0 && inputs.startNetMedals !== null) {
      activeElementKeys.push("開始時ベル確率");
  }


  elementNames.forEach(elementName => {
    const tempLogLikelihoods: HanaHanaHououSettingProbabilities = {};
    HANA_HANA_HOUOU_SETTINGS_NAMES.forEach(setting => {
      const idealRates = HANA_HANA_HOUOU_IDEAL_RATES[setting];
      let logL = 0;
      switch (elementName) {
        case "BIG確率":
          if (playedGames >= 0) logL = getLogLikelihoodForBinomial(playedBigCount, playedGames, idealRates.big);
          else logL = -Infinity;
          break;
        case "REG確率":
          if (playedGames >= 0) logL = getLogLikelihoodForBinomial(playedRegCount, playedGames, idealRates.reg);
          else logL = -Infinity;
          break;
        case "ベル🔔 確率":
           if (inputs.bellCount >= 0 && playedGames >=0 && activeElementKeys.includes("ベル🔔 確率")) { 
             logL = getLogLikelihoodForBinomial(inputs.bellCount, playedGames, idealRates.bell);
          } else if (inputs.bellCount > 0 && playedGames < 0 && activeElementKeys.includes("ベル🔔 確率")) {
             logL = -Infinity;
          } else { // Not active or bellCount is 0
             logL = 0;
          }
          break;
        case "BIG中スイカ 確率": 
          {
            const n_big_sub = playedBigCount * GAMES_PER_BIG_BONUS_HOUOU;
            if (n_big_sub >=0 && inputs.watermelonInBigCount >=0) logL = getLogLikelihoodForBinomial(inputs.watermelonInBigCount, n_big_sub, idealRates.watermelonInBig);
            else if (inputs.watermelonInBigCount > 0 && n_big_sub < 0) logL = -Infinity;
            else logL = 0;
          }
          break;
        case "BIG中ハズレ 確率": 
          {
            const n_big_sub = playedBigCount * GAMES_PER_BIG_BONUS_HOUOU;
            if (n_big_sub >=0 && inputs.bigBlankCount >=0) logL = getLogLikelihoodForBinomial(inputs.bigBlankCount, n_big_sub, idealRates.bigBlank);
            else if (inputs.bigBlankCount > 0 && n_big_sub < 0) logL = -Infinity;
            else logL = 0;
          }
          break;
        case "レトロ🎶 確率": 
          if (inputs.retroSoundDenominator >=0 && inputs.retroSoundNumerator >=0) logL = getLogLikelihoodForBinomial(inputs.retroSoundNumerator, inputs.retroSoundDenominator, idealRates.retroSound);
          else if (inputs.retroSoundNumerator > 0 && inputs.retroSoundDenominator < 0) logL = -Infinity;
          else logL = 0;
          break;
        case "REG中サイドランプ": {
          const lampCounts: Record<string, number> = {};
          Object.values(KingHanaHanaSideLampColor).filter(c => c !== KingHanaHanaSideLampColor.NONE).forEach(color => {
            const key = `regDuringSideLamp${color.replace('青🔵','Blue').replace('黄🟡','Yellow').replace('緑🟢','Green').replace('赤🔴','Red').replace('虹🌈','Rainbow')}Count` as keyof HanaHanaHououInput;
            lampCounts[color] = inputs[key] as number || 0;
          });
          const sumOfObservedLamps = Object.values(lampCounts).reduce((s, c) => s + (c || 0), 0);

          if (sumOfObservedLamps > 0) {
             if (playedRegCount > 0 && playedRegCount < sumOfObservedLamps) { // Contradiction
              logL = -Infinity;
            } else {
              // Denominator is the sum of observed lamps.
              logL = getLogLikelihoodForMultinomial(lampCounts, sumOfObservedLamps, REG_DURING_SIDE_LAMP_PROBS[setting]);
            }
          } else if (playedRegCount > 0) { // No lamps specified, but REGs happened. Implies all NONE.
            // Denominator is playedRegCount. lampCounts is all zeros.
            logL = getLogLikelihoodForMultinomial(lampCounts, playedRegCount, REG_DURING_SIDE_LAMP_PROBS[setting]);
          } else { // No lamps, no REGs.
            logL = 0; // Neutral.
          }
          break;
        }
        case "BIG後フェザーランプ": {
          const lampCounts: Record<string, number> = {};
          Object.values(KingHanaHanaSideLampColor).filter(c => c !== KingHanaHanaSideLampColor.NONE).forEach(color => {
            const key = `bigAfterSideLamp${color.replace('青🔵','Blue').replace('黄🟡','Yellow').replace('緑🟢','Green').replace('赤🔴','Red').replace('虹🌈','Rainbow')}Count` as keyof HanaHanaHououInput;
            lampCounts[color] = inputs[key] as number || 0;
          });

          let currentOpportunities = 0;
          if (playedBigCount > 0) {
            currentOpportunities = (inputs.startBigCount === 0) ? Math.max(0, playedBigCount - 1) : playedBigCount;
          }
          const sumOfLamps = Object.values(lampCounts).reduce((s, c) => s + c, 0);
          if (sumOfLamps > currentOpportunities && currentOpportunities > 0) logL = -Infinity;
          else if (sumOfLamps > 0 && currentOpportunities === 0) logL = -Infinity;
          else if (logL !== -Infinity) logL = getLogLikelihoodForMultinomial(lampCounts, currentOpportunities, BIG_AFTER_FEATHER_LAMP_PROBS[setting]); 
          break;
        }
        case "REG後フェザーランプ": {
           const lampCounts: Record<string, number> = {};
           Object.values(KingHanaHanaSideLampColor).filter(c => c !== KingHanaHanaSideLampColor.NONE).forEach(color => {
            const key = `regAfterSideLamp${color.replace('青🔵','Blue').replace('黄🟡','Yellow').replace('緑🟢','Green').replace('赤🔴','Red').replace('虹🌈','Rainbow')}Count` as keyof HanaHanaHououInput;
            lampCounts[color] = inputs[key] as number || 0;
          });

          let currentOpportunities = 0;
          if (playedRegCount > 0) {
            currentOpportunities = playedRegCount;
          }
          const sumOfLamps = Object.values(lampCounts).reduce((s, c) => s + c, 0);
          if (sumOfLamps > currentOpportunities && currentOpportunities > 0) logL = -Infinity;
          else if (sumOfLamps > 0 && currentOpportunities === 0) logL = -Infinity;
          else if (logL !== -Infinity) logL = getLogLikelihoodForMultinomial(lampCounts, currentOpportunities, REG_AFTER_FEATHER_LAMP_PROBS[setting]); 
          break;
        }
        case "開始時データ":
          if (inputs.startTotalGames > 0) {
            const logLBigStart = getLogLikelihoodForBinomial(inputs.startBigCount, inputs.startTotalGames, idealRates.big);
            const logLRegStart = getLogLikelihoodForBinomial(inputs.startRegCount, inputs.startTotalGames, idealRates.reg);
            if (isFinite(logLBigStart) && isFinite(logLRegStart)) {
              logL = logLBigStart + logLRegStart;
            } else {
              logL = -Infinity;
            }
          } else {
            logL = 0; // Neutral if no start games
          }
          break;
        case "開始時ベル確率":
          if (inputs.startTotalGames > 0 && inputs.startNetMedals !== null) {
              const totalIn = inputs.startTotalGames * 3;
              const totalOut = totalIn + inputs.startNetMedals;

              const bigPayout = inputs.startBigCount * 240;
              const regPayout = inputs.startRegCount * 120;
              const replayPayout = (inputs.startTotalGames / 7.3) * 3;
              const suikaPayout = (inputs.startTotalGames / 161) * 0.39 * 6;
              const cherryPayout = (inputs.startTotalGames / 48) * 0.66 * 4;

              const otherPayouts = bigPayout + regPayout + replayPayout + suikaPayout + cherryPayout;
              
              const bellPayout = totalOut - otherPayouts;
              const estimatedBellCount = bellPayout / 10;

              if (estimatedBellCount >= 0) {
                  logL = getLogLikelihoodForBinomial(Math.round(estimatedBellCount), inputs.startTotalGames, idealRates.bell);
                  if (setting === HANA_HANA_HOUOU_SETTINGS_NAMES[0]) { // To avoid recalculating for each setting
                      if (estimatedBellCount > 0) {
                          observedRates["開始時ベル確率"] = `1/${(inputs.startTotalGames / estimatedBellCount).toFixed(2)}`;
                      } else {
                          observedRates["開始時ベル確率"] = "-";
                      }
                  }
              } else {
                  logL = -Infinity;
                  if (setting === HANA_HANA_HOUOU_SETTINGS_NAMES[0]) {
                      observedRates["開始時ベル確率"] = "計算不可";
                  }
              }
          } else {
              logL = 0;
          }
          break;
      }
      tempLogLikelihoods[setting] = logL;
    });

    const maxLogL = Math.max(...Object.values(tempLogLikelihoods).filter(isFinite));
    if (isFinite(maxLogL)) {
        HANA_HANA_HOUOU_SETTINGS_NAMES.forEach(setting => {
            if (isFinite(tempLogLikelihoods[setting])) {
                breakdownLikelihoods[elementName][setting] = Math.exp(tempLogLikelihoods[setting] - maxLogL);
            } else {
                 breakdownLikelihoods[elementName][setting] = 0;
            }
            if (!activeElementKeys.includes(elementName) && breakdownLikelihoods[elementName][setting] === 0 && tempLogLikelihoods[setting] === -Infinity) {
                 // Keep it 0
            } else if (breakdownLikelihoods[elementName][setting] < MIN_LIKELIHOOD && activeElementKeys.includes(elementName)) {
                breakdownLikelihoods[elementName][setting] = MIN_LIKELIHOOD;
            } else if (!activeElementKeys.includes(elementName)) {
                breakdownLikelihoods[elementName][setting] = 1.0; 
            }
        });
    } else {
        HANA_HANA_HOUOU_SETTINGS_NAMES.forEach(setting => {
             breakdownLikelihoods[elementName][setting] = (activeElementKeys.includes(elementName) ? 0 : 1.0);
        });
    }
    breakdownLikelihoods[elementName] = normalizeProbabilities(breakdownLikelihoods[elementName]);
  });

  HANA_HANA_HOUOU_SETTINGS_NAMES.forEach(setting => {
    let product = 1.0;
    activeElementKeys.forEach(elementName => { 
      product *= (breakdownLikelihoods[elementName][setting]);
    });
    overallLikelihoods[setting] = product;
  });

  const finalResult: HanaHanaHououFullResult = {
    overallProbabilities: normalizeProbabilities(overallLikelihoods),
    breakdownProbabilities: breakdownLikelihoods,
    activeElementKeys: [...new Set(activeElementKeys)], 
  };
  if (Object.keys(observedRates).length > 0 && Object.values(observedRates).some(rate => rate !== "-")) {
    finalResult.observedRates = observedRates;
  }

  // Calculate estimated payout
  if (inputs.currentNetMedals !== null && playedGames > 0) {
    finalResult.estimatedPayout = inputs.currentNetMedals;
  } else if (playedGames > 0) {
    const replayCount = playedGames / 7.3;
    const investment = playedGames * 3;

    let bellCountForCalc = inputs.bellCount;
    if (inputs.bellCount <= 0) {
        bellCountForCalc = playedGames * HANA_HANA_HOUOU_IDEAL_RATES[HanaHanaHououSetting.SETTING_1].bell;
    }
    const watermelonCountForCalc = playedGames / 161;
    const cherryCountForCalc = playedGames / 48;

    const payoutValue = (240 * playedBigCount) + 
                        (120 * playedRegCount) + 
                        (10 * bellCountForCalc) + 
                        (6 * watermelonCountForCalc) + 
                        (4 * cherryCountForCalc) + 
                        (3 * replayCount);
    finalResult.estimatedPayout = payoutValue - investment;
  } else {
    finalResult.estimatedPayout = null;
  }

  return finalResult;
};
