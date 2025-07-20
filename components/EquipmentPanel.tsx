
import React from 'react';
import { PlayerState, Item, EquipmentSlot } from '../types';

// SVG Icons
const IconWeapon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 14.5 3 22"/> <path d="m21 3-6.5 6.5"/> <path d="m3 3 18 18"/> <path d="M18 6V3h3"/> <path d="M18 10v-1"/> <path d="m21 7-1-1"/> <path d="M19 10h-1"/> <path d="m14 5-1-1"/> <path d="M6 18H3v-3"/> <path d="M10 18h1"/> <path d="m7 21 1-1"/> <path d="M10 19v1"/> <path d="m5 14 1 1"/></svg>
);
const IconArmor = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2l-7 3 7 14 7-14zM2 10h20M2 14h20"/></svg>
);
const IconRing1 = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="3"></circle></svg>
);
const IconRing2 = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 12h.01"/><path d="M16.07 16.07a2.5 2.5 0 1 1-3.54-3.54"/><path d="M10.24 7.93a2.5 2.5 0 1 1 3.54 3.54"/><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><path d="M4.93 4.93a9.02 9.02 0 1 1 12.73 12.73"/></svg>
);


interface EquipmentPanelProps {
    equipment: PlayerState['equipment'];
    onUnequipItem: (slot: EquipmentSlot) => void;
    itemIcons: { [key in Item['type']]: React.ReactElement };
}

const slotIcons: Record<EquipmentSlot, React.ReactElement> = {
    weapon: <IconWeapon />,
    armor: <IconArmor />,
    ring1: <IconRing1 />,
    ring2: <IconRing2 />,
};

const slotNames: Record<EquipmentSlot, string> = {
    weapon: 'Vũ Khí',
    armor: 'Giáp',
    ring1: 'Nhẫn 1',
    ring2: 'Nhẫn 2',
};

const EquipmentPanel: React.FC<EquipmentPanelProps> = ({ equipment, onUnequipItem, itemIcons }) => {
    
    const renderSlot = (slot: EquipmentSlot) => {
        const item = equipment[slot];
        return (
            <div key={slot} className="bg-gray-900/60 p-3 rounded-lg flex items-center gap-4 border border-gray-700 h-24">
                <div className="text-4xl text-gray-500 flex-shrink-0 w-10 text-center">
                    {item ? itemIcons[item.type] : slotIcons[slot]}
                </div>
                <div className="flex-grow">
                    <p className="text-sm font-bold text-gray-400">{slotNames[slot]}</p>
                    {item ? (
                        <>
                            <p className="font-semibold text-white">{item.name}</p>
                            <p className="text-xs text-gray-400 truncate">{item.description}</p>
                        </>
                    ) : (
                        <p className="text-gray-500 italic">-- Trống --</p>
                    )}
                </div>
                {item && (
                    <button 
                        onClick={() => onUnequipItem(slot)}
                        className="bg-red-800/70 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                        title={`Gỡ ${item.name}`}
                    >
                        Gỡ bỏ
                    </button>
                )}
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-2xl font-title text-red-400 border-b-2 border-red-500/30 pb-2 mb-4">Trang Bị</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {renderSlot('weapon')}
                {renderSlot('armor')}
                {renderSlot('ring1')}
                {renderSlot('ring2')}
            </div>
        </div>
    );
};

export default EquipmentPanel;