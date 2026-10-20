import { Costume, DifficultyConfig, DifficultyMode, MathProblem, Pilot, SectorConfig, StageRewardItem } from '../types/game';

export const PILOT_AVATARS = {
  bunny: '/src/assets/images/pilot_bunny_1792244638803.jpg',
  kitten: '/src/assets/images/pilot_kitten_1792244640191.jpg',
  puppy: '/src/assets/images/pilot_puppy_1792244641016.jpg',
  nebulaBg: '/src/assets/images/cosmic_nebula_1792244641172.jpg',
};

export const DIFFICULTY_CONFIGS: Record<DifficultyMode, DifficultyConfig> = {
  EASY: {
    mode: 'EASY',
    name: 'Easy',
    thaiName: 'โหมดง่าย',
    baseSeconds: 60,
    gachaRollsOnVictory: 1,
    color: '#10B981',
    badgeBg: 'bg-emerald-500/20',
    badgeBorder: 'border-emerald-500/40 text-emerald-300',
    description: 'เวลา 60s ต่อด่าน · ชนะสุ่มกล่องสมบัติ 1 ครั้ง',
  },
  NORMAL: {
    mode: 'NORMAL',
    name: 'Normal',
    thaiName: 'โหมดทั่วไป',
    baseSeconds: 45,
    gachaRollsOnVictory: 1,
    color: '#0284C7',
    badgeBg: 'bg-sky-500/20',
    badgeBorder: 'border-sky-500/40 text-sky-300',
    description: 'เวลา 45s ต่อด่าน · ชนะสุ่มกล่องสมบัติ 1 ครั้ง',
  },
  HARD: {
    mode: 'HARD',
    name: 'Hard',
    thaiName: 'โหมดยาก',
    baseSeconds: 30,
    gachaRollsOnVictory: 2,
    color: '#F43F5E',
    badgeBg: 'bg-rose-500/20',
    badgeBorder: 'border-rose-500/40 text-rose-300',
    description: 'เวลา 30s ต่อด่าน · ชนะสุ่มกล่องสมบัติ 2 ครั้ง!',
  },
};

export const PILOTS: Pilot[] = [
  {
    id: 'bunny',
    name: 'Bibi Bunny',
    thaiName: 'กระต่าย บีบี้',
    avatarUrl: PILOT_AVATARS.bunny,
    color: '#F472B6',
  },
  {
    id: 'kitten',
    name: 'Mimi Kitten',
    thaiName: 'ลูกแมว มีมี่',
    avatarUrl: PILOT_AVATARS.kitten,
    color: '#38BDF8',
  },
  {
    id: 'puppy',
    name: 'Poko Pup',
    thaiName: 'น้องหมา โปโกะ',
    avatarUrl: PILOT_AVATARS.puppy,
    color: '#34D399',
  },
];

export const COSTUME_FULL_IMAGES: Record<string, string> = {
  // 🐰 Bibi Bunny (5 Costumes)
  bunny_classic: '/src/assets/images/bunny_full_classic_1792251016879.jpg',
  bunny_rainbow: '/src/assets/images/bunny_full_rainbow_1792251016930.jpg',
  bunny_princess: '/src/assets/images/bunny_full_princess_1792251038230.jpg',
  bunny_dino: '/src/assets/images/bunny_full_dino_1792251017487.jpg',
  bunny_wizard: '/src/assets/images/bunny_full_wizard_1792251038449.jpg',

  // 🐱 Mimi Kitten (5 Costumes)
  kitten_classic: '/src/assets/images/kitten_full_classic_1792251039196.jpg',
  kitten_music: '/src/assets/images/kitten_full_music_1792251040042.jpg',
  kitten_hero: '/src/assets/images/kitten_full_hero_1792251017312.jpg',
  kitten_icecream: '/src/assets/images/kitten_full_icecream_1792251071228.jpg',
  kitten_ninja: '/src/assets/images/kitten_full_ninja_1792251072549.jpg',

  // 🐶 Poko Pup (5 Costumes)
  puppy_classic: '/src/assets/images/puppy_full_classic_1792251073402.jpg',
  puppy_angel: '/src/assets/images/puppy_full_angel_1792251040037.jpg',
  puppy_lion: '/src/assets/images/puppy_full_lion_1792251074114.jpg',
  puppy_mecha: '/src/assets/images/puppy_full_mecha_1792251018069.jpg',
  puppy_detective: '/src/assets/images/puppy_full_detective_1792251073194.jpg',
};

export const COSTUMES: Costume[] = [
  // --- 🐰 Bibi Bunny (5 Costumes) ---
  {
    id: 'bunny_classic',
    pilotId: 'bunny',
    name: 'ชุดนักบินสีชมพู',
    title: 'นักบินอวกาศดั้งเดิม',
    emoji: '🚀',
    imageUrl: COSTUME_FULL_IMAGES.bunny_classic,
    badgeColor: 'bg-pink-500',
    attackName: 'เลเซอร์ดาวชมพู',
    attackEmoji: '✨',
    attackColor: '#F472B6',
    bonusHp: 3,
    timeSeconds: 60,
    cutAssistCharges: 1,
    shieldBonus: 0,
    unlocked: true,
    unlockCondition: 'ชุดเริ่มต้น',
  },
  {
    id: 'bunny_rainbow',
    pilotId: 'bunny',
    name: 'ชุดกระต่ายสายรุ้ง',
    title: 'เทพธิดาสายรุ้ง',
    emoji: '🌈',
    imageUrl: COSTUME_FULL_IMAGES.bunny_rainbow,
    badgeColor: 'bg-purple-500',
    attackName: 'ลำแสงสายรุ้ง',
    attackEmoji: '🌈',
    attackColor: '#C084FC',
    bonusHp: 3,
    timeSeconds: 70,
    cutAssistCharges: 1,
    shieldBonus: 0,
    unlocked: false,
    unlockCondition: 'สุ่มได้จากกาชาปอง',
  },
  {
    id: 'bunny_princess',
    pilotId: 'bunny',
    name: 'มงกุฎเจ้าหญิงดวงดาว',
    title: 'เจ้าหญิงแห่งกาแล็กซี',
    emoji: '👑',
    imageUrl: COSTUME_FULL_IMAGES.bunny_princess,
    badgeColor: 'bg-yellow-400',
    attackName: 'ประกายดาวทองคำ',
    attackEmoji: '⭐',
    attackColor: '#FACC15',
    bonusHp: 4,
    timeSeconds: 60,
    cutAssistCharges: 2,
    shieldBonus: 0,
    unlocked: false,
    unlockCondition: 'สุ่มได้จากกาชาปอง',
  },
  {
    id: 'bunny_dino',
    pilotId: 'bunny',
    name: 'ชุดไดโนเสาร์จิ๋ว',
    title: 'ไดโนน้อยเกราะเขียว',
    emoji: '🦖',
    imageUrl: COSTUME_FULL_IMAGES.bunny_dino,
    badgeColor: 'bg-emerald-500',
    attackName: 'เปลวไฟมังกรเขียว',
    attackEmoji: '🔥',
    attackColor: '#34D399',
    bonusHp: 4,
    timeSeconds: 60,
    cutAssistCharges: 1,
    shieldBonus: 1,
    unlocked: false,
    unlockCondition: 'สุ่มได้จากกาชาปอง',
  },
  {
    id: 'bunny_wizard',
    pilotId: 'bunny',
    name: 'จอมเวทกาลเวลา',
    title: 'จอมเวทผู้หยุดเวลา',
    emoji: '🧙',
    imageUrl: COSTUME_FULL_IMAGES.bunny_wizard,
    badgeColor: 'bg-indigo-600',
    attackName: 'ลูกแก้วเวทมนตร์',
    attackEmoji: '🔮',
    attackColor: '#818CF8',
    bonusHp: 3,
    timeSeconds: 75,
    cutAssistCharges: 2,
    shieldBonus: 0,
    unlocked: false,
    unlockCondition: 'สุ่มได้จากกาชาปอง',
  },

  // --- 🐱 Mimi Kitten (5 Costumes) ---
  {
    id: 'kitten_classic',
    pilotId: 'kitten',
    name: 'ชุดนักบินสีฟ้าคราม',
    title: 'นักบินอวกาศดั้งเดิม',
    emoji: '🚀',
    imageUrl: COSTUME_FULL_IMAGES.kitten_classic,
    badgeColor: 'bg-sky-500',
    attackName: 'เลเซอร์ฟ้าคราม',
    attackEmoji: '💠',
    attackColor: '#38BDF8',
    bonusHp: 3,
    timeSeconds: 60,
    cutAssistCharges: 1,
    shieldBonus: 0,
    unlocked: true,
    unlockCondition: 'ชุดเริ่มต้น',
  },
  {
    id: 'kitten_music',
    pilotId: 'kitten',
    name: 'หูฟังแมวดนตรี',
    title: 'ศิลปินดวงดาว',
    emoji: '🎵',
    imageUrl: COSTUME_FULL_IMAGES.kitten_music,
    badgeColor: 'bg-indigo-500',
    attackName: 'คลื่นโน้ตเพลงสายฟ้า',
    attackEmoji: '🎶',
    attackColor: '#6366F1',
    bonusHp: 3,
    timeSeconds: 68,
    cutAssistCharges: 1,
    shieldBonus: 0,
    unlocked: false,
    unlockCondition: 'สุ่มได้จากกาชาปอง',
  },
  {
    id: 'kitten_hero',
    pilotId: 'kitten',
    name: 'ฮีโร่หน้ากากสายฟ้า',
    title: 'ผู้พิทักษ์แห่งจักรวาล',
    emoji: '⚡',
    imageUrl: COSTUME_FULL_IMAGES.kitten_hero,
    badgeColor: 'bg-amber-500',
    attackName: 'สายฟ้าพิฆาต',
    attackEmoji: '⚡',
    attackColor: '#F59E0B',
    bonusHp: 3,
    timeSeconds: 60,
    cutAssistCharges: 2,
    shieldBonus: 0,
    unlocked: false,
    unlockCondition: 'สุ่มได้จากกาชาปอง',
  },
  {
    id: 'kitten_icecream',
    pilotId: 'kitten',
    name: 'หมวกไอศกรีมพาสเทล',
    title: 'แม่ครัวของหวานอวกาศ',
    emoji: '🍦',
    imageUrl: COSTUME_FULL_IMAGES.kitten_icecream,
    badgeColor: 'bg-pink-400',
    attackName: 'เกล็ดหิมะหวานชื่น',
    attackEmoji: '❄️',
    attackColor: '#F472B6',
    bonusHp: 4,
    timeSeconds: 70,
    cutAssistCharges: 1,
    shieldBonus: 0,
    unlocked: false,
    unlockCondition: 'สุ่มได้จากกาชาปอง',
  },
  {
    id: 'kitten_ninja',
    pilotId: 'kitten',
    name: 'นินจาความไวแสง',
    title: 'จอมยุทธเหมียวเงา',
    emoji: '🥷',
    imageUrl: COSTUME_FULL_IMAGES.kitten_ninja,
    badgeColor: 'bg-slate-700',
    attackName: 'ดาวกระจายว่องไว',
    attackEmoji: '💫',
    attackColor: '#94A3B8',
    bonusHp: 3,
    timeSeconds: 75,
    cutAssistCharges: 1,
    shieldBonus: 1,
    unlocked: false,
    unlockCondition: 'สุ่มได้จากกาชาปอง',
  },

  // --- 🐶 Poko Pup (5 Costumes) ---
  {
    id: 'puppy_classic',
    pilotId: 'puppy',
    name: 'แว่นตานักบินดาว',
    title: 'นักบินอวกาศดั้งเดิม',
    emoji: '🚀',
    imageUrl: COSTUME_FULL_IMAGES.puppy_classic,
    badgeColor: 'bg-emerald-500',
    attackName: 'ฟองสบู่ดาวมรกต',
    attackEmoji: '🫧',
    attackColor: '#34D399',
    bonusHp: 3,
    timeSeconds: 60,
    cutAssistCharges: 1,
    shieldBonus: 0,
    unlocked: true,
    unlockCondition: 'ชุดเริ่มต้น',
  },
  {
    id: 'puppy_angel',
    pilotId: 'puppy',
    name: 'ปีกนางฟ้าทองคำ',
    title: 'เทพผู้พิทักษ์',
    emoji: '🪽',
    imageUrl: COSTUME_FULL_IMAGES.puppy_angel,
    badgeColor: 'bg-yellow-400',
    attackName: 'ขนนกศักดิ์สิทธิ์',
    attackEmoji: '🪽',
    attackColor: '#FDE047',
    bonusHp: 4,
    timeSeconds: 60,
    cutAssistCharges: 1,
    shieldBonus: 0,
    unlocked: false,
    unlockCondition: 'สุ่มได้จากกาชาปอง',
  },
  {
    id: 'puppy_lion',
    pilotId: 'puppy',
    name: 'สิงโตเจ้าป่า',
    title: 'ราชันย์สิงโตสุริยะ',
    emoji: '🦁',
    imageUrl: COSTUME_FULL_IMAGES.puppy_lion,
    badgeColor: 'bg-orange-500',
    attackName: 'กรงเล็บสุริยะ',
    attackEmoji: '🐾',
    attackColor: '#FB923C',
    bonusHp: 4,
    timeSeconds: 60,
    cutAssistCharges: 1,
    shieldBonus: 1,
    unlocked: false,
    unlockCondition: 'สุ่มได้จากกาชาปอง',
  },
  {
    id: 'puppy_mecha',
    pilotId: 'puppy',
    name: 'โล่เกราะเหล็กอวกาศ',
    title: 'หุ่นยนต์เกราะหนาพิเศษ',
    emoji: '🤖',
    imageUrl: COSTUME_FULL_IMAGES.puppy_mecha,
    badgeColor: 'bg-cyan-600',
    attackName: 'มิสไซล์ดาวพลังสูง',
    attackEmoji: '🚀',
    attackColor: '#06B6D4',
    bonusHp: 5,
    timeSeconds: 60,
    cutAssistCharges: 0,
    shieldBonus: 1,
    unlocked: false,
    unlockCondition: 'สุ่มได้จากกาชาปอง',
  },
  {
    id: 'puppy_detective',
    pilotId: 'puppy',
    name: 'นักสืบตัวเลข',
    title: 'ยอดนักสืบอัจฉริยะ',
    emoji: '🔍',
    imageUrl: COSTUME_FULL_IMAGES.puppy_detective,
    badgeColor: 'bg-amber-600',
    attackName: 'เลนส์ส่องสว่างคำตอบ',
    attackEmoji: '💡',
    attackColor: '#F59E0B',
    bonusHp: 3,
    timeSeconds: 60,
    cutAssistCharges: 3,
    shieldBonus: 0,
    unlocked: false,
    unlockCondition: 'สุ่มได้จากกาชาปอง',
  },
];

export const SECTORS: SectorConfig[] = [
  {
    sector: 1,
    name: 'Sugar Moon',
    thaiName: 'ดาวพระจันทร์น้ำตาล (+1)',
    targetQuota: 8,
    themeColor: '#EC4899',
    accentColor: '#F472B6',
    bossName: 'บอสโมจิยักษ์',
    bossEmoji: '🍡',
    warpCostTickets: 0, // Floor 1 is always free to start
  },
  {
    sector: 2,
    name: 'Berry Ring',
    thaiName: 'วงแหวนเบอร์รี่ (+2)',
    targetQuota: 8,
    themeColor: '#8B5CF6',
    accentColor: '#A78BFA',
    bossName: 'บอสเยลลี่ดึ๋งดั๋ง',
    bossEmoji: '🍇',
    warpCostTickets: 1,
  },
  {
    sector: 3,
    name: 'Citrus Comet',
    thaiName: 'ดาวหางส้มหวาน (+3)',
    targetQuota: 8,
    themeColor: '#F59E0B',
    accentColor: '#FBBF24',
    bossName: 'บอสส้มจี๊ดจ๊าด',
    bossEmoji: '🍊',
    warpCostTickets: 2,
  },
  {
    sector: 4,
    name: 'Emerald Orbit',
    thaiName: 'วงโคจรมรกต (+4)',
    targetQuota: 8,
    themeColor: '#10B981',
    accentColor: '#34D399',
    bossName: 'บอสแพนด้าจักรกล',
    bossEmoji: '🐼',
    warpCostTickets: 3,
  },
  {
    sector: 5,
    name: 'Rainbow Supernova',
    thaiName: 'ซูเปอร์โนวาสายรุ้ง (+5)',
    targetQuota: 10,
    themeColor: '#06B6D4',
    accentColor: '#22D3EE',
    bossName: 'บอสวาฬอวกาศ',
    bossEmoji: '🐳',
    warpCostTickets: 4,
  },
  {
    sector: 6,
    name: 'Starlight Nebula',
    thaiName: 'เนบิวลาแสงดาว (+6)',
    targetQuota: 10,
    themeColor: '#6366F1',
    accentColor: '#818CF8',
    bossName: 'บอสหมียักษ์สายฟ้า',
    bossEmoji: '🐻',
    warpCostTickets: 5,
  },
  {
    sector: 7,
    name: 'Crystal Aurora',
    thaiName: 'แสงเหนือคริสตัล (+7)',
    targetQuota: 10,
    themeColor: '#D946EF',
    accentColor: '#E879F9',
    bossName: 'บอสมังกรแก้ว',
    bossEmoji: '🐲',
    warpCostTickets: 6,
  },
  {
    sector: 8,
    name: 'Marshmallow Galaxy',
    thaiName: 'กาแล็กซีมาร์ชเมลโลว์ (+8)',
    targetQuota: 10,
    themeColor: '#F43F5E',
    accentColor: '#FB7185',
    bossName: 'บอสโดนัทลอยฟ้า',
    bossEmoji: '🍩',
    warpCostTickets: 7,
  },
  {
    sector: 9,
    name: 'Solar Crown',
    thaiName: 'มงกุฎสุริยะ (+9)',
    targetQuota: 10,
    themeColor: '#EA580C',
    accentColor: '#FB923C',
    bossName: 'บอสสิงโตทองคำ',
    bossEmoji: '🦁',
    warpCostTickets: 8,
  },
  {
    sector: 10,
    name: 'Master Universe',
    thaiName: 'จักรวาลยอดนักบวก (+10)',
    targetQuota: 10,
    themeColor: '#EAB308',
    accentColor: '#FDE047',
    bossName: 'จักรพรรดิดวงดาว',
    bossEmoji: '🌟',
    warpCostTickets: 9,
  },
];

/**
 * Rolls a reward item from the post-victory Cosmic Treasure Chest.
 */
export function rollVictoryChestReward(
  unlockedCostumes: string[],
  currentHp: number,
  maxHp: number,
  cutAssistRemaining: number,
  maxCutAssist: number
): StageRewardItem {
  const roll = Math.random();
  const needHp = currentHp < maxHp;
  const needCut = cutAssistRemaining < maxCutAssist;

  // 1. HP Refill if injured
  if (needHp && roll < 0.35) {
    const hpVal = Math.random() < 0.4 && maxHp - currentHp >= 2 ? 2 : 1;
    return {
      id: `reward_hp_${Date.now()}_${Math.random()}`,
      type: 'HP_REFILL',
      title: `ฟื้นฟูพลังชีวิต +${hpVal} ดวง ❤️`,
      description: `เติมพลังหัวใจเพื่อลุยต่อในด่านถัดไป! (ปัจจุบัน: ${Math.min(maxHp, currentHp + hpVal)}/${maxHp} ดวง)`,
      icon: '❤️',
      value: hpVal,
    };
  }

  // 2. Next Stage Time Bonus (+10, +15, +20s)
  if (roll < 0.58) {
    const timeBonusPool = [10, 15, 20];
    const timeVal = timeBonusPool[Math.floor(Math.random() * timeBonusPool.length)];
    return {
      id: `reward_time_${Date.now()}_${Math.random()}`,
      type: 'TIME_BONUS',
      title: `โบนัสเวลาด่านต่อไป +${timeVal} วินาที! ⏳`,
      description: `ด่านถัดไปจะได้รับเวลาพิเศษเพิ่มอีก +${timeVal}s ให้คิดอย่างสบายใจ!`,
      icon: '⏳',
      value: timeVal,
    };
  }

  // 3. Cut Assist charge refill +1
  if (needCut && roll < 0.72) {
    return {
      id: `reward_cut_${Date.now()}_${Math.random()}`,
      type: 'CUT_ASSIST',
      title: 'ฟื้นฟูสกิลตัดช้อยส์ +1 ครั้ง! 🪄',
      description: `ได้รับชาร์จตัวช่วยตัดคำตอบที่ผิดทิ้ง 1 ครั้งสำหรับด่านต่อไป! (ปัจจุบัน: ${Math.min(maxCutAssist, cutAssistRemaining + 1)}/${maxCutAssist})`,
      icon: '🪄',
      value: 1,
    };
  }

  // 4. Costume Roll (can roll any costume in game!)
  if (roll < 0.88) {
    const randomCostume = COSTUMES[Math.floor(Math.random() * COSTUMES.length)];
    const isAlreadyUnlocked = unlockedCostumes.includes(randomCostume.id);

    if (isAlreadyUnlocked) {
      // DUPLICATE COSTUME -> Converts to HP REFILL +1 or +2!
      const convertedHp = Math.random() < 0.5 ? 2 : 1;
      return {
        id: `reward_dup_costume_${Date.now()}_${Math.random()}`,
        type: 'DUPLICATE_CONVERT_HP',
        title: `สุ่มได้ชุดซ้ำ: ${randomCostume.name}!`,
        description: `มีชุดนี้แล้ว! พลังสกินเปลี่ยนเป็น "เติมพลังชีวิต +${convertedHp} ดวง" ทันที ❤️`,
        icon: '❤️',
        value: convertedHp,
        costume: randomCostume,
      };
    } else {
      // NEW COSTUME UNLOCKED!
      return {
        id: `reward_costume_${Date.now()}_${Math.random()}`,
        type: 'NEW_COSTUME',
        title: `ปลดล็อกสกินใหม่: ${randomCostume.name}! 🎴`,
        description: `ได้รับชุดคอสตูมตัวละครเต็มตัว 2D สไตล์ญี่ปุ่นใหม่ สวมใส่ได้ที่ตู้เสื้อผ้า!`,
        icon: randomCostume.emoji,
        costume: randomCostume,
      };
    }
  }

  // 5. Warp Tickets
  const ticketQty = Math.random() < 0.4 ? 2 : 1;
  return {
    id: `reward_tickets_${Date.now()}_${Math.random()}`,
    type: 'TICKETS',
    title: `ตั๋วดาววาร์ปอวกาศ +${ticketQty} ใบ! 🎫`,
    description: `สะสมไว้สำหรับใช้วาร์ปข้ามไปยังด่านที่เคยพิชิตแล้ว!`,
    icon: '🎫',
    value: ticketQty,
  };
}

/**
 * Generates an addition problem starting from the easiest operands,
 * building up in difficulty as the child progresses within the round!
 */
export function generateOrderedProblem(tableNum: number, stepIndex: number): MathProblem {
  const easyOperands = [1, 2, 1, 3, 2, 4, 3, 5, 4, 6, 5, 7, 6, 8, 7, 9, 8, 9];
  const primaryOperand = easyOperands[stepIndex % easyOperands.length];

  const flip = stepIndex % 2 === 1;
  const num1 = flip ? tableNum : primaryOperand;
  const num2 = flip ? primaryOperand : tableNum;
  const answer = num1 + num2;

  const distractors = new Set<number>();
  const candidates = [answer - 1, answer + 1, answer + 2, answer - 2];

  for (const c of candidates) {
    if (c > 0 && c !== answer) {
      distractors.add(c);
    }
    if (distractors.size >= 2) break;
  }

  while (distractors.size < 2) {
    const fallback = answer + (distractors.size === 0 ? 1 : 2);
    distractors.add(fallback);
  }

  const distractorArr = Array.from(distractors).slice(0, 2);
  const options = [answer, distractorArr[0], distractorArr[1]].sort(() => Math.random() - 0.5);
  const correctIndex = options.indexOf(answer);

  return {
    id: `prob_${num1}_${num2}_${stepIndex}_${Date.now()}`,
    num1,
    num2,
    answer,
    table: tableNum,
    options,
    correctIndex,
  };
}
