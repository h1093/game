
import React, { useState } from 'react';
import { GAME_TITLE } from '../constants';

// SVG Icons
const IconX = ({ size, ...props }: React.SVGProps<SVGSVGElement> & { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const IconKey = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
);

const IconFlame = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 4.5c.9-.9 2.1-.9 3 0s.9 2.1 0 3L13 12l-4-4 5.5-5.5z"/><path d="M14.5 4.5c-1-1-2.2-1.8-3.5-1.8-1.3 0-2.5.8-3.5 1.8-1 1-1.8 2.2-1.8 3.5 0 1.3.8 2.5 1.8 3.5l8 8c1 1 2.2 1.8 3.5 1.8 1.3 0 2.5-.8 3.5-1.8 1-1 1.8-2.2 1.8-3.5 0-1.3-.8-2.5-1.8-3.5l-8-8z"/></svg>
);

const IconSword = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21.5 3.5-3.5 21.5"/>
        <path d="m16 3-8 8 3 3 8-8-3-3"/>
        <path d="m13 6 3 3"/>
        <path d="M3 18l3 3"/>
    </svg>
);

const IconFeather = (props: React.SVGProps<SVGSVGElement>) => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><path d="M16 8L2 22"/><path d="M17.5 15H9"/></svg>
);

interface StartScreenProps {
    onStartGame: () => void;
    onStartCustomJourney: () => void;
    onLoadGame: () => void;
    saveFileExists: boolean;
    onOpenApiKeyManager: () => void;
    isMatureContent: boolean;
    onToggleMatureContent: () => void;
    onStartCombatTest: () => void;
}

const UpdateLogModal = ({ onClose }: { onClose: () => void }) => (
    <div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
    >
        <div
            className="relative w-full max-w-2xl bg-gray-800 border-2 border-red-500/30 rounded-lg shadow-2xl p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
        >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                <IconX size={24} />
            </button>
            <h2 className="text-3xl font-title text-red-400 border-b-2 border-red-500/30 pb-2">Nhật Ký Cập Nhật</h2>
            
            <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 3.4: Biên Niên Sử Chưa Viết</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>
                        <span className="font-semibold text-red-400">[TÍNH NĂNG CHÍNH]</span> **Tạo Hành Trình Riêng**: Một chế độ "Tạo Hành Trình Riêng" đã được thêm vào màn hình bắt đầu.
                    </li>
                     <li>
                        <span className="font-semibold text-green-400">[CỐT TRUYỆN DO NGƯỜI CHƠI ĐIỀU KHIỂN]</span> Giờ đây bạn có thể viết nên bối cảnh câu chuyện của riêng mình, xác định thế giới, tình huống khởi đầu và mục tiêu cuối cùng của bạn. AI Quản Trò sẽ sử dụng lời nhắc của bạn làm nền tảng cho toàn bộ cuộc phiêu lưu.
                    </li>
                    <li>
                        <span className="font-semibold text-purple-400">[KHẢ NĂNG VÔ HẠN]</span> Muốn trở thành một cướp biển bị nguyền rủa tìm kiếm kho báu đã mất trên một biển ma? Một thám tử trong một thành phố gothic, ẩm ướt được cung cấp năng lượng bởi ma thuật bị cấm? Một người sống sót đơn độc trong một vùng đất hoang băng giá sau khi mặt trời chết? Bây giờ bạn có thể. Câu chuyện là của bạn để bắt đầu.
                    </li>
                </ul>
            </div>

            <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 3.3: Chân Trời Vỡ Nát</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>
                        <span className="font-semibold text-red-400">[ĐẠI TU AI THẾ GIỚI]</span> **BỐI CẢNH MỞ RỘNG**: AI Quản Trò giờ đây được huấn luyện để suy nghĩ như một nhà sử học và người vẽ bản đồ, tạo ra một thế giới rộng lớn vượt ra ngoài tầm mắt của người chơi.
                    </li>
                     <li>
                        <span className="font-semibold text-green-400">[CHÂN TRỜI XA XĂM]</span> AI sẽ thường xuyên mô tả các địa danh ở xa, các vùng đất khác nhau có thể nhìn thấy từ vị trí của bạn, tạo ra cảm giác về một bản đồ thế giới thực sự.
                    </li>
                    <li>
                        <span className="font-semibold text-purple-400">[THẾ LỰC & PHE PHÁI]</span> Thế giới giờ đây được làm phong phú hơn với các phe phái, đế chế sụp đổ, và các giáo phái bí ẩn. Dấu vết của họ sẽ được tìm thấy trong các truyền thuyết, vật phẩm và các cuộc gặp gỡ.
                    </li>
                    <li>
                        <span className="font-semibold text-blue-400">[LỊCH SỬ SÂU SẮC]</span> Khám phá một thế giới với nhiều lớp lịch sử. Các tàn tích bạn đi qua có thể được xây dựng trên nền của một nền văn minh còn cổ xưa hơn nữa.
                    </li>
                </ul>
            </div>

            <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 3.2: Tiếng Thì Thầm Của Đá</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>
                        <span className="font-semibold text-red-400">[ĐẠI TU AI THẾ GIỚI]</span> **THẾ GIỚI CÓ HỒN HƠN**: Để đáp lại phản hồi về việc thế giới có cảm giác bị bó hẹp, AI Quản Trò đã được dạy một triết lý thiết kế mới.
                    </li>
                     <li>
                        <span className="font-semibold text-green-400">[TỪ BỎ "PHÒNG HỘP"]</span> AI giờ đây sẽ tránh tạo ra các "căn phòng" chung chung. Thay vào đó, nó sẽ xây dựng các không gian độc đáo, có lịch sử và kết nối với nhau một cách tự nhiên. Mong đợi những quang cảnh rộng lớn, những tàn tích có câu chuyện, và những lối đi ẩn giấu.
                    </li>
                    <li>
                        <span className="font-semibold text-purple-400">[CẢM NHẬN BẰNG MỌI GIÁC QUAN]</span> Thế giới không chỉ để nhìn. AI sẽ thường xuyên mô tả những gì bạn nghe, ngửi và cảm nhận, từ tiếng gió hú qua những kẽ nứt đến mùi hôi thối của sự mục rữa, tạo ra một trải nghiệm nhập vai sâu sắc hơn.
                    </li>
                    <li>
                        <span className="font-semibold text-blue-400">[LỰA CHỌN CÓ Ý NGHĨA HƠN]</span> Các lựa chọn của bạn sẽ phản ánh sự phong phú của môi trường, cho phép bạn tương tác với các chi tiết cụ thể của thế giới thay vì chỉ đi từ A đến B.
                    </li>
                </ul>
            </div>
            
            <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 3.1: Tiếng Vọng Trong Hoang Tàn</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>
                        <span className="font-semibold text-red-400">[CẬP NHẬT CỐT LÕI]</span> **SỰ NGUY HIỂM & CHIỀU SÂU**: Một loạt các quy tắc cốt lõi mới đã được khắc vào AI Quản Trò để giải quyết phản hồi rằng thế giới quá trống rỗng và các cơ chế quá đơn giản.
                    </li>
                     <li>
                        <span className="font-semibold text-green-400">[THẾ GIỚI SỐNG ĐỘNG]</span> AI giờ đây bị **bắt buộc** phải tích cực tạo ra NPC, kẻ thù, hoặc các dấu hiệu của sự sống (hoặc cái chết) trong hầu hết mọi cảnh.
                    </li>
                    <li>
                        <span className="font-semibold text-purple-400">[RỦI RO & HẬU QUẢ]</span> Nghỉ ngơi ở những nơi không an toàn giờ đây có nguy cơ bị phục kích. Những hành động tàn nhẫn sẽ thu hút sự chú ý của Vực Thẳm, làm cho thế giới ngày càng thù địch hơn.
                    </li>
                     <li>
                        <span className="font-semibold text-yellow-400">[TÁC ĐỘNG CỦA TÂM TRÍ]</span> Chỉ số Tâm trí (Sanity) giờ đây có tác động rõ rệt hơn. Khi tâm trí xuống thấp, nó sẽ ảnh hưởng đến nhận thức của bạn về thế giới và có thể gây ra những cơn ác mộng.
                    </li>
                </ul>
            </div>

            <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 3.0: Vòng Lặp Vĩnh Cửu</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>
                        <span className="font-semibold text-red-400">[ĐẠI TU TOÀN DIỆN]</span> **Thế Giới Sống Động & Hậu Quả**: Phiên bản này củng cố và tích hợp các hệ thống cốt lõi để tạo ra một trải nghiệm nhập vai sâu sắc và nghiệt ngã hơn.
                    </li>
                     <li>
                        <span className="font-semibold text-green-400">[NPC ĐỘNG]</span> Thế giới không còn trống rỗng. AI Quản Trò giờ đây chủ động tạo ra các **NPC động** với mục đích và câu chuyện riêng, khiến mỗi khu vực trở nên sống động và khó lường.
                    </li>
                    <li>
                        <span className="font-semibold text-purple-400">[HỆ THỐNG HẬU QUẢ]</span> **Sự Chú Ý Của Vực Thẳm**: Mỗi hành động tàn nhẫn và tha hóa của bạn sẽ khiến Vực Thẳm chú ý, làm cho thế giới ngày càng trở nên thù địch, kẻ thù nguy hiểm hơn và sự cứu rỗi xa vời hơn.
                    </li>
                    <li>
                        <span className="font-semibold text-blue-400">[TƯƠNG TÁC XÃ HỘI]</span> Các hệ thống **Uy Tín**, **Diện Mạo**, và **Tình Cảm Đồng Đội** giờ đây hoạt động phối hợp, tạo ra một mạng lưới các mối quan hệ xã hội phức tạp.
                    </li>
                    <li>
                        <span className="font-semibold text-yellow-400">[CƠ CHẾ CỐT LÕI]</span> Củng cố các hệ thống chiến đấu nhắm mục tiêu bộ phận cơ thể, quản lý Tâm Trí, Đói/Khát, và hệ thống Thương Tật chi tiết, tạo ra một trải nghiệm sinh tồn tàn bạo.
                    </li>
                </ul>
            </div>

            <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 2.3: Con Mắt Của Vực Thẳm</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>
                        <span className="font-semibold text-green-400">[TÍNH NĂNG MỚI]</span> **Hình Ảnh Hóa Cơn Ác Mộng**: Mỗi cảnh quan, mỗi cuộc chạm trán giờ đây sẽ được đi kèm với một hình ảnh độc nhất do AI tạo ra, kéo bạn sâu hơn vào thế giới kinh hoàng của 'Lời Nguyền Của Vực Thẳm'.
                    </li>
                    <li>
                        <span className="font-semibold text-purple-400">[CẢI TIẾN CÔNG NGHỆ]</span> Tích hợp mô hình sinh ảnh **Imagen 3** để tạo ra các tác phẩm nghệ thuật đầy ám ảnh, phản ánh chính xác không khí và chi tiết của câu chuyện.
                    </li>
                    <li>
                        <span className="font-semibold text-blue-400">[CẢI TIẾN GIAO DIỆN]</span> Một bảng điều khiển nghệ thuật mới đã được thêm vào phía trên câu chuyện, hiển thị hình ảnh của thế giới khi nó thay đổi.
                    </li>
                </ul>
            </div>

            <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 2.2: Sợi Dây Tình Cảm</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>
                        <span className="font-semibold text-green-400">[TÍNH NĂNG MỚI]</span> Hệ thống **Tình Cảm (Affection)**: Mối quan hệ của bạn với đồng đội giờ đây sẽ được theo dõi. Mỗi hành động của bạn, từ việc chia sẻ chiến lợi phẩm đến những quyết định đạo đức, đều sẽ ảnh hưởng đến cách họ nhìn nhận bạn.
                    </li>
                    <li>
                        <span className="font-semibold text-purple-400">[CẢI TIẾN GAMEPLAY]</span> Tình cảm của đồng đội sẽ có hậu quả thực sự. Lòng trung thành cao có thể mở khóa các nhiệm vụ cá nhân, các lựa chọn đối thoại đặc biệt, và sự hỗ trợ mạnh mẽ hơn trong chiến đấu. Ngược lại, tình cảm thấp có thể dẫn đến sự bất tuân, phản bội, hoặc thậm chí là họ sẽ rời bỏ bạn vào lúc nguy cấp nhất.
                    </li>
                    <li>
                        <span className="font-semibold text-blue-400">[CẢI TIẾN GIAO DIỆN]</span> Bảng Đồng Đội giờ đây hiển thị một thanh Tình Cảm bên cạnh thanh máu, cho bạn thấy rõ mức độ yêu ghét của họ. Các trạng thái từ "Căm Ghét" đến "Bạn Tâm Giao" sẽ cho bạn biết chính xác vị trí của mình trong lòng họ.
                    </li>
                    <li>
                        <span className="font-semibold text-yellow-400">[CẬP NHẬT AI]</span> AI Quản Trò giờ đây đã được huấn luyện để quản lý và phản hồi lại hệ thống Tình Cảm, tạo ra những câu chuyện năng động và các mối quan hệ phức tạp hơn.
                    </li>
                </ul>
            </div>

            <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 2.1: Ánh Sáng Leo Lắt</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>
                        <span className="font-semibold text-green-400">[TÍNH NĂNG MỚI]</span> Hệ thống **Thánh Địa (Sanctuary)**: Giữa tro tàn, bạn có thể tìm thấy và vun đắp những tia hy vọng. Khám phá những nơi trú ẩn tiềm năng, phát triển chúng và biến chúng thành Thánh Địa của riêng bạn.
                    </li>
                    <li>
                        <span className="font-semibold text-green-400">[TÍNH NĂNG MỚI]</span> Chỉ số **Hy Vọng (Hope)**: Các Thánh Địa giờ đây có chỉ số Hy Vọng. Giúp đỡ những người sống sót, hoàn thành các nhiệm vụ xây dựng cộng đồng để thắp lên ngọn lửa hy vọng, hoặc chứng kiến nó lụi tàn trước sự tàn khốc của thế giới.
                    </li>
                    <li>
                        <span className="font-semibold text-green-400">[TÍNH NĂNG MỚI]</span> **Xây Dựng Cộng Đồng**: Thuyết phục các NPC hiếm hoi có lòng tốt chuyển đến Thánh Địa của bạn. Họ có thể cung cấp các lợi ích độc nhất, nhưng cũng là những sinh mạng quý giá mà bạn phải bảo vệ.
                    </li>
                    <li>
                        <span className="font-semibold text-purple-400">[CẢI TIẾN GAMEPLAY]</span> Tương tác xã hội sâu sắc hơn với hệ thống **Uy Tín (Reputation)** và **Diện Mạo (Appearance)**. Cách bạn hành động và vẻ ngoài của bạn sẽ ảnh hưởng trực tiếp đến cách thế giới phản ứng với bạn.
                    </li>
                    <li>
                        <span className="font-semibold text-yellow-400">[MỤC TIÊU CUỐI GAME]</span> Một Thánh Địa được phát triển đầy đủ có thể mở khóa một con đường để **thanh tẩy Dấu Hiệu Tế Thần**, nhưng cái giá phải trả sẽ vô cùng đắt.
                    </li>
                    <li>
                        <span className="font-semibold text-blue-400">[CẢI TIẾN GIAO DIỆN]</span> Bảng điều khiển Thánh Địa đã được thêm vào giao diện chính để dễ dàng quản lý.
                    </li>
                </ul>
            </div>

             <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 2.0: Vực Thẳm Nhìn Lại</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>
                        <span className="font-semibold text-red-400">[ĐẠI TU AI]</span> AI Quản Trò đã được viết lại hoàn toàn, lấy cảm hứng từ sự tàn bạo của **Berserk**, sự trừng phạt của **Fear & Hunger**, và sự tha hóa của **Black Souls**. Thế giới giờ đây chủ động hơn trong việc nghiền nát cả cơ thể và tinh thần của bạn.
                    </li>
                    <li>
                        <span className="font-semibold text-green-400">[TÍNH NĂNG MỚI]</span> Hệ thống **Tâm Trí (Sanity)**: Chứng kiến những điều kinh hoàng hoặc sử dụng ma thuật hắc ám sẽ bào mòn tâm trí của bạn, ảnh hưởng đến khả năng chiến đấu.
                    </li>
                    <li>
                        <span className="font-semibold text-green-400">[TÍNH NĂNG MỚI]</span> Hệ thống **Thành Thạo (Proficiency)**: Sử dụng các loại vũ khí trong chiến đấu sẽ giúp bạn tích lũy kinh nghiệm, tăng cấp độ thành thạo và nhận được các bonus vĩnh viễn.
                    </li>
                     <li>
                        <span className="font-semibold text-green-400">[TÍNH NĂNG MỚI]</span> Cơ chế **Dấu Hiệu Tế Thần**: Lấy cảm hứng từ Berserk, người chơi có thể bị đánh dấu, thu hút những kẻ thù nguy hiểm hơn nhưng cũng nhận được một chút sức mạnh từ sự tuyệt vọng.
                    </li>
                    <li>
                        <span className="font-semibold text-yellow-400">[CÂN BẰNG ĐỘ KHÓ]</span> Các độ khó đã được tinh chỉnh lại hoàn toàn. Các cơ chế trừng phạt như thương tật, đói/mất trí, và sự tha hóa của thế giới giờ đây sẽ được giới thiệu một cách từ từ qua các cấp độ khó, thay vì chỉ dồn hết vào 'Địa Ngục'.
                    </li>
                     <li>
                        <span className="font-semibold text-blue-400">[ĐỘ KHÓ MỚI]</span> Thêm độ khó **"Đày Đoạ"**, một thử thách nằm giữa 'Ác Mộng' và 'Địa Ngục', dành cho những người tìm kiếm sự đau khổ tột cùng nhưng vẫn còn một tia hy vọng.
                    </li>
                </ul>
            </div>
            
            <div className="pt-4 border-t border-gray-700 text-center">
                <p className="text-gray-500 italic">Bóng tối không ngừng phát triển, và chúng tôi cũng vậy.</p>
            </div>

        </div>
    </div>
);


const StartScreen: React.FC<StartScreenProps> = ({ onStartGame, onStartCustomJourney, onLoadGame, saveFileExists, onOpenApiKeyManager, isMatureContent, onToggleMatureContent, onStartCombatTest }) => {
    const [isUpdateLogOpen, setIsUpdateLogOpen] = useState(false);

    return (
        <div className="bg-gray-900 text-gray-300 min-h-screen flex flex-col items-center justify-center p-4 selection:bg-red-900/50 selection:text-white">
            <div className="text-center max-w-3xl">
                <h1 className="text-6xl md:text-8xl font-title text-red-600 tracking-wider animate-pulse mb-6" style={{ animationDuration: '3s' }}>
                    {GAME_TITLE}
                </h1>
                <p className="text-lg text-gray-400 mb-12 mx-auto">
                    Một game nhập vai kỳ ảo hắc ám dựa trên văn bản được cung cấp bởi Gemini. Điều hướng một thế giới ảm đạm và không khoan nhượng, nơi mọi lựa chọn đều nặng nề hậu quả và mọi bóng tối đều có thể che giấu kẻ thù. Câu chuyện của bạn được viết trong bóng tối.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
                    {saveFileExists && (
                        <button
                            onClick={onLoadGame}
                            className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-lg text-2xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.7)] order-first sm:order-none"
                            title="Tiếp tục cuộc hành trình"
                        >
                            Tiếp Tục
                        </button>
                    )}
                    <button
                        onClick={onStartGame}
                        className="bg-red-700 hover:bg-red-600 text-white font-bold py-4 px-10 rounded-lg text-2xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.7)]"
                        title="Bắt đầu cuộc phiêu lưu mới"
                    >
                        Trò Chơi Mới
                    </button>
                     <button
                        onClick={onStartCustomJourney}
                        className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-lg text-lg transition-all duration-300 flex items-center gap-2"
                        title="Tự viết nên bối cảnh và mục tiêu cho cuộc hành trình của bạn"
                    >
                        <IconFeather /> Tạo Hành Trình Riêng
                    </button>
                    <button
                        onClick={onStartCombatTest}
                        className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg text-lg transition-all duration-300 flex items-center gap-2"
                        title="Bỏ qua tạo nhân vật và vào ngay một trận chiến."
                    >
                        <IconSword /> Thử nghiệm Chiến đấu
                    </button>
                    <button
                        onClick={() => setIsUpdateLogOpen(true)}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg text-lg transition-all duration-300"
                    >
                        Có Gì Mới?
                    </button>
                     <button
                        onClick={onOpenApiKeyManager}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg text-lg transition-all duration-300 flex items-center gap-2"
                        title="Quản lý API Key Gemini"
                    >
                        <IconKey /> Quản lý API
                    </button>
                    <button
                        onClick={onToggleMatureContent}
                        className={`bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg text-lg transition-all duration-300 flex items-center gap-2 ${isMatureContent ? '!bg-red-900 ring-2 ring-red-500' : ''}`}
                        title="Bật/tắt nội dung 18+ (bạo lực, máu me, chủ đề người lớn)"
                    >
                        <IconFlame /> 18+
                    </button>
                </div>
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
                 <p className="text-sm text-gray-500">Được cung cấp bởi API Gemini của Google.</p>
            </div>

            {isUpdateLogOpen && <UpdateLogModal onClose={() => setIsUpdateLogOpen(false)} />}
        </div>
    );
};

export default StartScreen;
