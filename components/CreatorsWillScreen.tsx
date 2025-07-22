import React, { useState } from 'react';
import { Origin, Difficulty, Gender } from '../types';
import { BASE_STATS_BEFORE_POINT_BUY } from '../constants';

const IconEye = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);

interface CreatorsWillScreenProps {
    onCharacterCreate: (details: {
        name: string;
        bio: string;
        origin: Origin;
        difficulty: Difficulty;
        gender: Gender;
        personality: string;
        goal: string;
        finalStats: any;
    }, isCreatorsWill?: boolean) => void;
    onBack: () => void;
}

const CreatorsWillScreen: React.FC<CreatorsWillScreenProps> = ({ onCharacterCreate, onBack }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const characterDetails = {
            name: name.trim() || "Thực Thể Sáng Thế",
            bio: "Một vị thần dạo bước giữa những kẻ phàm trần, với sức mạnh định hình lại thực tại theo ý muốn. Câu chuyện này là sân chơi của họ.",
            origin: 'Người Sống Sót' as Origin,
            difficulty: 'Thử Thách' as Difficulty,
            gender: 'Khác' as Gender,
            personality: "Toàn Năng",
            goal: "Chơi đùa với các sợi chỉ của số phận",
            finalStats: { ...BASE_STATS_BEFORE_POINT_BUY }
        };
        onCharacterCreate(characterDetails, true);
    };

    return (
        <div className="bg-gray-900 text-gray-300 min-h-screen flex flex-col items-center justify-center p-4 selection:bg-cyan-900/50 selection:text-white">
            <div className="w-full max-w-xl bg-gray-800/50 border border-cyan-500/30 rounded-lg shadow-2xl p-8 backdrop-blur-sm animate-fadeIn">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center">
                        <IconEye className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                        <h1 className="text-4xl font-title text-cyan-400 mb-2">Ý Chí Sáng Thế</h1>
                        <p className="text-gray-400 mx-auto">
                            Bỏ qua các quy tắc của phàm nhân. Bạn là một vị thần. Bất tử, toàn năng. Thế giới này là đất sét trong tay bạn. Hãy đặt cho mình một cái tên và bắt đầu định hình lại nó.
                        </p>
                    </div>
                    <div>
                        <label htmlFor="god-name" className="sr-only">Tên của vị thần</label>
                        <input
                            id="god-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-lg text-center focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                            placeholder="Nhập danh xưng của bạn..."
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 border-t border-gray-700/50">
                        <button
                            type="button"
                            onClick={onBack}
                            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-lg transition-colors w-full sm:w-auto"
                        >
                            Quay Lại
                        </button>
                        <button
                            type="submit"
                            className="bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.7)] w-full sm:w-auto"
                        >
                            Kiến Tạo Thế Giới
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatorsWillScreen;