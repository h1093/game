
import React from 'react';
import { Enemy, BodyPart, InjuryLevel } from '../types';

interface EnemyFigureProps {
    bodyParts: Enemy['bodyParts'];
}

const INJURY_COLORS: Record<InjuryLevel, string> = {
    HEALTHY: 'fill-gray-500 hover:fill-gray-400',
    INJURED: 'fill-yellow-600/80 hover:fill-yellow-500',
    CRITICAL: 'fill-orange-600/90 hover:fill-orange-500',
    SEVERED: 'fill-red-800/90 hover:fill-red-700', // Using red to show destroyed
};

const INJURY_TEXT: Record<InjuryLevel, string> = {
    HEALTHY: 'Khỏe Mạnh',
    INJURED: 'Bị Thương',
    CRITICAL: 'Nguy Kịch',
    SEVERED: 'Bị Phá Hủy',
};

const EnemyFigure: React.FC<EnemyFigureProps> = ({ bodyParts }) => {
    
    const renderPart = (part: BodyPart, path: string) => {
        const partState = bodyParts[part];
        if (!partState) return null;

        return (
            <g id={`enemy-${part}`} className={`transition-colors duration-300 ${INJURY_COLORS[partState.status]}`}>
                <title>{`${part}: ${INJURY_TEXT[partState.status]} (HP: ${partState.hp})`}</title>
                <path d={path} />
            </g>
        );
    };

    return (
        <div className="flex justify-center items-center h-28">
            <svg viewBox="0 0 100 120" className="w-auto h-full">
                {renderPart('head', 'M40 25 a10 10 0 1 1 20 0 a10 10 0 1 1 -20 0')}
                {renderPart('torso', 'M35 35 h30 v40 h-30 z')}
                {renderPart('rightArm', 'M65 37 h10 v35 h-10 z')}
                {renderPart('leftArm', 'M25 37 h10 v35 h-10 z')}
                {renderPart('rightLeg', 'M52 75 h13 v40 h-13 z')}
                {renderPart('leftLeg', 'M35 75 h13 v40 h-13 z')}
            </svg>
        </div>
    );
};

export default EnemyFigure;
