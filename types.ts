// types.ts
import type { CharacterName as MonkeyTurnCharacterName, LampColor as MonkeyTurnLampColor, ScenarioName as MonkeyTurnScenarioName } from './constants/monkeyTurnVConstants';

export enum GameMode {
  MONKEY_TURN_V = "MONKEY_TURN_V",
  KING_HANA_HANA_S = "KING_HANA_HANA_S",
  HANA_HANA_HOUOU = "HANA_HANA_HOUOU",
  MY_JUGGLER_V = "MY_JUGGLER_V",
  IM_JUGGLER_EX = "IM_JUGGLER_EX",
  HAPPY_JUGGLER = "HAPPY_JUGGLER",
  GOGO_JUGGLER_3 = "GOGO_JUGGLER_3",
  FUNKY_JUGGLER = "FUNKY_JUGGLER",
  DRAGON_HANA_HANA_SENKOU = "DRAGON_HANA_HANA_SENKOU",
  STAR_HANA_HANA = "STAR_HANA_HANA",
  NEW_GETTER_MOUSE = "NEW_GETTER_MOUSE",
}

export enum KingHanaHanaSideLampColor {
  NONE = "なし",
  BLUE = "青🔵",
  YELLOW = "黄🟡",
  GREEN = "緑🟢",
  RED = "赤🔴",
  RAINBOW = "虹🌈",
}

export interface MonkeyTurnVSetInput {
  round: number;
  startScreen: MonkeyTurnCharacterName | null;
  lampColor: MonkeyTurnLampColor | null;
}

export interface MonkeyTurnVScenarioProbabilities {
  [key: string]: number; 
}

// Added for Monkey Turn V Setting Prediction
export enum MonkeyTurnVSetting {
  SETTING_1 = "設定1",
  SETTING_2 = "設定2",
  // Setting 3 is omitted as per user's data
  SETTING_4 = "設定4",
  SETTING_5 = "設定5",
  SETTING_6 = "設定6",
}

export interface MonkeyTurnVSettingInput {
  gamesPlayed: number;
  coin5Count: number;
  ochiCount: number;
  kehaiCount: number;
}

export interface MonkeyTurnVSettingSettingProbabilities {
  [key: string]: number; // SettingName (e.g., "設定1") -> probability
}

export interface MonkeyTurnVSettingProbabilitiesBreakdown {
  [elementName: string]: MonkeyTurnVSettingSettingProbabilities;
}

export interface MonkeyTurnVSettingFullResult {
  overallProbabilities: MonkeyTurnVSettingSettingProbabilities;
  breakdownProbabilities: MonkeyTurnVSettingProbabilitiesBreakdown;
  observedRates?: ObservedRates;
  activeElementKeys?: string[]; // Elements used in calculation based on data
}
// End of Monkey Turn V Setting Prediction types


// Input structure for King Hana Hana S and Hana Hana Houou (identical for now)
export interface KingHanaHanaSInput {
  startTotalGames: number;
  startBigCount: number;
  startRegCount: number;
  startNetMedals: number | null; // Added
  currentTotalGames: number;
  currentBigCount: number;
  currentRegCount: number;
  currentNetMedals: number | null;
  bellCount: number; // For King Hana Hana S: Bell; For My Juggler V: Grape
  watermelonInBigCount: number; // This will be used for "BIG中スイカ"
  bigBlankCount: number;
  retroSoundNumerator: number;
  retroSoundDenominator: number;
  regDuringSideLampBlueCount: number;
  regDuringSideLampYellowCount: number;
  regDuringSideLampGreenCount: number;
  regDuringSideLampRedCount: number;
  regDuringSideLampRainbowCount: number;
  bigAfterSideLampBlueCount: number;
  bigAfterSideLampYellowCount: number;
  bigAfterSideLampGreenCount: number;
  bigAfterSideLampRedCount: number;
  bigAfterSideLampRainbowCount: number;
  regAfterSideLampBlueCount: number;
  regAfterSideLampYellowCount: number;
  regAfterSideLampGreenCount: number;
  regAfterSideLampRedCount: number;
  regAfterSideLampRainbowCount: number;
}
export interface HanaHanaHououInput extends KingHanaHanaSInput {}
export interface DragonHanaHanaSenkouInput extends KingHanaHanaSInput {}
export interface StarHanaHanaInput extends KingHanaHanaSInput {}


export interface MyJugglerVInput extends Omit<KingHanaHanaSInput, 
  'watermelonInBigCount' | 
  'bigBlankCount' | 
  'retroSoundNumerator' | 
  'retroSoundDenominator' |
  'regDuringSideLampBlueCount' |
  'regDuringSideLampYellowCount' |
  'regDuringSideLampGreenCount' |
  'regDuringSideLampRedCount' |
  'regDuringSideLampRainbowCount' |
  'bigAfterSideLampBlueCount' |
  'bigAfterSideLampYellowCount' |
  'bigAfterSideLampGreenCount' |
  'bigAfterSideLampRedCount' |
  'bigAfterSideLampRainbowCount' |
  'regAfterSideLampBlueCount' |
  'regAfterSideLampYellowCount' |
  'regAfterSideLampGreenCount' |
  'regAfterSideLampRedCount' |
  'regAfterSideLampRainbowCount'
> {
  nonDuplicateCherryCount: number; // 非重複チェリー
  soloBigCount: number;           // 単独BIG
  cherryBigCount: number;         // チェリーBIG
  rareBigCount: number;           // レア役BIG
  soloRegCount: number;           // 単独REG
  cherryRegCount: number;         // チェリーREG
}

export interface ImJugglerExInput extends MyJugglerVInput {}
export interface GogoJuggler3Input extends MyJugglerVInput {}
export interface FunkyJugglerInput extends MyJugglerVInput {}

export interface HappyJugglerInput extends MyJugglerVInput {
  clownCount: number;
  happyBellCount: number;
}

export interface NewGetterMouseInput {
  startTotalGames: number;
  startBigCount: number;
  startRegCount: number;
  currentTotalGames: number;
  currentBigCount: number;
  currentRegCount: number;
  currentNetMedals: number | null;
  orangeACount: number;
  orangeBCount: number;
  suikaCount: number;
  cherryCount: number;
  bonusDiagonalOrangeCount: number;
  bonusIchiroCount: number;
  bonusIchiroOpportunityCount: number;
  bonusHazukiCount: number;
  triggerRed7ReplayCount: number;
  triggerNezumiOrangeACount: number;
  triggerBarRichimeCCount: number;
  triggerNezumiRichimeCCount: number;
}


export interface KingHanaHanaSSettingProbabilities {
  [key: string]: number; // SettingName (e.g., "設定1") -> probability
}
export type HanaHanaHououSettingProbabilities = KingHanaHanaSSettingProbabilities;
export type MyJugglerVSettingProbabilities = KingHanaHanaSSettingProbabilities;
export type ImJugglerExSettingProbabilities = KingHanaHanaSSettingProbabilities;
export type GogoJuggler3SettingProbabilities = KingHanaHanaSSettingProbabilities;
export type FunkyJugglerSettingProbabilities = KingHanaHanaSSettingProbabilities;
export type DragonHanaHanaSenkouSettingProbabilities = KingHanaHanaSSettingProbabilities;
export type StarHanaHanaSettingProbabilities = KingHanaHanaSSettingProbabilities;
export type NewGetterMouseSettingProbabilities = KingHanaHanaSSettingProbabilities;
export type HappyJugglerSettingProbabilities = KingHanaHanaSSettingProbabilities;


export interface KingHanaHanaSProbabilitiesBreakdown {
  [elementName: string]: KingHanaHanaSSettingProbabilities;
}
export type HanaHanaHououProbabilitiesBreakdown = KingHanaHanaSProbabilitiesBreakdown;
export type MyJugglerVProbabilitiesBreakdown = KingHanaHanaSProbabilitiesBreakdown;
export type ImJugglerExProbabilitiesBreakdown = KingHanaHanaSProbabilitiesBreakdown;
export type GogoJuggler3ProbabilitiesBreakdown = KingHanaHanaSProbabilitiesBreakdown;
export type FunkyJugglerProbabilitiesBreakdown = KingHanaHanaSProbabilitiesBreakdown;
export type DragonHanaHanaSenkouProbabilitiesBreakdown = KingHanaHanaSProbabilitiesBreakdown; 
export type StarHanaHanaProbabilitiesBreakdown = KingHanaHanaSProbabilitiesBreakdown; 
export type NewGetterMouseProbabilitiesBreakdown = KingHanaHanaSProbabilitiesBreakdown;
export type HappyJugglerProbabilitiesBreakdown = KingHanaHanaSProbabilitiesBreakdown;

export type ObservedRates = Partial<Record<string, string>>;

export interface KingHanaHanaSFullResult {
  overallProbabilities: KingHanaHanaSSettingProbabilities;
  breakdownProbabilities: KingHanaHanaSProbabilitiesBreakdown;
  observedRates?: ObservedRates; 
  activeElementKeys?: string[]; 
  estimatedPayout?: number | null; 
}

export interface HanaHanaHououFullResult extends KingHanaHanaSFullResult {}
export interface MyJugglerVFullResult extends KingHanaHanaSFullResult {}
export interface ImJugglerExFullResult extends KingHanaHanaSFullResult {}
export interface GogoJuggler3FullResult extends KingHanaHanaSFullResult {}
export interface FunkyJugglerFullResult extends KingHanaHanaSFullResult {}
export interface DragonHanaHanaSenkouFullResult extends KingHanaHanaSFullResult {}
export interface StarHanaHanaFullResult extends KingHanaHanaSFullResult {}
export interface NewGetterMouseFullResult extends KingHanaHanaSFullResult {}
export interface HappyJugglerFullResult extends KingHanaHanaSFullResult {}


export type GenericProbabilities = MonkeyTurnVScenarioProbabilities | KingHanaHanaSFullResult | HanaHanaHououFullResult | MonkeyTurnVSettingFullResult | MyJugglerVFullResult | ImJugglerExFullResult | GogoJuggler3FullResult | FunkyJugglerFullResult | DragonHanaHanaSenkouFullResult | StarHanaHanaFullResult | NewGetterMouseFullResult | HappyJugglerFullResult;

export interface GenericResultsDisplayProps {
  probabilities: GenericProbabilities | null; 
  names: string[]; 
  resultTitle?: string; 
  inputChangedSinceLastCalc?: boolean; 
  monkeyTurnScenarioInputs?: MonkeyTurnVSetInput[];
  monkeyTurnRivalMode?: import('./constants/monkeyTurnVConstants').RivalMode;
}

export interface VersionInfo {
  version: string;
  date: string;
  changes: string[];
}