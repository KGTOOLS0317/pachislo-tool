// constants/myJugglerVConstants.ts
import type { MyJugglerVInput } from '../types';
import { KingHanaHanaSetting } from './kingHanaHanaSConstants'; // Settings 1-6 are common

export { KingHanaHanaSetting as MyJugglerVSetting }; // Alias for semantic clarity
export const MY_JUGGLER_V_SETTINGS_NAMES = Object.values(KingHanaHanaSetting);

export const initialMyJugglerVInputs: MyJugglerVInput = {
  startTotalGames: 0,
  startBigCount: 0,
  startRegCount: 0,
  startNetMedals: null,
  currentTotalGames: 0,
  currentBigCount: 0,
  currentRegCount: 0,
  currentNetMedals: null,
  bellCount: 0, // ブドウ (Grape)
  nonDuplicateCherryCount: 0,
  soloBigCount: 0,
  cherryBigCount: 0,
  rareBigCount: 0,
  soloRegCount: 0,
  cherryRegCount: 0,
};

// Updated Ideal rates for My Juggler V based on user provided table
export const MY_JUGGLER_V_IDEAL_RATES: Record<KingHanaHanaSetting, {
  soloBig: number,
  cherryBig: number,
  rareBig: number,
  soloReg: number,
  cherryReg: number,
  grape: number, 
  nonDuplicateCherry: number,
  totalBig: number,
}> = {
  [KingHanaHanaSetting.SETTING_1]: { 
    soloBig: 1/409.60, 
    cherryBig: 1/1424.70, 
    rareBig: 1/1820.44,
    soloReg: 1/655.36, 
    cherryReg: 1/1092.27, 
    grape: 1/5.90, 
    nonDuplicateCherry: 1/38.10,
    totalBig: 1/273.1,
  },
  [KingHanaHanaSetting.SETTING_2]: { 
    soloBig: 1/407.06, 
    cherryBig: 1/1394.38, 
    rareBig: 1/1820.44,
    soloReg: 1/601.25, 
    cherryReg: 1/1074.36, 
    grape: 1/5.85, 
    nonDuplicateCherry: 1/38.10,
    totalBig: 1/270.8,
  },
  [KingHanaHanaSetting.SETTING_3]: { 
    soloBig: 1/399.61, 
    cherryBig: 1/1365.33, 
    rareBig: 1/1820.44,
    soloReg: 1/492.75, 
    cherryReg: 1/1057.03, 
    grape: 1/5.80, 
    nonDuplicateCherry: 1/36.82,
    totalBig: 1/266.4,
  },
  [KingHanaHanaSetting.SETTING_4]: { 
    soloBig: 1/378.82, 
    cherryBig: 1/1285.02, 
    rareBig: 1/1820.44,
    soloReg: 1/407.06, 
    cherryReg: 1/1008.25, 
    grape: 1/5.78, 
    nonDuplicateCherry: 1/35.62,
    totalBig: 1/254.0,
  },
  [KingHanaHanaSetting.SETTING_5]: { 
    soloBig: 1/354.25, 
    cherryBig: 1/1213.63, 
    rareBig: 1/1820.44,
    soloReg: 1/390.10, 
    cherryReg: 1/862.32, 
    grape: 1/5.76, 
    nonDuplicateCherry: 1/35.62,
    totalBig: 1/240.1,
  },
  [KingHanaHanaSetting.SETTING_6]: { 
    soloBig: 1/337.81, 
    cherryBig: 1/1129.93, 
    rareBig: 1/1820.44,
    soloReg: 1/327.68, 
    cherryReg: 1/762.05, 
    grape: 1/5.66, 
    nonDuplicateCherry: 1/35.62,
    totalBig: 1/229.1,
  },
};

export const MY_JUGGLER_V_MACHINE_PAYOUT_RATES: Record<KingHanaHanaSetting, number> = {
  [KingHanaHanaSetting.SETTING_1]: 97.0,
  [KingHanaHanaSetting.SETTING_2]: 98.0,
  [KingHanaHanaSetting.SETTING_3]: 99.9,
  [KingHanaHanaSetting.SETTING_4]: 102.8,
  [KingHanaHanaSetting.SETTING_5]: 105.3,
  [KingHanaHanaSetting.SETTING_6]: 109.4,
};