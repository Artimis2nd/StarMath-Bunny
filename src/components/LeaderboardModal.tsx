import React, { useState } from 'react';
import { X, Trophy, Medal, Star, Flame, User, Check } from 'lucide-react';
import { LeaderboardEntry } from '../types/game';
import { PILOTS } from '../utils/mathEngine';
import { sound } from '../utils/audio';

interface LeaderboardModalProps {
  entries: LeaderboardEntry[];
  playerName: string;
  onUpdatePlayerName: (name: string) => void;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  entries,
  playerName,
  onUpdatePlayerName,
  onClose,
}) => {
  const [editingName, setEditingName] = useState(playerName);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingName.trim()) {
      onUpdatePlayerName(editingName.trim());
      setIsSaved(true);
      sound.playClick();
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl p-4 sm:p-7 shadow-2xl max-h-[92dvh] overflow-y-auto my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg text-slate-950 font-bold">
              <Trophy className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                หอเกียรติยศนักบินอวกาศ (Leaderboard)
              </h2>
              <p className="text-xs sm:text-sm text-amber-300/80">
                คะแนนยอดเยี่ยมจากการคิดเลขเร็วและคอมโบสุดเจ๋ง
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Change Name Box */}
        <form onSubmit={handleSaveName} className="my-4 p-3.5 bg-slate-800/80 rounded-2xl border border-white/10 flex items-center gap-2">
          <User className="w-4 h-4 text-pink-400 shrink-0 ml-1" />
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            placeholder="ตั้งชื่อนักบินน้อยของคุณ..."
            maxLength={20}
            className="bg-transparent text-sm text-white focus:outline-none flex-1 font-semibold placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 shadow-md shadow-pink-500/20"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-white" /> : null}
            <span>{isSaved ? 'บันทึกแล้ว!' : 'เปลี่ยนชื่อ'}</span>
          </button>
        </form>

        {/* Leaderboard Table */}
        <div className="space-y-2 mt-4">
          {entries.map((entry, index) => {
            const pilot = PILOTS.find((p) => p.id === entry.pilotId) || PILOTS[0];
            const rank = index + 1;

            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  rank === 1
                    ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-transparent border-amber-400/40'
                    : rank === 2
                    ? 'bg-slate-800/90 border-slate-400/30'
                    : rank === 3
                    ? 'bg-slate-800/70 border-amber-700/30'
                    : 'bg-slate-800/40 border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank indicator */}
                  <div className="w-7 text-center font-black text-sm tabular-nums">
                    {rank === 1 ? (
                      <span className="text-xl">🥇</span>
                    ) : rank === 2 ? (
                      <span className="text-xl">🥈</span>
                    ) : rank === 3 ? (
                      <span className="text-xl">🥉</span>
                    ) : (
                      <span className="text-slate-500 font-bold">#{rank}</span>
                    )}
                  </div>

                  {/* Pilot avatar */}
                  <img
                    src={pilot.avatarUrl}
                    alt={pilot.name}
                    className="w-9 h-9 rounded-full object-cover border border-white/20"
                  />

                  {/* Name and sub info */}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white leading-tight">
                      {entry.playerName}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>พิชิตดาว +{entry.sectorCleared}</span>
                      <span>·</span>
                      <span className="text-orange-400 flex items-center gap-0.5">
                        <Flame className="w-3 h-3" /> คอมโบ {entry.combo}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="flex flex-col items-end">
                  <span className="text-base sm:text-lg font-black text-amber-300 tabular-nums">
                    {entry.score.toLocaleString()}
                  </span>
                  {entry.accuracy !== undefined && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      แม่นยำ {entry.accuracy}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
