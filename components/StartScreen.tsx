
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
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 3.10: Sự Tha Hóa Của Đức Tin</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>
                        <span className="font-semibold text-red-400">[CƠ CHẾ MỚI]</span> **Sự Tha Hóa Của Tín Đồ**: Tín đồ của các Ngoại Thần giờ đây có thể bị chính sức mạnh mà họ tôn thờ nuốt chửng.
                    </li>
                     <li>
                        <span className="font-semibold text-green-400">[KẺ THÙ MỚI]</span> Trong chiến đấu, một tín đồ có thể mất kiểm soát và **biến đổi** thành một con quái vật gớm ghiếc, đặc trưng cho vị thần của nó (Sự Gớm Ghiếc Bằng Thịt, Nỗi Kinh Hoàng Nhìn Chằm Chằm, Cái Miệng Vực Thẳm), tạo ra các cuộc chạm trán bất ngờ và đầy thử thách.
                    </li>
                    <li>
                        <span className="font-semibold text-purple-400">[CỐT TRUYỆN MÔI TRƯỜNG]</span> Đánh bại những sinh vật này có thể tiết lộ những câu chuyện bi thảm về những kẻ đã bị đức tin của mình hủy hoại, làm tăng thêm chiều sâu kinh dị cho thế giới.
                    </li>
                </ul>
            </div>
            
             <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 3.9: Tiếng Vọng Của Các Vị Thần Cũ</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>
                        <span className="font-semibold text-red-400">[ĐẠI TU CỐT TRUYỆN]</span> **Xung Đột Thần Thánh**: Cốt truyện cốt lõi đã được làm rõ. Các Ngoại Thần không còn xung đột với nhau; chúng thống nhất chống lại một mối đe dọa chung: sự hồi sinh của các **Thần Cũ** đã bị lật đổ.
                    </li>
                     <li>
                        <span className="font-semibold text-green-400">[CƠ CHẾ MỚI]</span> **Mảnh Vỡ Thần Thánh**: Một loại vật phẩm mới đã được thêm vào. Thu thập những mảnh vỡ từ các vị thần đã chết này là một mục tiêu cốt lõi của người chơi.
                    </li>
                    <li>
                        <span className="font-semibold text-purple-400">[HẬU QUẢ]</span> **Cơn Thịnh Nộ Của Vực Thẳm**: Việc thu thập Mảnh Vỡ Thần Thánh sẽ khiến các Ngoại Thần phẫn nộ. Càng có nhiều mảnh vỡ, thế giới càng trở nên thù địch, và cuối cùng bạn sẽ bị đánh **Dấu Hiệu Tế Thần**.
                    </li>
                </ul>
            </div>
            
             <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 3.8: Những Lời Cầu Nguyện Bị Cấm</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>
                        <span className="font-semibold text-red-400">[HỆ THỐNG MỚI]</span> **Tôn Giáo & Ngoại Thần**: Thêm vào thế giới 3 Ngoại Thần mới (Mẹ Toàn Năng, Kẻ Lặng Nhìn, Cơn Đói Vực Thẳm), mỗi vị thần có tôn giáo, tín đồ và triết lý riêng.
                    </li>
                     <li>
                        <span className="font-semibold text-green-400">[CƠ CHẾ MỚI]</span> **Ấn Ký Ngoại Thần**: Người chơi có thể thu hút sự chú ý của một Ngoại Thần thông qua hành động của mình, và được "ban" cho một ấn ký. Mỗi ấn ký mang lại cả lợi ích và bất lợi to lớn, thay đổi vĩnh viễn lối chơi của bạn.
                    </li>
                    <li>
                        <span className="font-semibold text-purple-400">[TƯƠNG TÁC SÂU SẮC]</span> Bạn sẽ không chọn một vị thần từ menu. Thay vào đó, bạn phải tự khám phá ra họ thông qua các đền thờ, các nghi lễ hoặc tương tác với các tín đồ trong thế giới game.
                    </li>
                </ul>
            </div>
            
            <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 3.7: Sự Mỏng Manh Của Lý Trí</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>
                        <span className="font-semibold text-blue-400">[CÂN BẰNG GAMEPLAY]</span> **Tinh Chỉnh Cơ Chế Tâm Trí**: Để giải quyết phản hồi rằng chỉ số Tâm Trí giảm quá nhanh, cơ chế này đã được cân bằng lại.
                    </li>
                    <li>
                        <span className="font-semibold text-green-400">[GIẢM SỰ BÀO MÒN]</span> Việc mất Tâm Trí từ các hoạt động thông thường (chiến đấu, bị thương nhẹ) đã được giảm đáng kể.
                    </li>
                    <li>
                        <span className="font-semibold text-red-400">[TĂNG CƯỜNG CÚ SỐC]</span> Những lần mất Tâm Trí lớn giờ đây được dành riêng cho những sự kiện thực sự kinh hoàng, đặc biệt là khi đối mặt trực tiếp với các Ngoại Thần hoặc các hiện tượng siêu nhiên, làm cho những khoảnh khắc này trở nên nguy hiểm và đáng nhớ hơn.
                    </li>
                </ul>
            </div>
            
            <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 3.6: Ranh Giới Của Sự Điên Loạn</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>
                        <span className="font-semibold text-red-400">[CƠ CHẾ MỚI]</span> **Ảo Giác & Mất Trí**: Chỉ số Tâm Trí giờ đây có hậu quả rõ rệt hơn.
                    </li>
                     <li>
                        <span className="font-semibold text-purple-400">[ẢO GIÁC]</span> Khi Tâm Trí của bạn suy giảm, AI Quản Trò sẽ bắt đầu mô tả những ảo giác tinh vi (âm thanh, hình ảnh) và chúng sẽ trở nên tồi tệ hơn khi bạn tiến gần đến sự điên loạn.
                    </li>
                    <li>
                        <span className="font-semibold text-cyan-400">[CƠ HỘI & NGUY HIỂM]</span> Một tâm trí yếu đuối sẽ dễ bị ảnh hưởng bởi các Ngoại Thần hơn, tăng cơ hội nhận được ấn ký của họ.
                    </li>
                    <li>
                        <span className="font-semibold text-green-400">[NƠI TRÚ ẨN]</span> Các Thánh Địa giờ đây là nơi trú ẩn an toàn, giúp bạn khôi phục một lượng lớn Tâm Trí khi nghỉ ngơi.
                    </li>
                </ul>
            </div>
            
            <div className="border-b border-gray-700 pb-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">Phiên bản 3.5: Bản Chất Của Linh Hồn</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>
                        <span className="font-semibold text-red-400">[ĐẠI TU TÍNH CÁCH]</span> **Tính Cách Có Hiệu Ứng**: Lựa chọn tính cách không còn chỉ mang tính hình thức. Mỗi tính cách giờ đây đi kèm với các hiệu ứng cơ chế cụ thể.
                    </li>
                     <li>
                        <span className="font-semibold text-green-400">[HIỆU ỨNG CƠ CHẾ]</span> Các hiệu ứng bao gồm thay đổi chỉ số bị động (ví dụ: "Thận Trọng" tăng Phòng Thủ, giảm Tấn Công), hiệu ứng theo điều kiện ("Hận Thù" tăng sát thương khi máu thấp), và các quy tắc đặc biệt ("Vô Cảm" kháng sát thương Tâm Trí).
                    </li>
                    <li>
                        <span className="font-semibold text-blue-400">[CẬP NHẬT GIAO DIỆN]</span> Màn hình tạo nhân vật giờ đây hiển thị rõ ràng mô tả và hiệu ứng của mỗi tính cách.
                    </li>
                     <li>
                        <span className="font-semibold text-purple-400">[CẬP NHẬT AI]</span> AI Quản Trò đã được huấn luyện để nhận biết và phản hồi lại tính cách của bạn, điều chỉnh câu chuyện và các lựa chọn cho phù hợp.
                    </li>
                </ul>
            </div>

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
