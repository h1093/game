
import React from 'react';
import { Skill, PlayerState } from '../types';

// SVG Icons
const IconBookCover = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
);
const IconSparkSpirit = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 3L8 8l-5 2 5 2 2 5 2-5 5-2-5-2-2-5zM21 13l-1.5 3-3 1.5 3 1.5 1.5 3 1.5-3 3-1.5-3-1.5-1.5-3z"/></svg>
);
const IconZap = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);
const IconClock = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);


interface SkillsPanelProps {
    playerState: PlayerState;
    onUseSkill: (skill: Skill) => void;
    isLoading: boolean;
}

const SkillsPanel: React.FC<SkillsPanelProps> = ({ playerState, onUseSkill, isLoading }) => {
    return (
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-gray-700 backdrop-blur-sm">
            <h2 className="text-xl font-title text-red-400 mb-4 border-b-2 border-red-500/30 pb-2 flex items-center gap-2">
                <IconBookCover /> Kỹ Năng
            </h2>
            <div className="flex flex-col gap-3">
                {playerState.skills.length > 0 ? (
                    playerState.skills.map((skill) => {
                        const cooldownTurns = playerState.skillCooldowns[skill.id] || 0;
                        const resourcePool = skill.costType === 'MANA' ? playerState.mana : playerState.stamina;
                        const hasEnoughResource = resourcePool >= skill.cost;
                        const isDisabled = isLoading || cooldownTurns > 0 || !hasEnoughResource;

                        let title = `${skill.description}\n\nLoại: ${skill.type}\nThời gian hồi: ${skill.cooldown} lượt`;
                        if (!hasEnoughResource) {
                            title += `\n(Không đủ ${skill.costType === 'MANA' ? 'Mana' : 'Thể lực'})`;
                        }
                        if (cooldownTurns > 0) {
                            title += `\n(Đang hồi chiêu: ${cooldownTurns} lượt)`;
                        }

                        return (
                            <button
                                key={skill.id}
                                onClick={() => onUseSkill(skill)}
                                disabled={isDisabled}
                                className="flex items-center justify-between w-full text-left bg-gray-700 hover:bg-red-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:transform-none"
                                title={title}
                            >
                                <span className="flex-grow pr-2">{skill.name}</span>
                                <div className="flex items-center gap-3 flex-shrink-0">
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
                                </div>
                            </button>
                        );
                    })
                ) : (
                    <p className="text-sm text-gray-500 italic">Bạn chưa có kỹ năng nào.</p>
                )}
            </div>
        </div>
    );
};

export default SkillsPanel;