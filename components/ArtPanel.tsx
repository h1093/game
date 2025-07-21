
import React from 'react';

interface ArtPanelProps {
    imageUrl: string | null;
    isLoading: boolean;
}

const ArtPanel: React.FC<ArtPanelProps> = ({ imageUrl, isLoading }) => {
    return (
        <div className="aspect-[16/9] bg-black/30 rounded-lg shadow-inner border border-gray-700 overflow-hidden flex items-center justify-center relative">
            {isLoading && (
                <div className="w-full h-full bg-gray-800/50 flex flex-col items-center justify-center text-gray-400">
                    <svg className="animate-spin h-10 w-10 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                     <p className="mt-4 font-title text-lg animate-pulse">Vực thẳm đang vẽ nên một viễn cảnh...</p>
                </div>
            )}
            {!isLoading && imageUrl && (
                <img 
                    src={imageUrl} 
                    alt="AI-generated scene" 
                    className="w-full h-full object-cover animate-fadeIn"
                />
            )}
            {!isLoading && !imageUrl && (
                <div className="text-gray-600 font-title text-2xl">
                    Bóng tối che khuất tầm nhìn...
                </div>
            )}
        </div>
    );
};

export default ArtPanel;
