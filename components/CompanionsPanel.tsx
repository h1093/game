
import React from 'react';
import { Companion } from '../types';

// SVG Icons
const IconUsers = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);


interface CompanionsPanelProps {
    companions: Companion[];
}

const CompanionsPanel: React.FC<CompanionsPanelProps> = ({ companions }) => {
    return (
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-gray-700 backdrop-blur-sm">
            <h2 className="text-xl font-title text-red-400 mb-4 border-b-2 border-red-500/30 pb-2 flex items-center gap-2"><IconUsers /> Đồng Đội</h2>
            <div className="space-y-4">
                {companions.length > 0 ? (
                    companions.map((companion) => {
                        const hpPercentage = companion.maxHp > 0 ? (companion.hp / companion.maxHp) * 100 : 0;
                        return (
                            <div key={companion.id}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-gray-200">{companion.name}</span>
                                    <span className="text-sm font-mono bg-gray-700 px-2 py-1 rounded">{companion.hp} / {companion.maxHp}</span>
                                </div>
                                <div className="w-full bg-gray-600 rounded-full h-3 border border-gray-500">
                                    <div
                                        className="bg-green-600 h-full rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${hpPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-sm text-gray-500 italic">Bạn đang phiêu lưu một mình.</p>
                )}
            </div>
        </div>
    );
};

export default CompanionsPanel;