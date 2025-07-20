
import { PlayerState, CharacterClass, Difficulty, Gender } from './types';

export const SAVE_KEY = "darkFantasyRPGSaveData";
export const GAME_TITLE = "Vang Vọng của Bóng Tối";
export const GAME_INTRO = "Bạn tỉnh dậy trong một vương quốc của hoàng hôn và hoang tàn. Không khí đặc quánh bụi của thời gian và mùi của đất sau mưa trên đá lạnh. Ký ức của bạn là một tấm thảm rách nát, chỉ còn lại một sợi duy nhất: một cái tên, được thì thầm trên gió... tên của bạn. Trước mắt bạn, những con đường rẽ vào bóng tối đang bao trùm. Bạn sẽ làm gì?";

export const INITIAL_PLAYER_STATE: PlayerState = {
    hp: 0,
    maxHp: 0,
    stamina: 0,
    maxStamina: 0,
    mana: 0,
    maxMana: 0,
    attack: 0,
    defense: 0,
    baseAttack: 0,
    baseDefense: 0,
    baseMaxHp: 0,
    baseMaxStamina: 0,
    baseMaxMana: 0,
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
};

export const CLASSES: Record<CharacterClass, { 
    description: string; 
    stats: { baseMaxHp: number; baseMaxStamina: number; baseMaxMana: number; baseAttack: number; baseDefense: number; };
    strengths: string[];
    weaknesses: string[];
}> = {
  Warrior: {
    description: "Được huấn luyện trong nghệ thuật đổ máu, bạn là một bức tường thành chống lại bóng tối, được định hình bởi sức mạnh và sự kiên cường.",
    stats: { baseMaxHp: 120, baseMaxStamina: 100, baseMaxMana: 20, baseAttack: 15, baseDefense: 10 },
    strengths: ["Sức khỏe và phòng thủ cao.", "Hiệu quả trong cận chiến.", "Chịu đựng được nhiều sát thương."],
    weaknesses: ["Kém linh hoạt.", "Hầu như không có khả năng phép thuật.", "Dễ bị tấn công bởi các đòn đánh tầm xa."]
  },
  Rogue: {
    description: "Một sinh vật của bóng tối và xảo quyệt, bạn phát triển mạnh ở nơi người khác chùn bước, tấn công từ bóng tối với độ chính xác chết người.",
    stats: { baseMaxHp: 100, baseMaxStamina: 120, baseMaxMana: 40, baseAttack: 12, baseDefense: 8 },
    strengths: ["Nhanh nhẹn và né tránh tốt.", "Gây sát thương chí mạng cao.", "Giỏi trong việc tấn công bất ngờ và sử dụng mẹo."],
    weaknesses: ["Sức khỏe thấp, dễ bị hạ gục.", "Phụ thuộc vào việc tấn công trước.", "Gặp khó khăn trong các trận chiến kéo dài."]
  },
  Scholar: {
    description: "Kiến thức là vũ khí và là lá chắn của bạn. Bạn sử dụng những truyền thuyết bị lãng quên để làm sáng tỏ những bí ẩn nghiệt ngã của thế giới.",
    stats: { baseMaxHp: 80, baseMaxStamina: 80, baseMaxMana: 100, baseAttack: 8, baseDefense: 5 },
    strengths: ["Sử dụng phép thuật mạnh mẽ.", "Có khả năng kiểm soát và hỗ trợ.", "Có thể khai thác điểm yếu của kẻ thù."],
    weaknesses: ["Cực kỳ yếu trong cận chiến.", "Sức khỏe và phòng thủ thấp nhất.", "Phụ thuộc nhiều vào mana."]
  }
};

export const DIFFICULTIES: Record<Difficulty, { description: string; }> = {
    'Thử Thách': {
        description: "Trải nghiệm cân bằng, đúng như dự định. Các trận chiến đòi hỏi chiến thuật và việc quản lý tài nguyên là rất quan trọng."
    },
    'Ác Mộng': {
        description: "Dành cho những người tìm kiếm một thử thách tàn bạo. Kẻ thù không khoan nhượng và tài nguyên cực kỳ khan hiếm."
    }
};

export const GENDERS: Record<Gender, string> = {
    'Nam': 'Nam',
    'Nữ': 'Nữ',
    'Khác': 'Khác',
};

export const PERSONALITIES: string[] = [
    "Dũng Cảm", "Thận Trọng", "Tò Mò", "Hoài Nghi", "Lý Trí", "Bốc Đồng"
];

export const GOALS: string[] = [
    "Tìm kiếm sự cứu rỗi", "Tích lũy quyền lực", "Khám phá sự thật bị chôn giấu", "Sống sót bằng mọi giá", "Báo thù cho quá khứ"
];