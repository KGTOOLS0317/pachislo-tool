// services/jugglerSeriesCalculator.ts
import type { MyJugglerVInput, KingHanaHanaSSettingProbabilities, MyJugglerVFullResult, MyJugglerVProbabilitiesBreakdown, ObservedRates } from '../types';
import { GameMode } from '../types';
import { MY_JUGGLER_V_SETTINGS_NAMES } from '../constants/myJugglerVConstants';
import { IM_JUGGLER_EX_IDEAL_RATES } from '../constants/imJugglerExConstants';
import { GOGO_JUGGLER_3_IDEAL_RATES } from '../constants/gogoJuggler3Constants';
import { FUNKY_JUGGLER_IDEAL_RATES } from '../constants/funkyJugglerConstants';
import { KingHanaHanaSetting } from '../constants/kingHanaHanaSConstants';

const MIN_LIKELIHOOD = 1e-10;

const normalizeProbabilities = (probs: KingHanaHanaSSettingProbabilities): KingHanaHanaSSettingProbabilities => {
  const normalized: KingHanaHanaSSettingProbabilities = {};
  let total = Object.values(probs).reduce((sum, p) => sum + p, 0);

  if (total === 0 || isNaN(total) || !isFinite(total)) {
    const numSettings = Object.keys(probs).length;
    const val = numSettings > 0 ? 1 / numSettings : 0;
    for (const key in probs) {
      normalized[key] = val;
    }
  } else {
    for (const key in probs) {
      normalized[key] = (probs[key] as number) / total;
    }
  }
  return normalized;
};

function getLogLikelihoodForBinomial(k: number, n: number, p: number): number {
  if (p <= 0 || p >= 1) return -Infinity;
  if (k < 0 || n < 0 || k > n) return -Infinity;
  if (n === 0) return (k === 0) ? 0 : -Infinity; 
  let logL = 0;
  if (k > 0) logL += k * Math.log(p);
  if (n - k > 0) logL += (n - k) * Math.log(1 - p);
  return isFinite(logL) ? logL : -Infinity;
}

export const calculateJugglerSeriesProbabilities = (
  gameMode: GameMode,
  inputs: MyJugglerVInput
): MyJugglerVFullResult => {
  const overallLikelihoods: KingHanaHanaSSettingProbabilities = {};
  const breakdownLikelihoods: MyJugglerVProbabilitiesBreakdown = {};
  const observedRates: ObservedRates = {};
  
  const isIm = gameMode === GameMode.IM_JUGGLER_EX;
  const isGogo = gameMode === GameMode.GOGO_JUGGLER_3;
  const isFunky = gameMode === GameMode.FUNKY_JUGGLER;

  const allPossibleElementNames = [
    "BIG確率", "REG確率", 
    "単独BIG確率", "チェリーBIG確率", "レア役BIG確率",
    "単独REG確率", "チェリーREG確率",
    "ブドウ🍇 確率", "非重複チェリー🍒 確率",
    "開始時データ"
  ];
  allPossibleElementNames.forEach(name => breakdownLikelihoods[name] = {});

  MY_JUGGLER_V_SETTINGS_NAMES.forEach(setting => {
    overallLikelihoods[setting] = 1.0;
    allPossibleElementNames.forEach(name => breakdownLikelihoods[name][setting] = 1.0);
  });

  const playedGames = inputs.currentTotalGames - inputs.startTotalGames;
  const { bellCount: grapeCount, nonDuplicateCherryCount, soloBigCount, cherryBigCount, rareBigCount, soloRegCount, cherryRegCount } = inputs;

  const triggerBigTotal = soloBigCount + cherryBigCount + rareBigCount;
  const triggerRegTotal = soloRegCount + cherryRegCount;
  const playedBigCount = Math.max(inputs.currentBigCount - inputs.startBigCount, triggerBigTotal);
  const playedRegCount = Math.max(inputs.currentRegCount - inputs.startRegCount, triggerRegTotal);

  // Determine which elements to use for likelihood and display
  const useSpecificBigTriggers = playedGames > 0 && triggerBigTotal > 0;
  const useSpecificRegTriggers = playedGames > 0 && !isGogo && triggerRegTotal > 0;

  const contributingElementKeys = new Set<string>();
  if (playedGames > 0) {
    if (grapeCount > 0) contributingElementKeys.add("ブドウ🍇 確率");
    if (!isFunky && nonDuplicateCherryCount > 0) contributingElementKeys.add("非重複チェリー🍒 確率");
    
    if (useSpecificBigTriggers) {
      contributingElementKeys.add("単独BIG確率");
      contributingElementKeys.add("チェリーBIG確率");
      contributingElementKeys.add("レア役BIG確率");
    } else {
      contributingElementKeys.add("BIG確率");
    }
    
    if (useSpecificRegTriggers) {
      contributingElementKeys.add("単独REG確率");
      contributingElementKeys.add("チェリーREG確率");
    } else {
      contributingElementKeys.add("REG確率");
    }
  }
  if (inputs.startTotalGames > 0) contributingElementKeys.add("開始時データ");

  MY_JUGGLER_V_SETTINGS_NAMES.forEach(setting => {
    let idealTable;
    if (isIm) idealTable = IM_JUGGLER_EX_IDEAL_RATES;
    else if (isGogo) idealTable = GOGO_JUGGLER_3_IDEAL_RATES;
    else if (isFunky) idealTable = FUNKY_JUGGLER_IDEAL_RATES;
    else idealTable = IM_JUGGLER_EX_IDEAL_RATES; // Fallback

    const rates = idealTable[setting];

    allPossibleElementNames.forEach(elementName => {
      let logL = 0;
      switch (elementName) {
        case "BIG確率": logL = getLogLikelihoodForBinomial(playedBigCount, playedGames, rates.totalBig); break;
        case "REG確率": 
            const regP = isGogo ? (rates as any).reg : ((rates as any).soloReg + (rates as any).cherryReg);
            logL = getLogLikelihoodForBinomial(playedRegCount, playedGames, regP); 
            break;
        case "単独BIG確率": logL = getLogLikelihoodForBinomial(soloBigCount, playedGames, (rates as any).soloBig); break;
        case "チェリーBIG確率": logL = getLogLikelihoodForBinomial(cherryBigCount, playedGames, (rates as any).cherryBig); break;
        case "レア役BIG確率": logL = getLogLikelihoodForBinomial(rareBigCount, playedGames, (rates as any).rareBig); break;
        case "単独REG確率": if(!isGogo) logL = getLogLikelihoodForBinomial(soloRegCount, playedGames, (rates as any).soloReg); break;
        case "チェリーREG確率": if(!isGogo) logL = getLogLikelihoodForBinomial(cherryRegCount, playedGames, (rates as any).cherryReg); break;
        case "ブドウ🍇 確率": logL = getLogLikelihoodForBinomial(grapeCount, playedGames, rates.grape); break;
        case "非重複チェリー🍒 確率": if(!isFunky) logL = getLogLikelihoodForBinomial(nonDuplicateCherryCount, playedGames, (rates as any).nonDuplicateCherry); break;
        case "開始時データ":
          if (inputs.startTotalGames > 0) {
            const startBigL = getLogLikelihoodForBinomial(inputs.startBigCount, inputs.startTotalGames, rates.totalBig);
            const regPStart = isGogo ? (rates as any).reg : ((rates as any).soloReg + (rates as any).cherryReg);
            const startRegL = getLogLikelihoodForBinomial(inputs.startRegCount, inputs.startTotalGames, regPStart);
            logL = (isFinite(startBigL) && isFinite(startRegL)) ? startBigL + startRegL : -Infinity;
          }
          break;
      }
      breakdownLikelihoods[elementName][setting] = logL;
    });
  });

  allPossibleElementNames.forEach(elementName => {
    const tempLog = breakdownLikelihoods[elementName];
    const maxLogL = Math.max(...Object.values(tempLog).filter(isFinite));
    MY_JUGGLER_V_SETTINGS_NAMES.forEach(setting => {
      if (isFinite(tempLog[setting])) {
        breakdownLikelihoods[elementName][setting] = Math.exp(tempLog[setting] - maxLogL);
      } else {
        breakdownLikelihoods[elementName][setting] = 0;
      }
      if (breakdownLikelihoods[elementName][setting] < MIN_LIKELIHOOD && contributingElementKeys.has(elementName)) {
        breakdownLikelihoods[elementName][setting] = MIN_LIKELIHOOD;
      } else if (!contributingElementKeys.has(elementName)) {
        breakdownLikelihoods[elementName][setting] = 1.0;
      }
    });
    breakdownLikelihoods[elementName] = normalizeProbabilities(breakdownLikelihoods[elementName]);
  });

  MY_JUGGLER_V_SETTINGS_NAMES.forEach(setting => {
    let product = 1.0;
    contributingElementKeys.forEach(key => product *= breakdownLikelihoods[key][setting]);
    overallLikelihoods[setting] = product;
  });

  if (playedGames > 0) {
    observedRates["BIG確率"] = playedBigCount > 0 ? `1/${(playedGames / playedBigCount).toFixed(1)}` : "0回";
    observedRates["REG確率"] = playedRegCount > 0 ? `1/${(playedGames / playedRegCount).toFixed(1)}` : "0回";
    
    if (useSpecificBigTriggers) {
      observedRates["単独BIG確率"] = soloBigCount > 0 ? `1/${(playedGames / soloBigCount).toFixed(1)}` : "0回";
      observedRates["チェリーBIG確率"] = cherryBigCount > 0 ? `1/${(playedGames / cherryBigCount).toFixed(1)}` : "0回";
      observedRates["レア役BIG確率"] = rareBigCount > 0 ? `1/${(playedGames / rareBigCount).toFixed(1)}` : "0回";
    }
    if (useSpecificRegTriggers) {
      observedRates["単独REG確率"] = soloRegCount > 0 ? `1/${(playedGames / soloRegCount).toFixed(1)}` : "0回";
      observedRates["チェリーREG確率"] = cherryRegCount > 0 ? `1/${(playedGames / cherryRegCount).toFixed(1)}` : "0回";
    }

    if (grapeCount > 0) observedRates["ブドウ🍇 確率"] = `1/${(playedGames / grapeCount).toFixed(2)}`;
    if (!isFunky && nonDuplicateCherryCount > 0) observedRates["非重複チェリー🍒 確率"] = `1/${(playedGames / nonDuplicateCherryCount).toFixed(1)}`;
  }

  // Calculate estimated payout
  let estimatedPayout: number | null = null;
  if (inputs.currentNetMedals !== null && playedGames > 0) {
    estimatedPayout = inputs.currentNetMedals;
  } else if (playedGames > 0) {
    const replayCount = playedGames / 7.3;
    const investment = playedGames * 3;
    
    let idealTable;
    if (isIm) idealTable = IM_JUGGLER_EX_IDEAL_RATES;
    else if (isGogo) idealTable = GOGO_JUGGLER_3_IDEAL_RATES;
    else if (isFunky) idealTable = FUNKY_JUGGLER_IDEAL_RATES;
    else idealTable = IM_JUGGLER_EX_IDEAL_RATES;

    let grapeCountForCalc = inputs.bellCount;
    if (inputs.bellCount <= 0) {
        grapeCountForCalc = playedGames * idealTable[KingHanaHanaSetting.SETTING_1].grape;
    }
    
    const triggerCherryTotal = inputs.cherryBigCount + inputs.cherryRegCount;
    let cherryCountForCalc = nonDuplicateCherryCount + triggerCherryTotal;
    
    if (isFunky || cherryCountForCalc <= 0) {
        cherryCountForCalc = playedGames / 35.62; 
    }

    const bigMedals = isIm ? 252 : isFunky ? 240 : 240; // Funky is 240 as per standard S juggler specs
    const regMedals = 96;

    const payoutValue = (bigMedals * playedBigCount) + 
                        (regMedals * playedRegCount) + 
                        (8 * grapeCountForCalc) + 
                        (2 * cherryCountForCalc) + 
                        (3 * replayCount);
    estimatedPayout = payoutValue - investment;
  }

  return {
    overallProbabilities: normalizeProbabilities(overallLikelihoods),
    breakdownProbabilities: breakdownLikelihoods,
    activeElementKeys: [...contributingElementKeys],
    observedRates,
    estimatedPayout
  };
};