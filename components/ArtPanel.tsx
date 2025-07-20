
import React from 'react';
import { Quest } from '../types';

const IconMapPin = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

interface QuestsPanelProps {
    quests: Quest[];
}

const QuestsPanel: React.FC<QuestsPanelProps> = ({ quests }) => {
    const activeQuests = quests.filter(q => q.status === 'ACTIVE');

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-gray-700 backdrop-blur-sm">
            <h2 className="text-xl font-title text-red-400 mb-4 border-b-2 border-red-500/30 pb-2 flex items-center gap-2">
                <IconMapPin /> Nhiệm Vụ
            </h2>
            <div className="space-y-4">
                {activeQuests.length > 0 ? (
                    activeQuests.map((quest) => (
                        <div key={quest.id}>
                            <h3 className="font-bold text-gray-200">{quest.title}</h3>
                            <p className="text-sm text-gray-400 mt-1">{quest.description}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 italic">Không có nhiệm vụ nào đang hoạt động.</p>
                )}
            </div>
        </div>
    );
};

export default QuestsPanel;