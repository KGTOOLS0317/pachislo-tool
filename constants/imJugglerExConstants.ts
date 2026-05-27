// constants/imJugglerExConstants.ts
import type { ImJugglerExInput } from '../types';
import { KingHanaHanaSetting } from './kingHanaHanaSConstants';

export { KingHanaHanaSetting as ImJugglerExSetting };
export const IM_JUGGLER_EX_SETTINGS_NAMES = Object.values(KingHanaHanaSetting);

export const initialImJugglerExInputs: ImJugglerExInput = {
  startTotalGames: 0,
  startBigCount: 0,
  startRegCount: 0,
  startNetMedals: null,
  currentTotalGames: 0,
  currentBigCount: 0,
  currentRegCount: 0,
  currentNetMedals: null,
  bellCount: 0, // ブドウ
  nonDuplicateCherryCount: 0, 
  soloBigCount: 0,
  cherryBigCount: 0,
  rareBigCount: 0,
  soloRegCount: 0,
  cherryRegCount: 0,
};

export const IM_JUGGLER_EX_IDEAL_RATES: Record<KingHanaHanaSetting, {
  soloBig: number,
  cherryBig: number,
  rareBig: number,
  soloReg: number,
  cherryReg: number,
  grape: number,
  nonDuplicateCherry: number,
  totalBig: number,
}> = {
  [KingHanaHanaSetting.SETTING_1]: { soloBig: 1/431.16, cherryBig: 1/1129.93, rareBig: 1/2184.53, soloReg: 1/630.15, cherryReg: 1/1456.36, grape: 1/6.02, nonDuplicateCherry: 1/33.49, totalBig: 1/312.1 },
  [KingHanaHanaSetting.SETTING_2]: { soloBig: 1/422.81, cherryBig: 1/1129.93, rareBig: 1/2184.53, soloReg: 1/574.88, cherryReg: 1/1310.72, grape: 1/6.02, nonDuplicateCherry: 1/33.44, totalBig: 1/307.7 },
  [KingHanaHanaSetting.SETTING_3]: { soloBig: 1/422.81, cherryBig: 1/1129.93, rareBig: 1/2184.53, soloReg: 1/474.90, cherryReg: 1/1092.27, grape: 1/6.02, nonDuplicateCherry: 1/33.27, totalBig: 1/307.7 },
  [KingHanaHanaSetting.SETTING_4]: { soloBig: 1/417.43, cherryBig: 1/1092.27, rareBig: 1/1820.44, soloReg: 1/448.88, cherryReg: 1/1057.03, grape: 1/6.02, nonDuplicateCherry: 1/33.15, totalBig: 1/300.6 },
  [KingHanaHanaSetting.SETTING_5]: { soloBig: 1/417.43, cherryBig: 1/1092.27, rareBig: 1/1820.44, soloReg: 1/364.09, cherryReg: 1/851.12, grape: 1/6.02, nonDuplicateCherry: 1/32.90, totalBig: 1/300.6 },
  [KingHanaHanaSetting.SETTING_6]: { soloBig: 1/407.06, cherryBig: 1/1092.27, rareBig: 1/1820.44, soloReg: 1/364.09, cherryReg: 1/851.12, grape: 1/5.78, nonDuplicateCherry: 1/32.90, totalBig: 1/295.2 },
};

export const IM_JUGGLER_EX_MACHINE_PAYOUT_RATES: Record<KingHanaHanaSetting, number> = {
  [KingHanaHanaSetting.SETTING_1]: 97.0,
  [KingHanaHanaSetting.SETTING_2]: 98.4,
  [KingHanaHanaSetting.SETTING_3]: 99.8,
  [KingHanaHanaSetting.SETTING_4]: 101.1,
  [KingHanaHanaSetting.SETTING_5]: 103.3,
  [KingHanaHanaSetting.SETTING_6]: 105.5,
};