import React from 'react';

const LogPanel = ({ logEntries }: { logEntries: string[] }) => (
    <div className="flex-grow overflow-y-auto pr-2 -mr-4">
        <div className="space-y-3">
        {logEntries.length === 0 ? (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center italic py-4">Không có cập nhật nào gần đây.</p>
            </div>
        ) : (
            logEntries.map((entry, index) => (
                <div 
                    key={index} 
                    className="bg-gray-900/50 p-3 rounded-md text-gray-300 text-sm"
                    style={{ opacity: Math.max(0.5, 1 - index * 0.015) }}
                >
                    {entry}
                </div>
            ))
        )}
        </div>
    </div>
);

export default LogPanel;