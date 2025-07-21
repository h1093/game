import React from 'react';
import { Choice, PlayerState, GamePhase, Enemy } from '../types';
import EnemyFigure from './EnemyFigure';

// SVG Icons
const IconChevronsRight = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="13 17 18 12 13 7"></polyline>
        <polyline points="6 17 11 12 6 7"></polyline>
    </svg>
);

const IconSend = ({ size, ...props }: React.SVGProps<SVGSVGElement> & { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

const IconCrosshair = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="22" y1="12" x2="18" y2="12"></line>
        <line x1="6" y1="12" x2="2" y2="12"></line>
        <line x1="12" y1="6" x2="12" y2="2"></line>
        <line x1="12" y1="22" x2="12" y2="18"></line>
    </svg>
);


interface CombatPanelProps {
    choices: Choice[];
    enemies: Enemy[];
    phase: GamePhase;
    onAction: (choice: Choice) => void;
    isLoading: boolean;
    playerState: PlayerState;
    customActionInput: string;
    setCustomActionInput: (value: string) => void;
    onCustomAction: (actionText: string) => void;
}

const CombatPanel: React.FC<CombatPanelProps> = ({ 
    choices, 
    enemies,
    phase,
    onAction, 
    isLoading, 
    playerState, 
    customActionInput, 
    setCustomActionInput, 
    onCustomAction 
}) => {
    
    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCustomAction(customActionInput);
    };

    const renderChoiceButton = (choice: Choice, index: number) => {
        const staminaCost = choice.staminaCost || 0;
        const hasEnoughStamina = playerState.stamina >= staminaCost;
        const isDisabled = isLoading || !hasEnoughStamina;
        const hitChance = choice.hitChance;

        return (
            <button
                key={index}
                onClick={() => onAction(choice)}
                disabled={isDisabled}
                className="flex items-center justify-between w-full text-left bg-gray-700 hover:bg-red-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:transform-none"
                title={!hasEnoughStamina ? `Cần ${staminaCost} thể lực` : (hitChance !== null && hitChance !== undefined ? `Cơ hội trúng: ${hitChance}%` : '')}
            >
                <span className="flex-grow pr-2">{choice.text}</span>
                <div className="flex items-center gap-4 flex-shrink-0">
                    {hitChance !== undefined && hitChance !== null && (
                        <span className="font-mono text-sm font-bold text-cyan-300 flex items-center gap-1">
                            <IconCrosshair className="w-4 h-4" /> {hitChance}%
                        </span>
                    )}
                    {staminaCost > 0 && (
                        <span className={`font-mono text-sm font-bold ${hasEnoughStamina ? 'text-blue-300' : 'text-red-400'}`}>
                            {staminaCost} STA
                        </span>
                    )}
                    <IconChevronsRight className="h-5 w-5 opacity-70" />
                </div>
            </button>
        );
    }
    
    const renderExplorationView = () => (
        <>
            <h2 className="text-xl font-title text-red-400 mb-4 border-b-2 border-red-500/30 pb-2">Lối Đi Của Bạn</h2>
            <div className="flex flex-col gap-3">
                {choices.map(renderChoiceButton)}
            </div>
            <form onSubmit={handleCustomSubmit} className="mt-4 pt-4 border-t border-gray-700/50">
                <p className="text-sm text-gray-400 mb-2">Hoặc, tự viết nên số phận của bạn:</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={customActionInput}
                        onChange={(e) => setCustomActionInput(e.target.value)}
                        placeholder="Ví dụ: nhìn dưới gầm giường..."
                        disabled={isLoading}
                        className="flex-grow bg-gray-900 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:outline-none transition disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !customActionInput.trim()}
                        className="bg-red-700 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold p-3 rounded-md transition-all flex items-center justify-center transform hover:scale-105 disabled:transform-none"
                        title="Gửi hành động tùy chỉnh"
                    >
                        <IconSend size={20} />
                    </button>
                </div>
            </form>
        </>
    );

    const renderCombatView = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {enemies.map(enemy => (
                    <div key={enemy.id} className="bg-gray-900/40 p-3 rounded-lg border border-gray-700 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-red-300">{enemy.name}</h3>
                            <p className="text-sm text-gray-400 italic mb-2">{enemy.description}</p>
                            {enemy.currentAction && <p className="text-xs text-yellow-300 mt-2 animate-pulse">Hành động: {enemy.currentAction}</p>}
                        </div>
                        <EnemyFigure bodyParts={enemy.bodyParts} />
                    </div>
                ))}
            </div>
             <h2 className="text-xl font-title text-red-400 mb-4 border-b-2 border-red-500/30 pb-2">Hành Động Chiến Đấu</h2>
             <div className="flex flex-col gap-3">
                {choices.map(renderChoiceButton)}
            </div>
        </>
    );

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-gray-700 backdrop-blur-sm">
            {phase === 'COMBAT' ? renderCombatView() : renderExplorationView()}
            
            {isLoading && (
                <div className="text-center text-gray-400 animate-pulse mt-4">
                    Những sợi chỉ của số phận đang được dệt...
                </div>
            )}
        </div>
    );
};

export default CombatPanel;