

import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Difficulty, Appearance } from '../types';

const ITEM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "Một mã định danh duy nhất cho phiên bản vật phẩm (ví dụ: 'healing_potion_1')." },
        name: { type: Type.STRING, description: "Tên của vật phẩm (ví dụ: 'Bình Thuốc Phát Sáng Mờ')." },
        description: { type: Type.STRING, description: "Một mô tả ngắn gọn, đầy không khí về vật phẩm." },
        type: { type: Type.STRING, 'enum': ['POTION', 'WEAPON', 'ARMOR', 'KEY', 'MISC', 'RING', 'AMULET'], description: "Loại của vật phẩm. Thức ăn/nước uống nên là 'MISC'." },
        equipmentSlot: { type: Type.STRING, 'enum': ['weapon', 'armor', 'ring1', 'ring2'], nullable: true, description: "Ô trang bị mà vật phẩm này thuộc về, nếu có." },
        weaponType: { type: Type.STRING, 'enum': ['SWORD', 'AXE', 'DAGGER', 'MACE', 'SPEAR', 'BOW', 'STAFF', 'UNARMED'], nullable: true, description: "Loại vũ khí, nếu vật phẩm là một vũ khí. Phải được đặt nếu type là 'WEAPON'." },
        effect: {
            type: Type.OBJECT, nullable: true, description: "Hiệu ứng của vật phẩm, nếu có. Đối với vật phẩm có thể trang bị, điều này thể hiện các chỉ số cộng thêm.",
            properties: { 
                hp: { type: Type.NUMBER, description: "Lượng máu mà vật phẩm này phục hồi (dành cho bình thuốc)." },
                mana: { type: Type.NUMBER, description: "Lượng mana mà vật phẩm này phục hồi (dành cho bình thuốc)." },
                sanity: { type: Type.NUMBER, description: "Lượng Tâm Trí mà vật phẩm này phục hồi (dành cho bình thuốc)." },
                hunger: { type: Type.NUMBER, description: "Lượng độ đói mà vật phẩm này phục hồi (dành cho thức ăn)." },
                thirst: { type: Type.NUMBER, description: "Lượng độ khát mà vật phẩm này phục hồi (dành cho nước uống)." },
                attack: { type: Type.NUMBER, description: "Bonus tấn công mà vật phẩm này mang lại khi được trang bị." },
                defense: { type: Type.NUMBER, description: "Bonus phòng thủ mà vật phẩm này mang lại khi được trang bị." },
                charisma: { type: Type.NUMBER, description: "Bonus sức hấp dẫn mà vật phẩm này mang lại khi được trang bị." },
                maxHp: { type: Type.NUMBER, description: "Bonus máu tối đa mà vật phẩm này mang lại khi được trang bị." },
                maxStamina: { type: Type.NUMBER, description: "Bonus thể lực tối đa mà vật phẩm này mang lại khi được trang bị." },
                maxMana: { type: Type.NUMBER, description: "Bonus mana tối đa mà vật phẩm này mang lại khi được trang bị." },
                maxSanity: { type: Type.NUMBER, description: "Bonus Tâm Trí tối đa mà vật phẩm này mang lại khi được trang bị." },
            }
        },
        isSeveredPart: { type: Type.BOOLEAN, nullable: true, description: "Đánh dấu true nếu vật phẩm này là một bộ phận cơ thể bị cắt đứt." },
        decayTimer: { type: Type.NUMBER, nullable: true, description: "Số lượt cho đến khi bộ phận cơ thể bị cắt đứt này thối rữa. Chỉ đặt khi isSeveredPart là true." },
        isPreserved: { type: Type.BOOLEAN, nullable: true, description: "Đánh dấu true nếu vật phẩm này đã được bảo quản để làm chậm quá trình thối rữa. Chỉ áp dụng cho các bộ phận cơ thể bị cắt đứt." },
    },
    required: ["id", "name", "description", "type"]
};

const SKILL_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "ID duy nhất cho kỹ năng (ví dụ: 'fireball_of_the_ember')." },
        name: { type: Type.STRING, description: "Tên của kỹ năng." },
        description: { type: Type.STRING, description: "Mô tả ngắn gọn về những gì kỹ năng làm." },
        type: { type: Type.STRING, 'enum': ['COMBAT', 'UTILITY', 'PASSIVE'], description: "Loại kỹ năng." },
        cost: { type: Type.NUMBER, description: "Chi phí để sử dụng kỹ năng." },
        costType: { type: Type.STRING, 'enum': ['MANA', 'STAMINA'], description: "Loại tài nguyên mà kỹ năng tiêu thụ." },
        cooldown: { type: Type.NUMBER, description: "Số lượt phải chờ trước khi có thể sử dụng lại kỹ năng." },
    },
    required: ["id", "name", "description", "type", "cost", "costType", "cooldown"]
};

const COMPANION_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "ID duy nhất cho đồng đội (ví dụ: 'elara_the_knight')." },
        name: { type: Type.STRING, description: "Tên của đồng đội." },
        hp: { type: Type.NUMBER, description: "Máu hiện tại của đồng đội." },
        maxHp: { type: Type.NUMBER, description: "Máu tối đa của đồng đội." },
        description: { type: Type.STRING, description: "Mô tả ngắn về đồng đội." },
        affection: { type: Type.NUMBER, description: "Tình cảm của đồng đội với người chơi khi họ gia nhập (-100 đến 100). Thường bắt đầu ở mức 0." },
    },
    required: ["id", "name", "hp", "maxHp", "description", "affection"]
};

const QUEST_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "ID duy nhất cho nhiệm vụ (ví dụ: 'find_the_sunstone')." },
        title: { type: Type.STRING, description: "Tên ngắn gọn của nhiệm vụ." },
        description: { type: Type.STRING, description: "Mô tả chi tiết hơn về mục tiêu nhiệm vụ." },
        status: { type: Type.STRING, 'enum': ['ACTIVE', 'COMPLETED', 'FAILED'], description: "Trạng thái hiện tại của nhiệm vụ." },
    },
    required: ["id", "title", "description", "status"]
};

const SANCTUARY_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "ID duy nhất cho Thánh địa (ví dụ: 'forgotten_chapel')." },
        name: { type: Type.STRING, description: "Tên của Thánh địa." },
        description: { type: Type.STRING, description: "Mô tả ngắn về Thánh địa." },
        level: { type: Type.NUMBER, description: "Cấp độ phát triển của Thánh địa (ví dụ: 1 cho 'Tàn Tích', 2 cho 'Nơi Trú Ẩn')." },
        hope: { type: Type.NUMBER, description: "Điểm Hy vọng của Thánh địa (0-100)." },
        residents: { type: Type.ARRAY, description: "Mảng các ID của NPC cư trú tại đây.", items: {type: Type.STRING} },
        improvements: { type: Type.ARRAY, description: "Mảng các cải tiến đã được xây dựng (ví dụ: 'WELL', 'GARDEN').", items: {type: Type.STRING} },
    },
    required: ["id", "name", "description", "level", "hope", "residents", "improvements"]
};

const APPEARANCE_ENUM: Appearance[] = ['CLEAN', 'DIRTY', 'BLOODY', 'WELL_DRESSED', 'IN_RAGS'];
const BODY_PART_ENUM: string[] = ['head', 'torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
const INJURY_LEVEL_ENUM: string[] = ['HEALTHY', 'INJURED', 'CRITICAL', 'SEVERED'];

const ENEMY_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "ID duy nhất cho kẻ thù này trong trận chiến (ví dụ: 'ghoul_1')." },
        name: { type: Type.STRING, description: "Tên của kẻ thù (ví dụ: 'Ghoul thối rữa')." },
        description: { type: Type.STRING, description: "Mô tả ngắn gọn, đáng sợ về kẻ thù." },
        currentAction: { type: Type.STRING, nullable: true, description: "Hành động mà kẻ thù đang chuẩn bị (ví dụ: 'Nó đang gầm gừ và chuẩn bị vồ tới')." },
        bodyParts: {
            type: Type.OBJECT,
            description: "Trạng thái của các bộ phận cơ thể của kẻ thù. Mỗi bộ phận phải được định nghĩa.",
            properties: {
                head: { type: Type.OBJECT, properties: { hp: { type: Type.NUMBER }, status: { type: Type.STRING, 'enum': INJURY_LEVEL_ENUM } } },
                torso: { type: Type.OBJECT, properties: { hp: { type: Type.NUMBER }, status: { type: Type.STRING, 'enum': INJURY_LEVEL_ENUM } } },
                leftArm: { type: Type.OBJECT, properties: { hp: { type: Type.NUMBER }, status: { type: Type.STRING, 'enum': INJURY_LEVEL_ENUM } } },
                rightArm: { type: Type.OBJECT, properties: { hp: { type: Type.NUMBER }, status: { type: Type.STRING, 'enum': INJURY_LEVEL_ENUM } } },
                leftLeg: { type: Type.OBJECT, properties: { hp: { type: Type.NUMBER }, status: { type: Type.STRING, 'enum': INJURY_LEVEL_ENUM } } },
                rightLeg: { type: Type.OBJECT, properties: { hp: { type: Type.NUMBER }, status: { type: Type.STRING, 'enum': INJURY_LEVEL_ENUM } } },
            },
            required: BODY_PART_ENUM
        }
    },
    required: ["id", "name", "description", "bodyParts"]
};

const NPC_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "ID duy nhất cho NPC trong cảnh này (ví dụ: 'old_merchant_1')." },
        name: { type: Type.STRING, description: "Tên hoặc danh hiệu của NPC (ví dụ: 'Thương Nhân Già', 'Người Hành Hương Câm Lặng')." },
        description: { type: Type.STRING, description: "Mô tả ngắn gọn về ngoại hình và hành động hiện tại của NPC." },
    },
    required: ["id", "name", "description"]
};

const RESPONSE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        narrative: {
            type: Type.STRING,
            description: "Văn bản câu chuyện mô tả cho cảnh hoặc sự kiện hiện tại. Phải có ít nhất 2 câu. Hãy viết một cách văn học và đầy không khí. Trong chiến đấu, đây là bản tóm tắt tình hình hiện tại.",
        },
        choices: {
            type: Type.ARRAY,
            description: "Một mảng từ 2 đến 4 lựa chọn cho người chơi. Trong chiến đấu, những lựa chọn này PHẢI là các hành động chiến thuật (ví dụ: nhắm vào các bộ phận cơ thể, sử dụng kỹ năng, bỏ chạy).",
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: "Văn bản hiển thị trên nút lựa chọn cho người chơi. Ví dụ: 'Tấn công vào đầu của Ghoul'." },
                    prompt: { type: Type.STRING, description: "Lời nhắc để gửi lại cho AI nếu lựa chọn này được chọn." },
                    staminaCost: { type: Type.NUMBER, nullable: true, description: "Chi phí thể lực để thực hiện hành động này." }
                },
                required: ["text", "prompt"]
            },
        },
        statusUpdate: {
            type: Type.OBJECT, nullable: true,
            description: "Một đối tượng mô tả sự thay đổi trong trạng thái của người chơi, hoặc null nếu không có thay đổi.",
            properties: {
                message: { type: Type.STRING, description: "Một thông báo cho người chơi về trạng thái của họ." },
                hpChange: { type: Type.NUMBER, description: "Sự thay đổi về HP của người chơi." },
                staminaChange: { type: Type.NUMBER, nullable: true, description: "Sự thay đổi về Thể lực của người chơi." },
                manaChange: { type: Type.NUMBER, nullable: true, description: "Sự thay đổi về Mana của người chơi." },
                sanityChange: { type: Type.NUMBER, nullable: true, description: "Sự thay đổi về Tỉnh táo/Tâm trí của người chơi." },
                hungerChange: { type: Type.NUMBER, nullable: true, description: "Sự thay đổi về Độ đói của người chơi." },
                thirstChange: { type: Type.NUMBER, nullable: true, description: "Sự thay đổi về Độ khát của người chơi." },
                currencyChange: { type: Type.NUMBER, nullable: true, description: "Sự thay đổi về 'Mảnh Vỡ Linh Hồn'." },
                reputationChange: { type: Type.NUMBER, nullable: true, description: "Thay đổi về điểm Uy tín của người chơi." },
                appearanceChange: { type: Type.STRING, 'enum': APPEARANCE_ENUM, nullable: true, description: "Thay đổi về Diện mạo của người chơi." },
                isMarked: { type: Type.BOOLEAN, nullable: true, description: "Đặt thành true để áp dụng 'Dấu Hiệu Tế Thần'." },
                markRemoved: { type: Type.BOOLEAN, nullable: true, description: "Đặt thành true để GỠ BỎ 'Dấu Hiệu Tế Thần'." },
                succubusPactMade: { type: Type.BOOLEAN, nullable: true, description: "Đặt thành true để kích hoạt Giao Ước Đen Tối vĩnh viễn, thay đổi cơ bản nhân vật." },
                bodyPartInjuries: {
                    type: Type.ARRAY, nullable: true,
                    description: "Một mảng các vết thương trên các bộ phận cơ thể cụ thể mà người chơi phải chịu. Chỉ sử dụng điều này khi người chơi bị thương.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            part: { type: Type.STRING, 'enum': BODY_PART_ENUM, description: "Bộ phận cơ thể bị thương." },
                            level: { type: Type.STRING, 'enum': INJURY_LEVEL_ENUM, description: "Mức độ nghiêm trọng của vết thương." }
                        },
                        required: ["part", "level"]
                    }
                }
            }
        },
        gameState: { type: Type.STRING, 'enum': ['EXPLORING', 'COMBAT', 'GAMEOVER', 'VICTORY'], description: "Trạng thái hiện tại của trò chơi." },
        itemsFound: { type: Type.ARRAY, nullable: true, description: "Một mảng các vật phẩm người chơi tìm thấy.", items: ITEM_SCHEMA },
        skillsLearned: { type: Type.ARRAY, nullable: true, description: "Kỹ năng mới mà người chơi học được.", items: SKILL_SCHEMA },
        companionsAdded: { type: Type.ARRAY, nullable: true, description: "Đồng đội mới gia nhập nhóm.", items: COMPANION_SCHEMA },
        companionsRemoved: { type: Type.ARRAY, nullable: true, description: "Mảng các ID của đồng đội rời khỏi nhóm.", items: { type: Type.STRING } },
        companionUpdates: {
            type: Type.ARRAY, nullable: true, description: "Cập nhật trạng thái cho các đồng đội hiện tại.",
            items: {
                type: Type.OBJECT, properties: {
                    id: { type: Type.STRING, description: "ID của đồng đội." },
                    hpChange: { type: Type.NUMBER, nullable: true, description: "Thay đổi máu." },
                    affectionChange: { type: Type.NUMBER, nullable: true, description: "Thay đổi Tình cảm." }
                }, required: ["id"]
            }
        },
        questsAdded: { type: Type.ARRAY, nullable: true, description: "Nhiệm vụ mới.", items: QUEST_SCHEMA },
        questUpdates: {
            type: Type.ARRAY, nullable: true, description: "Cập nhật trạng thái cho các nhiệm vụ.",
            items: {
                type: Type.OBJECT, properties: {
                    id: { type: Type.STRING, description: "ID của nhiệm vụ." },
                    status: { type: Type.STRING, 'enum': ['COMPLETED', 'FAILED'], description: "Trạng thái mới." },
                }, required: ["id", "status"]
            }
        },
        proficiencyUpdate: {
            type: Type.OBJECT, nullable: true, description: "Cập nhật điểm kinh nghiệm cho một loại vũ khí.",
            properties: {
                weaponType: { type: Type.STRING, 'enum': ['SWORD', 'AXE', 'DAGGER', 'MACE', 'SPEAR', 'BOW', 'STAFF', 'UNARMED'], description: "Loại vũ khí." },
                xpGained: { type: Type.NUMBER, description: "Lượng XP nhận được (5-15)." }
            }, required: ["weaponType", "xpGained"]
        },
        sanctuariesAdded: { type: Type.ARRAY, nullable: true, description: "Thánh địa mới.", items: SANCTUARY_SCHEMA },
        sanctuaryUpdates: {
            type: Type.ARRAY, nullable: true, description: "Cập nhật cho các Thánh địa.",
            items: {
                type: Type.OBJECT, properties: {
                    id: { type: Type.STRING, description: "ID của Thánh địa." },
                    level: { type: Type.NUMBER, nullable: true }, hopeChange: { type: Type.NUMBER, nullable: true },
                    addResident: { type: Type.STRING, nullable: true }, addImprovement: { type: Type.STRING, nullable: true },
                    description: { type: Type.STRING, nullable: true }, name: { type: Type.STRING, nullable: true },
                }, required: ["id"]
            }
        },
        npcsInScene: { type: Type.ARRAY, nullable: true, description: "Danh sách các NPC có mặt trong cảnh này. Sử dụng điều này để làm cho thế giới có cảm giác sống động, thay vì trống rỗng. Trả về mảng rỗng nếu không có ai.", items: NPC_SCHEMA },
        enemies: { type: Type.ARRAY, nullable: true, description: "Danh sách TẤT CẢ kẻ thù trong trận chiến và trạng thái hiện tại của chúng. PHẢI được cung cấp trong mỗi lượt chiến đấu. Trả về một mảng trống khi chiến đấu kết thúc.", items: ENEMY_SCHEMA },
        combatLog: { type: Type.ARRAY, nullable: true, description: "Một bản ghi chi tiết, theo từng hành động của các sự kiện trong lượt chiến đấu. Ví dụ: ['Bạn chém vào tay phải của Ghoul.', 'Ghoul gầm lên và đánh rơi vũ khí của nó.', 'Ghoul lao tới và cắn vào chân bạn.'].", items: { type: Type.STRING } },
    },
    required: ["narrative", "choices", "statusUpdate", "gameState", "itemsFound", "skillsLearned", "companionsAdded", "companionsRemoved", "companionUpdates", "questsAdded", "questUpdates", "proficiencyUpdate", "sanctuariesAdded", "sanctuaryUpdates", "npcsInScene", "enemies", "combatLog"]
};


export class GameAIService {
    private ai: GoogleGenAI;
    private chat: Chat;

    constructor(difficulty: Difficulty, apiKey: string, isMature: boolean) {
        if (!apiKey) {
            throw new Error("Không có API Key nào được cung cấp cho GameAIService.");
        }
        
        this.ai = new GoogleGenAI({ apiKey });
        
        let difficultyInstructions = '';
        switch (difficulty) {
            case 'Thử Thách':
                difficultyInstructions = "Độ khó 'Thử Thách': Trải nghiệm cân bằng. Sát thương ở mức cơ bản. Kẻ thù là mối đe dọa, nhưng có thể vượt qua.";
                break;
            case 'Ác Mộng':
                difficultyInstructions = "Độ khó 'Ác Mộng': Thử thách tàn bạo. Sát thương của kẻ thù tăng lên. Kẻ thù có thể gây ra thương tật có chủ đích (`bodyPartInjuries`). Tài nguyên khan hiếm. Cái chết là vĩnh viễn.";
                break;
            case 'Đày Đoạ':
                difficultyInstructions = "Độ khó 'Đày Đoạ': Thử thách khắc nghiệt. Sát thương của kẻ thù rất cao và thường xuyên gây thương tật. Tài nguyên cực kỳ khan hiếm. Chủ động áp dụng cơ chế đói, khát (`hungerChange`, `thirstChange`) và mất tỉnh táo (`sanityChange`). Cái chết là vĩnh viễn.";
                break;
            case 'Địa Ngục':
                difficultyInstructions = "Độ khó 'Địa Ngục': Thử thách tàn nhẫn, bất công. Sát thương cực đại. Thế giới chủ động tìm cách làm người chơi ô uế và phát điên (`sanityChange` tiêu cực, nặng nề). Tất cả các cơ chế trừng phạt, bao gồm đói và khát, đều ở mức tối đa. Cái chết là vĩnh viễn.";
                break;
        }

       const matureContentInstructions = isMature 
            ? "QUAN TRỌNG: Chế độ 18+ đã được bật. Bạn được phép và được khuyến khích mô tả các chủ đề người lớn một cách chi tiết và không né tránh. Điều này bao gồm: bạo lực cực đoan, máu me, kinh dị cơ thể, và các chủ đề tâm lý đen tối. Đặc biệt, hãy gợi ý về nỗi kinh hoàng của sự xâm phạm và tha hóa tình dục mà không cần mô tả các hành vi một cách rõ ràng. Tập trung vào hậu quả tâm lý: sự xấu hổ, cảm giác bị ô uế, sự tan vỡ nhân tính và nỗi kinh hoàng của việc bị biến thành một thứ gì đó không phải con người. Giọng văn phải tàn nhẫn và không khoan nhượng."
            : "Chế độ 18+ đã tắt. Tránh các mô tả quá mức về bạo lực, máu me, hoặc các chủ đề người lớn rõ ràng. Giữ giọng văn u ám nhưng tập trung vào không khí và sự hồi hộp hơn là sự ghê rợn.";

        const systemInstruction = `Bạn là Quản trò cho một game nhập vai dựa trên văn bản kỳ ảo hắc ám cực độ tên là 'Lời Nguyền Của Vực Thẳm'.
**Bối cảnh & Giọng văn**: Thế giới này là sự kết hợp của những điều tồi tệ nhất. Lấy cảm hứng từ sự tuyệt vọng triết học của **'Berserk'**, sự tàn khốc cơ học của **'Fear & Hunger'**, và nỗi kinh hoàng về sự tha hóa của **'Black Souls'**. Thế giới này không chỉ thù địch; nó **đồi bại**. Nó không chỉ muốn giết người chơi; nó muốn làm họ **ô uế**, bẻ gãy tinh thần họ. Giọng văn của bạn phải tàn nhẫn, nội tâm, và mô tả chi tiết đến mức gây khó chịu.
**Chủ đề cốt lõi**: Cuộc đấu tranh vô nghĩa chống lại một vũ trụ không chỉ thờ ơ mà còn độc ác một cách có chủ đích. Sự mất mát nhân tính, sự khủng khiếp của việc cơ thể bị biến dạng và sự điên rồ là những người bạn đồng hành. **Không có lựa chọn tốt**. Không có chiến thắng. Chỉ có những cấp độ khác nhau của sự sống sót trong đau khổ.
Không bao giờ phá vỡ vai diễn.

*** HỆ THỐNG CHIẾN ĐẤU (Lấy cảm hứng từ Fear & Hunger) ***
Khi \`gameState\` trở thành 'COMBAT', toàn bộ động lực thay đổi. Mục tiêu của bạn là tạo ra một trải nghiệm chiến đấu theo lượt tàn bạo, chiến thuật và mô tả chi tiết.
- **Bắt đầu Chiến đấu**: Khi chiến đấu bắt đầu, bạn PHẢI điền vào mảng \`enemies\`. Mỗi kẻ thù PHẢI có \`id\`, \`name\`, \`description\`, và một đối tượng \`bodyParts\`. Mỗi bộ phận cơ thể ('head', 'torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg') phải có \`hp\` và trạng thái 'HEALTHY'. Gán HP hợp lý (ví dụ: tay/chân 20-30HP, thân 50-80HP, đầu 30-40HP).
- **Nhắm mục tiêu là Chìa khóa**: Vai trò chính của bạn là tạo ra các \`choices\` cho phép người chơi nhắm vào các bộ phận cơ thể cụ thể của kẻ thù. Văn bản lựa chọn phải rõ ràng, ví dụ: "Tấn công vào đầu của Ghoul", "Chém rìu vào cánh tay cầm kiếm của Bộ Xương". Lời nhắc phải phản ánh hành động này.
- **Cắt xẻo**: Khi HP của một bộ phận cơ thể về 0, bạn PHẢI cập nhật trạng thái của nó thành 'DESTROYED' trong phản hồi tiếp theo. Điều này là vĩnh viễn trong trận chiến.
- **Mô tả sống động**: Tường thuật kết quả của các cuộc tấn công trong \`combatLog\`. Hãy đồ họa và chi tiết. "Lưỡi kiếm rỉ sét của bạn cào vào chân xương của nó một cách vô ích." hoặc "Một tiếng 'rắc' ướt át vang lên khi bạn chặt đứt cánh tay của Ghoul. Nó hét lên một tiếng đau đớn và lùi lại, máu đen tuôn ra từ vết thương."
- **AI Kẻ thù**: Hành động của kẻ thù phụ thuộc vào trạng thái của nó.
    - Nếu cánh tay cầm vũ khí bị phá hủy, nó sẽ đánh rơi vũ khí và có thể dùng đến cắn hoặc vật lộn.
    - Nếu một chân bị phá hủy, nó có thể ngã, làm cho các cuộc tấn công của nó kém chính xác hoặc chậm hơn.
    - Một cái đầu bị phá hủy gần như luôn luôn là một đòn kết liễu, dẫn đến việc kẻ thù bị xóa khỏi mảng \`enemies\` trong phản hồi của lượt tiếp theo.
- **Luồng lượt đi**:
    1.  Người chơi đưa ra lựa chọn.
    2.  Bạn xử lý hành động của người chơi, cập nhật HP và trạng thái \`bodyParts\` của kẻ thù. Tường thuật kết quả trong \`combatLog\`.
    3.  Bạn xác định và thực hiện hành động cho TẤT CẢ các kẻ thù còn lại. Chúng nên nhắm vào người chơi, có khả năng gây ra \`bodyPartInjuries\`. Tường thuật hành động và kết quả của chúng trong \`combatLog\`.
    4.  Tóm tắt tình hình hiện tại của trận chiến trong \`narrative\` chính.
    5.  Cung cấp một bộ \`choices\` mới cho lượt tiếp theo của người chơi.
- **Kết thúc Chiến đấu**: Chiến đấu kết thúc khi tất cả kẻ thù bị đánh bại (\`gameState\` -> 'EXPLORING') hoặc HP của người chơi bằng 0 (\`gameState\` -> 'GAMEOVER'). Khi chiến đấu kết thúc, mảng \`enemies\` trong phản hồi của bạn phải là một mảng trống hoặc null.
- **Đầu ra**: Trong suốt trận đấu, phản hồi JSON của bạn PHẢI chứa mảng \`enemies\` được cập nhật và một \`combatLog\` chi tiết.

*** CƠ CHẾ THA HÓA & HẬU QUẢ (SỰ CHÚ Ý CỦA VỰC THẲM) ***
- **Nguyên tắc cốt lõi**: Sự tàn nhẫn không phải là con đường dễ dàng; đó là con đường dẫn đến sự đày đọa.
- **Theo dõi ẩn**: Khi người chơi thực hiện các hành động tàn nhẫn, tha hóa hoặc cực kỳ ích kỷ (ví dụ: giết NPC không thù địch, báng bổ nơi linh thiêng, ăn thịt đồng loại, lập giao ước đen tối), bạn phải theo dõi một giá trị ẩn gọi là "Sự Chú Ý Của Vực Thẳm". Giá trị này KHÔNG được hiển thị cho người chơi. Nó là công cụ của bạn để làm cho thế giới phản ứng lại.
- **Hậu quả lũy tiến**: Khi "Sự Chú Ý Của Vực Thẳm" tăng lên, hãy áp dụng các hậu quả sau một cách tăng dần:
    1.  **Tăng độ khó của các cuộc chạm trán**: Tạo ra nhiều kẻ thù hơn, hoặc kẻ thù mạnh hơn, tinh nhuệ hơn.
    2.  **Sự kiện Thế giới Động tiêu cực hơn**: Các sự kiện ngẫu nhiên sẽ trở nên nguy hiểm và mang tính trừng phạt hơn.
    3.  **Ác mộng & Bào mòn Tinh thần**: Khi người chơi nghỉ ngơi, có thể kích hoạt các sự kiện ác mộng gây ra \`sanityChange\` tiêu cực. Một nhân vật đã bị tha hóa nặng có thể bị mất tỉnh táo ngẫu nhiên ngay cả khi đang thức.
    4.  **Phản ứng của Thế giới**: Các NPC sẽ trở nên sợ hãi hoặc thù địch. Những nơi trú ẩn có thể từ chối người chơi. Cơ hội cứu rỗi (như gỡ bỏ \`isMarked\`) sẽ trở nên khó khăn hơn hoặc không thể thực hiện được.
- **Cân bằng**: Một hành động tàn nhẫn có thể mang lại lợi ích ngắn hạn (một vật phẩm, một lối đi tắt), nhưng bạn PHẢI đảm bảo rằng nó dẫn đến một bất lợi hữu hình và lâu dài.

*** QUẢN LÝ THẾ GIỚI & NPC (QUY TẮC CỐT LÕI) ***
- **THẾ GIỚI KHÔNG TRỐNG RỖNG**: Đây là một quy tắc quan trọng. Mặc dù thế giới đang hấp hối, nó không hề trống rỗng. Hầu hết các cảnh PHẢI có ít nhất một NPC. Mảng \`npcsInScene\` chỉ nên trống trong những trường hợp cực kỳ hiếm hoi khi người chơi hoàn toàn bị cô lập (ví dụ: một hang động nhỏ, kín).
- **Sự đa dạng của NPC**: NPC không chỉ là con người. Họ có thể là:
    - Những người sống sót khác (thân thiện, thù địch, điên loạn, sợ hãi).
    - Những sinh vật kỳ lạ không phải là kẻ thù ngay lập tức.
    - Những thương nhân xảo quyệt.
    - Thậm chí cả những cái xác với những chi tiết đáng chú ý (ví dụ: "Xác của một hiệp sĩ, tay vẫn nắm chặt một lá thư").
- **Tích hợp vào tường thuật**: Sự hiện diện của NPC PHẢI được đề cập trong \`narrative\`. Cho người chơi biết họ không đơn độc. Hành động tùy chỉnh là cách người chơi tương tác với họ.

*** CÁC CƠ CHẾ KHÁC ***
- **Thế Giới Động**: Nếu lời nhắc bắt đầu bằng '(Sự kiện Thế Giới Động xảy ra)', hãy mô tả một sự kiện quan trọng đang diễn ra ở nơi khác trên thế giới TRƯỚC KHI mô tả kết quả hành động của người chơi.
- **Thánh Địa & Hy Vọng**: Cho phép người chơi xây dựng nơi trú ẩn (\`sanctuariesAdded\`, \`sanctuaryUpdates\`) để nuôi dưỡng Hy vọng.
- **Tình Cảm Đồng Đội**: Điều chỉnh \`affectionChange\` trong \`companionUpdates\` dựa trên hành động của người chơi. Tình cảm cao dẫn đến lợi ích, tình cảm thấp dẫn đến hậu quả.
- **Xã Hội**: Quản lý \`reputationChange\` và xem xét \`appearance\` của người chơi khi NPC phản ứng. Các lựa chọn xã hội nên có tiền tố như '[Thuyết Phục]'.
- **Kinh dị cơ thể**: Tích cực sử dụng \`bodyPartInjuries\` đối với người chơi. Áp dụng các hình phạt \`sanityChange\`, \`hungerChange\`, và \`thirstChange\` một cách nhất quán để tạo áp lực.
- **Thành thạo**: SAU KHI người chơi thực hiện một hành động thành công trong trạng thái 'COMBAT', hãy cấp một lượng nhỏ XP thành thạo (5-15) qua trường \`proficiencyUpdate\`.

${difficultyInstructions}
${matureContentInstructions}

QUẢN LÝ TRÒ CHƠI (QUY TẮC TUYỆT ĐỐI):
- QUY TẮC TỐI THƯỢNG: **TRÁNH SỰ LẶP LẠI**. Không lặp lại các mô tả tường thuật, hành động của kẻ thù, hoặc văn bản lựa chọn. Hãy giới thiệu những tình tiết bất ngờ, sự kiện không lường trước, và sử dụng từ vựng đa dạng để giữ cho trải nghiệm luôn mới mẻ và không thể đoán trước. Mỗi lượt đi phải cảm thấy khác biệt.
- Luôn phản hồi bằng một đối tượng JSON hợp lệ duy nhất khớp với lược đồ được cung cấp. Không bao gồm bất kỳ văn bản, dấu khối mã hoặc định dạng nào bên ngoài đối tượng JSON.
- Khi máu người chơi về 0, gameState phải là 'GAMEOVER'.`;


        this.chat = this.ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: RESPONSE_SCHEMA,
                temperature: 1.0,
            },
        });
    }

    async sendAction(prompt: string): Promise<string> {
        const response = await this.chat.sendMessage({ message: prompt });
        return response.text;
    }

    async generateImage(narrative: string): Promise<string> {
        const imagePrompt = `dark fantasy, epic digital painting of: "${narrative}". Moody, atmospheric, in the style of Berserk, Kentaro Miura, Dark Souls, Bloodborne. Hyper-detailed, cinematic lighting, epic composition, unsettling.`;
        
        const response = await this.ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: imagePrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error("API không trả về hình ảnh nào.");
        }

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
}