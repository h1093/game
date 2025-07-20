
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Difficulty } from '../types';

const ITEM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "Một mã định danh duy nhất cho phiên bản vật phẩm (ví dụ: 'healing_potion_1')." },
        name: { type: Type.STRING, description: "Tên của vật phẩm (ví dụ: 'Bình Thuốc Phát Sáng Mờ')." },
        description: { type: Type.STRING, description: "Một mô tả ngắn gọn, đầy không khí về vật phẩm." },
        type: { type: Type.STRING, 'enum': ['POTION', 'WEAPON', 'ARMOR', 'KEY', 'MISC', 'RING', 'AMULET'], description: "Loại của vật phẩm." },
        equipmentSlot: { type: Type.STRING, 'enum': ['weapon', 'armor', 'ring1', 'ring2'], nullable: true, description: "Ô trang bị mà vật phẩm này thuộc về, nếu có." },
        effect: {
            type: Type.OBJECT, nullable: true, description: "Hiệu ứng của vật phẩm, nếu có. Đối với vật phẩm có thể trang bị, điều này thể hiện các chỉ số cộng thêm.",
            properties: { 
                hp: { type: Type.NUMBER, description: "Lượng máu mà vật phẩm này phục hồi (dành cho bình thuốc)." },
                mana: { type: Type.NUMBER, description: "Lượng mana mà vật phẩm này phục hồi (dành cho bình thuốc)." },
                attack: { type: Type.NUMBER, description: "Bonus tấn công mà vật phẩm này mang lại khi được trang bị." },
                defense: { type: Type.NUMBER, description: "Bonus phòng thủ mà vật phẩm này mang lại khi được trang bị." },
                maxHp: { type: Type.NUMBER, description: "Bonus máu tối đa mà vật phẩm này mang lại khi được trang bị." },
                maxStamina: { type: Type.NUMBER, description: "Bonus thể lực tối đa mà vật phẩm này mang lại khi được trang bị." },
                maxMana: { type: Type.NUMBER, description: "Bonus mana tối đa mà vật phẩm này mang lại khi được trang bị." }
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
    },
    required: ["id", "name", "hp", "maxHp", "description"]
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
                    text: { type: Type.STRING, description: "Văn bản hiển thị trên nút lựa chọn cho người chơi." },
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
                currencyChange: { type: Type.NUMBER, nullable: true, description: "Sự thay đổi về 'Mảnh Vỡ Linh Hồn'." },
                bodyPartInjuries: {
                    type: Type.ARRAY,
                    nullable: true,
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
        itemsFound: { type: Type.ARRAY, nullable: true, description: "Một mảng các vật phẩm người chơi tìm thấy trong cảnh này.", items: ITEM_SCHEMA },
        skillsLearned: { type: Type.ARRAY, nullable: true, description: "Kỹ năng mới mà người chơi học được trong cảnh này.", items: SKILL_SCHEMA },
        companionsAdded: { type: Type.ARRAY, nullable: true, description: "Đồng đội mới gia nhập nhóm.", items: COMPANION_SCHEMA },
        companionsRemoved: { type: Type.ARRAY, nullable: true, description: "Một mảng các ID của đồng đội rời khỏi nhóm (chết hoặc rời đi).", items: { type: Type.STRING } },
        companionUpdates: {
            type: Type.ARRAY, nullable: true, description: "Cập nhật trạng thái cho các đồng đội hiện tại (ví dụ: thay đổi máu).",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "ID của đồng đội cần cập nhật." },
                    hpChange: { type: Type.NUMBER, description: "Thay đổi máu của đồng đội (âm cho sát thương, dương cho hồi máu)." },
                },
                required: ["id", "hpChange"]
            }
        },
        questsAdded: { type: Type.ARRAY, nullable: true, description: "Nhiệm vụ mới được giao cho người chơi.", items: QUEST_SCHEMA },
        questUpdates: {
            type: Type.ARRAY, nullable: true, description: "Cập nhật trạng thái cho các nhiệm vụ hiện có.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "ID của nhiệm vụ cần cập nhật." },
                    status: { type: Type.STRING, 'enum': ['COMPLETED', 'FAILED'], description: "Trạng thái mới của nhiệm vụ." },
                },
                required: ["id", "status"]
            }
        }
    },
    required: ["narrative", "choices", "statusUpdate", "gameState", "itemsFound", "skillsLearned", "companionsAdded", "companionsRemoved", "companionUpdates", "questsAdded", "questUpdates"]
};


export class GameAIService {
    private chat: Chat;

    constructor(difficulty: Difficulty, apiKey: string) {
        if (!apiKey) {
            throw new Error("API Key không được cung cấp khi khởi tạo GameAIService.");
        }
        const ai = new GoogleGenAI({ apiKey: apiKey });
        
        let difficultyInstructions = '';
        switch (difficulty) {
            case 'Thử Thách':
                difficultyInstructions = "Trò chơi đang ở độ khó 'Thử Thách'. Đây là trải nghiệm cân bằng. Kẻ thù là một mối đe dọa thực sự, và việc quản lý tài nguyên là rất quan trọng. Các cuộc chiến nên mang tính chiến thuật.";
                break;
            case 'Ác Mộng':
                difficultyInstructions = "Trò chơi đang ở độ khó 'Ác Mộng'. Thử thách phải cực kỳ khó khăn. Kẻ thù mạnh, thông minh và không khoan nhượng. Tài nguyên cực kỳ khan hiếm. Đừng ngần ngại đẩy người chơi đến giới hạn của họ. Cái chết là một khả năng thực sự.";
                break;
        }

        const systemInstruction = `Bạn là Quản trò cho một game nhập vai dựa trên văn bản kỳ ảo hắc ám tên là 'Vang Vọng của Bóng Tối'. Thế giới này nghiệt ngã, bí ẩn và không khoan nhượng, lấy cảm hứng từ Dark Souls và Bloodborne. Giọng văn của bạn u ám, văn học và mô tả rất chi tiết. Không bao giờ thoát vai.
${difficultyInstructions}

QUẢN LÝ TRÒ CHƠI:
-   **Tường thuật**: Luôn mô tả hậu quả từ hành động của người chơi một cách sống động.
-   **Trạng thái Người chơi**: Quản lý máu, thể lực, và mana của người chơi. Các hành động đòi hỏi thể chất (tấn công, né tránh) nên tiêu tốn thể lực. Kỹ năng có thể tốn mana hoặc thể lực. Mô tả cảm giác kiệt sức khi tài nguyên thấp. Khi máu về 0, gameState phải là 'GAMEOVER'.
-   **Vật phẩm & Tiền tệ**: Thưởng cho người chơi vật phẩm ('itemsFound') và tiền tệ 'Mảnh Vỡ Linh Hồn' ('currencyChange') một cách có ý nghĩa và khan hiếm.
-   **Hệ Thống Trang Bị**: Bạn có thể cấp các vật phẩm có thể trang bị. Các vật phẩm này có một 'equipmentSlot' (ví dụ: 'weapon', 'armor') và một đối tượng 'effect' chứa các bonus chỉ số (ví dụ: attack, defense). Mô tả sự xuất hiện của các vật phẩm này trong câu chuyện.
-   **Hệ Thống Thương Tích & Cắt Đứt Chi**: Bạn có thể gây ra thương tích cho các bộ phận cơ thể cụ thể ('bodyPartInjuries').
    -   **Cấp độ**: Các bộ phận là 'head', 'torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'. Mức độ là 'INJURED' (nhẹ), 'CRITICAL' (nặng), hoặc 'SEVERED' (bị cắt đứt).
    -   **Cắt đứt chi**: Khi một bộ phận bị cắt đứt, trạng thái của nó là vĩnh viễn. Điều này có hậu quả nghiêm trọng. Ví dụ, người chơi mất một cánh tay sẽ không thể sử dụng vũ khí hai tay. Hãy phản ánh những hạn chế này trong tường thuật và các lựa chọn bạn đưa ra.
    -   **Vật phẩm chi bị cắt đứt**: Khi một bộ phận bị cắt đứt, hãy tạo một vật phẩm tương ứng trong 'itemsFound'. Vật phẩm này phải có 'isSeveredPart: true' và một 'decayTimer' (ví dụ: 20 lượt). Tên vật phẩm phải rõ ràng (ví dụ: 'Cánh Tay Phải Bị Cắt Đứt').
    -   **Bảo quản Chi**: Nếu người chơi thực hiện hành động hợp lý để bảo quản một chi bị cắt đứt (ví dụ: bọc nó trong vải sạch, ướp muối, giữ ở nơi lạnh), bạn nên phản ánh điều này. Đặt \`isPreserved: true\` cho vật phẩm chi bị cắt đứt và đặt một \`decayTimer\` dài hơn đáng kể (ví dụ: 40 lượt thay vì 20). Tên vật phẩm cũng nên phản ánh điều này (ví dụ: 'Cánh Tay Phải Bị Cắt Đứt (Được bảo quản)').
    -   **Sự Phân Rã**: Trò chơi sẽ tự động xử lý bộ đếm ngược phân rã. Bạn chỉ cần tạo ra vật phẩm ban đầu với 'decayTimer'.
-   **Kỹ năng**: Bạn có thể cấp cho người chơi các kỹ năng mới ('skillsLearned') như phần thưởng. Kỹ năng nên phù hợp với lớp nhân vật và hành động của họ.
-   **Đồng đội**: Bạn có thể giới thiệu các đồng đội ('companionsAdded'). Họ có máu riêng và có thể nhận sát thương ('companionUpdates'). Mô tả hành động của họ trong câu chuyện. Họ có thể rời đi hoặc chết ('companionsRemoved').
-   **Nhiệmvụ**: Giao nhiệm vụ cho người chơi ('questsAdded') để tạo ra các mục tiêu. Cập nhật trạng thái của chúng thành 'COMPLETED' hoặc 'FAILED' khi thích hợp ('questUpdates').
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
