import React, { useMemo } from 'react';
import { PlayerState, WeaponType, Origin } from '../types';
import { WEAPON_TYPES, ORIGINS } from '../constants';

const IconSword = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 3v5l-11 9-4 4-3-3 4-4 9-11z" /><path d="M5 14l-1 1" /><path d="M14 5l1-1" /><path d="M6.5 15.5l7-7" /></svg>;
const IconAxe = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m14 6-8.5 8.5a2.12 2.12 0 1 0 3 3L17 9"/><path d="M12 2 22 12"/></svg>;
const IconDagger = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3v10l-2 4h4l-2-4"/><path d="M10 6h4"/></svg>;
const IconMace = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 12v10"/><circle cx="12" cy="7" r="5"/><path d="M12 2v1"/><path d="m15.5 3.5-1 1"/><path d="m8.5 3.5 1 1"/><path d="m19 7-1 0"/><path d="m5 7 1 0"/><path d="m15.5 10.5-1-1"/><path d="m8.5 10.5 1-1"/></svg>;
const IconSpear = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 22l20-20"/><path d="M22 2l-4 1 2 3 2-4z"/></svg>;
const IconBow = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 3h4v4" /><path d="M21 3l-15 15" /><path d="M3 17.5l2.5 -2.5" /><path d="M6 15l2.5 -2.5" /><path d="M9 12.5l2.5 -2.5" /><path d="M12 9.5l2.5 -2.5" /></svg>;
const IconStaff = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 22l10-10"/><path d="M12 12c-2 2-2 5 0 7s5 2 7 0"/><path d="M12 12l10-10"/></svg>;
const IconUnarmed = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 10H7a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2z"/><path d="M7 10V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const IconStar = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

const weaponIcons: Record<WeaponType, React.ReactElement> = {
    SWORD: <IconSword />,
    AXE: <IconAxe />,
    DAGGER: <IconDagger />,
    MACE: <IconMace />,
    SPEAR: <IconSpear />,
    BOW: <IconBow />,
    STAFF: <IconStaff />,
    UNARMED: <IconUnarmed />,
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

interface ProficiencyPanelProps {
    proficiency: PlayerState['proficiency'];
    origin: PlayerState['origin'];
}

const ProficiencyPanel: React.FC<ProficiencyPanelProps> = ({ proficiency, origin }) => {
    
    const specializedWeaponType = useMemo(() => {
        if (!origin) return null;
        return ORIGINS[origin]?.bonuses?.startingProficiency?.type || null;
    }, [origin]);

    const orderedWeaponTypes = useMemo(() => {
        if (!specializedWeaponType) return WEAPON_TYPES;
        
        return [
            specializedWeaponType,
            ...WEAPON_TYPES.filter(type => type !== specializedWeaponType)
        ];
    }, [specializedWeaponType]);

    return (
        <div className="flex-grow overflow-y-auto pr-2 -mr-4">
            <div className="space-y-4">
                {orderedWeaponTypes.map(type => {
                    const profData = proficiency[type];
                    if (!profData) return null;

                    const xpPercentage = (profData.xp / 100) * 100;
                    const bonus = profData.level > 1 ? profData.level - 1 : 0;
                    const isSpecialized = type === specializedWeaponType;

                    const containerClass = isSpecialized
                        ? "bg-yellow-900/30 border-yellow-500/60"
                        : "bg-gray-900/60 border-gray-700";
                    
                    const iconColorClass = isSpecialized
                        ? "text-yellow-400"
                        : "text-gray-400";

                    return (
                        <div key={type} className={`relative p-4 rounded-lg border flex items-center gap-4 transition-all duration-300 ${containerClass}`}>
                            {isSpecialized && (
                                <div className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                                    <IconStar className="w-3 h-3"/>
                                    Sở Trường
                                </div>
                            )}

                            <div className={`text-4xl flex-shrink-0 w-10 text-center ${iconColorClass}`}>
                                {weaponIcons[type]}
                            </div>
                            
                            <div className="flex-grow">
                                <div className="flex justify-between items-baseline">
                                    <h3 className={`text-lg font-bold ${isSpecialized ? 'text-yellow-200' : 'text-gray-200'}`}>{weaponNames[type]}</h3>
                                    <p className={`font-title text-xl font-bold ${isSpecialized ? 'text-yellow-300' : 'text-red-400'}`}>
                                        Cấp {profData.level}
                                        {bonus > 0 && (
                                            <span className="text-sm text-green-400 ml-2 font-sans">(+{bonus} ATK & DEF)</span>
                                        )}
                                    </p>
                                </div>
                                
                                <div className="mt-2 w-full bg-gray-700 rounded-full h-5 border border-gray-600/50 overflow-hidden relative" title={`Kinh nghiệm: ${profData.xp} / 100`}>
                                    <div
                                        className={`${isSpecialized ? 'bg-gradient-to-r from-yellow-700 to-yellow-500' : 'bg-gradient-to-r from-red-800 to-red-600'} h-full rounded-full transition-all duration-500 ease-out`}
                                        style={{ width: `${xpPercentage}%` }}
                                    ></div>
                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-mono text-white font-bold tracking-tighter" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                                        {profData.xp} / 100
                                    </span>
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