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


interface StartScreenProps {
    onStartGame: () => void;
    onLoadGame: () => void;
    saveFileExists: boolean;
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


const StartScreen: React.FC<StartScreenProps> = ({ onStartGame, onLoadGame, saveFileExists }) => {
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
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
                        onClick={() => setIsUpdateLogOpen(true)}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg text-lg transition-all duration-300"
                    >
                        Có Gì Mới?
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