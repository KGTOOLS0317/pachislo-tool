// constants/dragonHanaHanaSenkouConstants.ts
import type { DragonHanaHanaSenkouInput } from '../types';
import { KingHanaHanaSetting, KING_HANA_HANA_IDEAL_RATES, REG_DURING_SIDE_LAMP_PROBS, BIG_AFTER_FEATHER_LAMP_PROBS, REG_AFTER_FEATHER_LAMP_PROBS } from './kingHanaHanaSConstants'; 

export { KingHanaHanaSetting as DragonHanaHanaSenkouSetting };
export const DRAGON_HANA_HANA_SENKOU_SETTINGS_NAMES = Object.values(KingHanaHanaSetting);

export const initialDragonHanaHanaSenkouInputs: DragonHanaHanaSenkouInput = {
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

export const GAMES_PER_BIG_BONUS_DRAGON_HANA = 21; //キングハナハナSと同じと仮定

export const DRAGON_HANA_HANA_SENKOU_IDEAL_RATES: Record<KingHanaHanaSetting, {
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
  [KingHanaHanaSetting.SETTING_1]: { big: 1/256, reg: 1/642, bell: 1/7.13, replay: 1/7.30, cherry: 1/48.7, suika: 1/159.8, watermelonInBig: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_1].watermelonInBig, bigBlank: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_1].bigBlank, retroSound: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_1].retroSound },
  [KingHanaHanaSetting.SETTING_2]: { big: 1/246, reg: 1/585, bell: 1/7.09, replay: 1/7.30, cherry: 1/48.7, suika: 1/159.8, watermelonInBig: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_2].watermelonInBig, bigBlank: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_2].bigBlank, retroSound: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_2].retroSound },
  [KingHanaHanaSetting.SETTING_3]: { big: 1/235, reg: 1/537, bell: 1/7.09, replay: 1/7.30, cherry: 1/48.7, suika: 1/159.8, watermelonInBig: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_3].watermelonInBig, bigBlank: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_3].bigBlank, retroSound: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_3].retroSound },
  [KingHanaHanaSetting.SETTING_4]: { big: 1/224, reg: 1/489, bell: 1/7.02, replay: 1/7.30, cherry: 1/48.7, suika: 1/159.8, watermelonInBig: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_4].watermelonInBig, bigBlank: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_4].bigBlank, retroSound: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_4].retroSound },
  [KingHanaHanaSetting.SETTING_5]: { big: 1/212, reg: 1/442, bell: 1/6.97, replay: 1/7.30, cherry: 1/48.7, suika: 1/159.8, watermelonInBig: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_5].watermelonInBig, bigBlank: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_5].bigBlank, retroSound: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_5].retroSound },
  [KingHanaHanaSetting.SETTING_6]: { big: 1/199, reg: 1/399, bell: 1/6.97, replay: 1/7.30, cherry: 1/48.7, suika: 1/159.8, watermelonInBig: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_6].watermelonInBig, bigBlank: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_6].bigBlank, retroSound: KING_HANA_HANA_IDEAL_RATES[KingHanaHanaSetting.SETTING_6].retroSound },
};

export const DRAGON_HANA_HANA_SENKOU_MACHINE_PAYOUT_RATES: Record<KingHanaHanaSetting, number> = {
  [KingHanaHanaSetting.SETTING_1]: 97,
  [KingHanaHanaSetting.SETTING_2]: 99,
  [KingHanaHanaSetting.SETTING_3]: 101,
  [KingHanaHanaSetting.SETTING_4]: 104,
  [KingHanaHanaSetting.SETTING_5]: 107,
  [KingHanaHanaSetting.SETTING_6]: 110,
};

// キングハナハナSのランプ確率をそのまま使用
export { REG_DURING_SIDE_LAMP_PROBS as DHH_REG_DURING_SIDE_LAMP_PROBS };
export { BIG_AFTER_FEATHER_LAMP_PROBS as DHH_BIG_AFTER_FEATHER_LAMP_PROBS };
export { REG_AFTER_FEATHER_LAMP_PROBS as DHH_REG_AFTER_FEATHER_LAMP_PROBS };
export { KingHanaHanaSideLampColor, KING_HANA_HANA_SIDE_LAMP_COLOR_OPTIONS_FOR_UI_LABELS } from './kingHanaHanaSConstants';