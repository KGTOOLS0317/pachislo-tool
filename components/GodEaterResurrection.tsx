
// components/GodEaterResurrection.tsx
import React, { useState, useCallback } from 'react';

const STORY_END_VOICES = [
  { id: 'kouta',  character: 'コウタ',   voice: '一緒にバガラリー見ようぜ',                    hint: 'デフォ',   hintLevel: 0 },
  { id: 'arisa',  character: 'アリサ',   voice: '側面、後方共にクリアです',                    hint: 'デフォ',   hintLevel: 0 },
  { id: 'hibari', character: 'ヒバリ',   voice: '私にもお役に立てることがあるはずです',         hint: '偶数弱',   hintLevel: 1 },
  { id: 'soma',   character: 'ソーマ',   voice: '思い出ってのは、悪いことばかりでもないんだな', hint: '高設弱',   hintLevel: 2 },
  { id: 'yuu',    character: 'ユウ',     voice: '信じられる仲間がいるから、俺たちは戦えるんだ', hint: '2,3否定',  hintLevel: 3 },
  { id: 'sakuya', character: 'サクヤ',   voice: '私は、私のやるべきことをしなくちゃね',         hint: '偶数強',   hintLevel: 4 },
  { id: 'ren',    character: 'レン',     voice: 'あなたはそのアラガミを殺せますか？',           hint: '高設強',   hintLevel: 5 },
  { id: 'erina',  character: 'エリナ',   voice: '私、大きくなったらアラガミのいない世界を作る', hint: '偶数確',   hintLevel: 6 },
  { id: 'rindou', character: 'リンドウ', voice: 'いつでも、お前の背中は預かってやるからな',     hint: '1否定',    hintLevel: 7 },
  { id: 'shio',   character: 'シオ',     voice: 'いただきま～す',                              hint: '5,6確',    hintLevel: 8 },
] as const;

const AT_END_SCREENS = [
  { id: 'none',   hint: 'デフォ',    hintLevel: 0, image: './zz_image/at_end_none.jpg' },
  { id: 'arisa',  hint: '偶数弱',    hintLevel: 1, image: './zz_image/at_end_arisa.jpg' },
  { id: 'kouta',  hint: '高設弱',    hintLevel: 2, image: './zz_image/at_end_kouta.jpg' },
  { id: 'yuu',    hint: '2-4否定',   hintLevel: 3, image: './zz_image/at_end_yuu.jpg' },
  { id: 'sakuya', hint: '偶数強',    hintLevel: 4, image: './zz_image/at_end_sakuya.jpg' },
  { id: 'soma',   hint: '高設強',    hintLevel: 5, image: './zz_image/at_end_soma.jpg' },
  { id: 'cafe',   hint: '偶数確',    hintLevel: 6, image: './zz_image/at_end_cafe.jpg' },
  { id: 'rindo',  hint: '1否定',     hintLevel: 7, image: './zz_image/at_end_rindo.jpg' },
  { id: 'shio',   hint: '5,6確',     hintLevel: 8, image: './zz_image/at_end_shio.jpg' },
  { id: 'at56',   hint: '5,6確定',   hintLevel: 9, image: './zz_image/at_end_56.jpg' },
  { id: 'at6',    hint: '6確定',     hintLevel: 9, image: './zz_image/at_end_6.jpg' },
] as const;

// hint badge colors by level
const HINT_BG: Record<number, string> = {
  0: 'bg-gray-200 text-gray-600',
  1: 'bg-blue-100 text-blue-700',
  2: 'bg-cyan-100 text-cyan-700',
  3: 'bg-slate-600 text-white',
  4: 'bg-indigo-100 text-indigo-700',
  5: 'bg-orange-100 text-orange-700',
  6: 'bg-red-100 text-red-700',
  7: 'bg-purple-100 text-purple-700',
  8: 'bg-purple-200 text-purple-800',
  9: 'bg-yellow-300 text-yellow-900',
};

type VoiceId = typeof STORY_END_VOICES[number]['id'];
type AtEndId = typeof AT_END_SCREENS[number]['id'];
type VoiceCounts = Record<VoiceId, number>;
type AtEndCounts = Record<AtEndId, number>;

const initVoice = (): VoiceCounts =>
  Object.fromEntries(STORY_END_VOICES.map(v => [v.id, 0])) as VoiceCounts;
const initAtEnd = (): AtEndCounts =>
  Object.fromEntries(AT_END_SCREENS.map(s => [s.id, 0])) as AtEndCounts;

const HintBadge: React.FC<{ hint: string; level: number }> = ({ hint, level }) => (
  <span className={`inline-block text-[10px] font-semibold px-1 py-0.5 rounded leading-tight whitespace-nowrap ${HINT_BG[level] ?? HINT_BG[0]}`}>
    {hint}
  </span>
);

const PlusMinus: React.FC<{ count: number; onInc: () => void; onDec: () => void }> = ({ count, onInc, onDec }) => (
  <div className="flex items-center gap-1">
    <button
      onClick={onDec}
      disabled={count === 0}
      className="w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 flex items-center justify-center text-base font-bold leading-none"
    >−</button>
    <span className="w-5 text-center text-sm font-semibold tabular-nums">{count}</span>
    <button
      onClick={onInc}
      className="w-6 h-6 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center text-base font-bold leading-none"
    >+</button>
  </div>
);

const SqImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [err, setErr] = useState(false);
  return err ? (
    <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-[9px]">NO IMG</div>
  ) : (
    <img src={src} alt={alt} className="w-10 h-10 object-cover rounded" onError={() => setErr(true)} />
  );
};

const pct = (n: number, total: number) => total > 0 ? `${((n / total) * 100).toFixed(1)}%` : '-';

export const GodEaterResurrection: React.FC = () => {
  const [voiceCounts, setVoiceCounts] = useState<VoiceCounts>(initVoice);
  const [atEndCounts, setAtEndCounts] = useState<AtEndCounts>(initAtEnd);

  const voiceTotal = Object.values(voiceCounts).reduce((a, b) => a + b, 0);
  const atEndTotal = Object.values(atEndCounts).reduce((a, b) => a + b, 0);

  const incV = useCallback((id: VoiceId) => setVoiceCounts(p => ({ ...p, [id]: p[id] + 1 })), []);
  const decV = useCallback((id: VoiceId) => setVoiceCounts(p => ({ ...p, [id]: Math.max(0, p[id] - 1) })), []);
  const incA = useCallback((id: AtEndId) => setAtEndCounts(p => ({ ...p, [id]: p[id] + 1 })), []);
  const decA = useCallback((id: AtEndId) => setAtEndCounts(p => ({ ...p, [id]: Math.max(0, p[id] - 1) })), []);
  const resetAll = useCallback(() => { setVoiceCounts(initVoice()); setAtEndCounts(initAtEnd()); }, []);

  return (
    <div className="space-y-5">
      {/* ストーリー終了ボイス */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-gray-800">ストーリー終了ボイス</h2>
          <span className="text-xs text-gray-500">計 <span className="font-semibold text-gray-700">{voiceTotal}</span> 回</span>
        </div>
        <table className="w-full table-fixed text-left">
          <colgroup>
            <col style={{ width: '50%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '24%' }} />
            <col style={{ width: '16%' }} />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-1 text-[10px] font-semibold text-gray-400">キャラ / ボイス</th>
              <th className="pb-1 text-[10px] font-semibold text-gray-400">示唆</th>
              <th className="pb-1 text-[10px] font-semibold text-gray-400">回数</th>
              <th className="pb-1 text-[10px] font-semibold text-gray-400 text-right">割合</th>
            </tr>
          </thead>
          <tbody>
            {STORY_END_VOICES.map(v => (
              <tr key={v.id} className="border-b border-gray-100 last:border-0">
                <td className="py-1 pr-1">
                  <div className="text-xs font-semibold text-gray-800 leading-tight">{v.character}</div>
                  <div className="text-[10px] text-gray-500 leading-tight line-clamp-2">「{v.voice}」</div>
                </td>
                <td className="py-1 pr-1">
                  <HintBadge hint={v.hint} level={v.hintLevel} />
                </td>
                <td className="py-1">
                  <PlusMinus count={voiceCounts[v.id]} onInc={() => incV(v.id)} onDec={() => decV(v.id)} />
                </td>
                <td className="py-1 text-xs tabular-nums text-gray-700 text-right pr-1">
                  {pct(voiceCounts[v.id], voiceTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AT終了画面 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-bold text-gray-800">AT終了画面</h2>
          <span className="text-xs text-gray-500">計 <span className="font-semibold text-gray-700">{atEndTotal}</span> 回</span>
        </div>
        <p className="text-[10px] text-amber-700 bg-amber-50 rounded px-2 py-1 mb-2">
          背景が赤以上のAT終了画面 → <span className="font-semibold">設定3以上濃厚</span>
        </p>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-1 text-[10px] font-semibold text-gray-400 w-12">画像</th>
              <th className="pb-1 text-[10px] font-semibold text-gray-400">示唆</th>
              <th className="pb-1 text-[10px] font-semibold text-gray-400">回数</th>
              <th className="pb-1 text-[10px] font-semibold text-gray-400 text-right">割合</th>
            </tr>
          </thead>
          <tbody>
            {AT_END_SCREENS.map(s => (
              <tr key={s.id} className="border-b border-gray-100 last:border-0">
                <td className="py-1 pr-2">
                  <SqImage src={s.image} alt={s.hint} />
                </td>
                <td className="py-1 pr-1">
                  <HintBadge hint={s.hint} level={s.hintLevel} />
                </td>
                <td className="py-1">
                  <PlusMinus count={atEndCounts[s.id]} onInc={() => incA(s.id)} onDec={() => decA(s.id)} />
                </td>
                <td className="py-1 text-xs tabular-nums text-gray-700 text-right pr-1">
                  {pct(atEndCounts[s.id], atEndTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
