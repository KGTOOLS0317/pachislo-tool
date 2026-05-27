// constants/hanaHanaHououConstants.ts
import type { HanaHanaHououInput } from '../types';
import { KingHanaHanaSetting, KING_HANA_HANA_IDEAL_RATES } from './kingHanaHanaSConstants';

// Re-export KingHanaHanaSetting as HanaHanaHououSetting for semantic clarity if needed,
// but using KingHanaHanaSetting directly is fine as they are structurally the same.
export { KingHanaHanaSetting as HanaHanaHououSetting };
export const HANA_HANA_HOUOU_SETTINGS_NAMES = Object.values(KingHanaHanaSetting);

// Re-export lamp probabilities directly from King Hana Hana S constants
export {
  REG_DURING_SIDE_LAMP_PROBS,
  BIG_AFTER_FEATHER_LAMP_PROBS,
  REG_AFTER_FEATHER_LAMP_PROBS,
  KingHanaHanaSideLampColor, // Also re-export if needed by the calculator directly
  KING_HANA_HANA_SIDE_LAMP_COLOR_OPTIONS_FOR_UI_LABELS
} from './kingHanaHanaSConstants';

export const initialHanaHanaHououInputs: HanaHanaHououInput = {
  // Based on initialKingHanaHanaSInputs, adjust if needed for typical Houou play
  startTotalGames: 0,
  startBigCount: 0,
  startRegCount: 0,
  startNetMedals: null, // Added
  currentTotalGames: 0,
  currentBigCount: 0,
  currentRegCount: 0,
  currentNetMedals: null,
  bellCount: 0,
  watermelonInBigCount: 0, // This is "BIG中スイカ"
  bigBlankCount: 0,
  retroSoundNumerator: 0,
  retroSoundDenominator: 0,
  regDuringSideLampBlueCount: 0,
  regDuringSideLampYellowCount: 0,
  regDuringSideLampGreenCount: 0,
  regDuringSideLampRedCount: 0,
  regDuringSideLampRainbowCount: 0,
  bigAfterSideLampBlueCount: 0,
  bigAfterSideLampYellowCount: 0,
  bigAfterSideLampGreenCount: 0,
  bigAfterSideLampRedCount: 0,
  bigAfterSideLampRainbowCount: 0,
  regAfterSideLampBlueCount: 0,
  regAfterSideLampYellowCount: 0,
  regAfterSideLampGreenCount: 0,
  regAfterSideLampRedCount: 0,
  regAfterSideLampRainbowCount: 0,
};

export const GAMES_PER_BIG_BONUS_HOUOU = 24; // 1BIGあたりゲーム数

// Ideal rates for Hana Hana Houou
// BIG, REG, Bell, BIG中スイカ are specific to Houou
// BIG中ハズレ, レトロサウンド are same as King Hana Hana S
export const HANA_HANA_HOUOU_IDEAL_RATES: Record<KingHanaHanaSetting, {big: number, reg: number, bell: number, watermelonInBig: number, bigBlank: number, retroSound: number}> = {
  [KingHanaHanaSetting.SETTING_1]: { 
    big: 1/297, 
    reg: 1/496, 
    bell: 1/7.50, 
    watermelonInBig: 1/48.2, // From "スイカ" image, treated as BIG中スイカ
    bigBlank: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_1].bigBlank, 
    retroSound: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_1].retroSound 
  },
  [KingHanaHanaSetting.SETTING_2]: { 
    big: 1/284, 
    reg: 1/458, 
    bell: 1/7.45, 
    watermelonInBig: 1/44.5,
    bigBlank: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_2].bigBlank, 
    retroSound: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_2].retroSound
  },
  [KingHanaHanaSetting.SETTING_3]: { 
    big: 1/273, 
    reg: 1/425, 
    bell: 1/7.40, 
    watermelonInBig: 1/40.7,
    bigBlank: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_3].bigBlank, 
    retroSound: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_3].retroSound
  },
  [KingHanaHanaSetting.SETTING_4]: { 
    big: 1/262, 
    reg: 1/397, 
    bell: 1/7.32, 
    watermelonInBig: 1/38.2,
    bigBlank: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_4].bigBlank, 
    retroSound: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_4].retroSound 
  },
  [KingHanaHanaSetting.SETTING_5]: { 
    big: 1/249, 
    reg: 1/366, 
    bell: 1/7.30, 
    watermelonInBig: 1/35.1,
    bigBlank: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_5].bigBlank, 
    retroSound: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_5].retroSound
  },
  [KingHanaHanaSetting.SETTING_6]: { 
    big: 1/236, 
    reg: 1/337, 
    bell: 1/7.22, 
    watermelonInBig: 1/31.8,
    bigBlank: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_6].bigBlank, 
    retroSound: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_6].retroSound
  },
};

export const HANA_HANA_HOUOU_MACHINE_PAYOUT_RATES: Record<KingHanaHanaSetting, number> = {
  [KingHanaHanaSetting.SETTING_1]: 97,
  [KingHanaHanaSetting.SETTING_2]: 99,
  [KingHanaHanaSetting.SETTING_3]: 101,
  [KingHanaHanaSetting.SETTING_4]: 103,
  [KingHanaHanaSetting.SETTING_5]: 106,
  [KingHanaHanaSetting.SETTING_6]: 109,
};