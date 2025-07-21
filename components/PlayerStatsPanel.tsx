

import React from 'react';
import { PlayerState, Appearance } from '../types';
import BodyStatusFigure from './BodyStatusFigure';

// SVG Icons
const IconHeart = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);

const IconUser = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const IconShield = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

const IconTrendingUp = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

const IconZap = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
);

const IconBrokenHeart = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        <path d="m15 11-1-1-1 1-1-1-1 1-1-1-1 1-2-2"></path>
    </svg>
);

const IconSparkSpirit = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M10 3L8 8l-5 2 5 2 2 5 2-5 5-2-5-2-2-5zM21 13l-1.5 3-3 1.5 3 1.5 1.5 3 1.5-3 3-1.5-3-1.5-1.5-3z"/>
    </svg>
);

const IconBrain = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.94.39 2.5 2.5 0 0 1-2.06-2.43V6.5A2.5 2.5 0 0 1 7.5 4h1a2.5 2.5 0 0 1 1-2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.94.39 2.5 2.5 0 0 0 2.06-2.43V6.5A2.5 2.5 0 0 0 16.5 4h-1a2.5 2.5 0 0 0-1-2Z"/></svg>
);

const IconMarkOfSacrifice = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 3c-1.8.4-3.3 1.2-4.5 2.4-2.4 2.4-3.6 5.6-3.4 9.1.2 4.1 2.3 7.8 5.7 10.1 1.7 1.1 3.5 1.4 5.2.4"/>
        <path d="M12 3c1.8.4 3.3 1.2 4.5 2.4 2.4 2.4 3.6 5.6 3.4 9.1-.2 4.1-2.3 7.8-5.7 10.1-1.7 1.1-3.5 1.4-5.2.4"/>
        <path d="M12 3v18"/>
        <path d="M8 12h8"/>
    </svg>
);

const IconHeartOff = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12.83 3.42a1 1 0 0 0-1.66 0C6.63 8.33 3 11.23 3 14.5A5.5 5.5 0 0 0 8.5 20a5.42 5.42 0 0 0 3.5-1.42A5.42 5.42 0 0 0 15.5 20a5.5 5.5 0 0 0 5.5-5.5c0-3.27-3.63-6.17-8.17-11.08z" />
        <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
);


const IconMeat = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.23 4.23 18.5 8.5C19.94 9.94 21.96 11.23 22 13c.03 1.34-1.02 2.52-2.34 2.66A20.61 20.61 0 0 1 14 16c-2.4 0-4.6.4-6.5 1.18-1.3.52-2.6-1.18-1.68-2.36.94-1.12 2.4-2.4 2.4-3.82 0-1.28-1-2.5-1-3.5S5.4 4.8 7 4.1c1-.44 2.24-.52 3.27-.16.9.33 1.5 1.03 2.23 1.76.73.73 1.76 1.5 1.73 2.23Z"/><path d="m14.23 4.23.5-.5c.79-.79 2.07-.79 2.86 0 .79.79.79 2.07 0 2.86l-.5.5"/></svg>
);

const IconDroplet = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>
);

const IconMasks = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 8h.01"/><path d="M16 8h.01"/><path d="M12 16a4 4 0 0 1-4-4"/><path d="M9 22h6"/><path d="M12 18v4"/><path d="M6 18h.01"/><path d="M18 18h.01"/><path d="M18 11.5c-2.33 2.33-2.33 6.17 0 8.5"/><path d="M6 11.5c2.33 2.33 2.33 6.17 0 8.5"/><path d="M12 2a4 4 0 0 0-4 4c0 1.5.67 3.33 2 5"/><path d="M12 2a4 4 0 0 1 4 4c0 1.5-.67 3.33-2 5"/></svg>
);
const IconFlag = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
);
const IconShirt = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
);

interface PlayerStatsPanelProps {
    playerState: PlayerState;
}

const StatBar = ({ label, icon, value, max, percentage, colorClass }: { label: string, icon: React.ReactNode, value: number, max: number, percentage: number, colorClass: string }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-gray-200 flex items-center gap-2 text-sm">{icon} {label}</span>
            <span className="text-xs font-mono bg-gray-700 px-2 py-0.5 rounded">{value}/{max}</span>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-3 border border-gray-500">
            <div
                className={`${colorClass} h-full rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    </div>
);

const SubStat = ({ label, icon, value, bonus }: { label: string, icon: React.ReactNode, value: number, bonus?: number }) => (
     <div className="bg-gray-700/50 p-2 rounded-md">
        <span className="font-bold text-gray-300 flex items-center justify-center gap-1 text-sm">{icon} {label}</span>
        <span className="text-lg font-mono text-white">
            {value}
            {bonus !== undefined && bonus !== 0 && <span className={bonus > 0 ? "text-green-400 text-xs ml-1" : "text-red-400 text-xs ml-1"}>({bonus > 0 ? `+${bonus}` : bonus})</span>}
        </span>
    </div>
);

const getReputationText = (rep: number): { text: string; color: string } => {
    if (rep > 50) return { text: "Thần Tượng", color: "text-cyan-400" };
    if (rep > 20) return { text: "Được Tôn Trọng", color: "text-green-400" };
    if (rep >= -20) return { text: "Trung Lập", color: "text-gray-300" };
    if (rep >= -50) return { text: "Bị Ghét Bỏ", color: "text-yellow-400" };
    return { text: "Bị Nguyền Rủa", color: "text-red-500" };
};

const getAppearanceText = (appearance: Appearance): string => {
    switch (appearance) {
        case 'CLEAN': return "Sạch Sẽ";
        case 'DIRTY': return "Bẩn Thỉu";
        case 'BLOODY': return "Đầy Máu";
        case 'WELL_DRESSED': return "Lịch Lãm";
        case 'IN_RAGS': return "Rách Rưới";
        default: return "Không xác định";
    }
};

const PlayerStatsPanel: React.FC<PlayerStatsPanelProps> = ({ playerState }) => {
    const hpPercentage = playerState.maxHp > 0 ? Math.min(100, (playerState.hp / playerState.maxHp) * 100) : 0;
    const staminaPercentage = playerState.maxStamina > 0 ? Math.min(100, (playerState.stamina / playerState.maxStamina) * 100) : 0;
    const manaPercentage = playerState.maxMana > 0 ? Math.min(100, (playerState.mana / playerState.maxMana) * 100) : 0;
    const sanityPercentage = playerState.maxSanity > 0 ? Math.min(100, (playerState.sanity / playerState.maxSanity) * 100) : 0;
    const hungerPercentage = playerState.maxHunger > 0 ? Math.min(100, (playerState.hunger / playerState.maxHunger) * 100) : 0;
    const thirstPercentage = playerState.maxThirst > 0 ? Math.min(100, (playerState.thirst / playerState.maxThirst) * 100) : 0;

    const attackBonus = playerState.attack - playerState.baseAttack;
    const defenseBonus = playerState.defense - playerState.baseDefense;
    const charismaBonus = playerState.charisma - playerState.baseCharisma;
    
    const reputationInfo = getReputationText(playerState.reputation);

    return (
        <div>
            <h2 className="text-xl font-title text-red-400 mb-4 border-b-2 border-red-500/30 pb-2">Trạng Thái Của Bạn</h2>
            
            <div className="space-y-4">
                {/* Top Section: Name/Class and Body Figure */}
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-200">
                            <IconUser /> 
                            <span>{playerState.name}</span>
                            {playerState.isMarked && (
                                <span title="Dấu Hiệu Tế Thần: Bị săn đuổi. (+1 Tấn công, -15 Tâm trí tối đa, -5 Sức hấp dẫn)">
                                    <IconMarkOfSacrifice className="w-6 h-6 text-red-500 animate-pulse" />
                                </span>
                            )}
                            {playerState.hasSuccubusPact && (
                                <span title="Giao Ước Đen Tối: Sức hấp dẫn chết người với cái giá là sự tỉnh táo. (+10 Sức hấp dẫn, -20 Tâm trí tối đa. +5 Tấn công khi tâm trí thấp. Không thể tăng Uy tín).">
                                    <IconHeartOff className="w-6 h-6 text-fuchsia-500 animate-pulse" />
                                </span>
                            )}
                        </h3>
                        <p className="text-lg font-semibold font-title text-red-300 mt-1">{playerState.class}</p>
                    </div>
                    <div className="flex-shrink-0">
                        <BodyStatusFigure bodyStatus={playerState.bodyStatus} />
                    </div>
                </div>

                {/* Stat Bars in a 2-column grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <StatBar label="Máu" icon={<IconHeart className="text-red-500"/>} value={playerState.hp} max={playerState.maxHp} percentage={hpPercentage} colorClass="bg-red-600" />
                    <StatBar label="Thể Lực" icon={<IconZap className="text-blue-500"/>} value={playerState.stamina} max={playerState.maxStamina} percentage={staminaPercentage} colorClass="bg-blue-500" />
                    <StatBar label="Mana" icon={<IconSparkSpirit className="text-purple-500"/>} value={playerState.mana} max={playerState.maxMana} percentage={manaPercentage} colorClass="bg-purple-600" />
                    <StatBar label="Tâm Trí" icon={<IconBrain className="text-cyan-500"/>} value={playerState.sanity} max={playerState.maxSanity} percentage={sanityPercentage} colorClass="bg-cyan-600" />
                    <StatBar label="Cơn Đói" icon={<IconMeat className="text-orange-400"/>} value={playerState.hunger} max={playerState.maxHunger} percentage={hungerPercentage} colorClass="bg-orange-500" />
                    <StatBar label="Cơn Khát" icon={<IconDroplet className="text-sky-400"/>} value={playerState.thirst} max={playerState.maxThirst} percentage={thirstPercentage} colorClass="bg-sky-500" />
                </div>
                
                {/* Sub-stats in a 2x2 grid */}
                <div className="grid grid-cols-2 gap-2 text-center">
                   <SubStat label="Tấn Công" icon={<IconTrendingUp />} value={playerState.attack} bonus={attackBonus} />
                   <SubStat label="Phòng Thủ" icon={<IconShield />} value={playerState.defense} bonus={defenseBonus} />
                   <SubStat label="Sức Hấp Dẫn" icon={<IconMasks className="w-4 h-4"/>} value={playerState.charisma} bonus={charismaBonus} />
                   <SubStat label="Hồn" icon={<IconBrokenHeart className="text-yellow-400 w-4 h-4" />} value={playerState.currency} />
                </div>

                {/* Social Stats */}
                 <div className="pt-3 border-t border-gray-700/50 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-gray-300 flex items-center gap-2"><IconFlag/> Uy Tín</span>
                        <span className={`font-bold ${reputationInfo.color}`}>{reputationInfo.text} ({playerState.reputation})</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-gray-300 flex items-center gap-2"><IconShirt/> Diện Mạo</span>
                        <span className="font-semibold text-gray-200">{getAppearanceText(playerState.appearance)}</span>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default PlayerStatsPanel;