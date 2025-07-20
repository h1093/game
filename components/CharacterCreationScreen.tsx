
import React, { useState } from 'react';
import { CharacterClass, Difficulty, Gender } from '../types';
import { CLASSES, DIFFICULTIES, GENDERS, PERSONALITIES, GOALS } from '../constants';

// SVG Icons
const IconUser = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const IconBookOpen = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
);
const IconShield = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);
const IconShuffle = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="16 14 21 14 21 19"></polyline><line x1="4" y1="10" x2="15" y2="21"></line><line x1="10" y1="4" x2="21" y2="15"></line></svg>
);
const IconBarChart2 = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
);
const IconThumbsUp = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
);
const IconThumbsDown = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 15v-5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
);
const IconUsers = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const IconSmile = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
);
const IconCompass = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
);
const IconX = ({ size, ...props }: React.SVGProps<SVGSVGElement> & { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

interface CharacterCreationScreenProps {
    onCharacterCreate: (details: { name: string; bio: string; characterClass: CharacterClass; difficulty: Difficulty; gender: Gender; personality: string; goal: string; }) => void;
}

const RANDOM_BIOS = [
    "Là người sống sót cuối cùng của một đoàn lính đánh thuê bị phản bội, tôi chỉ tìm kiếm sự trả thù và một cái chết xứng đáng.",
    "Bị trục xuất khỏi một học viện vì nghiên cứu những phép thuật bị cấm, tôi lang thang trên đất này để tìm kiếm sức mạnh thực sự, bất kể giá nào.",
    "Một tên trộm không có ký ức về quá khứ của mình, tôi chỉ biết đến sự sống còn trong bóng tối, với những ngón tay nhanh nhẹn và một trái tim trống rỗng.",
    "Từng là một quý tộc bị tước đoạt danh hiệu và bị bỏ mặc cho đến chết. Bây giờ, tôi sống chỉ để giành lại những gì đã mất.",
    "Một thợ săn từ những vùng đất hoang dã băng giá ở phương bắc, tôi bị thu hút đến vùng đất bị nguyền rủa này bởi những lời thì thầm về một con mồi huyền thoại.",
    "Được nuôi dưỡng trong một giáo phái tôn thờ sự im lặng, tôi đã chạy trốn để tìm tiếng nói của riêng mình, chỉ để thấy thế giới bên ngoài còn tăm tối hơn cả ngôi đền tôi đã bỏ lại."
];

const CharacterCreationScreen: React.FC<CharacterCreationScreenProps> = ({ onCharacterCreate }) => {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
    const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
    const [selectedPersonality, setSelectedPersonality] = useState<string>('');
    const [selectedGoal, setSelectedGoal] = useState<string>('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Nhân vật của bạn phải có tên.');
            return;
        }
        if (!selectedClass) {
            setError('Bạn phải chọn một lớp nhân vật cho cuộc hành trình của mình.');
            return;
        }
        if (!selectedGender) {
            setError('Hãy chọn giới tính cho nhân vật của bạn.');
            return;
        }
        if (!selectedPersonality) {
            setError('Hãy chọn một tính cách nổi bật.');
            return;
        }
        if (!selectedDifficulty) {
            setError('Bạn phải chọn một độ khó cho cuộc phiêu lưu.');
            return;
        }
        onCharacterCreate({ name, bio, characterClass: selectedClass, difficulty: selectedDifficulty, gender: selectedGender, personality: selectedPersonality, goal: selectedGoal });
    };

    const handleRandomBio = () => {
        const randomIndex = Math.floor(Math.random() * RANDOM_BIOS.length);
        setBio(RANDOM_BIOS[randomIndex]);
    };

    const SelectionGrid = ({ title, icon, items, selectedItem, onSelect, errorCondition }: { title: string, icon: React.ReactElement, items: string[], selectedItem: string, onSelect: (item: any) => void, errorCondition: boolean }) => (
         <div>
            <h2 className={`text-lg font-bold text-gray-300 mb-3 flex items-center gap-2 ${errorCondition && !selectedItem ? 'text-red-500 animate-pulse' : ''}`}>{icon} {title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {items.map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => { onSelect(item); setError(''); }}
                        className={`p-3 border-2 rounded-lg text-center transition-all duration-200 ${selectedItem === item ? 'bg-red-800/40 border-red-500 scale-105' : 'bg-gray-700/50 border-gray-600 hover:border-red-600 hover:bg-gray-700'}`}
                    >
                       {item}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-gray-900 text-gray-300 min-h-screen flex flex-col items-center justify-center p-4 selection:bg-red-900/50 selection:text-white">
            <div className="w-full max-w-4xl bg-gray-800/50 border border-gray-700 rounded-lg shadow-2xl p-8 backdrop-blur-sm animate-fadeIn">
                <h1 className="text-4xl font-title text-red-500 text-center mb-2">Rèn Đúc Linh Hồn</h1>
                <p className="text-center text-gray-400 mb-8">Ngươi là ai, mà dám thách thức bóng tối?</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className={`text-lg font-bold text-gray-300 flex items-center gap-2 mb-2 ${error && !name.trim() ? 'text-red-500 animate-pulse' : ''}`}><IconUser /> Tên</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError(''); }}
                            placeholder="Nhập tên nhân vật của bạn"
                            className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="bio" className="text-lg font-bold text-gray-300 flex items-center gap-2"><IconBookOpen /> Tiểu Sử (Tùy chọn)</label>
                            <button 
                                type="button" 
                                onClick={handleRandomBio}
                                className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
                            >
                                <IconShuffle />
                                Ngẫu nhiên
                            </button>
                        </div>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Một lịch sử ngắn gọn về cuộc đời bạn trước khi hoang tàn... hoặc nhấp vào nút ngẫu nhiên."
                            rows={3}
                            className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                        />
                    </div>
                    
                    <div>
                        <h2 className={`text-lg font-bold text-gray-300 mb-3 flex items-center gap-2 ${error && !selectedClass ? 'text-red-500 animate-pulse' : ''}`}><IconShield /> Chọn Lớp Nhân Vật Của Bạn</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(Object.keys(CLASSES) as CharacterClass[]).map((className) => (
                                <button
                                    key={className}
                                    type="button"
                                    onClick={() => { setSelectedClass(className); setError(''); }}
                                    className={`p-4 border-2 rounded-lg text-left transition-all duration-200 h-full flex flex-col ${selectedClass === className ? 'bg-red-800/40 border-red-500 scale-105' : 'bg-gray-700/50 border-gray-600 hover:border-red-600 hover:bg-gray-700'}`}
                                >
                                    <h3 className="font-title text-xl text-red-400">{className}</h3>
                                    <p className="text-sm text-gray-400 mt-1 flex-grow">{CLASSES[className].description}</p>
                                    
                                    <div className="mt-4 pt-2 border-t border-gray-600/50 space-y-3 text-xs">
                                        <div>
                                            <h4 className="font-bold flex items-center gap-1 text-green-400"><IconThumbsUp /> Điểm Mạnh</h4>
                                            <ul className="list-disc list-inside text-gray-300 pl-2">
                                                {CLASSES[className].strengths.map((strength, i) => (
                                                    <li key={i}>{strength}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-bold flex items-center gap-1 text-red-400"><IconThumbsDown /> Điểm Yếu</h4>
                                            <ul className="list-disc list-inside text-gray-300 pl-2">
                                                {CLASSES[className].weaknesses.map((weakness, i) => (
                                                    <li key={i}>{weakness}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <SelectionGrid title="Chọn Giới Tính" icon={<IconUsers />} items={Object.values(GENDERS)} selectedItem={selectedGender!} onSelect={setSelectedGender} errorCondition={!!error} />
                         <SelectionGrid title="Chọn Tính Cách" icon={<IconSmile />} items={PERSONALITIES} selectedItem={selectedPersonality} onSelect={setSelectedPersonality} errorCondition={!!error} />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-gray-300 mb-3 flex items-center gap-2">
                            <IconCompass /> Mục Tiêu Của Bạn (Tùy chọn)
                        </h2>
                        <div className="flex items-center gap-4 p-4 bg-gray-700/50 border-2 border-gray-600 rounded-lg">
                            <div className="flex-grow">
                                {selectedGoal ? (
                                    <p className="text-white text-lg italic">"{selectedGoal}"</p>
                                ) : (
                                    <p className="text-gray-400">Bạn có thể bắt đầu mà không có mục tiêu rõ ràng, để số phận dẫn lối.</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const randomIndex = Math.floor(Math.random() * GOALS.length);
                                        setSelectedGoal(GOALS[randomIndex]);
                                        setError('');
                                    }}
                                    className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                    title="Tìm một mục tiêu ngẫu nhiên"
                                >
                                    <IconShuffle />
                                    {selectedGoal ? 'Mục Tiêu Khác' : 'Tìm Mục Tiêu'}
                                </button>
                                {selectedGoal && (
                                    <button
                                        type="button"
                                        onClick={() => setSelectedGoal('')}
                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                        title="Xóa mục tiêu"
                                    >
                                        <IconX size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className={`text-lg font-bold text-gray-300 mb-3 flex items-center gap-2 ${error && !selectedDifficulty ? 'text-red-500 animate-pulse' : ''}`}><IconBarChart2 /> Chọn Độ Khó</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(Object.keys(DIFFICULTIES) as Difficulty[]).map((difficultyName) => (
                                <button
                                    key={difficultyName}
                                    type="button"
                                    onClick={() => { setSelectedDifficulty(difficultyName); setError(''); }}
                                    className={`p-4 border-2 rounded-lg text-left transition-all duration-200 h-full flex flex-col ${selectedDifficulty === difficultyName ? 'bg-red-800/40 border-red-500 scale-105' : 'bg-gray-700/50 border-gray-600 hover:border-red-600 hover:bg-gray-700'}`}
                                >
                                    <h3 className="font-title text-xl text-red-400">{difficultyName}</h3>
                                    <p className="text-sm text-gray-400 mt-1">{DIFFICULTIES[difficultyName].description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {error && <p className="text-red-500 text-center font-bold animate-pulse">{error}</p>}

                    <div className="pt-4 text-center">
                        <button
                            type="submit"
                            disabled={!name || !selectedClass || !selectedDifficulty || !selectedGender || !selectedPersonality}
                            className="bg-red-700 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-10 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-[0_0_20px_rgba(220,38,38,0.7)]"
                        >
                            Bắt Đầu Hành Trình
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CharacterCreationScreen;
