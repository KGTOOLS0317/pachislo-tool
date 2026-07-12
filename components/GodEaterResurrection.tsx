
// components/GodEaterResurrection.tsx
import React, { useState, useCallback } from 'react';

const STORY_END_VOICES = [
  { id: 'kouta',  character: 'コウタ',   voice: '一緒にバガラリー見ようぜ',                          hint: 'デフォルト',      hintLevel: 0 },
  { id: 'arisa',  character: 'アリサ',   voice: '側面、後方共にクリアです',                          hint: 'デフォルト',      hintLevel: 0 },
  { id: 'hibari', character: 'ヒバリ',   voice: '私にもお役に立てることがあるはずです',               hint: '偶数設定示唆(弱)', hintLevel: 1 },
  { id: 'soma',   character: 'ソーマ',   voice: '思い出ってのは、悪いことばかりでもないんだな',       hint: '高設定示唆(弱)',   hintLevel: 1 },
  { id: 'yuu',    character: 'ユウ',     voice: '信じられる仲間がいるから、俺たちは戦えるんだ',       hint: '設定2・3否定',     hintLevel: 2 },
  { id: 'sakuya', character: 'サクヤ',   voice: '私は、私のやるべきことをしなくちゃね',               hint: '偶数設定示唆(強)', hintLevel: 3 },
  { id: 'ren',    character: 'レン',     voice: 'あなたはそのアラガミを殺せますか？',                 hint: '高設定示唆(強)',   hintLevel: 3 },
  { id: 'erina',  character: 'エリナ',   voice: '私、大きくなったらアラガミのいない世界を作る',       hint: '偶数設定濃厚',    hintLevel: 4 },
  { id: 'rindou', character: 'リンドウ', voice: 'いつでも、お前の背中は預かってやるからな',           hint: '設定2以上濃厚',   hintLevel: 4 },
  { id: 'shio',   character: 'シオ',     voice: 'いただきま～す',                                    hint: '設定5以上濃厚',   hintLevel: 5 },
] as const;

const AT_END_SCREENS = [
  { id: 'none',   name: 'キャラなし',   hint: 'デフォルト',      hintLevel: 0, image: './zz_image/at_end_none.jpg' },
  { id: 'arisa',  name: 'アリサ',       hint: '偶数設定示唆(弱)', hintLevel: 1, image: './zz_image/at_end_arisa.jpg' },
  { id: 'kouta',  name: 'コウタ',       hint: '高設定示唆(弱)',   hintLevel: 1, image: './zz_image/at_end_kouta.jpg' },
  { id: 'yuu',    name: 'ユウ',         hint: '設定2・3・4否定',  hintLevel: 2, image: './zz_image/at_end_yuu.jpg' },
  { id: 'sakuya', name: 'サクヤ',       hint: '偶数設定示唆(強)', hintLevel: 3, image: './zz_image/at_end_sakuya.jpg' },
  { id: 'soma',   name: 'ソーマ',       hint: '高設定示唆(強)',   hintLevel: 3, image: './zz_image/at_end_soma.jpg' },
  { id: 'cafe',   name: 'カフェ',       hint: '偶数設定濃厚',    hintLevel: 4, image: './zz_image/at_end_cafe.jpg' },
  { id: 'rindo',  name: 'リンドウ',     hint: '設定2以上濃厚',   hintLevel: 4, image: './zz_image/at_end_rindo.jpg' },
  { id: 'shio',   name: 'シオ',         hint: '設定5以上濃厚',   hintLevel: 5, image: './zz_image/at_end_shio.jpg' },
  { id: 'at56',   name: '設定5・6確定', hint: '設定5・6確定',    hintLevel: 6, image: './zz_image/at_end_56.jpg' },
  { id: 'at6',    name: '設定6確定',    hint: '設定6確定',       hintLevel: 6, image: './zz_image/at_end_6.jpg' },
] as const;

const HINT_COLORS: Record<number, string> = {
  0: 'bg-gray-100 text-gray-600',
  1: 'bg-blue-100 text-blue-700',
  2: 'bg-slate-700 text-white',
  3: 'bg-orange-100 text-orange-700',
  4: 'bg-red-100 text-red-700',
  5: 'bg-purple-100 text-purple-700',
  6: 'bg-yellow-300 text-yellow-900',
};

type VoiceId = typeof STORY_END_VOICES[number]['id'];
type AtEndId = typeof AT_END_SCREENS[number]['id'];

type VoiceCounts = Record<VoiceId, number>;
type AtEndCounts = Record<AtEndId, number>;

const initialVoiceCounts = (): VoiceCounts =>
  Object.fromEntries(STORY_END_VOICES.map(v => [v.id, 0])) as VoiceCounts;

const initialAtEndCounts = (): AtEndCounts =>
  Object.fromEntries(AT_END_SCREENS.map(s => [s.id, 0])) as AtEndCounts;

const CountButtons: React.FC<{
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}> = ({ count, onIncrement, onDecrement }) => (
  <div className="flex items-center gap-1.5">
    <button
      onClick={onDecrement}
      disabled={count === 0}
      className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-slate-700 flex items-center justify-center text-lg leading-none"
    >
      −
    </button>
    <span className="w-6 text-center text-sm font-semibold tabular-nums">{count}</span>
    <button
      onClick={onIncrement}
      className="w-7 h-7 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold flex items-center justify-center text-lg leading-none"
    >
      +
    </button>
  </div>
);

const ImageCell: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [imgError, setImgError] = useState(false);
  return imgError ? (
    <div className="w-14 h-9 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">画像</div>
  ) : (
    <img src={src} alt={alt} className="w-14 h-9 object-cover rounded" onError={() => setImgError(true)} />
  );
};

export const GodEaterResurrection: React.FC = () => {
  const [voiceCounts, setVoiceCounts] = useState<VoiceCounts>(initialVoiceCounts);
  const [atEndCounts, setAtEndCounts] = useState<AtEndCounts>(initialAtEndCounts);

  const voiceTotal = Object.values(voiceCounts).reduce((a, b) => a + b, 0);
  const atEndTotal = Object.values(atEndCounts).reduce((a, b) => a + b, 0);

  const incrementVoice = useCallback((id: VoiceId) => {
    setVoiceCounts(prev => ({ ...prev, [id]: prev[id] + 1 }));
  }, []);

  const decrementVoice = useCallback((id: VoiceId) => {
    setVoiceCounts(prev => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }));
  }, []);

  const incrementAtEnd = useCallback((id: AtEndId) => {
    setAtEndCounts(prev => ({ ...prev, [id]: prev[id] + 1 }));
  }, []);

  const decrementAtEnd = useCallback((id: AtEndId) => {
    setAtEndCounts(prev => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }));
  }, []);

  const resetAll = useCallback(() => {
    setVoiceCounts(initialVoiceCounts());
    setAtEndCounts(initialAtEndCounts());
  }, []);

  const pct = (count: number, total: number) =>
    total > 0 ? `${((count / total) * 100).toFixed(1)}%` : '-';

  return (
    <div className="space-y-5">
      {/* ストーリー終了ボイス */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-800">ストーリー終了ボイス</h2>
          <span className="text-xs text-gray-500">合計: <span className="font-semibold text-gray-700">{voiceTotal}</span> 回</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="pb-1 px-2 text-xs font-semibold text-gray-500">キャラ / ボイス</th>
                <th className="pb-1 px-2 text-xs font-semibold text-gray-500">示唆</th>
                <th className="pb-1 px-2 text-xs font-semibold text-gray-500">回数</th>
                <th className="pb-1 px-2 text-xs font-semibold text-gray-500 text-right">割合</th>
              </tr>
            </thead>
            <tbody>
              {STORY_END_VOICES.map(v => (
                <tr key={v.id} className="border-b border-gray-200 last:border-0">
                  <td className="py-1.5 px-2">
                    <div className="text-sm font-semibold text-gray-800">{v.character}</div>
                    <div className="text-xs text-gray-500 leading-tight">「{v.voice}」</div>
                  </td>
                  <td className="py-1.5 px-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${HINT_COLORS[v.hintLevel]}`}>
                      {v.hint}
                    </span>
                  </td>
                  <td className="py-1.5 px-2">
                    <CountButtons
                      count={voiceCounts[v.id]}
                      onIncrement={() => incrementVoice(v.id)}
                      onDecrement={() => decrementVoice(v.id)}
                    />
                  </td>
                  <td className="py-1.5 px-2 text-sm tabular-nums text-gray-700 text-right">
                    {pct(voiceCounts[v.id], voiceTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AT終了画面 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-gray-800">AT終了画面</h2>
          <span className="text-xs text-gray-500">合計: <span className="font-semibold text-gray-700">{atEndTotal}</span> 回</span>
        </div>
        <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 mb-3">
          背景が赤以上のAT終了画面 → <span className="font-semibold">設定3以上濃厚</span>
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="pb-1 px-2 text-xs font-semibold text-gray-500">画像</th>
                <th className="pb-1 px-2 text-xs font-semibold text-gray-500">終了画面</th>
                <th className="pb-1 px-2 text-xs font-semibold text-gray-500">示唆</th>
                <th className="pb-1 px-2 text-xs font-semibold text-gray-500">回数</th>
                <th className="pb-1 px-2 text-xs font-semibold text-gray-500 text-right">割合</th>
              </tr>
            </thead>
            <tbody>
              {AT_END_SCREENS.map(s => (
                <tr key={s.id} className="border-b border-gray-200 last:border-0">
                  <td className="py-1 px-2 w-16">
                    <ImageCell src={s.image} alt={s.name} />
                  </td>
                  <td className="py-1.5 px-2 text-sm font-medium text-gray-800 whitespace-nowrap">{s.name}</td>
                  <td className="py-1.5 px-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${HINT_COLORS[s.hintLevel]}`}>
                      {s.hint}
                    </span>
                  </td>
                  <td className="py-1.5 px-2">
                    <CountButtons
                      count={atEndCounts[s.id]}
                      onIncrement={() => incrementAtEnd(s.id)}
                      onDecrement={() => decrementAtEnd(s.id)}
                    />
                  </td>
                  <td className="py-1.5 px-2 text-sm tabular-nums text-gray-700 text-right">
                    {pct(atEndCounts[s.id], atEndTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* リセットボタン */}
      <div className="flex justify-center">
        <button
          onClick={resetAll}
          className="px-6 py-2.5 bg-gradient-to-r from-slate-500 to-slate-700 hover:from-slate-600 hover:to-slate-800 text-white font-semibold rounded-lg shadow-xl focus:outline-none focus:ring-4 focus:ring-slate-300 focus:ring-opacity-70 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 text-sm"
        >
          全リセット
        </button>
      </div>
    </div>
  );
};
