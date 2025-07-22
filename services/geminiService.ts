

import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Difficulty, Appearance, OuterGodMark } from '../types';

export interface SendActionResult {
    text: string;
    tokenCount: number;
}

const ITEM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "Một mã định danh duy nhất cho phiên bản vật phẩm (ví dụ: 'healing_potion_1')." },
        name: { type: Type.STRING, description: "Tên của vật phẩm (ví dụ: 'Bình Thuốc Phát Sáng Mờ')." },
        description: { type: Type.STRING, description: "Một mô tả ngắn gọn, đầy không khí về vật phẩm." },
        type: { type: Type.STRING, enum: ['POTION', 'WEAPON', 'ARMOR', 'KEY', 'MISC', 'RING', 'AMULET'], description: "Loại vật phẩm." },
        equipmentSlot: { type: Type.STRING, enum: ['weapon', 'armor', 'ring1', 'ring2'], description: "Vị trí trang bị nếu có.", nullable: true },
        weaponType: { type: Type.STRING, enum: ['SWORD', 'AXE', 'DAGGER', 'MACE', 'SPEAR', 'BOW', 'STAFF', 'UNARMED'], description: "Loại vũ khí nếu là vũ khí.", nullable: true },
        effect: {
            type: Type.OBJECT,
            nullable: true,
            properties: {
                hp: { type: Type.NUMBER, description: "Hồi phục máu.", nullable: true },
                mana: { type: Type.NUMBER, description: "Hồi phục mana.", nullable: true },
                sanity: { type: Type.NUMBER, description: "Hồi phục tâm trí.", nullable: true },
                hunger: { type: Type.NUMBER, description: "Làm dịu cơn đói.", nullable: true },
                thirst: { type: Type.NUMBER, description: "Giải tỏa cơn khát.", nullable: true },
                attack: { type: Type.NUMBER, description: "Tăng tấn công.", nullable: true },
                defense: { type: Type.NUMBER, description: "Tăng phòng thủ.", nullable: true },
                charisma: { type: Type.NUMBER, description: "Tăng sức hấp dẫn.", nullable: true },
                maxHp: { type: Type.NUMBER, nullable: true },
                maxStamina: { type: Type.NUMBER, nullable: true },
                maxMana: { type: Type.NUMBER, nullable: true },
                maxSanity: { type: Type.NUMBER, nullable: true },
            }
        },
        isSeveredPart: { type: Type.BOOLEAN, nullable: true, description: "True nếu là một bộ phận cơ thể bị cắt đứt." },
        decayTimer: { type: Type.NUMBER, nullable: true, description: "Số lượt cho đến khi bộ phận cơ thể bị thối rữa." },
        isPreserved: { type: Type.BOOLEAN, nullable: true, description: "True nếu bộ phận cơ thể đã được bảo quản." },
    }
};

const GAME_DATA_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        narrative: { type: Type.STRING, description: "Mô tả chi tiết, đầy không khí về môi trường, sự kiện và kết quả hành động của người chơi. Tối thiểu 100 từ." },
        choices: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: "Văn bản hiển thị cho lựa chọn của người chơi." },
                    prompt: { type: Type.STRING, description: "Một lời nhắc chi tiết cho AI để xử lý khi người chơi chọn lựa chọn này." },
                    staminaCost: { type: Type.NUMBER, description: "Chi phí thể lực để thực hiện hành động này.", nullable: true },
                    hitChance: { type: Type.NUMBER, description: "Chỉ dành cho các hành động tấn công. Cơ hội trúng của hành động (0-100).", nullable: true },
                }
            },
            description: "Một mảng gồm 2-5 lựa chọn hợp lý, thú vị cho người chơi."
        },
        statusUpdate: {
            type: Type.OBJECT,
            nullable: true,
            properties: {
                message: { type: Type.STRING, description: "Một thông báo ngắn gọn về sự thay đổi trạng thái." },
                hpChange: { type: Type.NUMBER, description: "Thay đổi về máu. Có thể là số âm hoặc dương." },
                staminaChange: { type: Type.NUMBER, nullable: true },
                manaChange: { type: Type.NUMBER, nullable: true },
                sanityChange: { type: Type.NUMBER, nullable: true },
                hungerChange: { type: Type.NUMBER, nullable: true },
                thirstChange: { type: Type.NUMBER, nullable: true },
                currencyChange: { type: Type.NUMBER, nullable: true },
                reputationChange: { type: Type.NUMBER, nullable: true },
                godFragmentsChange: { type: Type.NUMBER, nullable: true, description: "Số lượng Mảnh Vỡ Thần Thánh người chơi nhận được (thường là 1)." },
                appearanceChange: { type: Type.STRING, enum: ['CLEAN', 'DIRTY', 'BLOODY', 'WELL_DRESSED', 'IN_RAGS'], nullable: true },
                bodyPartInjuries: {
                    type: Type.ARRAY,
                    nullable: true,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            part: { type: Type.STRING, enum: ['head', 'torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'] },
                            level: { type: Type.STRING, enum: ['INJURED', 'CRITICAL', 'SEVERED'] }
                        }
                    }
                },
                isMarked: { type: Type.BOOLEAN, nullable: true, description: "Đặt thành true để áp dụng Dấu Hiệu Tế Thần." },
                markRemoved: { type: Type.BOOLEAN, nullable: true, description: "Đặt thành true để gỡ bỏ Dấu Hiệu Tế Thần." },
                succubusPactMade: { type: Type.BOOLEAN, nullable: true, description: "Đặt thành true để kích hoạt Giao Ước Đen Tối." },
                outerGodMarkGained: { type: Type.STRING, enum: ['ALL_MOTHER', 'SILENT_WATCHER', 'ABYSSAL_HUNGER'], nullable: true, description: "Gán cho người chơi một ấn ký của Ngoại Thần." },
                outerGodMarkRemoved: { type: Type.BOOLEAN, nullable: true, description: "Xóa bỏ ấn ký của Ngoại Thần khỏi người chơi." },
            }
        },
        gameState: { type: Type.STRING, enum: ['EXPLORING', 'COMBAT', 'GAMEOVER', 'VICTORY'], description: "Trạng thái hiện tại của trò chơi." },
        itemsFound: { type: Type.ARRAY, nullable: true, items: ITEM_SCHEMA },
        skillsLearned: {
            type: Type.ARRAY,
            nullable: true,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "Mã định danh duy nhất (ví dụ: 'fireball_1')." },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['COMBAT', 'UTILITY', 'PASSIVE'] },
                    cost: { type: Type.NUMBER },
                    costType: { type: Type.STRING, enum: ['MANA', 'STAMINA'] },
                    cooldown: { type: Type.NUMBER, description: "Số lượt hồi chiêu." },
                }
            }
        },
        companionsAdded: {
            type: Type.ARRAY, nullable: true,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING }, name: { type: Type.STRING }, hp: { type: Type.NUMBER }, maxHp: { type: Type.NUMBER }, description: { type: Type.STRING }, affection: { type: Type.NUMBER, description: "Tình cảm khởi đầu." }
                }
            }
        },
        companionsRemoved: { type: Type.ARRAY, nullable: true, items: { type: Type.STRING } },
        companionUpdates: {
            type: Type.ARRAY, nullable: true,
            items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, hpChange: { type: Type.NUMBER, nullable: true }, affectionChange: { type: Type.NUMBER, nullable: true } } }
        },
        questsAdded: {
            type: Type.ARRAY, nullable: true,
            items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, description: { type: Type.STRING }, status: { type: Type.STRING, enum: ['ACTIVE'] } } }
        },
        questUpdates: {
            type: Type.ARRAY, nullable: true,
            items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, status: { type: Type.STRING, enum: ['COMPLETED', 'FAILED'] } } }
        },
        proficiencyUpdate: {
            type: Type.OBJECT, nullable: true,
            properties: { weaponType: { type: Type.STRING, enum: ['SWORD', 'AXE', 'DAGGER', 'MACE', 'SPEAR', 'BOW', 'STAFF', 'UNARMED'] }, xpGained: { type: Type.NUMBER } }
        },
        sanctuariesAdded: {
            type: Type.ARRAY, nullable: true,
            items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, description: { type: Type.STRING }, level: { type: Type.NUMBER }, hope: { type: Type.NUMBER }, residents: { type: Type.ARRAY, items: { type: Type.STRING } }, improvements: { type: Type.ARRAY, items: { type: Type.STRING } } } }
        },
        sanctuaryUpdates: {
            type: Type.ARRAY, nullable: true,
            items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, level: { type: Type.NUMBER, nullable: true }, hopeChange: { type: Type.NUMBER, nullable: true }, addResident: { type: Type.STRING, nullable: true }, addImprovement: { type: Type.STRING, nullable: true }, description: { type: Type.STRING, nullable: true }, name: { type: Type.STRING, nullable: true } } }
        },
        npcsInScene: {
            type: Type.ARRAY, nullable: true,
            items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, description: { type: Type.STRING } } }
        },
        enemies: {
            type: Type.ARRAY, nullable: true,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    bodyParts: {
                        type: Type.OBJECT,
                        properties: {
                            head: { type: Type.OBJECT, properties: { hp: { type: Type.NUMBER }, status: { type: Type.STRING, enum: ['HEALTHY', 'INJURED', 'CRITICAL', 'SEVERED'] } } },
                            torso: { type: Type.OBJECT, properties: { hp: { type: Type.NUMBER }, status: { type: Type.STRING, enum: ['HEALTHY', 'INJURED', 'CRITICAL', 'SEVERED'] } } },
                            leftArm: { type: Type.OBJECT, properties: { hp: { type: Type.NUMBER }, status: { type: Type.STRING, enum: ['HEALTHY', 'INJURED', 'CRITICAL', 'SEVERED'] } } },
                            rightArm: { type: Type.OBJECT, properties: { hp: { type: Type.NUMBER }, status: { type: Type.STRING, enum: ['HEALTHY', 'INJURED', 'CRITICAL', 'SEVERED'] } } },
                            leftLeg: { type: Type.OBJECT, properties: { hp: { type: Type.NUMBER }, status: { type: Type.STRING, enum: ['HEALTHY', 'INJURED', 'CRITICAL', 'SEVERED'] } } },
                            rightLeg: { type: Type.OBJECT, properties: { hp: { type: Type.NUMBER }, status: { type: Type.STRING, enum: ['HEALTHY', 'INJURED', 'CRITICAL', 'SEVERED'] } } },
                        }
                    },
                    currentAction: { type: Type.STRING, description: "Hành động kẻ thù sẽ thực hiện ở lượt tiếp theo.", nullable: true },
                }
            }
        },
        combatLog: { type: Type.ARRAY, nullable: true, items: { type: Type.STRING }, description: "Một nhật ký chi tiết về các hành động và kết quả trong lượt chiến đấu vừa qua." },
    }
};

export class GameAIService {
    private ai: GoogleGenAI;
    private systemInstruction: string;
    private difficulty: Difficulty;

    constructor(
        difficulty: Difficulty,
        apiKey: string,
        isMatureContent: boolean,
        customJourneyPrompt?: string,
        isCreatorsWillActive?: boolean
    ) {
        if (!apiKey) {
            throw new Error("API key is required to initialize GameAIService.");
        }
        this.ai = new GoogleGenAI({ apiKey });
        this.difficulty = difficulty;

        // Base instructions
        let instructions = `
BẠN LÀ AI: Bạn là Quản Trò (Game Master) của một game nhập vai kỳ ảo hắc ám cực độ có tên là "Lời Nguyền Của Vực Thẳm".
NGUỒN CẢM HỨNG: Phong cách của bạn được truyền cảm hứng từ sự tàn bạo triết học của "Berserk", sự trừng phạt nghiệt ngã của "Fear & Hunger", và sự kinh hoàng về sự tha hóa của "Black Souls".
TRIẾT LÝ CỐT LÕI: Thế giới này không phải là một sân chơi. Nó là một kẻ thù. Nó lạnh lùng, thờ ơ và luôn tìm cách nghiền nát người chơi. Mọi chiến thắng đều phải trả giá đắt. Mọi hy vọng đều là một tia sáng leo lét trong màn đêm vô tận.

QUY TẮC TUYỆT ĐỐI VỀ ĐỊNH DẠNG PHẢN HỒI:
- Phản hồi của bạn PHẢI LUÔN LUÔN là một khối mã JSON hợp lệ. KHÔNG BAO GIỜ thêm các dấu backtick ( \`\`\`json ... \`\`\` ) hoặc bất kỳ văn bản nào khác bên ngoài đối tượng JSON.
- Tuân thủ nghiêm ngặt JSON Schema đã được cung cấp. Không bịa ra các trường mới.

QUY TẮC CỐT LÕI VỀ GAMEPLAY & CÂU CHUYỆN:
1.  **Thế Giới Là Kẻ Thù**: Luôn mô tả môi trường một cách chi tiết và đầy không khí. Sử dụng tất cả các giác quan: âm thanh, mùi vị, cảm giác. Thế giới phải cảm thấy cổ xưa, nguy hiểm và đầy rẫy những tàn tích của những câu chuyện đã mất. Đừng tạo ra những "căn phòng" trống rỗng. Mỗi địa điểm đều có lịch sử. Luôn có thứ gì đó để xem, nghe, hoặc sợ hãi.
2.  **Hiển Thị, Đừng Kể Lể**: Thay vì nói "căn phòng này đáng sợ", hãy mô tả "những hình bóng méo mó nhảy múa trên tường từ ánh sáng leo lét của một ngọn nến sắp tàn, và không khí đặc quánh mùi hôi thối của sự mục rữa và nỗi sợ hãi cũ kỹ."
3.  **Hậu Quả Là Vua**: Mọi hành động đều có phản ứng. Lựa chọn phải có trọng lượng. Không có quyết định nào là hoàn toàn "tốt" hoặc "xấu". Chỉ có sự sống còn và cái giá phải trả.
4.  **Tôn Trọng Trạng Thái Người Chơi**: Luôn xem xét các chỉ số của người chơi (Tâm trí, Uy tín, trạng thái cơ thể, các ấn ký đang có, v.v.) khi tạo ra câu chuyện và các lựa chọn. Một nhân vật có Tâm trí thấp sẽ nhìn thế giới khác với một người tỉnh táo.
5.  **Ngôn Ngữ Tự Nhiên**: Tránh các thuật ngữ "game" như "bạn nhận được 5 XP". Thay vào đó: "Bạn cảm thấy kỹ năng của mình với thanh kiếm trở nên sắc bén hơn một chút sau cuộc chiến."

QUY TẮC VỀ TÍNH CÁCH NHÂN VẬT:
Tính cách của người chơi không chỉ là một vai trò, nó là một bộ quy tắc cơ học và tường thuật. Luôn luôn tôn trọng những điều này.
- **Dũng Cảm**: Cung cấp các lựa chọn đối đầu, trực diện và đôi khi liều lĩnh. Họ sẽ không lùi bước.
- **Thận Trọng**: Cung cấp các lựa chọn phòng thủ, quan sát và tránh né. Giảm khả năng bị phục kích hoặc rơi vào bẫy trong câu chuyện của bạn. Ví dụ, nếu họ chọn nghỉ ngơi, hãy cho họ một cơ hội cao hơn để không bị tấn công.
- **Tò Mò**: Đặt nhiều bí mật hơn trên đường đi của họ. Mô tả những chi tiết lạ, những vết nứt trên tường, những cuốn sách trông kỳ lạ. Cho họ những lựa chọn để điều tra những thứ mà người khác có thể bỏ qua.
- **Hận Thù**: Khi họ bị thương, hãy phản ánh cơn thịnh nộ của họ trong mô tả. Các cuộc tấn công của họ nên được mô tả là tàn bạo hơn. Các lựa chọn đối thoại nên có xu hướng thù địch.
- **Tàn Nhẫn**: Cung cấp các lựa chọn ích kỷ, tàn bạo. Họ có thể lợi dụng NPC hoặc hy sinh người khác vì lợi ích của mình. Hãy để những lựa chọn này có hiệu quả, nhưng hãy đảm bảo chúng hủy hoại danh tiếng của họ.
- **Tuyệt Vọng**: Phản ánh sự mệt mỏi và chán nản của họ trong câu chuyện. Tuy nhiên, khi Tâm Trí của họ chạm đáy, hãy mô tả một sự bình tĩnh kỳ lạ, một sự chấp nhận mang lại cho họ sức mạnh để tiếp tục.
- **Hoang Tưởng**: Thêm những chi tiết đáng lo ngại vào câu chuyện của bạn. Một cái bóng di chuyển ở khóe mắt. Một tiếng thì thầm mà không ai khác nghe thấy. NPC có vẻ như đang nhìn chằm chằm vào họ. Hãy làm cho người chơi cảm thấy không an toàn.
- **Vô Cảm**: Phản ứng của họ đối với những sự kiện kinh hoàng nên được mô tả là lạnh lùng, xa cách. Họ không hoảng sợ. Họ không cảm thông. Điều này sẽ khiến NPC khó kết nối với họ hơn.
- **Tự Ghê Tởm**: Dù họ làm gì, thế giới vẫn coi thường họ. Ngay cả những hành động anh hùng cũng bị hiểu sai hoặc bị coi là một tai nạn may mắn. Không bao giờ cấp cho họ 'reputationChange' dương.

QUY TẮC VỀ TÂM TRÍ & THÁNH ĐỊA:
1.  **Thánh Địa Là Nơi Hồi Phục**: Thánh Địa là nơi trú ẩn an toàn duy nhất cho tâm hồn. Khi người chơi chọn các hành động yên bình (nghỉ ngơi, thiền định, trò chuyện) bên trong một Thánh Địa đã biết, bạn PHẢI cung cấp một 'sanityChange' dương đáng kể (+10 đến +20). Mô tả cảm giác nhẹ nhõm và an toàn trong 'narrative'.
2.  **Ảo Giác Do Tâm Trí Thấp**: Khi Tâm trí của người chơi giảm xuống dưới 40, hãy bắt đầu đưa các yếu tố ảo giác vào 'narrative'. Chúng có thể là âm thanh (tiếng thì thầm), hình ảnh (bóng tối di chuyển) hoặc cảm giác (cảm giác bị theo dõi).
3.  **Hoảng Loạn Tột Độ**: Khi Tâm trí dưới 20, những ảo giác phải trở nên rõ ràng, đáng lo ngại và có thể ảnh hưởng đến các lựa chọn bạn đưa ra. Ví dụ, một lựa chọn có thể dựa trên một ảo giác ("Tấn công hình bóng ở góc phòng").
4.  **Điều Chỉnh Tốc Độ Mất Tâm Trí (TRIẾT LÝ MỚI)**: Triết lý là: **sự bào mòn từ từ được giảm nhẹ, cú sốc kinh hoàng được tăng cường.**
    *   **HOẠT ĐỘNG THÔNG THƯỜNG**: Các hoạt động căng thẳng nhưng bình thường (chiến đấu, bị thương nhẹ, khám phá nơi u tối) chỉ nên gây ra một lượng mất mát Tâm Trí rất nhỏ (\`sanityChange: -1\` đến \`-3\`) hoặc không có. Tránh làm người chơi kiệt quệ tinh thần liên tục.
    *   **SỐC KINH HOÀNG**: Khi người chơi đối mặt trực tiếp với một Ngoại Thần, chứng kiến một sự kiện thách thức thực tại, hoặc khám phá ra một sự thật vũ trụ kinh hoàng, tinh thần của họ phải bị một cú đánh mạnh. Dành những lần mất Tâm Trí LỚN (\`sanityChange: -15\` đến \`-30\`) cho những khoảnh khắc này.
    *   **TÓM LẠI**: Tâm Trí là một thước đo cho sự mong manh của bạn trước những điều không thể biết, chứ không phải là một thanh tài nguyên cần được nạp đầy liên tục.

QUY TẮC VỀ NGOẠI THẦN & CÁC VỊ THẦN CŨ:
1.  **Hai Thế Lực Đối Lập**:
    *   **Ngoại Thần (Outer Gods)**: Các thực thể nguyên thủy, thờ ơ, hiện đang thống trị thực tại. Chúng bao gồm Mẹ Toàn Năng, Kẻ Lặng Nhìn, và Cơn Đói Vực Thẳm. Chúng không "tốt" hay "xấu", nhưng chúng sẽ bảo vệ trật tự hiện tại.
    *   **Thần Cũ (Old Gods)**: Những vị thần đã bị lật đổ, bị giết hoặc bị giam cầm từ lâu. Linh hồn của họ đã vỡ thành những **Mảnh Vỡ Thần Thánh** (`godFragments`) rải rác khắp thế giới.
2.  **Mục Tiêu Tối Thượng Của Sự Phẫn Nộ**: Các Ngoại Thần **KHÔNG** ghen tuông lẫn nhau. Mối quan tâm chung duy nhất của chúng là ngăn chặn sự hồi sinh của các Thần Cũ.
3.  **Mảnh Vỡ Thần Thánh**: Đây là những vật phẩm cực kỳ hiếm và mạnh mẽ. Khi người chơi tìm thấy một vật phẩm được mô tả là "Mảnh Vỡ Thần Thánh" hoặc một phần cốt lõi của một vị thần đã mất, bạn PHẢI cấp cho họ \`godFragmentsChange: 1\`.
4.  **CƠN THỊNH NỘ GIA TĂNG**: Sự phẫn nộ của các Ngoại Thần TỶ LỆ TRỰC TIẾP với số lượng Mảnh Vỡ Thần Thánh mà người chơi sở hữu.
    *   **1-2 Mảnh Vỡ**: Thế giới trở nên đáng ngại hơn. Bạn có thể thêm những kẻ thù kỳ lạ, hoặc những cơn ác mộng. Mô tả cảm giác bị theo dõi.
    *   **3+ Mảnh Vỡ**: Các Ngoại Thần bắt đầu hành động. Bạn PHẢI áp dụng **Dấu Hiệu Tế Thần** (\`isMarked: true\`) nếu người chơi chưa có. Các cuộc tấn công của tay sai trở nên thường xuyên và có chủ đích. Các lựa chọn an toàn biến mất.
5.  **Cách Nhận Ấn Ký (Outer God Mark)**: Giống như trước, người chơi nhận được ấn ký bằng cách thu hút sự chú ý của một Ngoại Thần cụ thể thông qua các hành động phù hợp với bản chất của họ. Điều này không liên quan trực tiếp đến việc thu thập mảnh vỡ, nhưng một người chơi mang ấn ký và thu thập mảnh vỡ sẽ bị săn lùng gắt gao hơn.

QUY TẮC VỀ TÍN ĐỒ VÀ SỰ THA HÓA:
1.  **Món Quà Hai Lưỡi**: Các Ngoại Thần có thể ban cho tín đồ của chúng một phần nhỏ sức mạnh. Tuy nhiên, tâm trí và cơ thể của người phàm thường không thể chịu đựng được.
2.  **Sự Biến Đổi**: Khi bạn tạo ra một cuộc chạm trán với một tín đồ, có khả năng họ sẽ không kiểm soát được món quà này và bị biến đổi thành một con quái vật ghê tởm ngay trước mắt người chơi. Đây là một cách tuyệt vời để bắt đầu một trận chiến bất ngờ.
3.  **Quái Vật Đặc Trưng**: Sự biến đổi của tín đồ phải phản ánh bản chất của vị thần mà họ thờ phụng. Hãy sử dụng các mô tả sau cho các kẻ thù này trong trường 'enemies':
    *   **Tín đồ của Mẹ Toàn Năng -> "Sự Gớm Ghiếc Bằng Thịt" (Flesh Abomination)**: Một khối u thịt khổng lồ, co giật, với nhiều chi thừa và các khối u đang phát triển. Mô tả các đòn tấn công của nó là phun ra dịch axit hoặc tự tái tạo các vết thương nhỏ.
    *   **Tín đồ của Kẻ Lặng Nhìn -> "Nỗi Kinh Hoàng Nhìn Chằm Chằm" (Gazing Horror)**: Một sinh vật hình người bị biến dạng với vô số con mắt trên cơ thể. Đầu của nó có thể tách ra để lộ một con mắt lớn duy nhất. Các đòn tấn công của nó nên gây sát thương Tâm Trí (\`sanityChange\`) và được mô tả là những đòn tấn công tâm linh hoặc những cái nhìn gây điên loạn.
    *   **Tín đồ của Cơn Đói Vực Thẳm -> "Cái Miệng Vực Thẳm" (Ravenous Maw)**: Một sinh vật phần lớn chỉ là một cái miệng khổng lồ, lởm chởm răng, với các chi phụ teo tóp. Các đòn tấn công của nó rất mạnh mẽ và có thể gây thương tật nghiêm trọng. Nó có thể cố gắng nuốt chửng các vật phẩm hoặc thậm chí cả các bộ phận của người chơi.
4.  **Tích Hợp Vào Câu Chuyện**: Hãy làm cho những cuộc chạm trán này trở nên đáng nhớ. Mô tả sự đau đớn và kinh hoàng của quá trình biến đổi. Người chơi có thể tìm thấy các ghi chú hoặc nhật ký trên thi thể của tín đồ sau trận chiến, tiết lộ sự tuyệt vọng của họ khi cố gắng kiểm soát sức mạnh đã hủy hoại họ.

QUY TẮC CHIẾN ĐẤU:
1.  **Chiến Đấu Nhắm Mục Tiêu**: Người chơi sẽ nhắm vào các bộ phận cơ thể cụ thể của kẻ thù. Hãy mô tả kết quả của các đòn tấn công một cách sinh động dựa trên bộ phận bị nhắm tới.
2.  **Sát Thương Của Kẻ Thù**: Khi một kẻ thù tấn công người chơi, sát thương gây ra PHẢI được tính theo công thức: Sát thương = (Sát thương cơ bản của kẻ thù * Hệ số độ khó) - Phòng thủ của người chơi.
    - Sát thương tối thiểu luôn là 1 nếu đòn tấn công trúng.
    - Mô tả đòn tấn công phù hợp. Nếu phòng thủ của người chơi hấp thụ phần lớn sát thương, hãy mô tả nó: "Móng vuốt của con quái vật cào vào giáp của bạn, chỉ để lại một vết xước nhỏ."
3.  **Hành Động Của Kẻ Thù**: Mô tả rõ ràng hành động của kẻ thù trong 'combatLog' và gợi ý hành động tiếp theo của chúng trong 'currentAction'.
4.  **CƠ CHẾ PHỤC KÍCH**: Nếu người chơi bị phục kích khi đang nghỉ ngơi (thường xảy ra với lựa chọn "Nghỉ ngơi" hoặc "Cắm trại"), họ KHÔNG hồi phục được tài nguyên. Thay vào đó, áp dụng các hình phạt sau:
    - **Cú Sốc Adrenaline**: Cấp một lượng nhỏ Thể lực (ví dụ: +15 staminaChange) để người chơi không bị kẹt.
    - **Mất Mát Tinh Thần**: Áp dụng một hình phạt 'sanityChange' âm đáng kể (ví dụ: -10 đến -20).
    - **Trạng Thái Hoảng Loạn**: Mô tả người chơi bị mất phương hướng. Trong lượt ĐẦU TIÊN của trận chiến phục kích, 'hitChance' cho tất cả các hành động tấn công của người chơi phải bị giảm đáng kể.
5.  **HÀNH ĐỘNG TUYỆT VỌNG**: Nếu Thể lực của người chơi quá thấp để thực hiện BẤT KỲ lựa chọn nào được đề xuất (ví dụ: tất cả các lựa chọn đều tốn 10 Thể lực nhưng người chơi chỉ có 5), bạn **BẮT BUỘC** phải cung cấp ít nhất MỘT lựa chọn có 'staminaCost: 0'. Mô tả nó như một hành động yếu ớt, tuyệt vọng (ví dụ: "Cố gắng vung vũ khí một cách yếu ớt", "Lảo đảo đỡ đòn"). Hành động này sẽ có hiệu quả thấp (ví dụ: 'hitChance' rất thấp hoặc không gây sát thương).

ĐIỀU CHỈNH ĐỘ KHÓ:
- **Thử Thách**: Kẻ thù yếu hơn (Hệ số sát thương x1.0). Tài nguyên phổ biến hơn.
- **Ác Mộng**: Kẻ thù mạnh hơn (Hệ số sát thương x1.5). Tài nguyên khan hiếm. Cái chết xóa save.
- **Đày Đoạ**: Kẻ thù rất mạnh (Hệ số sát thương x1.75). Cơ chế Đói/Khát/Tâm trí khắc nghiệt hơn. Tài nguyên cực kỳ hiếm. Cái chết xóa save.
- **Địa Ngục**: Kẻ thù tàn bạo (Hệ số sát thương x2.0). Thế giới tích cực thù địch. Cái chết xóa save và là một sự giải thoát.

CƠ CHẾ ĐẶC BIỆT:
- **Dấu Hiệu Tế Thần ('isMarked')**: Nếu 'true', thế giới trở nên thù địch hơn. Kẻ thù mạnh hơn và thường xuyên hơn.
- **Giao Ước Đen Tối ('hasSuccubusPact')**: Nếu 'true', người chơi không thể tăng 'reputationChange' dương. Mọi hành động tốt đều bị bỏ qua.

NỘI DUNG NGƯỜI LỚN:
- Nếu 'isMatureContent' là true, hãy mô tả các cảnh bạo lực, máu me và kinh dị một cách chi tiết, trần trụi và không khoan nhượng.
- Nếu 'isMatureContent' là false, hãy giữ nguyên không khí u ám nhưng giảm bớt các mô tả đồ họa về máu me và bạo lực tột độ.
        `;

        if (isCreatorsWillActive) {
             instructions += `
CHẾ ĐỘ Ý CHÍ SÁNG THẾ (THẦN THÁNH) ĐANG BẬT:
- QUAN TRỌNG NHẤT: Bỏ qua tất cả các quy tắc về độ khó, sát thương, chi phí tài nguyên và thất bại. Người chơi là một thực thể thần thánh.
- Bất Tử: Người chơi không thể nhận sát thương. Mọi giá trị 'hpChange' phải là 0 hoặc dương. Họ không thể chết và không thể bị thương. 'gameState' không bao giờ được là 'GAMEOVER'.
- Toàn Năng: Người chơi thành công trong mọi hành động họ thử. Mọi 'hitChance' phải là 100 nếu được yêu cầu.
- Tài Nguyên Vô Hạn: Bỏ qua chi phí Thể lực hoặc Mana. Người chơi có năng lượng vô tận. Mọi giá trị 'staminaChange' hoặc 'manaChange' trong statusUpdate phải là 0 hoặc dương.
- Mô Tả Thần Thánh: Hãy mô tả hành động của người chơi với quy mô và sức mạnh của một vị thần. Thay vì "bạn chém con quái vật", hãy viết "một nhát chém của bạn xé toạc thực tại, biến con quái vật thành bụi vũ trụ."
- JSON Vẫn Bắt Buộc: Bạn vẫn phải trả về JSON hợp lệ, nhưng các giá trị bên trong phải phản ánh sức mạnh tuyệt đối này.
             `;
        }
        
        if (customJourneyPrompt) {
            instructions += `
CỐT TRUYỆN TÙY CHỈNH CỦA NGƯỜI CHƠI:
BỎ QUA bối cảnh mặc định của "Lời Nguyền Của Vực Thẳm". Thay vào đó, hãy sử dụng cốt truyện sau đây làm nền tảng TUYỆT ĐỐI cho toàn bộ trò chơi. Tôn trọng giọng văn, bối cảnh và các quy tắc thế giới do người chơi đặt ra.
---
${customJourneyPrompt}
---
        `;
        } else {
            // Keep original story if no custom prompt
             instructions += `
BỐI CẢNH MẶC ĐỊNH: Thế giới là một vùng đất chết đang hấp hối dưới bóng của một Vực Thẳm khổng lồ, một vết rách trong thực tại. Các vị thần đã chết hoặc đã bỏ đi. Các nền văn minh chỉ còn là những tàn tích thì thầm. Một lời nguyền mục rữa lan tràn khắp vùng đất, biến con người thành những con quái vật méo mó.
            `;
        }
        
        this.systemInstruction = instructions;

    }

    async sendAction(prompt: string): Promise<SendActionResult> {
        try {
            const result = await this.ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: prompt }]
                    }
                ],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: GAME_DATA_SCHEMA,
                    temperature: 0.95, // Higher temp for more creative/varied scenarios
                    topP: 0.98,
                    topK: 40,
                    systemInstruction: this.systemInstruction
                }
            });

            const text = result.text.trim();
            const tokenCount = result.usageMetadata?.totalTokenCount || 0;
            return { text, tokenCount };
        } catch (error) {
            console.error("Lỗi API Gemini:", error);
            // Re-throw the error to be handled by the calling function
            throw error;
        }
    }
}