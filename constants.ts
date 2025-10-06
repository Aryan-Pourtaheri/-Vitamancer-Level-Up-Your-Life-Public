import { PlayerProfile, CharacterClass } from './types';

export const xpForLevel = (lvl: number): number => Math.floor(100 * Math.pow(lvl, 1.5));

export const createInitialPlayerProfile = (userId: string, characterClass: string, name: string, avatarSeed: string): Omit<PlayerProfile, 'created_at'> => ({
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
  avatar_seed: avatarSeed,
  stats: {
    str: 10,
    int: 5,
    def: 8,
    spd: 7,
  },
  inventory: [{ id: 'potion1', name: 'Health Potion', description: 'Restores 50 HP.' }],
});

export const CHARACTER_CLASSES: CharacterClass[] = [
  {
    name: 'Warrior',
    description: 'A master of arms, excelling in strength and defense.',
    spriteUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=warrior',
  },
  {
    name: 'Mage',
    description: 'A wielder of powerful magic, with high intelligence.',
    spriteUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=mage',
  },
  {
    name: 'Rogue',
    description: 'A swift and cunning fighter, specializing in speed.',
    spriteUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=rogue',
  },
  {
    name: 'Cleric',
    description: 'A divine agent who heals allies and smites foes.',
    spriteUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=cleric',
  },
   {
    name: 'Archer',
    description: 'A marksman with unparalleled accuracy and speed.',
    spriteUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=archer',
  },
   {
    name: 'Paladin',
    description: 'A holy knight bound by an oath to protect the innocent.',
    spriteUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=paladin',
  },
];
