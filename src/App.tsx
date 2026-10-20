/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Costume,
  DifficultyMode,
  GameState,
  LeaderboardEntry,
  MathProblem,
  Pilot,
  PlayerStats,
  SectorConfig,
  StageRewardItem,
} from './types/game';
import {
  COSTUMES,
  DIFFICULTY_CONFIGS,
  PILOTS,
  SECTORS,
  generateOrderedProblem,
} from './utils/mathEngine';
import { sound } from './utils/audio';
import {
  getPlayerStats,
  savePlayerStats,
  equipCostume,
  unlockCostume,
  addWarpTickets,
  spendWarpTickets,
  addGachaCoins,
  spendGachaCoin,
  getLeaderboard,
  saveLeaderboardEntry,
  getSavedPlayerName,
  savePlayerName,
  getSavedPilotId,
  savePilotId,
} from './utils/storage';
import { MainMenu } from './components/MainMenu';
import { BattleArena } from './components/BattleArena';
import { BossBlastClimax } from './components/BossBlastClimax';
import { VictoryChestModal } from './components/VictoryChestModal';
import { GachaModal } from './components/GachaModal';
import { WardrobeModal } from './components/WardrobeModal';
import { SectorWarpModal } from './components/SectorWarpModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { DisplayModeSwitcher } from './components/DisplayModeSwitcher';
import { AudioControllerWidget } from './components/AudioControllerWidget';
import { useDisplayMode } from './utils/useDisplayMode';
import { bgm } from './utils/bgm';
import { ArrowLeft, RotateCcw, Home, Sparkles, Ticket, Smartphone } from 'lucide-react';

export default function App() {
  // Display Mode (PC Landscape vs Mobile Portrait 100dvh)
  const {
    displayModeSetting,
    effectiveMode,
    cycleDisplayMode,
    setDisplayModeSetting,
    isLandscape,
    isWideScreen,
  } = useDisplayMode();

  // Navigation & Screens
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [modalState, setModalState] = useState<'WARP' | 'GACHA' | 'WARDROBE' | 'LEADERBOARD' | null>(null);

  // Difficulty Mode & Stage Modifiers
  const [difficultyMode, setDifficultyMode] = useState<DifficultyMode>('NORMAL');
  const [bonusNextStageSeconds, setBonusNextStageSeconds] = useState<number>(0);

  // Profile & Saved Progression
  const [playerName, setPlayerName] = useState<string>(() => getSavedPlayerName());
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => getPlayerStats());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => getLeaderboard());
  const [selectedPilot, setSelectedPilot] = useState<Pilot>(() => {
    const savedId = getSavedPilotId();
    return PILOTS.find((p) => p.id === savedId) || PILOTS[0];
  });
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted());

  // Roguelite Run State
  const [currentSector, setCurrentSector] = useState<SectorConfig>(SECTORS[0]);
  const [currentHp, setCurrentHp] = useState<number>(3);
  const [maxHp, setMaxHp] = useState<number>(3);
  const [currentShields, setCurrentShields] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(45);
  const [maxTime, setMaxTime] = useState<number>(45);
  const [cutAssistRemaining, setCutAssistRemaining] = useState<number>(1);
  const [cutAssistUsedOnCurrent, setCutAssistUsedOnCurrent] = useState<boolean>(false);

  // Encounter State
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [solvedCount, setSolvedCount] = useState<number>(0);
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrectHit, setIsCorrectHit] = useState<boolean | null>(null);
  const [isActionLocked, setIsActionLocked] = useState<boolean>(false);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [currentCombo, setCurrentCombo] = useState<number>(0);
  const [maxComboInRun, setMaxComboInRun] = useState<number>(0);

  // Animation states
  const [playerAttacking, setPlayerAttacking] = useState<boolean>(false);
  const [enemyAttacking, setEnemyAttacking] = useState<boolean>(false);
  const [enemyHit, setEnemyHit] = useState<boolean>(false);
  const [playerHit, setPlayerHit] = useState<boolean>(false);

  // Timer Ref
  const timerRef = useRef<number | null>(null);

  // Equipped Costume for active pilot
  const activeCostumeId = playerStats.activeCostumes[selectedPilot.id] || `${selectedPilot.id}_classic`;
  const currentCostume = COSTUMES.find((c) => c.id === activeCostumeId) || COSTUMES[0];

  // Sound Toggle
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Dynamic BGM Track Switching across Game Scenes
  useEffect(() => {
    switch (gameState) {
      case 'MENU':
      case 'WARDROBE':
      case 'SECTOR_WARP':
      case 'LEADERBOARD':
        bgm.playTrack('MENU');
        break;
      case 'BATTLE_RUN':
        bgm.playTrack('BATTLE');
        break;
      case 'BOSS_CLIMAX':
        bgm.playTrack('BOSS_CLIMAX');
        break;
      case 'CHEST_REWARD':
      case 'GACHA_REWARD':
        bgm.playTrack('VICTORY');
        break;
      case 'GAME_OVER':
        bgm.playTrack('GAME_OVER');
        break;
      default:
        bgm.playTrack('MENU');
        break;
    }
  }, [gameState]);

  // Start Fresh Roguelite Run (Floor 1 or newly Warped Floor)
  const startFreshRun = (sector: SectorConfig) => {
    const baseDuration = DIFFICULTY_CONFIGS[difficultyMode].baseSeconds;

    setCurrentSector(sector);
    setCurrentHp(currentCostume.bonusHp);
    setMaxHp(currentCostume.bonusHp);
    setCurrentShields(currentCostume.shieldBonus);
    setTimeRemaining(baseDuration);
    setMaxTime(baseDuration);
    setCutAssistRemaining(currentCostume.cutAssistCharges);
    setCutAssistUsedOnCurrent(false);
    setBonusNextStageSeconds(0);

    setStepIndex(0);
    setSolvedCount(0);
    setCurrentScore(0);
    setCurrentCombo(0);
    setMaxComboInRun(0);
    setSelectedAnswer(null);
    setIsCorrectHit(null);
    setIsActionLocked(false);

    // Initial problem
    const prob = generateOrderedProblem(sector.sector, 0);
    setCurrentProblem(prob);

    setModalState(null);
    setGameState('BATTLE_RUN');
  };

  // Advance to Next Floor - PERSISTENT HP & CUT ASSIST (Roguelite tension!)
  const advanceToNextFloor = (nextSector: SectorConfig) => {
    const stageDuration = DIFFICULTY_CONFIGS[difficultyMode].baseSeconds + bonusNextStageSeconds;

    setCurrentSector(nextSector);
    // Note: currentHp is preserved! Does NOT refill!
    // Note: cutAssistRemaining is preserved! Does NOT refill!
    setTimeRemaining(stageDuration);
    setMaxTime(stageDuration);
    setBonusNextStageSeconds(0); // Resets bonus for future floors

    setStepIndex(0);
    setSolvedCount(0);
    setSelectedAnswer(null);
    setIsCorrectHit(null);
    setCutAssistUsedOnCurrent(false);
    setIsActionLocked(false);

    const prob = generateOrderedProblem(nextSector.sector, 0);
    setCurrentProblem(prob);

    setGameState('BATTLE_RUN');
  };

  // Timer Countdown Loop
  useEffect(() => {
    if (gameState !== 'BATTLE_RUN') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Timeout = enemy attack
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Timeout handler
  const handleTimeout = () => {
    sound.playMiss();
    setEnemyAttacking(true);
    setTimeout(() => {
      setEnemyAttacking(false);
      setPlayerHit(true);
      setTimeout(() => setPlayerHit(false), 300);
    }, 200);

    setCurrentCombo(0);
    if (currentShields > 0) {
      setCurrentShields((prev) => prev - 1);
      sound.playShieldBlock();
    } else {
      const nextHp = currentHp - 1;
      setCurrentHp(nextHp);
      if (nextHp <= 0) {
        setGameState('GAME_OVER');
        return;
      }
    }

    // Reset timer and advance problem
    const nextStep = stepIndex + 1;
    setStepIndex(nextStep);
    const nextProb = generateOrderedProblem(currentSector.sector, nextStep);
    setCurrentProblem(nextProb);
    setSelectedAnswer(null);
    setIsCorrectHit(null);
    setCutAssistUsedOnCurrent(false);
    setTimeRemaining(currentCostume.timeSeconds);
  };

  // Handle Answer Selection
  const handleSelectOption = useCallback(
    (chosenVal: number, index: number) => {
      if (isActionLocked || !currentProblem) return;
      setIsActionLocked(true);
      setSelectedAnswer(chosenVal);

      const isCorrect = chosenVal === currentProblem.answer;
      setIsCorrectHit(isCorrect);

      if (isCorrect) {
        // CORRECT ANSWER!
        const nextCombo = currentCombo + 1;
        setCurrentCombo(nextCombo);
        setMaxComboInRun((prev) => Math.max(prev, nextCombo));

        const nextSolved = solvedCount + 1;
        setSolvedCount(nextSolved);
        const points = 100 + nextCombo * 25;
        setCurrentScore((prev) => prev + points);

        sound.playLaser();
        sound.playCorrect(nextCombo);

        // Player Attack Animation
        setPlayerAttacking(true);
        setTimeout(() => {
          setPlayerAttacking(false);
          setEnemyHit(true);
          setTimeout(() => setEnemyHit(false), 250);
        }, 200);

        // Advance or Boss Climax
        setTimeout(() => {
          if (nextSolved >= currentSector.targetQuota) {
            // Boss Defeated!
            if (timerRef.current) clearInterval(timerRef.current);
            setGameState('BOSS_CLIMAX');
          } else {
            // Next Question
            const nextStep = stepIndex + 1;
            setStepIndex(nextStep);
            const nextProb = generateOrderedProblem(currentSector.sector, nextStep);
            setCurrentProblem(nextProb);
            setSelectedAnswer(null);
            setIsCorrectHit(null);
            setCutAssistUsedOnCurrent(false);
            setIsActionLocked(false);
          }
        }, 450);
      } else {
        // WRONG ANSWER! Enemy attacks player!
        setCurrentCombo(0);
        sound.playMiss();

        setEnemyAttacking(true);
        setTimeout(() => {
          setEnemyAttacking(false);
          setPlayerHit(true);
          setTimeout(() => setPlayerHit(false), 300);
        }, 200);

        if (currentShields > 0) {
          setCurrentShields((prev) => prev - 1);
          sound.playShieldBlock();
        } else {
          const nextHp = currentHp - 1;
          setCurrentHp(nextHp);
          if (nextHp <= 0) {
            setTimeout(() => {
              setGameState('GAME_OVER');
            }, 800);
            return;
          }
        }

        setTimeout(() => {
          const nextStep = stepIndex + 1;
          setStepIndex(nextStep);
          const nextProb = generateOrderedProblem(currentSector.sector, nextStep);
          setCurrentProblem(nextProb);
          setSelectedAnswer(null);
          setIsCorrectHit(null);
          setCutAssistUsedOnCurrent(false);
          setIsActionLocked(false);
        }, 800);
      }
    },
    [isActionLocked, currentProblem, currentCombo, solvedCount, currentSector, stepIndex, currentShields, currentHp]
  );

  // Use Cut Assist Skill (eliminate wrong choices)
  const handleUseCutAssist = () => {
    if (cutAssistRemaining <= 0 || cutAssistUsedOnCurrent || isActionLocked) return;
    sound.playStarCollect();
    setCutAssistRemaining((prev) => prev - 1);
    setCutAssistUsedOnCurrent(true);
  };

  // Boss Climax Finished -> Award 1 Gacha Coin, 1 Warp Ticket, Go to Cosmic Chest!
  const handleBossClimaxFinished = () => {
    // Add rewards
    let updatedStats = addGachaCoins(1);
    updatedStats = addWarpTickets(1);

    const nextHighest = Math.max(updatedStats.highestSectorReached, currentSector.sector);
    updatedStats = {
      ...updatedStats,
      highestSectorReached: nextHighest,
      totalBossesDefeated: updatedStats.totalBossesDefeated + 1,
    };
    savePlayerStats(updatedStats);
    setPlayerStats(updatedStats);

    // Save Leaderboard
    saveLeaderboardEntry({
      playerName,
      pilotId: selectedPilot.id,
      score: currentScore,
      sectorCleared: currentSector.sector,
      combo: maxComboInRun,
    });

    // Go to Cosmic Treasure Chest Gacha!
    setGameState('CHEST_REWARD');
  };

  // Apply Reward from Cosmic Treasure Chest
  const handleApplyChestReward = (reward: StageRewardItem) => {
    if (reward.type === 'HP_REFILL' || reward.type === 'DUPLICATE_CONVERT_HP') {
      const refillAmount = reward.value || 1;
      setCurrentHp((prev) => Math.min(maxHp, prev + refillAmount));
      sound.playLaser();
    } else if (reward.type === 'TIME_BONUS') {
      const bonusSeconds = reward.value || 15;
      setBonusNextStageSeconds((prev) => prev + bonusSeconds);
      sound.playStarCollect();
    } else if (reward.type === 'CUT_ASSIST') {
      setCutAssistRemaining((prev) => Math.min(currentCostume.cutAssistCharges, prev + 1));
      sound.playStarCollect();
    } else if (reward.type === 'NEW_COSTUME' && reward.costume) {
      const updated = unlockCostume(reward.costume.id);
      setPlayerStats(updated);
      sound.playPresentOpen();
    } else if (reward.type === 'TICKETS') {
      const updated = addWarpTickets(reward.value || 1);
      setPlayerStats(updated);
      sound.playStarCollect();
    }
  };

  // Proceed after Chest Gacha
  const handleProceedAfterChest = () => {
    const nextSectorNum = currentSector.sector + 1;
    const nextSecConfig = SECTORS.find((s) => s.sector === nextSectorNum);

    if (nextSecConfig && nextSectorNum <= 10) {
      advanceToNextFloor(nextSecConfig);
    } else {
      // Completed all 10 planets!
      sound.playBossExplode();
      setGameState('MENU');
    }
  };

  // Warp Sector Select (spending tickets)
  const handleWarpToSector = (sec: SectorConfig, ticketsCost: number) => {
    if (ticketsCost > 0) {
      const ok = spendWarpTickets(ticketsCost);
      if (!ok) return;
      setPlayerStats(getPlayerStats());
    }
    setModalState(null);
    startFreshRun(sec);
  };

  return (
    <div className="relative w-screen h-[100dvh] max-h-[100dvh] overflow-hidden bg-slate-950 font-sans select-none text-white flex flex-col justify-center items-center">
      {/* Floating Controls at corner: Audio Controller & Display Mode Switcher */}
      <div className="fixed top-2.5 right-2.5 z-50 flex items-center gap-1.5 pointer-events-auto">
        <AudioControllerWidget
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
        <DisplayModeSwitcher
          setting={displayModeSetting}
          effectiveMode={effectiveMode}
          onSelectMode={setDisplayModeSetting}
          onCycleMode={cycleDisplayMode}
        />
      </div>

      {/* Landscape rotation hint if in PC mode but screen is vertical phone */}
      {effectiveMode === 'PC' && !isLandscape && !isWideScreen && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-40 bg-purple-950/95 border border-yellow-400/50 text-yellow-300 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-xl animate-bounce backdrop-blur-md">
          <Smartphone className="w-3.5 h-3.5 text-yellow-300" />
          <span>หมุนหน้าจอแนวนอน หรือแตะปุ่มสลับโหมดมือถือ</span>
        </div>
      )}

      {/* Main Mode View Container */}
      <div
        className={`w-full h-full flex flex-col justify-between overflow-hidden relative ${
          effectiveMode === 'MOBILE'
            ? 'max-w-md mx-auto sm:border sm:border-purple-500/30 sm:rounded-[2rem] sm:shadow-[0_0_50px_rgba(168,85,247,0.25)] sm:my-auto sm:max-h-[860px]'
            : 'max-w-6xl mx-auto'
        }`}
      >
        {/* 1. Main Menu */}
        {gameState === 'MENU' && (
          <MainMenu
            selectedPilot={selectedPilot}
            currentCostume={currentCostume}
            stats={playerStats}
            difficultyMode={difficultyMode}
            isMuted={isMuted}
            onSelectPilot={(p) => {
              setSelectedPilot(p);
              savePilotId(p.id);
            }}
            onChangeDifficulty={setDifficultyMode}
            onStartFloor1={() => startFreshRun(SECTORS[0])}
            onOpenWarp={() => setModalState('WARP')}
            onOpenGacha={() => setModalState('GACHA')}
            onOpenWardrobe={() => setModalState('WARDROBE')}
            onOpenLeaderboard={() => setModalState('LEADERBOARD')}
            onToggleMute={handleToggleMute}
            displayMode={effectiveMode}
          />
        )}

        {/* 2. Active Roguelite Battle Run */}
        {gameState === 'BATTLE_RUN' && currentProblem && (
          <div
            className={`relative w-full h-full ${
              effectiveMode === 'PC' ? 'max-w-5xl p-2 sm:p-4' : 'max-w-md p-1.5 sm:p-2'
            } mx-auto flex flex-col justify-between`}
          >
            {/* Top Header Row with Quit button */}
            <div className="flex items-center justify-between px-1 mb-0.5 shrink-0">
              <button
                onClick={() => {
                  sound.playClick();
                  if (timerRef.current) clearInterval(timerRef.current);
                  setGameState('MENU');
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-white/10 shadow transition-colors cursor-pointer"
                title="กลับหน้าหลัก"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <span className="text-xs sm:text-sm font-extrabold text-pink-300">
                {currentSector.thaiName}
              </span>

              <div className="text-[11px] sm:text-xs font-black text-amber-300 tabular-nums bg-slate-900/90 px-2.5 py-1 rounded-xl border border-white/10">
                คะแนน: {currentScore}
              </div>
            </div>

            {/* Battle Arena */}
            <BattleArena
              pilot={selectedPilot}
              costume={currentCostume}
              sector={currentSector}
              problem={currentProblem}
              selectedAnswer={selectedAnswer}
              isCorrect={isCorrectHit}
              onSelectOption={handleSelectOption}
              disabled={isActionLocked}
              cutAssistUsedOnCurrent={cutAssistUsedOnCurrent}
              cutAssistRemaining={cutAssistRemaining}
              onUseCutAssist={handleUseCutAssist}
              playerAttacking={playerAttacking}
              enemyAttacking={enemyAttacking}
              enemyHit={enemyHit}
              playerHit={playerHit}
              currentHp={currentHp}
              maxHp={maxHp}
              timeRemaining={timeRemaining}
              maxTime={maxTime}
              solvedCount={solvedCount}
              targetQuota={currentSector.targetQuota}
              currentShields={currentShields}
              displayMode={effectiveMode}
            />
          </div>
        )}

        {/* 3. Boss Blast Climax Animation */}
        {gameState === 'BOSS_CLIMAX' && (
          <BossBlastClimax
            pilot={selectedPilot}
            costume={currentCostume}
            sector={currentSector}
            onFinished={handleBossClimaxFinished}
          />
        )}
      </div>

      {/* 4. Cosmic Treasure Chest Gacha (Post-Victory) */}
      {gameState === 'CHEST_REWARD' && (
        <VictoryChestModal
          unlockedCostumes={playerStats.unlockedCostumes}
          currentHp={currentHp}
          maxHp={maxHp}
          cutAssistRemaining={cutAssistRemaining}
          maxCutAssist={currentCostume.cutAssistCharges}
          totalRolls={DIFFICULTY_CONFIGS[difficultyMode].gachaRollsOnVictory}
          currentSector={currentSector}
          nextSector={SECTORS.find((s) => s.sector === currentSector.sector + 1) || null}
          onApplyReward={handleApplyChestReward}
          onProceedNextStage={handleProceedAfterChest}
        />
      )}

      {/* 5. Game Over (Roguelite Permadeath) */}
      {gameState === 'GAME_OVER' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md select-none animate-fade-in">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-purple-950 border-2 border-pink-400/30 rounded-3xl p-6 text-center flex flex-col items-center shadow-2xl">
            <div className="relative w-28 h-28 rounded-3xl border-4 border-pink-400 overflow-hidden shadow-2xl mb-3 bg-slate-800">
              <img
                src={currentCostume.imageUrl}
                alt={currentCostume.name}
                className="w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900 border border-yellow-400 flex items-center justify-center text-xs shadow">
                {currentCostume.emoji}
              </div>
            </div>

            <h3 className="text-2xl font-black text-white">
              หัวใจหมดแล้ว! สู้ใหม่นะ ⭐
            </h3>
            <p className="text-xs text-purple-200 mt-1 mb-4">
              เกม Roguelite ต้องเริ่มปีนใหม่จากด่าน 1 เพื่อฝึกจำเลขง่ายๆ ให้คล่อง หรือใช้ตั๋ววาร์ป 🎫 เพื่อข้ามด่าน
            </p>

            <div className="w-full space-y-2.5">
              <button
                onClick={() => {
                  sound.playClick();
                  startFreshRun(SECTORS[0]);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>เริ่มปีนใหม่จากด่าน 1 (ฟรี)</span>
              </button>

              {playerStats.warpTickets > 0 && (
                <button
                  onClick={() => {
                    sound.playClick();
                    setGameState('MENU');
                    setModalState('WARP');
                  }}
                  className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>ใช้ตั๋ววาร์ปข้ามด่าน (มี {playerStats.warpTickets} ใบ)</span>
                </button>
              )}

              <button
                onClick={() => {
                  sound.playClick();
                  setGameState('MENU');
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>กลับหน้าหลัก</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modals */}
      {modalState === 'WARP' && (
        <SectorWarpModal
          currentSector={currentSector.sector}
          highestSectorReached={playerStats.highestSectorReached}
          warpTickets={playerStats.warpTickets}
          onSelectSector={handleWarpToSector}
          onClose={() => setModalState(null)}
        />
      )}

      {modalState === 'GACHA' && (
        <GachaModal
          stats={playerStats}
          onSpendCoin={() => {
            const ok = spendGachaCoin();
            if (ok) setPlayerStats(getPlayerStats());
            return ok;
          }}
          onAddTickets={(qty) => {
            const updated = addWarpTickets(qty);
            setPlayerStats(updated);
          }}
          onUnlockCostume={(costumeId) => {
            const updated = unlockCostume(costumeId);
            setPlayerStats(updated);
          }}
          onClose={() => setModalState(null)}
        />
      )}

      {modalState === 'WARDROBE' && (
        <WardrobeModal
          stats={playerStats}
          currentPilot={selectedPilot}
          onEquipCostume={(pilotId, costumeId) => {
            const updated = equipCostume(pilotId, costumeId);
            setPlayerStats(updated);
          }}
          onSelectPilot={(p) => {
            setSelectedPilot(p);
            savePilotId(p.id);
          }}
          onClose={() => setModalState(null)}
        />
      )}

      {modalState === 'LEADERBOARD' && (
        <LeaderboardModal
          entries={leaderboard}
          playerName={playerName}
          onUpdatePlayerName={(name) => {
            setPlayerName(name);
            savePlayerName(name);
          }}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  );
}
