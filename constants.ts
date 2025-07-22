

import { PlayerState, Origin, Difficulty, Gender, WeaponType, BodyPart, OuterGodMark, Item } from './types';

export const SAVE_KEY = "darkFantasyRPGSaveData";
export const API_KEYS_STORAGE_KEY = "darkFantasyApiKeys";
export const API_SOURCE_STORAGE_KEY = "darkFantasyApiSource";
export const GAME_TITLE = "Lời Nguyền Của Vực Thẳm";

export const WEAPON_TYPES: WeaponType[] = ['SWORD', 'AXE', 'DAGGER', 'MACE', 'SPEAR', 'BOW', 'STAFF', 'UNARMED'];
export const BODY_PARTS: BodyPart[] = ['head', 'torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];

export const DYNAMIC_WORLD_EVENT_TURN_MIN = 7;
export const DYNAMIC_WORLD_EVENT_TURN_MAX = 15;

export const DIFFICULTY_POINT_BUY: Record<Difficulty, number> = {
    'Thử Thách': 30,
    'Ác Mộng': 20,
    'Đày Đoạ': 15,
    'Địa Ngục': 10,
};

export const BASE_STATS_BEFORE_POINT_BUY = {
    baseAttack: 5,
    baseDefense: 5,
    baseCharisma: 5,
    baseMaxHp: 70,
    baseMaxStamina: 70,
    baseMaxMana: 20,
    baseMaxSanity: 60,
};

export const INITIAL_PLAYER_STATE: PlayerState = {
    ...BASE_STATS_BEFORE_POINT_BUY,
    hp: 0,
    maxHp: 0,
    stamina: 0,
    maxStamina: 0,
    mana: 0,
    maxMana: 0,
    sanity: 0,
    maxSanity: 0,
    hunger: 100,
    maxHunger: 100,
    thirst: 100,
    maxThirst: 100,
    baseMaxHunger: 100,
    baseMaxThirst: 100,
    attack: 0,
    defense: 0,
    charisma: 0,
    currency: 0,
    name: '',
    bio: '',
    origin: null,
    gender: null,
    personality: '',
    goal: '',
    inventory: [],
    equipment: {},
    skills: [],
    skillCooldowns: {},
    companions: [],
    quests: [],
    bodyStatus: {
        head: 'HEALTHY',
        torso: 'HEALTHY',
        leftArm: 'HEALTHY',
        rightArm: 'HEALTHY',
        leftLeg: 'HEALTHY',
        rightLeg: 'HEALTHY',
    },
    proficiency: {
        SWORD: { level: 1, xp: 0 },
        AXE: { level: 1, xp: 0 },
        DAGGER: { level: 1, xp: 0 },
        MACE: { level: 1, xp: 0 },
        SPEAR: { level: 1, xp: 0 },
        BOW: { level: 1, xp: 0 },
        STAFF: { level: 1, xp: 0 },
        UNARMED: { level: 1, xp: 0 },
    },
    isMarked: false,
    hasSuccubusPact: false,
    outerGodMark: null,
    godFragments: 0,
    reputation: 0,
    appearance: 'DIRTY',
    sanctuaries: [],
    talent: null,
};

type Talent = {
    id: string;
    name: string;
    description: string;
    effects: { [key: string]: number };
};

export const TALENTS: Record<Origin, Talent[]> = {
  'Cựu Vệ Binh': [
    { id: 'veterans_grit', name: 'Sự Gan Lì Cựu Binh', description: 'Kinh nghiệm chiến trường khắc sâu vào da thịt bạn. Tăng 10 Máu tối đa và 2 Phòng Thủ.', effects: { baseMaxHp: 10, baseDefense: 2 } },
    { id: 'unwavering_focus', name: 'Sự Tập Trung Kiên Định', description: 'Kỷ luật thép cho phép bạn duy trì sự bình tĩnh. Tăng 10 Thể Lực tối đa và 10 Tâm Trí tối đa.', effects: { baseMaxStamina: 10, baseMaxSanity: 10 } },
    { id: 'leader_aura', name: 'Hào Quang Lãnh Đạo', description: 'Bạn toát ra một khí chất đáng tin cậy, ngay cả trong tuyệt vọng. Tăng 3 Sức Hấp Dẫn.', effects: { baseCharisma: 3 } }
  ],
  'Kẻ Trộm Vặt': [
    { id: 'nimble_fingers_rework', name: 'Ngón Tay Nhanh Nhẹn', description: 'Đôi tay nhanh nhẹn giúp bạn trong và ngoài chiến đấu. Tăng 2 Tấn Công và 10 Thể Lực tối đa.', effects: { baseAttack: 2, baseMaxStamina: 10 } },
    { id: 'street_smarts', name: 'Sự Khôn Lỏi Đường Phố', description: 'Lớn lên trong những con hẻm đã dạy bạn cách đọc vị người khác. Tăng 3 Sức Hấp Dẫn.', effects: { baseCharisma: 3 } },
    { id: 'shadow_step', name: 'Bước Chân Trong Bóng Tối', description: 'Bạn di chuyển nhẹ nhàng hơn bất kỳ ai. Tăng 10 Thể Lực tối đa và 2 Phòng Thủ.', effects: { baseMaxStamina: 10, baseDefense: 2 } }
  ],
  'Tập Sự Viện Hàn Lâm': [
    { id: 'arcane_affinity', name: 'Thiên Phú Huyền Bí', description: 'Dòng chảy ma thuật đến với bạn một cách tự nhiên. Tăng 15 Mana tối đa và 1 Tấn Công.', effects: { baseMaxMana: 15, baseAttack: 1 } },
    { id: 'eidetic_memory', name: 'Trí Nhớ Siêu Phàm', description: 'Tâm trí bạn là một kho lưu trữ kiến thức. Tăng 15 Tâm Trí tối đa.', effects: { baseMaxSanity: 15 } },
    { id: 'alchemical_touch_rework', name: 'Chạm Tay Giả Kim', description: 'Bạn có hiểu biết bẩm sinh về các loại thuốc. Tăng 10 Máu tối đa và 5 Mana tối đa.', effects: { baseMaxHp: 10, baseMaxMana: 5 } }
  ],
  'Người Sống Sót': [
    { id: 'scavenger_luck', name: 'Vận May Kẻ Nhặt Rác', description: 'Bạn có con mắt tinh tường để tìm những thứ hữu ích. Tăng 10 Thể Lực tối đa và 5 Máu tối đa.', effects: { baseMaxStamina: 10, baseMaxHp: 5 } },
    { id: 'iron_stomach_rework', name: 'Dạ Dày Sắt', description: 'Cơ thể bạn đã quen với sự thiếu thốn. Tăng 15 Máu tối đa.', effects: { baseMaxHp: 15 } },
    { id: 'sixth_sense', name: 'Giác Quan Thứ Sáu', description: 'Bạn có một cảm giác bất an khi nguy hiểm cận kề. Tăng 10 Tâm Trí tối đa và 2 Phòng Thủ.', effects: { baseMaxSanity: 10, baseDefense: 2 } }
  ]
};

// Helper map for easy lookup
export const ALL_TALENTS_MAP = new Map<string, Talent>(
    Object.values(TALENTS).flat().map(talent => [talent.id, talent])
);


export const ORIGINS: Record<Origin, {
    name: string;
    description: string;
    bonuses: {
        baseAttack?: number;
        baseDefense?: number;
        baseMaxHp?: number;
        baseMaxStamina?: number;
        baseMaxMana?: number;
        baseMaxSanity?: number;
        baseCharisma?: number;
        startingProficiency?: { type: WeaponType, xp: number };
    };
    startingEquipment: Item[];
}> = {
  'Cựu Vệ Binh': {
    name: "Cựu Vệ Binh",
    description: "Từng là một phần của bức tường khiên bảo vệ một thành phố đã mất, giờ đây bạn lang thang với những ký ức về kỷ luật và thép.",
    bonuses: { baseAttack: 2, baseDefense: 3, baseMaxHp: 10, startingProficiency: { type: 'SWORD', xp: 25 } },
    startingEquipment: [
        { id: 'start_sword_1', name: 'Kiếm Ngắn Cũ', description: 'Một thanh kiếm đáng tin cậy đã chứng kiến nhiều trận chiến.', type: 'WEAPON', equipmentSlot: 'weapon', weaponType: 'SWORD', effect: { attack: 2 } },
        { id: 'start_leather_1', name: 'Áo Da Sờn', description: 'Miếng da cứng đã cứu bạn nhiều lần.', type: 'ARMOR', equipmentSlot: 'armor', effect: { defense: 1 } }
    ]
  },
  'Kẻ Trộm Vặt': {
    name: "Kẻ Trộm Vặt",
    description: "Lớn lên trong những con hẻm tối tăm, đôi tay của bạn nhanh nhẹn và đôi mắt của bạn nhìn thấy những gì người khác bỏ lỡ.",
    bonuses: { baseMaxStamina: 15, baseCharisma: 2, startingProficiency: { type: 'DAGGER', xp: 25 } },
    startingEquipment: [
        { id: 'start_dagger_1', name: 'Dao Găm Gỉ Sét', description: 'Một lưỡi dao nhanh và lặng lẽ, hoàn hảo cho những công việc mờ ám.', type: 'WEAPON', equipmentSlot: 'weapon', weaponType: 'DAGGER', effect: { attack: 1 } },
        { id: 'start_bread_1', name: 'Mẩu Bánh Mì Cũ', description: 'Không nhiều, nhưng đủ để lót dạ.', type: 'POTION', effect: { hunger: 15 } }
    ]
  },
  'Tập Sự Viện Hàn Lâm': {
    name: "Tập Sự Viện Hàn Lâm",
    description: "Bạn đã thoáng thấy những bí mật bị cấm đoán trong các thư viện bụi bặm trước khi mọi thứ sụp đổ. Kiến thức vẫn còn đó, chờ được sử dụng.",
    bonuses: { baseMaxMana: 20, baseMaxSanity: 10, startingProficiency: { type: 'STAFF', xp: 25 } },
     startingEquipment: [
        { id: 'start_staff_1', name: 'Gậy Gỗ Tập Sự', description: 'Một cây gậy đơn giản được khắc những ký hiệu cơ bản, tỏa ra năng lượng yếu ớt.', type: 'WEAPON', equipmentSlot: 'weapon', weaponType: 'STAFF', effect: { attack: 1, maxMana: 5 } },
        { id: 'start_potion_1', name: 'Thuốc Hồi Phục Yếu', description: 'Một dung dịch màu đỏ nhạt, có vị như kim loại.', type: 'POTION', effect: { hp: 20 } }
    ]
  },
  'Người Sống Sót': {
    name: "Người Sống Sót",
    description: "Bạn không có quá khứ huy hoàng hay kỹ năng đặc biệt. Bạn chỉ đơn giản là đã sống sót ở nơi người khác đã chết, nhờ vào sự may mắn và một ý chí sắt đá.",
    bonuses: { baseMaxHp: 5, baseMaxStamina: 5, baseMaxSanity: 5 },
    startingEquipment: [
        { id: 'start_jerky_1', name: 'Thịt Khô Mốc', description: 'Mùi vị thật kinh khủng, nhưng nó là thức ăn.', type: 'POTION', effect: { hunger: 20, sanity: -2 } },
        { id: 'start_bandage_1', name: 'Băng Gạc Bẩn', description: 'Tốt hơn là không có gì.', type: 'POTION', effect: { hp: 10 } }
    ]
  }
};

export const OUTER_GODS: Record<OuterGodMark, {
    markName: string;
    markDescription: string;
    effects: {
        maxHp?: number;
        defense?: number;
        maxSanity?: number;
        maxMana?: number;
        attack?: number;
        charisma?: number;
    }
}> = {
    'ALL_MOTHER': {
        markName: "Ấn Ký Sinh Sôi",
        markDescription: "Sự sống tìm thấy một con đường, ngay cả trong những cơ thể không sẵn sàng. Thịt của bạn đan xen, tự chữa lành với tốc độ không tự nhiên (+2 HP/lượt), nhưng nó trở nên mềm hơn, dễ bị tổn thương hơn. (+10 Máu tối đa, -5 Phòng thủ)",
        effects: { maxHp: 10, defense: -5 }
    },
    'SILENT_WATCHER': {
        markName: "Con Mắt Vĩnh Cửu",
        markDescription: "Bạn đã nhìn vào vực thẳm của tri thức, và nó đã nhìn lại. Tâm trí của bạn mở rộng với những khả năng đáng sợ (+1 Mana/lượt), nhưng một phần con người của bạn đã bị xói mòn. (+15 Mana tối đa, -15 Tâm trí tối đa)",
        effects: { maxMana: 15, maxSanity: -15 }
    },
    'ABYSSAL_HUNGER': {
        markName: "Cái Nhai Vô Độ",
        markDescription: "Một cơn đói không đáy gặm nhấm bạn từ bên trong. Nó mang lại cho bạn sức mạnh hoang dã, nhưng ánh mắt của người khác chỉ nhìn thấy một con quái vật đang đói. (+5 Tấn công, -5 Sức hấp dẫn, Đói và Khát nhanh hơn)",
        effects: { attack: 5, charisma: -5 }
    }
};


export const DIFFICULTIES: Record<Difficulty, { description: string; }> = {
    'Thử Thách': {
        description: "Trải nghiệm cân bằng. Chiến đấu đòi hỏi chiến thuật, nhưng cái chết không phải là dấu chấm hết vĩnh viễn. Sát thương ở mức cơ bản."
    },
    'Ác Mộng': {
        description: "Một thử thách tàn bạo. Kẻ thù không khoan nhượng và có thể gây thương tật. Tài nguyên khan hiếm. Cái chết sẽ xóa vĩnh viễn tệp lưu của bạn."
    },
    'Đày Đoạ': {
        description: "Sự đau khổ bắt đầu. Cơ chế đói và mất trí sẽ bào mòn bạn. Thương tật nghiêm trọng là điều thường thấy. Tài nguyên cực kỳ khan hiếm. Cái chết là vĩnh viễn."
    },
    'Địa Ngục': {
        description: "Sự tàn khốc và tha hóa tuyệt đối. Thế giới này không chỉ muốn bạn chết, nó muốn làm bạn nhơ bẩn. Tất cả các cơ chế trừng phạt đều ở mức tối đa. Cái chết là một lối thoát."
    }
};

export const GENDERS: Record<Gender, string> = {
    'Nam': 'Nam',
    'Nữ': 'Nữ',
    'Khác': 'Khác',
};

export const PERSONALITIES: Record<string, {
  name: string;
  description: string;
  effects: {
    positive: string;
    negative: string;
    mechanics: {
        baseAttack?: number;
        baseDefense?: number;
        baseCharisma?: number;
        baseMaxHp?: number;
        baseMaxStamina?: number;
        baseMaxMana?: number;
        baseMaxSanity?: number;
        
        // Conditional effects (handled in recalculateStats)
        conditionalAttackBonus?: { description: string; condition: 'LOW_HP' | 'LOW_SANITY' };
        conditionalDefenseBonus?: { description: string; condition: 'LOW_SANITY' };

        // Special rules (handled in App.tsx logic)
        resistsSanityLoss?: number; // e.g., 0.5 for 50% resistance
        blocksReputationGain?: boolean;
        initialInjury?: { part: BodyPart, level: 'INJURED' | 'CRITICAL' };
        perTurnStaminaRegen?: { condition: 'LOW_SANITY', amount: number };
    }
  }
}> = {
    "Dũng Cảm": {
        name: "Dũng Cảm",
        description: "Đối mặt với bóng tối với một trái tim không hề nao núng, ngay cả khi đó là một sự điên rồ.",
        effects: {
            positive: "+2 Tấn Công. Có nhiều khả năng nhận được các lựa chọn đối đầu trực diện.",
            negative: "-2 Phòng Thủ. Bạn có xu hướng lao vào nguy hiểm.",
            mechanics: { baseAttack: 2, baseDefense: -2 }
        }
    },
    "Thận Trọng": {
        name: "Thận Trọng",
        description: "Mọi bước đi đều được tính toán. Bạn thà sống sót còn hơn là trở thành một người hùng đã chết.",
        effects: {
            positive: "+3 Phòng Thủ. Giảm khả năng bị phục kích hoặc rơi vào bẫy.",
            negative: "-2 Tấn Công. Bạn do dự trước những hành động liều lĩnh.",
            mechanics: { baseDefense: 3, baseAttack: -2 }
        }
    },
    "Tò Mò": {
        name: "Tò Mò",
        description: "Mọi bí mật đều phải được phơi bày, bất kể cái giá phải trả cho sự tỉnh táo của bạn.",
        effects: {
            positive: "Có nhiều khả năng tìm thấy các lối đi ẩn, vật phẩm bí mật và kiến thức bị cấm.",
            negative: "-10 Tâm Trí Tối Đa. Sự tò mò của bạn thường dẫn bạn đến những cảnh tượng kinh hoàng.",
            mechanics: { baseMaxSanity: -10 }
        }
    },
    "Hận Thù": {
        name: "Hận Thù",
        description: "Lửa hận thù cháy trong lồng ngực, thiêu rụi cả kẻ thù và chính bạn.",
        effects: {
            positive: "Tăng mạnh Tấn Công khi máu của bạn xuống thấp, biến cơn đau thành sức mạnh.",
            negative: "Khó tương tác hòa bình. Các lựa chọn ngoại giao thường bị hạn chế.",
            mechanics: { conditionalAttackBonus: { description: "+5 Tấn Công khi dưới 30% Máu", condition: 'LOW_HP' } }
        }
    },
    "Tàn Nhẫn": {
        name: "Tàn Nhẫn",
        description: "Mục đích biện minh cho phương tiện. Bạn sẽ bước đi trên xác chết để đạt được mục tiêu của mình.",
        effects: {
            positive: "Các lựa chọn đe dọa và tàn bạo thường hiệu quả hơn.",
            negative: "Uy tín của bạn bị giới hạn ở mức tiêu cực. Bạn không bao giờ có thể được thực sự yêu mến.",
            mechanics: { baseCharisma: -2 }
        }
    },
    "Tuyệt Vọng": {
        name: "Tuyệt Vọng",
        description: "Khi không còn gì để mất, bạn tìm thấy một sức mạnh kỳ lạ trong sự trống rỗng.",
        effects: {
            positive: "Hồi phục một chút Thể Lực mỗi lượt khi Tâm Trí của bạn gần như cạn kiệt.",
            negative: "Bắt đầu với Tâm Trí thấp hơn. Thế giới dường như luôn xám xịt.",
            mechanics: { baseMaxSanity: -15, perTurnStaminaRegen: { condition: 'LOW_SANITY', amount: 2 } }
        }
    },
    "Hoang Tưởng": {
        name: "Hoang Tưởng",
        description: "Bóng tối không chỉ ở xung quanh, nó ở trong tâm trí bạn. Mọi thứ đều là một mối đe dọa.",
        effects: {
            positive: "Tăng Phòng Thủ khi tâm trí của bạn bất ổn, sự cảnh giác trở thành một loại áo giáp.",
            negative: "Thường xuyên nhìn thấy hoặc nghe thấy những thứ không có thật (AI sẽ mô tả).",
            mechanics: { conditionalDefenseBonus: { description: "+3 Phòng Thủ khi dưới 50% Tâm Trí", condition: 'LOW_SANITY' } }
        }
    },
    "Vô Cảm": {
        name: "Vô Cảm",
        description: "Những cảm xúc đã chết từ lâu. Những điều kinh hoàng của thế giới chỉ lướt qua bạn như nước chảy.",
        effects: {
            positive: "Giảm 50% sát thương Tâm Trí phải nhận. Bạn gần như miễn nhiễm với sợ hãi.",
            negative: "Không thể hình thành mối quan hệ tình cảm sâu sắc. Tình cảm của đồng đội khó tăng.",
            mechanics: { resistsSanityLoss: 0.5 }
        }
    },
    "Tự Ghê Tởm": {
        name: "Tự Ghê Tởm",
        description: "Bạn nhìn thấy con quái vật trong gương và tin rằng mình không xứng đáng với bất cứ điều gì tốt đẹp.",
        effects: {
            positive: "Không có. Đây là một con đường đau khổ.",
            negative: "Không thể nhận được Uy Tín. Mọi hành động tốt đều bị coi là giả tạo hoặc bị bỏ qua.",
            mechanics: { blocksReputationGain: true }
        }
    }
};

export const PERSONALITY_NAMES = Object.keys(PERSONALITIES);

export const GOALS: string[] = [
    "Tìm kiếm sự cứu rỗi", "Tích lũy quyền lực", "Khám phá sự thật bị chôn giấu", "Sống sót bằng mọi giá", "Báo thù cho quá khứ", "Thách thức số phận", "Tìm kiếm một vị thần cũ", "Chấm dứt lời nguyền của chính mình", "Chỉ đơn giản là muốn chết", "Thỏa mãn một cơn đói bệnh hoạn", "Tìm kiếm sự thanh tẩy hoặc sự hủy diệt", "Gây ra nỗi đau cho thế giới"
];
