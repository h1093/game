import React from 'react';
import { NPC } from '../types';

interface NarrativePanelProps {
    narrative: string;
    combatLog: string[];
    isLoading: boolean;
    npcsInScene: NPC[];
}

const NarrativePanel: React.FC<NarrativePanelProps> = ({ narrative, combatLog, isLoading, npcsInScene }) => {
    return (
        <div className="bg-gray-800/50 p-6 rounded-lg shadow-inner border border-gray-700 max-h-[75vh] overflow-y-auto backdrop-blur-sm">
            {combatLog && combatLog.length > 0 && (
                <div className="mb-6 border-l-4 border-red-500/50 pl-4 space-y-2 text-base text-gray-300 italic">
                    {combatLog.map((log, index) => (
                        <p key={index} className="leading-relaxed">{log}</p>
                    ))}
                </div>
            )}
            <p className="text-gray-300 leading-loose text-xl whitespace-pre-wrap">
                {narrative}
                {isLoading && <span className="animate-pulse">...</span>}
            </p>

            {npcsInScene && npcsInScene.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-700/50 animate-fadeIn">
                    <h3 className="text-lg font-bold text-gray-400 mb-3">Những người khác ở đây</h3>
                    <ul className="space-y-3">
                        {npcsInScene.map(npc => {
                             const isHostile = npc.disposition === 'HOSTILE';
                             const borderColor = isHostile ? 'border-red-600/70' : 'border-gray-700/50';
                             const bgColor = isHostile ? 'bg-red-900/40' : 'bg-gray-900/30';
                             const nameColor = isHostile ? 'text-red-300' : 'text-gray-200';

                            return (
                                <li key={npc.id} className={`${bgColor} p-3 rounded-md border ${borderColor} transition-colors`}>
                                    <p className={`font-semibold ${nameColor}`}>{npc.name}</p>
                                    <p className="text-sm text-gray-400 italic">{npc.description}</p>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NarrativePanel;