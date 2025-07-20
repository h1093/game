
import React from 'react';

interface GameOverScreenProps {
    onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRestart }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center text-center text-white z-50 p-4">
            <div className="max-w-2xl">
                <h1 className="text-6xl font-title text-red-700 mb-4 animate-pulse">Bạn Đã Gục Ngã</h1>
                <p className="text-gray-400 text-xl mb-8 leading-relaxed">
                    Những tiếng vang từ cuộc hành trình của bạn tan biến vào sự im lặng éc éc. Câu chuyện của bạn đã kết thúc, nhưng bóng tối vẫn còn đó, vĩnh cửu và kiên nhẫn. Chúng chờ đợi linh hồn dũng cảm tiếp theo thách thức bóng tối.
                </p>
                <button
                    onClick={onRestart}
                    className="bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(220,38,38,0.8)]"
                >
                    Tái Sinh
                </button>
            </div>
        </div>
    );
};

export default GameOverScreen;
