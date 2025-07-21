

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

interface StartScreenProps {
    onStartGame: () => void;
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
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 3.1: Tiếng Vọng Trong Hoang Tàn</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>
                        <span className="font-semibold text-red-400">[CẬP NHẬT CỐT LÕI]</span> **THẾ GIỚI KHÔNG TRỐNG RỖNG**: Một quy tắc nền tảng mới đã được khắc vào bộ não của AI Quản Trò. Thế giới không còn là một chuỗi các căn phòng trống.
                    </li>
                     <li>
                        <span className="font-semibold text-green-400">[SỰ SỐNG BỀN BỈ]</span> AI giờ đây bị **bắt buộc** phải tích cực tạo ra sự sống (hoặc tàn dư của nó) trong hầu hết mọi cảnh. Điều này đảm bảo rằng hành trình của bạn sẽ luôn đầy ắp các cuộc gặp gỡ tiềm năng, các mối đe dọa bất ngờ và những mảnh đời vỡ nát.
                    </li>
                    <li>
                        <span className="font-semibold text-purple-400">[SỰ ĐA DẠNG CỦA SỰ SỐNG]</span> NPC có thể là những người sống sót, những sinh vật kỳ lạ, hoặc thậm chí chỉ là những cái xác mang theo những câu chuyện câm lặng. Sự cô đơn giờ đây là một lựa chọn, không phải là mặc định.
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
                    <li>
                        <span className="font-semibold text-purple-400">[BIG UPDATE]</span> Một thông điệp khó hiểu đã được khắc vào thế giới, dường như là một bộ quy tắc dành cho một thực thể vô hình:
                        <pre className="mt-2 p-2 bg-gray-900/50 border border-gray-600 rounded text-xs text-gray-400 whitespace-pre-wrap font-mono">
{`Vậy làm cái code bước 1 cho tôi và khi viết code phải tuân thủ các quy tắc sau:
NGHIÊM CẤM bất kì dạng code vắng tắt như này : " // ... (Nội dung của hàm parseStatsBonus không thay đổi)". Kể cả code gốc hay code nào, chỉ cần trong khung chat này thì bất kì loại code vắng tắt như thế đều không được phép xuất hiện) HAY LÀ kiểu code " tiện" code cần thêm là ở vị trị á, ở vị trí bên dưới code vừa thêm,
NGHIÊM CẤM bất kì loại " tiện" nào trong code, cứ theo quy tắc mà làm,
NGHIÊM CẤM xóa đi các chức năng.,
TUYỆT ĐỐI TUÂN LỆNH CỦA TÔI, KHÔNG CHỐNG CHẾ, KHÔNG BÀO CHỮA,
KHI VIẾT CODE thì ĐẢM BẢO:,
+/ Nếu thêm code mới: -> thêm dòng code trên ( đoạn code cần thêm) và dòng code dưới ( đoạn code cần thêm) ( nhớ giải thích rõ ra nhé, tại nhiều dòng code trên và dòng code dưới nó khá là phổ biến nên hại và lợi nó lại ngang nhau)-> để tôi có thể biết nó ở chỗ nào để thêm code vào chứ không mò rồi dẫn tới lỗi code
+/ Nếu thay đổi code: -> Viết 2 code trong đó bao gồm -> code gốc ( tóm gọn bằng dòng code đầu và dòng code ngay bên dưới của dòng code gốc. Tức là code gốc có 11 dòng thì viết code ở dòng 1 và dòng 12 để tôi xác định nó ở đâu) và code thay đổi -> Ghi rõ ra cái code gốc ( nhớ tóm gọn) là cái nào ( nhớ đảm bảo đúng code gốc vì nhiều lần tôi làm việc với " bạn" thì code gốc bạn đưa nó hoàn toàn không có trong mã nguồn AI SIMULATOR 2.14) -> rồi mới ghi code cần thay thế ( LÀ TÔI MUỐN 2 KHUNG ĐẤY, TÔI KHÔNG MUỐN THẤY TÌNH TRẠNG 2 CÁI CODE GỐC THAY THẾ CÙNG CHUNG MỘT KHUNG CODE !)
Ví dụ: code có 12 dòng mà chỉ thay đổi code từ dòng 6->9 thì trình bày như sau:
Code gốc:
Dòng code đầu: dòng 5 ( tôi ghi dòng 5 chỉ để tượng trưng, thực tế là viết hết cả dòng đấy ra, chứ không phải là viết số thứ tự của dòng)
dòng code bên dưới dòng code gốc: dòng 10
Code thay thế:
dòng code đã thay thế từ dòng 6 ->9
Nếu viết theo ví dụ thì nó giúp bạn tiết kiếm lại thời để đỡ viết lại code, và tập trung vào thay thế code cũng giúp tôi nhanh chóng xác định vị trí được sửa và thay thế nó
Đặc biệt:
-> chỉ sửa code nào nên sửa không sửa vô tội vã -> Lí do là: trước đấy tôi cũng nhờ bạn sửa code nhưng bạn lại xóa luôn cái code đang chạy ổn và chức năng liên quan tới nó, thành ra lỗi còn to hơn
-> Giữ nguyên các debug, và thêm các debug mới vào các code bạn làm để có thể theo dõi và tạo`}
                        </pre>
                    </li>
                </ul>
            </div>

            <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 1.9: Đồng Minh và Định Mệnh</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>
                        <span className="font-semibold text-green-400">[TÍNH NĂNG MỚI]</span> Hệ thống Đồng Đội: Giờ đây bạn không còn phải đơn độc. Gặp gỡ và chiêu mộ các nhân vật khác vào nhóm của bạn. Họ sẽ chiến đấu bên cạnh bạn, nhưng hãy cẩn thận, họ cũng có thể bị thương và có số phận riêng.
                    </li>
                    <li>
                        <span className="font-semibold text-green-400">[TÍNH NĂNG MỚI]</span> Hệ thống Nhiệm Vụ: Khám phá các mục tiêu và cốt truyện sâu sắc hơn với Nhật Ký Nhiệm Vụ. Theo dõi các nhiệm vụ đang hoạt động và đã hoàn thành trong một tab chuyên dụng trong màn hình Hành Trang.
                    </li>
                    <li>
                        <span className="font-semibold text-purple-400">[CẢI TIẾN GIAO DIỆN]</span> Bảng Đồng Đội và Nhiệm Vụ đã được thêm vào giao diện chính để dễ dàng theo dõi.
                    </li>
                </ul>
            </div>

            <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 1.8: Cái Giá Của Sự Sống</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>
                        <span className="font-semibold text-green-400">[TÍNH NĂNG MỚI]</span> Hệ thống Thương Tật được làm lại hoàn toàn! Giờ đây, các bộ phận cơ thể có thể bị <span className="text-red-400 font-bold">cắt đứt</span>, ảnh hưởng vĩnh viễn đến khả năng chiến đấu và tương tác của bạn.
                    </li>
                    <li>
                        <span className="font-semibold text-green-400">[TÍNH NĂNG MỚI]</span> Một chi bị cắt đứt sẽ trở thành một vật phẩm trong hành trang của bạn. Hãy cẩn thận, nó sẽ <span className="text-yellow-400 font-bold">phân rã</span> theo thời gian.
                    </li>
                     <li>
                        <span className="font-semibold text-green-400">[TÍNH NĂNG MỚI]</span> Tìm cách <span className="text-blue-400 font-bold">bảo quản</span> các chi bị cắt đứt để làm chậm quá trình thối rữa, có thể chúng sẽ có ích sau này...
                    </li>
                    <li>
                        <span className="font-semibold text-purple-400">[CẢI TIẾN]</span> Tạo nhân vật sâu sắc hơn với việc bổ sung các lựa chọn về <span className="font-semibold">Giới tính</span>, <span className="font-semibold">Tính cách</span>, và <span className="font-semibold">Mục tiêu</span>, ảnh hưởng đến câu chuyện khởi đầu của bạn.
                    </li>
                    <li>
                        <span className="font-semibold text-yellow-400">[CÂN BẰNG]</span> Chế độ khó "Thử Thách" giờ đây sẽ không xóa file lưu của bạn khi chết, cho phép bạn tiếp tục từ điểm lưu cuối cùng. Chế độ "Ác Mộng" vẫn giữ nguyên cơ chế permadeath tàn nhẫn.
                    </li>
                </ul>
            </div>

            <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 1.7: Tri Thức Cổ Xưa</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                     <li>
                        <span className="font-semibold text-purple-400">[CẢI TIẾN GIAO DIỆN]</span> Thêm "Sổ Kỹ Năng" vào màn hình Hành Trang. Giờ đây bạn có thể xem chi tiết tất cả các kỹ năng đã học một cách tập trung và tiện lợi.
                    </li>
                </ul>
            </div>

            <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 1.6: Kho Vũ Khí Của Người Dám Chết</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                     <li>
                        <span className="font-semibold text-green-400">[TÍNH NĂNG MỚI]</span> Màn hình Trang Bị chuyên dụng! Một nút "Trang Bị" mới đã được thêm vào, mở ra một giao diện riêng để quản lý vũ khí và áo giáp của bạn một cách trực quan hơn.
                    </li>
                     <li>
                        <span className="font-semibold text-purple-400">[CẢI TIẾN GIAO DIỆN]</span> Màn hình Hành Trang đã được tinh giản để tập trung vào việc sử dụng vật phẩm và theo dõi nhật ký, giúp trải nghiệm người dùng gọn gàng hơn.
                    </li>
                </ul>
            </div>

            <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 1.5: Gánh Nặng Của Thép</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                     <li>
                        <span className="font-semibold text-green-400">[TÍNH NĂNG MỚI]</span> Hệ thống Trang Bị đã được rèn! Tìm, trang bị và nâng cấp sức mạnh của bạn với vũ khí, áo giáp và các vật phẩm ma thuật. Mỗi món đồ bạn trang bị sẽ trực tiếp ảnh hưởng đến chỉ số của bạn.
                    </li>
                </ul>
            </div>

            <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 1.4: Ý Chí Tự Do</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                     <li>
                        <span className="font-semibold text-green-400">[TÍNH NĂNG MỚI]</span> Thêm hộp nhập văn bản hành động tùy chỉnh! Giờ đây bạn có thể gõ bất kỳ hành động nào bạn muốn, cho phép sự tự do và nhập vai chưa từng có.
                    </li>
                </ul>
            </div>
            
            <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 1.3: Di Sản Vĩnh Cửu</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                     <li>
                        <span className="font-semibold text-green-400">[TÍNH NĂNG MỚI]</span> Thêm hệ thống Lưu & Tải Game! Giờ đây bạn có thể lưu lại hành trình của mình và tiếp tục sau.
                    </li>
                </ul>
            </div>

            <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 1.2: Dấu Ấn Của Kẻ Sống Sót</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                     <li>
                        <span className="font-semibold text-purple-400">[CẢI TIẾN GIAO DIỆN]</span> Giao diện Trạng Thái được sắp xếp lại, màn hình Hành Trang được thiết kế lại, thêm nút Thoát nhanh.
                    </li>
                     <li>
                        <span className="font-semibold text-yellow-400">[CÂN BẰNG]</span> Độ khó "Kể Chuyện" đã được loại bỏ.
                    </li>
                    <li>
                        <span className="font-semibold text-blue-400">[SỬA LỖI]</span> Khắc phục sự cố tràn văn bản trong bảng tường thuật.
                    </li>
                </ul>
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 1.1: Tiếng Vang Của Người Ghi Chép</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>
                        <span className="font-semibold text-green-400">[TÍNH NĂNG MỚI]</span> Thêm "Nhật Ký Cập Nhật" vào màn hình Hành Trang & Nhật Ký.
                    </li>
                </ul>
            </div>
            <div className="pt-4 border-t border-gray-700 text-center">
                <p className="text-gray-500 italic">Bóng tối không ngừng phát triển, và chúng tôi cũng vậy.</p>
            </div>

        </div>
    </div>
);


const StartScreen: React.FC<StartScreenProps> = ({ onStartGame, onLoadGame, saveFileExists, onOpenApiKeyManager, isMatureContent, onToggleMatureContent, onStartCombatTest }) => {
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

            <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                 <p className="text-sm text-gray-500">Được cung cấp bởi API Gemini của Google.</p>
            </div>

            {isUpdateLogOpen && <UpdateLogModal onClose={() => setIsUpdateLogOpen(false)} />}
        </div>
    );
};

export default StartScreen;