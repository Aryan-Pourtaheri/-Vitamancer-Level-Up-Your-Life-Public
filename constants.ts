

import { PlayerProfile, CharacterClass, AvatarOptions, Stats, Specialization, Skill, Item } from './types';

export const xpForLevel = (lvl: number): number => Math.floor(100 * Math.pow(lvl, 1.5));

export const createInitialPlayerProfile = (userId: string, characterClass: string, name: string, avatarOptions: AvatarOptions, stats: Stats): Omit<PlayerProfile, 'skill_points' | 'created_at' | 'pro_features_unlocked_at' | 'last_monster_generation_at'> => {
  return {
    id: userId,
    name: name,
    level: 1,
    xp: 0,
    hp: 100 + (stats.def * 5),
    maxHp: 100 + (stats.def * 5),
    mp: 50 + (stats.int * 3),
    maxMp: 50 + (stats.int * 3),
    gold: 50, // Increased starting gold for the shop
    characterClass: characterClass,
    avatar_options: avatarOptions,
    stats: stats,
    inventory: [],
    subscription_tier: 'free',
    specialization: null,
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
    avatar: { skinColor: '#e8b3a5', hairColor: '#2c222b', hairStyle: 'short', outfitColor: '#2F4F4F', accentColor: '#708090', eyeStyle: 'sleepy', hat: false, weapon: 'bow', cloak: false },
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
    'Elementalist': [
        { id: 'ele_s1', name: 'Arcane Affinity', description: 'Your connection to magic deepens.', cost: 1, statBonus: { int: 2 } },
        { id: 'ele_s2', name: 'Fireball', description: 'Unlock the classic spell of destructive fire.', cost: 1, statBonus: { int: 1, spd: 1 } },
        { id: 'ele_s3', name: 'Master of Elements', description: 'Your command over magic is absolute.', cost: 2, statBonus: { int: 5 }, dependencies: ['ele_s1'] },
        { id: 'ele_s4', name: 'Meteor Shower', description: 'Call down a rain of cosmic destruction.', cost: 3, statBonus: { int: 3, spd: 2 }, dependencies: ['ele_s2', 'ele_s3'] },
    ],
    'Enchanter': [
        { id: 'enc_s1', name: 'Arcane Ward', description: 'Weave protective magics around yourself.', cost: 1, statBonus: { def: 2 } },
        { id: 'enc_s2', name: 'Bolster', description: 'Enhance your physical and mental fortitude.', cost: 1, statBonus: { int: 1, def: 1 } },
        { id: 'enc_s3', name: 'Aegis of Protection', description: 'Your defensive enchantments are legendary.', cost: 2, statBonus: { def: 5 }, dependencies: ['enc_s1'] },
        { id: 'enc_s4', name: 'Spellshield', description: 'Your magic negates even the strongest attacks.', cost: 3, statBonus: { int: 2, def: 3 }, dependencies: ['enc_s2', 'enc_s3'] },
    ],
    'Assassin': [
        { id: 'ass_s1', name: 'Fleet Footed', description: 'You move like a shadow.', cost: 1, statBonus: { spd: 2 } },
        { id: 'ass_s2', name: 'Dagger Proficiency', description: 'Your strikes are swift and precise.', cost: 1, statBonus: { str: 1, spd: 1 } },
        { id: 'ass_s3', name: 'Lethal Precision', description: 'Every attack hits a vital point.', cost: 2, statBonus: { str: 5 }, dependencies: ['ass_s2'] },
        { id: 'ass_s4', name: 'Shadow Dance', description: 'Become an untouchable blur of motion.', cost: 3, statBonus: { spd: 5 }, dependencies: ['ass_s1', 'ass_s3'] },
    ],
    'Trickster': [
        { id: 'tri_s1', name: 'Quick Wits', description: 'You think and act faster than others.', cost: 1, statBonus: { int: 1, spd: 1 } },
        { id: 'tri_s2', name: 'Misdirection', description: 'Your movements are unpredictable and confusing.', cost: 1, statBonus: { spd: 2 } },
        { id: 'tri_s3', name: 'Cunning Plan', description: 'Outsmart your foes with superior tactics.', cost: 2, statBonus: { int: 4 }, dependencies: ['tri_s1'] },
        { id: 'tri_s4', name: 'Escape Artist', description: 'There is no trap or situation you cannot escape from.', cost: 3, statBonus: { spd: 3, int: 2 }, dependencies: ['tri_s2', 'tri_s3'] },
    ],
    'Priest': [
        { id: 'pri_s1', name: 'Healing Light', description: 'Your divine magic mends wounds.', cost: 1, statBonus: { int: 2 } },
        { id: 'pri_s2', name: 'Divine Protection', description: 'The gods shield you from harm.', cost: 1, statBonus: { def: 2 } },
        { id: 'pri_s3', name: 'Circle of Healing', description: 'Your healing power extends to all around you.', cost: 2, statBonus: { int: 5 }, dependencies: ['pri_s1'] },
        { id: 'pri_s4', name: 'Guardian Spirit', description: 'A divine entity watches over you.', cost: 3, statBonus: { int: 2, def: 3 }, dependencies: ['pri_s2', 'pri_s3'] },
    ],
    'Inquisitor': [
        { id: 'inq_s1', name: 'Righteous Fury', description: 'Channel divine anger into your attacks.', cost: 1, statBonus: { str: 2 } },
        { id: 'inq_s2', name: 'Holy Fire', description: 'Smite your enemies with divine flame.', cost: 1, statBonus: { int: 2 } },
        { id: 'inq_s3', name: 'Zealotry', description: 'Your conviction makes your strikes unstoppable.', cost: 2, statBonus: { str: 3, int: 2 }, dependencies: ['inq_s1', 'inq_s2'] },
        { id: 'inq_s4', name: 'Judgement', description: 'Deliver the final verdict upon your foes.', cost: 3, statBonus: { str: 3, int: 3 }, dependencies: ['inq_s3'] },
    ],
    'Sharpshooter': [
        { id: 'sha_s1', name: 'Eagle Eye', description: 'You can hit a target from incredible distances.', cost: 1, statBonus: { spd: 2 } },
        { id: 'sha_s2', name: 'Steady Hand', description: 'Your aim is true and unwavering.', cost: 1, statBonus: { str: 1, spd: 1 } },
        { id: 'sha_s3', name: 'Critical Shot', description: 'You know exactly where to aim for maximum damage.', cost: 2, statBonus: { str: 5 }, dependencies: ['sha_s2'] },
        { id: 'sha_s4', name: 'Rapid Fire', description: 'Loose a volley of arrows in the blink of an eye.', cost: 3, statBonus: { spd: 5 }, dependencies: ['sha_s1', 'sha_s3'] },
    ],
    'Ranger': [
        { id: 'ran_s1', name: 'Survivalist', description: 'You are adept at surviving in the wild.', cost: 1, statBonus: { def: 2 } },
        { id: 'ran_s2', name: 'Animal Companion', description: 'You have a loyal partner who aids you in battle.', cost: 1, statBonus: { spd: 1, def: 1 } },
        { id: 'ran_s3', name: 'Nature\'s Blessing', description: 'The wild itself protects you from harm.', cost: 2, statBonus: { def: 4 }, dependencies: ['ran_s1'] },
        { id: 'ran_s4', name: 'One with the Wild', description: 'You and your companion fight as one.', cost: 3, statBonus: { spd: 2, def: 3 }, dependencies: ['ran_s2', 'ran_s3'] },
    ],
    'Crusader': [
        { id: 'cru_s1', name: 'Holy Strike', description: 'Imbue your weapon with divine energy.', cost: 1, statBonus: { str: 2 } },
        { id: 'cru_s2', name: 'Unyielding Faith', description: 'Your belief protects you from the darkest magic.', cost: 1, statBonus: { def: 1, int: 1 } },
        { id: 'cru_s3', name: 'Divine Might', description: 'Become the avatar of your deity\'s strength.', cost: 2, statBonus: { str: 5 }, dependencies: ['cru_s1'] },
        { id: 'cru_s4', name: 'Sacred Ground', description: 'Consecrate the earth, empowering allies and smiting foes.', cost: 3, statBonus: { str: 2, def: 2, int: 1 }, dependencies: ['cru_s2', 'cru_s3'] },
    ],
    'Vanguard': [
        { id: 'van_s1', name: 'Shield Bash', description: 'Use your shield as a potent weapon.', cost: 1, statBonus: { def: 1, str: 1 } },
        { id: 'van_s2', name: 'Protector\'s Oath', description: 'You are sworn to defend the front line.', cost: 1, statBonus: { def: 2 } },
        { id: 'van_s3', name: 'Bastion of Light', description: 'Become an unbreakable wall of holy light.', cost: 2, statBonus: { def: 5 }, dependencies: ['van_s2'] },
        { id: 'van_s4', 'name': 'Divine Intervention', description: 'Call upon your deity to turn the tide of battle.', cost: 3, statBonus: { def: 3, int: 3 }, dependencies: ['van_s1', 'van_s3'] },
    ],
};

export const SHOP_ITEMS: Item[] = [
    {
        id: 'w_war_02',
        name: 'Steel Greatsword',
        description: 'A well-balanced and reliable greatsword, sharp enough to cleave through any obstacle.',
        cost: 100,
        type: 'weapon',
        statBonus: { str: 5 },
        allowedClasses: ['Warrior', 'Paladin'],
        weaponType: 'epic_sword',
    },
    {
        id: 'w_mag_02',
        name: 'Crystal Staff',
        description: 'A staff with a finely cut crystal that hums with latent magical energy.',
        cost: 100,
        type: 'weapon',
        statBonus: { int: 5 },
        allowedClasses: ['Mage', 'Cleric'],
        weaponType: 'epic_staff',
    },
    {
        id: 'w_rog_02',
        name: 'Elven Longbow',
        description: 'Crafted from yew wood and strung with enchanted silk, this bow is silent and deadly.',
        cost: 100,
        type: 'weapon',
        statBonus: { spd: 5 },
        allowedClasses: ['Rogue', 'Archer'],
        weaponType: 'epic_bow',
    },
];