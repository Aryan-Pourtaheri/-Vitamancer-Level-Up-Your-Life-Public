

import { PlayerProfile, CharacterClass, AvatarOptions, Stats, Specialization, Skill } from './types';

export const xpForLevel = (lvl: number): number => Math.floor(100 * Math.pow(lvl, 1.5));

export const createInitialPlayerProfile = (userId: string, characterClass: string, name: string, avatarOptions: AvatarOptions, stats: Stats): Omit<PlayerProfile, 'created_at' | 'pro_features_unlocked_at' | 'last_monster_generation_at'> => {
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
    subscription_tier: 'free',
    specialization: null,
    skill_points: 0,
    skills: [],
  };
};

export const CHARACTER_CLASSES: CharacterClass[] = [
  {
    name: 'Warrior',
    description: 'A master of arms, excelling in strength and defense.',
    avatar: { skinColor: '#c09f8e', hairColor: '#4a312c', hairStyle: 'spiky', outfitColor: '#8B0000', accentColor: '#FFD700', eyeStyle: 'angry', hat: false, weapon: 'sword', cloak: true },
    baseStats: { str: 10, int: 4, def: 10, spd: 6 },
  },
  {
    name: 'Mage',
    description: 'A wielder of powerful magic, with high intelligence.',
    avatar: { skinColor: '#d5a38a', hairColor: '#ffffff', hairStyle: 'long', outfitColor: '#483D8B', accentColor: '#AFEEEE', eyeStyle: 'normal', hat: true, weapon: 'staff', cloak: true },
    baseStats: { str: 4, int: 12, def: 6, spd: 8 },
  },
  {
    name: 'Rogue',
    description: 'A swift and cunning fighter, specializing in speed.',
    avatar: { skinColor: '#e8b3a5', hairColor: '#2c222b', hairStyle: 'short', outfitColor: '#2F4F4F', accentColor: '#708090', eyeStyle: 'sleepy', hat: false, weapon: 'none', cloak: false },
    baseStats: { str: 8, int: 5, def: 5, spd: 12 },
  },
  {
    name: 'Cleric',
    description: 'A divine agent who heals allies and smites foes.',
    avatar: { skinColor: '#f2d3b1', hairColor: '#e5cc28', hairStyle: 'bun', outfitColor: '#F5F5DC', accentColor: '#DAA520', eyeStyle: 'happy', hat: false, weapon: 'staff', cloak: true },
    baseStats: { str: 5, int: 10, def: 9, spd: 6 },
  },
  {
    name: 'Archer',
    description: 'A marksman with unparalleled accuracy and speed.',
    avatar: { skinColor: '#d3a089', hairColor: '#b0632b', hairStyle: 'mohawk', outfitColor: '#006400', accentColor: '#CD853F', eyeStyle: 'normal', hat: false, weapon: 'bow', cloak: false },
    baseStats: { str: 9, int: 4, def: 6, spd: 11 },
  },
  {
    name: 'Paladin',
    description: 'A holy knight bound by an oath to protect the innocent.',
    avatar: { skinColor: '#c09f8e', hairColor: '#cb7a36', hairStyle: 'short', outfitColor: '#E6E6FA', accentColor: '#FFD700', eyeStyle: 'normal', hat: false, weapon: 'sword', cloak: true },
    baseStats: { str: 9, int: 7, def: 11, spd: 3 },
  },
];


export const SPECIALIZATIONS: Specialization[] = [
    // Warrior Paths
    { name: 'Berserker', description: 'Embrace rage for overwhelming power.', baseClass: 'Warrior', statBonus: { str: 3, spd: 1 } },
    { name: 'Guardian', description: 'An unbreakable shield for the party.', baseClass: 'Warrior', statBonus: { def: 3, str: 1 } },
    // Mage Paths
    { name: 'Elementalist', description: 'Command the raw forces of nature.', baseClass: 'Mage', statBonus: { int: 3, spd: 1 } },
    { name: 'Enchanter', description: 'Weave intricate spells to bolster allies.', baseClass: 'Mage', statBonus: { int: 2, def: 2 } },
    // Rogue Paths
    { name: 'Assassin', description: 'A master of silent, deadly strikes.', baseClass: 'Rogue', statBonus: { spd: 3, str: 1 } },
    { name: 'Trickster', description: 'Outsmart and outmaneuver any foe.', baseClass: 'Rogue', statBonus: { spd: 2, int: 2 } },
    // Cleric Paths
    { name: 'Priest', description: 'A beacon of pure healing light.', baseClass: 'Cleric', statBonus: { int: 3, def: 1 } },
    { name: 'Inquisitor', description: 'Purge the wicked with holy fire.', baseClass: 'Cleric', statBonus: { int: 2, str: 2 } },
    // Archer Paths
    { name: 'Sharpshooter', description: 'Land impossible shots from any distance.', baseClass: 'Archer', statBonus: { spd: 3, str: 1 } },
    { name: 'Ranger', description: 'A survivalist who is one with the wild.', baseClass: 'Archer', statBonus: { spd: 2, def: 2 } },
    // Paladin Paths
    { name: 'Crusader', description: 'A relentless champion of their divine cause.', baseClass: 'Paladin', statBonus: { str: 3, def: 1 } },
    { name: 'Vanguard', description: 'Lead the charge and protect the front line.', baseClass: 'Paladin', statBonus: { def: 3, int: 1 } },
];

export const SKILL_TREES: Record<string, Skill[]> = {
    'Berserker': [
        { id: 'ber_s1', name: 'Rampage', description: 'Your inner fury manifests as raw power.', cost: 1, statBonus: { str: 2 } },
        { id: 'ber_s2', name: 'Adrenaline Rush', description: 'Move with surprising quickness in the heat of battle.', cost: 1, statBonus: { spd: 2 } },
        { id: 'ber_s3', name: 'Brutal Strength', description: 'Hone your might to a razor edge.', cost: 2, statBonus: { str: 5 }, dependencies: ['ber_s1'] },
        { id: 'ber_s4', name: 'Tireless Assault', description: 'You never seem to run out of stamina.', cost: 3, statBonus: { spd: 3, str: 2 }, dependencies: ['ber_s2', 'ber_s3'] },
    ],
    'Guardian': [
        { id: 'gua_s1', name: 'Iron Wall', description: 'Your defensive stance is nearly unbreakable.', cost: 1, statBonus: { def: 2 } },
        { id: 'gua_s2', name: 'Vigor', description: 'You can endure more punishment than most.', cost: 1, statBonus: { str: 1, def: 1 } },
        { id: 'gua_s3', name: 'Unmovable Object', description: 'Become a true bastion of defense.', cost: 2, statBonus: { def: 5 }, dependencies: ['gua_s1'] },
        { id: 'gua_s4', name: 'Retaliate', description: 'For every blow you receive, you return one with interest.', cost: 3, statBonus: { str: 3, def: 2 }, dependencies: ['gua_s2', 'gua_s3'] },
    ],
    // Empty trees for other classes for now
    'Elementalist': [], 'Enchanter': [], 'Assassin': [], 'Trickster': [],
    'Priest': [], 'Inquisitor': [], 'Sharpshooter': [], 'Ranger': [],
    'Crusader': [], 'Vanguard': [],
};