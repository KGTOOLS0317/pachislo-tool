
// services/monkeyTurnVCalculator.ts
import type { MonkeyTurnVSetInput, MonkeyTurnVScenarioProbabilities } from '../types';
import { 
  ScenarioName, 
  RivalMode, 
  SCENARIOS_DATA, 
  ScenarioData, 
  CharacterName, 
  LampColor,
  LAMP_MIN_GUARANTEED_CONTINUATION,
  ROUND08_CONFIRMING_CHARACTER,
  BLUE_BACKGROUND_R8_CHARS
} from '../constants/monkeyTurnVConstants';

// Helper to normalize probabilities to sum to 1
const normalizeProbabilities = (probs: MonkeyTurnVScenarioProbabilities): MonkeyTurnVScenarioProbabilities => {
  const total = Object.values(probs).reduce((sum, p) => sum + p, 0);
  if (total === 0) {
     const numScenarios = Object.keys(probs).length;
     if (numScenarios > 0) {
        const val = 1 / numScenarios;
        for (const key in probs) {
            probs[key] = val;
        }
     }
    return probs;
  }
  for (const key in probs) {
    probs[key] /= total;
  }
  return probs;
};

export const calculateMonkeyTurnVProbabilities = (
  setInputs: MonkeyTurnVSetInput[],
  rivalMode: RivalMode,
  // scenariosAllData is now SCENARIOS_DATA from monkeyTurnVConstants
): MonkeyTurnVScenarioProbabilities => {
  
  let probabilities: MonkeyTurnVScenarioProbabilities = {};

  // Check for BOAT_KELOT selection first
  const boatKelotSelected = setInputs.some(input => input.startScreen === CharacterName.BOAT_KELOT);

  if (boatKelotSelected) {
    // If BOAT_KELOT is selected, force TEIO scenario
    for (const sName in SCENARIOS_DATA) {
      const scenarioName = sName as ScenarioName;
      if (scenarioName === ScenarioName.TEIO) {
        probabilities[scenarioName] = 1.0;
      } else {
        probabilities[scenarioName] = 0.0;
      }
    }
    // Probabilities are already { TEIO: 1.0, others: 0.0 }, no further normalization needed for this specific case.
    return probabilities;
  }


  // 1. Initialize base probabilities based on RivalMode
  for (const sName in SCENARIOS_DATA) {
    const scenarioName = sName as ScenarioName;
    const scenarioInfo = SCENARIOS_DATA[scenarioName];
    if (rivalMode === RivalMode.PRESENT) {
      probabilities[scenarioName] = scenarioInfo.baseSelectionRates.doguchiMode;
    } else {
      probabilities[scenarioName] = scenarioInfo.baseSelectionRates.standard;
    }
  }
  probabilities = normalizeProbabilities(probabilities);

  // 2. Update probabilities based on each set input
  for (const setInput of setInputs) {
    if (setInput.startScreen === null && setInput.lampColor === null) {
      continue; 
    }

    let nextProbabilitiesUpdate: MonkeyTurnVScenarioProbabilities = {};

    for (const sName in probabilities) {
      const scenarioName = sName as ScenarioName;
      if (probabilities[scenarioName] === 0) { 
        nextProbabilitiesUpdate[scenarioName] = 0;
        continue;
      }

      const scenarioInfo = SCENARIOS_DATA[scenarioName];
      let overallLikelihoodFactor = 1.0;

      // 2a. Character Likelihood
      let charLikelihood = 1.0;
      if (setInput.startScreen !== null) {
        const observedChar = setInput.startScreen;
        
        if (setInput.round === 8) {
          const round8SpecificRule = ROUND08_CONFIRMING_CHARACTER[scenarioName];
          if (round8SpecificRule) {
            if (round8SpecificRule === "ANY_BLUE_BG") {
              if (BLUE_BACKGROUND_R8_CHARS.includes(observedChar)) {
                charLikelihood = (scenarioInfo.characterAppearanceRates[observedChar] || 0);
              } else {
                charLikelihood = 0; 
              }
            } else if (Array.isArray(round8SpecificRule)) { 
              if (round8SpecificRule.includes(observedChar)) {
                charLikelihood = 1.0; 
              } else {
                if (scenarioName === ScenarioName.TEIO && 
                    (observedChar === CharacterName.MONOCHROME_HATANO || observedChar === CharacterName.MONOCHROME_ENOKI)) {
                  charLikelihood = 0.1; 
                } else {
                  charLikelihood = 0; 
                }
              }
            } else { 
              if (observedChar === round8SpecificRule) {
                charLikelihood = 1.0; 
              } else {
                if (scenarioName === ScenarioName.TEIO && 
                    (observedChar === CharacterName.MONOCHROME_HATANO || observedChar === CharacterName.MONOCHROME_ENOKI)) {
                   charLikelihood = 0.1; 
                } else {
                   charLikelihood = 0; 
                }
              }
            }
          } else { 
            charLikelihood = (scenarioInfo.characterAppearanceRates[observedChar] || 0);
          }
        } else { 
          charLikelihood = (scenarioInfo.characterAppearanceRates[observedChar] || 0);
        }
      }
      overallLikelihoodFactor *= charLikelihood;

      // 2b. Lamp Color Likelihood
      let lampLikelihood = 1.0;
      if (setInput.lampColor !== null) {
        const userLampMinContinuation = LAMP_MIN_GUARANTEED_CONTINUATION[setInput.lampColor as LampColor];
        const scenarioRoundExpectedContinuation = scenarioInfo.lampRoundData[setInput.round];

        if (scenarioRoundExpectedContinuation === undefined) {
          lampLikelihood = 0.5; 
        } else {
          if (scenarioRoundExpectedContinuation < userLampMinContinuation) {
            lampLikelihood = 0; 
          }
        }
      }
      overallLikelihoodFactor *= lampLikelihood;
      
      nextProbabilitiesUpdate[scenarioName] = probabilities[scenarioName] * overallLikelihoodFactor;
    }
    probabilities = normalizeProbabilities(nextProbabilitiesUpdate);
  }
  
  const finalProbabilities: MonkeyTurnVScenarioProbabilities = {};
  for(const sName in probabilities) {
    if(probabilities[sName] > 0.00001) { 
      finalProbabilities[sName] = probabilities[sName];
    }
  }

  return Object.keys(finalProbabilities).length > 0 ? normalizeProbabilities(finalProbabilities) : probabilities;
};
