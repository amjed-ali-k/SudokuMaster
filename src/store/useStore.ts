import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { GameState, Settings, Achievement } from '../types';
import storageManager from '../utils/storage';
import { generateSudoku } from '../utils/sudokuGenerator';

interface StoreState {
  game: GameState;
  settings: Settings;
  achievements: Achievement[];
  isLoading: boolean;
  startNewGame: (difficulty: number) => void;
  makeMove: (row: number, col: number, value: number) => void;
  toggleNote: (row: number, col: number, value: number) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  unlockAchievement: (achievement: Achievement) => void;
  loadPersistedState: () => Promise<void>;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      game: {
        board: Array(9).fill(Array(9).fill(0)),
        initialBoard: Array(9).fill(Array(9).fill(0)),
        notes: Array(9).fill(Array(9).fill(new Set<number>())),
        difficulty: 1,
        timer: 0,
        mistakes: 0,
        history: [],
        isComplete: false,
        isPaused: false,
      },
      settings: {
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
      },
      achievements: [],
      isLoading: true,

      startNewGame: (difficulty) => {
        const { board, solution } = generateSudoku(difficulty);
        const newGame: GameState = {
          board,
          initialBoard: [...board],
          solution,
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

        const isCorrect = value === game.solution[row][col];
        const newMistakes = isCorrect ? game.mistakes : game.mistakes + 1;
        const isComplete = newBoard.every((row, i) =>
          row.every((cell, j) => cell === game.solution[i][j])
        );

        if (isComplete) {
          const gameHistory = {
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
            perfectGames: gameHistory.perfect
              ? settings.statistics.perfectGames + 1
              : settings.statistics.perfectGames,
            currentStreak: gameHistory.perfect
              ? settings.statistics.currentStreak + 1
              : 0,
            bestStreak: Math.max(
              settings.statistics.bestStreak,
              gameHistory.perfect ? settings.statistics.currentStreak + 1 : 0
            ),
            totalPlayTime: settings.statistics.totalPlayTime + game.timer,
            averageTime:
              Math.round(
                (settings.statistics.totalPlayTime + game.timer) /
                  (settings.statistics.gamesPlayed + 1)
              ),
          };

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
            },
          });

          storageManager.addGameToHistory(gameHistory);
          storageManager.saveSettings({ statistics: newStats });
        } else {
          set({
            game: {
              ...game,
              board: newBoard,
              mistakes: newMistakes,
            },
          });
          storageManager.saveGameState({
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
        storageManager.saveGameState({ notes: newNotes });
      },

      updateSettings: (newSettings) => {
        const { settings } = get();
        const updatedSettings = {
          ...settings,
          ...newSettings,
        };
        set({ settings: updatedSettings });
        storageManager.saveSettings(newSettings);
      },

      unlockAchievement: (achievement) => {
        const { achievements } = get();
        if (!achievements.some((a) => a.id === achievement.id)) {
          const newAchievements = [...achievements, achievement];
          set({ achievements: newAchievements });
          storageManager.unlockAchievement(achievement);
        }
      },

      loadPersistedState: async () => {
        const [gameState, settings, achievements] = await Promise.all([
          storageManager.getGameState(),
          storageManager.getSettings(),
          storageManager.getAchievements(),
        ]);

        if (gameState || settings || achievements) {
          set({
            game: gameState || get().game,
            settings: settings || get().settings,
            achievements: achievements || [],
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'sudoku-master-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name) => {
          const value = await storageManager.getGameState();
          return value ? JSON.stringify(value) : null;
        },
        setItem: async (name, value) => {
          const parsedValue = JSON.parse(value);
          await storageManager.saveGameState(parsedValue);
        },
        removeItem: async (name) => {
          await storageManager.clearAllData();
        },
      })),
    }
  )
);

export default useStore;
