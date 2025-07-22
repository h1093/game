import React, { useState } from 'react';

// SVG Icons
const IconFeather = (props: React.SVGProps<SVGSVGElement>) => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><path d="M16 8L2 22"/><path d="M17.5 15H9"/></svg>
);

interface CustomJourneyScreenProps {
    onJourneyCreate: (prompt: string) => void;
    onBack: () => void;
}

const CustomJourneyScreen: React.FC<CustomJourneyScreenProps> = ({ onJourneyCreate, onBack }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onJourneyCreate(prompt);
    };

    return (
        <div className="bg-gray-900 text-gray-300 min-h-screen flex flex-col items-center justify-center p-4 selection:bg-purple-900/50 selection:text-white">
            <div className="w-full max-w-3xl bg-gray-800/50 border border-purple-500/30 rounded-lg shadow-2xl p-8 backdrop-blur-sm animate-fadeIn">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center">
                        <IconFeather className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                        <h1 className="text-4xl font-title text-purple-400 mb-2">Tạo Cốt Truyện Của Riêng Bạn</h1>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Đây là thế giới của bạn. Hãy mô tả nó. Bạn là ai trong thế giới này? Cuộc hành trình của bạn bắt đầu từ đâu và mục tiêu cuối cùng là gì? Càng chi tiết, Quản Trò AI càng có thể dệt nên một câu chuyện độc đáo cho bạn.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="journey-prompt" className="sr-only">Nội dung cốt truyện</label>
                        <textarea
                            id="journey-prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ví dụ: Thế giới là một đại dương vô tận đầy những hòn đảo bay lơ lửng, nơi những con tàu bay bằng etherium là phương tiện duy nhất. Tôi là một thợ săn tiền thưởng với một cánh tay máy, đang truy lùng một thuyền trưởng cướp biển khét tiếng để trả thù cho gia đình mình..."
                            rows={10}
                            className="w-full bg-gray-900 border border-gray-600 rounded-md p-4 text-lg leading-relaxed focus:ring-2 focus:ring-purple-500 focus:outline-none transition placeholder:text-gray-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 border-t border-gray-700/50">
                        <button
                            type="button"
                            onClick={onBack}
                            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-lg transition-colors w-full sm:w-auto"
                        >
                            Quay Lại Menu
                        </button>
                        <button
                            type="submit"
                            disabled={!prompt.trim()}
                            className="bg-purple-700 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-[0_0_20px_rgba(168,85,247,0.7)] w-full sm:w-auto"
                        >
                            Tiếp Tục Tạo Nhân Vật
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomJourneyScreen;
