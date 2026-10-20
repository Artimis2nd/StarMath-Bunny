import React from 'react';
import { X, Ticket, Play, Lock, Sparkles } from 'lucide-react';
import { SectorConfig } from '../types/game';
import { SECTORS } from '../utils/mathEngine';
import { sound } from '../utils/audio';

interface SectorWarpModalProps {
  currentSector: number;
  highestSectorReached: number;
  warpTickets: number;
  onSelectSector: (sector: SectorConfig, ticketsUsed: number) => void;
  onClose: () => void;
}

export const SectorWarpModal: React.FC<SectorWarpModalProps> = ({
  currentSector,
  highestSectorReached,
  warpTickets,
  onSelectSector,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-md select-none overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-purple-500/30 rounded-3xl p-4 sm:p-7 shadow-2xl max-h-[92dvh] overflow-y-auto my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg text-white font-bold">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                ประตูวาร์ปอวกาศ (Warp Gates)
              </h2>
              <p className="text-xs sm:text-sm text-purple-300">
                ด่าน 1 เล่นฟรีเสมอ · ใช้ตั๋ววาร์ป 🎫 เพื่อข้ามไปเริ่มที่ด่านยากได้ทันที!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warp Tickets Counter */}
        <div className="my-4 p-3 bg-slate-800/80 rounded-2xl border border-white/5 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-bold text-slate-300">
            🎫 ตั๋วดาววาร์ปที่คุณมีสะสม:
          </span>
          <div className="flex items-center gap-1.5 bg-sky-950/80 px-3.5 py-1.5 rounded-xl border border-sky-400/30 text-sky-300 font-black text-sm sm:text-base tabular-nums">
            <Ticket className="w-4 h-4 text-sky-400" />
            <span>{warpTickets} ใบ</span>
          </div>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4 my-4">
          {SECTORS.map((sec) => {
            const isFloor1 = sec.sector === 1;
            const isUnlocked = sec.sector <= highestSectorReached;
            const ticketCost = sec.warpCostTickets;
            const canAfford = isFloor1 || (isUnlocked && warpTickets >= ticketCost);

            return (
              <div
                key={sec.sector}
                className={`relative rounded-3xl p-4 transition-all border flex flex-col justify-between ${
                  !isUnlocked
                    ? 'bg-slate-950/40 border-white/5 opacity-50'
                    : canAfford
                    ? 'bg-slate-800/80 hover:bg-slate-800 border-white/10 hover:border-purple-400/50 cursor-pointer shadow-lg'
                    : 'bg-slate-900/60 border-rose-500/20 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-md"
                      style={{ backgroundColor: sec.themeColor }}
                    >
                      +{sec.sector}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {sec.thaiName}
                      </h4>
                      <span className="text-xs text-purple-300 font-medium flex items-center gap-1 mt-0.5">
                        <span>{sec.bossEmoji}</span>
                        <span>{sec.bossName}</span>
                      </span>
                    </div>
                  </div>

                  {!isUnlocked ? (
                    <span className="text-[10px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>ต้องผ่านก่อน</span>
                    </span>
                  ) : isFloor1 ? (
                    <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      เล่นฟรี
                    </span>
                  ) : (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        warpTickets >= ticketCost
                          ? 'bg-sky-500/20 text-sky-300 border-sky-400/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                      }`}
                    >
                      <Ticket className="w-3 h-3" />
                      <span>ใช้ {ticketCost} ใบ</span>
                    </span>
                  )}
                </div>

                {/* Action button */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {isFloor1
                      ? 'เริ่มเล่นจากด่าน 1 (ฟรี)'
                      : !isUnlocked
                      ? '🔒 ต้องเคยพิชิตก่อนถึงวาร์ปได้'
                      : warpTickets >= ticketCost
                      ? `พร้อมวาร์ป (ใช้ ${ticketCost} 🎫)`
                      : `ตั๋วไม่พอ (ขาดอีก ${ticketCost - warpTickets} ใบ)`}
                  </span>

                  {isFloor1 ? (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onSelectSector(sec, 0);
                      }}
                      className="py-1.5 px-3 rounded-xl text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white shadow cursor-pointer flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>เริ่มด่าน 1</span>
                    </button>
                  ) : isUnlocked ? (
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        sound.playClick();
                        onSelectSector(sec, ticketCost);
                      }}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        canAfford
                          ? 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white shadow cursor-pointer'
                          : 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'
                      }`}
                    >
                      <Ticket className="w-3 h-3" />
                      <span>วาร์ป ({ticketCost} 🎫)</span>
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <p className="text-xs text-slate-400 text-center pt-2">
          💡 หากแพ้ในระหว่างรอบ จะต้องเริ่มใหม่จากด่าน 1 เพื่อย้ำพื้นฐาน ยกเว้นจะใช้ตั๋ววาร์ป 🎫 เพื่อข้ามไปด่านสูงๆ
        </p>
      </div>
    </div>
  );
};
