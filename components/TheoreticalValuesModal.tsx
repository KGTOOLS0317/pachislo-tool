// components/TheoreticalValuesModal.tsx
import React from 'react';
import { GameMode, KingHanaHanaSideLampColor } from '../types';
import { MONKEY_TURN_V_IDEAL_RATES, MONKEY_TURN_V_SETTINGS_NAMES, MonkeyTurnVSetting } from '../constants/monkeyTurnVConstants';
import { KING_HANA_HANA_IDEAL_RATES, KING_HANA_HANA_SETTINGS_NAMES, REG_DURING_SIDE_LAMP_PROBS as KHH_REG_DURING_PROBS, BIG_AFTER_FEATHER_LAMP_PROBS as KHH_BIG_AFTER_PROBS, REG_AFTER_FEATHER_LAMP_PROBS as KHH_REG_AFTER_PROBS, KingHanaHanaSetting, KING_HANA_HANA_SIDE_LAMP_COLOR_OPTIONS_FOR_UI_LABELS } from '../constants/kingHanaHanaSConstants';
import { HANA_HANA_HOUOU_IDEAL_RATES, HANA_HANA_HOUOU_SETTINGS_NAMES, REG_DURING_SIDE_LAMP_PROBS as HHH_REG_DURING_PROBS, BIG_AFTER_FEATHER_LAMP_PROBS as HHH_BIG_AFTER_PROBS, REG_AFTER_FEATHER_LAMP_PROBS as HHH_REG_AFTER_PROBS } from '../constants/hanaHanaHououConstants';
import { MY_JUGGLER_V_IDEAL_RATES, MY_JUGGLER_V_SETTINGS_NAMES, MyJugglerVSetting } from '../constants/myJugglerVConstants';
import { IM_JUGGLER_EX_IDEAL_RATES, IM_JUGGLER_EX_SETTINGS_NAMES } from '../constants/imJugglerExConstants';
import { GOGO_JUGGLER_3_IDEAL_RATES, GOGO_JUGGLER_3_SETTINGS_NAMES } from '../constants/gogoJuggler3Constants';
import { FUNKY_JUGGLER_IDEAL_RATES, FUNKY_JUGGLER_SETTINGS_NAMES } from '../constants/funkyJugglerConstants';
import { DRAGON_HANA_HANA_SENKOU_IDEAL_RATES, DRAGON_HANA_HANA_SENKOU_SETTINGS_NAMES, DHH_REG_DURING_SIDE_LAMP_PROBS, DHH_BIG_AFTER_FEATHER_LAMP_PROBS, DHH_REG_AFTER_FEATHER_LAMP_PROBS } from '../constants/dragonHanaHanaSenkouConstants';
import { STAR_HANA_HANA_IDEAL_RATES, STAR_HANA_HANA_SETTINGS_NAMES, SHH_REG_DURING_SIDE_LAMP_PROBS, SHH_BIG_AFTER_FEATHER_LAMP_PROBS, SHH_REG_AFTER_FEATHER_LAMP_PROBS } from '../constants/starHanaHanaConstants';
import { NEW_GETTER_MOUSE_IDEAL_RATES, NEW_GETTER_MOUSE_SETTINGS_NAMES, NewGetterMouseSetting } from '../constants/newGetterMouseConstants';
import { HAPPY_JUGGLER_IDEAL_RATES, HAPPY_JUGGLER_SETTINGS_NAMES } from '../constants/happyJugglerConstants';

interface TheoreticalValuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameMode: GameMode;
}

const formatRate = (rate: number, type: 'fraction' | 'percent' | 'decimal', digits: number = 2): string => {
  if (rate === 0 || isNaN(rate) || !isFinite(rate)) return '-';
  if (type === 'fraction') return `1/${(1 / rate).toFixed(digits)}`;
  else if (type === 'percent') return `${(rate * 100).toFixed(digits)}%`;
  return rate.toFixed(digits);
};

const renderLampTable = (title: string, lampProbs: Record<string, Record<KingHanaHanaSideLampColor, number>>, settingNames: string[]) => (
  <div className="mb-4">
    <h4 className="text-sm font-semibold text-gray-700 mb-1.5">{title}</h4>
    <div className="overflow-x-auto custom-scroll pb-1">
      <table className="min-w-full w-max text-xs border-collapse">
        <thead>
          <tr className="bg-sky-100">
            <th scope="col" className="p-1.5 font-semibold border border-sky-300 text-left">設定</th>
            {KING_HANA_HANA_SIDE_LAMP_COLOR_OPTIONS_FOR_UI_LABELS.map(color => (
              <th scope="col" key={color} className="p-1.5 font-semibold border border-sky-300 text-center">{color}</th>
            ))}
            <th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">なし</th>
          </tr>
        </thead>
        <tbody>
          {settingNames.map(setting => {
            const settingProbs = lampProbs[setting];
            return (
              <tr key={setting} className="even:bg-sky-50/50">
                <td className="p-1.5 border border-sky-300 font-medium">{setting}</td>
                {KING_HANA_HANA_SIDE_LAMP_COLOR_OPTIONS_FOR_UI_LABELS.map(color => (
                  <td key={`${setting}-${color}`} className="p-1.5 border border-sky-300 text-center">{formatRate(settingProbs?.[color] || 0, 'percent', 2)}</td>
                ))}
                 <td className="p-1.5 border border-sky-300 text-center">{formatRate(settingProbs?.[KingHanaHanaSideLampColor.NONE] || 0, 'percent', 2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export const TheoreticalValuesModal: React.FC<TheoreticalValuesModalProps> = ({ isOpen, onClose, gameMode }) => {
  if (!isOpen) return null;
  const renderContent = () => {
    switch (gameMode) {
      case GameMode.MONKEY_TURN_V:
        return (
          <>
            <h3 className="text-md sm:text-lg font-semibold text-gray-800 mb-2">モンキーターンV 設定別理論値</h3>
            <div className="overflow-x-auto custom-scroll pb-1">
              <table className="min-w-full w-max text-xs border-collapse">
                <thead><tr className="bg-sky-100"><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-left">設定</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">5枚役確率</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">落ち選択率</th></tr></thead>
                <tbody>{MONKEY_TURN_V_SETTINGS_NAMES.map(setting => { const rates = MONKEY_TURN_V_IDEAL_RATES[setting as MonkeyTurnVSetting]; return (<tr key={setting} className="even:bg-sky-50/50"><td className="p-1.5 border border-sky-300 font-medium">{setting}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.coin5Rate, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.ochiRate, 'percent')}</td></tr>); })}</tbody>
              </table>
            </div>
          </>
        );
      case GameMode.KING_HANA_HANA_S:
      case GameMode.HANA_HANA_HOUOU:
        const isKHH = gameMode === GameMode.KING_HANA_HANA_S;
        const hTitle = isKHH ? "キングハナハナS" : "ハナハナ鳳凰";
        const hRates = isKHH ? KING_HANA_HANA_IDEAL_RATES : HANA_HANA_HOUOU_IDEAL_RATES;
        const hNames = isKHH ? KING_HANA_HANA_SETTINGS_NAMES : HANA_HANA_HOUOU_SETTINGS_NAMES;
        return (
          <>
            <h3 className="text-md sm:text-lg font-semibold text-gray-800 mb-2">{hTitle} 設定別理論値</h3>
            <div className="overflow-x-auto custom-scroll pb-1 mb-3">
              <table className="min-w-full w-max text-xs border-collapse">
                <thead><tr className="bg-sky-100"><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-left">設定</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">BIG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">REG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">ベル🔔</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">BIG中🍉</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">レトロ🎶</th></tr></thead>
                <tbody>{hNames.map(setting => { const rates = hRates[setting as KingHanaHanaSetting]; return (<tr key={setting} className="even:bg-sky-50/50"><td className="p-1.5 border border-sky-300 font-medium">{setting}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.big, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.reg, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.bell, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.watermelonInBig, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.retroSound, 'fraction')}</td></tr>); })}</tbody>
              </table>
            </div>
            {renderLampTable("REG中サイドランプ", isKHH ? KHH_REG_DURING_PROBS : HHH_REG_DURING_PROBS, hNames)}
          </>
        );
       case GameMode.MY_JUGGLER_V:
        return (
          <>
            <h3 className="text-md sm:text-lg font-semibold text-gray-800 mb-2">マイジャグラーⅤ 設定別理論値</h3>
            <div className="overflow-x-auto custom-scroll pb-1">
              <table className="min-w-full w-max text-xs border-collapse">
                <thead><tr className="bg-sky-100"><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-left">設定</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">単独BIG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">🍒BIG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">レア役BIG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">単独REG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">🍒REG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">ブドウ🍇</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">非重複🍒</th></tr></thead>
                <tbody>{MY_JUGGLER_V_SETTINGS_NAMES.map(setting => { const rates = MY_JUGGLER_V_IDEAL_RATES[setting as MyJugglerVSetting]; return (<tr key={setting} className="even:bg-sky-50/50"><td className="p-1.5 border border-sky-300 font-medium">{setting}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.soloBig, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.cherryBig, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.rareBig, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.soloReg, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.cherryReg, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.grape, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.nonDuplicateCherry, 'fraction')}</td></tr>); })}</tbody>
              </table>
            </div>
          </>
        );
      case GameMode.IM_JUGGLER_EX:
        return (
          <>
            <h3 className="text-md sm:text-lg font-semibold text-gray-800 mb-2">ネオアイムジャグラー 設定別理論値</h3>
            <div className="overflow-x-auto custom-scroll pb-1">
              <table className="min-w-full w-max text-xs border-collapse">
                <thead><tr className="bg-sky-100"><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-left">設定</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">単独BIG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">🍒BIG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">レア役BIG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">単独REG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">🍒REG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">ブドウ🍇</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">非重複🍒</th></tr></thead>
                <tbody>{IM_JUGGLER_EX_SETTINGS_NAMES.map(setting => { const rates = IM_JUGGLER_EX_IDEAL_RATES[setting as MyJugglerVSetting]; return (<tr key={setting} className="even:bg-sky-50/50"><td className="p-1.5 border border-sky-300 font-medium">{setting}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.soloBig, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.cherryBig, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.rareBig, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.soloReg, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.cherryReg, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.grape, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.nonDuplicateCherry, 'fraction')}</td></tr>); })}</tbody>
              </table>
            </div>
          </>
        );
      case GameMode.GOGO_JUGGLER_3:
        return (
          <>
            <h3 className="text-md sm:text-lg font-semibold text-gray-800 mb-2">ゴーゴージャグラー3 設定別理論値</h3>
            <div className="overflow-x-auto custom-scroll pb-1">
              <table className="min-w-full w-max text-xs border-collapse">
                <thead><tr className="bg-sky-100"><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-left">設定</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">単独BIG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">🍒BIG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">レア役BIG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">REG (合算)</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">ブドウ🍇</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">非重複🍒</th></tr></thead>
                <tbody>{GOGO_JUGGLER_3_SETTINGS_NAMES.map(setting => { const rates = GOGO_JUGGLER_3_IDEAL_RATES[setting as MyJugglerVSetting]; return (<tr key={setting} className="even:bg-sky-50/50"><td className="p-1.5 border border-sky-300 font-medium">{setting}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.soloBig, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.cherryBig, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.rareBig, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.reg, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.grape, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.nonDuplicateCherry, 'fraction')}</td></tr>); })}</tbody>
              </table>
            </div>
          </>
        );
      case GameMode.FUNKY_JUGGLER:
        return (
          <>
            <h3 className="text-md sm:text-lg font-semibold text-gray-800 mb-2">ファンキージャグラー 設定別理論値</h3>
            <div className="overflow-x-auto custom-scroll pb-1">
              <table className="min-w-full w-max text-xs border-collapse">
                <thead><tr className="bg-sky-100"><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-left">設定</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">単独BIG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">🍒BIG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">レア役BIG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">単独REG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">🍒REG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">ブドウ🍇</th></tr></thead>
                <tbody>{FUNKY_JUGGLER_SETTINGS_NAMES.map(setting => { const rates = FUNKY_JUGGLER_IDEAL_RATES[setting as MyJugglerVSetting]; return (<tr key={setting} className="even:bg-sky-50/50"><td className="p-1.5 border border-sky-300 font-medium">{setting}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.soloBig, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.cherryBig, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.rareBig, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.soloReg, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.cherryReg, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.grape, 'fraction')}</td></tr>); })}</tbody>
              </table>
            </div>
          </>
        );
      case GameMode.HAPPY_JUGGLER:
        return (
          <>
            <h3 className="text-md sm:text-lg font-semibold text-gray-800 mb-2">ハッピージャグラー 設定別理論値</h3>
            <div className="overflow-x-auto custom-scroll pb-1">
              <table className="min-w-full w-max text-xs border-collapse">
                <thead><tr className="bg-sky-100"><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-left">設定</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">単独BIG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">🍒BIG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">単独REG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">🍒REG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">ブドウ🍇</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">非重複🍒</th></tr></thead>
                <tbody>{HAPPY_JUGGLER_SETTINGS_NAMES.map(setting => { const rates = HAPPY_JUGGLER_IDEAL_RATES[setting as MyJugglerVSetting]; return (<tr key={setting} className="even:bg-sky-50/50"><td className="p-1.5 border border-sky-300 font-medium">{setting}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.soloBig, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.cherryBig, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.soloReg, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.cherryReg, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.grape, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.nonDuplicateCherry, 'fraction')}</td></tr>); })}</tbody>
              </table>
            </div>
          </>
        );
      case GameMode.DRAGON_HANA_HANA_SENKOU:
      case GameMode.STAR_HANA_HANA:
        const isDragon = gameMode === GameMode.DRAGON_HANA_HANA_SENKOU;
        const dTitle = isDragon ? "ドラゴンハナハナ閃光" : "スターハナハナ";
        const dRates = isDragon ? DRAGON_HANA_HANA_SENKOU_IDEAL_RATES : STAR_HANA_HANA_IDEAL_RATES;
        const dNames = isDragon ? DRAGON_HANA_HANA_SENKOU_SETTINGS_NAMES : STAR_HANA_HANA_SETTINGS_NAMES;
        return (
          <>
            <h3 className="text-md sm:text-lg font-semibold text-gray-800 mb-2">{dTitle} 設定別理論値</h3>
            <div className="overflow-x-auto custom-scroll pb-1 mb-3">
              <table className="min-w-full w-max text-xs border-collapse">
                <thead><tr className="bg-sky-100"><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-left">設定</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">BIG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">REG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">ベル🔔</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">BIG中🍉</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">レトロ🎶</th></tr></thead>
                <tbody>{dNames.map(setting => { const rates = dRates[setting as KingHanaHanaSetting]; return (<tr key={setting} className="even:bg-sky-50/50"><td className="p-1.5 border border-sky-300 font-medium">{setting}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.big, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.reg, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.bell, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.watermelonInBig, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.retroSound, 'fraction')}</td></tr>); })}</tbody>
              </table>
            </div>
          </>
        );
      case GameMode.NEW_GETTER_MOUSE:
        return (
          <>
            <h3 className="text-md sm:text-lg font-semibold text-gray-800 mb-2">ニューゲッターマウス 設定別理論値</h3>
            <div className="overflow-x-auto custom-scroll pb-1 mb-3">
              <table className="min-w-full w-max text-xs border-collapse">
                <thead><tr className="bg-sky-100"><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-left">設定</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">BIG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">REG</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">オレンジA</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">オレンジB</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">スイカ</th><th scope="col" className="p-1.5 font-semibold border border-sky-300 text-center">チェリー</th></tr></thead>
                <tbody>{NEW_GETTER_MOUSE_SETTINGS_NAMES.map(setting => { const rates = NEW_GETTER_MOUSE_IDEAL_RATES[setting as NewGetterMouseSetting]; return (<tr key={setting} className="even:bg-sky-50/50"><td className="p-1.5 border border-sky-300 font-medium">{setting}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.big, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.reg, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.orangeA, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.orangeB, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.suika, 'fraction')}</td><td className="p-1.5 border border-sky-300 text-center">{formatRate(rates.cherry, 'fraction')}</td></tr>); })}</tbody>
              </table>
            </div>
          </>
        );
      default: return <p>選択された機種の理論値データはありません。</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-3xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-sky-700">機種別 理論値一覧</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none">&times;</button>
        </div>
        <div className="overflow-y-auto custom-scroll flex-grow pr-1">{renderContent()}</div>
        <div className="mt-4 text-right flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md focus:outline-none">閉じる</button>
        </div>
      </div>
    </div>
  );
};