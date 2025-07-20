export type CharacterClass = 'Warrior' | 'Rogue' | 'Scholar';
export type Difficulty = 'Thử Thách' | 'Ác Mộng';
export type Gender = 'Nam' | 'Nữ' | 'Khác';

export type ItemType = 'POTION' | 'WEAPON' | 'ARMOR' | 'KEY' | 'MISC' | 'RING' | 'AMULET';
export type EquipmentSlot = 'weapon' | 'armor' | 'ring1' | 'ring2';


export interface Item {
    id: string;
    name: string;
    description: string;
    type: ItemType;
    equipmentSlot?: EquipmentSlot;
    effect?: {
        hp?: number;
        mana?: number;
        attack?: number;
        defense?: number;
        maxHp?: number;
        maxStamina?: number;
        maxMana?: number;
    };
    isSeveredPart?: boolean;
    decayTimer?: number; // Số lượt cho đến khi bị thối rữa
    isPreserved?: boolean; // Được bảo quản để làm chậm quá trình thối rữa
}

export type SkillType = 'COMBAT' | 'UTILITY' | 'PASSIVE';
export type SkillCostType = 'MANA' | 'STAMINA';

export interface Skill {
    id: string;
    name:string;
    description: string;
    type: SkillType;
    cost: number;
    costType: SkillCostType;
    cooldown: number; // in turns
}


export interface Companion {
    id: string;
    name: string;
    hp: number;
    maxHp: number;
    description: string;
}

export type QuestStatus = 'ACTIVE' | 'COMPLETED' | 'FAILED';

export interface Quest {
    id: string;
    title: string;
    description: string;
    status: QuestStatus;
}

export type BodyPart = 'head' | 'torso' | 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg';

export type InjuryLevel = 'HEALTHY' | 'INJURED' | 'CRITICAL' | 'SEVERED';

export interface PlayerState {
    hp: number;
    maxHp: number;
    stamina: number;
    maxStamina: number;
    mana: number;
    maxMana: number;
    // Total stats (base + equipment)
    attack: number;
    defense: number;
    // Base stats (from class)
    baseAttack: number;
    baseDefense: number;
    baseMaxHp: number;
    baseMaxStamina: number;
    baseMaxMana: number;

    currency: number;
    name: string;
    bio: string;
    class: CharacterClass | null;
    gender: Gender | null;
    personality: string;
    goal: string;
    inventory: Item[];
    equipment: Partial<Record<EquipmentSlot, Item>>;
    skills: Skill[];
    skillCooldowns: Record<string, number>; // skillId: turns remaining
    companions: Companion[];
    quests: Quest[];
    bodyStatus: Record<BodyPart, InjuryLevel>;
}

export type GamePhase = 'TITLE_SCREEN' | 'CHARACTER_CREATION' | 'EXPLORING' | 'COMBAT' | 'GAMEOVER' | 'VICTORY';

export interface Choice {
    text: string;
    prompt: string;
    staminaCost?: number;
}

export interface GameState {
    phase: GamePhase;
    narrative: string;
    choices: Choice[];
    difficulty: Difficulty | null;
    turn: number;
}

export interface StatusUpdate {
    message: string;
    hpChange: number;
    staminaChange?: number;
    manaChange?: number;
    currencyChange?: number;
    bodyPartInjuries?: { part: BodyPart; level: InjuryLevel }[];
}

export interface CompanionUpdate {
    id: string;
    hpChange: number;
}

export interface QuestUpdate {
    id: string;
    status: QuestStatus;
}


export interface GameData {
    narrative: string;
    choices: Choice[];
    statusUpdate: StatusUpdate | null;
    gameState: GamePhase;
    itemsFound: Item[] | null;
    skillsLearned: Skill[] | null;
    companionsAdded: Companion[] | null;
    companionsRemoved: string[] | null; // Array of companion IDs
    companionUpdates: CompanionUpdate[] | null;
    questsAdded: Quest[] | null;
    questUpdates: QuestUpdate[] | null;
}