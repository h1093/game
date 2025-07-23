

import React from 'react';
import { Sanctuary } from '../types';

// SVG Icons
const IconHeartHandshake = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.82 2.96 0L12 11l2.96-2.96a2.17 2.17 0 0 1 2.96 0v0a2.17 2.17 0 0 1 0 3.08L12 14"/></svg>
);
const IconUsers = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconConstruction = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M12 3v3"/></svg>
);
const IconFollowers = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 19a4 4 0 0 0-8 0"/><path d="M14 19h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1.5"/><path d="M18 19h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-4"/><path d="M12 19h-2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1.5"/><path d="M8 19H6a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h4"/><circle cx="12" cy="9" r="3"/><path d="M12 14a7 7 0 0 0-7 7"/></svg>
);

const getLoyaltyDetails = (loyalty: number): { text: string; colorClass: string; percentage: number; } => {
    const percentage = ((loyalty || 0) + 100) / 2;
    if (loyalty <= -75) return { text: "Nổi Loạn", colorClass: "bg-red-800", percentage };
    if (loyalty <= -25) return { text: "Bất Mãn", colorClass: "bg-orange-700", percentage };
    if (loyalty < 25) return { text: "Thờ Ơ", colorClass: "bg-gray-600", percentage };
    if (loyalty < 75) return { text: "Trung Thành", colorClass: "bg-sky-700", percentage };
    return { text: "Tận Hiến", colorClass: "bg-cyan-500", percentage };
};

const SanctuaryPanel = ({ sanctuaries }: { sanctuaries: Sanctuary[] }) => {
    if (sanctuaries.length === 0) {
        return null;
    }

    const sanctuary = sanctuaries[0]; // For now, only display the first one
    const hopePercentage = Math.max(0, Math.min(100, sanctuary.hope));

    return (
        <div className="space-y-4 animate-fadeIn">
            <div>
                <h3 className="text-xl font-bold text-green-300">{sanctuary.name} (Cấp {sanctuary.level})</h3>
                <p className="text-sm text-gray-400 italic mt-1">{sanctuary.description}</p>
            </div>

            <div>
                 <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-200 flex items-center gap-2 text-sm"><IconHeartHandshake className="text-green-400"/> Hy Vọng</span>
                    <span className="text-xs font-mono bg-gray-700 px-2 py-0.5 rounded">{sanctuary.hope}/100</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-3 border border-gray-500">
                    <div
                        className="bg-gradient-to-r from-green-600 to-teal-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${hopePercentage}%` }}
                    ></div>
                </div>
            </div>

            {sanctuary.residents.length > 0 && (
                 <div>
                    <h4 className="font-bold text-gray-300 flex items-center gap-2 mb-2"><IconUsers /> Cư Dân</h4>
                    <div className="flex flex-wrap gap-2">
                        {sanctuary.residents.map(residentId => (
                            <span key={residentId} className="bg-gray-700 text-gray-200 text-xs font-medium px-2.5 py-1 rounded-full">{residentId}</span>
                        ))}
                    </div>
                </div>
            )}
            
            {sanctuary.improvements.length > 0 && (
                 <div>
                    <h4 className="font-bold text-gray-300 flex items-center gap-2 mb-2"><IconConstruction /> Cải Tiến</h4>
                    <div className="flex flex-wrap gap-2">
                        {sanctuary.improvements.map(improvement => (
                            <span key={improvement} className="bg-blue-900/50 text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-500/50">{improvement}</span>
                        ))}
                    </div>
                </div>
            )}

            {sanctuary.followers && sanctuary.followers.length > 0 && (
                 <div className="pt-2 border-t border-gray-700/50">
                    <h4 className="font-bold text-gray-300 flex items-center gap-2 mb-2"><IconFollowers /> Tín Đồ</h4>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {sanctuary.followers.map(follower => {
                             const loyaltyInfo = getLoyaltyDetails(follower.loyalty);
                             return (
                                <div key={follower.id} className="bg-gray-900/40 p-2 rounded-lg text-sm">
                                    <p className="font-semibold text-gray-200">{follower.name} <span className="text-gray-400 font-normal">({follower.status})</span></p>
                                    <div>
                                        <div className="flex justify-between items-center text-xs text-gray-400">
                                            <span>Lòng Trung Thành</span>
                                            <span className="font-semibold">{loyaltyInfo.text}</span>
                                        </div>
                                         <div className="w-full bg-gray-600 rounded-full h-2 border border-gray-500" title={`Lòng trung thành: ${follower.loyalty}`}>
                                            <div
                                                className={`${loyaltyInfo.colorClass} h-full rounded-full transition-all duration-500 ease-out`}
                                                style={{ width: `${loyaltyInfo.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                             )
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SanctuaryPanel;