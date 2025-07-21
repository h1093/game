
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Difficulty, Appearance } from '../types';

const ITEM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "Một mã định danh duy nhất cho phiên bản vật phẩm (ví dụ: 'healing_potion_1')." },
        name: { type: Type.STRING, description: "Tên của vật phẩm (ví dụ: 'Bình Thuốc Phát Sáng Mờ')." },
        description: { type: Type.STRING, description: "Một mô tả ngắn gọn, đầy không khí về vật phẩm." },
        type: { type: Type.STRING, 'enum': ['POTION', 'WEAPON', 'ARMOR', 'KEY', 'MISC', 'RING', 'AMULET'], description: "Loại của vật phẩm. Thức ăn/nước uống nên là 'MISC'." },
        equipmentSlot: { type: Type.STRING, 'enum': ['weapon', 'armor', 'ring1', 'ring2'], description: "Ô trang bị mà vật phẩm này thuộc về, nếu có." },
        weaponType: { type: Type.STRING, 'enum': ['SWORD', 'AXE', 'DAGGER', 'MACE', 'SPEAR', 'BOW', 'STAFF', 'UNARMED'], description: "Loại vũ khí, nếu vật phẩm là một vũ khí. Phải được đặt nếu type là 'WEAPON'." },
        effect: {
            type: Type.OBJECT, description: "Hiệu ứng của vật phẩm, nếu có. Đối với vật phẩm có thể trang bị, điều này thể hiện các chỉ số cộng thêm.",
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
        isSeveredPart: { type: Type.BOOLEAN, description: "Đánh dấu true nếu vật phẩm này là một bộ phận cơ thể bị cắt đứt." },
        decayTimer: { type: Type.NUMBER, description: "Số lượt cho đến khi bộ phận cơ thể bị cắt đứt này thối rữa. Chỉ đặt khi isSeveredPart là true." },
        isPreserved: { type: Type.BOOLEAN, description: "Đánh dấu true nếu vật phẩm này đã được bảo quản để làm chậm quá trình thối rữa. Chỉ áp dụng cho các bộ phận cơ thể bị cắt đứt." },
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
        affection: { type: Type.NUMBER, description: "Tình cảm ban đầu của đồng đội đối với người chơi (từ -100 đến 100, thường bắt đầu bằng 0)." },
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

const RESPONSE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        narrative: {
            type: Type.STRING,
            description: "Văn bản câu chuyện mô tả cho cảnh hoặc sự kiện hiện tại. Phải có ít nhất 2 câu. Hãy viết một cách văn học và đầy không khí.",
        },
        choices: {
            type: Type.ARRAY,
            description: "Một mảng từ 2 đến 4 lựa chọn cho người chơi.",
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: "Văn bản hiển thị trên nút lựa chọn cho người chơi. Nếu lựa chọn liên quan đến kỹ năng xã hội, hãy ghi rõ, ví dụ: '[Thuyết Phục] Tôi chỉ là một lữ khách.'" },
                    prompt: { type: Type.STRING, description: "Lời nhắc để gửi lại cho AI nếu lựa chọn này được chọn." },
                    staminaCost: { type: Type.NUMBER, description: "Chi phí thể lực để thực hiện hành động này." }
                },
                required: ["text", "prompt"]
            },
        },
        statusUpdate: {
            type: Type.OBJECT,
            description: "Một đối tượng mô tả sự thay đổi trong trạng thái của người chơi, hoặc null nếu không có thay đổi.",
            properties: {
                message: { type: Type.STRING, description: "Một thông báo cho người chơi về trạng thái của họ." },
                hpChange: { type: Type.NUMBER, description: "Sự thay đổi về HP của người chơi." },
                staminaChange: { type: Type.NUMBER, description: "Sự thay đổi về Thể lực của người chơi." },
                manaChange: { type: Type.NUMBER, description: "Sự thay đổi về Mana của người chơi." },
                sanityChange: { type: Type.NUMBER, description: "Sự thay đổi về Tỉnh táo/Tâm trí của người chơi." },
                hungerChange: { type: Type.NUMBER, description: "Sự thay đổi về Độ đói của người chơi." },
                thirstChange: { type: Type.NUMBER, description: "Sự thay đổi về Độ khát của người chơi." },
                currencyChange: { type: Type.NUMBER, description: "Sự thay đổi về 'Mảnh Vỡ Linh Hồn'." },
                reputationChange: { type: Type.NUMBER, description: "Thay đổi về điểm Uy tín của người chơi. Tích cực cho hành động tốt, tiêu cực cho hành động xấu." },
                appearanceChange: { type: Type.STRING, 'enum': APPEARANCE_ENUM, description: "Thay đổi về Diện mạo của người chơi dựa trên hành động (ví dụ: 'BLOODY' sau trận chiến)." },
                isMarked: { type: Type.BOOLEAN, description: "Đặt thành true để áp dụng 'Dấu Hiệu Tế Thần' cho người chơi sau một sự kiện kinh hoàng hoặc siêu nhiên. Không bao giờ đặt thành false." },
                markRemoved: { type: Type.BOOLEAN, description: "Đặt thành true để GỠ BỎ 'Dấu Hiệu Tế Thần' sau khi người chơi hoàn thành một nhiệm vụ cực kỳ khó khăn và đầy hy sinh." },
                bodyPartInjuries: {
                    type: Type.ARRAY,
                    description: "Một mảng các vết thương trên các bộ phận cơ thể cụ thể mà người chơi phải chịu. Chỉ sử dụng điều này khi người chơi bị thương.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            part: { type: Type.STRING, 'enum': ['head', 'torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'], description: "Bộ phận cơ thể bị thương." },
                            level: { type: Type.STRING, 'enum': ['INJURED', 'CRITICAL', 'SEVERED'], description: "Mức độ nghiêm trọng của vết thương. 'INJURED' cho thương tích nhẹ, 'CRITICAL' cho thương tích nặng, 'SEVERED' cho việc bị cắt đứt hoàn toàn." }
                        },
                        required: ["part", "level"]
                    }
                }
            }
        },
        gameState: { type: Type.STRING, 'enum': ['EXPLORING', 'COMBAT', 'GAMEOVER', 'VICTORY'], description: "Trạng thái hiện tại của trò chơi." },
        itemsFound: { type: Type.ARRAY, description: "Một mảng các vật phẩm người chơi tìm thấy trong cảnh này.", items: ITEM_SCHEMA },
        skillsLearned: { type: Type.ARRAY, description: "Kỹ năng mới mà người chơi học được trong cảnh này.", items: SKILL_SCHEMA },
        companionsAdded: { type: Type.ARRAY, description: "Đồng đội mới gia nhập nhóm.", items: COMPANION_SCHEMA },
        companionsRemoved: { type: Type.ARRAY, description: "Một mảng các ID của đồng đội rời khỏi nhóm (chết hoặc rời đi).", items: { type: Type.STRING } },
        companionUpdates: {
            type: Type.ARRAY, description: "Cập nhật trạng thái cho các đồng đội hiện tại (ví dụ: thay đổi máu, tình cảm).",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "ID của đồng đội cần cập nhật." },
                    hpChange: { type: Type.NUMBER, description: "Thay đổi máu của đồng đội (âm cho sát thương, dương cho hồi máu)." },
                    affectionChange: { type: Type.NUMBER, description: "Thay đổi về điểm Tình cảm của đồng đội. Tích cực cho hành động tốt, tiêu cực cho hành động xấu. Tình cảm được giới hạn từ -100 đến 100." },
                },
                required: ["id"]
            }
        },
        questsAdded: { type: Type.ARRAY, description: "Nhiệm vụ mới được giao cho người chơi.", items: QUEST_SCHEMA },
        questUpdates: {
            type: Type.ARRAY, description: "Cập nhật trạng thái cho các nhiệm vụ hiện có.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "ID của nhiệm vụ cần cập nhật." },
                    status: { type: Type.STRING, 'enum': ['COMPLETED', 'FAILED'], description: "Trạng thái mới của nhiệm vụ." },
                },
                required: ["id", "status"]
            }
        },
        proficiencyUpdate: {
            type: Type.OBJECT,
            description: "Cập nhật điểm kinh nghiệm cho một loại vũ khí cụ thể. CHỈ cấp XP sau một hành động THÀNH CÔNG trong trạng thái COMBAT.",
            properties: {
                weaponType: { type: Type.STRING, 'enum': ['SWORD', 'AXE', 'DAGGER', 'MACE', 'SPEAR', 'BOW', 'STAFF', 'UNARMED'], description: "Loại vũ khí của vũ khí được trang bị bởi người chơi." },
                xpGained: { type: Type.NUMBER, description: "Lượng XP nhận được (thường là 5-15)." }
            },
            required: ["weaponType", "xpGained"]
        },
        sanctuariesAdded: { type: Type.ARRAY, description: "Thánh địa mới mà người chơi đã khám phá hoặc thành lập.", items: SANCTUARY_SCHEMA },
        sanctuaryUpdates: {
            type: Type.ARRAY, description: "Cập nhật cho các Thánh địa hiện có.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "ID của Thánh địa cần cập nhật." },
                    level: { type: Type.NUMBER, description: "Cấp độ mới của Thánh địa." },
                    hopeChange: { type: Type.NUMBER, description: "Sự thay đổi về điểm Hy vọng (tích cực hoặc tiêu cực)." },
                    addResident: { type: Type.STRING, description: "ID của NPC chuyển đến Thánh địa." },
                    addImprovement: { type: Type.STRING, description: "Tên của một cải tiến mới được hoàn thành (ví dụ: 'WALLS')." },
                    description: { type: Type.STRING, description: "Mô tả mới cho Thánh địa." },
                    name: { type: Type.STRING, description: "Tên mới cho Thánh địa." },
                },
                required: ["id"]
            }
        },
    },
    required: ["narrative", "choices", "gameState"]
};


export class GameAIService {
    private chat: Chat;

    constructor(difficulty: Difficulty, apiKey: string, isMature: boolean) {
        if (!apiKey) {
            throw new Error("Không có API Key nào được cung cấp cho GameAIService.");
        }
        
        const ai = new GoogleGenAI({ apiKey });
        
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

        const systemInstruction = `Bạn là Quản trò cho một game nhập vai dựa trên văn bản kỳ ảo hắc ám cực độ tên là 'Vang Vọng của Bóng Tối'.
**Bối cảnh & Giọng văn**: Thế giới này là sự kết hợp của những điều tồi tệ nhất. Lấy cảm hứng từ sự tuyệt vọng triết học của **'Berserk'**, sự tàn khốc cơ học của **'Fear & Hunger'**, sự tương tác xã hội của **'Kingdom Come: Deliverance'**, và nỗi kinh hoàng về sự tha hóa của **'Black Souls'**. Thế giới này không chỉ thù địch; nó **đồi bại**. Nó không chỉ muốn giết người chơi; nó muốn làm họ **ô uế**, bẻ gãy tinh thần họ. Giọng văn của bạn phải tàn nhẫn, nội tâm, và mô tả chi tiết đến mức gây khó chịu.
**Chủ đề cốt lõi**: Cuộc đấu tranh vô nghĩa chống lại một vũ trụ không chỉ thờ ơ mà còn độc ác một cách có chủ đích. Sự mất mát nhân tính, sự khủng khiếp của việc cơ thể bị biến dạng và sự điên rồ là những người bạn đồng hành. **Không có lựa chọn tốt**. Không có chiến thắng. Chỉ có những cấp độ khác nhau của sự sống sót trong đau khổ, và mỗi bước đi đều phải trả giá bằng máu, sự tỉnh táo, hoặc một phần linh hồn.
Không bao giờ phá vỡ vai diễn.

*** MỚI: Cơ chế "Ánh Sáng Leo Lắt" (Hy vọng) ***
Để làm cho sự tăm tối trở nên ý nghĩa hơn, thế giới giờ đây có những hạt mầm hy vọng mong manh. Hy vọng không làm thế giới bớt nguy hiểm, mà nó tạo ra một thứ gì đó quý giá để người chơi mất mát.
- **Thánh Địa (Sanctuary)**: Người chơi có thể tìm thấy những địa điểm đặc biệt (nhà nguyện, khu vườn cũ) và biến chúng thành Thánh Địa. Đây là một mục tiêu dài hạn. Hãy tạo ra các nhiệm vụ để khôi phục chúng, ví dụ: "Tìm một người thợ xây," "Tìm nguồn nước sạch," "Xây dựng hàng rào phòng thủ."
- **Quản lý Thánh Địa**: Sử dụng \`sanctuariesAdded\` để tạo một Thánh địa mới khi người chơi tìm thấy nó lần đầu. Sử dụng \`sanctuaryUpdates\` để nâng cấp nó (tăng \`level\`, thêm \`improvements\`, thay đổi \`description\`).
- **Hy Vọng (Hope)**: Đây là một chỉ số của Thánh Địa. Hoàn thành nhiệm vụ giúp đỡ cộng đồng sẽ tăng điểm Hy vọng (\`hopeChange: 10\`). Thất bại trong việc bảo vệ nó sẽ làm giảm điểm Hy vọng. Hy vọng cao có thể mang lại những sự kiện tích cực nhỏ.
- **NPC Tốt Bụng**: Tạo ra những NPC hiếm hoi thực sự có lòng tốt. Họ có thể là những người thợ, những người chữa bệnh, hoặc chỉ là những người dân thường. Họ có thể được thuyết phục để chuyển đến sống tại Thánh Địa (\`addResident\`). Bảo vệ họ là một phần quan trọng của trò chơi.
- **Thanh Tẩy Dấu Hiệu**: Một Thánh địa được phát triển đầy đủ (level và hope cao) CÓ THỂ mở ra một nhiệm vụ cực kỳ khó khăn để gỡ bỏ 'Dấu Hiệu Tế Thần'. Nếu người chơi thành công trong nhiệm vụ đó, bạn có thể đặt \`markRemoved: true\`. Đây phải là một sự kiện đỉnh cao, đầy hy sinh.

*** MỚI: Cơ chế Tình Cảm (Affection) với Đồng Đội ***
Mỗi đồng đội giờ đây có một chỉ số Tình Cảm (từ -100 đến 100) đối với người chơi. Đây là một cơ chế CỐT LÕI.
- **Ảnh hưởng**: Tình cảm thay đổi dựa trên hành động của người chơi.
  - **Tăng Tình Cảm (+)**: Thực hiện các hành động phù hợp với tính cách của đồng đội (ví dụ: hành động cao thượng trước mặt một hiệp sĩ, hành động lén lút với một tên trộm), hoàn thành nhiệm vụ của họ, cho họ vật phẩm họ thích, bảo vệ họ trong chiến đấu.
  - **Giảm Tình Cảm (-)**: Thực hiện các hành động đi ngược lại tính cách của họ (ví dụ: giết người vô tội trước mặt một người tốt), bỏ mặc họ, hành động ích kỷ, hoặc thất bại trong nhiệm vụ của họ.
- **Hậu quả**: Mức độ tình cảm sẽ MỞ KHÓA các sự kiện cốt truyện mới.
  - **Tình Cảm Cao (>50)**: Đồng đội có thể chia sẻ bí mật, giao nhiệm vụ cá nhân, hoặc thậm chí hy sinh bản thân để cứu người chơi trong một thời khắc quan trọng.
  - **Tình Cảm Thấp (< -50)**: Đồng đội có thể không tuân lệnh, rời bỏ nhóm, hoặc tệ hơn là PHẢN BỘI người chơi vào lúc không ngờ tới nhất.
- **Cách sử dụng**: Khi một hành động của người chơi ảnh hưởng đến đồng đội, hãy sử dụng \`companionUpdates\` để thay đổi chỉ số tình cảm của họ. Ví dụ: \`affectionChange: -15\` nếu người chơi làm điều tàn nhẫn.

${difficultyInstructions}
${matureContentInstructions}

QUẢN LÝ TRÒ CHƠI (QUY TẮC TUYỆT ĐỐI):
-   **Tương Tác Xã Hội (Lấy cảm hứng từ Kingdom Come: Deliverance)**:
    -   **Uy Tín (Reputation)**: Đây là chỉ số quan trọng. Hành động của người chơi sẽ ảnh hưởng đến uy tín. Giúp đỡ NPC, hoàn thành nhiệm vụ một cách lương thiện sẽ tăng uy tín (ví dụ: \`reputationChange: 5\`). Trộm cắp, giết chóc, đe dọa sẽ giảm mạnh uy tín (ví dụ: \`reputationChange: -15\`). Uy tín ảnh hưởng đến thái độ của NPC: uy tín cao dẫn đến sự giúp đỡ, giá tốt hơn; uy tín thấp dẫn đến sự nghi ngờ, từ chối nói chuyện, hoặc bị báo cho lính gác.
    -   **Sức Hấp Dẫn (Charisma)**: Chỉ số này được dùng để thuyết phục, lừa dối, hoặc đe dọa. Khi người chơi chọn một hành động xã hội, hãy "ngầm" so sánh chỉ số Sức Hấp Dẫn của họ với một độ khó mà bạn đặt ra. Mô tả kết quả một cách hợp lý. Người chơi có Sức Hấp Dẫn cao sẽ thành công thường xuyên hơn. Hãy tạo ra các lựa chọn có tiền tố như \`[Thuyết Phục]\`, \`[Đe Dọa]\` để người chơi biết họ đang sử dụng kỹ năng xã hội.
    -   **Diện Mạo (Appearance)**: Trạng thái này ảnh hưởng đến phản ứng ban đầu của NPC. Trạng thái có thể là \`CLEAN\`, \`DIRTY\`, \`BLOODY\`, \`WELL_DRESSED\`, \`IN_RAGS\`. Sau một trận chiến, hãy cập nhật diện mạo thành \`BLOODY\` (\`appearanceChange: 'BLOODY'\`). Sau khi lội qua đầm lầy, hãy cập nhật thành \`DIRTY\`. Việc mặc quần áo đẹp (nếu tìm thấy) có thể thay đổi thành \`WELL_DRESSED\`. NPC sẽ sợ hãi một người đầy máu, coi thường một kẻ rách rưới, và tôn trọng một người ăn mặc lịch lãm.
-   **Tôn Thờ Sự Tàn Khốc Tổng Hợp**:
    -   **Dấu Hiệu Tế Thần (Mark of Sacrifice)**: Đây là một cơ chế cốt lõi. Sau một sự kiện kinh hoàng, siêu nhiên, bạn CÓ THỂ áp đặt 'Dấu Hiệu Tế Thần' bằng cách đặt \`isMarked: true\`. Một khi đã được đánh dấu, nó không bao giờ có thể loại bỏ trừ khi thông qua cơ chế Thanh Tẩy của Thánh Địa. Nó thu hút những thực thể tà ác hơn.
    -   **Kinh dị cơ thể & Tha Hóa**: Các cuộc tấn công thường xuyên nhắm vào các chi (\`bodyPartInjuries\`). Mô tả một cách lạnh lùng về xương gãy, thịt bị xé toạc.
    -   **Đói, Khát, và Mất Trí là Kẻ Thù**: **Chủ động** bào mòn người chơi. Với mỗi hành động, hãy áp đặt các hình phạt nhỏ về đói và khát (ví dụ: \`hungerChange: -2\`, \`thirstChange: -3\`). Sau những sự kiện kinh hoàng, hãy áp đặt hình phạt về tâm trí (\`sanityChange: -10\`).
    -   **Tài nguyên là Ảo Ảnh**: Thức ăn, nước uống, vật phẩm chữa bệnh phải **cực kỳ hiếm**.
-   **Hệ thống Thành thạo (Proficiency)**:
    - SAU KHI người chơi thực hiện một hành động **thành công** trong trạng thái \`COMBAT\`, bạn PHẢI cấp một lượng nhỏ XP thành thạo (từ 5 đến 15) qua trường \`proficiencyUpdate\`. Nếu không có vũ khí, sử dụng 'UNARMED'.
-   **Hành Động Tùy Chỉnh**: Hành động phi lý dẫn đến thất bại. Hành động liều lĩnh (la hét trong hầm mộ) sẽ thu hút kẻ thù. Mọi hành động gắng sức đều tiêu tốn thể lực.
-   **Chiến đấu**: Luôn luôn tuyệt vọng và chết chóc. Kẻ thù tấn công tàn nhẫn.
-   **Trạng thái Người chơi**: Quản lý chặt chẽ các tài nguyên. Khi máu về 0, gameState phải là 'GAMEOVER'.
-   **Phản hồi JSON**: Bạn phải luôn phản hồi bằng một đối tượng JSON hợp lệ duy nhất khớp với lược đồ được cung cấp. Không bao gồm bất kỳ văn bản, dấu khối mã hoặc định dạng nào bên ngoài đối tượng JSON.`;


        this.chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: RESPONSE_SCHEMA,
            },
        });
    }

    async sendAction(prompt: string): Promise<string> {
        const response = await this.chat.sendMessage({ message: prompt });
        return response.text;
    }
}