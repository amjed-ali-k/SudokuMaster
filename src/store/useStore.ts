import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { 
  GameState, 
  Settings, 
  Achievement, 
  Profile, 
  Theme, 
  ThemeType, 
  GameHistory 
} from '../types';
import storageManager from '../utils/storage';
import { generateSudoku } from '../utils/sudokuGenerator';

interface StoreState {
  // Game State
  game: GameState;
  isLoading: boolean;
  
  // Settings & Preferences
  settings: Settings;
  theme: ThemeType;
  themes: Theme[];
  selectedTheme: Theme;
  
  // User Data
  profile: Profile;
  achievements: Achievement[];
  recentUnlocks: Achievement[];
  
  // Game Actions
  startNewGame: (difficulty: number) => void;
  makeMove: (row: number, col: number, value: number) => void;
  toggleNote: (row: number, col: number, value: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  
  // Settings Actions
  updateSettings: (newSettings: Partial<Settings>) => void;
  setTheme: (newTheme: ThemeType) => void;
  selectTheme: (themeId: string) => void;
  toggleSound: () => void;
  toggleHaptic: () => void;
  toggleHighlightMatching: () => void;
  toggleShowMistakes: () => void;
  toggleAutoNotes: () => void;
  
  // Profile & Achievement Actions
  updateProfile: (updates: Partial<Profile>) => void;
  unlockAchievement: (achievement: Achievement) => void;
  clearRecentUnlocks: () => void;
  
  // System Actions
  loadPersistedState: () => Promise<void>;
}

const initialGameState: GameState = {
  board: Array(9).fill(Array(9).fill(0)),
  initialBoard: Array(9).fill(Array(9).fill(0)),
  notes: Array(9).fill(Array(9).fill(new Set<number>())),
  difficulty: 1,
  timer: 0,
  mistakes: 0,
  history: [],
  isComplete: false,
  isPaused: false,
};

const initialSettings: Settings = {
  boardTheme: 'classic',
  soundEnabled: true,
  hapticEnabled: true,
  autoNotesEnabled: true,
  highlightMatchingNumbers: true,
  showMistakes: true,
  statistics: {
    gamesPlayed: 0,
    perfectGames: 0,
    bestStreak: 0,
    currentStreak: 0,
    averageTime: 0,
    totalPlayTime: 0,
  },
};

const initialProfile: Profile = {
  username: 'Player',
  statistics: {
    gamesPlayed: 0,
    gamesWon: 0,
    bestTime: null,
    averageTime: null,
  },
};

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial State
      game: initialGameState,
      settings: initialSettings,
      profile: initialProfile,
      theme: 'light',
      themes: [],
      selectedTheme: {} as Theme,
      achievements: [],
      recentUnlocks: [],
      isLoading: true,

      // Game Actions
      startNewGame: (difficulty) => {
        const puzzle = generateSudoku(difficulty);
        const newGame: GameState = {
          board: puzzle.current,
          initialBoard: puzzle.initial,
          solution: puzzle.solution,
          notes: Array(9).fill(Array(9).fill(new Set<number>())),
          difficulty,
          timer: 0,
          mistakes: 0,
          history: get().game.history,
          isComplete: false,
          isPaused: false,
        };
        set({ game: newGame });
        storageManager.saveGameState(newGame);
      },

      makeMove: (row, col, value) => {
        const { game, settings } = get();
        if (game.initialBoard[row][col] !== 0 || game.isComplete) return;

        const newBoard = game.board.map((r) => [...r]);
        newBoard[row][col] = value;

        const isCorrect = game.solution && value === game.solution[row][col];
        const newMistakes = isCorrect ? game.mistakes : game.mistakes + 1;
        const isComplete = game.solution && newBoard.every((row, i) =>
          row.every((cell, j) => cell === game.solution![i][j])
        );

        if (isComplete) {
          const gameHistory: GameHistory = {
            id: Date.now().toString(),
            difficulty: game.difficulty,
            duration: game.timer,
            mistakes: newMistakes,
            perfect: newMistakes === 0,
            completedAt: new Date().toISOString(),
            boardTheme: settings.boardTheme,
            initialBoard: game.initialBoard,
            finalBoard: newBoard,
          };

          const newHistory = [gameHistory, ...game.history];
          const newStats = {
            ...settings.statistics,
            gamesPlayed: settings.statistics.gamesPlayed + 1,
            perfectGames: game.mistakes === 0 
              ? settings.statistics.perfectGames + 1 
              : settings.statistics.perfectGames,
            bestStreak: game.mistakes === 0 
              ? settings.statistics.bestStreak + 1 
              : 0,
            currentStreak: game.mistakes === 0 
              ? settings.statistics.currentStreak + 1 
              : 0,
            totalPlayTime: settings.statistics.totalPlayTime + game.timer,
            averageTime: Math.floor(
              (settings.statistics.totalPlayTime + game.timer) / 
              (settings.statistics.gamesPlayed + 1)
            ),
          };

          storageManager.saveSettings({
            ...settings,
            statistics: newStats,
          });

          set({ 
            game: {
              ...game,
              board: newBoard,
              mistakes: newMistakes,
              isComplete: true,
              history: newHistory,
            },
            settings: {
              ...settings,
              statistics: newStats,
            }
          });
          storageManager.addGameToHistory(gameHistory);
        } else {
          set({
            game: {
              ...game,
              board: newBoard,
              mistakes: newMistakes,
            },
          });
          storageManager.saveGameState({
            ...game,
            board: newBoard,
            mistakes: newMistakes,
          });
        }
      },

      toggleNote: (row, col, value) => {
        const { game } = get();
        if (game.initialBoard[row][col] !== 0 || game.isComplete) return;

        const newNotes = game.notes.map((r) => r.map((set) => new Set(set)));
        const currentNotes = newNotes[row][col];

        if (currentNotes.has(value)) {
          currentNotes.delete(value);
        } else {
          currentNotes.add(value);
        }

        set({
          game: {
            ...game,
            notes: newNotes,
          },
        });
        storageManager.saveGameState({ ...game, notes: newNotes });
      },

      pauseGame: () => {
        const { game } = get();
        set({ game: { ...game, isPaused: true } });
        storageManager.saveGameState({ ...game, isPaused: true });
      },

      resumeGame: () => {
        const { game } = get();
        set({ game: { ...game, isPaused: false } });
        storageManager.saveGameState({ ...game, isPaused: false });
      },

      // Settings Actions
      updateSettings: (newSettings: Partial<Settings>) => {
        const currentSettings = get().settings;
        const updatedSettings = { ...currentSettings, ...newSettings };
        storageManager.saveSettings(updatedSettings);
        set({ settings: updatedSettings });
      },

      setTheme: (newTheme: ThemeType) => {
        storageManager.saveTheme(newTheme);
        set({ theme: newTheme });
      },

      selectTheme: (themeId: string) => {
        const themes = get().themes;
        const selectedTheme = themes.find(t => t.id === themeId);
        if (selectedTheme) {
          storageManager.saveThemes(themes);
          set({ selectedTheme });
        }
      },

      toggleSound: () => {
        const currentSettings = get().settings;
        const updatedSettings = { ...currentSettings, soundEnabled: !currentSettings.soundEnabled };
        storageManager.saveSettings(updatedSettings);
        set({ settings: updatedSettings });
      },

      toggleHaptic: () => {
        const currentSettings = get().settings;
        const updatedSettings = { ...currentSettings, hapticEnabled: !currentSettings.hapticEnabled };
        storageManager.saveSettings(updatedSettings);
        set({ settings: updatedSettings });
      },

      toggleHighlightMatching: () => {
        const currentSettings = get().settings;
        const updatedSettings = { ...currentSettings, highlightMatchingNumbers: !currentSettings.highlightMatchingNumbers };
        storageManager.saveSettings(updatedSettings);
        set({ settings: updatedSettings });
      },

      toggleShowMistakes: () => {
        const currentSettings = get().settings;
        const updatedSettings = { ...currentSettings, showMistakes: !currentSettings.showMistakes };
        storageManager.saveSettings(updatedSettings);
        set({ settings: updatedSettings });
      },

      toggleAutoNotes: () => {
        const currentSettings = get().settings;
        const updatedSettings = { ...currentSettings, autoNotesEnabled: !currentSettings.autoNotesEnabled };
        storageManager.saveSettings(updatedSettings);
        set({ settings: updatedSettings });
      },

      // Profile & Achievement Actions
      updateProfile: (updates: Partial<Profile>) => {
        const currentProfile = get().profile;
        const updatedProfile = { ...currentProfile, ...updates };
        storageManager.saveProfile(updatedProfile);
        set({ profile: updatedProfile });
      },

      unlockAchievement: (achievement) => {
        const { achievements, recentUnlocks } = get();
        if (!achievements.some((a) => a.id === achievement.id)) {
          const unlockedAchievement = {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date().toISOString(),
          };
          const newAchievements = [...achievements, unlockedAchievement];
          const newRecentUnlocks = [...recentUnlocks, unlockedAchievement];
          set({ 
            achievements: newAchievements,
            recentUnlocks: newRecentUnlocks,
          });
          storageManager.unlockAchievement(unlockedAchievement);
        }
      },

      clearRecentUnlocks: () => {
        set({ recentUnlocks: [] });
      },

      // System Actions
      async loadPersistedState() {
        try {
          const [
            gameState,
            settings,
            profile,
            theme,
            themes,
            selectedTheme,
            achievements
          ] = await Promise.all([
            storageManager.getGameState(),
            storageManager.getSettings(),
            storageManager.getProfile(),
            storageManager.getTheme(),
            storageManager.getThemes(),
            storageManager.getSelectedTheme(),
            storageManager.getAchievements()
          ]);

          set({
            game: gameState || get().game,
            settings: settings as Settings || get().settings,
            profile: profile || get().profile,
            theme: theme || get().theme,
            themes: themes || get().themes,
            selectedTheme: selectedTheme || get().selectedTheme,
            achievements: achievements || get().achievements,
          });
        } catch (error) {
          console.error('Error loading persisted state:', error);
        }
      },
    }),
    {
      name: 'sudoku-master-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => {
          const value = await storageManager.getData(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name: string, value: any) => {
          await storageManager.setData(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await storageManager.removeData(name);
        },
      })),
    }
  )
);

export default useStore;
