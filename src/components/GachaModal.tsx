import React, { useState } from 'react';
import { X, Sparkles, Gift, Ticket, Coins, RotateCcw } from 'lucide-react';
import { Costume, PlayerStats } from '../types/game';
import { COSTUMES, PILOTS } from '../utils/mathEngine';
import { sound } from '../utils/audio';

interface GachaModalProps {
  stats: PlayerStats;
  onSpendCoin: () => boolean;
  onAddTickets: (qty: number) => void;
  onUnlockCostume: (costumeId: string) => void;
  onClose: () => void;
}

export const GachaModal: React.FC<GachaModalProps> = ({
  stats,
  onSpendCoin,
  onAddTickets,
  onUnlockCostume,
  onClose,
}) => {
  const [phase, setPhase] = useState<'IDLE' | 'CRANKING' | 'REVEAL'>('IDLE');
  const [wonPrize, setWonPrize] = useState<{
    type: 'COSTUME' | 'TICKET';
    costume?: Costume;
    ticketQty?: number;
    isDuplicate?: boolean;
  } | null>(null);

  const handleCrankGacha = () => {
    if (stats.gachaCoins <= 0 || phase === 'CRANKING') return;

    const ok = onSpendCoin();
    if (!ok) return;

    sound.playMegaLaserCharge();
    setPhase('CRANKING');

    setTimeout(() => {
      sound.playPresentOpen();

      // Roll chance: 65% costume (can be new or duplicate), 35% warp tickets
      if (Math.random() > 0.35) {
        const randomCostume = COSTUMES[Math.floor(Math.random() * COSTUMES.length)];
        const isDuplicate = stats.unlockedCostumes.includes(randomCostume.id);

        if (isDuplicate) {
          // If duplicate at main menu: grant 1 Warp Ticket!
          onAddTickets(1);
          setWonPrize({
            type: 'COSTUME',
            costume: randomCostume,
            isDuplicate: true,
            ticketQty: 1,
          });
        } else {
          // New costume unlocked!
          onUnlockCostume(randomCostume.id);
          setWonPrize({
            type: 'COSTUME',
            costume: randomCostume,
            isDuplicate: false,
          });
        }
      } else {
        // Win Warp Tickets!
        const qty = Math.random() > 0.5 ? 2 : 1;
        onAddTickets(qty);
        setWonPrize({ type: 'TICKET', ticketQty: qty });
      }

      setPhase('REVEAL');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md select-none overflow-y-auto">
      <div className="relative w-full max-w-md max-h-[92dvh] overflow-y-auto bg-gradient-to-b from-slate-900 to-purple-950 border-2 border-yellow-400/40 rounded-3xl p-5 sm:p-6 text-center flex flex-col items-center shadow-2xl my-auto">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎰</span>
            <div className="text-left">
              <h3 className="text-lg font-black text-white leading-tight">
                ตู้กาชาปองอวกาศ (Star Gacha)
              </h3>
              <p className="text-xs text-yellow-300">
                ลุ้นรับชุดสกินใหม่และตั๋ววาร์ปข้ามด่าน!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Currency Status */}
        <div className="w-full flex justify-between items-center bg-slate-900/80 px-4 py-2 rounded-2xl border border-white/5 my-3 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-amber-300">
            <span className="text-base">🟡</span>
            <span>เหรียญกาชา: {stats.gachaCoins}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-300">
            <Ticket className="w-4 h-4 text-sky-400" />
            <span>ตั๋ววาร์ป: {stats.warpTickets} ใบ</span>
          </div>
        </div>

        {/* Machine Interactive View */}
        {phase === 'IDLE' && (
          <div className="my-4 flex flex-col items-center">
            {/* Gacha Ball Container Visual */}
            <div className="relative w-40 h-40 rounded-full bg-gradient-to-tr from-pink-500/30 via-purple-500/20 to-sky-500/30 border-4 border-yellow-400/60 p-4 flex items-center justify-center shadow-2xl overflow-hidden animate-pulse">
              <div className="text-4xl animate-bounce">
                🟡 🟣 🟢 🔵 🔴
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-3 mb-5">
              ใช้ 1 เหรียญกาชา 🟡 เพื่อหมุนรับสกินหรือตั๋ววาร์ป
            </p>

            <button
              disabled={stats.gachaCoins <= 0}
              onClick={handleCrankGacha}
              className={`w-full py-4 px-6 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 shadow-xl ${
                stats.gachaCoins > 0
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 scale-105 active:scale-95 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>{stats.gachaCoins > 0 ? 'หมุนตู้กาชาปอง! (1 🟡)' : 'เหรียญกาชาหมดแล้ว (ชนะบอสเพื่อรับเพิ่ม)'}</span>
            </button>
          </div>
        )}

        {/* Cranking Phase */}
        {phase === 'CRANKING' && (
          <div className="my-8 flex flex-col items-center animate-bounce">
            <div className="text-7xl animate-spin">
              🌀
            </div>
            <span className="text-base font-black text-yellow-300 mt-4 tracking-wider">
              กำลังไขตู้กาชาปอง... 🎁
            </span>
          </div>
        )}

        {/* Reveal Phase */}
        {phase === 'REVEAL' && wonPrize && (
          <div className="my-3 flex flex-col items-center animate-fade-in w-full">
            <div className="inline-flex items-center gap-1 text-xs text-yellow-300 font-bold bg-yellow-500/20 px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ยินดีด้วย! คุณได้รับ</span>
            </div>

            {wonPrize.type === 'COSTUME' && wonPrize.costume && (
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-[2rem] overflow-hidden border-4 border-yellow-400 shadow-[0_0_35px_rgba(250,204,21,0.5)] my-2 bg-slate-900 group">
                  <img
                    src={wonPrize.costume.imageUrl}
                    alt={wonPrize.costume.name}
                    className="w-full h-full object-cover animate-pulse"
                  />
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-900/90 border border-yellow-400 flex items-center justify-center text-base shadow">
                    {wonPrize.costume.emoji}
                  </div>
                  {wonPrize.isDuplicate ? (
                    <div className="absolute inset-x-2 bottom-2 bg-amber-500/95 text-slate-950 font-black text-xs py-1 px-2 rounded-xl shadow flex items-center justify-center gap-1">
                      <Ticket className="w-3.5 h-3.5 fill-slate-950" />
                      <span>สกินซ้ำ! ได้ตั๋ววาร์ป +1 ใบ</span>
                    </div>
                  ) : (
                    <div className="absolute bottom-1.5 inset-x-2 bg-slate-950/80 rounded-lg py-0.5 text-[10px] font-black text-yellow-300">
                      สกินใหม่ปลดล็อกแล้ว! 2D
                    </div>
                  )}
                </div>

                <h4 className="text-xl font-black text-white mt-1">
                  {wonPrize.costume.name}
                </h4>

                {wonPrize.isDuplicate ? (
                  <div className="mt-1 px-3 py-1 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-300 text-xs font-bold">
                    🔄 คุณมีชุดนี้แล้ว! ระบบมอบ <b>ตั๋ววาร์ปอวกาศ 🎫 +1 ใบ</b> ทดแทน
                  </div>
                ) : (
                  <p className="text-xs text-purple-200">
                    สำหรับ {PILOTS.find((p) => p.id === wonPrize.costume?.pilotId)?.thaiName}!
                  </p>
                )}

                <div className="text-xs text-yellow-300 font-bold mt-1 bg-yellow-500/10 px-3 py-0.5 rounded-full border border-yellow-400/20">
                  ท่าโจมตี: {wonPrize.costume.attackName} {wonPrize.costume.attackEmoji}
                </div>
              </div>
            )}

            {wonPrize.type === 'TICKET' && (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-3xl bg-slate-800 border-4 border-sky-400 flex items-center justify-center text-5xl shadow-2xl my-1">
                  🎫
                </div>
                <h4 className="text-lg font-black text-white mt-2">
                  ตั๋วดาววาร์ปอวกาศ +{wonPrize.ticketQty} ใบ!
                </h4>
                <p className="text-xs text-sky-200 mt-0.5">
                  ใช้เพื่อข้ามไปเล่นด่านยากได้ทันที!
                </p>
              </div>
            )}

            <div className="w-full flex gap-2 mt-5">
              {stats.gachaCoins > 0 && (
                <button
                  onClick={() => setPhase('IDLE')}
                  className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>หมุนอีกรอบ ({stats.gachaCoins} 🟡)</span>
                </button>
              )}
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                เสร็จสิ้น
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
