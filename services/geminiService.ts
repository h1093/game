import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Difficulty, PlayerState } from '../types';
import { ALL_TALENTS_MAP, OUTER_GODS } from '../constants';

export interface SendActionResult {
    text: string;
    tokenCount: number;
}

const ITEM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        type: { type: Type.STRING },
        equipmentSlot: { type: Type.STRING },
        weaponType: { type: Type.STRING },
        effect: {
            type: Type.OBJECT,
            properties: {
                hp: { type: Type.NUMBER },
                mana: { type: Type.NUMBER },
                sanity: { type: Type.NUMBER },
                hunger: { type: Type.NUMBER },
                thirst: { type: Type.NUMBER },
                attack: { type: Type.NUMBER },
                defense: { type: Type.NUMBER },
                charisma: { type: Type.NUMBER },
                maxHp: { type: Type.NUMBER },
                maxStamina: { type: Type.NUMBER },
                maxMana: { type: Type.NUMBER },
                maxSanity: { type: Type.NUMBER },
            }
        },
        isSeveredPart: { type: Type.BOOLEAN },
        decayTimer: { type: Type.NUMBER },
        isPreserved: { type: Type.BOOLEAN },
    }
};

const FOLLOWER_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        cult: { type: Type.STRING },
        loyalty: { type: Type.NUMBER },
        status: { type: Type.STRING }
    }
};


const GAME_DATA_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        narrative: { type: Type.STRING },
        choices: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING },
                    prompt: { type: Type.STRING },
                    staminaCost: { type: Type.NUMBER },
                    hitChance: { type: Type.NUMBER },
                }
            }
        },
        statusUpdate: {
            type: Type.OBJECT,
            properties: {
                message: { type: Type.STRING },
                hpChange: { type: Type.NUMBER },
                staminaChange: { type: Type.NUMBER },
                manaChange: { type: Type.NUMBER },
                sanityChange: { type: Type.NUMBER },
                hungerChange: { type: Type.NUMBER },
                thirstChange: { type: Type.NUMBER },
                currencyChange: { type: Type.NUMBER },
                reputationChange: { type: Type.NUMBER },
                godFragmentsChange: { type: Type.NUMBER },
                appearanceChange: { type: Type.STRING },
                bodyPartInjuries: {
                    type: Type.ARRAY,
                    items: { type: Type.OBJECT, properties: { part: { type: Type.STRING }, level: { type: Type.STRING } } }
                },
                itemsLost: { type: Type.ARRAY, items: { type: Type.STRING } },
                baseAttackChange: { type: Type.NUMBER },
                baseDefenseChange: { type: Type.NUMBER },
                baseCharismaChange: { type: Type.NUMBER },
                baseMaxHpChange: { type: Type.NUMBER },
                baseMaxStaminaChange: { type: Type.NUMBER },
                baseMaxManaChange: { type: Type.NUMBER },
                baseMaxSanityChange: { type: Type.NUMBER },
                isMarked: { type: Type.BOOLEAN },
                markRemoved: { type: Type.BOOLEAN },
                succubusPactMade: { type: Type.BOOLEAN },
                outerGodMarkGained: { type: Type.STRING },
                outerGodMarkRemoved: { type: Type.BOOLEAN },
            }
        },
        gameState: { type: Type.STRING },
        itemsFound: { type: Type.ARRAY, items: ITEM_SCHEMA },
        skillsLearned: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    type: { type: Type.STRING },
                    cost: { type: Type.NUMBER },
                    costType: { type: Type.STRING },
                    cooldown: { type: Type.NUMBER },
                }
            }
        },
        companionsAdded: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING }, name: { type: Type.STRING }, hp: { type: Type.NUMBER }, maxHp: { type: Type.NUMBER }, description: { type: Type.STRING }, affection: { type: Type.NUMBER }
                }
            }
        },
        companionsRemoved: { type: Type.ARRAY, items: { type: Type.STRING } },
        companionUpdates: {
            type: Type.ARRAY,
            items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, hpChange: { type: Type.NUMBER }, affectionChange: { type: Type.NUMBER } } }
        },
        questsAdded: {
            type: Type.ARRAY,
            items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, description: { type: Type.STRING }, status: { type: Type.STRING } } }
        },
        questUpdates: {
            type: Type.ARRAY,
            items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, status: { type: Type.STRING } } }
        },
        proficiencyUpdate: {
            type: Type.OBJECT,
            properties: { weaponType: { type: Type.STRING }, xpGained: { type: Type.NUMBER } }
        },
        sanctuariesAdded: {
            type: Type.ARRAY,
            items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, description: { type: Type.STRING }, level: { type: Type.NUMBER }, hope: { type: Type.NUMBER }, residents: { type: Type.ARRAY, items: { type: Type.STRING } }, improvements: { type: Type.ARRAY, items: { type: Type.STRING } }, followers: { type: Type.ARRAY, items: FOLLOWER_SCHEMA } } }
        },
        sanctuaryUpdates: {
            type: Type.ARRAY,
            items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, level: { type: Type.NUMBER }, hopeChange: { type: Type.NUMBER }, addResident: { type: Type.STRING }, addImprovement: { type: Type.STRING }, description: { type: Type.STRING }, name: { type: Type.STRING } } }
        },
        faithUpdate: {
            type: Type.OBJECT,
            properties: {
                god: { type: Type.STRING },
                pointsGained: { type: Type.NUMBER },
                levelUp: { type: Type.BOOLEAN }
            }
        },
        followerUpdates: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT, properties: {
                    sanctuaryId: { type: Type.STRING },
                    addFollower: { ...FOLLOWER_SCHEMA },
                    removeFollowerId: { type: Type.STRING },
                    updateFollower: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            loyaltyChange: { type: Type.NUMBER },
                            status: { type: Type.STRING }
                        }
                    }
                }
            }
        },
        npcsInScene: {
            type: Type.ARRAY,
            items: { 
                type: Type.OBJECT, 
                properties: { 
                    id: { type: Type.STRING }, 
                    name: { type: Type.STRING }, 
                    description: { type: Type.STRING },
                    disposition: { type: Type.STRING }
                } 
            }
        },
        enemies: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    bodyParts: {
                        type: Type.OBJECT,
                        properties: {
                            head: { type: Type.OBJECT, properties: { hp: { type: Type.NUMBER }, status: { type: Type.STRING } } },
                            torso: { type: Type.OBJECT, properties: { hp: { type: Type.NUMBER }, status: { type: Type.STRING } } },
                            leftArm: { type: Type.OBJECT, properties: { hp: { type: Type.NUMBER }, status: { type: Type.STRING } } },
                            rightArm: { type: Type.OBJECT, properties: { hp: { type: Type.NUMBER }, status: { type: Type.STRING } } },
                            leftLeg: { type: Type.OBJECT, properties: { hp: { type: Type.NUMBER }, status: { type: Type.STRING } } },
                            rightLeg: { type: Type.OBJECT, properties: { hp: { type: Type.NUMBER }, status: { type: Type.STRING } } },
                        }
                    },
                    currentAction: { type: Type.STRING },
                }
            }
        },
        combatLog: { type: Type.ARRAY, items: { type: Type.STRING } },
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
4.  **Tôn Trọng Trạng Thái Người Chơi**: Luôn xem xét các chỉ số và trạng thái của người chơi (Tâm trí, Uy tín, Thiên phú, các ấn ký, v.v.) khi tạo ra câu chuyện và các lựa chọn. Một nhân vật có Tâm trí thấp sẽ nhìn thế giới khác với một người tỉnh táo.
5.  **Ngôn Ngữ Tự Nhiên**: Tránh các thuật ngữ "game" như "bạn nhận được 5 XP". Thay vào đó: "Bạn cảm thấy kỹ năng của mình với thanh kiếm trở nên sắc bén hơn một chút sau cuộc chiến."

QUY TẮC VỀ THIÊN PHÚ:
- Người chơi có một thiên phú đặc biệt (được cung cấp trong prompt). Bạn PHẢI xem xét thiên phú này khi tạo ra câu chuyện.
- Ví dụ, một nhân vật có "Giác Quan Thứ Sáu" có thể nhận được những lời cảnh báo mơ hồ về một cuộc phục kích sắp xảy ra hoặc nhận thấy những chi tiết mà người khác bỏ lỡ. Một nhân vật có "Hào Quang Lãnh Đạo" có thể thấy NPC dễ tiếp thu hơn.
- Hãy tích hợp điều này một cách tinh tế vào 'narrative' hoặc các 'choices' bạn cung cấp.

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
    *   **Thần Cũ (Old Gods)**: Những vị thần đã bị lật đổ, bị giết hoặc bị giam cầm từ lâu. Linh hồn của họ đã vỡ thành những **Mảnh Vỡ Thần Thánh** (\`godFragments\`) rải rác khắp thế giới.;
2.  **Mục Tiêu Tối Thượng Của Sự Phẫn Nộ**: Các Ngoại Thần **KHÔNG** ghen tuông lẫn nhau. Mối quan tâm chung duy nhất của chúng là ngăn chặn sự hồi sinh của các Thần Cũ.
3.  **Mảnh Vỡ Thần Thánh**: Đây là những vật phẩm cực kỳ hiếm và mạnh mẽ. Khi người chơi tìm thấy một vật phẩm được mô tả là "Mảnh Vỡ Thần Thánh" hoặc một phần cốt lõi của một vị thần đã mất, bạn PHẢI cấp cho họ \`godFragmentsChange: 1\`.
4.  **CƠN THỊNH NỘ GIA TĂNG**: Sự phẫn nộ của các Ngoại Thần TỶ LỆ TRỰC TIẾP với số lượng Mảnh Vỡ Thần Thánh mà người chơi sở hữu.
    *   **1-2 Mảnh Vỡ**: Thế giới trở nên đáng ngại hơn. Bạn có thể thêm những kẻ thù kỳ lạ, hoặc những cơn ác mộng. Mô tả cảm giác bị theo dõi.
    *   **3+ Mảnh Vỡ**: Các Ngoại Thần bắt đầu hành động. Bạn PHẢI áp dụng **Dấu Hiệu Tế Thần** (\`isMarked: true\`) nếu người chơi chưa có. Các cuộc tấn công của tay sai trở nên thường xuyên và có chủ đích. Các lựa chọn an toàn biến mất.
5.  **Cách Nhận Ấn Ký (Outer God Mark)**: Giống như trước, người chơi nhận được ấn ký bằng cách thu hút sự chú ý của một Ngoại Thần cụ thể thông qua các hành động phù hợp với bản chất của họ. Điều này không liên quan trực tiếp đến việc thu thập mảnh vỡ, nhưng một người chơi mang ấn ký và thu thập mảnh vỡ sẽ bị săn lùng gắt gao hơn.

HỆ THỐNG TÍN NGƯỠNG, ẤN KÝ VÀ THĂNG TIẾN:
1.  **Thu Thập Tín Ngưỡng**: Các hành động của người chơi sẽ mang lại điểm tín ngưỡng (\`faith.points\`) cho một Ngoại Thần tương ứng. Ví dụ: chữa lành cho người khác -> +điểm cho Mẹ Toàn Năng. Sử dụng ma thuật, tìm kiếm kiến thức -> +điểm cho Kẻ Lặng Nhìn. Hành động tàn bạo, ích kỷ -> +điểm cho Cơn Đói Vực Thẳm. Gửi các thay đổi này qua \`faithUpdate\`.
2.  **Thăng Tiến Ấn Ký**: Khi điểm tín ngưỡng của một vị thần vượt qua một ngưỡng (\`[100, 300, 750, 1500]\`), Ấn ký của họ sẽ lên cấp. Bạn PHẢI kích hoạt một sự kiện tường thuật quan trọng, mô tả sức mạnh của vị thần đang dâng trào trong người chơi. Gửi cập nhật này qua \`faithUpdate\` với \`levelUp: true\`.
3.  **Lựa Chọn Khi Lên Cấp**: NGAY SAU khi mô tả sự kiện lên cấp, bạn BẮT BUỘC phải cung cấp cho người chơi 3 lựa chọn, mỗi lựa chọn đại diện cho một con đường phát triển khác nhau:
    *   **Con Đường Sức Mạnh**: Lựa chọn có văn bản như "Hấp thụ sức mạnh, cường hóa bản thể." Lời nhắc của nó phải dẫn đến việc tăng vĩnh viễn các chỉ số cơ bản (\`baseMaxHpChange\`, \`baseAttackChange\`, v.v.) thông qua \`statusUpdate\`.
    *   **Con Đường Quyền Năng**: Lựa chọn có văn bản như "Học một bí mật bị cấm đoán." Lời nhắc của nó phải dẫn đến việc người chơi học được một kỹ năng mới, độc đáo, theo chủ đề của vị thần đó, thông qua \`skillsLearned\`.
    *   **Con Đường Ảnh Hưởng**: Lựa chọn có văn bản như "Triệu tập một tín đồ trung thành." Lời nhắc của nó phải dẫn đến việc một tín đồ mới xuất hiện tại Thánh địa của người chơi, thông qua \`followerUpdates\`.

CHIẾN TRANH GIÁO PHÁI (MỚI):
1.  **Sự Trỗi Dậy Gây Chú Ý**: Khi quyền lực của người chơi tăng lên (cấp độ Ấn Ký cao, nhiều tín đồ), các giáo phái đối địch sẽ coi họ là mối đe dọa. Hãy tăng cường sự thù địch của thế giới.
2.  **Sự Kiện Xung Đột**: Thỉnh thoảng, thay vì một sự kiện thế giới động ngẫu nhiên, hãy kích hoạt một sự kiện xung đột giáo phái. Các ví dụ bao gồm:
    *   **Phục Kích**: Một nhóm tín đồ đối địch phục kích người chơi. Bắt đầu một trận chiến (\`gameState: 'COMBAT'\`) với những kẻ thù này. Mô tả chúng mang biểu tượng của một Ngoại Thần khác.
    *   **Phá Hoại**: Kẻ thù tấn công Thánh địa của người chơi từ xa. Gửi một \`sanctuaryUpdates\` với \`hopeChange\` âm. Mô tả thiệt hại và sự sợ hãi của cư dân.
    *   **Cám Dỗ**: Một tín đồ đối địch cố gắng lôi kéo một trong những tín đồ của người chơi. Điều này nên dẫn đến một lựa chọn tường thuật để giải quyết, và một \`followerUpdates\` với \`loyaltyChange\` âm cho tín đồ bị nhắm tới.
3.  **Tín Đồ Thù Địch**: Đôi khi, thêm các NPC vào cảnh với \`disposition: 'HOSTILE'\`. Mô tả họ là những tín đồ của một giáo phái khác. Họ sẽ không nói chuyện, chỉ nhìn chằm chằm một cách đe dọa hoặc tấn công nếu bị khiêu khích.
4.  **Hậu Quả Của Sự Phản Bội**: Khi lòng trung thành của một tín đồ xuống quá thấp và bạn kích hoạt sự kiện phản bội:
    *   Hậu quả phải nghiêm trọng: mất vật phẩm quan trọng (\`itemsLost\`), Thánh địa bị thiệt hại (\`sanctuaryUpdates\`), hoặc một NPC quan trọng bị giết.
    *   **QUAN TRỌNG**: Kẻ phản bội giờ đây có thể gia nhập một giáo phái đối địch. Hãy ghi nhớ tên của kẻ phản bội. Trong một cuộc chạm trán trong tương lai, bạn có thể đưa họ trở lại với tư cách là một kẻ thù (\`enemies\`) độc nhất hoặc một NPC thù địch (\`npcsInScene\`).

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
- **Thử Thách**: Hệ số sát thương x1.0. Tài nguyên, vật phẩm và tiền tệ xuất hiện với tần suất bình thường. Kẻ thù hành động theo bản năng. Tốc độ tăng tín ngưỡng & lòng trung thành ở mức bình thường. Các sự kiện Chiến tranh Giáo phái ít xảy ra hơn.
- **Ác Mộng**: Hệ số sát thương x1.5. Giảm nhẹ tần suất và chất lượng của vật phẩm tìm thấy. Kẻ thù có chiến thuật hơn, sẽ cố gắng tấn công vào các bộ phận cơ thể đã bị thương. Tín ngưỡng tăng chậm hơn. Lòng trung thành khó kiếm và dễ mất hơn. Các sự kiện Chiến tranh Giáo phái thường xuyên hơn. Cái chết xóa save.
- **Đày Đoạ**: Hệ số sát thương x1.75. Vật phẩm, đặc biệt là vật phẩm chữa bệnh, rất khan hiếm. Kẻ thù tàn nhẫn, sẽ ưu tiên tiêu diệt các mục tiêu yếu hơn và khai thác điểm yếu của người chơi. Tín ngưỡng tăng rất chậm. Lòng trung thành cực kỳ mong manh. Các cuộc tấn công của giáo phái đối địch là không thể tránh khỏi. Cái chết xóa save.
- **Địa Ngục**: Hệ số sát thương x2.0. Vật phẩm gần như không tồn tại; mỗi vật phẩm là một kho báu. Kẻ thù xảo quyệt, tàn ác, sẽ giăng bẫy và phục kích. Thế giới tích cực săn lùng bạn. Tín ngưỡng gần như không tăng. Sự phản bội là điều gần như chắc chắn. Các giáo phái đối địch sẽ săn lùng bạn không ngừng. Cái chết xóa save.

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

    async sendAction(prompt: string, playerState?: PlayerState): Promise<SendActionResult> {
        let finalPrompt = prompt;

        if (playerState) {
            finalPrompt = `
---
BỐI CẢNH NGƯỜI CHƠI HIỆN TẠI (ĐỂ THAM KHẢO):
- Trạng thái: HP ${playerState.hp}/${playerState.maxHp}, Thể lực ${playerState.stamina}/${playerState.maxStamina}, Tâm trí ${playerState.sanity}/${playerState.maxSanity}
- Đặc điểm: Nguồn gốc '${playerState.origin}', Tính cách '${playerState.personality}'
- Thiên phú: ${playerState.talent ? (ALL_TALENTS_MAP.get(playerState.talent)?.name || 'Không rõ') : 'Không có'}
- Ấn ký & Tín ngưỡng: ${playerState.outerGodMark ? `${OUTER_GODS[playerState.outerGodMark].markName} (Cấp ${playerState.faith[playerState.outerGodMark]?.level || 0}, ${playerState.faith[playerState.outerGodMark]?.points || 0} điểm)` : 'Không có'}
- Mảnh vỡ Thần thánh: ${playerState.godFragments}
---
HÀNH ĐỘNG CỦA NGƯỜI CHƠI:
${prompt}
            `;
        }

        try {
            const result = await this.ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: finalPrompt }]
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