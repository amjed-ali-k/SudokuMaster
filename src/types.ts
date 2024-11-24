export type GameHistory = {
  id: string;
  difficulty: number;
  duration: number;
  mistakes: number;
  perfect: boolean;
  completedAt: string;
  boardTheme: string;
  initialBoard: number[][];
  finalBoard: number[][];
};

export type Statistics = {
  gamesPlayed: number;
  perfectGames: number;
  bestStreak: number;
  currentStreak: number;
  averageTime: number;
  totalPlayTime: number;
};

export type Settings = {
  boardTheme: string;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  autoNotesEnabled: boolean;
  highlightMatchingNumbers: boolean;
  showMistakes: boolean;
  statistics: Statistics;
};

export type GameState = {
  board: number[][];
  initialBoard: number[][];
  solution?: number[][];
  notes: Set<number>[][];
  difficulty: number;
  timer: number;
  mistakes: number;
  history: GameHistory[];
  isComplete: boolean;
  isPaused: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
  unlockedAt?: string;
};

export type Profile = {
  username: string;
  avatar?: string;
  statistics: {
    gamesPlayed: number;
    gamesWon: number;
    bestTime: number | null;
    averageTime: number | null;
  };
};

export type Theme = {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    error: string;
    success: string;
  };
};

export type ThemeType = 'light' | 'dark';
