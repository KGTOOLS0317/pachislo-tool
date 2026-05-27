// components/results/SettingResultsDisplay.tsx
import React, { useMemo } from 'react';
import type { 
  KingHanaHanaSFullResult, 
  HanaHanaHououFullResult,
  MyJugglerVFullResult,
  DragonHanaHanaSenkouFullResult,
  StarHanaHanaFullResult,
  NewGetterMouseFullResult,
  MonkeyTurnVSettingFullResult,
  HappyJugglerFullResult,
  KingHanaHanaSInput,
  HanaHanaHououInput,
  MyJugglerVInput,
  DragonHanaHanaSenkouInput,
  StarHanaHanaInput,
  NewGetterMouseInput,
  MonkeyTurnVSettingInput,
  HappyJugglerInput
} from '../../types';
import { GameMode } from '../../types';
import { StackedBar, SHARED_SETTING_COLORS } from '../common/StackedBar'; 
import { GAMES_PER_BIG_BONUS as KHH_GAMES_PER_BIG, KING_HANA_HANA_MACHINE_PAYOUT_RATES, KingHanaHanaSetting } from '../../constants/kingHanaHanaSConstants';
import { GAMES_PER_BIG_BONUS_HOUOU, HANA_HANA_HOUOU_MACHINE_PAYOUT_RATES, HanaHanaHououSetting } from '../../constants/hanaHanaHououConstants';
import { MY_JUGGLER_V_MACHINE_PAYOUT_RATES, MyJugglerVSetting } from '../../constants/myJugglerVConstants';
import { FUNKY_JUGGLER_MACHINE_PAYOUT_RATES } from '../../constants/funkyJugglerConstants';
import { DRAGON_HANA_HANA_SENKOU_MACHINE_PAYOUT_RATES, DragonHanaHanaSenkouSetting, GAMES_PER_BIG_BONUS_DRAGON_HANA } from '../../constants/dragonHanaHanaSenkouConstants';
import { STAR_HANA_HANA_MACHINE_PAYOUT_RATES, StarHanaHanaSetting, GAMES_PER_BIG_BONUS_STAR_HANA } from '../../constants/starHanaHanaConstants';
import { NewGetterMouseSetting, NEW_GETTER_MOUSE_MACHINE_PAYOUT_RATES, GAMES_PER_BIG_BONUS_GETTER_MOUSE } from '../../constants/newGetterMouseConstants';
import { HAPPY_JUGGLER_MACHINE_PAYOUT_RATES } from '../../constants/happyJugglerConstants';


interface SettingResultsDisplayProps {
  settingFullResult: KingHanaHanaSFullResult | HanaHanaHououFullResult | MyJugglerVFullResult | MonkeyTurnVSettingFullResult | DragonHanaHanaSenkouFullResult | StarHanaHanaFullResult | NewGetterMouseFullResult | HappyJugglerFullResult;
  allSettingNames: string[];
  gameMode: GameMode;
  currentInputs?: KingHanaHanaSInput | HanaHanaHououInput | MyJugglerVInput | DragonHanaHanaSenkouInput | StarHanaHanaInput | NewGetterMouseInput | MonkeyTurnVSettingInput | HappyJugglerInput;
}

const GENERIC_ELEMENT_DISPLAY_NAMES: Record<string, string> = { 
  "BIG確率": "BIG確率", "REG確率": "REG確率", 
  "単独BIG確率": "単独BIG", "チェリーBIG確率": "🍒BIG", "レア役BIG確率": "レア役BIG",
  "単独REG確率": "単独REG", "チェリーREG確率": "🍒REG",
  "ベル🔔 確率": "ベル🔔 確率", 
  "ブドウ🍇 確率": "ブドウ🍇", 
  "非重複チェリー🍒 確率": "非重複🍒",
  "BIG中スイカ 確率": "BIG中🍉", "BIG中ハズレ 確率": "BIG中ハズレ",
  "レトロ🎶 確率": "レトロ🎶", "REG中サイドランプ": "REGサイドランプ",
  "BIG後フェザーランプ": "BIG後羽ランプ", "REG後フェザーランプ": "REG後羽ランプ",
  "開始時データ": "開始データ",
  "開始時ベル確率": "開始ベル逆算",
};

const MTV_SETTING_ELEMENT_DISPLAY_NAMES: Record<string, string> = { 
    "5枚役 確率": "5枚役 確率",
    "落ち/気配 確率": "落ち/気配 確率",
};

const NGM_ELEMENT_DISPLAY_NAMES: Record<string, string> = {
  "BIG確率": "BIG確率 (契機合算)",
  "REG確率": "REG確率 (契機合算)",
  "契機不明BIG": "不明 BIG",
  "契機不明REG": "不明 REG",
  "オレンジA": "オレンジA",
  "オレンジB": "オレンジB",
  "スイカ": "スイカ",
  "チェリー": "チェリー",
  "斜めオレンジ": "斜めオレンジ",
  "イチロー狙い": "イチロー狙い",
  "葉月ちゃん": "葉月ちゃん",
  "赤7+リプレイ": "赤7+リプレイ",
  "ねずみ+オレンジA": "ねずみ+オレンジA",
  "ねずみ+リーチ目役C": "ねずみ+リーチ目役C",
  "BAR+リーチ目役C": "BAR+リーチ目役C",
  "開始時データ": "開始時データ"
};

export const SettingResultsDisplay: React.FC<SettingResultsDisplayProps> = ({
  settingFullResult,
  allSettingNames,
  gameMode,
  currentInputs
}) => {

  const isKingHanaHanaS = gameMode === GameMode.KING_HANA_HANA_S;
  const isHanaHanaHouou = gameMode === GameMode.HANA_HANA_HOUOU;
  const isMyJugglerV = gameMode === GameMode.MY_JUGGLER_V;
  const isImJuggler = gameMode === GameMode.IM_JUGGLER_EX;
  const isGogoJuggler = gameMode === GameMode.GOGO_JUGGLER_3;
  const isFunkyJuggler = gameMode === GameMode.FUNKY_JUGGLER;
  const isHappyJuggler = gameMode === GameMode.HAPPY_JUGGLER;
  const isDragonHanaHanaSenkou = gameMode === GameMode.DRAGON_HANA_HANA_SENKOU;
  const isStarHanaHana = gameMode === GameMode.STAR_HANA_HANA;
  const isNewGetterMouse = gameMode === GameMode.NEW_GETTER_MOUSE;
  const isMonkeyTurnVSetting = gameMode === GameMode.MONKEY_TURN_V;

  const isJugglerSeries = isMyJugglerV || isImJuggler || isGogoJuggler || isFunkyJuggler || isHappyJuggler;

  const isKingHanaSOrHououOrDragonOrStar = 
    gameMode === GameMode.KING_HANA_HANA_S || 
    gameMode === GameMode.HANA_HANA_HOUOU ||
    gameMode === GameMode.DRAGON_HANA_HANA_SENKOU ||
    gameMode === GameMode.STAR_HANA_HANA;

  const kingHanaHanaInputs = isKingHanaHanaS ? (currentInputs as KingHanaHanaSInput) : undefined;
  const hanaHanaHououInputs = isHanaHanaHouou ? (currentInputs as HanaHanaHououInput) : undefined;
  const jugglerInputs = isJugglerSeries ? (currentInputs as MyJugglerVInput) : undefined;
  const dragonHanaHanaSenkouInputs = isDragonHanaHanaSenkou ? (currentInputs as DragonHanaHanaSenkouInput) : undefined;
  const starHanaHanaInputs = isStarHanaHana ? (currentInputs as StarHanaHanaInput) : undefined;
  const newGetterMouseInputs = isNewGetterMouse ? (currentInputs as NewGetterMouseInput) : undefined;
  const happyJugglerInputs = isHappyJuggler ? (currentInputs as HappyJugglerInput) : undefined;
  const monkeyTurnSettingInputs = isMonkeyTurnVSetting ? (currentInputs as MonkeyTurnVSettingInput) : undefined;

  const isStartDataEffectivelyOnly = useMemo(() => {
    const inputsForCheck = kingHanaHanaInputs || hanaHanaHououInputs || jugglerInputs || dragonHanaHanaSenkouInputs || starHanaHanaInputs || newGetterMouseInputs || happyJugglerInputs;
    if (!inputsForCheck) return false;
    if (isMonkeyTurnVSetting) return false;

    return (
        (inputsForCheck.startTotalGames > 0 || inputsForCheck.startBigCount > 0 || inputsForCheck.startRegCount > 0) &&
        inputsForCheck.currentTotalGames === 0 &&
        inputsForCheck.currentBigCount === 0 &&
        inputsForCheck.currentRegCount === 0 &&
        (inputsForCheck.currentNetMedals === null || inputsForCheck.currentNetMedals === 0) 
    );
  }, [isKingHanaHanaS, isHanaHanaHouou, isJugglerSeries, isDragonHanaHanaSenkou, isStarHanaHana, isNewGetterMouse, isHappyJuggler, isMonkeyTurnVSetting, kingHanaHanaInputs, hanaHanaHououInputs, jugglerInputs, dragonHanaHanaSenkouInputs, starHanaHanaInputs, newGetterMouseInputs, happyJugglerInputs]);

  const totalCurrentDataSummaryText = useMemo(() => {
    if (!(isKingHanaHanaS || isHanaHanaHouou || isJugglerSeries || isDragonHanaHanaSenkou || isStarHanaHana || isNewGetterMouse)) return "";
    const inputsForTotal = kingHanaHanaInputs || hanaHanaHououInputs || jugglerInputs || dragonHanaHanaSenkouInputs || starHanaHanaInputs || newGetterMouseInputs || happyJugglerInputs;
    if (!inputsForTotal || (inputsForTotal.startTotalGames <= 0 && inputsForTotal.currentTotalGames <= 0)) return "";
    
    let bigForTotal = isStartDataEffectivelyOnly ? inputsForTotal.startBigCount : inputsForTotal.currentBigCount;
    let regForTotal = isStartDataEffectivelyOnly ? inputsForTotal.startRegCount : inputsForTotal.currentRegCount;

    // Juggler series: if current counts are 0/empty but triggers are entered, use trigger totals
    if (isJugglerSeries && !isStartDataEffectivelyOnly) {
        if (isHappyJuggler && happyJugglerInputs) {
            const triggerBigTotal = happyJugglerInputs.soloBigCount + happyJugglerInputs.cherryBigCount;
            const triggerRegTotal = happyJugglerInputs.soloRegCount + happyJugglerInputs.cherryRegCount;
            if (bigForTotal <= happyJugglerInputs.startBigCount && triggerBigTotal > 0) {
                bigForTotal = happyJugglerInputs.startBigCount + triggerBigTotal;
            }
            if (regForTotal <= happyJugglerInputs.startRegCount && triggerRegTotal > 0) {
                regForTotal = happyJugglerInputs.startRegCount + triggerRegTotal;
            }
        } else if (jugglerInputs) {
            const triggerBigTotal = jugglerInputs.soloBigCount + jugglerInputs.cherryBigCount + (jugglerInputs.rareBigCount || 0);
            const triggerRegTotal = jugglerInputs.soloRegCount + jugglerInputs.cherryRegCount;
            if (bigForTotal <= jugglerInputs.startBigCount && triggerBigTotal > 0) {
                bigForTotal = jugglerInputs.startBigCount + triggerBigTotal;
            }
            if (regForTotal <= jugglerInputs.startRegCount && triggerRegTotal > 0) {
                regForTotal = jugglerInputs.startRegCount + triggerRegTotal;
            }
        }
    }
    
    let parts = [`G: ${isStartDataEffectivelyOnly ? inputsForTotal.startTotalGames : inputsForTotal.currentTotalGames}`, `BIG: ${bigForTotal}`, `REG: ${regForTotal}`];
    const totalBonuses = bigForTotal + regForTotal;
    const gamesForTotal = isStartDataEffectivelyOnly ? inputsForTotal.startTotalGames : inputsForTotal.currentTotalGames;
    if (totalBonuses > 0 && gamesForTotal > 0) {
        const combinedBonusRate = gamesForTotal / totalBonuses;
        parts.push(`合算: 1/${combinedBonusRate.toFixed(1)}`);
    } else if (gamesForTotal > 0) {
        parts.push(`合算: -`);
    }
    return `合計: (${parts.join(' ')})`;
  }, [kingHanaHanaInputs, hanaHanaHououInputs, jugglerInputs, dragonHanaHanaSenkouInputs, starHanaHanaInputs, newGetterMouseInputs, isKingHanaHanaS, isHanaHanaHouou, isJugglerSeries, isDragonHanaHanaSenkou, isStarHanaHana, isNewGetterMouse, isStartDataEffectivelyOnly]);

  const netMedalsDisplay = useMemo(() => {
    if (!(isKingHanaHanaS || isHanaHanaHouou || isJugglerSeries || isDragonHanaHanaSenkou || isStarHanaHana || isNewGetterMouse)) return { label: "", valueText: "", deviationText: null };

    const relevantInputs = kingHanaHanaInputs || hanaHanaHououInputs || jugglerInputs || dragonHanaHanaSenkouInputs || starHanaHanaInputs || newGetterMouseInputs || happyJugglerInputs;
    if (!relevantInputs) return { label: "", valueText: "", deviationText: null };

    const actualPlayedGames = isStartDataEffectivelyOnly ? 0 : relevantInputs.currentTotalGames - relevantInputs.startTotalGames;
    let actualNetMedals: number | null | undefined = null;
    let netMedalsLabel = ""; 

    if (relevantInputs.currentNetMedals !== null && actualPlayedGames >= 0) {
        actualNetMedals = relevantInputs.currentNetMedals;
        netMedalsLabel = "差枚";
    } else if (
        'estimatedPayout' in settingFullResult && 
        settingFullResult.estimatedPayout !== null &&
        settingFullResult.estimatedPayout !== undefined &&
        actualPlayedGames > 0
    ) {
        actualNetMedals = settingFullResult.estimatedPayout;
        netMedalsLabel = "推測差枚";
    }
    
    const valueText = actualNetMedals !== null && actualNetMedals !== undefined
        ? `${actualNetMedals >= 0 ? '+' : ''}${Math.round(actualNetMedals)}枚`
        : "";

    let deviationText: React.ReactElement | null = null;
    if (actualNetMedals !== null && actualNetMedals !== undefined && actualPlayedGames > 0 && settingFullResult.overallProbabilities) {
        let highestProb = -1;
        let highestSettingName: string | null = null;
        for (const [settingName, prob] of Object.entries(settingFullResult.overallProbabilities)) {
            if ((prob as number) > highestProb) {
                highestProb = prob as number;
                highestSettingName = settingName;
            }
        }

        if (highestSettingName) {
            let machinePayoutPercentage: number | undefined;
            if (isKingHanaHanaS) machinePayoutPercentage = KING_HANA_HANA_MACHINE_PAYOUT_RATES[highestSettingName as KingHanaHanaSetting];
            else if (isHanaHanaHouou) machinePayoutPercentage = HANA_HANA_HOUOU_MACHINE_PAYOUT_RATES[highestSettingName as HanaHanaHououSetting];
            else if (isFunkyJuggler) machinePayoutPercentage = FUNKY_JUGGLER_MACHINE_PAYOUT_RATES[highestSettingName as MyJugglerVSetting];
            else if (isHappyJuggler) machinePayoutPercentage = HAPPY_JUGGLER_MACHINE_PAYOUT_RATES[highestSettingName];
            else if (isMyJugglerV || isImJuggler || isGogoJuggler) machinePayoutPercentage = MY_JUGGLER_V_MACHINE_PAYOUT_RATES[highestSettingName as MyJugglerVSetting];
            else if (isDragonHanaHanaSenkou) machinePayoutPercentage = DRAGON_HANA_HANA_SENKOU_MACHINE_PAYOUT_RATES[highestSettingName as DragonHanaHanaSenkouSetting];
            else if (isStarHanaHana) machinePayoutPercentage = STAR_HANA_HANA_MACHINE_PAYOUT_RATES[highestSettingName as StarHanaHanaSetting];
            else if (isNewGetterMouse) machinePayoutPercentage = NEW_GETTER_MOUSE_MACHINE_PAYOUT_RATES[highestSettingName as NewGetterMouseSetting];


            if (machinePayoutPercentage !== undefined) {
                const totalMedalsIn = actualPlayedGames * 3;
                const expectedMedalsOut = totalMedalsIn * (machinePayoutPercentage / 100);
                const expectedNetMedals = expectedMedalsOut - totalMedalsIn;
                const deviation = actualNetMedals - expectedNetMedals;

                if (Math.abs(deviation) > 0.01) { 
                    const deviationAmount = Math.round(Math.abs(deviation));
                    if (deviation < 0) {
                        deviationText = <span className="text-red-600"> (-{deviationAmount}枚⤵︎)</span>;
                    } else {
                        deviationText = <span className="text-blue-600"> (+{deviationAmount}枚⤴︎)</span>;
                    }
                }
            }
        }
    }
    return { label: netMedalsLabel, valueText, deviationText };

  }, [settingFullResult, kingHanaHanaInputs, hanaHanaHououInputs, jugglerInputs, dragonHanaHanaSenkouInputs, starHanaHanaInputs, newGetterMouseInputs, isKingHanaHanaS, isHanaHanaHouou, isJugglerSeries, isFunkyJuggler, isDragonHanaHanaSenkou, isStarHanaHana, isNewGetterMouse, isStartDataEffectivelyOnly]);


  const individualPlayedDataSummaryText = useMemo(() => {
    const summaryPrefix = "個人";
    let parts: string[] = [];
    
    if (isKingHanaSOrHououOrDragonOrStar) {
        const currentGenericInputs = kingHanaHanaInputs || hanaHanaHououInputs || dragonHanaHanaSenkouInputs || starHanaHanaInputs;
        if (!currentGenericInputs) return "";

        const actualPlayedGames = isStartDataEffectivelyOnly ? 0 : currentGenericInputs.currentTotalGames - currentGenericInputs.startTotalGames;
        const actualPlayedBig = isStartDataEffectivelyOnly ? 0 : currentGenericInputs.currentBigCount - currentGenericInputs.startBigCount;
        const actualPlayedReg = isStartDataEffectivelyOnly ? 0 : currentGenericInputs.currentRegCount - currentGenericInputs.startRegCount;
        
        if (actualPlayedGames <= 0 && currentGenericInputs.startTotalGames <= 0 && !isStartDataEffectivelyOnly && actualPlayedBig === 0 && actualPlayedReg === 0 && currentGenericInputs.currentNetMedals === null ) {
             return "";
        }

        parts.push(`G: ${actualPlayedGames}`, `B: ${actualPlayedBig}`, `R: ${actualPlayedReg}`);
        
        const totalPlayedBonuses = actualPlayedBig + actualPlayedReg;
        if (actualPlayedGames > 0 && totalPlayedBonuses > 0) {
            const combinedBonusRate = actualPlayedGames / totalPlayedBonuses;
            parts.push(`合算: 1/${combinedBonusRate.toFixed(1)}`);
        } else if (actualPlayedGames > 0) { 
            parts.push(`合算: -`);
        }
        
        if (netMedalsDisplay.label && netMedalsDisplay.valueText) { 
             parts.push(`${netMedalsDisplay.label}: ${netMedalsDisplay.valueText}`);
        }

    } else if (isHappyJuggler && happyJugglerInputs) {
        const actualPlayedGames = isStartDataEffectivelyOnly ? 0 : happyJugglerInputs.currentTotalGames - happyJugglerInputs.startTotalGames;
        let actualPlayedBig = isStartDataEffectivelyOnly ? 0 : happyJugglerInputs.currentBigCount - happyJugglerInputs.startBigCount;
        let actualPlayedReg = isStartDataEffectivelyOnly ? 0 : happyJugglerInputs.currentRegCount - happyJugglerInputs.startRegCount;

        if (!isStartDataEffectivelyOnly) {
            const triggerBigTotal = happyJugglerInputs.soloBigCount + happyJugglerInputs.cherryBigCount;
            const triggerRegTotal = happyJugglerInputs.soloRegCount + happyJugglerInputs.cherryRegCount;
            if (actualPlayedBig <= 0 && triggerBigTotal > 0) actualPlayedBig = triggerBigTotal;
            if (actualPlayedReg <= 0 && triggerRegTotal > 0) actualPlayedReg = triggerRegTotal;
        }

        if (actualPlayedGames <= 0 && happyJugglerInputs.startTotalGames <= 0 && !isStartDataEffectivelyOnly && actualPlayedBig === 0 && actualPlayedReg === 0 && happyJugglerInputs.currentNetMedals === null ) {
             return "";
        }
        
        parts.push(`G: ${actualPlayedGames}`, `B: ${actualPlayedBig}`, `R: ${actualPlayedReg}`);
        
        const totalPlayedBonuses = actualPlayedBig + actualPlayedReg;
        if (actualPlayedGames > 0 && totalPlayedBonuses > 0) {
            const combinedBonusRate = actualPlayedGames / totalPlayedBonuses;
            parts.push(`合算: 1/${combinedBonusRate.toFixed(1)}`);
        } else if (actualPlayedGames > 0) { 
            parts.push(`合算: -`);
        }

        if (happyJugglerInputs.bellCount > 0 && actualPlayedGames > 0) { 
            parts.push(`🍇: ${happyJugglerInputs.bellCount}`);
        }
        if (happyJugglerInputs.nonDuplicateCherryCount > 0 && actualPlayedGames > 0) {
            parts.push(`🍒: ${happyJugglerInputs.nonDuplicateCherryCount}`);
        }
        if (happyJugglerInputs.clownCount > 0 && actualPlayedGames > 0) {
            parts.push(`🤡: ${happyJugglerInputs.clownCount}`);
        }
        if (happyJugglerInputs.happyBellCount > 0 && actualPlayedGames > 0) {
            parts.push(`🔔: ${happyJugglerInputs.happyBellCount}`);
        }
        
        if (netMedalsDisplay.label && netMedalsDisplay.valueText) { 
             parts.push(`${netMedalsDisplay.label}: ${netMedalsDisplay.valueText}`);
        }

    } else if (isJugglerSeries && jugglerInputs) {
        const actualPlayedGames = isStartDataEffectivelyOnly ? 0 : jugglerInputs.currentTotalGames - jugglerInputs.startTotalGames;
        let actualPlayedBig = isStartDataEffectivelyOnly ? 0 : jugglerInputs.currentBigCount - jugglerInputs.startBigCount;
        let actualPlayedReg = isStartDataEffectivelyOnly ? 0 : jugglerInputs.currentRegCount - jugglerInputs.startRegCount;

        // If played counts from current data are 0 or less, but triggers are entered, use trigger totals
        if (!isStartDataEffectivelyOnly) {
            const triggerBigTotal = jugglerInputs.soloBigCount + jugglerInputs.cherryBigCount + (jugglerInputs.rareBigCount || 0);
            const triggerRegTotal = jugglerInputs.soloRegCount + jugglerInputs.cherryRegCount;
            if (actualPlayedBig <= 0 && triggerBigTotal > 0) actualPlayedBig = triggerBigTotal;
            if (actualPlayedReg <= 0 && triggerRegTotal > 0) actualPlayedReg = triggerRegTotal;
        }

        if (actualPlayedGames <= 0 && jugglerInputs.startTotalGames <= 0 && !isStartDataEffectivelyOnly && actualPlayedBig === 0 && actualPlayedReg === 0 && jugglerInputs.currentNetMedals === null ) {
             return "";
        }
        
        parts.push(`G: ${actualPlayedGames}`, `B: ${actualPlayedBig}`, `R: ${actualPlayedReg}`);
        
        const totalPlayedBonuses = actualPlayedBig + actualPlayedReg;
        if (actualPlayedGames > 0 && totalPlayedBonuses > 0) {
            const combinedBonusRate = actualPlayedGames / totalPlayedBonuses;
            parts.push(`合算: 1/${combinedBonusRate.toFixed(1)}`);
        } else if (actualPlayedGames > 0) { 
            parts.push(`合算: -`);
        }

        if (jugglerInputs.bellCount > 0 && actualPlayedGames > 0) { 
            parts.push(`🍇: ${jugglerInputs.bellCount}`);
        }
        if (jugglerInputs.nonDuplicateCherryCount > 0 && actualPlayedGames > 0 && !isImJuggler && !isFunkyJuggler) {
            parts.push(`非重複🍒: ${jugglerInputs.nonDuplicateCherryCount}`);
        }
        
        if (netMedalsDisplay.label && netMedalsDisplay.valueText) { 
             parts.push(`${netMedalsDisplay.label}: ${netMedalsDisplay.valueText}`);
        }

    } else if (isNewGetterMouse && newGetterMouseInputs) {
        const actualPlayedGames = isStartDataEffectivelyOnly ? 0 : newGetterMouseInputs.currentTotalGames - newGetterMouseInputs.startTotalGames;
        const actualPlayedBig = isStartDataEffectivelyOnly ? 0 : newGetterMouseInputs.currentBigCount - newGetterMouseInputs.startBigCount;
        const actualPlayedReg = isStartDataEffectivelyOnly ? 0 : newGetterMouseInputs.currentRegCount - newGetterMouseInputs.startRegCount;
        if (actualPlayedGames <= 0 && newGetterMouseInputs.startTotalGames <= 0 && !isStartDataEffectivelyOnly && actualPlayedBig === 0 && actualPlayedReg === 0 && newGetterMouseInputs.currentNetMedals === null ) {
             return "";
        }
        parts.push(`G: ${actualPlayedGames}`, `B: ${actualPlayedBig}`, `R: ${actualPlayedReg}`);
        const totalPlayedBonuses = actualPlayedBig + actualPlayedReg;
        if (actualPlayedGames > 0 && totalPlayedBonuses > 0) {
            const combinedBonusRate = actualPlayedGames / totalPlayedBonuses;
            parts.push(`合算: 1/${combinedBonusRate.toFixed(1)}`);
        } else if (actualPlayedGames > 0) {
            parts.push(`合算: -`);
        }
        if (netMedalsDisplay.label && netMedalsDisplay.valueText) {
             parts.push(`${netMedalsDisplay.label}: ${netMedalsDisplay.valueText}`);
        }
    } else if (isMonkeyTurnVSetting && monkeyTurnSettingInputs) {
        const { gamesPlayed, coin5Count, ochiCount, kehaiCount } = monkeyTurnSettingInputs;
        if (gamesPlayed > 0 || coin5Count > 0 || ochiCount > 0 || kehaiCount > 0) {
            parts.push(`G: ${gamesPlayed}`);
            parts.push(`5枚: ${coin5Count}`);
            parts.push(`落: ${ochiCount}`);
            parts.push(`気: ${kehaiCount}`);
        } else {
             return ""; 
        }
    } else {
        return ""; 
    }

    if (parts.length === 0) return ""; 
    const summaryString = `${summaryPrefix} ${parts.join(' ')}`;
    
    return <>{summaryString}{netMedalsDisplay.deviationText}</>;
  }, [jugglerInputs, happyJugglerInputs, kingHanaHanaInputs, hanaHanaHououInputs, dragonHanaHanaSenkouInputs, starHanaHanaInputs, newGetterMouseInputs, monkeyTurnSettingInputs, isKingHanaHanaS, isHanaHanaHouou, isJugglerSeries, isHappyJuggler, isImJuggler, isFunkyJuggler, isDragonHanaHanaSenkou, isStarHanaHana, isNewGetterMouse, isMonkeyTurnVSetting, isStartDataEffectivelyOnly, netMedalsDisplay]);


  const getBreakdownInputSuffix = (elementName: string): string => {
    const currentGenericInputs = kingHanaHanaInputs || hanaHanaHououInputs || jugglerInputs || dragonHanaHanaSenkouInputs || starHanaHanaInputs || newGetterMouseInputs || happyJugglerInputs;
    if (!currentGenericInputs) return "";

    if (isKingHanaSOrHououOrDragonOrStar || isJugglerSeries) { 

        const playedGames = isStartDataEffectivelyOnly ? 0 : currentGenericInputs.currentTotalGames - currentGenericInputs.startTotalGames;
        let playedBigCount = isStartDataEffectivelyOnly ? 0 : currentGenericInputs.currentBigCount - currentGenericInputs.startBigCount;
        let playedRegCount = isStartDataEffectivelyOnly ? 0 : currentGenericInputs.currentRegCount - currentGenericInputs.startRegCount;
        
        // Correct played counts for summary based on triggers for Juggler
        if (isJugglerSeries && jugglerInputs && !isStartDataEffectivelyOnly) {
            const triggerBigTotal = jugglerInputs.soloBigCount + jugglerInputs.cherryBigCount + (jugglerInputs.rareBigCount || 0);
            const triggerRegTotal = jugglerInputs.soloRegCount + jugglerInputs.cherryRegCount;
            if (playedBigCount <= 0 && triggerBigTotal > 0) playedBigCount = triggerBigTotal;
            if (playedRegCount <= 0 && triggerRegTotal > 0) playedRegCount = triggerRegTotal;
        } else if (isHappyJuggler && happyJugglerInputs && !isStartDataEffectivelyOnly) {
            const triggerBigTotal = happyJugglerInputs.soloBigCount + happyJugglerInputs.cherryBigCount;
            const triggerRegTotal = happyJugglerInputs.soloRegCount + happyJugglerInputs.cherryRegCount;
            if (playedBigCount <= 0 && triggerBigTotal > 0) playedBigCount = triggerBigTotal;
            if (playedRegCount <= 0 && triggerRegTotal > 0) playedRegCount = triggerRegTotal;
        }

        let gamesPerBig = KHH_GAMES_PER_BIG; 
        if (isHanaHanaHouou) gamesPerBig = GAMES_PER_BIG_BONUS_HOUOU;
        else if (isDragonHanaHanaSenkou) gamesPerBig = GAMES_PER_BIG_BONUS_DRAGON_HANA;
        else if (isStarHanaHana) gamesPerBig = GAMES_PER_BIG_BONUS_STAR_HANA;
        
        const totalBigGamesForSubCounters = playedBigCount * gamesPerBig;

        switch (elementName) {
            case "BIG確率": return `(${playedBigCount} / ${playedGames}G)`;
            case "REG確率": return `(${playedRegCount} / ${playedGames}G)`;
            case "単独BIG確率": 
                if (jugglerInputs) return `(${jugglerInputs.soloBigCount} / ${playedGames}G)`;
                if (happyJugglerInputs) return `(${happyJugglerInputs.soloBigCount} / ${playedGames}G)`;
                return "";
            case "チェリーBIG確率": 
                if (jugglerInputs) return `(${jugglerInputs.cherryBigCount} / ${playedGames}G)`;
                if (happyJugglerInputs) return `(${happyJugglerInputs.cherryBigCount} / ${playedGames}G)`;
                return "";
            case "レア役BIG確率": return jugglerInputs ? `(${jugglerInputs.rareBigCount} / ${playedGames}G)` : "";
            case "単独REG確率": 
                if (jugglerInputs) return `(${jugglerInputs.soloRegCount} / ${playedGames}G)`;
                if (happyJugglerInputs) return `(${happyJugglerInputs.soloRegCount} / ${playedGames}G)`;
                return "";
            case "チェリーREG確率": 
                if (jugglerInputs) return `(${jugglerInputs.cherryRegCount} / ${playedGames}G)`;
                if (happyJugglerInputs) return `(${happyJugglerInputs.cherryRegCount} / ${playedGames}G)`;
                return "";
            case "ベル🔔 確率": 
                if (isKingHanaSOrHououOrDragonOrStar && 'bellCount' in currentGenericInputs) return `(🔔: ${currentGenericInputs.bellCount} / G: ${playedGames})`;
                if (happyJugglerInputs) return `(🔔: ${happyJugglerInputs.happyBellCount} / G: ${playedGames})`;
                return "";
            case "ピエロ🤡 確率":
                if (happyJugglerInputs) return `(🤡: ${happyJugglerInputs.clownCount} / G: ${playedGames})`;
                return "";
            case "ブドウ🍇 確率": 
                if (jugglerInputs) return `(${jugglerInputs.bellCount} / ${playedGames}G)`;
                if (happyJugglerInputs) return `(${happyJugglerInputs.bellCount} / ${playedGames}G)`;
                return "";
            case "非重複チェリー🍒 確率":
                if (jugglerInputs) return `(${jugglerInputs.nonDuplicateCherryCount} / ${playedGames}G)`;
                if (happyJugglerInputs) return `(${happyJugglerInputs.nonDuplicateCherryCount} / ${playedGames}G)`;
                return "";
            case "BIG中スイカ 確率": 
                 if (isKingHanaSOrHououOrDragonOrStar) {
                     const specificHanaInputs = kingHanaHanaInputs || hanaHanaHououInputs || dragonHanaHanaSenkouInputs || starHanaHanaInputs;
                     return `(🍉: ${specificHanaInputs!.watermelonInBigCount} / BIG中G: ${totalBigGamesForSubCounters})`;
                 }
                 return "";
            case "BIG中ハズレ 確率": 
                 if (isKingHanaSOrHououOrDragonOrStar) {
                    const specificHanaInputs = kingHanaHanaInputs || hanaHanaHououInputs || dragonHanaHanaSenkouInputs || starHanaHanaInputs;
                    return `(無: ${specificHanaInputs!.bigBlankCount} / BIG中G: ${totalBigGamesForSubCounters})`;
                 }
                 return "";
            case "レトロ🎶 確率": 
                 if (isKingHanaSOrHououOrDragonOrStar) {
                    const specificHanaInputs = kingHanaHanaInputs || hanaHanaHououInputs || dragonHanaHanaSenkouInputs || starHanaHanaInputs;
                    return `(🎶: ${specificHanaInputs!.retroSoundNumerator} / レトロ機会: ${specificHanaInputs!.retroSoundDenominator})`;
                 }
                 return "";
            case "REG中サイドランプ": {
                if (isKingHanaSOrHououOrDragonOrStar) {
                    const specificHanaInputs = kingHanaHanaInputs || hanaHanaHououInputs || dragonHanaHanaSenkouInputs || starHanaHanaInputs;
                    const lamps = [specificHanaInputs!.regDuringSideLampBlueCount, specificHanaInputs!.regDuringSideLampYellowCount, specificHanaInputs!.regDuringSideLampGreenCount, specificHanaInputs!.regDuringSideLampRedCount, specificHanaInputs!.regDuringSideLampRainbowCount];
                    const lampStrings = ["🔵", "🟡", "🟢", "🔴", "🌈"];
                    const str = lamps.map((count, i) => `${lampStrings[i]}:${count || 0}`).join(' ');
                    const sumOfObservedLamps = lamps.reduce((s, c) => s + (c || 0), 0);
                    let denominatorText = "";
                    if (sumOfObservedLamps > 0) denominatorText = `点灯総数: ${sumOfObservedLamps}${playedRegCount > 0 && playedRegCount !== sumOfObservedLamps ? ` (全REG: ${playedRegCount})` : ''}`;
                    else if (playedRegCount > 0) denominatorText = `REG機会: ${playedRegCount}`;
                    else denominatorText = "機会: 0";
                    return `(${str} / ${denominatorText})`;
                }
                return "";
            }
            case "BIG後フェザーランプ": {
                if (isKingHanaSOrHououOrDragonOrStar) {
                    const specificHanaInputs = kingHanaHanaInputs || hanaHanaHououInputs || dragonHanaHanaSenkouInputs || starHanaHanaInputs;
                    const lamps = [specificHanaInputs!.bigAfterSideLampBlueCount, specificHanaInputs!.bigAfterSideLampYellowCount, specificHanaInputs!.bigAfterSideLampGreenCount, specificHanaInputs!.bigAfterSideLampRedCount, specificHanaInputs!.bigAfterSideLampRainbowCount];
                    const lampStrings = ["🔵", "🟡", "🟢", "🔴", "🌈"];
                    const str = lamps.map((count, i) => `${lampStrings[i]}:${count}`).join(' ');
                    let opportunities = playedBigCount;
                    if (specificHanaInputs!.startBigCount === 0 && playedBigCount > 0 && !isStartDataEffectivelyOnly) opportunities = Math.max(0, playedBigCount - 1);
                    else if (isStartDataEffectivelyOnly) opportunities = 0; 
                    return `(${str} / BIG機会: ${opportunities})`;
                }
                return "";
            }
            case "REG後フェザーランプ": {
                 if (isKingHanaSOrHououOrDragonOrStar) {
                    const specificHanaInputs = kingHanaHanaInputs || hanaHanaHououInputs || dragonHanaHanaSenkouInputs || starHanaHanaInputs;
                    const lamps = [specificHanaInputs!.regAfterSideLampBlueCount, specificHanaInputs!.regAfterSideLampYellowCount, specificHanaInputs!.regAfterSideLampGreenCount, specificHanaInputs!.regAfterSideLampRedCount, specificHanaInputs!.regAfterSideLampRainbowCount];
                    const lampStrings = ["🔵", "🟡", "🟢", "🔴", "🌈"];
                    const str = lamps.map((count, i) => `${lampStrings[i]}:${count}`).join(' ');
                    return `(${str} / REG機会: ${playedRegCount})`;
                }
                return "";
            }
            case "開始時データ":
                if (currentGenericInputs.startTotalGames > 0) return `(G: ${currentGenericInputs.startTotalGames} BIG: ${currentGenericInputs.startBigCount} REG: ${currentGenericInputs.startRegCount})`;
                return "";
            case "開始時ベル確率":
                if('startNetMedals' in currentGenericInputs && currentGenericInputs.startNetMedals !== null && currentGenericInputs.startNetMedals !== undefined) {
                    return `(G: ${currentGenericInputs.startTotalGames} 差枚: ${currentGenericInputs.startNetMedals >= 0 ? '+' : ''}${currentGenericInputs.startNetMedals})`;
                }
                return "";
            default: return "";
        }
    } else if (isNewGetterMouse && newGetterMouseInputs) {
        const playedGames = isStartDataEffectivelyOnly ? 0 : newGetterMouseInputs.currentTotalGames - newGetterMouseInputs.startTotalGames;
        const playedBigCount = isStartDataEffectivelyOnly ? 0 : newGetterMouseInputs.currentBigCount - newGetterMouseInputs.startBigCount;
        const playedRegCount = isStartDataEffectivelyOnly ? 0 : newGetterMouseInputs.currentRegCount - newGetterMouseInputs.startRegCount;
        switch (elementName) {
            case "BIG確率": return `(${playedBigCount} / ${playedGames}G)`;
            case "REG確率": return `(${playedRegCount} / ${playedGames}G)`;
            case "契機不明BIG": 
                const unknownBig = playedBigCount - (newGetterMouseInputs.triggerRed7ReplayCount || 0) - (newGetterMouseInputs.triggerNezumiOrangeACount || 0) - (newGetterMouseInputs.triggerNezumiRichimeCCount || 0);
                return `(不明: ${unknownBig} / ${playedGames}G)`;
            case "契機不明REG":
                const unknownReg = playedRegCount - (newGetterMouseInputs.triggerBarRichimeCCount || 0);
                return `(不明: ${unknownReg} / ${playedGames}G)`;
            case "オレンジA": return `(${newGetterMouseInputs.orangeACount} / ${playedGames}G)`;
            case "オレンジB": return `(${newGetterMouseInputs.orangeBCount} / ${playedGames}G)`;
            case "スイカ": return `(${newGetterMouseInputs.suikaCount} / ${playedGames}G)`;
            case "チェリー": return `(${newGetterMouseInputs.cherryCount} / ${playedGames}G)`;
            case "斜めオレンジ": return `(${newGetterMouseInputs.bonusDiagonalOrangeCount} / ${playedBigCount * GAMES_PER_BIG_BONUS_GETTER_MOUSE}G)`;
            case "イチロー狙い": return `(${newGetterMouseInputs.bonusIchiroCount} / ${newGetterMouseInputs.bonusIchiroOpportunityCount})`;
            case "葉月ちゃん": return `(${newGetterMouseInputs.bonusHazukiCount} / ${playedBigCount})`;
            case "赤7+リプレイ": return `(${newGetterMouseInputs.triggerRed7ReplayCount} / ${playedGames}G)`;
            case "ねずみ+オレンジA": return `(${newGetterMouseInputs.triggerNezumiOrangeACount} / ${playedGames}G)`;
            case "ねずみ+リーチ目役C": return `(${newGetterMouseInputs.triggerNezumiRichimeCCount} / ${playedGames}G)`;
            case "BAR+リーチ目役C": return `(${newGetterMouseInputs.triggerBarRichimeCCount} / ${playedGames}G)`;
            case "開始時データ":
                if (newGetterMouseInputs.startTotalGames > 0) return `(G: ${newGetterMouseInputs.startTotalGames} BIG: ${newGetterMouseInputs.startBigCount} REG: ${newGetterMouseInputs.startRegCount})`;
                return "";
            default: return "";
        }
    } else if (isMonkeyTurnVSetting && monkeyTurnSettingInputs) { 
        const { gamesPlayed, coin5Count, ochiCount, kehaiCount } = monkeyTurnSettingInputs;
        switch (elementName) {
            case "5枚役 確率": return `(${coin5Count} / ${gamesPlayed}G)`;
            case "落ち/気配 確率": return ""; 
            default: return "";
        }
    }
    return "";
  };

  const renderBreakdownElement = (elementName: string, keySuffix: string = "") => {
    const elementProbs = settingFullResult.breakdownProbabilities[elementName];
    if (!elementProbs) return null;

    let displayElementName = elementName;
    if (isKingHanaSOrHououOrDragonOrStar || isJugglerSeries) displayElementName = GENERIC_ELEMENT_DISPLAY_NAMES[elementName] || elementName;
    if (isNewGetterMouse) displayElementName = NGM_ELEMENT_DISPLAY_NAMES[elementName] || elementName;
    if (isMonkeyTurnVSetting) displayElementName = MTV_SETTING_ELEMENT_DISPLAY_NAMES[elementName] || elementName;

    const inputSuffix = getBreakdownInputSuffix(elementName);
    const observedRateString = settingFullResult.observedRates?.[elementName];
    
    return (
      <div key={`${elementName}-${keySuffix}`} className="pt-0.5">
        <h4 className="text-xs sm:text-sm font-medium mb-0.5 text-slate-600">
          {displayElementName}
          {inputSuffix && inputSuffix.replace(/\(\s*\)/g, '').trim() !== '' && (
              <span className="text-xs font-normal text-gray-500 ml-1.5">
                  {inputSuffix}
              </span>
          )}
          {observedRateString && observedRateString.trim() !== '-' && observedRateString.trim() !== '' && ( 
              <span className="text-xs font-normal text-gray-500 ml-1">
                  (確率: {observedRateString})
              </span>
          )}
        </h4>
        <StackedBar 
          probabilities={elementProbs} 
          names={allSettingNames}
          heightClass="h-6 sm:h-7"
          isOverallResult={false}
        />
      </div>
    );
  };
  
  const startDataElementName = "開始時データ";
  const startDataElementActive = settingFullResult?.activeElementKeys?.includes(startDataElementName);
  
  let sortedActiveElementKeys = settingFullResult?.activeElementKeys || [];

  if (isJugglerSeries && settingFullResult?.activeElementKeys) {
      const order = [
          "ブドウ🍇 確率", "非重複チェリー🍒 確率",
          "BIG確率", "REG確率", 
          "単独BIG確率", "チェリーBIG確率", "レア役BIG確率",
          "単独REG確率", "チェリーREG確率",
          "開始時データ",
          "開始時ベル確率",
      ];
      sortedActiveElementKeys = settingFullResult.activeElementKeys
          .filter(key => key !== startDataElementName) 
          .sort((a, b) => order.indexOf(a) - order.indexOf(b));
  } else if (isKingHanaHanaS || isHanaHanaHouou || isDragonHanaHanaSenkou || isStarHanaHana) {
      const order = ["BIG確率", "REG確率", "ベル🔔 確率", "BIG中スイカ 確率", "BIG中ハズレ 確率", "レトロ🎶 確率", "REG中サイドランプ", "BIG後フェザーランプ", "REG後フェザーランプ", "開始時データ", "開始時ベル確率"];
      
      sortedActiveElementKeys = (settingFullResult?.activeElementKeys || [])
          .filter(key => key !== startDataElementName)
          .sort((a,b) => order.indexOf(a) - order.indexOf(b));
  } else if (isNewGetterMouse) {
      const order = [
        "BIG確率", "REG確率", "契機不明BIG", "契機不明REG", "オレンジA", "オレンジB", "スイカ", "チェリー",
        "斜めオレンジ", "イチロー狙い", "葉月ちゃん",
        "赤7+リプレイ", "ねずみ+オレンジA", "ねずみ+リーチ目役C", "BAR+リーチ目役C",
        "開始時データ"
      ];
      sortedActiveElementKeys = (settingFullResult?.activeElementKeys || [])
          .filter(key => key !== startDataElementName)
          .sort((a,b) => order.indexOf(a) - order.indexOf(b));
  } else if (isMonkeyTurnVSetting && MTV_SETTING_ELEMENT_DISPLAY_NAMES) {
     const order = Object.keys(MTV_SETTING_ELEMENT_DISPLAY_NAMES);
      sortedActiveElementKeys = (settingFullResult?.activeElementKeys || [])
          .filter(key => key !== startDataElementName) 
          .sort((a,b) => order.indexOf(a) - order.indexOf(b));
  } else {
      sortedActiveElementKeys = settingFullResult?.activeElementKeys?.filter(key => key !== startDataElementName) || [];
  }


  return (
    <div className="space-y-1">
      <div>
        <h3 className="text-base sm:text-lg font-bold mb-0.5 text-indigo-700">
          総合推測結果
        </h3>
        {totalCurrentDataSummaryText && (
          <p className="text-xs font-normal text-gray-600 mb-0.5">
            {totalCurrentDataSummaryText}
          </p>
        )}
        {typeof individualPlayedDataSummaryText === 'string' && individualPlayedDataSummaryText && (
          <p className="text-xs font-normal text-gray-600 mb-0.5">
            {individualPlayedDataSummaryText}
          </p>
        )}
        {typeof individualPlayedDataSummaryText !== 'string' && individualPlayedDataSummaryText && (
            <p className="text-xs font-normal text-gray-600 mb-0.5">
                {individualPlayedDataSummaryText}
            </p>
        )}
         <StackedBar 
          probabilities={settingFullResult.overallProbabilities} 
          names={allSettingNames} 
          heightClass="h-10 sm:h-12"
          isOverallResult={true}
        />
      </div>
      
      {startDataElementActive && renderBreakdownElement(startDataElementName, "start-data")}
      {sortedActiveElementKeys.map((elementName) => renderBreakdownElement(elementName))}

      <div className="mt-4 pt-3 border-t border-sky-300/70">
        <h4 className="text-xs sm:text-sm font-semibold text-slate-600 mb-1.5">凡例</h4>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs">
          {allSettingNames.map(name => (
            <div key={name} className="flex items-center">
              <span className={`w-3 h-3 rounded-sm mr-1.5 ${SHARED_SETTING_COLORS[name] || SHARED_SETTING_COLORS["default"]}`}></span>
              <span className="text-gray-700">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
SettingResultsDisplay.displayName = 'SettingResultsDisplay';