// constants/gogoJuggler3Constants.ts
import type { GogoJuggler3Input } from '../types';
import { KingHanaHanaSetting } from './kingHanaHanaSConstants';

export { KingHanaHanaSetting as GogoJuggler3Setting };
export const GOGO_JUGGLER_3_SETTINGS_NAMES = Object.values(KingHanaHanaSetting);

export const initialGogoJuggler3Inputs: GogoJuggler3Input = {
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

export const GOGO_JUGGLER_3_IDEAL_RATES: Record<KingHanaHanaSetting, {
  soloBig: number,
  cherryBig: number,
  rareBig: number,
  reg: number, // Combined REG
  grape: number,
  nonDuplicateCherry: number,
  totalBig: number,
}> = {
  [KingHanaHanaSetting.SETTING_1]: { soloBig: 1/376.64, cherryBig: 1/1337.47, rareBig: 1/2184.53, reg: 1/354.2, grape: 1/6.25, nonDuplicateCherry: 1/33.56, totalBig: 1/293.9 },
  [KingHanaHanaSetting.SETTING_2]: { soloBig: 1/376.64, cherryBig: 1/1337.47, rareBig: 1/2114.06, reg: 1/332.7, grape: 1/6.20, nonDuplicateCherry: 1/33.47, totalBig: 1/293.9 },
  [KingHanaHanaSetting.SETTING_3]: { soloBig: 1/376.64, cherryBig: 1/1337.47, rareBig: 1/2048.00, reg: 1/306.2, grape: 1/6.15, nonDuplicateCherry: 1/33.32, totalBig: 1/293.9 },
  [KingHanaHanaSetting.SETTING_4]: { soloBig: 1/376.64, cherryBig: 1/1337.47, rareBig: 1/1872.46, reg: 1/268.6, grape: 1/6.07, nonDuplicateCherry: 1/33.15, totalBig: 1/293.9 },
  [KingHanaHanaSetting.SETTING_5]: { soloBig: 1/370.26, cherryBig: 1/1310.72, rareBig: 1/1724.63, reg: 1/247.3, grape: 1/6.00, nonDuplicateCherry: 1/33.10, totalBig: 1/288.7 },
  [KingHanaHanaSetting.SETTING_6]: { soloBig: 1/352.34, cherryBig: 1/1260.31, rareBig: 1/1598.44, reg: 1/234.9, grape: 1/5.92, nonDuplicateCherry: 1/32.97, totalBig: 1/275.4 },
};

export const GOGO_JUGGLER_3_MACHINE_PAYOUT_RATES: Record<KingHanaHanaSetting, number> = {
  [KingHanaHanaSetting.SETTING_1]: 97.0,
  [KingHanaHanaSetting.SETTING_2]: 98.2,
  [KingHanaHanaSetting.SETTING_3]: 99.4,
  [KingHanaHanaSetting.SETTING_4]: 101.7,
  [KingHanaHanaSetting.SETTING_5]: 103.8,
  [KingHanaHanaSetting.SETTING_6]: 106.0,
};