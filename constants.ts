import { PlayerState, CharacterClass, Difficulty, Gender, WeaponType } from './types';

export const SAVE_KEY = "darkFantasyRPGSaveData";
export const API_KEYS_STORAGE_KEY = "darkFantasyApiKeys";
export const API_SOURCE_STORAGE_KEY = "darkFantasyApiSource";
export const GAME_TITLE = "Vang Vọng của Bóng Tối";
export const GAME_INTRO = "Bạn tỉnh dậy trong một vương quốc của hoàng hôn và hoang tàn. Không khí đặc quánh bụi của thời gian và mùi của đất sau mưa trên đá lạnh. Ký ức của bạn là một tấm thảm rách nát, chỉ còn lại một sợi duy nhất: một cái tên, được thì thầm trên gió... tên của bạn. Trước mắt bạn, những con đường rẽ vào bóng tối đang bao trùm. Bạn sẽ làm gì?";

export const WEAPON_TYPES: WeaponType[] = ['SWORD', 'AXE', 'DAGGER', 'MACE', 'SPEAR', 'BOW', 'STAFF', 'UNARMED'];

export const INITIAL_PLAYER_STATE: PlayerState = {
    hp: 0,
    maxHp: 0,
    stamina: 0,
    maxStamina: 0,
    mana: 0,
    maxMana: 0,
    sanity: 0,
    maxSanity: 0,
    attack: 0,
    defense: 0,
    baseAttack: 0,
    baseDefense: 0,
    baseMaxHp: 0,
    baseMaxStamina: 0,
    baseMaxMana: 0,
    baseMaxSanity: 0,
    currency: 0,
    name: '',
    bio: '',
    class: null,
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
};

export const CLASSES: Record<CharacterClass, { 
    description: string; 
    stats: { baseMaxHp: number; baseMaxStamina: number; baseMaxMana: number; baseMaxSanity: number; baseAttack: number; baseDefense: number; };
    strengths: string[];
    weaknesses: string[];
}> = {
  Warrior: {
    description: "Được huấn luyện trong nghệ thuật đổ máu, bạn là một bức tường thành chống lại bóng tối, được định hình bởi sức mạnh và sự kiên cường.",
    stats: { baseMaxHp: 120, baseMaxStamina: 100, baseMaxMana: 20, baseMaxSanity: 80, baseAttack: 15, baseDefense: 10 },
    strengths: ["Sức khỏe và phòng thủ cao.", "Hiệu quả trong cận chiến.", "Chịu đựng được nhiều sát thương."],
    weaknesses: ["Kém linh hoạt.", "Hầu như không có khả năng phép thuật.", "Dễ bị tấn công bởi các đòn đánh tầm xa."]
  },
  Rogue: {
    description: "Một sinh vật của bóng tối và xảo quyệt, bạn phát triển mạnh ở nơi người khác chùn bước, tấn công từ bóng tối với độ chính xác chết người.",
    stats: { baseMaxHp: 100, baseMaxStamina: 120, baseMaxMana: 40, baseMaxSanity: 70, baseAttack: 12, baseDefense: 8 },
    strengths: ["Nhanh nhẹn và né tránh tốt.", "Gây sát thương chí mạng cao.", "Giỏi trong việc tấn công bất ngờ và sử dụng mẹo."],
    weaknesses: ["Sức khỏe thấp, dễ bị hạ gục.", "Phụ thuộc vào việc tấn công trước.", "Gặp khó khăn trong các trận chiến kéo dài."]
  },
  Scholar: {
    description: "Kiến thức là vũ khí và là lá chắn của bạn. Bạn sử dụng những truyền thuyết bị lãng quên để làm sáng tỏ những bí ẩn nghiệt ngã của thế giới.",
    stats: { baseMaxHp: 80, baseMaxStamina: 80, baseMaxMana: 100, baseMaxSanity: 100, baseAttack: 8, baseDefense: 5 },
    strengths: ["Sử dụng phép thuật mạnh mẽ.", "Có khả năng kiểm soát và hỗ trợ.", "Có thể khai thác điểm yếu của kẻ thù."],
    weaknesses: ["Cực kỳ yếu trong cận chiến.", "Sức khỏe và phòng thủ thấp nhất.", "Phụ thuộc nhiều vào mana."]
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

export const PERSONALITIES: string[] = [
    "Dũng Cảm", "Thận Trọng", "Tò Mò", "Hoài Nghi", "Lý Trí", "Bốc Đồng", "Hận Thù", "Tàn Nhẫn", "Tuyệt Vọng", "Hoang Tưởng", "Vô Cảm", "Tự Hủy Hoại", "Bị Ô Uế", "Lãnh Cảm Bệnh Hoạn", "Tự Ghê Tởm"
];

export const GOALS: string[] = [
    "Tìm kiếm sự cứu rỗi", "Tích lũy quyền lực", "Khám phá sự thật bị chôn giấu", "Sống sót bằng mọi giá", "Báo thù cho quá khứ", "Thách thức số phận", "Tìm kiếm một vị thần cũ", "Chấm dứt lời nguyền của chính mình", "Chỉ đơn giản là muốn chết", "Thỏa mãn một cơn đói bệnh hoạn", "Tìm kiếm sự thanh tẩy hoặc sự hủy diệt", "Gây ra nỗi đau cho thế giới"
];