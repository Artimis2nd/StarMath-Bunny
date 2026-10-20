import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Sliders, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import { bgm, BgmTrackName } from '../utils/bgm';

interface AudioControllerWidgetProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

const TRACK_LABELS: Record<BgmTrackName, string> = {
  MENU: '🚀 ธีมเมนูยานอวกาศ (128 BPM)',
  BATTLE: '⚔️ ธีมต่อสู้ดวงดาว (142 BPM)',
  BOSS_CLIMAX: '💥 ธีมไฮเปอร์เลเซอร์บอส (162 BPM)',
  VICTORY: '🏆 ธีมฉลองชัยชนะ (136 BPM)',
  GAME_OVER: '⭐ ธีมฮึดสู้ใหม่ (96 BPM)',
};

export const AudioControllerWidget: React.FC<AudioControllerWidgetProps> = ({
  isMuted,
  onToggleMute,
}) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [bgmMuted, setBgmMuted] = useState(() => bgm.getIsMuted());
  const [bgmVolume, setBgmVolume] = useState(() => Math.round(bgm.getVolume() * 100));
  const [currentTrack, setCurrentTrack] = useState<BgmTrackName | null>(() => bgm.getCurrentTrack());
  const [activeBeatStep, setActiveBeatStep] = useState(0);

  // Sync beat animation
  useEffect(() => {
    const handleBeat = (step: number, track: BgmTrackName) => {
      setActiveBeatStep(step);
      setCurrentTrack(track);
    };
    bgm.addBeatListener(handleBeat);
    return () => {
      bgm.removeBeatListener(handleBeat);
    };
  }, []);

  const handleToggleBgmOnly = () => {
    sound.playClick();
    const next = bgm.toggleMute();
    setBgmMuted(next);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setBgmVolume(val);
    bgm.setVolume(val / 100);
    if (bgmMuted && val > 0) {
      bgm.setMuted(false);
      setBgmMuted(false);
    }
  };

  const isBgmActive = !isMuted && !bgmMuted;

  return (
    <div className="relative z-50 select-none">
      {/* Quick Audio Control Button */}
      <button
        onClick={() => {
          sound.playClick();
          onToggleMute();
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsOpenMenu((prev) => !prev);
        }}
        className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border backdrop-blur-md shadow-lg transition-all text-xs font-black cursor-pointer group active:scale-95 ${
          isMuted
            ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border-rose-500/40'
            : isBgmActive
            ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-400/40 shadow-emerald-500/20'
            : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-white/10'
        }`}
        title="แตะเพื่อเปิด/ปิดเสียงทั้งหมด หรือกดปุ่มเฟืองเพื่อปรับ BGM"
      >
        {isMuted ? (
          <VolumeX className="w-3.5 h-3.5 text-rose-400" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        )}

        {/* 8-Bit Chiptune Visualizer Waves */}
        {isBgmActive ? (
          <div className="flex items-end gap-0.5 h-3.5 px-0.5">
            <span
              className={`w-0.5 rounded-full bg-emerald-400 transition-all duration-100 ${
                activeBeatStep % 4 === 0 ? 'h-3' : 'h-1.5'
              }`}
            />
            <span
              className={`w-0.5 rounded-full bg-teal-300 transition-all duration-100 ${
                activeBeatStep % 2 === 0 ? 'h-3.5' : 'h-2'
              }`}
            />
            <span
              className={`w-0.5 rounded-full bg-cyan-400 transition-all duration-100 ${
                activeBeatStep % 4 === 2 ? 'h-2.5' : 'h-1'
              }`}
            />
          </div>
        ) : (
          <span className="text-[10px] text-slate-400 font-bold">Mute</span>
        )}

        {/* Open settings mini button */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            sound.playClick();
            setIsOpenMenu((prev) => !prev);
          }}
          className="ml-0.5 p-0.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          title="ตั้งค่าเพลงประกอบ BGM"
        >
          <Sliders className="w-3 h-3 text-emerald-300" />
        </div>
      </button>

      {/* Audio & BGM Popover Settings */}
      {isOpenMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpenMenu(false)}
          />
          <div className="absolute right-0 mt-1.5 w-60 sm:w-64 bg-slate-900/95 border border-purple-400/40 rounded-2xl p-3 shadow-2xl backdrop-blur-md z-50 flex flex-col gap-2.5 text-xs text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <div className="flex items-center gap-1.5 font-black text-amber-300">
                <Music className="w-4 h-4 text-pink-400" />
                <span>ดนตรี 8-Bit BGM & เสียง</span>
              </div>
              <button
                onClick={() => setIsOpenMenu(false)}
                className="text-slate-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>

            {/* Currently Playing Track Badge */}
            <div className="bg-purple-950/70 border border-purple-400/25 rounded-xl p-2 flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-wider text-purple-300 font-bold">
                เพลงที่กำลังบรรเลง
              </span>
              <span className="font-extrabold text-amber-300 text-[11px] truncate">
                {currentTrack ? TRACK_LABELS[currentTrack] : 'กำลังโหลด...'}
              </span>
            </div>

            {/* Master Sound Switch */}
            <div className="flex items-center justify-between py-0.5">
              <span className="font-bold text-slate-200">เสียงทั้งหมด (Master)</span>
              <button
                onClick={onToggleMute}
                className={`px-2 py-0.5 rounded-lg font-black text-[11px] cursor-pointer transition-colors ${
                  !isMuted ? 'bg-emerald-500 text-slate-950' : 'bg-rose-900/80 text-rose-300'
                }`}
              >
                {!isMuted ? 'เปิดอยู่' : 'ปิดอยู่'}
              </button>
            </div>

            {/* BGM Music Switch */}
            <div className="flex items-center justify-between py-0.5">
              <span className="font-bold text-slate-200">เพลงประกอบ (BGM)</span>
              <button
                disabled={isMuted}
                onClick={handleToggleBgmOnly}
                className={`px-2 py-0.5 rounded-lg font-black text-[11px] cursor-pointer transition-colors ${
                  isMuted
                    ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                    : !bgmMuted
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {!bgmMuted && !isMuted ? 'เปิด' : 'ปิด'}
              </button>
            </div>

            {/* BGM Volume Slider */}
            <div className="flex flex-col gap-1 pt-1 border-t border-white/10">
              <div className="flex justify-between text-[10px] text-slate-300 font-bold">
                <span>ความดังเพลง BGM</span>
                <span className="text-amber-300">{bgmVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={bgmVolume}
                disabled={isMuted}
                onChange={handleVolumeChange}
                className="w-full accent-pink-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
