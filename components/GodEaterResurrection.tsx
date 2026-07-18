
// components/GodEaterResurrection.tsx
import React, { useState, useCallback } from 'react';

const STORY_END_VOICES = [
  { id: 'kouta',  character: 'コウタ',   voice: '一緒にバガラリー見ようぜ',                    hint: 'デフォ'    },
  { id: 'arisa',  character: 'アリサ',   voice: '側面、後方共にクリアです',                    hint: 'デフォ'    },
  { id: 'hibari', character: 'ヒバリ',   voice: '私にもお役に立てることがあるはずです',         hint: '偶数弱'    },
  { id: 'soma',   character: 'ソーマ',   voice: '思い出ってのは、悪いことばかりでもないんだな', hint: '高設弱'    },
  { id: 'yuu',    character: 'ユウ',     voice: '信じられる仲間がいるから、俺たちは戦えるんだ', hint: '2,3否定'   },
  { id: 'sakuya', character: 'サクヤ',   voice: '私は、私のやるべきことをしなくちゃね',         hint: '偶数強'    },
  { id: 'ren',    character: 'レン',     voice: 'あなたはそのアラガミを殺せますか？',           hint: '高設強'    },
  { id: 'erina',  character: 'エリナ',   voice: '私、大きくなったらアラガミのいない世界を作る', hint: '偶数確'    },
  { id: 'rindou', character: 'リンドウ', voice: 'いつでも、お前の背中は預かってやるからな',     hint: '1否定'     },
  { id: 'shio',   character: 'シオ',     voice: 'いただきま～す',                              hint: '5,6確'     },
] as const;

const AT_END_SCREENS = [
  { id: 'none',   hint: 'デフォ',      image: './zz_image/at_end_none.jpg'   },
  { id: 'arisa',  hint: '偶数弱',      image: './zz_image/at_end_arisa.jpg'  },
  { id: 'kouta',  hint: '高設弱',      image: './zz_image/at_end_kouta.jpg'  },
  { id: 'yuu',    hint: '1,5,6確定',   image: './zz_image/at_end_yuu.jpg'    },
  { id: 'sakuya', hint: '偶数強',      image: './zz_image/at_end_sakuya.jpg' },
  { id: 'soma',   hint: '高設強',      image: './zz_image/at_end_soma.jpg'   },
  { id: 'cafe',   hint: '偶数確',      image: './zz_image/at_end_cafe.jpg'   },
  { id: 'rindo',  hint: '3,4,5,6確定', image: './zz_image/at_end_rindo.jpg'  },
  { id: 'shio',   hint: '4,5,6確定',   image: './zz_image/at_end_shio.jpg'   },
  { id: 'at56',   hint: '5,6確定',     image: './zz_image/at_end_56.jpg'     },
  { id: 'at6',    hint: '6確定',       image: './zz_image/at_end_6.jpg'      },
] as const;

// hint文字列 → バッジスタイル（色を一元管理）
const HINT_STYLE: Record<string, string> = {
  'デフォ':       'bg-gray-200 text-gray-600',
  '偶数弱':       'bg-blue-100 text-blue-700',
  '偶数強':       'bg-blue-600 text-white',
  '偶数確':       'bg-blue-600 text-white',
  '高設弱':       'bg-amber-100 text-amber-700',
  '高設強':       'bg-green-200 text-green-800',
  '1否定':        'bg-amber-100 text-amber-700',
  '2,3否定':      'bg-green-200 text-green-800',
  '1,5,6確定':    'bg-red-100 text-red-600',
  '3,4,5,6確定':  'bg-green-200 text-green-800',
  '4,5,6確定':    'bg-red-100 text-red-600',
  '5,6確':        'bg-red-600 text-white',
  '5,6確定':      'bg-red-600 text-white',
  '6確定':        'bg-purple-500 text-white',
};
const hintStyle = (hint: string) => HINT_STYLE[hint] ?? 'bg-gray-200 text-gray-600';

type VoiceId = typeof STORY_END_VOICES[number]['id'];
type AtEndId = typeof AT_END_SCREENS[number]['id'];
type VoiceCounts = Record<VoiceId, number>;
type AtEndCounts = Record<AtEndId, number>;

const initVoice = (): VoiceCounts =>
  Object.fromEntries(STORY_END_VOICES.map(v => [v.id, 0])) as VoiceCounts;
const initAtEnd = (): AtEndCounts =>
  Object.fromEntries(AT_END_SCREENS.map(s => [s.id, 0])) as AtEndCounts;

const HintBadge: React.FC<{ hint: string }> = ({ hint }) => (
  <span className={`inline-block text-[10px] font-semibold px-1 py-0.5 rounded leading-tight whitespace-nowrap ${hintStyle(hint)}`}>
    {hint}
  </span>
);

const Counter: React.FC<{ count: number; onInc: () => void; onDec: () => void }> = ({ count, onInc, onDec }) => (
  <div className="flex items-center justify-center gap-0.5">
    <button
      onClick={onDec}
      disabled={count === 0}
      className="w-5 h-5 text-xs rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 font-bold flex items-center justify-center"
    >−</button>
    <span className="w-4 text-center text-xs font-semibold tabular-nums">{count}</span>
    <button
      onClick={onInc}
      className="w-5 h-5 text-xs rounded bg-sky-500 hover:bg-sky-600 text-white font-bold flex items-center justify-center"
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

const pct = (n: number, total: number): string =>
  total > 0 ? `${((n / total) * 100).toFixed(1)}%` : '-';

const ResetBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-[10px] text-slate-400 hover:text-red-500 border border-slate-300 hover:border-red-400 rounded px-1.5 py-0.5 transition-colors"
  >
    リセット
  </button>
);

export const GodEaterResurrection: React.FC = () => {
  const [voiceCounts, setVoiceCounts] = useState<VoiceCounts>(initVoice);
  const [atEndCounts, setAtEndCounts] = useState<AtEndCounts>(initAtEnd);

  const voiceTotal = Object.values(voiceCounts).reduce((a, b) => a + b, 0);
  const atEndTotal = Object.values(atEndCounts).reduce((a, b) => a + b, 0);

  const incV = useCallback((id: VoiceId) => setVoiceCounts(p => ({ ...p, [id]: p[id] + 1 })), []);
  const decV = useCallback((id: VoiceId) => setVoiceCounts(p => ({ ...p, [id]: Math.max(0, p[id] - 1) })), []);
  const incA = useCallback((id: AtEndId) => setAtEndCounts(p => ({ ...p, [id]: p[id] + 1 })), []);
  const decA = useCallback((id: AtEndId) => setAtEndCounts(p => ({ ...p, [id]: Math.max(0, p[id] - 1) })), []);
  const resetVoice = useCallback(() => setVoiceCounts(initVoice()), []);
  const resetAtEnd = useCallback(() => setAtEndCounts(initAtEnd()), []);

  return (
    <div className="space-y-5">
      {/* ストーリー終了ボイス */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-gray-800">ストーリー終了ボイス</h2>
          <div className="flex items-center gap-2">
            <ResetBtn onClick={resetVoice} />
            <span className="text-xs text-gray-500">計 <span className="font-semibold text-gray-700">{voiceTotal}</span> 回</span>
          </div>
        </div>
        <table className="w-full table-fixed text-left">
          <colgroup>
            <col style={{ width: '50%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '16%' }} />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-1 text-[10px] font-semibold text-gray-400 text-left">キャラ / ボイス</th>
              <th className="pb-1 text-[10px] font-semibold text-gray-400 text-center">示唆</th>
              <th className="pb-1 text-[10px] font-semibold text-gray-400 text-center">回数</th>
              <th className="pb-1 text-[10px] font-semibold text-gray-400 text-center">割合</th>
            </tr>
          </thead>
          <tbody>
            {STORY_END_VOICES.map(v => (
              <tr key={v.id} className="border-b border-gray-100 last:border-0">
                <td className="py-1 pr-1 align-middle">
                  <div className="text-[11px] leading-snug line-clamp-2">
                    <span className="font-bold">{v.character}</span>
                    <span className="text-gray-600">「{v.voice}」</span>
                  </div>
                </td>
                <td className="py-1 align-middle text-center">
                  <HintBadge hint={v.hint} />
                </td>
                <td className="py-1 align-middle">
                  <Counter count={voiceCounts[v.id]} onInc={() => incV(v.id)} onDec={() => decV(v.id)} />
                </td>
                <td className="py-1 align-middle text-center text-xs tabular-nums text-gray-700">
                  {pct(voiceCounts[v.id], voiceTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AT終了画面 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-gray-800">AT終了画面</h2>
          <div className="flex items-center gap-2">
            <ResetBtn onClick={resetAtEnd} />
            <span className="text-xs text-gray-500">計 <span className="font-semibold text-gray-700">{atEndTotal}</span> 回</span>
          </div>
        </div>
        <table className="w-full table-fixed text-left">
          <colgroup>
            <col style={{ width: '14%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '38%' }} />
            <col style={{ width: '26%' }} />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-1 text-[10px] font-semibold text-gray-400 text-center">画像</th>
              <th className="pb-1 text-[10px] font-semibold text-gray-400 text-center">示唆</th>
              <th className="pb-1 text-[10px] font-semibold text-gray-400 text-center">回数</th>
              <th className="pb-1 text-[10px] font-semibold text-gray-400 text-center">割合</th>
            </tr>
          </thead>
          <tbody>
            {AT_END_SCREENS.map(s => (
              <tr key={s.id} className="border-b border-gray-100 last:border-0">
                <td className="py-1 align-middle text-center">
                  <div className="flex justify-center">
                    <SqImage src={s.image} alt={s.hint} />
                  </div>
                </td>
                <td className="py-1 align-middle text-center">
                  <HintBadge hint={s.hint} />
                </td>
                <td className="py-1 align-middle">
                  <Counter count={atEndCounts[s.id]} onInc={() => incA(s.id)} onDec={() => decA(s.id)} />
                </td>
                <td className="py-1 align-middle text-center text-xs tabular-nums text-gray-700">
                  {pct(atEndCounts[s.id], atEndTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
