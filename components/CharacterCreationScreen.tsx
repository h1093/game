
import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Origin, Difficulty, Gender } from '../types';
import { ORIGINS, DIFFICULTIES, GENDERS, PERSONALITIES, GOALS, DIFFICULTY_POINT_BUY, BASE_STATS_BEFORE_POINT_BUY, PERSONALITY_NAMES } from '../constants';

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
const IconSpinner = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
const IconBarChart2 = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
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
const IconEye = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);


interface CharacterCreationScreenProps {
    onCharacterCreate: (details: { name: string; bio: string; origin: Origin; difficulty: Difficulty; gender: Gender; personality: string; goal: string; finalStats: any }, isCreatorsWill?: boolean) => void;
    activeApiKey: string | undefined;
    onGoToCreatorsWill: () => void;
}

type StatKey = keyof typeof BASE_STATS_BEFORE_POINT_BUY;

const CharacterCreationScreen: React.FC<CharacterCreationScreenProps> = ({ onCharacterCreate, activeApiKey, onGoToCreatorsWill }) => {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [selectedOrigin, setSelectedOrigin] = useState<Origin | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
    const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
    const [selectedPersonality, setSelectedPersonality] = useState<string>('');
    const [selectedGoal, setSelectedGoal] = useState<string>('');
    const [error, setError] = useState('');
    const [isBioLoading, setIsBioLoading] = useState(false);
    
    const [points, setPoints] = useState<Record<StatKey, number>>({
        baseMaxHp: 0, baseMaxStamina: 0, baseMaxMana: 0, baseMaxSanity: 0, baseAttack: 0, baseDefense: 0, baseCharisma: 0,
    });
    
    const totalPoints = useMemo(() => {
        return selectedDifficulty ? DIFFICULTY_POINT_BUY[selectedDifficulty] : 0;
    }, [selectedDifficulty]);
    
    const pointsSpent = useMemo(() => Object.values(points).reduce((sum, val) => sum + val, 0), [points]);
    const pointsRemaining = totalPoints - pointsSpent;

    const finalStats = useMemo(() => {
        const calculatedStats = { ...BASE_STATS_BEFORE_POINT_BUY };
        let originBonuses: any = {};
        if (selectedOrigin) {
            originBonuses = ORIGINS[selectedOrigin].bonuses;
        }

        (Object.keys(calculatedStats) as StatKey[]).forEach(key => {
            const pointValue = points[key] * (key.includes('Max') ? 5 : 1);
            const bonusValueRaw = originBonuses[key];
            // Ensure we only add numeric bonuses here. Proficiency is handled separately.
            const bonusValue = typeof bonusValueRaw === 'number' ? bonusValueRaw : 0;
            calculatedStats[key] += pointValue + bonusValue;
        });

        return calculatedStats;
    }, [points, selectedOrigin]);


    const handlePointChange = (stat: StatKey, delta: number) => {
        if (!selectedDifficulty) return;
        const currentPointsForStat = points[stat];
        if (delta > 0 && pointsRemaining > 0) {
            setPoints(prev => ({ ...prev, [stat]: prev[stat] + delta }));
        } else if (delta < 0 && currentPointsForStat > 0) {
            setPoints(prev => ({ ...prev, [stat]: prev[stat] + delta }));
        }
    };

    const handleDifficultySelect = (difficulty: Difficulty) => {
        const newTotalPoints = DIFFICULTY_POINT_BUY[difficulty];
        const currentPointsSpent = Object.values(points).reduce((sum, val) => sum + val, 0);

        if (currentPointsSpent > newTotalPoints) {
            setPoints({
                baseMaxHp: 0, baseMaxStamina: 0, baseMaxMana: 0, baseMaxSanity: 0, baseAttack: 0, baseDefense: 0, baseCharisma: 0,
            });
        }
        setSelectedDifficulty(difficulty);
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) { setError('Nhân vật của bạn phải có tên.'); return; }
        if (!selectedOrigin) { setError('Bạn phải chọn một Nguồn Gốc.'); return; }
        if (!selectedGender) { setError('Hãy chọn giới tính.'); return; }
        if (!selectedPersonality) { setError('Hãy chọn một tính cách.'); return; }
        if (!selectedDifficulty) { setError('Bạn phải chọn một độ khó.'); return; }
        
        const characterDetails = {
            name, bio, origin: selectedOrigin, difficulty: selectedDifficulty, 
            gender: selectedGender, personality: selectedPersonality, goal: selectedGoal,
            finalStats: { ...finalStats } // Pass calculated final stats
        };
        onCharacterCreate(characterDetails, false);
    };

    const handleRandomBio = async () => {
        if (!selectedOrigin || !selectedPersonality) {
            setError('Vui lòng chọn Nguồn Gốc và Tính cách trước khi tạo tiểu sử ngẫu nhiên.');
            return;
        }
        if (!activeApiKey) {
            setError('API Key không hoạt động. Vui lòng cấu hình trong menu chính.');
            return;
        }

        setIsBioLoading(true);
        setError('');
        setBio('');

        try {
            const ai = new GoogleGenAI({ apiKey: activeApiKey });
            const prompt = `Bạn là một người viết truyện cho một game nhập vai kỳ ảo hắc ám.
Hãy viết một tiểu sử ngắn gọn, độc đáo và đầy không khí (khoảng 2-3 câu) cho một nhân vật.
- **Nguồn gốc**: ${selectedOrigin}
- **Tính cách**: ${selectedPersonality}
- **Yêu cầu**: Tiểu sử phải phản ánh cả nguồn gốc và tính cách trong một thế giới tàn khốc, tuyệt vọng. Giọng văn phải u ám, nghiêm túc và gợi mở. Không dùng ngôi thứ nhất (không dùng "tôi", "tôi đã"). Chỉ trả lời bằng nội dung tiểu sử, không có lời dẫn hay các câu như "Đây là tiểu sử cho bạn:".`;
            
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setBio(response.text.trim());
        } catch (error) {
            console.error("Lỗi khi tạo tiểu sử:", error);
            setError("Không thể tạo tiểu sử. Đã xảy ra lỗi với AI.");
        } finally {
            setIsBioLoading(false);
        }
    };

    const SelectionGrid = ({ title, icon, items, selectedItem, onSelect, errorCondition, disabled = false }: { title: string, icon: React.ReactElement, items: string[], selectedItem: string | null, onSelect: (item: any) => void, errorCondition: boolean, disabled?: boolean }) => (
         <div>
            <h3 className={`text-lg font-bold text-gray-300 mb-3 flex items-center gap-2 ${errorCondition && !selectedItem ? 'text-red-500 animate-pulse' : ''}`}>{icon} {title}</h3>
            <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${disabled ? 'opacity-50' : ''}`}>
                {items.map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => { if (!disabled) onSelect(item); }}
                        disabled={disabled}
                        className={`p-3 border-2 rounded-lg text-center transition-all duration-200 ${selectedItem === item ? 'bg-red-800/40 border-red-500 scale-105' : 'bg-gray-700/50 border-gray-600'} ${!disabled ? 'hover:border-red-600 hover:bg-gray-700' : 'cursor-not-allowed'}`}
                    >
                       {item}
                    </button>
                ))}
            </div>
        </div>
    );
    
    const StatPointAllocator = ({ label, statKey }: { label: string, statKey: StatKey }) => {
        const pointValue = points[statKey];
        const baseValue = BASE_STATS_BEFORE_POINT_BUY[statKey];
        const originBonusRaw = selectedOrigin ? ORIGINS[selectedOrigin].bonuses[statKey as keyof typeof ORIGINS[Origin]['bonuses']] : 0;
        const originBonus = typeof originBonusRaw === 'number' ? originBonusRaw : 0;
        const totalValue = baseValue + (pointValue * (statKey.includes('Max') ? 5 : 1)) + originBonus;
        
        const isPointBuyDisabled = !selectedDifficulty;

        return (
            <div className={`flex items-center justify-between p-2 rounded-lg ${isPointBuyDisabled ? 'bg-gray-800/20' : 'bg-gray-800/50'}`}>
                <span className="font-semibold text-gray-300">{label}</span>
                <div className="flex items-center gap-2">
                    <button type="button" onClick={() => handlePointChange(statKey, -1)} disabled={isPointBuyDisabled || pointValue === 0} className="w-7 h-7 bg-red-800 hover:bg-red-700 rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed">-</button>
                    <span className="font-mono w-20 text-center">
                       <span className="text-white text-lg">{totalValue}</span>
                       {originBonus !== 0 && <span className={originBonus > 0 ? "text-green-400 text-xs ml-1" : "text-red-400 text-xs ml-1"}>({originBonus > 0 ? `+${originBonus}` : originBonus})</span>}
                    </span>
                    <button type="button" onClick={() => handlePointChange(statKey, 1)} disabled={isPointBuyDisabled || pointsRemaining <= 0} className="w-7 h-7 bg-green-800 hover:bg-green-700 rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed">+</button>
                </div>
            </div>
        );
    };

    return (
         <div className="bg-gray-900 text-gray-300 min-h-screen flex items-center justify-center p-4 selection:bg-red-900/50 selection:text-white">
            <div className="w-full max-w-6xl mx-auto">
                <h1 className="text-5xl font-title text-center text-red-500 mb-8">Tạo Dựng Linh Hồn</h1>
                
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* ----- Left Column: Choices ----- */}
                        <div className="space-y-6 bg-gray-800/30 p-6 rounded-lg border border-gray-700">
                           {/* Name Input */}
                           <div>
                                <label htmlFor="name" className="text-lg font-bold text-gray-300 mb-3 flex items-center gap-2"><IconUser/> Tên Nhân Vật</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                                    placeholder="Một cái tên bị lãng quên..."
                                    required
                                />
                            </div>

                            {/* Bio Input */}
                            <div>
                                <label htmlFor="bio" className="text-lg font-bold text-gray-300 mb-3 flex items-center gap-2"><IconBookOpen /> Tiểu Sử</label>
                                <div className="relative">
                                    <textarea
                                        id="bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        rows={4}
                                        className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                                        placeholder="Những mảnh vỡ của một cuộc đời đã qua..."
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRandomBio}
                                        disabled={isBioLoading || !selectedOrigin || !selectedPersonality || !activeApiKey}
                                        className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-xs font-bold py-1 px-2 rounded-md transition-colors"
                                        title={!selectedOrigin || !selectedPersonality ? "Chọn Nguồn Gốc và Tính cách trước" : "Tạo tiểu sử ngẫu nhiên bằng AI"}
                                    >
                                        {isBioLoading ? <IconSpinner /> : <IconShuffle className="w-4 h-4" />} Ngẫu nhiên
                                    </button>
                                </div>
                            </div>

                            {/* Selections */}
                             <div>
                                <h3 className={`text-lg font-bold text-gray-300 mb-3 flex items-center gap-2 ${!selectedOrigin ? 'text-red-500 animate-pulse' : ''}`}><IconUsers/> Nguồn Gốc</h3>
                                <div className={`grid grid-cols-2 md:grid-cols-3 gap-3`}>
                                    {(Object.keys(ORIGINS) as Origin[]).map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => setSelectedOrigin(item)}
                                            className={`p-3 border-2 rounded-lg text-center transition-all duration-200 ${selectedOrigin === item ? 'bg-red-800/40 border-red-500 scale-105' : 'bg-gray-700/50 border-gray-600'} hover:border-red-600 hover:bg-gray-700`}
                                        >
                                           {item}
                                        </button>
                                    ))}
                                </div>
                                {selectedOrigin && (
                                    <div className="mt-4 p-4 bg-gray-900/50 rounded-md border border-gray-700 animate-fadeIn">
                                        <p className="text-gray-400 italic">{ORIGINS[selectedOrigin].description}</p>
                                    </div>
                                )}
                            </div>
                             <SelectionGrid title="Giới Tính" icon={<IconUser/>} items={Object.keys(GENDERS)} selectedItem={selectedGender} onSelect={item => setSelectedGender(item)} errorCondition={!selectedGender} />
                             <div>
                                <h3 className={`text-lg font-bold text-gray-300 mb-3 flex items-center gap-2 ${!selectedPersonality ? 'text-red-500 animate-pulse' : ''}`}><IconSmile/> Tính Cách</h3>
                                <div className={`grid grid-cols-2 md:grid-cols-3 gap-3`}>
                                    {PERSONALITY_NAMES.map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => setSelectedPersonality(item)}
                                            className={`p-3 border-2 rounded-lg text-center transition-all duration-200 ${selectedPersonality === item ? 'bg-red-800/40 border-red-500 scale-105' : 'bg-gray-700/50 border-gray-600'} hover:border-red-600 hover:bg-gray-700`}
                                        >
                                           {item}
                                        </button>
                                    ))}
                                </div>
                                {selectedPersonality && PERSONALITIES[selectedPersonality] && (
                                    <div className="mt-4 p-4 bg-gray-900/50 rounded-md border border-gray-700 animate-fadeIn">
                                        <p className="text-gray-300 italic mb-2">{PERSONALITIES[selectedPersonality].description}</p>
                                        <p className="text-green-400 text-sm"><span className="font-bold">Tích cực:</span> {PERSONALITIES[selectedPersonality].effects.positive}</p>
                                        <p className="text-red-400 text-sm"><span className="font-bold">Tiêu cực:</span> {PERSONALITIES[selectedPersonality].effects.negative}</p>
                                    </div>
                                )}
                            </div>
                             <SelectionGrid title="Mục Tiêu" icon={<IconCompass/>} items={GOALS} selectedItem={selectedGoal} onSelect={item => setSelectedGoal(item)} errorCondition={false} />
                        </div>

                        {/* ----- Right Column: Difficulty, Stats ----- */}
                        <div className="space-y-6 bg-gray-800/30 p-6 rounded-lg border border-gray-700">
                             <div>
                                <h3 className={`text-lg font-bold text-gray-300 mb-3 flex items-center gap-2 ${!selectedDifficulty ? 'text-red-500 animate-pulse' : ''}`}><IconShield/> Độ Khó</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {(Object.keys(DIFFICULTIES) as Difficulty[]).map((diff) => (
                                        <button
                                            key={diff}
                                            type="button"
                                            onClick={() => handleDifficultySelect(diff)}
                                            className={`p-3 border-2 rounded-lg text-center transition-all duration-200 ${selectedDifficulty === diff ? 'bg-red-800/40 border-red-500 scale-105' : 'bg-gray-700/50 border-gray-600'} hover:border-red-600 hover:bg-gray-700`}
                                            title={DIFFICULTIES[diff].description}
                                        >
                                           {diff}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Point Buy System */}
                            <div className="pt-6 border-t border-gray-700 space-y-2">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-bold text-gray-300 flex items-center gap-2"><IconBarChart2/> Phân Bổ Điểm</h3>
                                    <div className="text-center">
                                        <span className="text-2xl font-mono font-bold text-yellow-400">{selectedDifficulty ? pointsRemaining : 'N/A'}</span>
                                        <p className="text-xs text-gray-400">Điểm còn lại</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <StatPointAllocator label="Máu" statKey="baseMaxHp" />
                                    <StatPointAllocator label="Thể Lực" statKey="baseMaxStamina" />
                                    <StatPointAllocator label="Mana" statKey="baseMaxMana" />
                                    <StatPointAllocator label="Tâm Trí" statKey="baseMaxSanity" />
                                    <StatPointAllocator label="Tấn Công" statKey="baseAttack" />
                                    <StatPointAllocator label="Phòng Thủ" statKey="baseDefense" />
                                    <StatPointAllocator label="Sức Hấp Dẫn" statKey="baseCharisma" />
                                </div>
                                {!selectedDifficulty && (
                                    <p className="text-center text-yellow-400/80 text-sm mt-2">Vui lòng chọn độ khó để phân bổ điểm.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {error && <p className="text-red-500 text-center font-bold mt-6">{error}</p>}
                    
                    <div className="mt-8 text-center">
                        <button type="submit" className="bg-red-700 hover:bg-red-600 text-white font-bold py-4 px-12 rounded-lg text-2xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.7)]">
                            Bắt Đầu Hành Trình
                        </button>
                    </div>
                </form>

                 <div className="text-center mt-6 border-t border-gray-700/50 pt-6">
                    <button 
                        onClick={onGoToCreatorsWill} 
                        className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors flex items-center gap-2 mx-auto"
                        title="Bước vào Chế độ Thần Thánh"
                    >
                        <IconEye />
                        <span>Bước vào con đường của một vị thần...</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CharacterCreationScreen;
