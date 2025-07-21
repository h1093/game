
import React from 'react';
import { Item, PlayerState } from '../types';

// SVG Icons
const IconPotion = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M8 2h8"/>
        <path d="M7 2v13.5a2.5 2.5 0 0 0 2.5 2.5h5A2.5 2.5 0 0 0 17 15.5V2"/>
    </svg>
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
const IconPlayCircle = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
);

const itemIcons: { [key in Item['type']]: React.ReactElement } = {
    POTION: <IconPotion className="text-green-400" />,
    WEAPON: <IconWeapon className="text-red-400" />,
    ARMOR: <IconArmor className="text-blue-400" />,
    RING: <IconRing className="text-yellow-400" />,
    AMULET: <IconAmulet className="text-indigo-400" />,
    KEY: <IconKey className="text-yellow-400" />,
    MISC: <IconMisc className="text-gray-400" />,
};

interface InventoryPanelProps {
    playerState: PlayerState;
    onUseItem: (item: Item) => void;
}

const InventoryPanel: React.FC<InventoryPanelProps> = ({ playerState, onUseItem }) => (
    <div className="flex-grow overflow-y-auto pr-2 -mr-4">
        {playerState.inventory.length === 0 ? (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center italic py-4">Túi đồ của bạn trống rỗng.</p>
            </div>
        ) : (
            <div className="flex flex-col gap-3">
                {playerState.inventory.map((item) => {
                    const isConsumable = item.effect && !item.equipmentSlot;
                    let isDisabled = false;
                    let disabledTooltip = '';

                    if (isConsumable) {
                        const hpGain = item.effect?.hp || 0;
                        const manaGain = item.effect?.mana || 0;
                        const sanityGain = item.effect?.sanity || 0;
                        const hungerGain = item.effect?.hunger || 0;
                        const thirstGain = item.effect?.thirst || 0;

                        const canUse = (hpGain > 0 && playerState.hp < playerState.maxHp) ||
                                       (manaGain > 0 && playerState.mana < playerState.maxMana) ||
                                       (sanityGain > 0 && playerState.sanity < playerState.maxSanity) ||
                                       (hungerGain > 0 && playerState.hunger < playerState.maxHunger) ||
                                       (thirstGain > 0 && playerState.thirst < playerState.maxThirst);
                        
                        const hasAnyEffect = hpGain > 0 || manaGain > 0 || sanityGain > 0 || hungerGain > 0 || thirstGain > 0;

                        if (hasAnyEffect && !canUse) {
                           isDisabled = true;
                           disabledTooltip = ' (Không cần dùng)';
                        }
                    }

                    const baseClass = "flex items-center w-full text-left bg-gray-700/80 text-white p-3 rounded-lg border border-gray-600 transition-all duration-200 ease-in-out";
                    const hoverClass = isConsumable && !isDisabled ? "hover:bg-red-800 hover:border-red-600 transform hover:scale-[1.02]" : "cursor-default";
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
                                {isConsumable && (
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

export default InventoryPanel;
