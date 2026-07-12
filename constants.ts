// constants.ts
import { GameMode } from './types'; // Corrected import path

export { GameMode };

export const GAME_MODE_OPTIONS = [
  { value: GameMode.MY_JUGGLER_V, label: "🤡🐯マイジャグラーⅤ" },
  { value: GameMode.IM_JUGGLER_EX, label: "🤡🦏ネオアイムジャグラー" },
  { value: GameMode.HAPPY_JUGGLER, label: "🤡🐿ハッピージャグラー" },
  { value: GameMode.GOGO_JUGGLER_3, label: "🤡🐘ゴーゴージャグラー3" },
  { value: GameMode.FUNKY_JUGGLER, label: "🤡🐕ファンキージャグラー" },
  { value: GameMode.NEW_GETTER_MOUSE, label: "🐭ニューゲッターマウス" },
  { value: GameMode.MONKEY_TURN_V, label: "🚤モンキーターンV" },
  { value: GameMode.GOODEATER_RESURRECTION, label: "🐸ゴッドイーター" },
  { value: GameMode.STAR_HANA_HANA, label: "⭐スターハナハナ" },
  { value: GameMode.DRAGON_HANA_HANA_SENKOU, label: "🐉ドラゴンハナハナ閃光" },
  { value: GameMode.KING_HANA_HANA_S, label: "👑キングハナハナS" },
  { value: GameMode.HANA_HANA_HOUOU, label: "🦅ハナハナ鳳凰" },
];

// Full titles, potentially for document.title or more descriptive headers on larger views
export const GAME_TITLES: Record<GameMode, string> = {
  [GameMode.MONKEY_TURN_V]: "モンキーターンV 設定/シナリオ推測ツール",
  [GameMode.KING_HANA_HANA_S]: "キングハナハナS 設定判別ツール",
  [GameMode.HANA_HANA_HOUOU]: "ハナハナ鳳凰 設定判別ツール",
  [GameMode.MY_JUGGLER_V]: "マイジャグラーⅤ 設定判別ツール",
  [GameMode.IM_JUGGLER_EX]: "ネオアイムジャグラー 設定判別ツール",
  [GameMode.GOGO_JUGGLER_3]: "ゴーゴージャグラー3 設定判別ツール",
  [GameMode.FUNKY_JUGGLER]: "ファンキージャグラー 設定判別ツール",
  [GameMode.DRAGON_HANA_HANA_SENKOU]: "ドラゴンハナハナ閃光 設定判別ツール",
  [GameMode.STAR_HANA_HANA]: "スターハナハナ 設定判別ツール",
  [GameMode.NEW_GETTER_MOUSE]: "ニューゲッターマウス 設定判別ツール",
  [GameMode.HAPPY_JUGGLER]: "ハッピージャグラー 設定判別ツール",
  [GameMode.GOODEATER_RESURRECTION]: "ゴッドイーター リザレクション 設定判別項目カウンター",
};

// Short titles for display in the header next to the selector
export const GAME_SHORT_TITLES: Record<GameMode, string> = {
  [GameMode.MONKEY_TURN_V]: "設定/シナリオ推測", 
  [GameMode.KING_HANA_HANA_S]: "設定判別",
  [GameMode.HANA_HANA_HOUOU]: "設定判別",
  [GameMode.MY_JUGGLER_V]: "設定判別",
  [GameMode.IM_JUGGLER_EX]: "設定判別",
  [GameMode.GOGO_JUGGLER_3]: "設定判別",
  [GameMode.FUNKY_JUGGLER]: "設定判別",
  [GameMode.DRAGON_HANA_HANA_SENKOU]: "設定判別",
  [GameMode.STAR_HANA_HANA]: "設定判別",
  [GameMode.NEW_GETTER_MOUSE]: "設定判別",
  [GameMode.HAPPY_JUGGLER]: "設定判別",
  [GameMode.GOODEATER_RESURRECTION]: "設定判別項目カウンター",
};

// Titles for the results display card
export const GAME_RESULT_TITLES: Record<GameMode, string> = {
  [GameMode.MONKEY_TURN_V]: "モンキーターンV",
  [GameMode.KING_HANA_HANA_S]: "キングハナハナ",
  [GameMode.HANA_HANA_HOUOU]: "ハナハナ鳳凰",
  [GameMode.MY_JUGGLER_V]: "マイジャグラーⅤ",
  [GameMode.IM_JUGGLER_EX]: "ネオアイムジャグラー",
  [GameMode.GOGO_JUGGLER_3]: "ゴーゴージャグラー3",
  [GameMode.FUNKY_JUGGLER]: "ファンキージャグラー",
  [GameMode.DRAGON_HANA_HANA_SENKOU]: "ドラゴンハナハナ閃光",
  [GameMode.STAR_HANA_HANA]: "スターハナハナ",
  [GameMode.NEW_GETTER_MOUSE]: "ニューゲッターマウス",
  [GameMode.HAPPY_JUGGLER]: "ハッピージャグラー",
  [GameMode.GOODEATER_RESURRECTION]: "ゴッドイーター リザレクション",
};
