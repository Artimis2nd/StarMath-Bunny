import React from 'react';
import { Costume, EffectiveDisplayMode, MathProblem, Pilot, SectorConfig } from '../types/game';
import { Sparkles, Wand2, Shield, Heart, Clock } from 'lucide-react';

interface BattleArenaProps {
  pilot: Pilot;
  costume: Costume;
  sector: SectorConfig;
  problem: MathProblem;
  selectedAnswer: number | null;
  isCorrect: boolean | null;
  onSelectOption: (val: number, idx: number) => void;
  disabled: boolean;
  cutAssistUsedOnCurrent: boolean;
  cutAssistRemaining: number;
  onUseCutAssist: () => void;
  // Animation triggers
  playerAttacking: boolean;
  enemyAttacking: boolean;
  enemyHit: boolean;
  playerHit: boolean;
  // Stats
  currentHp: number;
  maxHp: number;
  timeRemaining: number;
  maxTime: number;
  solvedCount: number;
  targetQuota: number;
  currentShields: number;
  // Display Mode
  displayMode?: EffectiveDisplayMode;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  pilot,
  costume,
  sector,
  problem,
  selectedAnswer,
  isCorrect,
  onSelectOption,
  disabled,
  cutAssistUsedOnCurrent,
  cutAssistRemaining,
  onUseCutAssist,
  playerAttacking,
  enemyAttacking,
  enemyHit,
  playerHit,
  currentHp,
  maxHp,
  timeRemaining,
  maxTime,
  solvedCount,
  targetQuota,
  currentShields,
  displayMode = 'MOBILE',
}) => {
  const isAnswered = selectedAnswer !== null;

  // Render HUD Hearts & Shields
  const renderHeartsAndShields = () => (
    <div className="flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-2xl border border-white/10 shadow-md">
      {Array.from({ length: maxHp }).map((_, i) => (
        <Heart
          key={i}
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${
            i < currentHp
              ? 'fill-rose-500 text-rose-500 scale-105 animate-pulse'
              : 'text-slate-700 opacity-40 scale-90'
          }`}
        />
      ))}
      {currentShields > 0 && (
        <div className="flex items-center gap-0.5 ml-1 pl-1.5 border-l border-white/10 text-sky-400 text-xs font-bold">
          <Shield className="w-3.5 h-3.5 fill-sky-400/30" />
          <span>x{currentShields}</span>
        </div>
      )}
    </div>
  );

  // Render Timer
  const renderTimer = () => (
    <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1 sm:py-1.5 rounded-2xl border border-white/10 shadow-md">
      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
      <span
        className={`text-base sm:text-lg font-black tabular-nums font-mono ${
          timeRemaining <= 15 ? 'text-rose-400 animate-ping' : 'text-amber-300'
        }`}
      >
        {timeRemaining}s
      </span>
    </div>
  );

  // Render Quota Progress
  const renderQuota = () => (
    <div className="flex items-center gap-1 bg-purple-950/80 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-2xl border border-purple-400/40 text-purple-200 font-extrabold text-xs sm:text-sm tabular-nums">
      <span>⭐ {solvedCount}/{targetQuota}</span>
    </div>
  );

  // Render Timer Progress Line
  const renderProgressLine = () => (
    <div className="w-full h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden my-1">
      <div
        className={`h-full transition-all duration-1000 rounded-full ${
          timeRemaining > maxTime * 0.5
            ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
            : timeRemaining > maxTime * 0.25
            ? 'bg-amber-400'
            : 'bg-rose-500 animate-pulse'
        }`}
        style={{ width: `${(timeRemaining / maxTime) * 100}%` }}
      />
    </div>
  );

  // Render Battlefield Visual Stage
  const renderBattlefieldStage = (isLandscapePC: boolean) => (
    <div
      className={`relative w-full ${
        isLandscapePC ? 'h-64 sm:h-72' : 'h-32 sm:h-36'
      } bg-slate-900/75 rounded-2xl sm:rounded-3xl border border-white/10 p-2 sm:p-4 flex items-center justify-between overflow-hidden shadow-2xl relative my-0.5 sm:my-1`}
    >
      {/* Background cosmic glow & stars */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-950/40 via-transparent to-purple-950/40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(244,114,182,0.15),transparent_50%)] pointer-events-none" />

      {/* Full-Body Player Character Sprite (Left) */}
      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-300 ${
          playerAttacking
            ? 'translate-x-14 sm:translate-x-28 scale-110 rotate-6 filter drop-shadow-[0_0_25px_rgba(250,204,21,0.8)]'
            : playerHit
            ? '-translate-x-4 scale-90 rotate-[-12deg] brightness-50'
            : 'hover:scale-105'
        }`}
      >
        <div className="relative group">
          {/* Glowing Magic Circle Ring Frame */}
          <div
            className={`${
              isLandscapePC
                ? 'w-28 h-28 sm:w-36 sm:h-36'
                : 'w-20 h-20 sm:w-24 sm:h-24'
            } rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-yellow-400/80 shadow-[0_0_20px_rgba(250,204,21,0.35)] bg-slate-850 relative`}
          >
            <img
              src={costume.imageUrl}
              alt={costume.name}
              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
            />
            {/* Inner ambient shine */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-white/10 pointer-events-none" />
          </div>

          {/* Special Costume Attack Badge */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-900 border border-yellow-400 flex items-center justify-center text-xs shadow-md">
            {costume.emoji}
          </div>
        </div>

        {/* Character Name & Costume Title */}
        <div className="flex flex-col items-center mt-1">
          <span className="text-[10px] sm:text-xs font-black text-white leading-tight">
            {pilot.thaiName.split(' ')[0]} · {costume.name}
          </span>
          {isLandscapePC && (
            <span className="text-[9px] text-pink-300 font-bold">
              ท่า: {costume.attackName} {costume.attackEmoji}
            </span>
          )}
        </div>
      </div>

      {/* Center Clash Sparks Animation */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {playerAttacking && (
          <div className="text-xl sm:text-3xl animate-bounce filter drop-shadow-[0_0_15px_#F472B6]">
            {costume.attackEmoji} 💥
          </div>
        )}
        {enemyAttacking && (
          <div className="text-xl sm:text-3xl animate-ping filter drop-shadow-[0_0_15px_#EF4444]">
            ⚡ 💥
          </div>
        )}
        {!playerAttacking && !enemyAttacking && (
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-slate-950/80 border border-white/10 flex items-center justify-center text-xs text-yellow-300 shadow">
            ⚔️
          </div>
        )}
      </div>

      {/* Enemy Boss Monster (Right) */}
      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-300 ${
          enemyAttacking
            ? '-translate-x-14 sm:-translate-x-28 scale-110 rotate-[-6deg]'
            : enemyHit
            ? 'translate-x-6 scale-90 rotate-12 brightness-150 filter drop-shadow-[0_0_20px_rgba(244,63,94,0.8)]'
            : ''
        }`}
      >
        <div
          className={`${
            isLandscapePC
              ? 'w-24 h-24 sm:w-32 sm:h-32 text-5xl sm:text-6xl'
              : 'w-18 h-18 sm:w-20 sm:h-20 text-4xl sm:text-5xl'
          } rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-purple-800 via-pink-700 to-indigo-900 border-2 border-pink-400/60 flex items-center justify-center shadow-2xl relative`}
        >
          <span className="filter drop-shadow-lg animate-pulse">{sector.bossEmoji}</span>
          <div className="absolute inset-0 bg-radial from-transparent to-purple-950/40 pointer-events-none rounded-2xl sm:rounded-3xl" />
        </div>
        <div className="flex items-center gap-1 mt-1 bg-slate-950/70 px-2 py-0.5 rounded-full border border-pink-500/20">
          <span className="text-[10px] sm:text-xs font-black text-purple-200">
            {sector.bossName}
          </span>
        </div>
      </div>
    </div>
  );

  // Render Central Equation Card
  const renderEquationCard = (isLandscapePC: boolean) => (
    <div
      className={`w-full rounded-2xl sm:rounded-3xl ${
        isLandscapePC ? 'p-3.5 sm:p-5' : 'py-2 px-3 sm:py-3'
      } shadow-2xl transition-all duration-150 border-3 sm:border-4 my-0.5 sm:my-1 ${
        isAnswered && isCorrect
          ? 'bg-emerald-50 border-emerald-400 scale-[1.01] ring-4 ring-emerald-300/50'
          : isAnswered && !isCorrect
          ? 'bg-rose-50 border-rose-400'
          : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center justify-center gap-2 sm:gap-4 font-black tracking-wide tabular-nums">
        <span
          className={`${
            isLandscapePC ? 'text-5xl sm:text-6xl' : 'text-3xl sm:text-5xl'
          } text-slate-900`}
        >
          {problem.num1}
        </span>
        <span
          className={`${
            isLandscapePC ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-4xl'
          } text-pink-500 font-bold px-0.5`}
        >
          +
        </span>
        <span
          className={`${
            isLandscapePC ? 'text-5xl sm:text-6xl' : 'text-3xl sm:text-5xl'
          } text-slate-900`}
        >
          {problem.num2}
        </span>
        <span
          className={`${
            isLandscapePC ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-4xl'
          } text-purple-600 font-bold px-0.5`}
        >
          =
        </span>

        {/* Answer Bracket Box */}
        <div
          className={`${
            isLandscapePC
              ? 'min-w-[70px] sm:min-w-[85px] h-14 sm:h-18'
              : 'min-w-[50px] sm:min-w-[65px] h-11 sm:h-14'
          } rounded-xl sm:rounded-2xl flex items-center justify-center px-1.5 transition-all ${
            isAnswered && isCorrect
              ? 'bg-emerald-400 text-slate-950 scale-105 shadow-md'
              : isAnswered && !isCorrect
              ? 'bg-rose-100 text-rose-800'
              : 'bg-slate-100 border-2 border-dashed border-slate-300 text-slate-400'
          }`}
        >
          <span
            className={`${
              isLandscapePC ? 'text-4xl sm:text-6xl' : 'text-3xl sm:text-5xl'
            } font-black`}
          >
            {isAnswered ? selectedAnswer : '?'}
          </span>
        </div>
      </div>

      {/* Completed equation feedback */}
      {isAnswered && isCorrect && (
        <div className="mt-1 text-center text-[11px] sm:text-xs font-black text-emerald-600 animate-bounce">
          ⭐ {problem.num1} + {problem.num2} = {problem.answer} ยอดเยี่ยม! ⭐
        </div>
      )}
      {isAnswered && !isCorrect && (
        <div className="mt-1 text-center text-[11px] sm:text-xs font-black text-rose-600">
          คำตอบคือ {problem.num1} + {problem.num2} = {problem.answer} จ้า
        </div>
      )}
    </div>
  );

  // Render 3 Answer Choice Buttons
  const renderChoices = (isLandscapePC: boolean) => (
    <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 my-0.5 sm:my-1">
      {problem.options.map((optionVal, idx) => {
        const isThisSelected = selectedAnswer === optionVal;
        const isThisCorrect = optionVal === problem.answer;
        const isEliminatedBySkill = cutAssistUsedOnCurrent && !isThisCorrect;

        let btnColor = 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300 active:scale-95';

        if (isEliminatedBySkill) {
          btnColor =
            'bg-slate-100/30 text-transparent border-dashed border-slate-200 opacity-20 pointer-events-none scale-90';
        } else if (isAnswered) {
          if (isThisCorrect) {
            btnColor = 'bg-emerald-400 text-slate-950 border-emerald-500 scale-105 shadow-xl';
          } else if (isThisSelected && !isThisCorrect) {
            btnColor = 'bg-rose-200 text-rose-950 border-rose-400 opacity-60';
          } else {
            btnColor = 'bg-slate-100 text-slate-400 border-slate-200 opacity-40';
          }
        }

        return (
          <button
            key={idx}
            disabled={disabled || isEliminatedBySkill}
            onClick={() => {
              if (!disabled && !isEliminatedBySkill) {
                onSelectOption(optionVal, idx);
              }
            }}
            className={`${
              isLandscapePC ? 'h-20 sm:h-24' : 'h-14 sm:h-18'
            } rounded-2xl sm:rounded-3xl border-3 sm:border-4 transition-all duration-150 flex flex-col items-center justify-center cursor-pointer shadow-lg ${btnColor}`}
            aria-label={`ตัวเลือก ${optionVal}`}
          >
            {!isEliminatedBySkill && (
              <span
                className={`${
                  isLandscapePC ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'
                } font-black tabular-nums tracking-tight`}
              >
                {optionVal}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  // Render Cut Assist Skill Button
  const renderSkillButton = () => (
    <div className="w-full mt-0.5 flex justify-center">
      <button
        disabled={disabled || cutAssistRemaining <= 0 || cutAssistUsedOnCurrent || isAnswered}
        onClick={onUseCutAssist}
        className={`py-1.5 px-3 sm:py-2 sm:px-4 rounded-xl sm:rounded-2xl flex items-center gap-1.5 font-bold text-[11px] sm:text-xs transition-all shadow-md ${
          cutAssistRemaining > 0 && !cutAssistUsedOnCurrent && !isAnswered
            ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 cursor-pointer animate-pulse'
            : 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'
        }`}
      >
        <Wand2 className="w-3.5 h-3.5" />
        <span>
          {cutAssistRemaining > 0
            ? `สกิลชุด [${costume.name}]: ตัดช้อยส์ผิด (เหลือ ${cutAssistRemaining} ครั้ง)`
            : 'สกิลตัดช้อยส์ถูกใช้หมดแล้วในรอบนี้'}
        </span>
      </button>
    </div>
  );

  // -------------------------------------------------------------
  // LAYOUT 1: PC LANDSCAPE MODE (Two-Column Spacious View)
  // -------------------------------------------------------------
  if (displayMode === 'PC') {
    return (
      <div className="w-full max-w-5xl mx-auto flex flex-col justify-between h-full select-none p-1 sm:p-2">
        {/* Top Header Status Bar */}
        <div className="flex items-center justify-between gap-2 px-1 mb-1">
          {renderHeartsAndShields()}
          {renderTimer()}
          {renderQuota()}
        </div>

        {renderProgressLine()}

        {/* 2-Column Split: Left = Battlefield Arena / Right = Math Problem & Choices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-auto items-center">
          {/* Left: Battlefield & Visual Clashes */}
          <div className="flex flex-col gap-2">
            {renderBattlefieldStage(true)}
          </div>

          {/* Right: Central Equation + 3 Choices + Assist Button */}
          <div className="flex flex-col justify-center gap-2">
            {renderEquationCard(true)}
            {renderChoices(true)}
            {renderSkillButton()}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LAYOUT 2: MOBILE PORTRAIT MODE (100dvh No-Scroll Compact View)
  // -------------------------------------------------------------
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col justify-between h-full select-none py-0.5 px-1 overflow-hidden">
      {/* 1. Top HUD Bar */}
      <div className="flex items-center justify-between gap-1.5 px-1">
        {renderHeartsAndShields()}
        {renderTimer()}
        {renderQuota()}
      </div>

      {/* 2. Timer Progress Line */}
      {renderProgressLine()}

      {/* 3. Battlefield Visual Arena (Compact 100dvh fitted) */}
      {renderBattlefieldStage(false)}

      {/* 4. Central Equation Card */}
      {renderEquationCard(false)}

      {/* 5. Three Answer Choice Cards */}
      {renderChoices(false)}

      {/* 6. Special Costume Assist Skill Button */}
      {renderSkillButton()}
    </div>
  );
};
