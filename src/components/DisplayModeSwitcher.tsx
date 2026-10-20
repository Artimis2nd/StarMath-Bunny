import React, { useState } from 'react';
import { Smartphone, Monitor, Sparkles, RefreshCw } from 'lucide-react';
import { DisplayModeSetting, EffectiveDisplayMode } from '../types/game';
import { sound } from '../utils/audio';

interface DisplayModeSwitcherProps {
  setting: DisplayModeSetting;
  effectiveMode: EffectiveDisplayMode;
  onSelectMode: (mode: DisplayModeSetting) => void;
  onCycleMode: () => void;
}

export const DisplayModeSwitcher: React.FC<DisplayModeSwitcherProps> = ({
  setting,
  effectiveMode,
  onSelectMode,
  onCycleMode,
}) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  return (
    <div className="relative z-50 select-none">
      {/* Main Mode Toggle Pill */}
      <button
        onClick={() => {
          sound.playClick();
          onCycleMode();
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsOpenMenu((prev) => !prev);
        }}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border backdrop-blur-md shadow-lg transition-all text-xs font-black cursor-pointer group active:scale-95 ${
          effectiveMode === 'MOBILE'
            ? 'bg-purple-950/85 hover:bg-purple-900/90 text-pink-300 border-pink-400/40 shadow-pink-500/20'
            : 'bg-slate-900/85 hover:bg-slate-800/90 text-sky-300 border-sky-400/40 shadow-sky-500/20'
        }`}
        title="แตะเพื่อสลับโหมด PC แนวนอน / มือถือแนวตั้ง / อัตโนมัติ"
      >
        {effectiveMode === 'MOBILE' ? (
          <Smartphone className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
        ) : (
          <Monitor className="w-3.5 h-3.5 text-sky-400" />
        )}

        <span className="text-[11px] sm:text-xs">
          {effectiveMode === 'MOBILE' ? '📱 มือถือแนวตั้ง' : '💻 PC แนวนอน'}
        </span>

        {setting === 'AUTO' && (
          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/10 text-yellow-300 font-extrabold border border-yellow-300/30">
            Auto
          </span>
        )}
      </button>

      {/* Optional dropdown popup if user wants direct choice */}
      {isOpenMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpenMenu(false)}
          />
          <div className="absolute right-0 mt-1.5 w-48 bg-slate-900/95 border border-white/15 rounded-2xl p-1.5 shadow-2xl backdrop-blur-md z-50 flex flex-col gap-1 text-xs font-bold text-slate-200">
            <div className="px-2 py-1 text-[10px] text-slate-400 font-extrabold border-b border-white/10">
              เลือกโหมดการแสดงผล
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onSelectMode('AUTO');
                setIsOpenMenu(false);
              }}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors ${
                setting === 'AUTO'
                  ? 'bg-purple-600 text-white'
                  : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-yellow-300" />
                <span>อัตโนมัติตามจอ (Auto)</span>
              </div>
              {setting === 'AUTO' && <span>✓</span>}
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onSelectMode('MOBILE');
                setIsOpenMenu(false);
              }}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors ${
                setting === 'MOBILE'
                  ? 'bg-pink-600 text-white'
                  : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-pink-300" />
                <span>มือถือแนวตั้ง (100dvh)</span>
              </div>
              {setting === 'MOBILE' && <span>✓</span>}
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onSelectMode('PC');
                setIsOpenMenu(false);
              }}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors ${
                setting === 'PC'
                  ? 'bg-sky-600 text-white'
                  : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-sky-300" />
                <span>PC แนวนอน (Landscape)</span>
              </div>
              {setting === 'PC' && <span>✓</span>}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
