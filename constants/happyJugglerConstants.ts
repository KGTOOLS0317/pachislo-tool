// constants/happyJugglerConstants.ts

export const HAPPY_JUGGLER_SETTINGS_NAMES = [
  "設定1", "設定2", "設定3", "設定4", "設定5", "設定6"
];

export interface HappyJugglerRates {
  soloBig: number;
  cherryBig: number;
  soloReg: number;
  cherryReg: number;
  grape: number;
  nonDuplicateCherry: number;
  totalBig: number;
  totalReg: number;
}

export const HAPPY_JUGGLER_IDEAL_RATES: Record<string, HappyJugglerRates> = {
  "設定1": {
    soloBig: 1 / 334.4,
    cherryBig: 1 / 1489.5,
    soloReg: 1 / 636.3,
    cherryReg: 1 / 1057.0,
    grape: 1 / 6.04,
    nonDuplicateCherry: 1 / 62.18,
    totalBig: (1 / 334.4) + (1 / 1489.5),
    totalReg: (1 / 636.3) + (1 / 1057.0),
  },
  "設定2": {
    soloBig: 1 / 331.0,
    cherryBig: 1 / 1489.5,
    soloReg: 1 / 569.9,
    cherryReg: 1 / 993.0,
    grape: 1 / 6.01,
    nonDuplicateCherry: 1 / 62.47,
    totalBig: (1 / 331.0) + (1 / 1489.5),
    totalReg: (1 / 569.9) + (1 / 993.0),
  },
  "設定3": {
    soloBig: 1 / 319.7,
    cherryBig: 1 / 1489.5,
    soloReg: 1 / 532.8,
    cherryReg: 1 / 885.6,
    grape: 1 / 5.98,
    nonDuplicateCherry: 1 / 63.05,
    totalBig: (1 / 319.7) + (1 / 1489.5),
    totalReg: (1 / 532.8) + (1 / 885.6),
  },
  "設定4": {
    soloBig: 1 / 321.3,
    cherryBig: 1 / 1213.6,
    soloReg: 1 / 478.4,
    cherryReg: 1 / 809.1,
    grape: 1 / 5.84,
    nonDuplicateCherry: 1 / 64.00,
    totalBig: (1 / 321.3) + (1 / 1213.6),
    totalReg: (1 / 478.4) + (1 / 809.1),
  },
  "設定5": {
    soloBig: 1 / 297.9,
    cherryBig: 1 / 1213.6,
    soloReg: 1 / 436.9,
    cherryReg: 1 / 728.2,
    grape: 1 / 5.81,
    nonDuplicateCherry: 1 / 64.63,
    totalBig: (1 / 297.9) + (1 / 1213.6),
    totalReg: (1 / 436.9) + (1 / 728.2),
  },
  "設定6": {
    soloBig: 1 / 277.7,
    cherryBig: 1 / 1213.6,
    soloReg: 1 / 425.6,
    cherryReg: 1 / 642.5,
    grape: 1 / 5.79,
    nonDuplicateCherry: 1 / 65.41,
    totalBig: (1 / 277.7) + (1 / 1213.6),
    totalReg: (1 / 425.6) + (1 / 642.5),
  },
};

export const HAPPY_JUGGLER_MACHINE_PAYOUT_RATES: Record<string, number> = {
  "設定1": 97.0,
  "設定2": 98.1,
  "設定3": 99.9,
  "設定4": 102.9,
  "設定5": 105.8,
  "設定6": 108.4,
};
