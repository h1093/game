
import React from 'react';
import { PlayerState, Skill } from '../types';

// SVG Icons
const IconSparkSpirit = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 3L8 8l-5 2 5 2 2 5 2-5 5-2-5-2-2-5zM21 13l-1.5 3-3 1.5 3 1.5 1.5 3 1.5-3 3-1.5-3-1.5-1.5-3z"/></svg>
);
const IconZap = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);
const IconClock = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);


interface SkillBookPanelProps {
    playerState: PlayerState;
    onUseSkill: (skill: Skill) => void;
    isLoading: boolean;
}

const SkillBookPanel: React.FC<SkillBookPanelProps> = ({ playerState, onUseSkill, isLoading }) => {
    if (playerState.skills.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center italic py-4">Bạn chưa học được kỹ năng nào.</p>
            </div>
        );
    }
    
    return (
        <div className="flex-grow overflow-y-auto pr-2 -mr-4">
            <div className="flex flex-col gap-3">
                {playerState.skills.map((skill) => {
                    const cooldownTurns = playerState.skillCooldowns[skill.id] || 0;
                    const resourcePool = skill.costType === 'MANA' ? playerState.mana : playerState.stamina;
                    const hasEnoughResource = resourcePool >= skill.cost;
                    const isDisabled = isLoading || cooldownTurns > 0 || !hasEnoughResource;

                    let tooltip = `Loại: ${skill.type}\nThời gian hồi: ${skill.cooldown} lượt`;
                    if (!hasEnoughResource) {
                        tooltip += `\n(Không đủ ${skill.costType === 'MANA' ? 'Mana' : 'Thể lực'})`;
                    }
                    if (cooldownTurns > 0) {
                        tooltip += `\n(Đang hồi chiêu: ${cooldownTurns} lượt)`;
                    }

                    return (
                        <div key={skill.id} className="bg-gray-900/50 p-4 rounded-md border border-gray-700 flex items-center gap-4">
                            <div className="flex-grow">
                                <h3 className="text-lg font-bold text-red-300">{skill.name}</h3>
                                <p className="text-gray-400 mt-1">{skill.description}</p>
                                <p className="text-xs text-gray-500 mt-2 uppercase font-bold">{skill.type}</p>
                            </div>
                            <div className="flex-shrink-0">
                                <button
                                    onClick={() => onUseSkill(skill)}
                                    disabled={isDisabled}
                                    className="flex flex-col items-center justify-center gap-2 bg-gray-700 hover:bg-red-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:transform-none min-w-[90px]"
                                    title={tooltip}
                                >
                                    <span className="text-lg">Sử dụng</span>
                                    {cooldownTurns > 0 ? (
                                        <span className="font-mono text-sm font-bold text-gray-400 flex items-center gap-1">
                                            <IconClock /> {cooldownTurns}
                                        </span>
                                    ) : (
                                        skill.cost > 0 && (
                                            <span className={`font-mono text-sm font-bold flex items-center gap-1 ${hasEnoughResource ? (skill.costType === 'MANA' ? 'text-purple-300' : 'text-blue-300') : 'text-red-400'}`}>
                                                {skill.cost} {skill.costType === 'MANA' ? <IconSparkSpirit /> : <IconZap />}
                                            </span>
                                        )
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SkillBookPanel;
