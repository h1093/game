import React from 'react';
import { PlayerState, BodyPart, InjuryLevel } from '../types';

interface BodyStatusFigureProps {
    bodyStatus: PlayerState['bodyStatus'];
}

const INJURY_COLORS: Record<InjuryLevel, string> = {
    HEALTHY: 'fill-gray-600 hover:fill-gray-500',
    INJURED: 'fill-yellow-500/70 hover:fill-yellow-400',
    CRITICAL: 'fill-red-600/80 hover:fill-red-500',
    SEVERED: 'fill-transparent',
};

const INJURY_TEXT: Record<InjuryLevel, string> = {
    HEALTHY: 'Khỏe Mạnh',
    INJURED: 'Bị Thương',
    CRITICAL: 'Nguy Kịch',
    SEVERED: 'Bị Cắt Đứt',
};

const BodyStatusFigure: React.FC<BodyStatusFigureProps> = ({ bodyStatus }) => {
    return (
        <div className="flex justify-center items-center">
            <svg viewBox="0 0 100 200" className="w-auto h-40">
                {/* Head */}
                {bodyStatus.head !== 'SEVERED' && (
                    <g id="head" className={`transition-colors duration-300 cursor-pointer ${INJURY_COLORS[bodyStatus.head]}`}>
                        <title>Đầu: {INJURY_TEXT[bodyStatus.head]}</title>
                        <circle cx="50" cy="25" r="18" />
                    </g>
                )}
                {/* Torso */}
                {bodyStatus.torso !== 'SEVERED' && (
                    <g id="torso" className={`transition-colors duration-300 cursor-pointer ${INJURY_COLORS[bodyStatus.torso]}`}>
                        <title>Thân: {INJURY_TEXT[bodyStatus.torso]}</title>
                        <rect x="30" y="43" width="40" height="65" rx="5" />
                    </g>
                )}
                {/* Right Arm (from viewer's perspective) */}
                {bodyStatus.rightArm !== 'SEVERED' && (
                    <g id="rightArm" className={`transition-colors duration-300 cursor-pointer ${INJURY_COLORS[bodyStatus.rightArm]}`}>
                        <title>Tay Phải: {INJURY_TEXT[bodyStatus.rightArm]}</title>
                        <rect x="72" y="45" width="15" height="60" rx="7" />
                    </g>
                )}
                {/* Left Arm (from viewer's perspective) */}
                {bodyStatus.leftArm !== 'SEVERED' && (
                    <g id="leftArm" className={`transition-colors duration-300 cursor-pointer ${INJURY_COLORS[bodyStatus.leftArm]}`}>
                        <title>Tay Trái: {INJURY_TEXT[bodyStatus.leftArm]}</title>
                        <rect x="13" y="45" width="15" height="60" rx="7" />
                    </g>
                )}
                {/* Right Leg (from viewer's perspective) */}
                {bodyStatus.rightLeg !== 'SEVERED' && (
                    <g id="rightLeg" className={`transition-colors duration-300 cursor-pointer ${INJURY_COLORS[bodyStatus.rightLeg]}`}>
                        <title>Chân Phải: {INJURY_TEXT[bodyStatus.rightLeg]}</title>
                        <rect x="52" y="108" width="18" height="70" rx="7" />
                    </g>
                )}
                {/* Left Leg (from viewer's perspective) */}
                {bodyStatus.leftLeg !== 'SEVERED' && (
                    <g id="leftLeg" className={`transition-colors duration-300 cursor-pointer ${INJURY_COLORS[bodyStatus.leftLeg]}`}>
                        <title>Chân Trái: {INJURY_TEXT[bodyStatus.leftLeg]}</title>
                        <rect x="30" y="108" width="18" height="70" rx="7" />
                    </g>
                )}
            </svg>
        </div>
    );
};

export default BodyStatusFigure;