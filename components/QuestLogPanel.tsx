import React from 'react';
import { Quest } from '../types';

const QuestLogPanel = ({ quests }: { quests: Quest[] }) => {
    const activeQuests = quests.filter(q => q.status === 'ACTIVE');
    const completedQuests = quests.filter(q => q.status !== 'ACTIVE');

    return (
         <div className="flex-grow overflow-y-auto pr-2 -mr-4 space-y-6">
            {quests.length === 0 ? (
                 <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-center italic py-4">Không có nhiệm vụ nào.</p>
                </div>
            ) : (
                <>
                    <div>
                        <h3 className="text-xl font-title text-red-300 mb-3">Đang Hoạt Động</h3>
                        {activeQuests.length > 0 ? (
                            <div className="space-y-3">
                                {activeQuests.map(q => (
                                    <div key={q.id} className="bg-gray-900/50 p-3 rounded-md">
                                        <h4 className="font-bold text-gray-200">{q.title}</h4>
                                        <p className="text-sm text-gray-400 mt-1">{q.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-gray-500 italic text-sm">Không có nhiệm vụ nào đang hoạt động.</p>}
                    </div>
                     <div>
                        <h3 className="text-xl font-title text-gray-500 mb-3">Đã Hoàn Thành</h3>
                        {completedQuests.length > 0 ? (
                            <div className="space-y-3">
                                {completedQuests.map(q => (
                                    <div key={q.id} className="bg-gray-900/50 p-3 rounded-md opacity-60">
                                        <h4 className="font-bold text-gray-400 line-through">{q.title}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{q.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-gray-500 italic text-sm">Chưa có nhiệm vụ nào được hoàn thành.</p>}
                    </div>
                </>
            )}
        </div>
    )
};

export default QuestLogPanel;