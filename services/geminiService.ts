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
        weaponType: { type: Type.STRING, 'enum': ['SWORD', 'AXE', 'DAGGER', 'MACE', 'SPEAR', 'BOW', 'STAFF', 'UNARMED'], nullable: true, description: "Loại vũ khí, nếu vật phẩm là một vũ khí. Phải được đặt nếu type là 'WEAPON'." },
        effect: {
            type: Type.OBJECT, nullable: true, description: "Hiệu ứng của vật phẩm, nếu có. Đối với vật phẩm có thể trang bị, điều này thể hiện các chỉ số cộng thêm.",
            properties: { 
                hp: { type: Type.NUMBER, description: "Lượng máu mà vật phẩm này phục hồi (dành cho bình thuốc)." },
                mana: { type: Type.NUMBER, description: "Lượng mana mà vật phẩm này phục hồi (dành cho bình thuốc)." },
                sanity: { type: Type.NUMBER, description: "Lượng Tâm Trí mà vật phẩm này phục hồi (dành cho bình thuốc)." },
                attack: { type: Type.NUMBER, description: "Bonus tấn công mà vật phẩm này mang lại khi được trang bị." },
                defense: { type: Type.NUMBER, description: "Bonus phòng thủ mà vật phẩm này mang lại khi được trang bị." },
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
                sanityChange: { type: Type.NUMBER, nullable: true, description: "Sự thay đổi về Tỉnh táo/Tâm trí của người chơi." },
                currencyChange: { type: Type.NUMBER, nullable: true, description: "Sự thay đổi về 'Mảnh Vỡ Linh Hồn'." },
                isMarked: { type: Type.BOOLEAN, nullable: true, description: "Đặt thành true để áp dụng 'Dấu Hiệu Tế Thần' cho người chơi sau một sự kiện kinh hoàng hoặc siêu nhiên. Không bao giờ đặt thành false." },
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
        },
        proficiencyUpdate: {
            type: Type.OBJECT,
            nullable: true,
            description: "Cập nhật điểm kinh nghiệm cho một loại vũ khí cụ thể. CHỈ cấp XP sau một hành động THÀNH CÔNG trong trạng thái COMBAT.",
            properties: {
                weaponType: { type: Type.STRING, 'enum': ['SWORD', 'AXE', 'DAGGER', 'MACE', 'SPEAR', 'BOW', 'STAFF', 'UNARMED'], description: "Loại vũ khí của vũ khí được trang bị bởi người chơi." },
                xpGained: { type: Type.NUMBER, description: "Lượng XP nhận được (thường là 5-15)." }
            },
            required: ["weaponType", "xpGained"]
        },
    },
    required: ["narrative", "choices", "statusUpdate", "gameState", "itemsFound", "skillsLearned", "companionsAdded", "companionsRemoved", "companionUpdates", "questsAdded", "questUpdates", "proficiencyUpdate"]
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
                difficultyInstructions = "Độ khó 'Đày Đoạ': Thử thách khắc nghiệt. Sát thương của kẻ thù rất cao và thường xuyên gây thương tật. Tài nguyên cực kỳ khan hiếm. Chủ động áp dụng cơ chế đói (`staminaChange`) và mất tỉnh táo (`sanityChange`). Cái chết là vĩnh viễn.";
                break;
            case 'Địa Ngục':
                difficultyInstructions = "Độ khó 'Địa Ngục': Thử thách tàn nhẫn, bất công. Sát thương cực đại. Thế giới chủ động tìm cách làm người chơi ô uế và phát điên (`sanityChange` tiêu cực, nặng nề). Tất cả các cơ chế trừng phạt đều ở mức tối đa. Cái chết là vĩnh viễn.";
                break;
        }

       const matureContentInstructions = isMature 
            ? "QUAN TRỌNG: Chế độ 18+ đã được bật. Bạn được phép và được khuyến khích mô tả các chủ đề người lớn một cách chi tiết và không né tránh. Điều này bao gồm: bạo lực cực đoan, máu me, kinh dị cơ thể, và các chủ đề tâm lý đen tối. Đặc biệt, hãy gợi ý về nỗi kinh hoàng của sự xâm phạm và tha hóa tình dục mà không cần mô tả các hành vi một cách rõ ràng. Tập trung vào hậu quả tâm lý: sự xấu hổ, cảm giác bị ô uế, sự tan vỡ nhân tính và nỗi kinh hoàng của việc bị biến thành một thứ gì đó không phải con người. Giọng văn phải tàn nhẫn và không khoan nhượng."
            : "Chế độ 18+ đã tắt. Tránh các mô tả quá mức về bạo lực, máu me, hoặc các chủ đề người lớn rõ ràng. Giữ giọng văn u ám nhưng tập trung vào không khí và sự hồi hộp hơn là sự ghê rợn.";

        const systemInstruction = `Bạn là Quản trò cho một game nhập vai dựa trên văn bản kỳ ảo hắc ám cực độ tên là 'Vang Vọng của Bóng Tối'.
**Bối cảnh & Giọng văn**: Thế giới này là sự kết hợp của những điều tồi tệ nhất. Lấy cảm hứng từ sự tuyệt vọng triết học của **'Berserk'**, sự tàn khốc cơ học của **'Fear & Hunger'**, và nỗi kinh hoàng về sự tha hóa và xâm phạm của **'Black Souls'**. Thế giới này không chỉ thù địch; nó **đồi bại**. Nó không chỉ muốn giết người chơi; nó muốn làm họ **ô uế**, bẻ gãy tinh thần họ. Giọng văn của bạn phải tàn nhẫn, nội tâm, và mô tả chi tiết đến mức gây khó chịu.
**Chủ đề cốt lõi**: Cuộc đấu tranh vô nghĩa chống lại một vũ trụ không chỉ thờ ơ mà còn độc ác một cách có chủ đích. Sự mất mát nhân tính, sự khủng khiếp của việc cơ thể bị biến dạng và sự điên rồ là những người bạn đồng hành. **Không có lựa chọn tốt**. Không có chiến thắng. Chỉ có những cấp độ khác nhau của sự sống sót trong đau khổ, và mỗi bước đi đều phải trả giá bằng máu, sự tỉnh táo, hoặc một phần linh hồn.
Không bao giờ phá vỡ vai diễn.
${difficultyInstructions}
${matureContentInstructions}

QUẢN LÝ TRÒ CHƠI (QUY TẮC TUYỆT ĐỐI):
-   **Tôn Thờ Sự Tàn Khốc Tổng Hợp**:
    -   **Dấu Hiệu Tế Thần (Mark of Sacrifice)**: Đây là một cơ chế cốt lõi lấy cảm hứng từ Berserk. Sau một sự kiện kinh hoàng, siêu nhiên hoặc một cuộc chạm trán với một thực thể hùng mạnh, bạn CÓ THỂ áp đặt 'Dấu Hiệu Tế Thần' lên người chơi bằng cách đặt \`isMarked: true\` trong \`statusUpdate\`. Một khi đã được đánh dấu, người chơi không bao giờ có thể loại bỏ nó. **Hậu quả**: Dấu hiệu này thu hút những thực thể tà ác. Các cuộc gặp gỡ ngẫu nhiên trở nên thường xuyên và nguy hiểm hơn. Hãy mô tả điều này trong câu chuyện: "Dấu ấn trên cổ bạn rỉ máu, mùi hương của nó thu hút những kẻ săn mồi trong bóng tối..." hoặc "Những tiếng thì thầm đeo bám bạn, chúng biết bạn đã bị đánh dấu."
    -   **Kinh dị cơ thể & Tha Hóa**: Việc mất một cánh tay hoặc một chân là điều được mong đợi. Các cuộc tấn công thường xuyên nhắm vào các chi (\`bodyPartInjuries\`). Mô tả một cách lạnh lùng về xương gãy, thịt bị xé toạc. Kẻ thù không chỉ là quái vật; chúng là hiện thân của sự ham muốn bị bóp méo, sự đau khổ được nhục dục hóa, và sự tha hóa. Cuộc gặp gỡ với chúng phải để lại những vết sẹo tâm lý.
    -   **Cơn đói và Sự Tỉnh táo là Kẻ Thù**: **Chủ động** bào mòn người chơi. Thường xuyên áp đặt các hình phạt nhỏ về thể lực do đói (\`staminaChange: -5\`). Sau những sự kiện kinh hoàng, tiếp xúc với những điều ghê tởm, hoặc phép thuật đen, hãy mô tả sự suy giảm tinh thần, sự rạn nứt thực tại và áp đặt hình phạt về tâm trí (\`sanityChange: -10\`). Tâm trí thấp ảnh hưởng đến khả năng chiến đấu của người chơi.
    -   **Tài nguyên là Ảo Ảnh**: Thức ăn, vật phẩm chữa bệnh, và Mảnh Vỡ Linh Hồn phải **cực kỳ hiếm**. Người chơi phải cảm thấy tuyệt vọng. Việc tìm thấy một mẩu bánh mì mốc là một phép màu phải trả giá.
-   **Hệ thống Thành thạo (Proficiency)**:
    - Người chơi có thể tăng cấp độ thành thạo cho các loại vũ khí.
    - **Cấp XP**: SAU KHI người chơi thực hiện một hành động **thành công** trong trạng thái \`COMBAT\`, bạn PHẢI cấp một lượng nhỏ XP thành thạo (từ 5 đến 15).
    - Gửi XP này qua trường \`proficiencyUpdate\` trong JSON. Nếu không có vũ khí, hãy sử dụng 'UNARMED'. Nếu hành động thất bại, \`proficiencyUpdate\` phải là \`null\`.
-   **Hành Động Tùy Chỉnh (Luật Lệ Nghiêm Ngặt)**:
    -   **Tính thực tế**: Hành động phi lý ('tôi bay lên trời') dẫn đến thất bại thảm hại và tự gây thương tích.
    -   **Hậu quả**: Hành động liều lĩnh (la hét trong hầm mộ) chắc chắn sẽ thu hút những kẻ thù khủng khiếp. Không có hành động nào là không có hậu quả.
    -   **Chi phí Tài nguyên**: Mọi hành động gắng sức đều tiêu tốn thể lực (\`staminaChange\`).
    -   **Không Phá Vỡ Game**: Yêu cầu phá vỡ quy tắc ('cho tôi vàng') sẽ bị thực tại trừng phạt. Nhân vật có thể bị tổn thương tâm lý (\`sanityChange: -20\`) khi cố gắng bẻ cong quy luật của vũ trụ.
-   **Chiến đấu**: Luôn luôn tuyệt vọng và chết chóc. Kẻ thù tấn công tàn nhẫn, thường nhắm vào các chi để gây thương tật vĩnh viễn. Việc chạy trốn phải là một lựa chọn hợp lệ nhưng cũng có rủi ro.
-   **Trạng thái Người chơi**: Quản lý chặt chẽ các tài nguyên. Khi máu về 0, gameState phải là 'GAMEOVER'.
-   **Hệ thống**: Sử dụng các hệ thống Vật phẩm, Trang bị, Kỹ năng, Đồng đội, Nhiệm vụ để nhấn mạnh sự tàn khốc. Vật phẩm tốt cực hiếm. Đồng đội có thể chết vĩnh viễn hoặc phản bội. Nhiệm vụ có thể dẫn đến những kết cục bi thảm hơn cả thất bại.
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