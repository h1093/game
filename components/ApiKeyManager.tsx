import React, { useState, useEffect } from 'react';

// SVG Icons
const IconSparkles = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/><path d="M19 3v4"/><path d="M5 17v4"/><path d="M3 19h4"/><path d="M17 5h4"/><path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>
);
const IconX = ({ size, ...props }: React.SVGProps<SVGSVGElement> & { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

interface ApiKeyManagerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (keys: string[]) => void;
    onSetDefault: () => void;
    currentSource: 'default' | 'user';
    currentKeys: string[];
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ isOpen, onClose, onSave, onSetDefault, currentSource, currentKeys }) => {
    const [keysInput, setKeysInput] = useState('');

    useEffect(() => {
        if (isOpen) {
            setKeysInput(currentKeys.join('\n'));
        }
    }, [isOpen, currentKeys]);

    const handleSave = () => {
        const keys = keysInput.split('\n').map(k => k.trim()).filter(k => k);
        onSave(keys);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-8 flex flex-col gap-6"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <IconX size={24} />
                </button>
                <h2 className="text-2xl font-title text-red-400 text-center">Quản Lý Nguồn AI</h2>

                {/* Default Source Section */}
                <div className={`bg-gray-800/50 p-4 rounded-lg border ${currentSource === 'default' ? 'border-blue-500' : 'border-gray-700'} transition-colors duration-300`}>
                    <h3 className="text-lg font-semibold text-gray-200 mb-3">Nguồn AI Mặc Định</h3>
                    <button
                        onClick={onSetDefault}
                        className="w-full flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        <IconSparkles /> Sử Dụng Gemini AI Mặc Định
                    </button>
                    {currentSource === 'default' && (
                         <p className="text-blue-400 text-center font-semibold mt-2 animate-pulse">Đang hoạt động</p>
                    )}
                </div>

                <div className="flex items-center text-center">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-gray-500">hoặc</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                {/* User API Key Section */}
                <div className={`bg-gray-800/50 p-4 rounded-lg border ${currentSource === 'user' ? 'border-red-500' : 'border-gray-700'} transition-colors duration-300`}>
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">Sử Dụng API Key Của Bạn</h3>
                     <textarea
                        value={keysInput}
                        onChange={(e) => setKeysInput(e.target.value)}
                        placeholder={"ví dụ\napikey1\napikey2\napikeyN"}
                        rows={5}
                        className={`w-full bg-gray-900 border ${currentSource === 'user' ? 'border-red-500/40' : 'border-gray-600'} rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:outline-none transition text-sm text-white placeholder:text-gray-500`}
                        aria-label="Nhập các API Key của bạn"
                     />
                     <p className="text-xs text-gray-400 mt-2">
                        Nhập một hoặc nhiều API Key Gemini, mỗi key một dòng.
                        API Key sẽ được lưu cục bộ. Ứng dụng sẽ tự động xoay vòng key nếu một key gặp lỗi (mỗi key 1 dòng, chép xong key 1 thì bấm Shift + Enter rồi chép key 2... không ghi chấm phẩy giữ các key ).
                     </p>
                     <button
                        onClick={handleSave}
                        disabled={!keysInput.trim()}
                        className="w-full mt-4 bg-red-700 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        Lưu và Sử Dụng Các Key Này
                    </button>
                    {currentSource === 'user' && (
                         <p className="text-red-400 text-center font-semibold mt-2 animate-pulse">Đang hoạt động</p>
                    )}
                </div>

                <div className="pt-4 border-t border-gray-700/50 text-center">
                     <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-8 rounded-lg transition-colors">
                        Đóng
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ApiKeyManager;