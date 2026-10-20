import React from 'react';
import { Play, Sparkles, Volume2, VolumeX, Shirt, Ticket, Wand2, Heart, Clock, Shield, Flame, Trophy } from 'lucide-react';
import { Costume, DifficultyMode, EffectiveDisplayMode, Pilot, PlayerStats } from '../types/game';
import { COSTUMES, DIFFICULTY_CONFIGS, PILOTS, PILOT_AVATARS } from '../utils/mathEngine';
import { sound } from '../utils/audio';

interface MainMenuProps {
  selectedPilot: Pilot;
  currentCostume: Costume;
  stats: PlayerStats;
  difficultyMode: DifficultyMode;
  isMuted: boolean;
  onSelectPilot: (pilot: Pilot) => void;
  onChangeDifficulty: (mode: DifficultyMode) => void;
  onStartFloor1: () => void;
  onOpenWarp: () => void;
  onOpenGacha: () => void;
  onOpenWardrobe: () => void;
  onOpenLeaderboard: () => void;
  onToggleMute: () => void;
  displayMode?: EffectiveDisplayMode;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  selectedPilot,
  currentCostume,
  stats,
  difficultyMode,
  isMuted,
  onSelectPilot,
  onChangeDifficulty,
  onStartFloor1,
  onOpenWarp,
  onOpenGacha,
  onOpenWardrobe,
  onOpenLeaderboard,
  onToggleMute,
  displayMode = 'MOBILE',
}) => {
  const isPC = displayMode === 'PC';

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full flex flex-col justify-between p-2.5 sm:p-5 overflow-y-auto sm:overflow-hidden select-none bg-slate-950 text-white">
      {/* Background with soft nebula overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen pointer-events-none"
        style={{ backgroundImage: `url(${PILOT_AVATARS.nebulaBg})` }}
      />
      <div className="absolute inset-0 bg-radial from-transparent via-slate-950/70 to-slate-950 pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 flex items-center justify-between gap-2 max-w-5xl mx-auto w-full shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
          </div>
          <div>
            <h1 className="text-base sm:text-2xl font-black tracking-tight text-white leading-none">
              StarMath Roguelite
            </h1>
            <span className="text-[10px] sm:text-xs text-pink-300 font-bold tracking-wide">
              {isPC ? '💻 โหมด PC แนวนอน' : '📱 โหมดมือถือแนวตั้ง (100dvh)'}
            </span>
          </div>
        </div>

        {/* Currency & Quick Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Warp Tickets Counter */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenWarp();
            }}
            className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-sky-950/80 hover:bg-sky-900/80 text-[11px] sm:text-xs font-bold text-sky-300 border border-sky-400/30 shadow transition-colors cursor-pointer"
            title="ตั๋ววาร์ปข้ามด่าน"
          >
            <Ticket className="w-3.5 h-3.5 text-sky-400" />
            <span className="tabular-nums font-black">{stats.warpTickets}</span>
            <span className="hidden sm:inline">ตั๋ววาร์ป</span>
          </button>

          {/* Gacha Coins Counter */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenGacha();
            }}
            className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900/80 text-[11px] sm:text-xs font-bold text-amber-300 border border-amber-400/30 shadow transition-colors cursor-pointer"
            title="เหรียญหมุนตู้กาชาปอง"
          >
            <span className="text-xs sm:text-sm">🟡</span>
            <span className="tabular-nums font-black">{stats.gachaCoins}</span>
            <span className="hidden sm:inline">กาชา</span>
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenLeaderboard();
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 text-yellow-300 flex items-center justify-center border border-purple-400/30 transition-colors cursor-pointer"
            title="ตารางคะแนนผู้กล้า"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
            title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Main Content Area: Responsive 2-Col for PC Landscape, 1-Col Compact for Mobile Portrait */}
      <main
        className={`relative z-10 flex-1 flex my-auto items-center justify-center ${
          isPC ? 'max-w-5xl grid grid-cols-2 gap-6' : 'max-w-md flex-col text-center'
        } mx-auto w-full`}
      >
        {/* ================= LEFT COLUMN / UPPER BLOCK: Character Showcase ================= */}
        <div className="flex flex-col items-center justify-center w-full">
          {/* Full-Body Mascot Character Showcase */}
          <div className="relative my-1 sm:my-2 group">
            {/* Ambient Cosmic Aura */}
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/25 via-yellow-400/20 to-purple-500/25 rounded-[2rem] sm:rounded-[2.5rem] blur-xl transform group-hover:scale-110 transition-transform duration-500" />

            {/* Full-Body Character Card with Magical Ring Frame */}
            <div
              className={`relative ${
                isPC ? 'w-52 h-52 sm:w-60 sm:h-60' : 'w-36 h-36 sm:w-44 sm:h-44'
              } rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border-3 sm:border-4 border-yellow-400/80 shadow-[0_0_35px_rgba(250,204,21,0.35)] bg-slate-900/90 transition-transform duration-300 group-hover:scale-105`}
            >
              <img
                src={currentCostume.imageUrl}
                alt={currentCostume.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-white/10 pointer-events-none" />

              {/* Quick Wardrobe Tap Overlay */}
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenWardrobe();
                }}
                className="absolute bottom-2 inset-x-2.5 py-1 px-2 rounded-xl bg-slate-950/85 hover:bg-slate-900 text-[10px] sm:text-xs font-black text-pink-300 hover:text-white border border-pink-400/40 flex items-center justify-center gap-1 backdrop-blur-sm shadow transition-all cursor-pointer"
              >
                <Shirt className="w-3 h-3 text-pink-400" />
                <span>แตะเปลี่ยนชุดสกิน (15 ชุด)</span>
              </button>
            </div>

            {/* Equipped Costume Emoji Badge */}
            <div className="absolute -top-2 -right-2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-900 border-2 border-yellow-300 flex items-center justify-center text-lg sm:text-2xl shadow-xl animate-bounce">
              {currentCostume.emoji}
            </div>
          </div>

          {/* Costume Name & Title */}
          <div className="flex flex-col items-center mb-1 sm:mb-2 text-center">
            <h2 className="text-base sm:text-xl font-black text-white">
              {selectedPilot.thaiName} · {currentCostume.name}
            </h2>
            <span className="text-[11px] sm:text-xs text-purple-300 font-bold">
              {currentCostume.title} ⚡ ท่า: {currentCostume.attackName} {currentCostume.attackEmoji}
            </span>
          </div>

          {/* Costume Stats Strip */}
          <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5 mb-2 text-[10px] sm:text-xs font-bold">
            <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-lg flex items-center gap-1 border border-rose-500/20 shadow">
              <Heart className="w-3 h-3 fill-rose-400" /> เลือด {currentCostume.bonusHp} ดวง
            </span>
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-lg flex items-center gap-1 border border-amber-500/20 shadow">
              <Clock className="w-3 h-3" /> เวลา {currentCostume.timeSeconds}s
            </span>
            <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-lg flex items-center gap-1 border border-purple-500/20 shadow">
              <Wand2 className="w-3 h-3" /> ตัดช้อยส์ {currentCostume.cutAssistCharges} ครั้ง
            </span>
            {currentCostume.shieldBonus > 0 && (
              <span className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-lg flex items-center gap-1 border border-sky-500/20 shadow">
                <Shield className="w-3 h-3 fill-sky-400" /> โล่ฟรี 1 ครั้ง
              </span>
            )}
          </div>

          {/* Character Switcher Tabs */}
          <div className="flex gap-1.5 mb-2 sm:mb-3">
            {PILOTS.map((p) => {
              const isSelected = p.id === selectedPilot.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    sound.playStarCollect();
                    onSelectPilot(p);
                  }}
                  className={`px-2.5 py-1 rounded-xl flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-white text-white shadow-md scale-105'
                      : 'bg-slate-900/80 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span className="text-[11px] sm:text-xs font-bold">
                    {p.thaiName.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT COLUMN / LOWER BLOCK: Game Controls & Difficulty ================= */}
        <div className="flex flex-col items-center justify-center w-full max-w-sm">
          {/* Difficulty Mode Selector */}
          <div className="w-full bg-slate-900/90 border border-white/10 rounded-2xl p-2 mb-2 sm:mb-3 shadow-lg">
            <div className="flex items-center justify-between mb-1 px-1 text-[11px] font-bold text-slate-300">
              <span>เลือกระดับความยาก:</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md ${DIFFICULTY_CONFIGS[difficultyMode].badgeBg} ${DIFFICULTY_CONFIGS[difficultyMode].badgeBorder}`}
              >
                {difficultyMode === 'HARD' ? '🔥 สุ่มกล่อง x2' : 'สุ่มกล่อง x1'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {(['EASY', 'NORMAL', 'HARD'] as DifficultyMode[]).map((mode) => {
                const cfg = DIFFICULTY_CONFIGS[mode];
                const isActive = difficultyMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => {
                      sound.playClick();
                      onChangeDifficulty(mode);
                    }}
                    className={`py-1.5 px-1 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isActive
                        ? mode === 'EASY'
                          ? 'bg-emerald-500 text-slate-950 shadow-md scale-102 ring-2 ring-emerald-300'
                          : mode === 'NORMAL'
                          ? 'bg-sky-500 text-slate-950 shadow-md scale-102 ring-2 ring-sky-300'
                          : 'bg-rose-500 text-white shadow-md scale-102 ring-2 ring-rose-300'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {mode === 'HARD' && <Flame className="w-3 h-3 fill-white" />}
                      <span>{cfg.thaiName}</span>
                    </span>
                    <span className="text-[10px] opacity-90 mt-0.5 font-bold">
                      {cfg.baseSeconds}s {mode === 'HARD' ? '🎁x2' : '🎁x1'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="w-full flex flex-col gap-2">
            {/* 1. Start Roguelite from Floor 1 */}
            <button
              onClick={() => {
                sound.playClick();
                onStartFloor1();
              }}
              className="w-full py-3.5 sm:py-4 px-4 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-base sm:text-lg font-black rounded-2xl sm:rounded-3xl shadow-xl shadow-pink-500/30 flex items-center justify-center gap-2 transition-all transform hover:scale-102 active:scale-98 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>เริ่มเล่นด่าน 1 (+1) [ฟรี]</span>
            </button>

            {/* 2. Secondary Action Row */}
            <div className="flex gap-1.5 sm:gap-2 w-full">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenWarp();
                }}
                className="flex-1 py-2 sm:py-2.5 px-2 bg-slate-900/90 hover:bg-slate-800 text-sky-300 font-bold text-[11px] sm:text-xs rounded-xl sm:rounded-2xl border border-sky-400/30 flex items-center justify-center gap-1 shadow transition-all cursor-pointer"
              >
                <Ticket className="w-3.5 h-3.5 text-sky-400" />
                <span>วาร์ปข้ามด่าน</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenGacha();
                }}
                className="flex-1 py-2 sm:py-2.5 px-2 bg-slate-900/90 hover:bg-slate-800 text-amber-300 font-bold text-[11px] sm:text-xs rounded-xl sm:rounded-2xl border border-amber-400/30 flex items-center justify-center gap-1 shadow transition-all cursor-pointer"
              >
                <span>🎰 หมุนกาชา</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenWardrobe();
                }}
                className="flex-1 py-2 sm:py-2.5 px-2 bg-slate-900/90 hover:bg-slate-800 text-pink-300 font-bold text-[11px] sm:text-xs rounded-xl sm:rounded-2xl border border-pink-400/30 flex items-center justify-center gap-1 shadow transition-all cursor-pointer"
              >
                <Shirt className="w-3.5 h-3.5 text-pink-400" />
                <span>ตู้เสื้อผ้า</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 text-center py-1 text-[10px] sm:text-xs text-slate-500 flex flex-wrap justify-center items-center gap-2 shrink-0">
        <span>⚔️ อนิเมชันตัวละครชุดจริง</span>
        <span>·</span>
        <span>🪄 สกิลตัดช้อยส์ผิด</span>
        <span>·</span>
        <span>📱 รองรับมือถือแนวตั้ง 100dvh & 💻 PC แนวนอน</span>
      </footer>
    </div>
  );
};
