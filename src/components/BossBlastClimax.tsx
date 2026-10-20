import React, { useEffect, useState } from 'react';
import { Costume, Pilot, SectorConfig } from '../types/game';
import { sound } from '../utils/audio';
import { Sparkles, Gift } from 'lucide-react';

interface BossBlastClimaxProps {
  pilot: Pilot;
  costume: Costume;
  sector: SectorConfig;
  onFinished: () => void;
}

export const BossBlastClimax: React.FC<BossBlastClimaxProps> = ({
  pilot,
  costume,
  sector,
  onFinished,
}) => {
  const [phase, setPhase] = useState<'CHARGE' | 'BLAST' | 'EXPLODE' | 'VICTORY'>('CHARGE');

  useEffect(() => {
    // 1. Charge Phase (1.2s)
    sound.playMegaLaserCharge();

    const t1 = setTimeout(() => {
      // 2. Blast Phase (0.8s)
      setPhase('BLAST');
      sound.playMegaLaserFire();
    }, 1200);

    const t2 = setTimeout(() => {
      // 3. Explode Phase (1.2s)
      setPhase('EXPLODE');
      sound.playBossExplode();
    }, 2000);

    const t3 = setTimeout(() => {
      // 4. Victory / Ready for Gift
      setPhase('VICTORY');
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md select-none overflow-hidden">
      {/* Screen flash on blast */}
      {phase === 'BLAST' && (
        <div className="absolute inset-0 bg-white/40 pointer-events-none animate-pulse" />
      )}

      {/* Confetti particles during explosion */}
      {(phase === 'EXPLODE' || phase === 'VICTORY') && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="text-6xl animate-ping opacity-75">✨ 🌟 💖 🎉 🍡 ⭐</div>
        </div>
      )}

      <div className="relative w-full max-w-2xl flex flex-col items-center justify-center text-center max-h-[96dvh] my-auto">
        {/* Arena Stage */}
        <div className="relative w-full h-44 sm:h-64 flex items-center justify-between px-3 sm:px-10">
          {/* Player Full-Body Character Charging on Left */}
          <div className="relative z-20 flex flex-col items-center">
            <div
              className={`w-20 h-20 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl overflow-hidden border-3 sm:border-4 border-yellow-400 shadow-2xl transition-all duration-300 relative bg-slate-900 ${
                phase === 'CHARGE'
                  ? 'scale-110 shadow-[0_0_35px_rgba(250,204,21,0.9)] animate-pulse'
                  : 'scale-100'
              }`}
            >
              <img
                src={costume.imageUrl}
                alt={costume.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1 right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-900 border border-yellow-400 flex items-center justify-center text-xs sm:text-sm shadow">
                {costume.emoji}
              </div>
            </div>
            <div className="bg-slate-950/80 px-2 py-0.5 rounded-full border border-white/10 mt-1">
              <span className="text-[11px] sm:text-xs font-black text-white">
                {pilot.thaiName.split(' ')[0]} · {costume.name}
              </span>
            </div>
          </div>

          {/* Mega Laser Beam */}
          {phase === 'BLAST' && (
            <div className="absolute left-16 right-16 sm:left-24 sm:right-24 h-12 sm:h-20 bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300 rounded-full shadow-[0_0_50px_#F472B6] z-30 animate-pulse" />
          )}

          {/* Boss on Right */}
          <div className="relative z-20 flex flex-col items-center">
            <div
              className={`w-18 h-18 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl flex items-center justify-center text-4xl sm:text-6xl shadow-2xl transition-all duration-500 border-3 sm:border-4 ${
                phase === 'EXPLODE'
                  ? 'scale-140 rotate-45 brightness-200 border-white opacity-40'
                  : phase === 'VICTORY'
                  ? 'opacity-0 scale-50'
                  : 'bg-gradient-to-tr from-purple-800 to-pink-800 border-pink-400'
              }`}
            >
              {phase === 'VICTORY' ? '💥' : sector.bossEmoji}
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-purple-200 mt-1">
              {sector.bossName}
            </span>
          </div>
        </div>

        {/* Action Status Banner */}
        <div className="mt-4">
          {phase === 'CHARGE' && (
            <div className="text-xl sm:text-2xl font-black text-yellow-300 animate-pulse flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <span>ชาร์จพลังเลเซอร์ยักษ์! ⚡</span>
            </div>
          )}

          {phase === 'BLAST' && (
            <div className="text-2xl sm:text-4xl font-black text-pink-400 tracking-wider">
              ยิงถล่มบอส! 💥💥💥
            </div>
          )}

          {(phase === 'EXPLODE' || phase === 'VICTORY') && (
            <div className="flex flex-col items-center animate-bounce">
              <div className="text-2xl sm:text-4xl font-black text-yellow-300 mb-2">
                🎉 ปราบ {sector.bossName} สำเร็จ! 🎉
              </div>
              <p className="text-xs sm:text-sm text-purple-200 mb-5">
                น้องเก่งมาก! ตอบถูกครบใน 1 นาที ปลดล็อกชุดคอสตูมใหม่แล้ว!
              </p>

              <button
                onClick={() => {
                  sound.playClick();
                  onFinished();
                }}
                className="py-4 px-8 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 text-base sm:text-lg font-black rounded-2xl shadow-xl shadow-yellow-500/30 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Gift className="w-6 h-6 text-slate-950" />
                <span>เปิดกล่องของขวัญรับคอสตูม!</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
