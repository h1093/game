
import React, { useState } from 'react';
import { Companion, Quest, Sanctuary } from '../types';
import SanctuaryPanel from './SanctuaryPanel';

// SVG Icons
const IconUsers = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);
const IconMapPin = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);
const IconHome = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);


interface InfoTabsPanelProps {
    companions: Companion[];
    quests: Quest[];
    sanctuaries: Sanctuary[];
}

const getAffectionInfo = (affection: number): { text: string; colorClass: string; } => {
    if (affection > 75) return { text: "Cực kỳ Trung thành", colorClass: "bg-cyan-500" };
    if (affection > 40) return { text: "Tin tưởng", colorClass: "bg-green-500" };
    if (affection >= -40) return { text: "Trung lập", colorClass: "bg-gray-500" };
    if (affection >= -75) return { text: "Nghi ngờ", colorClass: "bg-yellow-600" };
    return { text: "Căm ghét", colorClass: "bg-red-700" };
};

const InfoTabsPanel: React.FC<InfoTabsPanelProps> = ({ companions, quests, sanctuaries }) => {
    const [activeTab, setActiveTab] = useState<'companions' | 'quests' | 'sanctuary'>(sanctuaries.length > 0 ? 'sanctuary' : 'companions');
    const activeQuests = quests.filter(q => q.status === 'ACTIVE');

    const TabButton = ({ isActive, onClick, children }: {isActive: boolean, onClick: () => void, children: React.ReactNode}) => (
        <button
            onClick={onClick}
            className={`flex-1 whitespace-nowrap py-3 px-1 text-center font-medium text-lg transition-colors duration-200
                ${isActive ? 'text-red-400 border-b-2 border-red-500' : 'text-gray-400 hover:text-gray-200 border-b-2 border-transparent'}`}
        >
            {children}
        </button>
    );

    return (
        <div>
            <div className="flex border-b border-gray-700 mb-4">
                <TabButton isActive={activeTab === 'companions'} onClick={() => setActiveTab('companions')}>
                    <span className="flex items-center justify-center gap-2"><IconUsers /> Đồng Đội</span>
                </TabButton>
                <TabButton isActive={activeTab === 'quests'} onClick={() => setActiveTab('quests')}>
                    <span className="flex items-center justify-center gap-2"><IconMapPin /> Nhiệm Vụ</span>
                </TabButton>
                {sanctuaries.length > 0 && (
                    <TabButton isActive={activeTab === 'sanctuary'} onClick={() => setActiveTab('sanctuary')}>
                        <span className="flex items-center justify-center gap-2"><IconHome /> Thánh Địa</span>
                    </TabButton>
                )}
            </div>

            <div className="py-2">
                {activeTab === 'companions' && (
                    <div className="space-y-4">
                        {companions.length > 0 ? (
                            companions.map((companion) => {
                                const hpPercentage = companion.maxHp > 0 ? Math.min(100, (companion.hp / companion.maxHp) * 100) : 0;
                                const affectionValue = companion.affection ?? 0;
                                const affectionInfo = getAffectionInfo(affectionValue);
                                // Affection is from -100 to 100. For percentage, we map it to 0-100.
                                const affectionPercentage = ((affectionValue + 100) / 200) * 100;

                                return (
                                    <div key={companion.id} className="bg-gray-900/50 p-3 rounded-md border border-gray-700/50">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-gray-200">{companion.name}</span>
                                            <span className="text-sm font-mono bg-gray-700 px-2 py-1 rounded">{companion.hp} / {companion.maxHp}</span>
                                        </div>
                                        <div className="w-full bg-gray-600 rounded-full h-2.5 border border-gray-500/50 mb-2">
                                            <div
                                                className="bg-green-600 h-full rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${hpPercentage}%` }}
                                                title={`Máu: ${companion.hp}/${companion.maxHp}`}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between items-center mb-1 text-xs">
                                            <span className="font-bold text-gray-400">Tình cảm</span>
                                            <span className={`font-semibold ${affectionInfo.colorClass.replace('bg-', 'text-')}`}>{affectionInfo.text}</span>
                                        </div>
                                        <div className="w-full bg-gray-600 rounded-full h-2.5 border border-gray-500/50">
                                            <div
                                                className={`${affectionInfo.colorClass} h-full rounded-full transition-all duration-500 ease-out`}
                                                style={{ width: `${affectionPercentage}%` }}
                                                title={`Tình cảm: ${affectionValue}`}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-gray-500 italic text-center">Bạn đang phiêu lưu một mình.</p>
                        )}
                    </div>
                )}
                {activeTab === 'quests' && (
                    <div className="space-y-4">
                        {activeQuests.length > 0 ? (
                            activeQuests.map((quest) => (
                                <div key={quest.id}>
                                    <h3 className="font-bold text-gray-200">{quest.title}</h3>
                                    <p className="text-sm text-gray-400 mt-1">{quest.description}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic text-center">Không có nhiệm vụ nào đang hoạt động.</p>
                        )}
                    </div>
                )}
                {activeTab === 'sanctuary' && (
                     <SanctuaryPanel sanctuaries={sanctuaries} />
                )}
            </div>
        </div>
    );
};

export default InfoTabsPanel;
