

import React from 'react';
import { PlayerState } from '../types';
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


interface PlayerStatsPanelProps {
    playerState: PlayerState;
}

const PlayerStatsPanel: React.FC<PlayerStatsPanelProps> = ({ playerState }) => {
    const hpPercentage = playerState.maxHp > 0 ? Math.min(100, (playerState.hp / playerState.maxHp) * 100) : 0;
    const staminaPercentage = playerState.maxStamina > 0 ? Math.min(100, (playerState.stamina / playerState.maxStamina) * 100) : 0;
    const manaPercentage = playerState.maxMana > 0 ? Math.min(100, (playerState.mana / playerState.maxMana) * 100) : 0;
    const sanityPercentage = playerState.maxSanity > 0 ? Math.min(100, (playerState.sanity / playerState.maxSanity) * 100) : 0;

    const attackBonus = playerState.attack - playerState.baseAttack;
    const defenseBonus = playerState.defense - playerState.baseDefense;

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-gray-700 backdrop-blur-sm">
            <h2 className="text-xl font-title text-red-400 mb-4 border-b-2 border-red-500/30 pb-2">Trạng Thái Của Bạn</h2>
            
            <div className="space-y-4">
                {/* Top Section: Name/Class and Body Figure */}
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-200">
                            <IconUser /> 
                            <span>{playerState.name}</span>
                            {playerState.isMarked && (
                                <span title="Dấu Hiệu Tế Thần: Bạn bị săn đuổi. Sức mạnh tăng lên từ sự tuyệt vọng.">
                                    <IconMarkOfSacrifice className="w-6 h-6 text-red-500 animate-pulse" />
                                </span>
                            )}
                        </h3>
                        <p className="text-lg font-semibold font-title text-red-300 mt-1">{playerState.class}</p>
                    </div>
                    <div className="flex-shrink-0">
                        <BodyStatusFigure bodyStatus={playerState.bodyStatus} />
                    </div>
                </div>

                {/* Stat Bars */}
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-gray-200 flex items-center gap-2"><IconHeart className="text-red-500"/> Máu</span>
                            <span className="text-sm font-mono bg-gray-700 px-2 py-1 rounded">{playerState.hp} / {playerState.maxHp}</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-4 border border-gray-500">
                            <div
                                className="bg-red-600 h-full rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${hpPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-gray-200 flex items-center gap-2"><IconZap className="text-blue-500"/> Thể Lực</span>
                            <span className="text-sm font-mono bg-gray-700 px-2 py-1 rounded">{playerState.stamina} / {playerState.maxStamina}</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-4 border border-gray-500">
                            <div
                                className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${staminaPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-gray-200 flex items-center gap-2"><IconSparkSpirit className="text-purple-500"/> Mana</span>
                            <span className="text-sm font-mono bg-gray-700 px-2 py-1 rounded">{playerState.mana} / {playerState.maxMana}</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-4 border border-gray-500">
                            <div
                                className="bg-purple-600 h-full rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${manaPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-gray-200 flex items-center gap-2"><IconBrain className="text-cyan-500"/> Tâm Trí</span>
                            <span className="text-sm font-mono bg-gray-700 px-2 py-1 rounded">{playerState.sanity} / {playerState.maxSanity}</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-4 border border-gray-500">
                            <div
                                className="bg-cyan-600 h-full rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${sanityPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
                
                {/* Sub-stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-700/50 p-2 rounded-md">
                        <span className="font-bold text-gray-300 flex items-center justify-center gap-2 text-sm"><IconTrendingUp /> Tấn Công</span>
                        <span className="text-lg font-mono text-white">
                            {playerState.attack}
                            {attackBonus !== 0 && <span className={attackBonus > 0 ? "text-green-400 text-sm ml-1" : "text-red-400 text-sm ml-1"}>({attackBonus > 0 ? `+${attackBonus}` : attackBonus})</span>}
                        </span>
                    </div>
                    <div className="bg-gray-700/50 p-2 rounded-md">
                        <span className="font-bold text-gray-300 flex items-center justify-center gap-2 text-sm"><IconShield /> Phòng Thủ</span>
                         <span className="text-lg font-mono text-white">
                            {playerState.defense}
                            {defenseBonus !== 0 && <span className={defenseBonus > 0 ? "text-green-400 text-sm ml-1" : "text-red-400 text-sm ml-1"}>({defenseBonus > 0 ? `+${defenseBonus}` : defenseBonus})</span>}
                        </span>
                    </div>
                    <div className="bg-gray-700/50 p-2 rounded-md">
                        <span className="font-bold text-gray-300 flex items-center justify-center gap-2 text-sm"><IconBrokenHeart className="text-yellow-400" /> Hồn</span>
                        <span className="text-lg font-mono text-white">{playerState.currency}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerStatsPanel;