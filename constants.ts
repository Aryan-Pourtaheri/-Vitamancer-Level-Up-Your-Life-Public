import { PlayerProfile, CharacterClass, AvatarOptions, Stats } from './types';

export const xpForLevel = (lvl: number): number => Math.floor(100 * Math.pow(lvl, 1.5));

export const createInitialPlayerProfile = (userId: string, characterClass: string, name: string, avatarOptions: AvatarOptions): Omit<PlayerProfile, 'created_at'> => {
  const classData = CHARACTER_CLASSES.find(c => c.name === characterClass);
  const baseStats: Stats = classData ? classData.stats : { str: 10, int: 10, def: 10, spd: 10 }; // Fallback

  return {
    id: userId,
    name: name,
    level: 1,
    xp: 0,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    gold: 10,
    characterClass: characterClass,
    avatar_options: avatarOptions,
    stats: baseStats,
    inventory: [{ id: 'potion1', name: 'Health Potion', description: 'Restores 50 HP.' }],
  };
};

const baseUrl = 'https://api.dicebear.com/8.x/adventurer/svg';

export const CHARACTER_CLASSES: CharacterClass[] = [
  {
    name: 'Warrior',
    description: 'A master of arms, excelling in strength and defense.',
    spriteUrl: `${baseUrl}?seed=warrior&head=helmet&outfit=armor&skinColor=c09f8e`,
    stats: { str: 15, int: 5, def: 12, spd: 8 },
  },
  {
    name: 'Mage',
    description: 'A wielder of powerful magic, with high intelligence.',
    spriteUrl: `${baseUrl}?seed=mage&head=hood&outfit=shirt&hairColor=2c222b&skinColor=d5a38a`,
    stats: { str: 5, int: 15, def: 8, spd: 12 },
  },
  {
    name: 'Rogue',
    description: 'A swift and cunning fighter, specializing in speed.',
    spriteUrl: `${baseUrl}?seed=rogue&head=hood&outfit=vest&hair=short10&skinColor=e8b3a5`,
    stats: { str: 10, int: 8, def: 9, spd: 15 },
  },
  {
    name: 'Cleric',
    description: 'A divine agent who heals allies and smites foes.',
    spriteUrl: `${baseUrl}?seed=cleric&hair=short01&hairColor=e5cc28&skinColor=f2d3b1`,
    stats: { str: 9, int: 12, def: 11, spd: 8 },
  },
   {
    name: 'Archer',
    description: 'A marksman with unparalleled accuracy and speed.',
    spriteUrl: `${baseUrl}?seed=archer&head=cap&outfit=shirt&hair=short14&skinColor=d3a089`,
    stats: { str: 11, int: 9, def: 8, spd: 14 },
  },
   {
    name: 'Paladin',
    description: 'A holy knight bound by an oath to protect the innocent.',
    spriteUrl: `${baseUrl}?seed=paladin&head=helmet&outfit=armor&hairColor=b0632b&skinColor=c09f8e`,
    stats: { str: 13, int: 8, def: 14, spd: 5 },
  },
];

export const AVATAR_OPTIONS = {
  eyes: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09', 'variant10'],
  mouth: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant09', 'variant10', 'variant11', 'variant13'],
  hair: ['long01', 'long02', 'long05', 'long06', 'short01', 'short05', 'short14', 'short18', 'short21', 'short22', 'short24'],
  backgroundColors: [
    'b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf', 'transparent'
  ]
};