

import React, { useState } from 'react';
import { Item, PlayerState, Quest, Skill } from '../types';
import SkillBookPanel from './SkillBookPanel';
import InventoryPanel from './InventoryPanel';
import QuestLogPanel from './QuestLogPanel';
import LogPanel from './LogPanel';
import ProficiencyPanel from './ProficiencyPanel';

// SVG Icons
const IconX = ({ size, ...props }: React.SVGProps<SVGSVGElement> & { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

interface InventoryScreenProps {
    isOpen: boolean;
    onClose: () => void;
    playerState: PlayerState;
    onUseItem: (item: Item) => void;
    log: string[];
    onUseSkill: (skill: Skill) => void;
    isLoading: boolean;
}

const InventoryScreen: React.FC<InventoryScreenProps> = ({ isOpen, onClose, playerState, onUseItem, log, onUseSkill, isLoading }) => {
    const [activeTab, setActiveTab] = useState<'inventory' | 'skills' | 'quests' | 'log' | 'proficiency'>('inventory');

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-4xl bg-gray-800 border-2 border-red-500/30 rounded-lg shadow-2xl p-8 flex flex-col gap-8 max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <IconX size={24} />
                </button>
                
                <div className="flex-grow flex flex-col min-h-0">
                    <div className="border-b border-gray-700 mb-4">
                        <nav className="-mb-px flex flex-wrap" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('inventory')}
                                className={`mr-6 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'inventory' ? 'border-red-500 text-red-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                            >
                                Hành Trang
                            </button>
                            <button
                                onClick={() => setActiveTab('skills')}
                                className={`mr-6 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'skills' ? 'border-red-500 text-red-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                            >
                                Sổ Kỹ Năng
                            </button>
                             <button
                                onClick={() => setActiveTab('proficiency')}
                                className={`mr-6 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'proficiency' ? 'border-red-500 text-red-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                            >
                                Thành Thạo
                            </button>
                             <button
                                onClick={() => setActiveTab('quests')}
                                className={`mr-6 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'quests' ? 'border-red-500 text-red-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                            >
                                Nhật Ký Nhiệm Vụ
                            </button>
                            <button
                                onClick={() => setActiveTab('log')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'log' ? 'border-red-500 text-red-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                            >
                                Nhật Ký Cập Nhật
                            </button>
                        </nav>
                    </div>
                    
                    {activeTab === 'inventory' && <InventoryPanel playerState={playerState} onUseItem={onUseItem} />}
                    {activeTab === 'skills' && <SkillBookPanel playerState={playerState} onUseSkill={onUseSkill} isLoading={isLoading} />}
                    {activeTab === 'proficiency' && <ProficiencyPanel proficiency={playerState.proficiency} origin={playerState.origin} />}
                    {activeTab === 'quests' && <QuestLogPanel quests={playerState.quests} />}
                    {activeTab === 'log' && <LogPanel logEntries={log} />}
                </div>

            </div>
        </div>
    );
};

export default InventoryScreen;