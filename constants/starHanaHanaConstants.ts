// constants/starHanaHanaConstants.ts
import type { StarHanaHanaInput } from '../types';
import { KingHanaHanaSetting, KING_HANA_HANA_IDEAL_RATES, REG_DURING_SIDE_LAMP_PROBS, BIG_AFTER_FEATHER_LAMP_PROBS, REG_AFTER_FEATHER_LAMP_PROBS } from './kingHanaHanaSConstants';

export { KingHanaHanaSetting as StarHanaHanaSetting };
export const STAR_HANA_HANA_SETTINGS_NAMES = Object.values(KingHanaHanaSetting);

export const initialStarHanaHanaInputs: StarHanaHanaInput = {
  startTotalGames: 0,
  startBigCount: 0,
  startRegCount: 0,
  startNetMedals: null,
  currentTotalGames: 0,
  currentBigCount: 0,
  currentRegCount: 0,
  currentNetMedals: null,
  bellCount: 0,
  watermelonInBigCount: 0,
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

export const GAMES_PER_BIG_BONUS_STAR_HANA = 20; //キングハナハナSと同じと仮定

export const STAR_HANA_HANA_IDEAL_RATES: Record<KingHanaHanaSetting, {
  big: number,
  reg: number,
  bell: number,
  replay: number, 
  cherry: number, 
  suika: number,
  watermelonInBig: number, // KHHから参照
  bigBlank: number,        // KHHから参照
  retroSound: number       // KHHから参照
}> = {
  [KingHanaHanaSetting.SETTING_1]: { big: 1/270, reg: 1/387, bell: 1/6.22, replay: 1/7.30, cherry: 1/48.7, suika: 1/159.8, watermelonInBig: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_1].watermelonInBig, bigBlank: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_1].bigBlank, retroSound: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_1].retroSound },
  [KingHanaHanaSetting.SETTING_2]: { big: 1/262, reg: 1/354, bell: 1/6.17, replay: 1/7.30, cherry: 1/48.7, suika: 1/159.8, watermelonInBig: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_2].watermelonInBig, bigBlank: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_2].bigBlank, retroSound: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_2].retroSound },
  [KingHanaHanaSetting.SETTING_3]: { big: 1/252, reg: 1/322, bell: 1/6.17, replay: 1/7.30, cherry: 1/48.7, suika: 1/159.8, watermelonInBig: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_3].watermelonInBig, bigBlank: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_3].bigBlank, retroSound: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_3].retroSound },
  [KingHanaHanaSetting.SETTING_4]: { big: 1/240, reg: 1/293, bell: 1/6.13, replay: 1/7.30, cherry: 1/48.7, suika: 1/159.8, watermelonInBig: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_4].watermelonInBig, bigBlank: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_4].bigBlank, retroSound: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_4].retroSound },
  [KingHanaHanaSetting.SETTING_5]: { big: 1/229, reg: 1/267, bell: 1/6.08, replay: 1/7.30, cherry: 1/48.7, suika: 1/159.8, watermelonInBig: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_5].watermelonInBig, bigBlank: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_5].bigBlank, retroSound: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_5].retroSound },
  [KingHanaHanaSetting.SETTING_6]: { big: 1/218, reg: 1/242, bell: 1/6.08, replay: 1/7.30, cherry: 1/48.7, suika: 1/159.8, watermelonInBig: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_6].watermelonInBig, bigBlank: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_6].bigBlank, retroSound: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_6].retroSound },
};

export const STAR_HANA_HANA_MACHINE_PAYOUT_RATES: Record<KingHanaHanaSetting, number> = {
  [KingHanaHanaSetting.SETTING_1]: 97,
  [KingHanaHanaSetting.SETTING_2]: 99,
  [KingHanaHanaSetting.SETTING_3]: 101,
  [KingHanaHanaSetting.SETTING_4]: 104,
  [KingHanaHanaSetting.SETTING_5]: 107,
  [KingHanaHanaSetting.SETTING_6]: 110,
};

// キングハナハナSのランプ確率をそのまま使用
export { REG_DURING_SIDE_LAMP_PROBS as SHH_REG_DURING_SIDE_LAMP_PROBS };
export { BIG_AFTER_FEATHER_LAMP_PROBS as SHH_BIG_AFTER_FEATHER_LAMP_PROBS };
export { REG_AFTER_FEATHER_LAMP_PROBS as SHH_REG_AFTER_FEATHER_LAMP_PROBS };
export { KingHanaHanaSideLampColor, KING_HANA_HANA_SIDE_LAMP_COLOR_OPTIONS_FOR_UI_LABELS } from './kingHanaHanaSConstants';