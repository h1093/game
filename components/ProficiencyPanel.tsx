import React from 'react';
import { PlayerState, WeaponType } from '../types';
import { WEAPON_TYPES } from '../constants';

interface ProficiencyPanelProps {
    proficiency: PlayerState['proficiency'];
}

const IconSword = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 14.5 3 22"/><path d="m21 3-6.5 6.5"/><path d="m3 3 18 18"/></svg>;
const IconAxe = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m14 6-8.5 8.5a2.12 2.12 0 1 0 3 3L17 9"/><path d="M12 2 22 12"/></svg>;
const IconDagger = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 14.5 3 22"/><path d="m21 3-6.5 6.5"/></svg>;
const IconMace = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 22V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2Z"/><path d="M18 16V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const IconSpear = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 22l20-20"/><path d="M21.5 21.5 18 18"/></svg>;
const IconBow = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"/><path d="M22 12H2"/><path d="m16 6-4 6 4 6"/><path d="m8 18 4-6-4-6"/></svg>;
const IconStaff = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 22l20-20"/><path d="M19.5 13.5a2.5 2.5 0 0 1 0 3.53"/><path d="M20.03 19.5a2.5 2.5 0 0 1-3.53 0"/></svg>;
const IconUnarmed = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 10h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1"/><path d="M12 10h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4"/><path d="M12 10V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v4"/><path d="M6 10V8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v2"/><path d="M6 10h0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z"/></svg>;

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WEAPON_TYPES.map(type => {
                    const profData = proficiency[type];
                    if (!profData) return null;

                    const xpPercentage = (profData.xp / 100) * 100;
                    
                    return (
                        <div key={type} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="text-3xl">
                                    {weaponIcons[type]}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-200">{weaponNames[type]}</h3>
                                    <p className="text-red-400 font-title text-xl">Cấp {profData.level}</p>
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex justify-between items-center mb-1 text-sm">
                                    <span className="text-gray-400">Kinh nghiệm</span>
                                    <span className="font-mono text-gray-300">{profData.xp} / 100</span>
                                </div>
                                <div className="w-full bg-gray-600 rounded-full h-3 border border-gray-500 overflow-hidden">
                                    <div
                                        className="bg-red-600 h-full rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${xpPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProficiencyPanel;