


export type Origin = 'Cựu Vệ Binh' | 'Kẻ Trộm Vặt' | 'Tập Sự Viện Hàn Lâm' | 'Người Sống Sót' | 'Hậu Duệ Sa Ngã';
export type Difficulty = 'Thử Thách' | 'Ác Mộng' | 'Đày Đoạ' | 'Địa Ngục';
export type Gender = 'Nam' | 'Nữ' | 'Khác';
export type WeaponType = 'SWORD' | 'AXE' | 'DAGGER' | 'MACE' | 'SPEAR' | 'BOW' | 'STAFF' | 'UNARMED';
export type OuterGodMark = 'ALL_MOTHER' | 'SILENT_WATCHER' | 'ABYSSAL_HUNGER';


export type ItemType = 'POTION' | 'WEAPON' | 'ARMOR' | 'KEY' | 'MISC' | 'RING' | 'AMULET';
export type EquipmentSlot = 'weapon' | 'armor' | 'ring1' | 'ring2';


export interface Item {
    id: string;
    name: string;
    description: string;
    type: ItemType;
    equipmentSlot?: EquipmentSlot;
    weaponType?: WeaponType;
    effect?: {
        hp?: number;
        mana?: number;
        sanity?: number;
        hunger?: number;
        thirst?: number;
        attack?: number;
        defense?: number;
        charisma?: number;
        maxHp?: number;
        maxStamina?: number;
        maxMana?: number;
        maxSanity?: number;
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
    affection: number; // Tình cảm, từ -100 (Căm ghét) đến 100 (Bạn tâm giao)
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

export type Appearance = 'CLEAN' | 'DIRTY' | 'BLOODY' | 'WELL_DRESSED' | 'IN_RAGS';

export interface Follower {
    id: string;
    name: string;
    cult: OuterGodMark;
    loyalty: number; // From -100 (Mutinous) to 100 (Devoted)
    status: 'IDLE' | 'ON_MISSION' | 'INJURED' | 'DISGRACED' | 'BETRAYED';
}

export interface Sanctuary {
    id: string;
    name: string;
    description: string;
    level: number;
    hope: number;
    residents: string[];
    improvements: string[];
    followers: Follower[];
}

export type NPCDisposition = 'NEUTRAL' | 'HOSTILE' | 'FRIENDLY';

export interface NPC {
    id: string;
    name: string;
    description: string;
    disposition?: NPCDisposition;
}

export interface PlayerState {
    hp: number;
    maxHp: number;
    stamina: number;
    maxStamina: number;
    mana: number;
    maxMana: number;
    sanity: number;
    maxSanity: number;
    hunger: number;
    maxHunger: number;
    thirst: number;
    maxThirst: number;

    // Total stats (base + equipment)
    attack: number;
    defense: number;
    charisma: number;
    // Base stats (from origin + point buy)
    baseAttack: number;
    baseDefense: number;
    baseCharisma: number;
    baseMaxHp: number;
    baseMaxStamina: number;
    baseMaxMana: number;
    baseMaxSanity: number;
    baseMaxHunger: number;
    baseMaxThirst: number;

    currency: number;
    name: string;
    bio: string;
    origin: Origin | null;
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
    proficiency: Record<WeaponType, { level: number; xp: number }>;
    isMarked: boolean; // Dấu Hiệu Tế Thần
    hasSuccubusPact: boolean; // Giao Ước Đen Tối
    outerGodMark: OuterGodMark | null; // Ấn ký của Ngoại Thần
    godFragments: number; // Số Mảnh Vỡ Thần Thánh đã thu thập
    reputation: number; // Điểm uy tín
    appearance: Appearance; // Vẻ ngoài
    sanctuaries: Sanctuary[];
    talent: string | null; // ID của thiên phú đã chọn
    faith: Partial<Record<OuterGodMark, {
        points: number;
        level: number;
    }>>;
}

export type GamePhase = 'TITLE_SCREEN' | 'CHARACTER_CREATION' | 'EXPLORING' | 'COMBAT' | 'GAMEOVER' | 'VICTORY' | 'CUSTOM_JOURNEY' | 'CREATORS_WILL_SETUP';

export interface Choice {
    text: string;
    prompt: string;
    staminaCost?: number;
    hitChance?: number;
}

export interface Enemy {
    id: string;
    name: string;
    description: string;
    bodyParts: Record<BodyPart, { hp: number; status: InjuryLevel; }>;
    currentAction?: string; 
}

export interface GameState {
    phase: GamePhase;
    narrative: string;
    choices: Choice[];
    difficulty: Difficulty | null;
    turn: number;
    nextDynamicWorldEventTurn: number;
    enemies: Enemy[];
    combatLog: string[];
    npcsInScene: NPC[];
    customJourneyPrompt?: string;
    isCreatorsWillActive?: boolean;
}

export interface StatusUpdate {
    message: string;
    hpChange: number;
    staminaChange?: number;
    manaChange?: number;
    sanityChange?: number;
    hungerChange?: number;
    thirstChange?: number;
    currencyChange?: number;
    reputationChange?: number; // Thay đổi uy tín
    appearanceChange?: Appearance; // Thay đổi vẻ ngoài
    godFragmentsChange?: number; // Số lượng Mảnh Vỡ Thần Thánh người chơi nhận được (thường là 1).
    bodyPartInjuries?: { part: BodyPart; level: InjuryLevel }[];
    itemsLost?: string[]; // Array of item IDs lost
    
    // Permanent base stat changes (for Path of Might)
    baseAttackChange?: number;
    baseDefenseChange?: number;
    baseCharismaChange?: number;
    baseMaxHpChange?: number;
    baseMaxStaminaChange?: number;
    baseMaxManaChange?: number;
    baseMaxSanityChange?: number;
    
    isMarked?: boolean; // AI có thể đặt thành true để áp dụng Dấu Hiệu Tế Thần
    markRemoved?: boolean; // AI có thể đặt thành true để gỡ bỏ Dấu Hiệu, chỉ sau một nhiệm vụ cực kỳ khó khăn.
    succubusPactMade?: boolean; // AI có thể đặt thành true để kích hoạt Giao Ước Đen Tối vĩnh viễn.
    outerGodMarkGained?: OuterGodMark; // AI có thể gán một ấn ký của Ngoại Thần
    outerGodMarkRemoved?: boolean; // AI có thể xóa bỏ ấn ký của Ngoại Thần
}

export interface CompanionUpdate {
    id: string;
    hpChange?: number;
    affectionChange?: number; // Thay đổi về tình cảm
}

export interface QuestUpdate {
    id: string;
    status: QuestStatus;
}

export interface ProficiencyUpdate {
    weaponType: WeaponType;
    xpGained: number;
}

export interface FaithUpdate {
    god: OuterGodMark;
    pointsGained: number;
    levelUp?: boolean;
}

export interface FollowerUpdate {
    sanctuaryId: string;
    addFollower?: Follower;
    removeFollowerId?: string;
    updateFollower?: {
        id: string;
        loyaltyChange?: number;
        status?: Follower['status'];
    };
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
    proficiencyUpdate?: ProficiencyUpdate | null;
    sanctuariesAdded?: Sanctuary[] | null;
    sanctuaryUpdates?: {
        id: string;
        level?: number;
        hopeChange?: number;
        addResident?: string;
        addImprovement?: string;
        description?: string;
        name?: string;
    }[] | null;
    faithUpdate?: FaithUpdate | null;
    followerUpdates?: FollowerUpdate[] | null;
    npcsInScene: NPC[] | null;
    enemies: Enemy[] | null;
    combatLog: string[] | null;
}