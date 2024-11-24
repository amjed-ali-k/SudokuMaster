import create from 'zustand';
import { Store } from '../types';
import { generateSudoku, validateMove, checkCompletion } from '../utils/sudokuGenerator';

const initialState: Store = {
  game: {
    currentGame: {
      initial: Array(9).fill(Array(9).fill(0)),
      current: Array(9).fill(Array(9).fill(0)),
    },
    difficulty: 1,
    timer: 0,
    mistakes: 0,
    notes: {},
    history: [],
  },
  settings: {
    boardTheme: 'classic',
    vibrationEnabled: true,
    statistics: {
      gamesPlayed: 0,
      perfectGames: 0,
      averageTime: 0,
      bestStreak: 0,
    },
  },
  achievements: [],
};

const useStore = create<Store>((set, get) => ({
  ...initialState,

  // Game Actions
  updateCell: (row: number, col: number, value: number) => {
    set((state) => {
      const newCurrent = [...state.game.currentGame.current];
      newCurrent[row][col] = value;
      return {
        game: {
          ...state.game,
          currentGame: {
            ...state.game.currentGame,
            current: newCurrent,
          },
        },
      };
    });
  },

  addMistake: () => {
    set((state) => ({
      game: {
        ...state.game,
        mistakes: state.game.mistakes + 1,
      },
    }));
  },

  toggleNote: (row: number, col: number, value: number) => {
    set((state) => {
      const key = `${row}-${col}`;
      const currentNotes = state.game.notes[key] || [];
      const newNotes = currentNotes.includes(value)
        ? currentNotes.filter((n) => n !== value)
        : [...currentNotes, value];

      return {
        game: {
          ...state.game,
          notes: {
            ...state.game.notes,
            [key]: newNotes,
          },
        },
      };
    });
  },

  saveGame: () => {
    set((state) => {
      const newHistory = [
        ...state.game.history,
        {
          id: Date.now().toString(),
          difficulty: state.game.difficulty,
          duration: state.game.timer,
          mistakes: state.game.mistakes,
          perfect: state.game.mistakes === 0,
          completedAt: new Date().toISOString(),
        },
      ];

      // Update statistics
      const totalTime = state.settings.statistics.averageTime * state.settings.statistics.gamesPlayed;
      const newAverage = Math.round((totalTime + state.game.timer) / (state.settings.statistics.gamesPlayed + 1));

      return {
        game: {
          ...state.game,
          history: newHistory,
        },
        settings: {
          ...state.settings,
          statistics: {
            ...state.settings.statistics,
            gamesPlayed: state.settings.statistics.gamesPlayed + 1,
            perfectGames: state.game.mistakes === 0
              ? state.settings.statistics.perfectGames + 1
              : state.settings.statistics.perfectGames,
            averageTime: newAverage,
          },
        },
      };
    });
  },

  updateTimer: () => {
    set((state) => ({
      game: {
        ...state.game,
        timer: state.game.timer + 1,
      },
    }));
  },

  startNewGame: (difficulty: number) => {
    const newGame = generateSudoku(difficulty);
    set((state) => ({
      game: {
        ...state.game,
        currentGame: newGame,
        difficulty,
        timer: 0,
        mistakes: 0,
        notes: {},
      },
    }));
  },

  // Settings Actions
  updateSettings: (newSettings) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...newSettings,
      },
    }));
  },

  updateStatistics: (stats) => {
    set((state) => ({
      settings: {
        ...state.settings,
        statistics: {
          ...state.settings.statistics,
          ...stats,
        },
      },
    }));
  },

  // Achievement Actions
  unlockAchievement: (id: string) => {
    set((state) => ({
      achievements: state.achievements.map((achievement) =>
        achievement.id === id
          ? { ...achievement, unlocked: true, progress: 100 }
          : achievement
      ),
    }));
  },

  updateAchievementProgress: (id: string, progress: number) => {
    set((state) => ({
      achievements: state.achievements.map((achievement) =>
        achievement.id === id
          ? { ...achievement, progress }
          : achievement
      ),
    }));
  },
}));

export default useStore;
