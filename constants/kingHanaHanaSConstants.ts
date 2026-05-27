// constants/kingHanaHanaSConstants.ts
import type { KingHanaHanaSInput } from '../types';
import { KingHanaHanaSideLampColor } from '../types'; // Import from types.ts

export enum KingHanaHanaSetting {
  SETTING_1 = "設定1",
  SETTING_2 = "設定2",
  SETTING_3 = "設定3",
  SETTING_4 = "設定4",
  SETTING_5 = "設定5",
  SETTING_6 = "設定6",
}

export const KING_HANA_HANA_SETTINGS_NAMES: KingHanaHanaSetting[] = Object.values(KingHanaHanaSetting);

// Re-export from types.ts for clarity if used here, or ensure types.ts is the source of truth
export { KingHanaHanaSideLampColor };

export const KING_HANA_HANA_SIDE_LAMP_COLOR_OPTIONS_FOR_UI_LABELS: KingHanaHanaSideLampColor[] = [ // Renamed for clarity
    KingHanaHanaSideLampColor.BLUE,
    KingHanaHanaSideLampColor.YELLOW,
    KingHanaHanaSideLampColor.GREEN,
    KingHanaHanaSideLampColor.RED,
    KingHanaHanaSideLampColor.RAINBOW,
];


export const initialKingHanaHanaSInputs: KingHanaHanaSInput = {
  startTotalGames: 0,
  startBigCount: 0,
  startRegCount: 0,
  startNetMedals: null, // Added
  currentTotalGames: 0,
  currentBigCount: 0,
  currentRegCount: 0,
  currentNetMedals: null,
  bellCount: 0,
  watermelonInBigCount: 0,
  bigBlankCount: 0, 
  retroSoundNumerator: 0,
  retroSoundDenominator: 0, // Corresponds to currentBigCount for this test set
  
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

export const GAMES_PER_BIG_BONUS = 20; // BIG1回あたりの平均ゲーム数

// Updated ideal rates based on https://hanahana-fun.com/kinhana.html
export const KING_HANA_HANA_IDEAL_RATES: Record<KingHanaHanaSetting, {big: number, reg: number, bell: number, watermelonInBig: number, bigBlank: number, retroSound: number}> = {
  [KingHanaHanaSetting.SETTING_1]: { big: 1/292, reg: 1/489, bell: 1/7.15, watermelonInBig: 1/42.9, bigBlank: 1/61874.8, retroSound: 1/16.15 }, // bigBlank is a placeholder
  [KingHanaHanaSetting.SETTING_2]: { big: 1/280, reg: 1/452, bell: 1/7.10, watermelonInBig: 1/38.9, bigBlank: 1/47006.3, retroSound: 1/13.49 }, // bigBlank is a placeholder
  [KingHanaHanaSetting.SETTING_3]: { big: 1/268, reg: 1/420, bell: 1/7.05, watermelonInBig: 1/36.2, bigBlank: 1/18761.3, retroSound: 1/12.47 }, // bigBlank is a placeholder
  [KingHanaHanaSetting.SETTING_4]: { big: 1/257, reg: 1/390, bell: 1/7.00, watermelonInBig: 1/32.3, bigBlank: 1/16253.7, retroSound: 1/10.71 }, // bigBlank is a placeholder
  [KingHanaHanaSetting.SETTING_5]: { big: 1/244, reg: 1/360, bell: 1/6.95, watermelonInBig: 1/30.0, bigBlank: 1/12965.5, retroSound: 1/9.51 }, // bigBlank is a placeholder
  [KingHanaHanaSetting.SETTING_6]: { big: 1/232, reg: 1/332, bell: 1/6.90, watermelonInBig: 1/28.0, bigBlank: 1/9842.4, retroSound: 1/7.73 }, // bigBlank is a placeholder
};

// Probabilities for REG中サイドランプ (REG During Side Lamp) - NONE redistributed
export const REG_DURING_SIDE_LAMP_PROBS: Record<KingHanaHanaSetting, Record<KingHanaHanaSideLampColor, number>> = {
  [KingHanaHanaSetting.SETTING_1]: { 
    [KingHanaHanaSideLampColor.BLUE]:    0.360236, 
    [KingHanaHanaSideLampColor.YELLOW]:  0.237624, 
    [KingHanaHanaSideLampColor.GREEN]:   0.236924, 
    [KingHanaHanaSideLampColor.RED]:     0.164716, 
    [KingHanaHanaSideLampColor.RAINBOW]: 0.000500, 
    [KingHanaHanaSideLampColor.NONE]:    0.000000 
  },
  [KingHanaHanaSetting.SETTING_2]: { 
    [KingHanaHanaSideLampColor.BLUE]:    0.2303, 
    [KingHanaHanaSideLampColor.YELLOW]:  0.3535, 
    [KingHanaHanaSideLampColor.GREEN]:   0.1666, 
    [KingHanaHanaSideLampColor.RED]:     0.2490, 
    [KingHanaHanaSideLampColor.RAINBOW]: 0.0006, 
    [KingHanaHanaSideLampColor.NONE]:    0.0000 
  },
  [KingHanaHanaSetting.SETTING_3]: { 
    [KingHanaHanaSideLampColor.BLUE]:    0.331033, 
    [KingHanaHanaSideLampColor.YELLOW]:  0.223322, 
    [KingHanaHanaSideLampColor.GREEN]:   0.268927, 
    [KingHanaHanaSideLampColor.RED]:     0.175918, 
    [KingHanaHanaSideLampColor.RAINBOW]: 0.000800, 
    [KingHanaHanaSideLampColor.NONE]:    0.000000 
  },
  [KingHanaHanaSetting.SETTING_4]: { 
    [KingHanaHanaSideLampColor.BLUE]:    0.2128, 
    [KingHanaHanaSideLampColor.YELLOW]:  0.3221, 
    [KingHanaHanaSideLampColor.GREEN]:   0.1828, 
    [KingHanaHanaSideLampColor.RED]:     0.2804, 
    [KingHanaHanaSideLampColor.RAINBOW]: 0.0019, 
    [KingHanaHanaSideLampColor.NONE]:    0.0000 
  },
  [KingHanaHanaSetting.SETTING_5]: { 
    [KingHanaHanaSideLampColor.BLUE]:    0.308988, 
    [KingHanaHanaSideLampColor.YELLOW]:  0.206931, 
    [KingHanaHanaSideLampColor.GREEN]:   0.289140, 
    [KingHanaHanaSideLampColor.RED]:     0.191114, 
    [KingHanaHanaSideLampColor.RAINBOW]: 0.003828, 
    [KingHanaHanaSideLampColor.NONE]:    0.000000 
  },
  [KingHanaHanaSetting.SETTING_6]: { 
    [KingHanaHanaSideLampColor.BLUE]:    0.2460, 
    [KingHanaHanaSideLampColor.YELLOW]:  0.2500, 
    [KingHanaHanaSideLampColor.GREEN]:   0.2481, 
    [KingHanaHanaSideLampColor.RED]:     0.2483, 
    [KingHanaHanaSideLampColor.RAINBOW]: 0.0076, 
    [KingHanaHanaSideLampColor.NONE]:    0.0000 
  },
};

// Probabilities for BIG後フェザーランプ (BIG After Feather Lamp)
export const BIG_AFTER_FEATHER_LAMP_PROBS: Record<KingHanaHanaSetting, Record<KingHanaHanaSideLampColor, number>> = {
  [KingHanaHanaSetting.SETTING_1]: { [KingHanaHanaSideLampColor.BLUE]: 0.0360, [KingHanaHanaSideLampColor.YELLOW]: 0.0285, [KingHanaHanaSideLampColor.GREEN]: 0.0191, [KingHanaHanaSideLampColor.RED]: 0.0127, [KingHanaHanaSideLampColor.RAINBOW]: 0.0001, [KingHanaHanaSideLampColor.NONE]: 0.9036 },
  [KingHanaHanaSetting.SETTING_2]: { [KingHanaHanaSideLampColor.BLUE]: 0.0406, [KingHanaHanaSideLampColor.YELLOW]: 0.0301, [KingHanaHanaSideLampColor.GREEN]: 0.0206, [KingHanaHanaSideLampColor.RED]: 0.0137, [KingHanaHanaSideLampColor.RAINBOW]: 0.0004, [KingHanaHanaSideLampColor.NONE]: 0.8946 },
  [KingHanaHanaSetting.SETTING_3]: { [KingHanaHanaSideLampColor.BLUE]: 0.0429, [KingHanaHanaSideLampColor.YELLOW]: 0.0352, [KingHanaHanaSideLampColor.GREEN]: 0.0233, [KingHanaHanaSideLampColor.RED]: 0.0150, [KingHanaHanaSideLampColor.RAINBOW]: 0.0007, [KingHanaHanaSideLampColor.NONE]: 0.8829 },
  [KingHanaHanaSetting.SETTING_4]: { [KingHanaHanaSideLampColor.BLUE]: 0.0489, [KingHanaHanaSideLampColor.YELLOW]: 0.0394, [KingHanaHanaSideLampColor.GREEN]: 0.0252, [KingHanaHanaSideLampColor.RED]: 0.0157, [KingHanaHanaSideLampColor.RAINBOW]: 0.0007, [KingHanaHanaSideLampColor.NONE]: 0.8701 },
  [KingHanaHanaSetting.SETTING_5]: { [KingHanaHanaSideLampColor.BLUE]: 0.0537, [KingHanaHanaSideLampColor.YELLOW]: 0.0409, [KingHanaHanaSideLampColor.GREEN]: 0.0266, [KingHanaHanaSideLampColor.RED]: 0.0175, [KingHanaHanaSideLampColor.RAINBOW]: 0.0022, [KingHanaHanaSideLampColor.NONE]: 0.8591 },
  [KingHanaHanaSetting.SETTING_6]: { [KingHanaHanaSideLampColor.BLUE]: 0.0583, [KingHanaHanaSideLampColor.YELLOW]: 0.0458, [KingHanaHanaSideLampColor.GREEN]: 0.0309, [KingHanaHanaSideLampColor.RED]: 0.0191, [KingHanaHanaSideLampColor.RAINBOW]: 0.0040, [KingHanaHanaSideLampColor.NONE]: 0.8419 },
};

// Probabilities for REG後フェザーランプ (REG After Feather Lamp)
export const REG_AFTER_FEATHER_LAMP_PROBS: Record<KingHanaHanaSetting, Record<KingHanaHanaSideLampColor, number>> = {
  [KingHanaHanaSetting.SETTING_1]: { [KingHanaHanaSideLampColor.BLUE]: 0.0000, [KingHanaHanaSideLampColor.YELLOW]: 0.0000, [KingHanaHanaSideLampColor.GREEN]: 0.0000, [KingHanaHanaSideLampColor.RED]: 0.0000, [KingHanaHanaSideLampColor.RAINBOW]: 0.0000, [KingHanaHanaSideLampColor.NONE]: 1.0000 },
  [KingHanaHanaSetting.SETTING_2]: { [KingHanaHanaSideLampColor.BLUE]: 0.0022, [KingHanaHanaSideLampColor.YELLOW]: 0.0000, [KingHanaHanaSideLampColor.GREEN]: 0.0000, [KingHanaHanaSideLampColor.RED]: 0.0000, [KingHanaHanaSideLampColor.RAINBOW]: 0.0000, [KingHanaHanaSideLampColor.NONE]: 0.9978 },
  [KingHanaHanaSetting.SETTING_3]: { [KingHanaHanaSideLampColor.BLUE]: 0.0017, [KingHanaHanaSideLampColor.YELLOW]: 0.0017, [KingHanaHanaSideLampColor.GREEN]: 0.0000, [KingHanaHanaSideLampColor.RED]: 0.0000, [KingHanaHanaSideLampColor.RAINBOW]: 0.0000, [KingHanaHanaSideLampColor.NONE]: 0.9966 },
  [KingHanaHanaSetting.SETTING_4]: { [KingHanaHanaSideLampColor.BLUE]: 0.0040, [KingHanaHanaSideLampColor.YELLOW]: 0.0024, [KingHanaHanaSideLampColor.GREEN]: 0.0023, [KingHanaHanaSideLampColor.RED]: 0.0000, [KingHanaHanaSideLampColor.RAINBOW]: 0.0000, [KingHanaHanaSideLampColor.NONE]: 0.9913 },
  [KingHanaHanaSetting.SETTING_5]: { [KingHanaHanaSideLampColor.BLUE]: 0.0042, [KingHanaHanaSideLampColor.YELLOW]: 0.0041, [KingHanaHanaSideLampColor.GREEN]: 0.0013, [KingHanaHanaSideLampColor.RED]: 0.0024, [KingHanaHanaSideLampColor.RAINBOW]: 0.0000, [KingHanaHanaSideLampColor.NONE]: 0.9880 },
  [KingHanaHanaSetting.SETTING_6]: { [KingHanaHanaSideLampColor.BLUE]: 0.0043, [KingHanaHanaSideLampColor.YELLOW]: 0.0043, [KingHanaHanaSideLampColor.GREEN]: 0.0041, [KingHanaHanaSideLampColor.RED]: 0.0024, [KingHanaHanaSideLampColor.RAINBOW]: 0.0022, [KingHanaHanaSideLampColor.NONE]: 0.9827 },
};

export const KING_HANA_HANA_MACHINE_PAYOUT_RATES: Record<KingHanaHanaSetting, number> = {
  [KingHanaHanaSetting.SETTING_1]: 97,
  [KingHanaHanaSetting.SETTING_2]: 99,
  [KingHanaHanaSetting.SETTING_3]: 101,
  [KingHanaHanaSetting.SETTING_4]: 104,
  [KingHanaHanaSetting.SETTING_5]: 107,
  [KingHanaHanaSetting.SETTING_6]: 110,
};
// Note: The sum of probabilities for lamp colors does not equal 1 for each setting based on the source.
// The 'NONE' category is calculated as 1 - sum(other colors) for each setting.
// This assumes that if a specific color is not observed, it falls into a "no special color" or "base color" category.
// The calculation logic in kingHanaHanaSCalculator.ts will need to handle this.
// BIG中ハズレ (bigBlank) rate is still a placeholder as it's not found on the provided site.
// Old KING_HANA_HANA_SIDE_LAMP_APPEARANCE_WEIGHTS and KING_HanaHana_ELEMENT_WEIGHTS are removed.
// TOTAL_FLAGS constant for flag-based calculation is removed as probabilities are used directly.
// (If flag-based was intended, this file would need integer counts, not decimal probabilities)
// For REG_DURING_SIDE_LAMP_PROBS, NONE has been redistributed.
// For BIG_AFTER_FEATHER_LAMP_PROBS and REG_AFTER_FEATHER_LAMP_PROBS, NONE still exists as per original data.