import React from 'react';

interface NarrativePanelProps {
    narrative: string;
    isLoading: boolean;
}

const NarrativePanel: React.FC<NarrativePanelProps> = ({ narrative, isLoading }) => {
    // Logic được đơn giản hóa. Chúng tôi luôn hiển thị tường thuật nhận được cuối cùng.
    // Việc quản lý trạng thái của thành phần mẹ đảm bảo tường thuật cũ được giữ lại
    // trong trạng thái tải, sau đó tường thuật mới được truyền xuống.
    // Thành phần này chỉ cần hiển thị những gì nó được cung cấp và một chỉ báo tải.

    return (
        <div className="bg-gray-800/50 p-8 rounded-lg shadow-inner border border-gray-700 max-h-[75vh] overflow-y-auto backdrop-blur-sm">
            <p className="text-gray-300 leading-loose text-xl whitespace-pre-wrap">
                {narrative}
                {isLoading && <span className="animate-pulse">...</span>}
            </p>
        </div>
    );
};

export default NarrativePanel;