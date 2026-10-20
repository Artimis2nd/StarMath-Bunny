/**
 * 8-Bit Chiptune Procedural BGM Engine using Web Audio API.
 * Synthesizes authentic retro arcade chiptune music (Square Leads, Triangle Bass,
 * Arpeggio Chords, and Noise Percussion) in real-time across game scenes.
 */

export type BgmTrackName = 'MENU' | 'BATTLE' | 'BOSS_CLIMAX' | 'VICTORY' | 'GAME_OVER';

interface NoteEvent {
  note: string | number | null; // e.g. "C4", "G#4", or null for rest
  duration?: number; // in 16th steps (default 1)
  volume?: number; // 0..1
}

interface StepPattern {
  lead?: (string | null)[];
  arp?: (string | null)[];
  bass?: (string | null)[];
  drums?: ('K' | 'S' | 'H' | 'KS' | null)[]; // Kick, Snare, Hi-hat, Kick+Snare
}

interface TrackData {
  bpm: number;
  stepsPerLoop: number;
  patterns: StepPattern;
}

// Convert note name (e.g., "A4", "C#5", "Bb3") to Frequency (Hz)
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_ALIASES: Record<string, string> = {
  Db: 'C#',
  Eb: 'D#',
  Gb: 'F#',
  Ab: 'G#',
  Bb: 'A#',
};

function noteToFreq(note: string | null): number | null {
  if (!note) return null;
  const match = note.match(/^([A-Ga-g][#b]?)(-?\d+)$/);
  if (!match) return null;

  let name = match[1].toUpperCase();
  if (NOTE_ALIASES[name]) name = NOTE_ALIASES[name];

  const octave = parseInt(match[2], 10);
  const semitoneIndex = NOTE_NAMES.indexOf(name);
  if (semitoneIndex === -1) return null;

  // MIDI number: C4 is 60, A4 is 69 (440Hz)
  const midi = (octave + 1) * 12 + semitoneIndex;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/* ==========================================================================
   TRACK COMPOSITIONS (Chiptune 8-Bit Retro Arcade)
   ========================================================================== */

// 1. MENU: Bouncy, cheerful, kawaii 8-bit space hangar lobby (128 BPM, 32 steps = 2 bars)
const MENU_TRACK: TrackData = {
  bpm: 128,
  stepsPerLoop: 32,
  patterns: {
    // Joyful, catchy melody with staccato square wave
    lead: [
      'E5', null, 'G5', null, 'A5', null, 'B5', 'C6',
      null, 'B5', 'G5', null, 'E5', null, 'D5', 'E5',
      'F5', null, 'A5', null, 'G5', 'E5', null, 'D5',
      'C5', null, 'D5', 'E5', 'D5', null, null, null,
    ],
    // Sparkly rapid 16th arpeggios (C - Am - F - G)
    arp: [
      'C4', 'E4', 'G4', 'C5', 'A3', 'C4', 'E4', 'A4',
      'F3', 'A3', 'C4', 'F4', 'G3', 'B3', 'D4', 'G4',
      'C4', 'E4', 'G4', 'C5', 'A3', 'C4', 'E4', 'A4',
      'F3', 'A3', 'C4', 'F4', 'G3', 'B3', 'D4', 'B4',
    ],
    // Bouncy walking triangle bass
    bass: [
      'C3', null, 'C3', null, 'A2', null, 'A2', null,
      'F2', null, 'F2', null, 'G2', null, 'G2', null,
      'C3', null, 'E3', null, 'A2', null, 'C3', null,
      'F2', null, 'A2', null, 'G2', null, 'B2', null,
    ],
    // Punchy 8-bit arcade drums
    drums: [
      'K', 'H', 'S', 'H', 'K', 'H', 'S', 'H',
      'K', 'H', 'S', 'H', 'K', 'K', 'S', 'H',
      'K', 'H', 'S', 'H', 'K', 'H', 'S', 'H',
      'K', 'H', 'S', 'H', 'K', 'S', 'KS', 'H',
    ],
  },
};

// 2. BATTLE: Driving, exciting cosmic math duel (142 BPM, 32 steps)
const BATTLE_TRACK: TrackData = {
  bpm: 142,
  stepsPerLoop: 32,
  patterns: {
    // Energetic battle anthem
    lead: [
      'D5', null, 'D5', 'F5', 'G5', null, 'A5', null,
      'F5', 'D5', null, 'C5', 'D5', null, null, null,
      'A5', null, 'A5', 'C6', 'D6', null, 'C6', null,
      'A5', 'F5', 'G5', 'A5', 'G5', 'F5', 'E5', 'F5',
    ],
    // Galloping arcade arpeggios (Dm - Bb - C - Am)
    arp: [
      'D4', 'F4', 'A4', 'D5', 'Bb3', 'D4', 'F4', 'Bb4',
      'C4', 'E4', 'G4', 'C5', 'A3', 'C4', 'E4', 'A4',
      'D4', 'F4', 'A4', 'D5', 'Bb3', 'D4', 'F4', 'Bb4',
      'C4', 'E4', 'G4', 'C5', 'A3', 'D4', 'E4', 'F4',
    ],
    // Galloping triangle bass
    bass: [
      'D3', 'D3', null, 'D3', 'Bb2', 'Bb2', null, 'Bb2',
      'C3', 'C3', null, 'C3', 'A2', 'A2', null, 'A2',
      'D3', 'D3', null, 'D3', 'Bb2', 'Bb2', null, 'Bb2',
      'C3', 'C3', 'E3', 'G3', 'A2', 'C3', 'E3', 'A3',
    ],
    // Driving kick-snare groove
    drums: [
      'K', 'H', 'S', 'H', 'K', 'K', 'S', 'H',
      'K', 'H', 'S', 'H', 'K', 'H', 'S', 'K',
      'K', 'H', 'S', 'H', 'K', 'K', 'S', 'H',
      'K', 'H', 'S', 'K', 'KS', 'H', 'S', 'S',
    ],
  },
};

// 3. BOSS CLIMAX: 162 BPM intense hyper overdrive with fast 16th arps & double tempo
const BOSS_CLIMAX_TRACK: TrackData = {
  bpm: 162,
  stepsPerLoop: 32,
  patterns: {
    // Urgent, heroic climax melody
    lead: [
      'G5', 'G5', 'Bb5', 'C6', 'D6', null, 'Bb5', null,
      'C6', 'D6', 'C6', 'Bb5', 'A5', null, 'F#5', null,
      'G5', 'Bb5', 'D6', 'G6', 'F6', 'D6', 'C6', 'D6',
      'Bb5', 'A5', 'G5', 'A5', 'Bb5', 'C6', 'D6', null,
    ],
    // Rapid sweeping arpeggio bursts
    arp: [
      'G4', 'Bb4', 'D5', 'G5', 'Eb4', 'G4', 'Bb4', 'Eb5',
      'F4', 'A4', 'C5', 'F5', 'D4', 'F#4', 'A4', 'D5',
      'G4', 'Bb4', 'D5', 'G5', 'Eb4', 'G4', 'Bb4', 'Eb5',
      'F4', 'A4', 'C5', 'F5', 'D4', 'F#4', 'A4', 'C5',
    ],
    // Driving staccato bassline
    bass: [
      'G2', 'G2', 'G2', 'G2', 'Eb2', 'Eb2', 'Eb2', 'Eb2',
      'F2', 'F2', 'F2', 'F2', 'D2', 'D2', 'D2', 'D2',
      'G2', 'G2', 'Bb2', 'D3', 'Eb2', 'Eb2', 'G2', 'Bb2',
      'F2', 'F2', 'A2', 'C3', 'D2', 'D2', 'F#2', 'A2',
    ],
    // High-speed arcade techno drums
    drums: [
      'K', 'H', 'S', 'H', 'K', 'S', 'KS', 'H',
      'K', 'H', 'S', 'H', 'K', 'S', 'KS', 'S',
      'K', 'H', 'S', 'H', 'K', 'S', 'KS', 'H',
      'K', 'S', 'K', 'S', 'KS', 'S', 'S', 'S',
    ],
  },
};

// 4. VICTORY: Joyful, celebratory fanfare & sparkling victory loop (136 BPM, 32 steps)
const VICTORY_TRACK: TrackData = {
  bpm: 136,
  stepsPerLoop: 32,
  patterns: {
    // Triumphant fanfare melody
    lead: [
      'C5', 'E5', 'G5', 'C6', null, 'B5', 'C6', null,
      'G5', null, 'E5', null, 'G5', null, null, null,
      'F5', 'A5', 'C6', 'F6', null, 'E6', 'D6', 'C6',
      'D6', null, 'B5', null, 'C6', null, null, null,
    ],
    // Sparkling bell-like arpeggios (C - G - F - C)
    arp: [
      'C4', 'G4', 'C5', 'E5', 'G3', 'D4', 'G4', 'B4',
      'F3', 'C4', 'F4', 'A4', 'C4', 'G4', 'C5', 'E5',
      'F3', 'C4', 'F4', 'A4', 'G3', 'D4', 'G4', 'B4',
      'C4', 'E4', 'G4', 'C5', 'E5', 'G5', 'C6', null,
    ],
    // Happy bouncing bass
    bass: [
      'C3', null, 'C3', null, 'G2', null, 'G2', null,
      'F2', null, 'F2', null, 'C3', null, 'E3', null,
      'F2', null, 'A2', null, 'G2', null, 'B2', null,
      'C3', null, 'G2', null, 'C3', null, null, null,
    ],
    // Celebratory march drums
    drums: [
      'K', 'H', 'S', 'H', 'K', 'H', 'S', 'H',
      'K', 'H', 'S', 'H', 'K', 'K', 'S', 'H',
      'K', 'H', 'S', 'H', 'K', 'H', 'S', 'H',
      'K', 'S', 'K', 'S', 'KS', 'H', 'S', 'H',
    ],
  },
};

// 5. GAME OVER: Melancholic retro arcade Game Over phrase (96 BPM, 32 steps)
const GAME_OVER_TRACK: TrackData = {
  bpm: 96,
  stepsPerLoop: 32,
  patterns: {
    lead: [
      'C5', null, 'B4', null, 'Bb4', null, 'A4', null,
      'Ab4', null, null, null, 'G4', null, null, null,
      'Eb4', null, 'F4', null, 'G4', null, null, null,
      'C4', null, null, null, null, null, null, null,
    ],
    arp: [
      'C4', 'Eb4', 'G4', 'C5', 'B3', 'D4', 'G4', 'B4',
      'Bb3', 'D4', 'F4', 'Bb4', 'A3', 'C4', 'F4', 'A4',
      'Ab3', 'C4', 'Eb4', 'Ab4', 'G3', 'B3', 'D4', 'G4',
      'C3', 'G3', 'C4', 'Eb4', 'G4', null, null, null,
    ],
    bass: [
      'C3', null, null, null, 'B2', null, null, null,
      'Bb2', null, null, null, 'A2', null, null, null,
      'Ab2', null, null, null, 'G2', null, null, null,
      'C2', null, null, null, null, null, null, null,
    ],
    drums: [
      'K', null, 'H', null, 'S', null, 'H', null,
      'K', null, 'H', null, 'S', null, null, null,
      'K', null, 'H', null, 'S', null, 'H', null,
      'K', null, null, null, null, null, null, null,
    ],
  },
};

const TRACK_CATALOG: Record<BgmTrackName, TrackData> = {
  MENU: MENU_TRACK,
  BATTLE: BATTLE_TRACK,
  BOSS_CLIMAX: BOSS_CLIMAX_TRACK,
  VICTORY: VICTORY_TRACK,
  GAME_OVER: GAME_OVER_TRACK,
};

/* ==========================================================================
   BGM SEQUENCER CLASS
   ========================================================================== */

class BgmEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private currentTrackName: BgmTrackName | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private bgmVolume: number = 0.22; // Default cheerful background volume

  // Lookahead Scheduler state
  private timerId: number | null = null;
  private nextStepTime: number = 0;
  private currentStep: number = 0;
  private scheduleAheadTime: number = 0.12; // Lookahead window (seconds)
  private lookaheadIntervalMs: number = 35; // Timer frequency (ms)

  // Listeners for UI state updates (e.g. visualizer beat)
  private beatListeners: Set<(step: number, track: BgmTrackName) => void> = new Set();

  constructor() {
    // Read saved mute / volume preferences from localStorage
    const savedMuted = localStorage.getItem('starmath_bgm_muted');
    if (savedMuted !== null) {
      this.isMuted = savedMuted === 'true';
    } else {
      // Fallback to general mute state if BGM specific isn't set
      const generalMuted = localStorage.getItem('starmath_muted');
      if (generalMuted !== null) {
        this.isMuted = generalMuted === 'true';
      }
    }

    const savedVol = localStorage.getItem('starmath_bgm_volume');
    if (savedVol !== null) {
      const parsed = parseFloat(savedVol);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
        this.bgmVolume = parsed;
      }
    }

    // Auto-unlock audio on user's first touch / click
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.initContext();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };
      window.addEventListener('pointerdown', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });

      // Handle tab visibility change
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (this.ctx && this.ctx.state === 'running') {
            this.ctx.suspend();
          }
        } else {
          if (this.ctx && this.ctx.state === 'suspended' && this.isPlaying && !this.isMuted) {
            this.ctx.resume();
          }
        }
      });
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && !this.masterGain) {
      // Create Master BGM Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.bgmVolume, this.ctx.currentTime);

      // Warm NES-like low-pass filter (smoothes out harsh high digital square aliasing)
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(3600, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(1.1, this.ctx.currentTime);

      this.masterGain.connect(this.filterNode);
      this.filterNode.connect(this.ctx.destination);

      // Create White Noise buffer for chiptune percussion
      const bufferSize = this.ctx.sampleRate * 1;
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    return this.ctx;
  }

  /* --------------------------------------------------------------------------
     PLAYBACK CONTROLS
     -------------------------------------------------------------------------- */

  public playTrack(trackName: BgmTrackName, forceRestart: boolean = false) {
    if (this.currentTrackName === trackName && this.isPlaying && !forceRestart) {
      return; // Already playing this track smoothly
    }

    const ctx = this.initContext();
    if (!ctx) return;

    this.currentTrackName = trackName;
    this.isPlaying = true;

    // Smooth Crossfade: lower volume momentarily and switch
    if (this.masterGain && !this.isMuted) {
      const now = ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.02, now + 0.12);
      this.masterGain.gain.linearRampToValueAtTime(this.bgmVolume, now + 0.35);
    }

    // Reset loop pointer
    this.currentStep = 0;
    this.nextStepTime = ctx.currentTime + 0.05;

    // Start timer loop
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
    }
    this.timerId = window.setInterval(() => this.schedulerLoop(), this.lookaheadIntervalMs);
  }

  public stop() {
    this.isPlaying = false;
    this.currentTrackName = null;
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.linearRampToValueAtTime(0, now + 0.15);
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public resume() {
    if (this.currentTrackName) {
      this.playTrack(this.currentTrackName);
    } else {
      this.playTrack('MENU');
    }
  }

  /* --------------------------------------------------------------------------
     LOOKAHEAD NOTE SCHEDULER
     -------------------------------------------------------------------------- */

  private schedulerLoop() {
    if (!this.isPlaying || !this.currentTrackName) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const track = TRACK_CATALOG[this.currentTrackName];
    if (!track) return;

    const secondsPerBeat = 60 / track.bpm;
    const stepDuration = secondsPerBeat / 4; // 16th note step

    // Schedule all notes within lookahead horizon
    while (this.nextStepTime < ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleStep(this.currentStep, this.nextStepTime, stepDuration, track);
      this.notifyBeat(this.currentStep, this.currentTrackName);

      this.nextStepTime += stepDuration;
      this.currentStep = (this.currentStep + 1) % track.stepsPerLoop;
    }
  }

  private scheduleStep(step: number, time: number, stepDuration: number, track: TrackData) {
    if (!this.ctx || !this.masterGain) return;

    const { lead, arp, bass, drums } = track.patterns;

    // 1. LEAD VOICE (Square Wave 1 - Melodic Lead)
    if (lead && lead[step]) {
      const freq = noteToFreq(lead[step]);
      if (freq) {
        this.playChiptuneNote({
          freq,
          startTime: time,
          duration: stepDuration * 1.5,
          type: 'square',
          volume: 0.22,
          decay: 0.85,
        });
      }
    }

    // 2. ARPEGGIO VOICE (Square Wave 2 - Retro Fast Arps)
    if (arp && arp[step]) {
      const freq = noteToFreq(arp[step]);
      if (freq) {
        this.playChiptuneNote({
          freq,
          startTime: time,
          duration: stepDuration * 0.9,
          type: 'square',
          volume: 0.13,
          decay: 0.6,
        });
      }
    }

    // 3. BASS VOICE (Triangle Wave - Warm Bouncy Bass)
    if (bass && bass[step]) {
      const freq = noteToFreq(bass[step]);
      if (freq) {
        this.playChiptuneNote({
          freq,
          startTime: time,
          duration: stepDuration * 1.8,
          type: 'triangle',
          volume: 0.35,
          decay: 0.9,
        });
      }
    }

    // 4. DRUM CHANNEL (Noise Percussion + 8-bit Kick)
    if (drums && drums[step]) {
      const drumType = drums[step];
      if (drumType === 'K' || drumType === 'KS') {
        this.playChiptuneKick(time);
      }
      if (drumType === 'S' || drumType === 'KS') {
        this.playChiptuneSnare(time);
      }
      if (drumType === 'H') {
        this.playChiptuneHiHat(time);
      }
    }
  }

  /* --------------------------------------------------------------------------
     PROCEDURAL INSTRUMENT SYNTHESIS
     -------------------------------------------------------------------------- */

  private playChiptuneNote({
    freq,
    startTime,
    duration,
    type,
    volume,
    decay,
  }: {
    freq: number;
    startTime: number;
    duration: number;
    type: OscillatorType;
    volume: number;
    decay: number;
  }) {
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      // Fast vintage attack, followed by exponential decay
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * decay);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Audio node scheduling guard
    }
  }

  // 8-Bit Kick: rapid downward pitch sweep from 150Hz to 38Hz
  private playChiptuneKick(time: number) {
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(145, time);
      osc.frequency.exponentialRampToValueAtTime(38, time + 0.09);

      gain.gain.setValueAtTime(0.38, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 0.095);
    } catch {
      // guard
    }
  }

  // 8-Bit Snare: Bandpassed white noise with quick decay
  private playChiptuneSnare(time: number) {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;

    try {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, time);
      filter.Q.setValueAtTime(1.8, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.24, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.11);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(time);
      noise.stop(time + 0.12);
    } catch {
      // guard
    }
  }

  // 8-Bit Hi-Hat: Crisp highpass noise click
  private playChiptuneHiHat(time: number) {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;

    try {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(6500, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.09, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.035);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(time);
      noise.stop(time + 0.04);
    } catch {
      // guard
    }
  }

  /* --------------------------------------------------------------------------
     VOLUME & MUTE MANAGEMENT
     -------------------------------------------------------------------------- */

  public isBgmPlaying(): boolean {
    return this.isPlaying && !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('starmath_bgm_muted', String(muted));

    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : this.bgmVolume, now + 0.08);
    }

    if (!muted && this.isPlaying && this.currentTrackName) {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }
  }

  public getVolume(): number {
    return this.bgmVolume;
  }

  public setVolume(val: number) {
    const clamped = Math.max(0, Math.min(1, val));
    this.bgmVolume = clamped;
    localStorage.setItem('starmath_bgm_volume', String(clamped));

    if (this.masterGain && this.ctx && !this.isMuted) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(clamped, now + 0.05);
    }
  }

  public getCurrentTrack(): BgmTrackName | null {
    return this.currentTrackName;
  }

  /* --------------------------------------------------------------------------
     BEAT LISTENERS (Visualizer integration)
     -------------------------------------------------------------------------- */

  public addBeatListener(cb: (step: number, track: BgmTrackName) => void) {
    this.beatListeners.add(cb);
  }

  public removeBeatListener(cb: (step: number, track: BgmTrackName) => void) {
    this.beatListeners.delete(cb);
  }

  private notifyBeat(step: number, track: BgmTrackName) {
    if (this.beatListeners.size === 0) return;
    this.beatListeners.forEach((cb) => {
      try {
        cb(step, track);
      } catch {
        // listener guard
      }
    });
  }
}

export const bgm = new BgmEngine();
