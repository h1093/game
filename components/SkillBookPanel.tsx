
import React from 'react';
import { PlayerState } from '../types';

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
}

const SkillBookPanel: React.FC<SkillBookPanelProps> = ({ playerState }) => {
    if (playerState.skills.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center italic py-4">Bạn chưa học được kỹ năng nào.</p>
            </div>
        );
    }
    
    return (
        <div className="flex-grow overflow-y-auto pr-2 -mr-4">
            <div className="flex flex-col gap-4">
                {playerState.skills.map((skill) => (
                    <div key={skill.id} className="bg-gray-900/50 p-4 rounded-md border border-gray-700">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-red-300">{skill.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-300">
                                <span className="flex items-center gap-1" title="Chi phí">
                                    {skill.cost} {skill.costType === 'MANA' ? <IconSparkSpirit className="text-purple-400" /> : <IconZap className="text-blue-400" />}
                                </span>
                                <span className="flex items-center gap-1" title="Thời gian hồi">
                                    <IconClock /> {skill.cooldown} lượt
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-400 mt-2">{skill.description}</p>
                        <p className="text-xs text-gray-500 mt-2 uppercase font-bold">{skill.type}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillBookPanel;