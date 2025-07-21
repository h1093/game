
import React from 'react';

// SVG Icon for the Covenant
const IconCovenant = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
        <path d="m14.5 4.5 3-3" />
        <path d="m9.5 4.5-3-3" />
        <path d="M14.5 20.5 18 17" />
        <path d="m9.5 20.5 4-4" />
    </svg>
);

interface CovenantButtonProps {
    onActivate: () => void;
    cooldown: number;
    isActive: boolean;
    isLoading: boolean;
}

const CovenantButton: React.FC<CovenantButtonProps> = ({ onActivate, cooldown, isActive, isLoading }) => {
    const isDisabled = cooldown > 0 || isLoading || isActive;
    
    let buttonText = "Giao Ước";
    if (isActive) {
        buttonText = "Sức Mạnh Dâng Trào";
    } else if (cooldown > 0) {
        buttonText = `Hồi Phục (${cooldown})`;
    }

    const title = isActive
        ? "Bạn đang được bao bọc bởi sức mạnh hắc ám."
        : cooldown > 0
        ? "Linh hồn bạn cần thời gian để hồi phục sau giao kèo."
        : "Chấp nhận giao ước với bóng tối để có được sức mạnh tạm thời, với một cái giá vĩnh viễn.";

    return (
        <button
            onClick={onActivate}
            disabled={isDisabled}
            title={title}
            className={`
                w-full flex items-center justify-center gap-3 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 
                border-2 transform focus:outline-none focus:ring-4
                ${isActive
                    ? 'bg-purple-900 border-purple-600 cursor-not-allowed animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.7)] ring-purple-500/50'
                    : isDisabled
                    ? 'bg-gray-700 border-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-br from-gray-900 to-black border-red-700 hover:border-red-500 hover:scale-105 shadow-lg hover:shadow-red-500/30 ring-red-500/50'
                }
            `}
        >
            <IconCovenant className={`
                transition-transform duration-500 
                ${isActive ? 'animate-spin' : ''}
                ${!isDisabled ? 'group-hover:rotate-180' : ''}
            `} />
            <span>{buttonText}</span>
        </button>
    );
};

export default CovenantButton;
