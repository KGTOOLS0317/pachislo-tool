
// constants/monkeyTurnVConstants.ts
import type { MonkeyTurnVSettingInput } from '../types';
import { MonkeyTurnVSetting } from '../types';

export enum ScenarioName {
  KAKEDASHI = "🔵駆け出し",
  OSOSAKI = "🔵遅咲き",
  KANTO_GAMASHI = "🟡関東ガマシ",
  DERBY_KING = "🟡ダービーキング",
  TSUKEMAI_KOSHA = "🟡ツケマイ巧者",
  GAMBLER = "🟢ギャンブラー",
  KOITTEN = "🟢紅一点",
  DOGUCHI_SP = "🟢洞口SP",
  TEIKAI_NO_HEROINE = "🟢艇界のヒロイン",
  IPPANSEN_NO_ONI = "🔴一般戦の鬼",
  AICHI_NO_KYOJIN = "🔴愛知の巨人",
  SAIKYO_NO_B2 = "🔴最強のB2",
  GYAKUSHU_NO_TEIO = "🔴逆襲の艇王",
  TEIO = "⚫艇王",
}

export enum CharacterName {
  HATANO = "波多野",
  ENOKI = "榎木", 
  DOGUCHI = "洞口",
  GAMO = "蒲生",
  HAMAOKA = "浜岡",
  KOIKE = "古池",
  DOGUCHI_SR = "洞口親父",
  ARISA = "ありさ",
  KAKOTACHI = "香子達",
  AOSHIMA = "青島",
  KUSHIDA_HAGIWARA_KOBAYASHI = "櫛田&萩原&小林",
  PLAYER_COLLECTIVE = "選手集合",
  HATANO_FAMILY = "波多野家",
  GENERATION_82 = "82期生",
  FEMALE_CHARS = "女性キャラ集合",
  SUMI = "澄",
  MONOCHROME_HATANO = "モノクロ波多野",
  MONOCHROME_ENOKI = "モノクロ榎木",
  HATANO_SUMI = "波多野&澄",
  BOAT_KELOT = "ボートケロット",
}

export enum LampColor {
  WHITE = "白⬜",
  BLUE = "青🟦",
  YELLOW = "黄🟨",
  GREEN = "緑🟩",
  RED = "赤🟥",
  RAINBOW = "虹🌈",
}

export enum RivalMode {
  NOT_PRESENT = "NOT_PRESENT",
  PRESENT = "PRESENT",
}

export interface ScenarioData {
  name: ScenarioName;
  baseSelectionRates: {
    standard: number; 
    doguchiMode: number; 
  };
  characterAppearanceRates: {
    [key in CharacterName]?: number; 
  };
  lampRoundData: {
    [round: number]: number; 
  };
}

export const SCENARIOS_DATA: Record<ScenarioName, ScenarioData> = {
  [ScenarioName.KAKEDASHI]: {
    name: ScenarioName.KAKEDASHI,
    baseSelectionRates: { standard: 0.139, doguchiMode: 0 },
    characterAppearanceRates: { [CharacterName.HATANO]: 0.15, [CharacterName.ENOKI]: 0.15, [CharacterName.DOGUCHI]: 0.14, [CharacterName.GAMO]: 0.14, [CharacterName.HAMAOKA]: 0.14, [CharacterName.KOIKE]: 0.14, [CharacterName.DOGUCHI_SR]: 0.14 },
    lampRoundData: { 1: 0.10, 2: 0.80, 3: 0.10, 4: 0.80, 5: 0.10, 6: 0.80, 7: 0.50, 8: 1.00 }
  },
  [ScenarioName.OSOSAKI]: {
    name: ScenarioName.OSOSAKI,
    baseSelectionRates: { standard: 0.111, doguchiMode: 0 },
    characterAppearanceRates: { [CharacterName.HATANO]: 0.15, [CharacterName.ENOKI]: 0.15, [CharacterName.DOGUCHI]: 0.14, [CharacterName.GAMO]: 0.14, [CharacterName.HAMAOKA]: 0.14, [CharacterName.KOIKE]: 0.14, [CharacterName.DOGUCHI_SR]: 0.14 },
    lampRoundData: { 1: 0.10, 2: 0.25, 3: 0.50, 4: 0.66, 5: 0.80, 6: 1.00, 7: 1.00, 8: 1.00 }
  },
  [ScenarioName.KANTO_GAMASHI]: {
    name: ScenarioName.KANTO_GAMASHI,
    baseSelectionRates: { standard: 0.132, doguchiMode: 0 },
    characterAppearanceRates: { [CharacterName.HATANO]: 0.105, [CharacterName.ENOKI]: 0.07, [CharacterName.DOGUCHI]: 0.095, [CharacterName.GAMO]: 0.095, [CharacterName.HAMAOKA]: 0.105, [CharacterName.KOIKE]: 0.30, [CharacterName.DOGUCHI_SR]: 0.105, [CharacterName.ARISA]: 0.05, [CharacterName.KAKOTACHI]: 0.075 },
    lampRoundData: { 1: 0.50, 2: 0.25, 3: 0.66, 4: 0.10, 5: 0.66, 6: 0.80, 7: 0.50, 8: 1.00 }
  },
  [ScenarioName.DERBY_KING]: {
    name: ScenarioName.DERBY_KING,
    baseSelectionRates: { standard: 0.124, doguchiMode: 0 },
    characterAppearanceRates: { [CharacterName.HATANO]: 0.30, [CharacterName.ENOKI]: 0.085, [CharacterName.DOGUCHI]: 0.095, [CharacterName.GAMO]: 0.095, [CharacterName.HAMAOKA]: 0.095, [CharacterName.KOIKE]: 0.095, [CharacterName.DOGUCHI_SR]: 0.095, [CharacterName.ARISA]: 0.07, [CharacterName.KAKOTACHI]: 0.07 },
    lampRoundData: { 1: 0.80, 2: 0.10, 3: 0.80, 4: 0.10, 5: 0.80, 6: 1.00, 7: 0.50, 8: 1.00 } 
  },
  [ScenarioName.TSUKEMAI_KOSHA]: {
    name: ScenarioName.TSUKEMAI_KOSHA,
    baseSelectionRates: { standard: 0.117, doguchiMode: 0 },
    characterAppearanceRates: { [CharacterName.HATANO]: 0.075, [CharacterName.ENOKI]: 0.065, [CharacterName.DOGUCHI]: 0.08, [CharacterName.GAMO]: 0.08, [CharacterName.HAMAOKA]: 0.30, [CharacterName.KOIKE]: 0.075, [CharacterName.DOGUCHI_SR]: 0.075, [CharacterName.ARISA]: 0.05, [CharacterName.KAKOTACHI]: 0.10, [CharacterName.AOSHIMA]: 0.10 },
    lampRoundData: { 1: 0.66, 2: 0.80, 3: 0.10, 4: 0.66, 5: 0.10, 6: 0.80, 7: 0.50, 8: 1.00 }
  },
  [ScenarioName.GAMBLER]: {
    name: ScenarioName.GAMBLER,
    baseSelectionRates: { standard: 0.052, doguchiMode: 0.188 },
    characterAppearanceRates: { [CharacterName.HATANO]: 0.19, [CharacterName.ENOKI]: 0.075, [CharacterName.DOGUCHI]: 0.08, [CharacterName.GAMO]: 0.08, [CharacterName.HAMAOKA]: 0.08, [CharacterName.KOIKE]: 0.08, [CharacterName.DOGUCHI_SR]: 0.08, [CharacterName.ARISA]: 0.225, [CharacterName.AOSHIMA]: 0.04, [CharacterName.KAKOTACHI]: 0.035,[CharacterName.KUSHIDA_HAGIWARA_KOBAYASHI]: 0.035, [CharacterName.MONOCHROME_HATANO]: 0, [CharacterName.MONOCHROME_ENOKI]: 0 }, 
    lampRoundData: { 1: 1.00, 2: 0.10, 3: 1.00, 4: 0.10, 5: 1.00, 6: 0.10, 7: 1.00, 8: 1.00 }
  },
  [ScenarioName.KOITTEN]: {
    name: ScenarioName.KOITTEN,
    baseSelectionRates: { standard: 0.055, doguchiMode: 0.188 },
    characterAppearanceRates: { [CharacterName.HATANO]: 0.075, [CharacterName.ENOKI]: 0.055, [CharacterName.DOGUCHI]: 0.075, [CharacterName.GAMO]: 0.075, [CharacterName.HAMAOKA]: 0.075, [CharacterName.KOIKE]: 0.075, [CharacterName.DOGUCHI_SR]: 0.06, [CharacterName.ARISA]: 0.055, [CharacterName.KAKOTACHI]: 0.055, [CharacterName.AOSHIMA]: 0.25, [CharacterName.KUSHIDA_HAGIWARA_KOBAYASHI]: 0.075, [CharacterName.PLAYER_COLLECTIVE]: 0.075 },
    lampRoundData: { 1: 0.66, 2: 0.80, 3: 1.00, 4: 0.10, 5: 0.66, 6: 0.10, 7: 0.50, 8: 1.00 }
  },
  [ScenarioName.DOGUCHI_SP]: {
    name: ScenarioName.DOGUCHI_SP,
    baseSelectionRates: { standard: 0.052, doguchiMode: 0.250 },
    characterAppearanceRates: { [CharacterName.HATANO]: 0.045, [CharacterName.ENOKI]: 0.05, [CharacterName.DOGUCHI]: 0.275, [CharacterName.GAMO]: 0.045, [CharacterName.HAMAOKA]: 0.045, [CharacterName.KOIKE]: 0.045, [CharacterName.DOGUCHI_SR]: 0.10, [CharacterName.ARISA]: 0.05, [CharacterName.KAKOTACHI]: 0.065, [CharacterName.AOSHIMA]: 0.08, [CharacterName.KUSHIDA_HAGIWARA_KOBAYASHI]: 0.085, [CharacterName.PLAYER_COLLECTIVE]: 0.065, [CharacterName.GENERATION_82]: 0.05 },
    lampRoundData: { 1: 0.80, 2: 0.80, 3: 0.66, 4: 0.66, 5: 0.50, 6: 0.10, 7: 0.50, 8: 1.00 }
  },
  [ScenarioName.TEIKAI_NO_HEROINE]: {
    name: ScenarioName.TEIKAI_NO_HEROINE,
    baseSelectionRates: { standard: 0.105, doguchiMode: 0 },
    characterAppearanceRates: { [CharacterName.HATANO]: 0.065, [CharacterName.ENOKI]: 0.045, [CharacterName.DOGUCHI]: 0.075, [CharacterName.GAMO]: 0.065, [CharacterName.HAMAOKA]: 0.065, [CharacterName.KOIKE]: 0.12, [CharacterName.DOGUCHI_SR]: 0.065, [CharacterName.ARISA]: 0.075, [CharacterName.KAKOTACHI]: 0.325, [CharacterName.AOSHIMA]: 0.10 },
    lampRoundData: { 1: 0.50, 2: 0.50, 3: 0.50, 4: 0.50, 5: 0.50, 6: 0.50, 7: 0.50, 8: 1.00 }
  },
  [ScenarioName.IPPANSEN_NO_ONI]: {
    name: ScenarioName.IPPANSEN_NO_ONI,
    baseSelectionRates: { standard: 0.052, doguchiMode: 0.188 },
    characterAppearanceRates: { [CharacterName.HATANO]: 0.05, [CharacterName.ENOKI]: 0.05, [CharacterName.DOGUCHI]: 0.05, [CharacterName.GAMO]: 0.325, [CharacterName.HAMAOKA]: 0.05, [CharacterName.KOIKE]: 0.05, [CharacterName.DOGUCHI_SR]: 0.05, [CharacterName.ARISA]: 0.035, [CharacterName.KAKOTACHI]: 0.10, [CharacterName.AOSHIMA]: 0.075, [CharacterName.KUSHIDA_HAGIWARA_KOBAYASHI]: 0.055, [CharacterName.PLAYER_COLLECTIVE]: 0.055, [CharacterName.HATANO_FAMILY]: 0.055 },
    lampRoundData: { 1: 0.66, 2: 0.66, 3: 0.66, 4: 0.66, 5: 0.66, 6: 0.66, 7: 0.50, 8: 1.00 }
  },
  [ScenarioName.AICHI_NO_KYOJIN]: {
    name: ScenarioName.AICHI_NO_KYOJIN,
    baseSelectionRates: { standard: 0.035, doguchiMode: 0.141 },
    characterAppearanceRates: { [CharacterName.HATANO]: 0.03, [CharacterName.ENOKI]: 0.03, [CharacterName.DOGUCHI]: 0.10, [CharacterName.GAMO]: 0.03, [CharacterName.HAMAOKA]: 0.03, [CharacterName.KOIKE]: 0.03, [CharacterName.DOGUCHI_SR]: 0.325, [CharacterName.ARISA]: 0.045, [CharacterName.KAKOTACHI]: 0.045, [CharacterName.AOSHIMA]: 0.045, [CharacterName.KUSHIDA_HAGIWARA_KOBAYASHI]: 0.045, [CharacterName.PLAYER_COLLECTIVE]: 0.05, [CharacterName.HATANO_FAMILY]: 0.05, [CharacterName.GENERATION_82]: 0.05, [CharacterName.FEMALE_CHARS]: 0.05, [CharacterName.SUMI]: 0.045 },
    lampRoundData: { 1: 0.80, 2: 0.80, 3: 0.80, 4: 0.80, 5: 0.80, 6: 0.80, 7: 0.50, 8: 1.00 }
  },
  [ScenarioName.SAIKYO_NO_B2]: {
    name: ScenarioName.SAIKYO_NO_B2,
    baseSelectionRates: { standard: 0.014, doguchiMode: 0.021 },
    characterAppearanceRates: { [CharacterName.HATANO]: 0.125, [CharacterName.ENOKI]: 0.01, [CharacterName.DOGUCHI]: 0.01, [CharacterName.GAMO]: 0.01, [CharacterName.HAMAOKA]: 0.01, [CharacterName.KOIKE]: 0.01, [CharacterName.DOGUCHI_SR]: 0.01, [CharacterName.ARISA]: 0.002, [CharacterName.KAKOTACHI]: 0.002, [CharacterName.AOSHIMA]: 0.002, [CharacterName.KUSHIDA_HAGIWARA_KOBAYASHI]: 0.002, [CharacterName.PLAYER_COLLECTIVE]: 0.002, [CharacterName.HATANO_FAMILY]: 0.002, [CharacterName.GENERATION_82]: 0.002, [CharacterName.FEMALE_CHARS]: 0, [CharacterName.SUMI]: 0, [CharacterName.MONOCHROME_HATANO]: 0.80, [CharacterName.MONOCHROME_ENOKI]: 0 }, 
    lampRoundData: { 1: 0.02, 2: 1.00, 3: 1.00, 4: 1.00, 5: 1.00, 6: 1.00, 7: 1.00, 8: 1.00 }
  },
  [ScenarioName.GYAKUSHU_NO_TEIO]: {
    name: ScenarioName.GYAKUSHU_NO_TEIO,
    baseSelectionRates: { standard: 0.006, doguchiMode: 0.009 },
    characterAppearanceRates: { [CharacterName.HATANO]: 0.015, [CharacterName.ENOKI]: 0.50, [CharacterName.DOGUCHI]: 0.01, [CharacterName.GAMO]: 0.01, [CharacterName.HAMAOKA]: 0.01, [CharacterName.KOIKE]: 0.01, [CharacterName.DOGUCHI_SR]: 0.01, [CharacterName.ARISA]: 0.005, [CharacterName.KAKOTACHI]: 0.005, [CharacterName.AOSHIMA]: 0.005, [CharacterName.KUSHIDA_HAGIWARA_KOBAYASHI]: 0.005, [CharacterName.PLAYER_COLLECTIVE]: 0.005, [CharacterName.HATANO_FAMILY]: 0.005, [CharacterName.GENERATION_82]: 0.005, [CharacterName.FEMALE_CHARS]: 0, [CharacterName.SUMI]: 0, [CharacterName.MONOCHROME_HATANO]: 0, [CharacterName.MONOCHROME_ENOKI]: 0.40 }, 
    lampRoundData: { 1: 1.00, 2: 0.02, 3: 1.00, 4: 1.00, 5: 1.00, 6: 1.00, 7: 1.00, 8: 1.00 }
  },
  [ScenarioName.TEIO]: {
    name: ScenarioName.TEIO,
    baseSelectionRates: { standard: 0.006, doguchiMode: 0.016 },
    characterAppearanceRates: { [CharacterName.HATANO]: 0.035, [CharacterName.ENOKI]: 0.15, [CharacterName.DOGUCHI]: 0.035, [CharacterName.GAMO]: 0.035, [CharacterName.HAMAOKA]: 0.035, [CharacterName.KOIKE]: 0.035, [CharacterName.DOGUCHI_SR]: 0.035, [CharacterName.ARISA]: 0.035, [CharacterName.KAKOTACHI]: 0.035, [CharacterName.AOSHIMA]: 0.035, [CharacterName.KUSHIDA_HAGIWARA_KOBAYASHI]: 0.035, [CharacterName.PLAYER_COLLECTIVE]: 0.05, [CharacterName.HATANO_FAMILY]: 0.05, [CharacterName.GENERATION_82]: 0.05, [CharacterName.FEMALE_CHARS]: 0.05, [CharacterName.SUMI]: 0.08, [CharacterName.MONOCHROME_HATANO]: 0.05, [CharacterName.MONOCHROME_ENOKI]: 0.025, [CharacterName.HATANO_SUMI]: 0.145, [CharacterName.BOAT_KELOT]: 0 }, 
    lampRoundData: { 1: 1.00, 2: 1.00, 3: 1.00, 4: 1.00, 5: 1.00, 6: 1.00, 7: 1.00, 8: 1.00 }
  },
};


export const CHARACTERS: CharacterName[] = Object.values(CharacterName);
export const LAMP_COLORS: LampColor[] = Object.values(LampColor);
export const MTV_SCENARIO_NAMES: ScenarioName[] = Object.values(ScenarioName); // Renamed for clarity


export const LAMP_MIN_GUARANTEED_CONTINUATION: Record<LampColor, number> = {
  [LampColor.WHITE]: 0.00, 
  [LampColor.BLUE]: 0.25,
  [LampColor.YELLOW]: 0.50,
  [LampColor.GREEN]: 0.66,
  [LampColor.RED]: 0.80,
  [LampColor.RAINBOW]: 1.00, 
};

export type Round08CharacterRule = CharacterName | CharacterName[] | "ANY_BLUE_BG";
export const ROUND08_CONFIRMING_CHARACTER: Partial<Record<ScenarioName, Round08CharacterRule>> = {
  [ScenarioName.KAKEDASHI]: "ANY_BLUE_BG",
  [ScenarioName.OSOSAKI]: "ANY_BLUE_BG",
  [ScenarioName.KANTO_GAMASHI]: CharacterName.KOIKE,
  [ScenarioName.DERBY_KING]: CharacterName.HATANO,
  [ScenarioName.TSUKEMAI_KOSHA]: CharacterName.HAMAOKA,
  [ScenarioName.GAMBLER]: CharacterName.ARISA,
  [ScenarioName.KOITTEN]: CharacterName.AOSHIMA,
  [ScenarioName.DOGUCHI_SP]: CharacterName.DOGUCHI,
  [ScenarioName.TEIKAI_NO_HEROINE]: CharacterName.KAKOTACHI,
  [ScenarioName.IPPANSEN_NO_ONI]: CharacterName.GAMO,
  [ScenarioName.AICHI_NO_KYOJIN]: CharacterName.DOGUCHI_SR,
  [ScenarioName.SAIKYO_NO_B2]: CharacterName.MONOCHROME_HATANO,
  [ScenarioName.GYAKUSHU_NO_TEIO]: CharacterName.MONOCHROME_ENOKI,
  [ScenarioName.TEIO]: [CharacterName.HATANO_SUMI, CharacterName.BOAT_KELOT],
};
export const BLUE_BACKGROUND_R8_CHARS: CharacterName[] = [
    CharacterName.HATANO, CharacterName.ENOKI, CharacterName.DOGUCHI, 
    CharacterName.GAMO, CharacterName.HAMAOKA, CharacterName.KOIKE, 
    CharacterName.DOGUCHI_SR
];

// Constants for Monkey Turn V Setting Prediction
export { MonkeyTurnVSetting }; // Re-export from types
export const MONKEY_TURN_V_SETTINGS_NAMES = [
  MonkeyTurnVSetting.SETTING_1,
  MonkeyTurnVSetting.SETTING_2,
  MonkeyTurnVSetting.SETTING_4,
  MonkeyTurnVSetting.SETTING_5,
  MonkeyTurnVSetting.SETTING_6,
];

export const initialMonkeyTurnVSettingInputs: MonkeyTurnVSettingInput = {
  gamesPlayed: 0,
  coin5Count: 0,
  ochiCount: 0,
  kehaiCount: 0,
};

export const MONKEY_TURN_V_IDEAL_RATES: Record<MonkeyTurnVSetting, { coin5Rate: number; ochiRate: number }> = {
  [MonkeyTurnVSetting.SETTING_1]: { coin5Rate: 1 / 38.10, ochiRate: 0.50 }, 
  [MonkeyTurnVSetting.SETTING_2]: { coin5Rate: 1 / 36.01, ochiRate: 0.40 }, 
  [MonkeyTurnVSetting.SETTING_4]: { coin5Rate: 1 / 29.79, ochiRate: 0.40 }, 
  [MonkeyTurnVSetting.SETTING_5]: { coin5Rate: 1 / 26.43, ochiRate: 0.70 }, 
  [MonkeyTurnVSetting.SETTING_6]: { coin5Rate: 1 / 23.08, ochiRate: 0.40 }, 
};

export const characterImageMap: Partial<Record<CharacterName, string>> = {
  [CharacterName.HATANO]: "./zz_image/round/1_HATANO.jpg",
  [CharacterName.ENOKI]: "./zz_image/round/2_ENOKI.jpg",
  [CharacterName.DOGUCHI]: "./zz_image/round/3_DOGUCHI.jpg",
  [CharacterName.GAMO]: "./zz_image/round/4_GAMO.jpg",
  [CharacterName.HAMAOKA]: "./zz_image/round/5_HAMAOKA.jpg",
  [CharacterName.KOIKE]: "./zz_image/round/6_KOIKE.jpg",
  [CharacterName.DOGUCHI_SR]: "./zz_image/round/7_DOGUCHI_SR.jpg",
  [CharacterName.ARISA]: "./zz_image/round/8_ARISA.jpg",
  [CharacterName.KAKOTACHI]: "./zz_image/round/9_KAKOTACHI.jpg",
  [CharacterName.AOSHIMA]: "./zz_image/round/10_AOSHIMA.jpg",
  [CharacterName.KUSHIDA_HAGIWARA_KOBAYASHI]: "./zz_image/round/11_KUSHIDA_HAGIWARA_KOBAYASHI.jpg",
  [CharacterName.PLAYER_COLLECTIVE]: "./zz_image/round/12_PLAYER_COLLECTIVE.jpg",
  [CharacterName.HATANO_FAMILY]: "./zz_image/round/13_HATANO_FAMILY.jpg",
  [CharacterName.GENERATION_82]: "./zz_image/round/14_GENERATION_82.jpg",
  [CharacterName.FEMALE_CHARS]: "./zz_image/round/15_FEMALE_CHARS.jpg",
  [CharacterName.SUMI]: "./zz_image/round/16_SUMI.jpg",
  [CharacterName.MONOCHROME_HATANO]: "./zz_image/round/17_MONOCHROME_HATANO.jpg",
  [CharacterName.MONOCHROME_ENOKI]: "./zz_image/round/18_MONOCHROME_ENOKI.jpg",
  [CharacterName.HATANO_SUMI]: "./zz_image/round/19_HATANO_SUMI.jpg",
  [CharacterName.BOAT_KELOT]: "./zz_image/round/20_BOAT_KELOT.jpg",
};
// Kehai rates can be derived: P(Kehai | Setting, Ochi or Kehai) = 1 - P(Ochi | Setting, Ochi or Kehai)
// S1 Kehai: 0.5
// S2 Kehai: 0.6
// S4 Kehai: 0.6
// S5 Kehai: 0.3
// S6 Kehai: 0.6
// These match the user's provided data:
// 気配 設定1：1/2.00 (0.5)
// 気配 設定2：1/(1/60*100) (0.6)
// 気配 設定4：1/(1/60*100) (0.6)
// 気配 設定5：1/(1/30*100) (0.3)
// 気配 設定6：1/(1/60*100) (0.6)
// So, using ochiRate is sufficient for the "落ち/気配" element calculation.
