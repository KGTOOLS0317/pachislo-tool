// services/dragonHanaHanaSenkouCalculator.ts
import type { DragonHanaHanaSenkouInput, DragonHanaHanaSenkouSettingProbabilities, DragonHanaHanaSenkouFullResult, DragonHanaHanaSenkouProbabilitiesBreakdown, ObservedRates } from '../types';
import { KingHanaHanaSideLampColor } from '../types'; 
import { 
  DragonHanaHanaSenkouSetting,
  DRAGON_HANA_HANA_SENKOU_SETTINGS_NAMES,
  DRAGON_HANA_HANA_SENKOU_IDEAL_RATES,
  GAMES_PER_BIG_BONUS_DRAGON_HANA,
  DHH_REG_DURING_SIDE_LAMP_PROBS,
  DHH_BIG_AFTER_FEATHER_LAMP_PROBS,
  DHH_REG_AFTER_FEATHER_LAMP_PROBS
} from '../constants/dragonHanaHanaSenkouConstants';

const MIN_LIKELIHOOD = 1e-10; 

const normalizeProbabilities = (probs: DragonHanaHanaSenkouSettingProbabilities): DragonHanaHanaSenkouSettingProbabilities => {
  const normalized: DragonHanaHanaSenkouSettingProbabilities = {};
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

export const calculateDragonHanaHanaSenkouProbabilities = (
  inputs: DragonHanaHanaSenkouInput
): DragonHanaHanaSenkouFullResult => {
  const overallLikelihoods: DragonHanaHanaSenkouSettingProbabilities = {};
  const breakdownLikelihoods: DragonHanaHanaSenkouProbabilitiesBreakdown = {};
  const observedRates: ObservedRates = {};
  const activeElementKeys = new Set<string>();

  const elementNames = [
    "BIG確率", "REG確率", "ベル🔔 確率", "BIG中スイカ 確率", "BIG中ハズレ 確率", "レトロ🎶 確率",
    "REG中サイドランプ", "BIG後フェザーランプ", "REG後フェザーランプ", "開始時データ"
  ];
  elementNames.forEach(name => breakdownLikelihoods[name] = {});

  DRAGON_HANA_HANA_SENKOU_SETTINGS_NAMES.forEach(setting => {
    overallLikelihoods[setting] = 1.0; 
    elementNames.forEach(name => breakdownLikelihoods[name][setting] = 1.0); 
  });

  const playedGames = inputs.currentTotalGames - inputs.startTotalGames;
  const playedBigCount = inputs.currentBigCount - inputs.startBigCount;
  const playedRegCount = inputs.currentRegCount - inputs.startRegCount;

  // Calculate observed rates & determine active elements (similar to KingHanaHanaS)
  if (inputs.startTotalGames > 0 || playedGames > 0 || playedBigCount > 0 || inputs.currentBigCount > 0) {
    activeElementKeys.add("BIG確率");
    if (playedGames > 0 && playedBigCount >= 0) observedRates["BIG確率"] = playedBigCount > 0 ? `1/${(playedGames / playedBigCount).toFixed(1)}` : "-";
    else observedRates["BIG確率"] = "-";
  } else observedRates["BIG確率"] = "-";

  if (inputs.startTotalGames > 0 || playedGames > 0 || playedRegCount > 0 || inputs.currentRegCount > 0) {
    activeElementKeys.add("REG確率");
    if (playedGames > 0 && playedRegCount >= 0) observedRates["REG確率"] = playedRegCount > 0 ? `1/${(playedGames / playedRegCount).toFixed(1)}` : "-";
    else observedRates["REG確率"] = "-";
  } else observedRates["REG確率"] = "-";

  if (inputs.bellCount > 0) {
    activeElementKeys.add("ベル🔔 確率");
    if (playedGames > 0) observedRates["ベル🔔 確率"] = `1/${(playedGames / inputs.bellCount).toFixed(2)}`;
    else observedRates["ベル🔔 確率"] = "-";
  } else observedRates["ベル🔔 確率"] = "-";

  const totalBigGamesForSubCounters = playedBigCount * GAMES_PER_BIG_BONUS_DRAGON_HANA;
  if (inputs.watermelonInBigCount > 0 || playedBigCount > 0) {
    activeElementKeys.add("BIG中スイカ 確率");
    if (totalBigGamesForSubCounters > 0 && inputs.watermelonInBigCount >= 0) observedRates["BIG中スイカ 確率"] = inputs.watermelonInBigCount > 0 ? `1/${(totalBigGamesForSubCounters / inputs.watermelonInBigCount).toFixed(1)}` : "-";
    else observedRates["BIG中スイカ 確率"] = "-";
  } else observedRates["BIG中スイカ 確率"] = "-";

  if (inputs.bigBlankCount > 0 || playedBigCount > 0) {
     activeElementKeys.add("BIG中ハズレ 確率");
    if (totalBigGamesForSubCounters > 0 && inputs.bigBlankCount >= 0) observedRates["BIG中ハズレ 確率"] = inputs.bigBlankCount > 0 ? `1/${(totalBigGamesForSubCounters / inputs.bigBlankCount).toFixed(1)}` : "-";
    else observedRates["BIG中ハズレ 確率"] = "-";
  } else observedRates["BIG中ハズレ 確率"] = "-";
  
  if (inputs.retroSoundNumerator > 0 || inputs.retroSoundDenominator > 0) {
    activeElementKeys.add("レトロ🎶 確率");
    if (inputs.retroSoundDenominator > 0 && inputs.retroSoundNumerator >= 0) observedRates["レトロ🎶 確率"] = inputs.retroSoundNumerator > 0 ? `1/${(inputs.retroSoundDenominator / inputs.retroSoundNumerator).toFixed(1)}` : "-";
    else observedRates["レトロ🎶 確率"] = "-";
  } else observedRates["レトロ🎶 確率"] = "-";
  
  const regDuringLampsArray = [inputs.regDuringSideLampBlueCount, inputs.regDuringSideLampYellowCount, inputs.regDuringSideLampGreenCount, inputs.regDuringSideLampRedCount, inputs.regDuringSideLampRainbowCount];
  const regDuringLampsObserved = regDuringLampsArray.some(c => c > 0);
  if (playedRegCount > 0 || regDuringLampsObserved) activeElementKeys.add("REG中サイドランプ");
  
  const bigAfterLampsArray = [inputs.bigAfterSideLampBlueCount, inputs.bigAfterSideLampYellowCount, inputs.bigAfterSideLampGreenCount, inputs.bigAfterSideLampRedCount, inputs.bigAfterSideLampRainbowCount];
  const bigAfterLampsObserved = bigAfterLampsArray.some(c => c > 0);
  let opportunitiesForBigAfterLamp = (inputs.startBigCount === 0) ? Math.max(0, playedBigCount - 1) : playedBigCount;
  if (playedBigCount > 0 && (opportunitiesForBigAfterLamp > 0 || bigAfterLampsObserved)) activeElementKeys.add("BIG後フェザーランプ");

  const regAfterLampsArray = [inputs.regAfterSideLampBlueCount, inputs.regAfterSideLampYellowCount, inputs.regAfterSideLampGreenCount, inputs.regAfterSideLampRedCount, inputs.regAfterSideLampRainbowCount];
  const regAfterLampsObserved = regAfterLampsArray.some(c => c > 0);
  if (playedRegCount > 0 && (playedRegCount > 0 || regAfterLampsObserved)) activeElementKeys.add("REG後フェザーランプ");

  if (inputs.startTotalGames > 0) {
    activeElementKeys.add("開始時データ");
    const startTotalBonuses = inputs.startBigCount + inputs.startRegCount;
    if (startTotalBonuses > 0) observedRates["開始時データ"] = `1/${(inputs.startTotalGames / startTotalBonuses).toFixed(1)}`;
    else observedRates["開始時データ"] = "-";
  } else observedRates["開始時データ"] = "-";


  // --- Likelihood Calculation Loop (similar to KingHanaHanaS, using DHH constants) ---
  elementNames.forEach(elementName => {
    const tempLogLikelihoods: DragonHanaHanaSenkouSettingProbabilities = {};
    const isElementActive = activeElementKeys.has(elementName);

    DRAGON_HANA_HANA_SENKOU_SETTINGS_NAMES.forEach(setting => {
      const idealRates = DRAGON_HANA_HANA_SENKOU_IDEAL_RATES[setting as DragonHanaHanaSenkouSetting];
      let logL = 0; 
      if (isElementActive) {
        switch (elementName) {
          case "BIG確率":
            if (playedGames >= 0) logL = getLogLikelihoodForBinomial(playedBigCount, playedGames, idealRates.big);
            else logL = (playedBigCount > 0 && playedGames <=0 ? -Infinity: 0);
            break;
          case "REG確率":
            if (playedGames >= 0) logL = getLogLikelihoodForBinomial(playedRegCount, playedGames, idealRates.reg);
            else logL = (playedRegCount > 0 && playedGames <=0 ? -Infinity: 0);
            break;
          case "ベル🔔 確率":
            if (inputs.bellCount >= 0 && playedGames >=0) logL = getLogLikelihoodForBinomial(inputs.bellCount, playedGames, idealRates.bell);
            else logL = (inputs.bellCount > 0 && playedGames < 0 ? -Infinity: 0);
            break;
          case "BIG中スイカ 確率":
            {
              const n_big_sub = playedBigCount * GAMES_PER_BIG_BONUS_DRAGON_HANA;
              if (n_big_sub >= 0 && inputs.watermelonInBigCount >=0) logL = getLogLikelihoodForBinomial(inputs.watermelonInBigCount, n_big_sub, idealRates.watermelonInBig);
              else logL = (inputs.watermelonInBigCount > 0 && n_big_sub < 0 ? -Infinity: 0);
            }
            break;
          case "BIG中ハズレ 確率":
            {
              const n_big_sub = playedBigCount * GAMES_PER_BIG_BONUS_DRAGON_HANA;
              if (n_big_sub >= 0 && inputs.bigBlankCount >= 0) logL = getLogLikelihoodForBinomial(inputs.bigBlankCount, n_big_sub, idealRates.bigBlank);
              else logL = (inputs.bigBlankCount > 0 && n_big_sub < 0 ? -Infinity: 0);
            }
            break;
          case "レトロ🎶 確率":
            if (inputs.retroSoundDenominator >= 0 && inputs.retroSoundNumerator >= 0) logL = getLogLikelihoodForBinomial(inputs.retroSoundNumerator, inputs.retroSoundDenominator, idealRates.retroSound);
            else logL = (inputs.retroSoundNumerator > 0 && inputs.retroSoundDenominator < 0 ? -Infinity: 0);
            break;
          case "REG中サイドランプ": {
            const lampCounts: Record<string, number> = {};
            Object.values(KingHanaHanaSideLampColor).filter(c => c !== KingHanaHanaSideLampColor.NONE).forEach(color => {
              const key = `regDuringSideLamp${color.replace('青🔵','Blue').replace('黄🟡','Yellow').replace('緑🟢','Green').replace('赤🔴','Red').replace('虹🌈','Rainbow')}Count` as keyof DragonHanaHanaSenkouInput;
              lampCounts[color] = inputs[key] as number || 0;
            });
            const sumOfObservedLamps = Object.values(lampCounts).reduce((s, c) => s + (c || 0), 0);
            if (sumOfObservedLamps > 0) {
              if (playedRegCount > 0 && playedRegCount < sumOfObservedLamps) logL = -Infinity;
              else logL = getLogLikelihoodForMultinomial(lampCounts, sumOfObservedLamps, DHH_REG_DURING_SIDE_LAMP_PROBS[setting as DragonHanaHanaSenkouSetting]);
            } else if (playedRegCount > 0) {
              logL = getLogLikelihoodForMultinomial(lampCounts, playedRegCount, DHH_REG_DURING_SIDE_LAMP_PROBS[setting as DragonHanaHanaSenkouSetting]);
            } else logL = 0;
            break;
          }
          case "BIG後フェザーランプ": {
            const lampCounts: Record<string, number> = {};
            Object.values(KingHanaHanaSideLampColor).filter(c => c !== KingHanaHanaSideLampColor.NONE).forEach(color => {
              const key = `bigAfterSideLamp${color.replace('青🔵','Blue').replace('黄🟡','Yellow').replace('緑🟢','Green').replace('赤🔴','Red').replace('虹🌈','Rainbow')}Count` as keyof DragonHanaHanaSenkouInput;
              lampCounts[color] = inputs[key] as number || 0;
            });
            let currentOpportunities = (inputs.startBigCount === 0) ? Math.max(0, playedBigCount - 1) : playedBigCount;
            const sumOfLamps = Object.values(lampCounts).reduce((s, c) => s + c, 0);
            if (sumOfLamps > currentOpportunities && currentOpportunities > 0) logL = -Infinity;
            else if (sumOfLamps > 0 && currentOpportunities === 0) logL = -Infinity;
            else if (logL !== -Infinity) logL = getLogLikelihoodForMultinomial(lampCounts, currentOpportunities, DHH_BIG_AFTER_FEATHER_LAMP_PROBS[setting as DragonHanaHanaSenkouSetting]);
            break;
          }
          case "REG後フェザーランプ": {
             const lampCounts: Record<string, number> = {};
             Object.values(KingHanaHanaSideLampColor).filter(c => c !== KingHanaHanaSideLampColor.NONE).forEach(color => {
              const key = `regAfterSideLamp${color.replace('青🔵','Blue').replace('黄🟡','Yellow').replace('緑🟢','Green').replace('赤🔴','Red').replace('虹🌈','Rainbow')}Count` as keyof DragonHanaHanaSenkouInput;
              lampCounts[color] = inputs[key] as number || 0;
            });
            const sumOfLamps = Object.values(lampCounts).reduce((s, c) => s + c, 0);
            if (sumOfLamps > playedRegCount && playedRegCount > 0) logL = -Infinity;
            else if (sumOfLamps > 0 && playedRegCount === 0) logL = -Infinity;
            else if (logL !== -Infinity) logL = getLogLikelihoodForMultinomial(lampCounts, playedRegCount, DHH_REG_AFTER_FEATHER_LAMP_PROBS[setting as DragonHanaHanaSenkouSetting]);
            break;
          }
          case "開始時データ":
            if (inputs.startTotalGames > 0) {
              const logLBigStart = getLogLikelihoodForBinomial(inputs.startBigCount, inputs.startTotalGames, idealRates.big);
              const logLRegStart = getLogLikelihoodForBinomial(inputs.startRegCount, inputs.startTotalGames, idealRates.reg);
              if (isFinite(logLBigStart) && isFinite(logLRegStart)) logL = logLBigStart + logLRegStart;
              else logL = -Infinity;
            } else logL = 0;
            break;
        }
      } 
      tempLogLikelihoods[setting] = logL;
    });

    const maxLogL = Math.max(...Object.values(tempLogLikelihoods).filter(isFinite));
    
    if (isFinite(maxLogL)) {
        DRAGON_HANA_HANA_SENKOU_SETTINGS_NAMES.forEach(setting => {
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
        DRAGON_HANA_HANA_SENKOU_SETTINGS_NAMES.forEach(setting => {
            breakdownLikelihoods[elementName][setting] = isElementActive ? 0 : 1.0; 
        });
    }
    breakdownLikelihoods[elementName] = normalizeProbabilities(breakdownLikelihoods[elementName]);
  });

  DRAGON_HANA_HANA_SENKOU_SETTINGS_NAMES.forEach(setting => {
    let product = 1.0;
    activeElementKeys.forEach(elementName => { 
      product *= (breakdownLikelihoods[elementName][setting]); 
    });
    overallLikelihoods[setting] = product;
  });

  const finalResult: DragonHanaHanaSenkouFullResult = {
    overallProbabilities: normalizeProbabilities(overallLikelihoods),
    breakdownProbabilities: breakdownLikelihoods, 
    activeElementKeys: [...activeElementKeys].sort((a,b) => elementNames.indexOf(a) - elementNames.indexOf(b)),
  };

  if (Object.keys(observedRates).length > 0 && Object.values(observedRates).some(rate => rate !== "-")) {
    finalResult.observedRates = observedRates;
  }
  
  // Estimate payout
  if (inputs.currentNetMedals !== null && playedGames > 0) {
    finalResult.estimatedPayout = inputs.currentNetMedals;
  } else if (playedGames > 0) {
    const idealRatesS1 = DRAGON_HANA_HANA_SENKOU_IDEAL_RATES[DragonHanaHanaSenkouSetting.SETTING_1];
    const replayCount = playedGames * idealRatesS1.replay;
    const cherryCount = playedGames * idealRatesS1.cherry;
    const suikaCount = playedGames * idealRatesS1.suika;
    const investment = playedGames * 3;
    let bellCountForCalc = inputs.bellCount;
    if (inputs.bellCount <= 0) { 
        bellCountForCalc = playedGames * idealRatesS1.bell;
    }
    const payoutValue = (252 * playedBigCount) + 
                        (96 * playedRegCount) + 
                        (9 * bellCountForCalc) + 
                        (2 * cherryCount) +  // Approx Cherry payout
                        (6 * suikaCount) +   // Approx Suika payout
                        (3 * replayCount);
    finalResult.estimatedPayout = payoutValue - investment;
  } else {
    finalResult.estimatedPayout = null;
  }

  return finalResult;
};
