// constants/funkyJugglerConstants.ts
import type { FunkyJugglerInput } from '../types';
import { KingHanaHanaSetting } from './kingHanaHanaSConstants';

export { KingHanaHanaSetting as FunkyJugglerSetting };
export const FUNKY_JUGGLER_SETTINGS_NAMES = Object.values(KingHanaHanaSetting);

export const initialFunkyJugglerInputs: FunkyJugglerInput = {
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

// 解析値
export const FUNKY_JUGGLER_IDEAL_RATES: Record<KingHanaHanaSetting, {
  soloBig: number,
  cherryBig: number,
  soloReg: number,
  cherryReg: number,
  grape: number,
  rareBig: number,
  totalBig: number,
}> = {
  [KingHanaHanaSetting.SETTING_1]: { soloBig: 1/402.06, cherryBig: 1/1456.36, soloReg: 1/636.27, cherryReg: 1/1424.70, grape: 1/5.94, rareBig: 1/1724.63, totalBig: 1/266.4 },
  [KingHanaHanaSetting.SETTING_2]: { soloBig: 1/397.19, cherryBig: 1/1365.33, soloReg: 1/574.88, cherryReg: 1/1394.38, grape: 1/5.92, rareBig: 1/1638.40, totalBig: 1/259.0 },
  [KingHanaHanaSetting.SETTING_3]: { soloBig: 1/397.19, cherryBig: 1/1337.47, soloReg: 1/512.00, cherryReg: 1/1285.02, grape: 1/5.88, rareBig: 1/1560.38, totalBig: 1/256.0 },
  [KingHanaHanaSetting.SETTING_4]: { soloBig: 1/385.51, cherryBig: 1/1337.47, soloReg: 1/448.88, cherryReg: 1/1149.75, grape: 1/5.83, rareBig: 1/1489.45, totalBig: 1/249.2 },
  [KingHanaHanaSetting.SETTING_5]: { soloBig: 1/378.82, cherryBig: 1/1260.31, soloReg: 1/409.60, cherryReg: 1/1110.78, grape: 1/5.76, rareBig: 1/1365.33, totalBig: 1/240.9 },
  [KingHanaHanaSetting.SETTING_6]: { soloBig: 1/339.56, cherryBig: 1/1191.56, soloReg: 1/356.17, cherryReg: 1/992.97, grape: 1/5.67, rareBig: 1/1310.72, totalBig: 1/219.2 },
};

export const FUNKY_JUGGLER_MACHINE_PAYOUT_RATES: Record<KingHanaHanaSetting, number> = {
  [KingHanaHanaSetting.SETTING_1]: 97.0,
  [KingHanaHanaSetting.SETTING_2]: 98.5,
  [KingHanaHanaSetting.SETTING_3]: 100.2,
  [KingHanaHanaSetting.SETTING_4]: 103.0,
  [KingHanaHanaSetting.SETTING_5]: 106.1,
  [KingHanaHanaSetting.SETTING_6]: 109.0,
};
