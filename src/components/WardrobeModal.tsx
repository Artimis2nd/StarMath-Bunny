import React, { useState } from 'react';
import { X, Sparkles, Check, Lock, Heart, Clock, Wand2, Shield } from 'lucide-react';
import { Costume, Pilot, PlayerStats } from '../types/game';
import { COSTUMES, PILOTS } from '../utils/mathEngine';
import { sound } from '../utils/audio';

interface WardrobeModalProps {
  stats: PlayerStats;
  currentPilot: Pilot;
  onEquipCostume: (pilotId: string, costumeId: string) => void;
  onSelectPilot: (pilot: Pilot) => void;
  onClose: () => void;
}

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  stats,
  currentPilot,
  onEquipCostume,
  onSelectPilot,
  onClose,
}) => {
  const [activePilotTab, setActivePilotTab] = useState<'bunny' | 'kitten' | 'puppy'>(currentPilot.id);

  const selectedPilotObj = PILOTS.find((p) => p.id === activePilotTab) || PILOTS[0];
  const pilotCostumes = COSTUMES.filter((c) => c.pilotId === activePilotTab);
  const activeCostumeId = stats.activeCostumes[activePilotTab] || `${activePilotTab}_classic`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-md select-none overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-pink-500/30 rounded-3xl p-4 sm:p-7 shadow-2xl max-h-[92dvh] overflow-y-auto my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center shadow-lg text-white font-bold">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                ตู้เสื้อผ้า & สกินพลังพิเศษ (15 ชุด)
              </h2>
              <p className="text-xs sm:text-sm text-pink-300">
                แต่ละชุดมีเลือด เวลา และสกิลตัดช้อยส์เฉพาะตัว!
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

        {/* Mascot Selector Tabs (Bunny, Kitten, Puppy) */}
        <div className="flex gap-2 my-4">
          {PILOTS.map((p) => {
            const isTab = p.id === activePilotTab;
            return (
              <button
                key={p.id}
                onClick={() => {
                  sound.playClick();
                  setActivePilotTab(p.id);
                  onSelectPilot(p);
                }}
                className={`flex-1 py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  isTab
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-white text-white shadow-lg'
                    : 'bg-slate-800 text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                <img
                  src={p.avatarUrl}
                  alt={p.name}
                  className="w-6 h-6 rounded-full object-cover border border-white/30"
                />
                <span className="text-xs sm:text-sm font-bold">
                  {p.thaiName} (5 ชุด)
                </span>
              </button>
            );
          })}
        </div>

        {/* Currently Equipped Full-Body Showcase */}
        {(() => {
          const equippedCostume = pilotCostumes.find((c) => c.id === activeCostumeId) || pilotCostumes[0];
          return (
            <div className="bg-gradient-to-r from-purple-950/60 via-slate-850 to-pink-950/60 border border-yellow-400/40 rounded-3xl p-3.5 sm:p-4 my-3 flex items-center gap-4 sm:gap-6 shadow-xl relative overflow-hidden">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.4)] shrink-0 bg-slate-900">
                <img
                  src={equippedCostume.imageUrl}
                  alt={equippedCostume.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 bg-yellow-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow">
                  <Check className="w-3 h-3" /> สวมใส่อยู่
                </div>
              </div>

              <div className="flex-1 text-left">
                <div className="inline-flex items-center gap-1 bg-yellow-400/20 text-yellow-300 text-[11px] font-black px-2 py-0.5 rounded-full mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>ภาพตัวละครเต็มตัว 2D สไตล์ญี่ปุ่น</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {selectedPilotObj.thaiName} · {equippedCostume.name}
                </h3>
                <p className="text-xs text-purple-200 font-semibold mb-2">
                  {equippedCostume.title} ⚡ ท่าโจมตี: {equippedCostume.attackName} {equippedCostume.attackEmoji}
                </p>

                <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
                  <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-lg flex items-center gap-1 border border-rose-500/20">
                    <Heart className="w-3 h-3 fill-rose-400" /> เลือด {equippedCostume.bonusHp} ดวง
                  </span>
                  <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-lg flex items-center gap-1 border border-amber-500/20">
                    <Clock className="w-3 h-3" /> เวลา {equippedCostume.timeSeconds}s
                  </span>
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-lg flex items-center gap-1 border border-purple-500/20">
                    <Wand2 className="w-3 h-3" /> ตัดช้อยส์ {equippedCostume.cutAssistCharges} ครั้ง
                  </span>
                  {equippedCostume.shieldBonus > 0 && (
                    <span className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-lg flex items-center gap-1 border border-sky-500/20">
                      <Shield className="w-3 h-3 fill-sky-400" /> โล่ฟรี 1 ครั้ง
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Costumes Cards (5 Costumes for Selected Character) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3">
          {pilotCostumes.map((costume) => {
            const isUnlocked = stats.unlockedCostumes.includes(costume.id);
            const isEquipped = activeCostumeId === costume.id;

            return (
              <div
                key={costume.id}
                onClick={() => {
                  if (isUnlocked) {
                    sound.playStarCollect();
                    onEquipCostume(activePilotTab, costume.id);
                  }
                }}
                className={`p-3.5 sm:p-4 rounded-3xl border flex flex-col justify-between transition-all ${
                  !isUnlocked
                    ? 'bg-slate-950/50 border-white/5 opacity-60'
                    : isEquipped
                    ? 'bg-gradient-to-b from-purple-900/60 to-slate-900 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.25)] scale-[1.02] cursor-pointer'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-white/10 hover:border-pink-400/40 cursor-pointer shadow-md'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Full-Body Costume Art Thumbnail */}
                  <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden bg-slate-900 border-2 border-white/15 shrink-0 shadow-md">
                    <img
                      src={costume.imageUrl}
                      alt={costume.name}
                      className={`w-full h-full object-cover transition-all ${
                        !isUnlocked ? 'filter grayscale brightness-50' : ''
                      }`}
                    />
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center text-slate-400">
                        <Lock className="w-5 h-5 text-amber-400 mb-0.5" />
                        <span className="text-[9px] font-bold text-amber-300">ล็อค</span>
                      </div>
                    )}
                    {/* Badge Emoji */}
                    <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-slate-900/90 border border-white/20 flex items-center justify-center text-xs shadow">
                      {costume.emoji}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm sm:text-base font-black text-white leading-tight">
                        {costume.name}
                      </h4>
                      {isEquipped && (
                        <span className="text-[10px] font-black text-yellow-300 bg-yellow-500/20 px-2 py-0.5 rounded-full border border-yellow-400/30 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> กำลังใส่
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-purple-300 font-semibold block mt-0.5">
                      {costume.title}
                    </span>

                    {/* Costume Perks & Stats */}
                    <div className="flex flex-wrap gap-1 mt-2 text-[10px] sm:text-[11px] font-bold">
                      <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-rose-500/20">
                        <Heart className="w-3 h-3 fill-rose-400" /> {costume.bonusHp}
                      </span>
                      <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-amber-500/20">
                        <Clock className="w-3 h-3" /> {costume.timeSeconds}s
                      </span>
                      <span className="bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-purple-500/20">
                        <Wand2 className="w-3 h-3" /> ตัดช้อยส์ {costume.cutAssistCharges}
                      </span>
                      {costume.shieldBonus > 0 && (
                        <span className="bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-sky-500/20">
                          <Shield className="w-3 h-3 fill-sky-400" /> โล่ {costume.shieldBonus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Attack Action VFX Info */}
                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    <span>ท่าโจมตี:</span>
                    <span className="font-bold text-white">{costume.attackName}</span>
                    <span>{costume.attackEmoji}</span>
                  </span>

                  {!isUnlocked ? (
                    <span className="text-[10px] text-yellow-300 font-bold bg-yellow-500/10 px-2 py-0.5 rounded-lg border border-yellow-500/20">
                      {costume.unlockCondition}
                    </span>
                  ) : !isEquipped ? (
                    <span className="text-pink-400 font-bold text-xs hover:underline flex items-center gap-1">
                      แตะเพื่อสวมใส่ ✨
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
