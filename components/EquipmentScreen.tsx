
import React from 'react';
import { Item, PlayerState, EquipmentSlot } from '../types';
import EquipmentPanel from './EquipmentPanel';

// SVG Icons
const IconX = ({ size, ...props }: React.SVGProps<SVGSVGElement> & { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const IconMisc = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
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
const IconEquip = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 14a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z"></path><path d="M14 14a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2z"></path></svg>
);


interface EquipmentScreenProps {
    isOpen: boolean;
    onClose: () => void;
    playerState: PlayerState;
    onEquipItem: (item: Item) => void;
    onUnequipItem: (slot: EquipmentSlot) => void;
}

const itemIcons: { [key in Item['type']]: React.ReactElement } = {
    POTION: <IconMisc className="text-gray-400" />,
    WEAPON: <IconWeapon className="text-red-400" />,
    ARMOR: <IconArmor className="text-blue-400" />,
    RING: <IconRing className="text-yellow-400" />,
    AMULET: <IconAmulet className="text-indigo-400" />,
    KEY: <IconMisc className="text-gray-400" />,
    MISC: <IconMisc className="text-gray-400" />,
};


const EquipmentScreen: React.FC<EquipmentScreenProps> = ({ isOpen, onClose, playerState, onEquipItem, onUnequipItem }) => {
    if (!isOpen) return null;

    const equippableItems = playerState.inventory.filter(item => !!item.equipmentSlot);

    return (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-5xl bg-gray-800 border-2 border-yellow-500/30 rounded-lg shadow-2xl p-8 flex flex-col md:flex-row gap-8 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <IconX size={24} />
                </button>

                {/* Left Side: Current Equipment */}
                <div className="w-full md:w-1/2 flex-shrink-0 flex flex-col">
                    <EquipmentPanel
                        equipment={playerState.equipment}
                        onUnequipItem={onUnequipItem}
                        itemIcons={itemIcons}
                    />
                </div>

                {/* Right Side: Equippable Inventory */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <h2 className="text-2xl font-title text-yellow-400 border-b-2 border-yellow-500/30 pb-2 mb-4">Kho Đồ</h2>
                    <div className="flex-grow overflow-y-auto pr-2 -mr-4">
                        {equippableItems.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500 text-center italic py-4">Không có vật phẩm nào có thể trang bị.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {equippableItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center w-full text-left bg-gray-700/80 text-white p-3 rounded-lg border border-gray-600 transition-all duration-200 ease-in-out"
                                        title={`${item.name} - ${item.description}`}
                                    >
                                        <div className="mr-4 text-3xl flex-shrink-0 w-8 text-center">
                                            {itemIcons[item.type] || itemIcons.MISC}
                                        </div>
                                        
                                        <div className="flex-grow">
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-gray-400">{item.description}</p>
                                        </div>

                                        <div className="ml-4 flex-shrink-0">
                                            <button onClick={() => onEquipItem(item)} className="text-sm font-bold text-yellow-400 flex items-center gap-1 hover:text-yellow-300">
                                                Trang bị <IconEquip />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentScreen;
