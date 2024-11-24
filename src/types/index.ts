export interface GameState {
  currentGame: {
    initial: number[][];
    current: number[][];
  };
  difficulty: number;
  timer: number;
  mistakes: number;
  notes: { [key: string]: number[] };
  history: GameHistory[];
}

export interface GameHistory {
  id: string;
  difficulty: number;
  duration: number;
  mistakes: number;
  perfect: boolean;
  completedAt: string;
}

export interface Settings {
  boardTheme: string;
  vibrationEnabled: boolean;
  statistics: {
    gamesPlayed: number;
    perfectGames: number;
    averageTime: number;
    bestStreak: number;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  unlocked: boolean;
  icon: string;
}

export interface BoardTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    background: string;
    grid: string;
    selectedBackground: string;
    initialNumber: string;
    userNumber: string;
    noteText: string;
  };
  borderWidths: {
    cell: number;
    box: number;
  };
}

export interface Store {
  // Game State
  game: GameState;
  updateCell: (row: number, col: number, value: number) => void;
  addMistake: () => void;
  toggleNote: (row: number, col: number, value: number) => void;
  saveGame: () => void;
  updateTimer: () => void;
  startNewGame: (difficulty: number) => void;

  // Settings
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  updateStatistics: (stats: Partial<Settings['statistics']>) => void;

  // Achievements
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  updateAchievementProgress: (id: string, progress: number) => void;
}
