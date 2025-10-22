
import { PlayerProfile, CharacterClass, AvatarOptions, Stats } from './types';

export const xpForLevel = (lvl: number): number => Math.floor(100 * Math.pow(lvl, 1.5));

export const createInitialPlayerProfile = (userId: string, characterClass: string, name: string, avatarOptions: AvatarOptions, stats: Stats): Omit<PlayerProfile, 'created_at'> => {
  return {
    id: userId,
    name: name,
    level: 1,
    xp: 0,
    hp: 100 + (stats.def * 5),
    maxHp: 100 + (stats.def * 5),
    mp: 50 + (stats.int * 3),
    maxMp: 50 + (stats.int * 3),
    gold: 10,
    characterClass: characterClass,
    avatar_options: avatarOptions,
    stats: stats,
    inventory: [{ id: 'potion1', name: 'Health Potion', description: 'Restores 50 HP.' }],
  };
};

export const CHARACTER_CLASSES: CharacterClass[] = [
  {
    name: 'Warrior',
    description: 'A master of arms, excelling in strength and defense.',
    avatar: { skinColor: '#c09f8e', hairColor: '#4a312c', hairStyle: 'spiky', outfitColor: '#8B0000', accentColor: '#FFD700', eyeStyle: 'angry', hat: false, weapon: 'sword', cloak: true },
  },
  {
    name: 'Mage',
    description: 'A wielder of powerful magic, with high intelligence.',
    avatar: { skinColor: '#d5a38a', hairColor: '#ffffff', hairStyle: 'long', outfitColor: '#483D8B', accentColor: '#AFEEEE', eyeStyle: 'normal', hat: true, weapon: 'staff', cloak: true },
  },
  {
    name: 'Rogue',
    description: 'A swift and cunning fighter, specializing in speed.',
    avatar: { skinColor: '#e8b3a5', hairColor: '#2c222b', hairStyle: 'short', outfitColor: '#2F4F4F', accentColor: '#708090', eyeStyle: 'sleepy', hat: false, weapon: 'none', cloak: false },
  },
  {
    name: 'Cleric',
    description: 'A divine agent who heals allies and smites foes.',
    avatar: { skinColor: '#f2d3b1', hairColor: '#e5cc28', hairStyle: 'bun', outfitColor: '#F5F5DC', accentColor: '#DAA520', eyeStyle: 'happy', hat: false, weapon: 'staff', cloak: true },
  },
  {
    name: 'Archer',
    description: 'A marksman with unparalleled accuracy and speed.',
    avatar: { skinColor: '#d3a089', hairColor: '#b0632b', hairStyle: 'mohawk', outfitColor: '#006400', accentColor: '#CD853F', eyeStyle: 'normal', hat: false, weapon: 'bow', cloak: false },
  },
  {
    name: 'Paladin',
    description: 'A holy knight bound by an oath to protect the innocent.',
    avatar: { skinColor: '#c09f8e', hairColor: '#cb7a36', hairStyle: 'short', outfitColor: '#E6E6FA', accentColor: '#FFD700', eyeStyle: 'normal', hat: false, weapon: 'sword', cloak: true },
  },
];