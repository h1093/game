import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, PlayerState, GameData, Choice, Origin, Item, Difficulty, Quest, Companion, Skill, EquipmentSlot, Gender, Sanctuary, Enemy, NPC, Follower, OuterGodMark } from './types';
import { INITIAL_PLAYER_STATE, GAME_TITLE, ORIGINS, SAVE_KEY, API_KEYS_STORAGE_KEY, API_SOURCE_STORAGE_KEY, DYNAMIC_WORLD_EVENT_TURN_MIN, DYNAMIC_WORLD_EVENT_TURN_MAX, BASE_STATS_BEFORE_POINT_BUY, OUTER_GODS, PERSONALITIES, ALL_TALENTS_MAP, MARK_TITLES, FAITH_THRESHOLDS, DIFFICULTY_MODIFIERS } from './constants';
import { GameAIService } from './services/geminiService';
import NarrativePanel from './components/NarrativePanel';
import CombatPanel from './components/CombatPanel';
import PlayerStatsPanel from './components/PlayerStatsPanel';
import GameOverScreen from './components/GameOverScreen';
import StartScreen from './components/StartScreen';
import CharacterCreationScreen from './components/CharacterCreationScreen';
import InventoryScreen from './components/InventoryScreen';
import EquipmentScreen from './components/EquipmentScreen';
import InfoTabsPanel from './components/InfoTabsPanel';
import ApiKeyManager from './components/ApiKeyManager';
import CustomJourneyScreen from './components/CustomJourneyScreen';
import CreatorsWillScreen from './components/CreatorsWillScreen';

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

const MATURE_CONTENT_KEY = "darkFantasyMatureContent";

const App: React.FC = () => {
    const [playerState, setPlayerState] = useState<PlayerState>(INITIAL_PLAYER_STATE);
    const [gameState, setGameState] = useState<GameState>({
        phase: 'TITLE_SCREEN',
        narrative: '',
        choices: [],
        difficulty: null,
        turn: 0,
        nextDynamicWorldEventTurn: 0,
        enemies: [],
        combatLog: [],
        npcsInScene: [],
        customJourneyPrompt: '',
        isCreatorsWillActive: false,
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [notification, setNotification] = useState<string>('');
    const [showTurnNotification, setShowTurnNotification] = useState<number | null>(null);
    const [showDynamicWorldNotification, setShowDynamicWorldNotification] = useState<boolean>(false);
    const [log, setLog] = useState<string[]>([]);
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);
    const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
    const [isNewGameConfirmOpen, setIsNewGameConfirmOpen] = useState(false);
    const [saveFileExists, setSaveFileExists] = useState<boolean>(false);
    const [customActionInput, setCustomActionInput] = useState('');
    const [isCombatTestStarting, setIsCombatTestStarting] = useState<boolean>(false);
    const [lastTurnTokenUsage, setLastTurnTokenUsage] = useState<number>(0);
    const gameAIService = useRef<GameAIService | null>(null);
    
    // API Key Management State
    const [isApiKeyManagerOpen, setIsApiKeyManagerOpen] = useState(false);
    const [apiSource, setApiSource] = useState<'default' | 'user'>('default');
    const [userApiKeys, setUserApiKeys] = useState<string[]>([]);
    const [currentApiKeyIndex, setCurrentApiKeyIndex] = useState(0);
    const [activeApiKey, setActiveApiKey] = useState<string | undefined>(undefined);

    // App settings
    const [isMatureContent, setIsMatureContent] = useState<boolean>(false);

    // Refs to ensure callbacks always have the latest state, preventing stale state bugs.
    const playerStateRef = useRef(playerState);
    useEffect(() => {
        playerStateRef.current = playerState;
    }, [playerState]);

    const gameStateRef = useRef(gameState);
    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    const addLogEntry = useCallback((message: string) => {
        if (!message) return;
        const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        setLog(prevLog => [`[${timestamp}] ${message}`, ...prevLog].slice(0, 50));
    }, [setLog]);

    useEffect(() => {
        try {
            if (localStorage.getItem(SAVE_KEY)) {
                setSaveFileExists(true);
            }
            // Load API Key settings
            const savedApiSource = localStorage.getItem(API_SOURCE_STORAGE_KEY) as 'default' | 'user' | null;
            const savedApiKeys = localStorage.getItem(API_KEYS_STORAGE_KEY);
            const savedMatureContent = localStorage.getItem(MATURE_CONTENT_KEY);

            if (savedApiSource) {
                setApiSource(savedApiSource);
            }
            if (savedApiKeys) {
                setUserApiKeys(JSON.parse(savedApiKeys));
            }
            if (savedMatureContent) {
                setIsMatureContent(JSON.parse(savedMatureContent));
            }

        } catch (e) {
            console.error("Không thể truy cập localStorage:", e);
        }
    }, []);

    // Effect to determine the active API key
    useEffect(() => {
        if (apiSource === 'user' && userApiKeys.length > 0) {
            setActiveApiKey(userApiKeys[currentApiKeyIndex]);
        } else {
            setActiveApiKey(process.env.API_KEY);
        }
    }, [apiSource, userApiKeys, currentApiKeyIndex]);

    // Effect to re-create the service when the key, difficulty or mature setting changes
    useEffect(() => {
        if (activeApiKey && gameState.difficulty && (gameState.phase === 'EXPLORING' || gameState.phase === 'COMBAT')) {
            try {
                // Do not re-initialize if it's the very first turn, as the story-start effect handles that.
                if (gameState.turn > 0) {
                    gameAIService.current = new GameAIService(gameState.difficulty, activeApiKey, isMatureContent, gameState.customJourneyPrompt, gameState.isCreatorsWillActive);
                    addLogEntry(`Dịch vụ AI được khởi tạo lại với nguồn ${apiSource === 'default' ? 'mặc định' : 'người dùng'}. Chế độ 18+ ${isMatureContent ? 'bật' : 'tắt'}.`);
                }
            } catch (error) {
                console.error("Lỗi khởi tạo GameAIService:", error);
                setNotification("Lỗi: Không thể khởi tạo dịch vụ AI. Vui lòng kiểm tra API key.");
            }
        }
    }, [activeApiKey, gameState.difficulty, isMatureContent, apiSource, addLogEntry, gameState.customJourneyPrompt, gameState.isCreatorsWillActive]);


    const recalculateStats = useCallback((currentState: PlayerState): PlayerState => {
        const newState = { ...currentState };
        let newAttack = currentState.baseAttack;
        let newDefense = currentState.baseDefense;
        let newCharisma = currentState.baseCharisma;
        let newMaxHp = currentState.baseMaxHp;
        let newMaxStamina = currentState.baseMaxStamina;
        let newMaxMana = currentState.baseMaxMana;
        let newMaxSanity = currentState.baseMaxSanity;
        let newMaxHunger = currentState.baseMaxHunger;
        let newMaxThirst = currentState.baseMaxThirst;
        
        // Talent effects
        const talentId = currentState.talent;
        if (talentId) {
            const talentData = ALL_TALENTS_MAP.get(talentId);
            if (talentData?.effects) {
                newAttack += talentData.effects.baseAttack || 0;
                newDefense += talentData.effects.baseDefense || 0;
                newCharisma += talentData.effects.baseCharisma || 0;
                newMaxHp += talentData.effects.baseMaxHp || 0;
                newMaxStamina += talentData.effects.baseMaxStamina || 0;
                newMaxMana += talentData.effects.baseMaxMana || 0;
                newMaxSanity += talentData.effects.baseMaxSanity || 0;
            }
        }

        // Personality base stat effects
        const personality = currentState.personality ? PERSONALITIES[currentState.personality] : null;
        if (personality) {
            const pMechanics = personality.effects.mechanics;
            newAttack += pMechanics.baseAttack || 0;
            newDefense += pMechanics.baseDefense || 0;
            newCharisma += pMechanics.baseCharisma || 0;
            newMaxHp += pMechanics.baseMaxHp || 0;
            newMaxStamina += pMechanics.baseMaxStamina || 0;
            newMaxMana += pMechanics.baseMaxMana || 0;
            newMaxSanity += pMechanics.baseMaxSanity || 0;

            // Conditional personality effects
            if (pMechanics.conditionalAttackBonus?.condition === 'LOW_HP' && currentState.hp < currentState.maxHp * 0.3) {
                newAttack += 5;
            }
            if (pMechanics.conditionalDefenseBonus?.condition === 'LOW_SANITY' && currentState.sanity < currentState.maxSanity * 0.5) {
                newDefense += 3;
            }
        }

        // Equipment stats
        Object.values(currentState.equipment).forEach(item => {
            if (item && item.effect) {
                newAttack += item.effect.attack || 0;
                newDefense += item.effect.defense || 0;
                newCharisma += item.effect.charisma || 0;
                newMaxHp += item.effect.maxHp || 0;
                newMaxStamina += item.effect.maxStamina || 0;
                newMaxMana += item.effect.maxMana || 0;
                newMaxSanity += item.effect.maxSanity || 0;
            }
        });

        // Proficiency bonus
        const equippedWeapon = currentState.equipment.weapon;
        const weaponType = equippedWeapon?.weaponType || 'UNARMED';
        const proficiency = currentState.proficiency[weaponType];
        if (proficiency) {
            const proficiencyBonus = proficiency.level - 1; // +1 attack/defense per level above 1
            if (proficiencyBonus > 0) {
                newAttack += proficiencyBonus;
                newDefense += proficiencyBonus;
            }
        }
        
        // Succubus Pact effects
        if (currentState.hasSuccubusPact) {
            newCharisma += 10;
            newMaxSanity -= 20;
            if (currentState.sanity < 30) {
                newAttack += 5; // Vẻ Đẹp Điên Loạn bonus
            }
        }

        // Sanity penalties
        if (currentState.sanity < 50) {
            newDefense -= 2;
        }
        if (currentState.sanity < 25) {
            newDefense -= 2; // total -4 from base
            newAttack -= 2;  // total -2 from base
        }

        // Mark of Sacrifice bonus/penalty
        if (currentState.isMarked) {
            newAttack += 1;     // Sức mạnh tuyệt vọng: +1 Tấn công.
            newMaxSanity -= 15; // Ám ảnh thường trực: -15 Tâm trí tối đa.
            newCharisma -= 5;   // Vẻ ngoài đáng sợ: -5 Sức hấp dẫn.
        }

        // Outer God Mark effects
        if (currentState.outerGodMark) {
            const markEffects = OUTER_GODS[currentState.outerGodMark].effects;
            newAttack += markEffects.attack || 0;
            newDefense += markEffects.defense || 0;
            newCharisma += markEffects.charisma || 0;
            newMaxHp += markEffects.maxHp || 0;
            newMaxMana += markEffects.maxMana || 0;
            newMaxSanity += markEffects.maxSanity || 0;
        }

        newState.attack = Math.max(0, newAttack);
        newState.defense = Math.max(0, newDefense);
        newState.charisma = Math.max(0, newCharisma);
        newState.maxHp = newMaxHp;
        newState.maxStamina = newMaxStamina;
        newState.maxMana = newMaxMana;
        newState.maxSanity = Math.max(1, newMaxSanity); // Tâm trí tối đa không thể dưới 1
        newState.maxHunger = newMaxHunger;
        newState.maxThirst = newMaxThirst;
        
        // Clamp current stats to new max values
        newState.hp = Math.min(newState.hp, newState.maxHp);
        newState.stamina = Math.min(newState.stamina, newState.maxStamina);
        newState.mana = Math.min(newState.mana, newState.maxMana);
        newState.sanity = Math.min(newState.sanity, newState.maxSanity);
        newState.hunger = Math.min(newState.hunger, newState.maxHunger);
        newState.thirst = Math.min(newState.thirst, newState.maxThirst);

        return newState;
    }, []);

    const saveGame = useCallback(() => {
        // Use refs to get the latest state, preventing stale state bugs on save.
        if (gameStateRef.current.phase !== 'EXPLORING' && gameStateRef.current.phase !== 'COMBAT') {
            setNotification("Chỉ có thể lưu trong quá trình chơi.");
            return;
        }

        try {
            const saveData = {
                playerState: playerStateRef.current,
                gameState: gameStateRef.current,
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
    }, [addLogEntry, setSaveFileExists, setNotification]);

    const loadGame = useCallback(() => {
        try {
            const savedDataString = localStorage.getItem(SAVE_KEY);
            if (savedDataString) {
                const savedData = JSON.parse(savedDataString);
                
                if (savedData.playerState && savedData.gameState && savedData.gameState.difficulty) {
                    
                    let loadedPlayerState: PlayerState = savedData.playerState;
                    let loadedGameState: GameState = savedData.gameState;

                    // BACKWARDS COMPATIBILITY & DEFAULTS
                    loadedPlayerState = {...INITIAL_PLAYER_STATE, ...loadedPlayerState};
                    
                    loadedPlayerState.sanctuaries = (loadedPlayerState.sanctuaries || []).map((s: Sanctuary) => ({
                        ...s,
                        followers: s.followers || []
                    }));
                    
                    if (loadedPlayerState.charisma === undefined) {
                        loadedPlayerState.baseCharisma = loadedPlayerState.baseCharisma || 5;
                        loadedPlayerState.charisma = loadedPlayerState.charisma || 5;
                    }

                    if (loadedPlayerState.companions && loadedPlayerState.companions.length > 0) {
                        loadedPlayerState.companions = loadedPlayerState.companions.map((c: Companion) => ({
                            ...c,
                            affection: c.affection === undefined ? 0 : c.affection
                        }));
                    }
                    
                    if (loadedGameState.nextDynamicWorldEventTurn === undefined) {
                        loadedGameState.nextDynamicWorldEventTurn = loadedGameState.turn + DYNAMIC_WORLD_EVENT_TURN_MIN + Math.floor(Math.random() * (DYNAMIC_WORLD_EVENT_TURN_MAX - DYNAMIC_WORLD_EVENT_TURN_MIN + 1));
                    }

                    // Reset fields that shouldn't persist across loads
                    loadedGameState.enemies = loadedGameState.enemies || [];
                    loadedGameState.combatLog = [];
                    loadedGameState.npcsInScene = loadedGameState.npcsInScene || [];
                    loadedGameState.customJourneyPrompt = loadedGameState.customJourneyPrompt || '';
                    loadedGameState.isCreatorsWillActive = loadedGameState.isCreatorsWillActive || false;
                    loadedPlayerState.outerGodMark = loadedPlayerState.outerGodMark || null;
                    loadedPlayerState.godFragments = loadedPlayerState.godFragments || 0;
                    loadedPlayerState.talent = loadedPlayerState.talent || null;
                    loadedPlayerState.faith = loadedPlayerState.faith || {};


                    setPlayerState(recalculateStats(loadedPlayerState));
                    setGameState(loadedGameState); 
                    setLastTurnTokenUsage(0);
                    
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
    }, [addLogEntry, recalculateStats, setPlayerState, setGameState, setNotification, setSaveFileExists]);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification, setNotification]);
    
    useEffect(() => {
        if (showTurnNotification !== null) {
            const timer = setTimeout(() => {
                setShowTurnNotification(null);
            }, 2000); // Display for 2 seconds
            return () => clearTimeout(timer);
        }
    }, [showTurnNotification]);

    useEffect(() => {
        if (showDynamicWorldNotification) {
            const timer = setTimeout(() => {
                setShowDynamicWorldNotification(false);
            }, 3000); // Display for 3 seconds
            return () => clearTimeout(timer);
        }
    }, [showDynamicWorldNotification]);
    
    const handleApiError = useCallback((error: any) => {
        const isAuthError = error.toString().includes('API_KEY') || error.toString().includes('permission') || error.toString().includes('API Key');
        if (isAuthError && apiSource === 'user' && userApiKeys.length > 1) {
            const nextKeyIndex = (currentApiKeyIndex + 1) % userApiKeys.length;
            setCurrentApiKeyIndex(nextKeyIndex);
            const msg = "API Key không hợp lệ hoặc đã hết hạn. Tự động chuyển sang key tiếp theo.";
            setNotification(msg);
            addLogEntry(msg);
            // The useEffect chain will handle re-creating the service with the new key.
            // The user can then retry their action.
        } else if (isAuthError) {
             const msg = "Lỗi API: Key không hợp lệ hoặc bị thiếu. Vui lòng kiểm tra trong Quản lý API.";
             setNotification(msg);
             addLogEntry(msg);
             setGameState(prevState => ({ ...prevState, narrative: `${prevState.narrative}\n\n(Lỗi: ${msg})` }));
        }
         else {
             const msg = "Một cơn gió lạnh lẽo thì thầm về những phép thuật bị lãng quên. (Lỗi API không xác định).";
             setNotification(msg);
             setGameState(prevState => ({ ...prevState, narrative: `${prevState.narrative}\n\n(Lỗi: ${msg})` }));
             addLogEntry(`Lỗi hệ thống: Không thể xử lý hành động do lỗi API. ${error}`);
        }
    }, [apiSource, userApiKeys, currentApiKeyIndex, addLogEntry, setNotification, setGameState, setCurrentApiKeyIndex]);


    const processGameData = useCallback((gameData: GameData, isDynamicEventTriggered?: boolean) => {
        let profLevelUpMessage: string | null = null;
        
        // Apply pact-based modifications to the incoming data
        if (playerStateRef.current.hasSuccubusPact && gameData.statusUpdate && (gameData.statusUpdate.reputationChange || 0) > 0) {
            gameData.statusUpdate.reputationChange = 0;
        }

        setGameState(prevState => {
            const newTurn = (prevState.phase === 'EXPLORING' || prevState.phase === 'COMBAT') ? prevState.turn + 1 : prevState.turn;

            let nextEventTurn = prevState.nextDynamicWorldEventTurn;
            if (isDynamicEventTriggered) {
                nextEventTurn = newTurn + DYNAMIC_WORLD_EVENT_TURN_MIN + Math.floor(Math.random() * (DYNAMIC_WORLD_EVENT_TURN_MAX - DYNAMIC_WORLD_EVENT_TURN_MIN + 1));
                setShowDynamicWorldNotification(true);
            }

            if (newTurn > prevState.turn) {
                setShowTurnNotification(newTurn);
            }
            return {
                ...prevState,
                phase: gameData.gameState,
                narrative: gameData.narrative,
                choices: gameData.choices || [],
                turn: newTurn,
                nextDynamicWorldEventTurn: nextEventTurn,
                enemies: gameData.enemies || [],
                combatLog: gameData.combatLog || [],
                npcsInScene: gameData.npcsInScene ?? prevState.npcsInScene,
            };
        });

        setPlayerState(prevPlayerState => {
            let newPlayerState = { ...prevPlayerState };
            const personality = newPlayerState.personality ? PERSONALITIES[newPlayerState.personality] : null;
            let perTurnMessageParts: string[] = [];
            
            // Per-turn effects should only apply if a turn has actually passed
            const turnPassed = (gameStateRef.current.phase === 'EXPLORING' || gameStateRef.current.phase === 'COMBAT');
            if (turnPassed) {
                // 1. Hunger and Thirst drain based on difficulty
                const difficulty = gameStateRef.current.difficulty;
                if (difficulty) {
                    const modifiers = DIFFICULTY_MODIFIERS[difficulty];
                    const wasHungry = newPlayerState.hunger < 50;
                    const wasThirsty = newPlayerState.thirst < 50;
                    
                    newPlayerState.hunger = Math.max(0, newPlayerState.hunger - modifiers.hungerDrain);
                    newPlayerState.thirst = Math.max(0, newPlayerState.thirst - modifiers.thirstDrain);

                    if (newPlayerState.hunger === 0) {
                        newPlayerState.hp -= 1; // Starvation damage
                        setTimeout(() => addLogEntry("Cơn đói đang bào mòn sinh lực của bạn."), 150);
                    }
                    if (newPlayerState.thirst === 0) {
                        newPlayerState.hp -= 2; // Dehydration damage
                        setTimeout(() => addLogEntry("Sự mất nước khiến cơ thể bạn suy sụp."), 150);
                    }
                    newPlayerState.hp = Math.max(0, newPlayerState.hp);


                    const isNowHungry = newPlayerState.hunger < 50;
                    const isNowThirsty = newPlayerState.thirst < 50;
                    if (!wasHungry && isNowHungry) setTimeout(() => addLogEntry("Cơn đói bắt đầu gặm nhấm."), 150);
                    if (!wasThirsty && isNowThirsty) setTimeout(() => addLogEntry("Cổ họng bạn khô khốc."), 150);
                }

                // 2. Per-turn effects from marks and personalities
                if (newPlayerState.outerGodMark === 'ALL_MOTHER' && newPlayerState.hp < newPlayerState.maxHp) {
                    newPlayerState.hp = Math.min(newPlayerState.maxHp, newPlayerState.hp + 2);
                    perTurnMessageParts.push('Vết thương của bạn tự liền lại một chút.');
                }
                if (newPlayerState.outerGodMark === 'SILENT_WATCHER' && newPlayerState.mana < newPlayerState.maxMana) {
                    newPlayerState.mana = Math.min(newPlayerState.maxMana, newPlayerState.mana + 1);
                    perTurnMessageParts.push('Năng lượng kỳ lạ chảy vào tâm trí bạn.');
                }
                if (personality?.effects.mechanics.perTurnStaminaRegen?.condition === 'LOW_SANITY' && newPlayerState.sanity < newPlayerState.maxSanity * 0.3) {
                    const regenAmount = personality.effects.mechanics.perTurnStaminaRegen.amount;
                    newPlayerState.stamina = Math.min(newPlayerState.maxStamina, newPlayerState.stamina + regenAmount);
                    perTurnMessageParts.push('Sự tuyệt vọng mang lại cho bạn một sức bền kỳ lạ.');
                }
            }


            if(perTurnMessageParts.length > 0){
                setTimeout(() => addLogEntry(perTurnMessageParts.join(' ')), 100);
            }


            if (gameData.statusUpdate) {
                let {
                    hpChange = 0, staminaChange = 0, manaChange = 0, sanityChange = 0,
                    hungerChange = 0, thirstChange = 0, currencyChange = 0,
                    reputationChange = 0, godFragmentsChange = 0, 
                    appearanceChange = newPlayerState.appearance,
                    baseAttackChange = 0, baseDefenseChange = 0, baseCharismaChange = 0,
                    baseMaxHpChange = 0, baseMaxStaminaChange = 0, baseMaxManaChange = 0, baseMaxSanityChange = 0,
                } = gameData.statusUpdate;

                // Apply personality-based modifications
                if (personality) {
                    const pMechanics = personality.effects.mechanics;
                    if (pMechanics.resistsSanityLoss && sanityChange < 0) {
                        sanityChange *= (1 - pMechanics.resistsSanityLoss);
                        sanityChange = Math.round(sanityChange);
                    }
                    if (pMechanics.blocksReputationGain && reputationChange > 0) {
                        reputationChange = 0;
                    }
                }

                // Apply permanent base stat changes
                newPlayerState.baseAttack += baseAttackChange;
                newPlayerState.baseDefense += baseDefenseChange;
                newPlayerState.baseCharisma += baseCharismaChange;
                newPlayerState.baseMaxHp += baseMaxHpChange;
                newPlayerState.baseMaxStamina += baseMaxStaminaChange;
                newPlayerState.baseMaxMana += baseMaxManaChange;
                newPlayerState.baseMaxSanity += baseMaxSanityChange;


                const newHp = Math.max(0, newPlayerState.hp + hpChange);
                const newStamina = Math.max(0, Math.min(newPlayerState.maxStamina, newPlayerState.stamina + staminaChange));
                const newMana = Math.max(0, Math.min(newPlayerState.maxMana, newPlayerState.mana + manaChange));
                const newSanity = Math.max(0, Math.min(newPlayerState.maxSanity, newPlayerState.sanity + sanityChange));
                const newHunger = Math.max(0, Math.min(newPlayerState.maxHunger, newPlayerState.hunger + hungerChange));
                const newThirst = Math.max(0, Math.min(newPlayerState.maxThirst, newPlayerState.thirst + thirstChange));
                const newCurrency = newPlayerState.currency + currencyChange;
                const newReputation = newPlayerState.reputation + reputationChange;
                const newGodFragments = newPlayerState.godFragments + godFragmentsChange;

                newPlayerState = { ...newPlayerState, hp: newHp, stamina: newStamina, mana: newMana, sanity: newSanity, hunger: newHunger, thirst: newThirst, currency: newCurrency, reputation: newReputation, appearance: appearanceChange, godFragments: newGodFragments };
                
                if (gameData.statusUpdate.isMarked && !newPlayerState.isMarked) {
                    newPlayerState.isMarked = true;
                    setTimeout(() => {
                        const markMessage = "Một cảm giác nóng rát khắc vào da thịt bạn. Bạn đã bị đánh dấu. Bóng tối giờ đây sẽ biết tên bạn.";
                        addLogEntry(markMessage);
                        setNotification(markMessage);
                    }, 50);
                }
                
                if (gameData.statusUpdate.markRemoved) {
                    newPlayerState.isMarked = false;
                    setTimeout(() => {
                        const unmarkMessage = "Gánh nặng đã được gỡ bỏ. Vết sẹo vẫn còn, nhưng lời nguyền đã tan biến. Lần đầu tiên sau một thời gian dài, bạn cảm thấy sự im lặng trong tâm hồn mình.";
                        addLogEntry(unmarkMessage);
                        setNotification(unmarkMessage);
                    }, 50);
                }
                
                if (gameData.statusUpdate.succubusPactMade && !newPlayerState.hasSuccubusPact) {
                    newPlayerState.hasSuccubusPact = true;
                    setTimeout(() => {
                        const pactMessage = "Bạn đã lập một giao ước. Một sức mạnh vặn vẹo, quyến rũ tuôn chảy trong huyết quản bạn, với cái giá là một phần tâm trí của bạn.";
                        addLogEntry(pactMessage);
                        setNotification(pactMessage);
                    }, 50);
                }

                if (gameData.statusUpdate.outerGodMarkGained) {
                    const newMark = gameData.statusUpdate.outerGodMarkGained;
                    newPlayerState.outerGodMark = newMark;
                    // Initialize faith for the new god if it doesn't exist
                    if (!newPlayerState.faith[newMark]) {
                        newPlayerState.faith[newMark] = { points: 0, level: 0 };
                    }
                    setTimeout(() => {
                        const markInfo = OUTER_GODS[newMark];
                        const markMessage = `Bạn đã thu hút sự chú ý của một Ngoại Thần. ${markInfo.markName} giờ khắc sâu vào linh hồn bạn.`;
                        addLogEntry(markMessage);
                        setNotification(markMessage);
                    }, 50);
                }
                if (gameData.statusUpdate.outerGodMarkRemoved) {
                    const oldMark = newPlayerState.outerGodMark;
                    newPlayerState.outerGodMark = null;
                    if (oldMark) {
                        setTimeout(() => {
                             const markInfo = OUTER_GODS[oldMark];
                            const unmarkMessage = `Mối liên kết của bạn với ${markInfo.markName} đã bị cắt đứt. Bạn cảm thấy một sự trống rỗng quen thuộc.`;
                            addLogEntry(unmarkMessage);
                            setNotification(unmarkMessage);
                        }, 50);
                    }
                }

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

            if (gameData.statusUpdate?.itemsLost && gameData.statusUpdate.itemsLost.length > 0) {
                const lostItemIds = new Set(gameData.statusUpdate.itemsLost);
                const lostItemNames: string[] = [];
                const inventoryAfterLoss = newPlayerState.inventory.filter(item => {
                    if (lostItemIds.has(item.id)) {
                        lostItemNames.push(item.name);
                        return false;
                    }
                    return true;
                });
                newPlayerState = { ...newPlayerState, inventory: inventoryAfterLoss };
                setTimeout(() => {
                    const msg = `Bạn đã mất: ${lostItemNames.join(', ')}.`;
                    setNotification(msg);
                    addLogEntry(msg);
                }, 50);
            }

            if (gameData.skillsLearned && gameData.skillsLearned.length > 0) {
                const currentSkillIds = new Set(newPlayerState.skills.map(s => s.id));
                const newSkillsToAdd = gameData.skillsLearned.filter(s => !currentSkillIds.has(s.id));
                if (newSkillsToAdd.length > 0) {
                     newPlayerState = { ...newPlayerState, skills: [...newPlayerState.skills, ...newSkillsToAdd] };
                }
            }

            // Proficiency Update
            if (gameData.proficiencyUpdate) {
                const { weaponType, xpGained } = gameData.proficiencyUpdate;
                const newProficiency = { ...newPlayerState.proficiency };
                const currentProf = newProficiency[weaponType];
                
                if (currentProf) {
                    const newXp = currentProf.xp + xpGained;
                    if (newXp >= 100) {
                        const newLevel = currentProf.level + 1;
                        newProficiency[weaponType] = { level: newLevel, xp: newXp - 100 };
                        profLevelUpMessage = `Sự thành thạo của bạn với ${weaponType} đã tăng lên cấp ${newLevel}!`;
                    } else {
                        newProficiency[weaponType] = { ...currentProf, xp: newXp };
                    }
                    newPlayerState = { ...newPlayerState, proficiency: newProficiency };
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

            if (gameData.companionsAdded && gameData.companionsAdded.length > 0) {
                const newCompanions = gameData.companionsAdded.map(c => ({
                    ...c,
                    affection: c.affection === undefined ? 0 : c.affection,
                }));
                newPlayerState = { ...newPlayerState, companions: [...newPlayerState.companions, ...newCompanions] };
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
                            const newAffection = Math.max(-100, Math.min(100, (c.affection || 0) + (update.affectionChange || 0)));
                            return { ...c, hp: newCompanionHp, affection: newAffection };
                        }
                        return c;
                    })
                };
            }

            if (gameData.questsAdded && gameData.questsAdded.length > 0) {
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
            
            if (gameData.sanctuariesAdded && gameData.sanctuariesAdded.length > 0) {
                const newSanctuariesWithDefaults = gameData.sanctuariesAdded.map(s => ({
                    ...s,
                    residents: s.residents || [],
                    improvements: s.improvements || [],
                    followers: s.followers || [],
                }));
                newPlayerState = { ...newPlayerState, sanctuaries: [...newPlayerState.sanctuaries, ...newSanctuariesWithDefaults] };
            }
            if (gameData.sanctuaryUpdates) {
                newPlayerState = {
                    ...newPlayerState,
                    sanctuaries: newPlayerState.sanctuaries.map(s => {
                        const update = gameData.sanctuaryUpdates?.find(u => u.id === s.id);
                        if (update) {
                            let updatedSanctuary = { ...s };
                            if (update.level !== undefined) updatedSanctuary.level = update.level;
                            if (update.hopeChange !== undefined) updatedSanctuary.hope = Math.max(0, Math.min(100, s.hope + update.hopeChange));
                            if (update.addResident) updatedSanctuary.residents = [...(s.residents || []), update.addResident];
                            if (update.addImprovement) updatedSanctuary.improvements = [...(s.improvements || []), update.addImprovement];
                            if (update.description) updatedSanctuary.description = update.description;
                            if (update.name) updatedSanctuary.name = update.name;
                            return updatedSanctuary;
                        }
                        return s;
                    })
                };
            }

            if (gameData.faithUpdate) {
                const { god, pointsGained, levelUp } = gameData.faithUpdate;
                const newFaith = { ...newPlayerState.faith };
                if (!newFaith[god]) {
                    newFaith[god] = { points: 0, level: 0 };
                }
                newFaith[god]!.points += pointsGained;

                if (levelUp) {
                    newFaith[god]!.level += 1;
                    const newLevel = newFaith[god]!.level;
                    const newTitle = MARK_TITLES[god][newLevel -1] || `Bậc ${newLevel}`;
                    setTimeout(() => {
                        const msg = `Tín ngưỡng của bạn với ${OUTER_GODS[god].markName} đã được công nhận! Bạn đã đạt đến bậc ${newTitle}.`;
                        setNotification(msg);
                        addLogEntry(msg);
                    }, 50);
                }
                newPlayerState = { ...newPlayerState, faith: newFaith };
            }

            if (gameData.followerUpdates) {
                const newSanctuaries = [...newPlayerState.sanctuaries];
                gameData.followerUpdates.forEach(update => {
                    const sanctuary = newSanctuaries.find(s => s.id === update.sanctuaryId);
                    if (sanctuary) {
                        if (update.addFollower) {
                            sanctuary.followers = [...sanctuary.followers, update.addFollower];
                             setTimeout(() => {
                                const msg = `${update.addFollower?.name} đã thề trung thành với giáo phái của bạn tại ${sanctuary.name}.`;
                                setNotification(msg);
                                addLogEntry(msg);
                            }, 50);
                        }
                        if (update.removeFollowerId) {
                            const removedFollower = sanctuary.followers.find(f => f.id === update.removeFollowerId);
                            sanctuary.followers = sanctuary.followers.filter(f => f.id !== update.removeFollowerId);
                             setTimeout(() => {
                                if (removedFollower) {
                                    const msg = `${removedFollower.name} đã rời khỏi giáo phái.`;
                                    setNotification(msg);
                                    addLogEntry(msg);
                                }
                            }, 50);
                        }
                        if (update.updateFollower) {
                            const follower = sanctuary.followers.find(f => f.id === update.updateFollower?.id);
                            if (follower) {
                                if (update.updateFollower.loyaltyChange) {
                                    follower.loyalty = Math.max(-100, Math.min(100, follower.loyalty + update.updateFollower.loyaltyChange));
                                    setTimeout(() => {
                                        const direction = update.updateFollower.loyaltyChange! > 0 ? "tăng lên" : "giảm xuống";
                                        const msg = `Lòng trung thành của ${follower.name} đã ${direction}.`;
                                        addLogEntry(msg); // Log this quietly
                                    }, 50);
                                }
                                if (update.updateFollower.status) {
                                    follower.status = update.updateFollower.status;
                                }
                            }
                        }
                    }
                });
                newPlayerState = { ...newPlayerState, sanctuaries: newSanctuaries };
            }

            // Item Decay Logic (from former handleGameTick)
            let decayMessage: string | null = null;
            const inventoryAfterDecay = [...newPlayerState.inventory].map(item => {
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
            newPlayerState = { ...newPlayerState, inventory: inventoryAfterDecay };

            // Recalculate stats at the end of all updates
            return recalculateStats(newPlayerState);
        });
        
        const notificationParts: string[] = [];

        if (profLevelUpMessage) {
            notificationParts.push(profLevelUpMessage);
        }

        const reputationChange = gameData.statusUpdate?.reputationChange || 0;
        if (reputationChange > 0) {
            notificationParts.push(`Uy tín của bạn đã tăng lên.`);
        } else if (reputationChange < 0) {
            notificationParts.push(`Uy tín của bạn đã giảm xuống.`);
        }

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
        const godFragmentsChange = gameData.statusUpdate?.godFragmentsChange || 0;
        if (godFragmentsChange > 0) {
            notificationParts.push(`Bạn đã tìm thấy một Mảnh Vỡ Thần Thánh! Cơn thịnh nộ của các Ngoại Thần đang dâng lên.`);
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
        if(gameData.companionUpdates && gameData.companionUpdates.length > 0) {
            gameData.companionUpdates.forEach(update => {
                if (update.affectionChange) {
                    const companion = playerStateRef.current.companions.find(c => c.id === update.id);
                    if (companion) {
                        const direction = update.affectionChange > 0 ? 'tăng lên' : 'giảm xuống';
                        notificationParts.push(`Tình cảm của ${companion.name} đã ${direction}.`);
                    }
                }
            });
        }


        if (notificationParts.length > 0) {
            const message = notificationParts.join(' ');
            setNotification(message);
            addLogEntry(message);
        }
    }, [addLogEntry, setGameState, setPlayerState, setNotification, setShowTurnNotification, recalculateStats]);

    const handleAction = useCallback(async (choice: Choice) => {
        if (!gameAIService.current || isLoading) return;

        const staminaCost = choice.staminaCost || 0;
        if (playerStateRef.current.stamina < staminaCost) {
            const msg = "Không đủ thể lực để thực hiện hành động này.";
            setNotification(msg);
            addLogEntry(msg);
            return;
        }

        setIsLoading(true);
        setGameState(prevState => ({...prevState, combatLog: [] })); // Clear combat log on new action
        if (staminaCost > 0) {
            setPlayerState(prev => ({ ...prev, stamina: Math.max(0, prev.stamina - staminaCost) }));
        }
        
        const isDynamicEvent = gameStateRef.current.turn + 1 >= gameStateRef.current.nextDynamicWorldEventTurn;
        let finalPrompt = choice.prompt;
        if (isDynamicEvent) {
            finalPrompt = `(Sự kiện Thế Giới Động xảy ra) ${finalPrompt}`;
        }

        try {
            const { text: response, tokenCount } = await gameAIService.current.sendAction(finalPrompt, playerStateRef.current);
            setLastTurnTokenUsage(tokenCount);
            let gameData: GameData;

            try {
                const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
                gameData = JSON.parse(cleanResponse);
            } catch (e) {
                console.error("Không thể phân tích phản hồi JSON từ AI:", e, "Phản hồi thô từ AI:", response);
                 gameData = {
                    narrative: "Một sự im lặng đáng lo ngại bao trùm. Con đường phía trước bị che khuất bởi một màn sương mờ của sự không chắc chắn. Có lẽ bạn nên thử một cái gì đó khác.",
                    choices: gameStateRef.current.choices,
                    statusUpdate: null,
                    gameState: 'EXPLORING',
                    itemsFound: null,
                    skillsLearned: null,
                    companionsAdded: null,
                    companionsRemoved: null,
                    companionUpdates: null,
                    questsAdded: null,
                    questUpdates: null,
                    proficiencyUpdate: null,
                    npcsInScene: gameStateRef.current.npcsInScene,
                    enemies: gameStateRef.current.enemies,
                    combatLog: ["(Lỗi hệ thống: AI không phản hồi đúng định dạng.)"],
                };
            }
            processGameData(gameData, isDynamicEvent);
        } catch (e) {
            console.error("Lỗi khi xử lý hành động:", e);
            handleApiError(e);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, addLogEntry, processGameData, setNotification, setIsLoading, setPlayerState, handleApiError]);
    
     const handleCustomAction = useCallback(async (actionText: string) => {
        if (!gameAIService.current || isLoading || !actionText.trim()) return;

        setIsLoading(true);
        setGameState(prevState => ({...prevState, combatLog: [] })); // Clear combat log
        setCustomActionInput('');

        let prompt = `Người chơi thực hiện một hành động tùy chỉnh: "${actionText}". Mô tả kết quả của hành động này trong câu chuyện.`;
        const isDynamicEvent = gameStateRef.current.turn + 1 >= gameStateRef.current.nextDynamicWorldEventTurn;
        if (isDynamicEvent) {
            prompt = `(Sự kiện Thế Giới Động xảy ra) ${prompt}`;
        }

        try {
            const { text: response, tokenCount } = await gameAIService.current.sendAction(prompt, playerStateRef.current);
            setLastTurnTokenUsage(tokenCount);
            let gameData: GameData;

            try {
                const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
                gameData = JSON.parse(cleanResponse);
            } catch (e) {
                console.error("Không thể phân tích phản hồi JSON từ AI cho hành động tùy chỉnh:", e, "Phản hồi thô từ AI:", response);
                 gameData = {
                    narrative: "Hành động của bạn dường như không gây ra hiệu ứng gì. Có lẽ thế giới không phản hồi lại với những ý định như vậy, hoặc có lẽ bạn cần phải thử một cách khác.",
                    choices: gameStateRef.current.choices,
                    statusUpdate: null,
                    gameState: 'EXPLORING',
                    itemsFound: null,
                    skillsLearned: null,
                    companionsAdded: null,
                    companionsRemoved: null,
                    companionUpdates: null,
                    questsAdded: null,
                    questUpdates: null,
                    proficiencyUpdate: null,
                    npcsInScene: gameStateRef.current.npcsInScene,
                    enemies: gameStateRef.current.enemies,
                    combatLog: ["(Hành động tùy chỉnh không có kết quả.)"],
                };
            }
            processGameData(gameData, isDynamicEvent);
        } catch (e) {
            console.error("Lỗi khi xử lý hành động tùy chỉnh:", e);
            handleApiError(e);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, processGameData, setCustomActionInput, setIsLoading, handleApiError]);


    const handleUseSkill = useCallback(async (skill: Skill) => {
        if (!gameAIService.current || isLoading) return;

        if (playerStateRef.current.skillCooldowns[skill.id] > 0) {
            const msg = `Kỹ năng ${skill.name} đang trong thời gian hồi.`;
            setNotification(msg);
            addLogEntry(msg);
            return;
        }

        const resourcePool = skill.costType === 'MANA' ? playerStateRef.current.mana : playerStateRef.current.stamina;
        if (resourcePool < skill.cost) {
            const msg = `Không đủ ${skill.costType === 'MANA' ? 'mana' : 'thể lực'} để dùng ${skill.name}.`;
            setNotification(msg);
            addLogEntry(msg);
            return;
        }
        
        // Close inventory if open to show action result
        setIsInventoryOpen(false);

        setIsLoading(true);
        setGameState(prevState => ({...prevState, combatLog: [] })); // Clear combat log
        setPlayerState(prev => {
            const newCooldowns = { ...prev.skillCooldowns, [skill.id]: skill.cooldown };
            const newMana = skill.costType === 'MANA' ? Math.max(0, prev.mana - skill.cost) : prev.mana;
            const newStamina = skill.costType === 'STAMINA' ? Math.max(0, prev.stamina - skill.cost) : prev.stamina;
            return { ...prev, mana: newMana, stamina: newStamina, skillCooldowns: newCooldowns };
        });

        let prompt = `Tôi sử dụng kỹ năng '${skill.name}'. Mô tả hậu quả của việc sử dụng kỹ năng này trong câu chuyện.`;
        const isDynamicEvent = gameStateRef.current.turn + 1 >= gameStateRef.current.nextDynamicWorldEventTurn;
        if (isDynamicEvent) {
            prompt = `(Sự kiện Thế Giới Động xảy ra) ${prompt}`;
        }

        try {
            const { text: response, tokenCount } = await gameAIService.current.sendAction(prompt, playerStateRef.current);
            setLastTurnTokenUsage(tokenCount);
            let gameData: GameData;

            try {
                const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
                gameData = JSON.parse(cleanResponse);
            } catch (e) {
                 console.error("Không thể phân tích phản hồi JSON từ AI:", e, "Phản hồi thô từ AI:", response);
                 gameData = {
                    narrative: `Năng lượng từ kỹ năng ${skill.name} của bạn bị tiêu tan vào không khí một cách vô hại. Dường như có gì đó đã chặn nó lại.`,
                    choices: gameStateRef.current.choices,
                    statusUpdate: null,
                    gameState: gameStateRef.current.phase,
                    itemsFound: null,
                    skillsLearned: null,
                    companionsAdded: null,
                    companionsRemoved: null,
                    companionUpdates: null,
                    questsAdded: null,
                    questUpdates: null,
                    proficiencyUpdate: null,
                    npcsInScene: gameStateRef.current.npcsInScene,
                    enemies: gameStateRef.current.enemies,
                    combatLog: [`(Sử dụng kỹ năng ${skill.name} thất bại.)`],
                };
            }
            processGameData(gameData, isDynamicEvent);
        } catch (e) {
            console.error("Lỗi khi xử lý kỹ năng:", e);
            handleApiError(e);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, addLogEntry, processGameData, setNotification, setIsLoading, setPlayerState, handleApiError]);

    const handleUseItem = useCallback((itemToUse: Item) => {
        // Only handle consumable items with effects (not equippable gear)
        if (!itemToUse.effect || itemToUse.equipmentSlot) {
            setNotification("Bạn không thể dùng vật phẩm này theo cách đó.");
            return;
        }

        setPlayerState(prev => {
            const hpGain = itemToUse.effect?.hp || 0;
            const manaGain = itemToUse.effect?.mana || 0;
            const sanityGain = itemToUse.effect?.sanity || 0;
            const hungerGain = itemToUse.effect?.hunger || 0;
            const thirstGain = itemToUse.effect?.thirst || 0;

            const canUse = (hpGain > 0 && prev.hp < prev.maxHp) || 
                           (manaGain > 0 && prev.mana < prev.maxMana) ||
                           (sanityGain > 0 && prev.sanity < prev.maxSanity) ||
                           (hungerGain > 0 && prev.hunger < prev.maxHunger) ||
                           (thirstGain > 0 && prev.thirst < prev.maxThirst);

            if (!canUse) {
                setNotification("Bạn không cần dùng nó bây giờ.");
                return prev;
            }
            
            const healedHp = Math.min(prev.maxHp, prev.hp + hpGain);
            const restoredMana = Math.min(prev.maxMana, prev.mana + manaGain);
            const restoredSanity = Math.min(prev.maxSanity, prev.sanity + sanityGain);
            const restoredHunger = Math.min(prev.maxHunger, prev.hunger + hungerGain);
            const restoredThirst = Math.min(prev.maxThirst, prev.thirst + thirstGain);
            
            const hpRestored = healedHp - prev.hp;
            const manaRestored = restoredMana - prev.mana;
            const sanityRestored = restoredSanity - prev.sanity;
            const hungerRestored = restoredHunger - prev.hunger;
            const thirstRestored = restoredThirst - prev.thirst;
            
            const itemIndex = prev.inventory.findIndex(item => item.id === itemToUse.id);
            if (itemIndex > -1) {
                const newInventory = [...prev.inventory];
                newInventory.splice(itemIndex, 1);
                
                let msgParts: string[] = [];
                if (hpRestored > 0) msgParts.push(`hồi phục ${hpRestored} máu`);
                if (manaRestored > 0) msgParts.push(`hồi phục ${manaRestored} mana`);
                if (sanityRestored > 0) msgParts.push(`khôi phục ${sanityRestored} Tâm Trí`);
                if (hungerRestored > 0) msgParts.push(`làm dịu cơn đói đi ${hungerRestored} điểm`);
                if (thirstRestored > 0) msgParts.push(`giải tỏa cơn khát đi ${thirstRestored} điểm`);
                
                const msg = `Bạn đã dùng một ${itemToUse.name}${msgParts.length > 0 ? ' và ' + msgParts.join(' và ') : ''}.`;
                setNotification(msg);
                addLogEntry(msg);
                
                return recalculateStats({
                    ...prev, 
                    hp: healedHp, 
                    mana: restoredMana, 
                    sanity: restoredSanity, 
                    hunger: restoredHunger,
                    thirst: restoredThirst,
                    inventory: newInventory 
                });
            }
            return prev;
        });
    }, [addLogEntry, setPlayerState, setNotification, recalculateStats]);

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
    
    const handleStartGame = useCallback((journeyPrompt?: string) => {
        if (saveFileExists && !journeyPrompt) {
            setIsNewGameConfirmOpen(true);
        } else {
            setGameState(prevState => ({ ...prevState, phase: 'CHARACTER_CREATION', customJourneyPrompt: journeyPrompt || '' }));
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
        setGameState(prevState => ({ ...prevState, phase: 'CHARACTER_CREATION', customJourneyPrompt: '' }));
    }, [setIsNewGameConfirmOpen, setGameState, setSaveFileExists]);

    const handleCancelNewGame = useCallback(() => {
        setIsNewGameConfirmOpen(false);
    }, [setIsNewGameConfirmOpen]);

    const handleCharacterCreation = useCallback((details: {
        name: string; bio: string; origin: Origin; difficulty: Difficulty; gender: Gender; personality: string; goal: string; talent: string; finalStats: Record<keyof PlayerState, number>
    }, isCreatorsWill = false) => {
        const { name, bio, origin, difficulty, gender, personality, goal, talent, finalStats } = details;
        
        const originData = ORIGINS[origin];
        const newProficiency = {...INITIAL_PLAYER_STATE.proficiency};
        if(originData.bonuses.startingProficiency) {
            const {type, xp} = originData.bonuses.startingProficiency;
            newProficiency[type] = { ...newProficiency[type], xp: newProficiency[type].xp + xp };
        }

        let baseState: PlayerState = {
            ...INITIAL_PLAYER_STATE,
            name,
            bio,
            origin,
            gender,
            personality,
            goal,
            talent,
            baseAttack: finalStats.baseAttack,
            baseDefense: finalStats.baseDefense,
            baseCharisma: finalStats.baseCharisma,
            baseMaxHp: finalStats.baseMaxHp,
            baseMaxStamina: finalStats.baseMaxStamina,
            baseMaxMana: finalStats.baseMaxMana,
            baseMaxSanity: finalStats.baseMaxSanity,
            hp: finalStats.baseMaxHp,
            stamina: finalStats.baseMaxStamina,
            mana: finalStats.baseMaxMana,
            sanity: finalStats.baseMaxSanity,
            proficiency: newProficiency,
            faith: {}, // Initialize new faith system
        };

        const personalityData = PERSONALITIES[personality];
        if (personalityData?.effects.mechanics.initialInjury) {
            const { part, level } = personalityData.effects.mechanics.initialInjury;
            baseState.bodyStatus[part] = level;
        }

        // Process starting equipment
        const startingItems = originData.startingEquipment || [];
        const newInventory = [...baseState.inventory];
        const newEquipment = {...baseState.equipment};
        startingItems.forEach(item => {
            if (item.equipmentSlot && !newEquipment[item.equipmentSlot]) {
                newEquipment[item.equipmentSlot] = item;
            } else {
                newInventory.push(item);
            }
        });
        baseState.inventory = newInventory;
        baseState.equipment = newEquipment;
        
        setPlayerState(recalculateStats(baseState));
        setLastTurnTokenUsage(0);
        setIsLoading(true);
        
        const firstEventTurn = DYNAMIC_WORLD_EVENT_TURN_MIN + Math.floor(Math.random() * (DYNAMIC_WORLD_EVENT_TURN_MAX - DYNAMIC_WORLD_EVENT_TURN_MIN + 1));
        
        // Set EXPLORING phase, which will trigger the story generation useEffect.
        setGameState(prevState => ({ 
            ...prevState, 
            phase: 'EXPLORING', 
            narrative: "Câu chuyện của bạn sắp bắt đầu...", 
            difficulty: difficulty, 
            choices: [], 
            turn: 0,
            nextDynamicWorldEventTurn: firstEventTurn,
            enemies: [],
            combatLog: [],
            npcsInScene: [],
            isCreatorsWillActive: isCreatorsWill,
        }));
    }, [recalculateStats, setPlayerState, setIsLoading, setGameState]);

    // This effect runs once to generate the initial story after character creation.
    useEffect(() => {
        const startStory = async () => {
            // Only run on the very first turn when the game enters the exploring phase and is loading.
            if (gameState.phase === 'EXPLORING' && gameState.turn === 0 && isLoading) {
                try {
                    if (!activeApiKey) {
                        throw new Error("API Key không hoạt động hoặc chưa được cấu hình.");
                    }
                    if (!gameState.difficulty) {
                        throw new Error("Độ khó chưa được thiết lập.");
                    }
                    
                    // Construct the initial prompt using the latest player state from the ref.
                    const { name, origin, gender, personality, goal, bio, talent } = playerStateRef.current;
                    const talentName = talent ? ALL_TALENTS_MAP.get(talent)?.name : 'Không có';

                    const goalPrompt = goal
                        ? `và mục tiêu chính của họ là "${goal}"`
                        : "và họ đang tìm kiếm mục tiêu cho mình trong thế giới hoang tàn này";
                    const startingLocationPrompt = gameState.customJourneyPrompt 
                        ? 'Bắt đầu câu chuyện dựa trên bối cảnh tùy chỉnh đã được cung cấp trong system prompt.'
                        : 'Tôi tỉnh dậy trong một tàn tích hoang vắng.';

                    const initialPrompt = `Bắt đầu một câu chuyện mới. Nhân vật của tôi tên là ${name}, một ${gender} có nguồn gốc là "${origin}" và có thiên phú là "${talentName}". Tính cách của họ là ${personality}, ${goalPrompt}. Tiểu sử: "${bio || 'Một quá khứ bị che giấu trong bí ẩn.'}". ${startingLocationPrompt} Hãy mô tả những khoảnh khắc đầu tiên của tôi, môi trường xung quanh, và đưa ra những lựa chọn đầu tiên dựa trên những đặc điểm này. Trang bị khởi đầu đã được xử lý.`;

                    // Explicitly create the service here to avoid race conditions.
                    const service = new GameAIService(gameState.difficulty, activeApiKey, isMatureContent, gameState.customJourneyPrompt, gameState.isCreatorsWillActive);
                    gameAIService.current = service;
                    addLogEntry(`Dịch vụ AI được khởi tạo với nguồn ${apiSource === 'default' ? 'mặc định' : 'người dùng'}. Chế độ 18+ ${isMatureContent ? 'bật' : 'tắt'}.`);

                    const { text: response, tokenCount } = await service.sendAction(initialPrompt);
                    setLastTurnTokenUsage(tokenCount);
                    let gameData: GameData;

                    try {
                        const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
                        gameData = JSON.parse(cleanResponse);
                    } catch (e) {
                        console.error("Không thể phân tích phản hồi JSON từ AI:", e, "Phản hồi thô từ AI:", response);
                        gameData = {
                            narrative: "Một sự im lặng đáng lo ngại bao trùm. Con đường phía trước bị che khuất bởi một màn sương mờ của sự không chắc chắn. Có lẽ bạn nên thử một cái gì đó khác.",
                            choices: [],
                            statusUpdate: null,
                            gameState: 'EXPLORING',
                            itemsFound: null,
                            skillsLearned: null,
                            companionsAdded: null,
                            companionsRemoved: null,
                            companionUpdates: null,
                            questsAdded: null,
                            questUpdates: null,
                            proficiencyUpdate: null,
                            npcsInScene: null,
                            enemies: null,
                            combatLog: null,
                        };
                    }
                    processGameData(gameData, false);
                } catch (e) {
                    console.error("Lỗi khi bắt đầu câu chuyện:", e);
                    handleApiError(e);
                    // On failure, return to character creation screen
                    setGameState(g => ({...g, phase: 'CHARACTER_CREATION', difficulty: null, narrative: ''}));
                } finally {
                    setIsLoading(false);
                }
            }
        };

        startStory();
    }, [gameState.phase, gameState.turn, gameState.difficulty, isLoading, activeApiKey, isMatureContent, apiSource, addLogEntry, processGameData, handleApiError, gameState.customJourneyPrompt, gameState.isCreatorsWillActive]);


    const restartGame = useCallback(() => {
        setPlayerState(INITIAL_PLAYER_STATE);
        setGameState({
            phase: 'TITLE_SCREEN',
            narrative: '',
            choices: [],
            difficulty: null,
            turn: 0,
            nextDynamicWorldEventTurn: 0,
            enemies: [],
            combatLog: [],
            npcsInScene: [],
            customJourneyPrompt: '',
            isCreatorsWillActive: false,
        });
        setLog([]);
        setIsInventoryOpen(false);
        setIsEquipmentOpen(false);
        setIsExitConfirmOpen(false);
        setIsNewGameConfirmOpen(false);
        setNotification('');
        setLastTurnTokenUsage(0);
        gameAIService.current = null;
    }, [setPlayerState, setGameState, setLog, setIsInventoryOpen, setIsEquipmentOpen, setIsExitConfirmOpen, setIsNewGameConfirmOpen, setNotification]);



    const handleDeathAndRestart = useCallback(() => {
        if (gameState.difficulty === 'Ác Mộng' || gameState.difficulty === 'Địa Ngục' || gameState.difficulty === 'Đày Đoạ') {
            try {
                localStorage.removeItem(SAVE_KEY);
                setSaveFileExists(false);
                addLogEntry(`Tiến trình đã được xóa do nhân vật gục ngã trong chế độ ${gameState.difficulty}.`);
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
    
    // API Key Manager Handlers
    const handleSaveApiKeys = (keys: string[]) => {
        const cleanedKeys = keys.filter(k => k.trim() !== '');
        setUserApiKeys(cleanedKeys);
        setApiSource('user');
        setCurrentApiKeyIndex(0);
        try {
            localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(cleanedKeys));
            localStorage.setItem(API_SOURCE_STORAGE_KEY, 'user');
        } catch(e) { console.error("Lỗi lưu API keys:", e); }
        setNotification("Đã lưu và kích hoạt API key của bạn.");
        setIsApiKeyManagerOpen(false);
    };

    const handleSetDefaultApiSource = () => {
        setApiSource('default');
        setCurrentApiKeyIndex(0);
         try {
            localStorage.setItem(API_SOURCE_STORAGE_KEY, 'default');
        } catch(e) { console.error("Lỗi lưu nguồn API:", e); }
        setNotification("Đã chuyển sang nguồn AI mặc định.");
        setIsApiKeyManagerOpen(false);
    };

    const handleToggleMatureContent = useCallback(() => {
        setIsMatureContent(prev => {
            const newState = !prev;
            try {
                localStorage.setItem(MATURE_CONTENT_KEY, JSON.stringify(newState));
            } catch (e) { console.error("Không thể lưu cài đặt nội dung người lớn", e); }
            setNotification(`Nội dung người lớn ${newState ? 'đã được bật' : 'đã được tắt'}.`);
            return newState;
        });
    }, [setNotification]);
    
    const handleStartCustomJourney = useCallback(() => {
        setGameState(prevState => ({ ...prevState, phase: 'CUSTOM_JOURNEY' }));
    }, []);

    const handleJourneyCreate = useCallback((prompt: string) => {
        setGameState(prevState => ({ ...prevState, phase: 'CHARACTER_CREATION', customJourneyPrompt: prompt }));
    }, []);
    
    const handleGoToCreatorsWill = useCallback(() => {
        setGameState(prevState => ({ ...prevState, phase: 'CREATORS_WILL_SETUP' }));
    }, []);
    
    const handleBackToCharCreation = useCallback(() => {
        setGameState(prevState => ({ ...prevState, phase: 'CHARACTER_CREATION' }));
    }, []);

    const handleStartCombatTest = useCallback(() => {
        const testOrigin: Origin = 'Cựu Vệ Binh';
        const originData = ORIGINS[testOrigin];
        const initialTestPlayerState = {
            ...INITIAL_PLAYER_STATE,
            name: "Chiến Binh Thử Nghiệm",
            bio: "Một linh hồn được triệu hồi chỉ để chiến đấu và chết.",
            origin: testOrigin,
            gender: 'Khác' as Gender,
            personality: "Dũng Cảm",
            goal: "Sống sót qua trận chiến này.",
            ...BASE_STATS_BEFORE_POINT_BUY,
            hp: BASE_STATS_BEFORE_POINT_BUY.baseMaxHp,
            stamina: BASE_STATS_BEFORE_POINT_BUY.baseMaxStamina,
            mana: BASE_STATS_BEFORE_POINT_BUY.baseMaxMana,
            sanity: BASE_STATS_BEFORE_POINT_BUY.baseMaxSanity,
            charisma: BASE_STATS_BEFORE_POINT_BUY.baseCharisma,
        };
        setPlayerState(recalculateStats(initialTestPlayerState));
        setLastTurnTokenUsage(0);
        setIsLoading(true);

        const difficulty: Difficulty = 'Thử Thách';
        const firstEventTurn = DYNAMIC_WORLD_EVENT_TURN_MIN + Math.floor(Math.random() * (DYNAMIC_WORLD_EVENT_TURN_MAX - DYNAMIC_WORLD_EVENT_TURN_MIN + 1));
        
        setGameState({
            phase: 'COMBAT',
            narrative: "Bạn bị đẩy vào một đấu trường bụi bặm. Trước mặt bạn, một sinh vật ghê tởm đang gầm gừ...",
            difficulty: difficulty,
            choices: [],
            turn: 0,
            nextDynamicWorldEventTurn: firstEventTurn,
            enemies: [],
            combatLog: [],
            npcsInScene: [],
            customJourneyPrompt: '',
            isCreatorsWillActive: false,
        });

        setIsCombatTestStarting(true);
    }, [recalculateStats, setPlayerState, setIsLoading, setGameState]);

    // This effect runs once to generate the initial combat scenario for testing.
    useEffect(() => {
        const startCombatTest = async () => {
            if (isCombatTestStarting) {
                try {
                    if (!activeApiKey) throw new Error("API Key không hoạt động.");
                    if (!gameState.difficulty) throw new Error("Độ khó chưa được thiết lập.");

                    const initialPrompt = `BẮT ĐẦU TRẬN CHIẾN THỬ NGHIỆM. Người chơi có nguồn gốc là một Cựu Vệ Binh. Tạo ra một kẻ thù (ví dụ: một con Ghoul hoặc Bộ Xương) với các bộ phận cơ thể và HP đầy đủ. Mô tả sự bắt đầu của trận chiến, tình trạng của kẻ thù và đưa ra các lựa chọn chiến thuật đầu tiên cho người chơi. Trạng thái game phải là 'COMBAT'.`;

                    const service = new GameAIService(gameState.difficulty, activeApiKey, isMatureContent, undefined, false);
                    gameAIService.current = service;
                    addLogEntry(`Dịch vụ AI được khởi tạo cho Chế độ Thử nghiệm Chiến đấu.`);

                    const { text: response, tokenCount } = await service.sendAction(initialPrompt, playerStateRef.current);
                    setLastTurnTokenUsage(tokenCount);
                    let gameData: GameData;

                    try {
                        const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
                        gameData = JSON.parse(cleanResponse);
                    } catch (e) {
                            console.error("Không thể phân tích phản hồi JSON từ AI:", e, "Phản hồi thô từ AI:", response);
                        gameData = {
                            narrative: "Có lỗi khi bắt đầu trận chiến thử nghiệm. AI không phản hồi đúng định dạng. Trở về màn hình chính.",
                            choices: [],
                            statusUpdate: null,
                            gameState: 'TITLE_SCREEN',
                            itemsFound: null, skillsLearned: null, companionsAdded: null, companionsRemoved: null, companionUpdates: null, questsAdded: null, questUpdates: null, proficiencyUpdate: null, npcsInScene: null, enemies: null, combatLog: null
                        };
                    }
                    processGameData(gameData, false);
                } catch (e) {
                    console.error("Lỗi khi bắt đầu trận chiến thử nghiệm:", e);
                    handleApiError(e);
                    setGameState(g => ({...g, phase: 'TITLE_SCREEN', narrative: ''}));
                } finally {
                    setIsLoading(false);
                    setIsCombatTestStarting(false);
                }
            }
        };

        startCombatTest();
    }, [isCombatTestStarting, activeApiKey, gameState.difficulty, isMatureContent, addLogEntry, processGameData, handleApiError]);


    if (gameState.phase === 'TITLE_SCREEN') {
        return (
            <>
                <StartScreen 
                    onStartGame={() => handleStartGame()}
                    onStartCustomJourney={handleStartCustomJourney} 
                    onLoadGame={loadGame} 
                    saveFileExists={saveFileExists}
                    onOpenApiKeyManager={() => setIsApiKeyManagerOpen(true)}
                    isMatureContent={isMatureContent}
                    onToggleMatureContent={handleToggleMatureContent}
                    onStartCombatTest={handleStartCombatTest}
                />
                <ApiKeyManager 
                    isOpen={isApiKeyManagerOpen}
                    onClose={() => setIsApiKeyManagerOpen(false)}
                    onSave={handleSaveApiKeys}
                    onSetDefault={handleSetDefaultApiSource}
                    currentSource={apiSource}
                    currentKeys={userApiKeys}
                />
            </>
        );
    }
    
    if (gameState.phase === 'CUSTOM_JOURNEY') {
        return <CustomJourneyScreen onJourneyCreate={handleJourneyCreate} onBack={restartGame} />;
    }

    if (gameState.phase === 'CREATORS_WILL_SETUP') {
        return <CreatorsWillScreen onCharacterCreate={handleCharacterCreation} onBack={handleBackToCharCreation} />;
    }

    if (gameState.phase === 'CHARACTER_CREATION') {
        return <CharacterCreationScreen onCharacterCreate={handleCharacterCreation} activeApiKey={activeApiKey} onGoToCreatorsWill={handleGoToCreatorsWill} />;
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
                    <NarrativePanel 
                        narrative={gameState.narrative} 
                        combatLog={gameState.combatLog} 
                        isLoading={isLoading} 
                        npcsInScene={gameState.npcsInScene}
                    />
                    <CombatPanel 
                        choices={gameState.choices}
                        enemies={gameState.enemies}
                        phase={gameState.phase}
                        onAction={handleAction} 
                        isLoading={isLoading} 
                        playerState={playerState}
                        customActionInput={customActionInput}
                        setCustomActionInput={setCustomActionInput}
                        onCustomAction={handleCustomAction}
                     />
                </div>
                
                <div className="lg:col-span-1">
                     <div className="bg-gray-800/50 rounded-lg shadow-lg border border-gray-700 backdrop-blur-sm flex flex-col h-full">
                        <div className="flex-grow p-4 space-y-6 overflow-y-auto">
                            <PlayerStatsPanel playerState={playerState} lastTurnTokenUsage={lastTurnTokenUsage} />
                            <InfoTabsPanel 
                                playerState={playerState}
                            />
                        </div>
                         <div className="flex-shrink-0 p-4 border-t border-gray-700/50">
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
                </div>
            </main>
            
            <InventoryScreen 
                isOpen={isInventoryOpen}
                onClose={() => setIsInventoryOpen(false)}
                playerState={playerState}
                onUseItem={handleUseItem}
                log={log}
                onUseSkill={handleUseSkill}
                isLoading={isLoading}
            />

            <EquipmentScreen
                isOpen={isEquipmentOpen}
                onClose={() => setIsEquipmentOpen(false)}
                playerState={playerState}
                onEquipItem={handleEquipItem}
                onUnequipItem={handleUnequipItem}
            />

            {showTurnNotification !== null && (
                <div 
                    key={showTurnNotification}
                    className="fixed top-20 left-1/2 -translate-x-1/2 bg-black/70 text-white font-title text-2xl py-2 px-8 rounded-full shadow-lg border border-red-500/30 animate-turn-notify z-50"
                >
                    Lượt {showTurnNotification}
                </div>
            )}
            
            {showDynamicWorldNotification && (
                <div 
                    key={Date.now()}
                    className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black/70 text-white font-title text-xl py-2 px-6 rounded-full shadow-lg border border-purple-500/30 animate-world-shift z-50"
                >
                    Thế giới không ngừng xoay chuyển...
                </div>
            )}


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