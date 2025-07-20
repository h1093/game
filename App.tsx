
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, PlayerState, GameData, Choice, CharacterClass, Item, Difficulty, Quest, Companion, Skill, EquipmentSlot, Gender } from './types';
import { INITIAL_PLAYER_STATE, GAME_TITLE, CLASSES, SAVE_KEY } from './constants';
import { GameAIService } from './services/geminiService';
import NarrativePanel from './components/NarrativePanel';
import ActionPanel from './components/ActionPanel';
import PlayerStatsPanel from './components/PlayerStatsPanel';
import GameOverScreen from './components/GameOverScreen';
import StartScreen from './components/StartScreen';
import CharacterCreationScreen from './components/CharacterCreationScreen';
import InventoryScreen from './components/InventoryScreen';
import EquipmentScreen from './components/EquipmentScreen';
import CompanionsPanel from './components/CompanionsPanel';
import SkillsPanel from './components/SkillsPanel';

// SVG Icons
const IconInventory = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);

const IconExit = ({ size, ...props }: React.SVGProps<SVGSVGElement> & { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M10 22H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5"></path><polyline points="17 16 21 12 17 8"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

const IconSave = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
);

const IconEquipment = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);


const App: React.FC = () => {
    const [playerState, setPlayerState] = useState<PlayerState>(INITIAL_PLAYER_STATE);
    const [gameState, setGameState] = useState<GameState>({
        phase: 'TITLE_SCREEN',
        narrative: '',
        choices: [],
        difficulty: null,
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [notification, setNotification] = useState<string>('');
    const [log, setLog] = useState<string[]>([]);
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);
    const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
    const [isNewGameConfirmOpen, setIsNewGameConfirmOpen] = useState(false);
    const [saveFileExists, setSaveFileExists] = useState<boolean>(false);
    const [customActionInput, setCustomActionInput] = useState('');
    const [apiKey, setApiKey] = useState<string | null>(null);
    const gameAIService = useRef<GameAIService | null>(null);

    useEffect(() => {
        try {
            const savedKey = localStorage.getItem('gemini_api_key');
            if (savedKey) {
                setApiKey(savedKey);
            }
            if (localStorage.getItem(SAVE_KEY)) {
                setSaveFileExists(true);
            }
        } catch (e) {
            console.error("Không thể truy cập localStorage:", e);
        }
    }, []);

    const addLogEntry = useCallback((message: string) => {
        if (!message) return;
        const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        setLog(prevLog => [`[${timestamp}] ${message}`, ...prevLog].slice(0, 50));
    }, [setLog]);
    

    const handleSetApiKey = useCallback((key: string) => {
        try {
            if (key) {
                localStorage.setItem('gemini_api_key', key);
                setApiKey(key);
                const msg = "API Key đã được lưu.";
                setNotification(msg);
                addLogEntry(msg);
            } else {
                localStorage.removeItem('gemini_api_key');
                setApiKey(null);
                const msg = "API Key đã được xóa.";
                setNotification(msg);
                addLogEntry(msg);
            }
        } catch (e) {
            console.error("Lỗi khi lưu API key:", e);
            const msg = "Không thể lưu API key.";
            setNotification(msg);
            addLogEntry(msg);
        }
    }, [addLogEntry, setApiKey, setNotification]);


    const handleGameTick = useCallback(() => {
        setPlayerState(prev => {
            let decayMessage: string | null = null;
            const newInventory = [...prev.inventory].map(item => {
                if (item.isSeveredPart && typeof item.decayTimer === 'number' && item.decayTimer > 0) {
                    const newDecayTimer = item.decayTimer - 1;
                    if (newDecayTimer <= 0) {
                        decayMessage = `Mùi hôi thối bốc lên từ túi của bạn... '${item.name}' đã bị thối rữa.`;
                        return {
                            ...item,
                            name: `${item.name} (Thối Rữa)`,
                            description: "Bộ phận này đã phân hủy không thể nhận ra, bốc lên một mùi hôi thối nồng nặc. Nó đã mất hết mọi tiềm năng.",
                            decayTimer: undefined,
                        };
                    }
                    return { ...item, decayTimer: newDecayTimer };
                }
                return item;
            });

            if (decayMessage) {
                setTimeout(() => {
                    addLogEntry(decayMessage!);
                    setNotification(decayMessage!);
                }, 0);
            }

            return { ...prev, inventory: newInventory };
        });
    }, [addLogEntry, setNotification, setPlayerState]);

    const recalculateStats = useCallback((currentState: PlayerState): PlayerState => {
        const newState = { ...currentState };
        let newAttack = currentState.baseAttack;
        let newDefense = currentState.baseDefense;
        let newMaxHp = currentState.baseMaxHp;
        let newMaxStamina = currentState.baseMaxStamina;
        let newMaxMana = currentState.baseMaxMana;

        Object.values(currentState.equipment).forEach(item => {
            if (item && item.effect) {
                newAttack += item.effect.attack || 0;
                newDefense += item.effect.defense || 0;
                newMaxHp += item.effect.maxHp || 0;
                newMaxStamina += item.effect.maxStamina || 0;
                newMaxMana += item.effect.maxMana || 0;
            }
        });

        newState.attack = newAttack;
        newState.defense = newDefense;
        newState.maxHp = newMaxHp;
        newState.maxStamina = newMaxStamina;
        newState.maxMana = newMaxMana;
        
        // Clamp current stats to new max values
        newState.hp = Math.min(newState.hp, newState.maxHp);
        newState.stamina = Math.min(newState.stamina, newState.maxStamina);
        newState.mana = Math.min(newState.mana, newState.maxMana);

        return newState;
    }, []);

    const saveGame = useCallback(() => {
        if (gameState.phase !== 'EXPLORING' && gameState.phase !== 'COMBAT') {
            setNotification("Chỉ có thể lưu trong quá trình chơi.");
            return;
        }

        try {
            const saveData = {
                playerState,
                gameState,
            };
            localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
            setSaveFileExists(true);
            const msg = "Trò chơi đã được lưu.";
            setNotification(msg);
            addLogEntry(msg);
        } catch (e) {
            console.error("Lỗi khi lưu game:", e);
            const msg = "Không thể lưu trò chơi.";
            setNotification(msg);
            addLogEntry(msg);
        }
    }, [playerState, gameState, addLogEntry, setSaveFileExists, setNotification]);

    const loadGame = useCallback(() => {
        if (!apiKey) {
            setNotification("Vui lòng nhập API Key để tải trò chơi.");
            return;
        }
        try {
            const savedDataString = localStorage.getItem(SAVE_KEY);
            if (savedDataString) {
                const savedData = JSON.parse(savedDataString);
                
                if (savedData.playerState && savedData.gameState && savedData.gameState.difficulty) {
                    
                    const loadedPlayerState = savedData.playerState;
                    // Ensure equipment field exists for older saves
                    if (!loadedPlayerState.equipment) {
                        loadedPlayerState.equipment = {};
                    }

                    setPlayerState(recalculateStats(loadedPlayerState));
                    setGameState(savedData.gameState);

                    gameAIService.current = new GameAIService(savedData.gameState.difficulty, apiKey);
                    
                    const msg = "Đã tải lại trò chơi từ điểm lưu cuối cùng.";
                    setNotification(msg);
                    addLogEntry(msg);
                } else {
                    throw new Error("Dữ liệu lưu không hợp lệ.");
                }
            }
        } catch (e) {
            console.error("Lỗi khi tải game:", e);
            localStorage.removeItem(SAVE_KEY);
            setSaveFileExists(false);
            const msg = "Không thể tải dữ liệu đã lưu. Bắt đầu trò chơi mới.";
            setNotification(msg);
            addLogEntry(msg);
        }
    }, [apiKey, addLogEntry, recalculateStats, setPlayerState, setGameState, setNotification, setSaveFileExists]);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification, setNotification]);

    const processGameData = useCallback((gameData: GameData) => {
        setGameState(prevState => ({
            ...prevState,
            phase: gameData.gameState,
            narrative: gameData.narrative,
            choices: gameData.choices,
        }));

        setPlayerState(prevPlayerState => {
            let newPlayerState = { ...prevPlayerState };

            if (gameData.statusUpdate) {
                const newHp = Math.max(0, newPlayerState.hp + (gameData.statusUpdate.hpChange || 0));
                const newStamina = Math.max(0, Math.min(newPlayerState.maxStamina, newPlayerState.stamina + (gameData.statusUpdate.staminaChange || 0)));
                const newMana = Math.max(0, Math.min(newPlayerState.maxMana, newPlayerState.mana + (gameData.statusUpdate.manaChange || 0)));
                const newCurrency = newPlayerState.currency + (gameData.statusUpdate.currencyChange || 0);

                newPlayerState = { ...newPlayerState, hp: newHp, stamina: newStamina, mana: newMana, currency: newCurrency };
                
                if (gameData.statusUpdate.bodyPartInjuries && gameData.statusUpdate.bodyPartInjuries.length > 0) {
                    const newBodyStatus = { ...newPlayerState.bodyStatus };
                    const newEquipment = { ...newPlayerState.equipment };
                    let newInventory = [...newPlayerState.inventory];
                    
                    for (const injury of gameData.statusUpdate.bodyPartInjuries) {
                        newBodyStatus[injury.part] = injury.level;
                         if (injury.level === 'SEVERED') {
                             // If a limb is severed, unequip items from it
                             if(injury.part === 'rightArm' || injury.part === 'leftArm'){
                                 const itemInWeaponSlot = newEquipment['weapon'];
                                 if(itemInWeaponSlot){
                                     delete newEquipment['weapon'];
                                     newInventory.push(itemInWeaponSlot);
                                 }
                             }
                         }
                    }
                    newPlayerState = { ...newPlayerState, bodyStatus: newBodyStatus, equipment: newEquipment, inventory: newInventory };
                }

                if (newHp === 0 && gameData.gameState !== 'GAMEOVER') {
                    setGameState(g => ({...g, phase: 'GAMEOVER'}));
                }
            }
            
            if (gameData.itemsFound && gameData.itemsFound.length > 0) {
                newPlayerState = { ...newPlayerState, inventory: [...newPlayerState.inventory, ...gameData.itemsFound] };
            }

            if (gameData.skillsLearned && gameData.skillsLearned.length > 0) {
                const currentSkillIds = new Set(newPlayerState.skills.map(s => s.id));
                const newSkillsToAdd = gameData.skillsLearned.filter(s => !currentSkillIds.has(s.id));
                if (newSkillsToAdd.length > 0) {
                     newPlayerState = { ...newPlayerState, skills: [...newPlayerState.skills, ...newSkillsToAdd] };
                }
            }

            const newCooldowns = { ...newPlayerState.skillCooldowns };
            let cooldownsChanged = false;
            for (const skillId in newCooldowns) {
                if (newCooldowns[skillId] > 1) {
                    newCooldowns[skillId] -= 1;
                    cooldownsChanged = true;
                } else if (newCooldowns[skillId] === 1) {
                    delete newCooldowns[skillId];
                    cooldownsChanged = true;
                }
            }
            if (cooldownsChanged) {
              newPlayerState = { ...newPlayerState, skillCooldowns: newCooldowns };
            }

            if (gameData.companionsAdded) {
                newPlayerState = { ...newPlayerState, companions: [...newPlayerState.companions, ...gameData.companionsAdded] };
            }
            if (gameData.companionsRemoved) {
                newPlayerState = { ...newPlayerState, companions: newPlayerState.companions.filter(c => !gameData.companionsRemoved?.includes(c.id)) };
            }
            if (gameData.companionUpdates) {
                 newPlayerState = {
                    ...newPlayerState,
                    companions: newPlayerState.companions.map(c => {
                        const update = gameData.companionUpdates?.find(u => u.id === c.id);
                        if (update) {
                            const newCompanionHp = Math.max(0, Math.min(c.maxHp, c.hp + (update.hpChange || 0)));
                            return { ...c, hp: newCompanionHp };
                        }
                        return c;
                    })
                };
            }

            if (gameData.questsAdded) {
                newPlayerState = { ...newPlayerState, quests: [...newPlayerState.quests, ...gameData.questsAdded] };
            }
            if (gameData.questUpdates) {
                newPlayerState = {
                    ...newPlayerState,
                    quests: newPlayerState.quests.map(q => {
                        const update = gameData.questUpdates?.find(u => u.id === q.id);
                        return update ? { ...q, status: update.status } : q;
                    })
                };
            }

            return newPlayerState;
        });
        
        const notificationParts: string[] = [];
        const currencyChange = gameData.statusUpdate?.currencyChange || 0;
        if (currencyChange > 0) {
            notificationParts.push(`Bạn đã nhận được ${currencyChange} Mảnh Vỡ Linh Hồn.`);
        } else if (currencyChange < 0) {
            notificationParts.push(`Bạn đã mất ${Math.abs(currencyChange)} Mảnh Vỡ Linh Hồn.`);
        }
        if (gameData.itemsFound && gameData.itemsFound.length > 0) {
            const itemNames = gameData.itemsFound.map(item => item.name).join(', ');
            notificationParts.push(`Bạn đã tìm thấy: ${itemNames}.`);
        }
        if (gameData.skillsLearned && gameData.skillsLearned.length > 0) {
            notificationParts.push(`Kỹ năng mới: ${gameData.skillsLearned.map(s => s.name).join(', ')}!`);
        }
        if (gameData.questsAdded && gameData.questsAdded.length > 0) {
             notificationParts.push(`Nhiệm vụ mới: ${gameData.questsAdded.map(q => q.title).join(', ')}.`);
        }
         if (gameData.questUpdates?.some(q => q.status === 'COMPLETED')) {
             notificationParts.push(`Nhiệm vụ đã hoàn thành!`);
        }
        if(gameData.companionsAdded && gameData.companionsAdded.length > 0){
            notificationParts.push(`${gameData.companionsAdded.map(c => c.name).join(', ')} đã gia nhập nhóm.`);
        }

        if (notificationParts.length > 0) {
            const message = notificationParts.join(' ');
            setNotification(message);
            addLogEntry(message);
        }
    }, [addLogEntry, setGameState, setPlayerState, setNotification]);

    const handleAction = useCallback(async (choice: Choice) => {
        if (!gameAIService.current || isLoading) return;

        const staminaCost = choice.staminaCost || 0;
        if (playerState.stamina < staminaCost) {
            const msg = "Không đủ thể lực để thực hiện hành động này.";
            setNotification(msg);
            addLogEntry(msg);
            return;
        }

        setIsLoading(true);
        if (staminaCost > 0) {
            setPlayerState(prev => ({ ...prev, stamina: Math.max(0, prev.stamina - staminaCost) }));
        }

        try {
            const response = await gameAIService.current.sendAction(choice.prompt);
            let gameData: GameData;

            try {
                const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
                gameData = JSON.parse(cleanResponse);
            } catch (e) {
                console.error("Không thể phân tích phản hồi JSON từ AI:", e, "Phản hồi thô từ AI:", response);
                 gameData = {
                    narrative: "Một sự im lặng đáng lo ngại bao trùm. Con đường phía trước bị che khuất bởi một màn sương mờ của sự không chắc chắn. Có lẽ bạn nên thử một cái gì đó khác.",
                    choices: gameState.choices,
                    statusUpdate: null,
                    gameState: 'EXPLORING',
                    itemsFound: null,
                    skillsLearned: null,
                    companionsAdded: null,
                    companionsRemoved: null,
                    companionUpdates: null,
                    questsAdded: null,
                    questUpdates: null,
                };
            }
            processGameData(gameData);
            handleGameTick();
        } catch (e) {
            console.error("Lỗi khi xử lý hành động:", e);
            const msg = `Một cơn gió lạnh lẽo thì thầm về những phép thuật bị lãng quên. (Lỗi: Các linh hồn đang im lặng. Vui lòng thử lại.)`;
            setGameState(prevState => ({ ...prevState, narrative: msg }));
            addLogEntry("Lỗi hệ thống: Không thể xử lý hành động.");
        } finally {
            setIsLoading(false);
        }
    }, [playerState, gameState, addLogEntry, isLoading, processGameData, handleGameTick, setNotification, setIsLoading, setPlayerState, setGameState]);
    
     const handleCustomAction = useCallback(async (actionText: string) => {
        if (!gameAIService.current || isLoading || !actionText.trim()) return;

        setIsLoading(true);
        setCustomActionInput('');

        const prompt = `Người chơi thực hiện một hành động tùy chỉnh: "${actionText}". Mô tả kết quả của hành động này trong câu chuyện.`;

        try {
            const response = await gameAIService.current.sendAction(prompt);
            let gameData: GameData;

            try {
                const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
                gameData = JSON.parse(cleanResponse);
            } catch (e) {
                console.error("Không thể phân tích phản hồi JSON từ AI cho hành động tùy chỉnh:", e, "Phản hồi thô từ AI:", response);
                 gameData = {
                    narrative: "Hành động của bạn dường như không gây ra hiệu ứng gì. Có lẽ thế giới không phản hồi lại với những ý định như vậy, hoặc có lẽ bạn cần phải thử một cách khác.",
                    choices: gameState.choices,
                    statusUpdate: null,
                    gameState: 'EXPLORING',
                    itemsFound: null,
                    skillsLearned: null,
                    companionsAdded: null,
                    companionsRemoved: null,
                    companionUpdates: null,
                    questsAdded: null,
                    questUpdates: null,
                };
            }
            processGameData(gameData);
            handleGameTick();
        } catch (e) {
            console.error("Lỗi khi xử lý hành động tùy chỉnh:", e);
            const msg = `Những tiếng thì thầm trong bóng tối chế nhạo nỗ lực của bạn. (Lỗi: Hành động tùy chỉnh thất bại. Vui lòng thử lại.)`;
            setGameState(prevState => ({ ...prevState, narrative: msg }));
            addLogEntry("Lỗi hệ thống: Không thể xử lý hành động tùy chỉnh.");
        } finally {
            setIsLoading(false);
        }
    }, [gameState, addLogEntry, isLoading, processGameData, handleGameTick, setCustomActionInput, setIsLoading, setGameState]);


    const handleUseSkill = useCallback(async (skill: Skill) => {
        if (!gameAIService.current || isLoading) return;

        if (playerState.skillCooldowns[skill.id] > 0) {
            const msg = `Kỹ năng ${skill.name} đang trong thời gian hồi.`;
            setNotification(msg);
            addLogEntry(msg);
            return;
        }

        const resourcePool = skill.costType === 'MANA' ? playerState.mana : playerState.stamina;
        if (resourcePool < skill.cost) {
            const msg = `Không đủ ${skill.costType === 'MANA' ? 'mana' : 'thể lực'} để dùng ${skill.name}.`;
            setNotification(msg);
            addLogEntry(msg);
            return;
        }

        setIsLoading(true);
        setPlayerState(prev => {
            const newCooldowns = { ...prev.skillCooldowns, [skill.id]: skill.cooldown };
            const newMana = skill.costType === 'MANA' ? Math.max(0, prev.mana - skill.cost) : prev.mana;
            const newStamina = skill.costType === 'STAMINA' ? Math.max(0, prev.stamina - skill.cost) : prev.stamina;
            return { ...prev, mana: newMana, stamina: newStamina, skillCooldowns: newCooldowns };
        });

        const prompt = `Tôi sử dụng kỹ năng '${skill.name}'. Mô tả hậu quả của việc sử dụng kỹ năng này trong câu chuyện.`;

        try {
            const response = await gameAIService.current.sendAction(prompt);
            let gameData: GameData;

            try {
                const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
                gameData = JSON.parse(cleanResponse);
            } catch (e) {
                 console.error("Không thể phân tích phản hồi JSON từ AI:", e, "Phản hồi thô từ AI:", response);
                 gameData = {
                    narrative: `Năng lượng từ kỹ năng ${skill.name} của bạn bị tiêu tan vào không khí một cách vô hại. Dường như có gì đó đã chặn nó lại.`,
                    choices: gameState.choices,
                    statusUpdate: null,
                    gameState: 'EXPLORING',
                    itemsFound: null,
                    skillsLearned: null,
                    companionsAdded: null,
                    companionsRemoved: null,
                    companionUpdates: null,
                    questsAdded: null,
                    questUpdates: null,
                };
            }
            processGameData(gameData);
            handleGameTick();
        } catch (e) {
            console.error("Lỗi khi xử lý kỹ năng:", e);
            const msg = `Năng lượng ma thuật trở nên hỗn loạn. (Lỗi: Không thể sử dụng kỹ năng. Vui lòng thử lại.)`;
            setGameState(prevState => ({ ...prevState, narrative: msg }));
            addLogEntry("Lỗi hệ thống: Không thể xử lý kỹ năng.");
        } finally {
            setIsLoading(false);
        }
    }, [playerState, gameState, addLogEntry, isLoading, processGameData, handleGameTick, setNotification, setIsLoading, setPlayerState, setGameState]);

    const handleUseItem = useCallback((itemToUse: Item) => {
        if (itemToUse.type === 'POTION') {
            setPlayerState(prev => {
                const hpGain = itemToUse.effect?.hp || 0;
                const manaGain = itemToUse.effect?.mana || 0;

                if (hpGain > 0 && prev.hp === prev.maxHp) {
                    setNotification("Máu của bạn đã đầy.");
                    return prev;
                }
                if (manaGain > 0 && prev.mana === prev.maxMana) {
                    setNotification("Mana của bạn đã đầy.");
                    return prev;
                }
                
                const healedHp = Math.min(prev.maxHp, prev.hp + hpGain);
                const restoredMana = Math.min(prev.maxMana, prev.mana + manaGain);
                const hpRestored = healedHp - prev.hp;
                const manaRestored = restoredMana - prev.mana;
                
                const itemIndex = prev.inventory.findIndex(item => item.id === itemToUse.id);
                if (itemIndex > -1) {
                    const newInventory = [...prev.inventory];
                    newInventory.splice(itemIndex, 1);
                    
                    let msgParts: string[] = [];
                    if (hpRestored > 0) msgParts.push(`hồi phục ${hpRestored} máu`);
                    if (manaRestored > 0) msgParts.push(`hồi phục ${manaRestored} mana`);
                    
                    const msg = `Bạn đã dùng một ${itemToUse.name} và ${msgParts.join(' và ')}.`;
                    setNotification(msg);
                    addLogEntry(msg);
                    
                    return {...prev, hp: healedHp, mana: restoredMana, inventory: newInventory };
                }
                return prev;
            });
        }
    }, [addLogEntry, setPlayerState, setNotification]);

    const handleEquipItem = useCallback((itemToEquip: Item) => {
        if (!itemToEquip.equipmentSlot) return;

        setPlayerState(prev => {
            const slot = itemToEquip.equipmentSlot!;
            const currentlyEquipped = prev.equipment[slot];
            
            // Remove from inventory
            const newInventory = prev.inventory.filter(i => i.id !== itemToEquip.id);
            // Add previously equipped item back to inventory, if any
            if (currentlyEquipped) {
                newInventory.push(currentlyEquipped);
            }

            // Equip new item
            const newEquipment = { ...prev.equipment, [slot]: itemToEquip };

            const tempState = { ...prev, inventory: newInventory, equipment: newEquipment };
            const finalState = recalculateStats(tempState);

            const msg = `Đã trang bị: ${itemToEquip.name}.`;
            setNotification(msg);
            addLogEntry(msg);

            return finalState;
        });
    }, [recalculateStats, addLogEntry, setPlayerState, setNotification]);

    const handleUnequipItem = useCallback((slot: EquipmentSlot) => {
        setPlayerState(prev => {
            const itemToUnequip = prev.equipment[slot];
            if (!itemToUnequip) return prev;

            // Remove from equipment
            const newEquipment = { ...prev.equipment };
            delete newEquipment[slot];

            // Add back to inventory
            const newInventory = [...prev.inventory, itemToUnequip];

            const tempState = { ...prev, inventory: newInventory, equipment: newEquipment };
            const finalState = recalculateStats(tempState);

            const msg = `Đã gỡ bỏ: ${itemToUnequip.name}.`;
            setNotification(msg);
            addLogEntry(msg);
            
            return finalState;
        });
    }, [recalculateStats, addLogEntry, setPlayerState, setNotification]);
    
    const handleStartGame = useCallback(() => {
        if (saveFileExists) {
            setIsNewGameConfirmOpen(true);
        } else {
            setGameState(prevState => ({ ...prevState, phase: 'CHARACTER_CREATION' }));
        }
    }, [saveFileExists, setIsNewGameConfirmOpen, setGameState]);
    
    const handleConfirmNewGame = useCallback(() => {
        try {
            localStorage.removeItem(SAVE_KEY);
            setSaveFileExists(false);
        } catch (e) {
            console.error("Không thể xóa dữ liệu đã lưu:", e);
        }
        setIsNewGameConfirmOpen(false);
        setGameState(prevState => ({ ...prevState, phase: 'CHARACTER_CREATION' }));
    }, [setIsNewGameConfirmOpen, setGameState, setSaveFileExists]);

    const handleCancelNewGame = useCallback(() => {
        setIsNewGameConfirmOpen(false);
    }, [setIsNewGameConfirmOpen]);

    const handleCharacterCreation = useCallback(async (details: { name: string; bio: string; characterClass: CharacterClass; difficulty: Difficulty; gender: Gender; personality: string; goal: string; }) => {
        if (!apiKey) {
            setNotification("Lỗi: API Key không tồn tại. Không thể bắt đầu trò chơi.");
            return;
        }
        
        const { name, bio, characterClass, difficulty, gender, personality, goal } = details;
        
        gameAIService.current = new GameAIService(difficulty, apiKey);

        const classData = CLASSES[characterClass];
        const baseState = {
            ...INITIAL_PLAYER_STATE,
            name,
            bio,
            class: characterClass,
            gender,
            personality,
            goal,
            ...classData.stats,
            hp: classData.stats.baseMaxHp,
            stamina: classData.stats.baseMaxStamina,
            mana: classData.stats.baseMaxMana,
        };
        
        setPlayerState(recalculateStats(baseState));

        const goalPrompt = goal
            ? `và mục tiêu chính của họ là "${goal}"`
            : "và họ đang tìm kiếm mục tiêu cho mình trong thế giới hoang tàn này";

        const initialPrompt = `Nhân vật của tôi tên là ${name}, một ${characterClass} ${gender}. Tính cách của họ là ${personality}, ${goalPrompt}. Tiểu sử: "${bio || 'Một quá khứ bị che giấu trong bí ẩn.'}". Tôi tỉnh dậy trong một tàn tích hoang vắng. Hãy mô tả những khoảnh khắc đầu tiên của tôi, môi trường xung quanh, và đưa ra những lựa chọn đầu tiên dựa trên những đặc điểm này. Cho tôi bắt đầu với một bình thuốc hồi máu đơn giản.`;

        setIsLoading(true);
        setGameState(prevState => ({ ...prevState, phase: 'EXPLORING', narrative: "Câu chuyện của bạn sắp bắt đầu...", difficulty: difficulty }));
        
        await handleAction({ text: "Bắt đầu", prompt: initialPrompt });

    }, [apiKey, handleAction, recalculateStats, setPlayerState, setIsLoading, setGameState]);

    const restartGame = useCallback(() => {
        setPlayerState(INITIAL_PLAYER_STATE);
        setGameState({
            phase: 'TITLE_SCREEN',
            narrative: '',
            choices: [],
            difficulty: null,
        });
        setLog([]);
        setIsInventoryOpen(false);
        setIsEquipmentOpen(false);
        setIsExitConfirmOpen(false);
        setIsNewGameConfirmOpen(false);
        setNotification('');
        gameAIService.current = null;
    }, [setPlayerState, setGameState, setLog, setIsInventoryOpen, setIsEquipmentOpen, setIsExitConfirmOpen, setIsNewGameConfirmOpen, setNotification]);



    const handleDeathAndRestart = useCallback(() => {
        if (gameState.difficulty === 'Ác Mộng') {
            try {
                localStorage.removeItem(SAVE_KEY);
                setSaveFileExists(false);
                addLogEntry("Tiến trình đã được xóa do nhân vật gục ngã trong chế độ Ác Mộng.");
            } catch (e) {
                console.error("Không thể xóa dữ liệu đã lưu khi chết:", e);
            }
        } else {
            addLogEntry("Bạn đã gục ngã. Tải lại trò chơi để tiếp tục từ điểm lưu cuối cùng của bạn.");
        }
        restartGame();
    }, [restartGame, addLogEntry, setSaveFileExists, gameState.difficulty]);

    const handleRequestExit = useCallback(() => {
        setIsExitConfirmOpen(true);
    }, [setIsExitConfirmOpen]);

    const handleConfirmExit = useCallback(() => {
        restartGame();
    }, [restartGame]);

    const handleCancelExit = useCallback(() => {
        setIsExitConfirmOpen(false);
    }, [setIsExitConfirmOpen]);


    if (gameState.phase === 'TITLE_SCREEN') {
        return <StartScreen 
            onStartGame={handleStartGame} 
            onLoadGame={loadGame} 
            saveFileExists={saveFileExists}
            apiKey={apiKey}
            onSetApiKey={handleSetApiKey}
        />;
    }

    if (gameState.phase === 'CHARACTER_CREATION') {
        return <CharacterCreationScreen onCharacterCreate={handleCharacterCreation} />;
    }

    if (gameState.phase === 'GAMEOVER') {
        return <GameOverScreen onRestart={handleDeathAndRestart} />;
    }

    return (
        <div className="bg-gray-900 text-gray-300 min-h-screen flex flex-col items-center p-4 selection:bg-red-900/50 selection:text-white">
            <header className="w-full max-w-7xl flex justify-between items-center mb-4">
                 <div className="w-10 h-10" />
                <h1 className="text-4xl md:text-5xl font-title text-red-500 tracking-wider shadow-lg">{GAME_TITLE}</h1>
                <button
                    onClick={handleRequestExit}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors p-2 rounded-full"
                    title="Thoát ra Menu Chính"
                >
                    <IconExit size={24} />
                </button>
            </header>
            
            <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <NarrativePanel narrative={gameState.narrative} isLoading={isLoading} />
                </div>
                
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <PlayerStatsPanel playerState={playerState} />
                    <CompanionsPanel companions={playerState.companions} />
                    <ActionPanel 
                        choices={gameState.choices} 
                        onAction={handleAction} 
                        isLoading={isLoading} 
                        playerState={playerState}
                        customActionInput={customActionInput}
                        setCustomActionInput={setCustomActionInput}
                        onCustomAction={handleCustomAction}
                     />
                    <SkillsPanel playerState={playerState} onUseSkill={handleUseSkill} isLoading={isLoading} />
                    <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-gray-700 backdrop-blur-sm">
                         <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => setIsInventoryOpen(true)}
                                className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-red-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                                <IconInventory /> Hành Trang
                            </button>
                             <button
                                onClick={() => setIsEquipmentOpen(true)}
                                className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-yellow-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                            >
                                <IconEquipment /> Trang Bị
                            </button>
                             <button
                                onClick={saveGame}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-blue-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                <IconSave /> Lưu
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            
            <InventoryScreen 
                isOpen={isInventoryOpen}
                onClose={() => setIsInventoryOpen(false)}
                playerState={playerState}
                onUseItem={handleUseItem}
                log={log}
            />

            <EquipmentScreen
                isOpen={isEquipmentOpen}
                onClose={() => setIsEquipmentOpen(false)}
                playerState={playerState}
                onEquipItem={handleEquipItem}
                onUnequipItem={handleUnequipItem}
            />

            {notification && (
                 <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white py-2 px-6 rounded-lg shadow-lg border border-red-500/50 animate-fadeIn z-50">
                    <p>{notification}</p>
                </div>
            )}

            {isNewGameConfirmOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-gray-800 border border-yellow-500/30 rounded-lg shadow-2xl p-8 max-w-md text-center">
                        <h2 className="text-2xl font-title text-yellow-400 mb-4">Bắt Đầu Lại?</h2>
                        <p className="text-gray-400 mb-8">
                            Một file lưu đã tồn tại. Bắt đầu một trò chơi mới sẽ xóa toàn bộ tiến trình trước đó. Bạn có muốn tiếp tục?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleCancelNewGame}
                                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmNewGame}
                                className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                            >
                                Xóa và Bắt Đầu Mới
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isExitConfirmOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-gray-800 border border-red-500/30 rounded-lg shadow-2xl p-8 max-w-md text-center">
                        <h2 className="text-2xl font-title text-red-400 mb-4">Thoát Game?</h2>
                        <p className="text-gray-400 mb-8">
                            Mọi tiến trình chưa được lưu sẽ bị mất. Bạn có chắc chắn muốn quay trở lại menu chính?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleCancelExit}
                                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmExit}
                                className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
