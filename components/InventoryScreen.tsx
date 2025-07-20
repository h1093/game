
import React, { useState } from 'react';
import { Item, PlayerState, Quest } from '../types';
import SkillBookPanel from './SkillBookPanel';

// SVG Icons
const IconPotion = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
);
const IconWeapon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 14.5 3 22"/> <path d="m21 3-6.5 6.5"/> <path d="m3 3 18 18"/> <path d="M18 6V3h3"/> <path d="M18 10v-1"/> <path d="m21 7-1-1"/> <path d="M19 10h-1"/> <path d="m14 5-1-1"/> <path d="M6 18H3v-3"/> <path d="M10 18h1"/> <path d="m7 21 1-1"/> <path d="M10 19v1"/> <path d="m5 14 1 1"/></svg>
);
const IconArmor = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);
const IconRing = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="3"></circle></svg>
);
const IconAmulet = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.88.98 6.7 2.6l-4.2 4.2"/><circle cx="12" cy="12" r="3"/></svg>
);
const IconKey = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
);
const IconMisc = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);
const IconX = ({ size, ...props }: React.SVGProps<SVGSVGElement> & { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const IconPlayCircle = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
);

interface InventoryScreenProps {
    isOpen: boolean;
    onClose: () => void;
    playerState: PlayerState;
    onUseItem: (item: Item) => void;
    log: string[];
}

const itemIcons: { [key in Item['type']]: React.ReactElement } = {
    POTION: <IconPotion className="text-green-400" />,
    WEAPON: <IconWeapon className="text-red-400" />,
    ARMOR: <IconArmor className="text-blue-400" />,
    RING: <IconRing className="text-yellow-400" />,
    AMULET: <IconAmulet className="text-indigo-400" />,
    KEY: <IconKey className="text-yellow-400" />,
    MISC: <IconMisc className="text-gray-400" />,
};

const InventoryPanel = ({ playerState, onUseItem }: { playerState: PlayerState, onUseItem: (item: Item) => void }) => (
    <div className="flex-grow overflow-y-auto pr-2 -mr-4">
        {playerState.inventory.length === 0 ? (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center italic py-4">Túi đồ của bạn trống rỗng.</p>
            </div>
        ) : (
            <div className="flex flex-col gap-3">
                {playerState.inventory.map((item) => {
                    const isUsable = item.type === 'POTION';
                    let isDisabled = false;
                    let disabledTooltip = '';

                    if (isUsable) {
                         const isHpFull = (item.effect?.hp ?? 0) > 0 && playerState.hp === playerState.maxHp;
                         const isManaFull = (item.effect?.mana ?? 0) > 0 && playerState.mana === playerState.maxMana;
                         if (isHpFull && (!item.effect?.mana || isManaFull)) {
                            isDisabled = true;
                            disabledTooltip = ' (Máu đã đầy)';
                         } else if (isManaFull && !item.effect?.hp) {
                            isDisabled = true;
                            disabledTooltip = ' (Mana đã đầy)';
                         }
                    }

                    const baseClass = "flex items-center w-full text-left bg-gray-700/80 text-white p-3 rounded-lg border border-gray-600 transition-all duration-200 ease-in-out";
                    const hoverClass = isUsable ? "hover:bg-red-800 hover:border-red-600 transform hover:scale-[1.02]" : "cursor-default";
                    const disabledClass = isDisabled ? "bg-gray-600 !transform-none opacity-50 cursor-not-allowed" : "";

                    return (
                        <div
                            key={item.id}
                            className={`${baseClass} ${hoverClass} ${disabledClass}`}
                            title={`${item.name} - ${item.description}${disabledTooltip}`}
                        >
                            <div className="mr-4 text-3xl flex-shrink-0 w-8 text-center">
                                {itemIcons[item.type] || itemIcons.MISC}
                            </div>
                            
                            <div className="flex-grow">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-gray-400">{item.description}</p>
                                {item.isSeveredPart && typeof item.decayTimer === 'number' && item.decayTimer > 0 && (
                                    <p className={`text-xs font-mono mt-1 ${item.isPreserved ? 'text-blue-300' : 'text-yellow-400 animate-pulse'}`}>
                                        {item.isPreserved ? 'Được bảo quản.' : 'Đang phân rã.'} Thời gian còn lại: {item.decayTimer} lượt
                                    </p>
                                )}
                            </div>

                            <div className="ml-4 flex-shrink-0">
                                {isUsable && (
                                    <button onClick={() => !isDisabled && onUseItem(item)} disabled={isDisabled} className="text-sm font-bold text-green-400 flex items-center gap-1 disabled:text-gray-400 disabled:cursor-not-allowed hover:text-green-300">
                                        Dùng <IconPlayCircle />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
    </div>
);

const QuestLogPanel = ({ quests }: { quests: Quest[] }) => {
    const activeQuests = quests.filter(q => q.status === 'ACTIVE');
    const completedQuests = quests.filter(q => q.status !== 'ACTIVE');

    return (
         <div className="flex-grow overflow-y-auto pr-2 -mr-4 space-y-6">
            {quests.length === 0 ? (
                 <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-center italic py-4">Không có nhiệm vụ nào.</p>
                </div>
            ) : (
                <>
                    <div>
                        <h3 className="text-xl font-title text-red-300 mb-3">Đang Hoạt Động</h3>
                        {activeQuests.length > 0 ? (
                            <div className="space-y-3">
                                {activeQuests.map(q => (
                                    <div key={q.id} className="bg-gray-900/50 p-3 rounded-md">
                                        <h4 className="font-bold text-gray-200">{q.title}</h4>
                                        <p className="text-sm text-gray-400 mt-1">{q.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-gray-500 italic text-sm">Không có nhiệm vụ nào đang hoạt động.</p>}
                    </div>
                     <div>
                        <h3 className="text-xl font-title text-gray-500 mb-3">Đã Hoàn Thành</h3>
                        {completedQuests.length > 0 ? (
                            <div className="space-y-3">
                                {completedQuests.map(q => (
                                    <div key={q.id} className="bg-gray-900/50 p-3 rounded-md opacity-60">
                                        <h4 className="font-bold text-gray-400 line-through">{q.title}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{q.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-gray-500 italic text-sm">Chưa có nhiệm vụ nào được hoàn thành.</p>}
                    </div>
                </>
            )}
        </div>
    )
};

const LogPanel = ({ logEntries }: { logEntries: string[] }) => (
    <div className="flex-grow overflow-y-auto pr-2 -mr-4">
        <div className="space-y-3">
        {logEntries.length === 0 ? (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center italic py-4">Không có cập nhật nào gần đây.</p>
            </div>
        ) : (
            logEntries.map((entry, index) => (
                <div 
                    key={index} 
                    className="bg-gray-900/50 p-3 rounded-md text-gray-300 text-sm"
                    style={{ opacity: Math.max(0.5, 1 - index * 0.015) }}
                >
                    {entry}
                </div>
            ))
        )}
        </div>
    </div>
);


const InventoryScreen: React.FC<InventoryScreenProps> = ({ isOpen, onClose, playerState, onUseItem, log }) => {
    const [activeTab, setActiveTab] = useState<'inventory' | 'skills' | 'quests' | 'log'>('inventory');

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
                        <nav className="-mb-px flex" aria-label="Tabs">
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
                    {activeTab === 'skills' && <SkillBookPanel playerState={playerState} />}
                    {activeTab === 'quests' && <QuestLogPanel quests={playerState.quests} />}
                    {activeTab === 'log' && <LogPanel logEntries={log} />}
                </div>

            </div>
        </div>
    );
};

export default InventoryScreen;
