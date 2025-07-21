import React from 'react';
import { PlayerState, WeaponType } from '../types';
import { WEAPON_TYPES } from '../constants';

interface ProficiencyPanelProps {
    proficiency: PlayerState['proficiency'];
}

const IconSword = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 3v5l-11 9-4 4-3-3 4-4 9-11z" /><path d="M5 14l-1 1" /><path d="M14 5l1-1" /><path d="M6.5 15.5l7-7" /></svg>;
const IconAxe = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m14 6-8.5 8.5a2.12 2.12 0 1 0 3 3L17 9"/><path d="M12 2 22 12"/></svg>;
const IconDagger = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3v10l-2 4h4l-2-4"/><path d="M10 6h4"/></svg>;
const IconMace = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 12v10"/><circle cx="12" cy="7" r="5"/><path d="M12 2v1"/><path d="m15.5 3.5-1 1"/><path d="m8.5 3.5 1 1"/><path d="m19 7-1 0"/><path d="m5 7 1 0"/><path d="m15.5 10.5-1-1"/><path d="m8.5 10.5 1-1"/></svg>;
const IconSpear = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 22l20-20"/><path d="M22 2l-4 1 2 3 2-4z"/></svg>;
const IconBow = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 3h4v4" /><path d="M21 3l-15 15" /><path d="M3 17.5l2.5 -2.5" /><path d="M6 15l2.5 -2.5" /><path d="M9 12.5l2.5 -2.5" /><path d="M12 9.5l2.5 -2.5" /></svg>;
const IconStaff = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 22l10-10"/><path d="M12 12c-2 2-2 5 0 7s5 2 7 0"/><path d="M12 12l10-10"/></svg>;
const IconUnarmed = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 10H7a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2z"/><path d="M7 10V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;

const weaponIcons: Record<WeaponType, React.ReactElement> = {
    SWORD: <IconSword className="text-red-400" />,
    AXE: <IconAxe className="text-orange-400" />,
    DAGGER: <IconDagger className="text-gray-400" />,
    MACE: <IconMace className="text-amber-400" />,
    SPEAR: <IconSpear className="text-teal-400" />,
    BOW: <IconBow className="text-lime-400" />,
    STAFF: <IconStaff className="text-indigo-400" />,
    UNARMED: <IconUnarmed className="text-stone-400" />,
};

const weaponNames: Record<WeaponType, string> = {
    SWORD: 'Kiếm',
    AXE: 'Rìu',
    DAGGER: 'Dao Găm',
    MACE: 'Chùy',
    SPEAR: 'Giáo',
    BOW: 'Cung',
    STAFF: 'Quyền Trượng',
    UNARMED: 'Tay Không',
};

const ProficiencyPanel: React.FC<ProficiencyPanelProps> = ({ proficiency }) => {
    return (
        <div className="flex-grow overflow-y-auto pr-2 -mr-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {WEAPON_TYPES.map(type => {
                    const profData = proficiency[type];
                    if (!profData) return null;

                    const xpPercentage = (profData.xp / 100) * 100;
                    
                    return (
                        <div key={type} className="bg-gray-900/60 p-2 rounded-lg border border-gray-700">
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <div className="text-xl">
                                        {weaponIcons[type]}
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-200">{weaponNames[type]}</h3>
                                </div>
                                <p className="text-red-400 font-title text-base font-bold">Cấp {profData.level}</p>
                            </div>
                            
                            <div className="w-full bg-gray-700 rounded-full h-4 border border-gray-600/50 overflow-hidden relative" title={`Kinh nghiệm: ${profData.xp} / 100`}>
                                <div
                                    className="bg-gradient-to-r from-red-800 to-red-600 h-full rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${xpPercentage}%` }}
                                ></div>
                                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-mono text-white font-bold tracking-tighter" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                                    {profData.xp} / 100
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProficiencyPanel;
