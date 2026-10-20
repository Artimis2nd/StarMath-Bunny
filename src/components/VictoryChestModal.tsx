import React, { useState } from 'react';
import { Costume, SectorConfig, StageRewardItem } from '../types/game';
import { rollVictoryChestReward } from '../utils/mathEngine';
import { sound } from '../utils/audio';
import { Sparkles, Heart, Clock, Wand2, Ticket, ArrowRight, Gift, Check, Shield } from 'lucide-react';

interface VictoryChestModalProps {
  unlockedCostumes: string[];
  currentHp: number;
  maxHp: number;
  cutAssistRemaining: number;
  maxCutAssist: number;
  totalRolls: number;
  currentSector: SectorConfig;
  nextSector: SectorConfig | null;
  onApplyReward: (reward: StageRewardItem) => void;
  onProceedNextStage: () => void;
}

export const VictoryChestModal: React.FC<VictoryChestModalProps> = ({
  unlockedCostumes,
  currentHp,
  maxHp,
  cutAssistRemaining,
  maxCutAssist,
  totalRolls,
  currentSector,
  nextSector,
  onApplyReward,
  onProceedNextStage,
}) => {
  const [rollsCompleted, setRollsCompleted] = useState<number>(0);
  const [phase, setPhase] = useState<'READY_TO_OPEN' | 'OPENING' | 'REVEAL'>('READY_TO_OPEN');
  const [currentReward, setCurrentReward] = useState<StageRewardItem | null>(null);
  const [rewardHistory, setRewardHistory] = useState<StageRewardItem[]>([]);

  const rollsRemaining = totalRolls - rollsCompleted;

  const handleOpenChest = () => {
    if (phase === 'OPENING' || rollsRemaining <= 0) return;

    sound.playMegaLaserCharge();
    setPhase('OPENING');

    setTimeout(() => {
      sound.playPresentOpen();
      const reward = rollVictoryChestReward(
        unlockedCostumes,
        currentHp,
        maxHp,
        cutAssistRemaining,
        maxCutAssist
      );
      setCurrentReward(reward);
      setRewardHistory((prev) => [...prev, reward]);
      setRollsCompleted((prev) => prev + 1);
      onApplyReward(reward);
      setPhase('REVEAL');
    }, 1200);
  };

  const handleNextRoll = () => {
    sound.playClick();
    setPhase('READY_TO_OPEN');
    setCurrentReward(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/90 backdrop-blur-md select-none overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[92dvh] overflow-y-auto bg-gradient-to-b from-slate-900 via-purple-950/90 to-slate-900 border-2 border-yellow-400/50 rounded-3xl p-4 sm:p-7 text-center flex flex-col items-center shadow-2xl animate-fade-in my-auto">
        {/* Glow ambient background */}
        <div className="absolute inset-0 bg-radial from-yellow-400/10 via-transparent to-transparent pointer-events-none rounded-3xl" />

        {/* Header */}
        <div className="relative z-10 w-full flex items-center justify-between pb-2.5 border-b border-white/10 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">🏆</span>
            <div className="text-left">
              <h3 className="text-sm sm:text-lg font-black text-white leading-tight">
                พิชิต {currentSector.bossName} สำเร็จ!
              </h3>
              <p className="text-[11px] sm:text-xs text-yellow-300 font-bold">
                {currentSector.thaiName}
              </p>
            </div>
          </div>

          <div className="bg-yellow-500/20 px-2.5 py-1 rounded-full border border-yellow-400/40 text-yellow-300 font-extrabold text-[11px] sm:text-xs">
            เปิดกล่อง: {rollsRemaining}/{totalRolls}
          </div>
        </div>

        {/* 1. READY TO OPEN CHEST */}
        {phase === 'READY_TO_OPEN' && (
          <div className="relative z-10 flex flex-col items-center my-2 w-full">
            {/* Cosmic Treasure Chest Bounce Visual */}
            <div
              onClick={handleOpenChest}
              className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 border-3 sm:border-4 border-yellow-200 flex flex-col items-center justify-center text-5xl sm:text-7xl shadow-[0_0_40px_rgba(250,204,21,0.5)] cursor-pointer hover:scale-105 active:scale-95 transition-all group animate-bounce my-2"
            >
              <div className="absolute -top-2.5 px-2.5 py-0.5 rounded-full bg-slate-950 border border-yellow-400 text-[9px] sm:text-[10px] font-black text-yellow-300 shadow">
                แตะเพื่อเปิด!
              </div>
              <span>📦</span>
              <div className="absolute inset-x-0 bottom-1.5 text-center text-[10px] sm:text-[11px] font-black text-slate-950 bg-yellow-300/80 mx-2 sm:mx-3 rounded-lg py-0.5 shadow">
                กล่องสมบัติอวกาศ
              </div>
            </div>

            <p className="text-xs sm:text-sm text-purple-200 font-medium mt-1 mb-3">
              {totalRolls > 1 && rollsCompleted === 0
                ? 'โหมดยาก: ได้สิทธิ์สุ่ม 2 ครั้ง! แตะกล่องเพื่อสุ่มรางวัล'
                : 'สุ่มรับฟื้นเลือด, เติมสกิลตัดช้อยส์, เพิ่มเวลา หรือสกิน!'}
            </p>

            <button
              onClick={handleOpenChest}
              className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-yellow-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102 active:scale-98"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>เปิดกล่องสมบัติ! (รอบที่ {rollsCompleted + 1}/{totalRolls})</span>
            </button>
          </div>
        )}

        {/* 2. OPENING ANIMATION */}
        {phase === 'OPENING' && (
          <div className="relative z-10 flex flex-col items-center my-8">
            <div className="text-7xl sm:text-8xl animate-spin">
              ✨
            </div>
            <div className="text-xl sm:text-2xl font-black text-yellow-300 mt-4 animate-pulse">
              กล่องสมบัติกำลังเปิดออก... 🎁
            </div>
            <span className="text-xs text-purple-300 mt-1">
              กำลังสุ่มไอเทมช่วยชีวิตสำหรับด่านถัดไป!
            </span>
          </div>
        )}

        {/* 3. REVEAL ITEM VIEW */}
        {phase === 'REVEAL' && currentReward && (
          <div className="relative z-10 flex flex-col items-center my-1 w-full animate-fade-in">
            <div className="inline-flex items-center gap-1.5 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 px-3 py-1 rounded-full text-xs font-black mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ยินดีด้วย! ได้รับของรางวัล</span>
            </div>

            {/* A. REWARD IMAGE / VISUAL PRESENTATION */}
            {/* If Costume (New or Duplicate converted to HP) */}
            {currentReward.costume ? (
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-[0_0_35px_rgba(250,204,21,0.5)] my-1 bg-slate-900 group">
                <img
                  src={currentReward.costume.imageUrl}
                  alt={currentReward.costume.name}
                  className="w-full h-full object-cover animate-pulse"
                />
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-900/90 border border-yellow-400 flex items-center justify-center text-sm shadow">
                  {currentReward.costume.emoji}
                </div>

                {/* If duplicate converted */}
                {currentReward.type === 'DUPLICATE_CONVERT_HP' && (
                  <div className="absolute inset-x-2 bottom-2 bg-rose-600/95 text-white font-black text-xs py-1 px-2 rounded-xl shadow border border-white/30 flex items-center justify-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>ชุดซ้ำ! แปลงเป็นเลือด +{currentReward.value} ดวง</span>
                  </div>
                )}
                {currentReward.type === 'NEW_COSTUME' && (
                  <div className="absolute inset-x-2 bottom-2 bg-emerald-600/95 text-white font-black text-xs py-1 px-2 rounded-xl shadow border border-white/30 flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>สกินใหม่ปลดล็อกแล้ว!</span>
                  </div>
                )}
              </div>
            ) : (
              /* Non-Costume Rewards (Heart, Time, Assist, Ticket) */
              <div
                className={`relative w-36 h-36 sm:w-40 sm:h-40 rounded-3xl flex flex-col items-center justify-center shadow-2xl my-2 border-4 ${
                  currentReward.type === 'HP_REFILL'
                    ? 'bg-rose-950/80 border-rose-400 shadow-rose-500/30'
                    : currentReward.type === 'TIME_BONUS'
                    ? 'bg-amber-950/80 border-amber-400 shadow-amber-500/30'
                    : currentReward.type === 'CUT_ASSIST'
                    ? 'bg-purple-950/80 border-purple-400 shadow-purple-500/30'
                    : 'bg-sky-950/80 border-sky-400 shadow-sky-500/30'
                }`}
              >
                <div className="text-5xl sm:text-6xl animate-bounce">
                  {currentReward.icon}
                </div>
                {currentReward.value && (
                  <span className="text-xl sm:text-2xl font-black text-white mt-1 drop-shadow">
                    +{currentReward.value}
                    {currentReward.type === 'TIME_BONUS' ? 's' : ''}
                  </span>
                )}
              </div>
            )}

            {/* Title & Description */}
            <h4 className="text-lg sm:text-xl font-black text-white mt-2">
              {currentReward.title}
            </h4>
            <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-sm px-2">
              {currentReward.description}
            </p>

            {/* Reward History Badge List if Hard Mode */}
            {rewardHistory.length > 1 && (
              <div className="w-full bg-slate-900/80 rounded-2xl p-2.5 my-3 border border-white/10 text-xs">
                <span className="text-slate-400 font-bold block mb-1">
                  ของรางวัลทั้งหมดที่ได้รับในด่านนี้ ({rewardHistory.length} ชิ้น):
                </span>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {rewardHistory.map((r, i) => (
                    <span
                      key={i}
                      className="bg-yellow-500/10 text-yellow-300 border border-yellow-400/20 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1"
                    >
                      <span>{r.icon}</span>
                      <span>{r.title.split(':')[0]}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2.5 mt-4">
              {rollsRemaining > 0 ? (
                <button
                  onClick={handleNextRoll}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102 active:scale-98"
                >
                  <Gift className="w-5 h-5 text-slate-950" />
                  <span>เปิดสิทธิ์สุ่มครั้งที่ 2! (เหลือ {rollsRemaining} สิทธิ์)</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    sound.playClick();
                    onProceedNextStage();
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-base shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102 active:scale-98"
                >
                  <span>ลุยต่อด่านถัดไป!</span>
                  <ArrowRight className="w-5 h-5" />
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-lg">
                    {nextSector ? nextSector.thaiName : 'จบเกมยอดฝีมือ'}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
