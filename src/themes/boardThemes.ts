interface ThemeColors {
  background: string;
  grid: string;
  text: string;
  highlight: string;
  error: string;
  success: string;
  note: string;
  selectedBackground: string;
  initialNumber: string;
  userNumber: string;
  noteText: string;
}

interface ThemeBorders {
  cell: number;
  box: number;
}

export interface BoardTheme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  borderWidths: ThemeBorders;
}

export const boardThemes: Record<string, BoardTheme> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional Sudoku style',
    colors: {
      background: '#ffffff',
      grid: '#000000',
      text: '#000000',
      highlight: '#e3f2fd',
      error: '#f44336',
      success: '#4caf50',
      note: '#757575',
      selectedBackground: '#e3f2fd',
      initialNumber: '#000000',
      userNumber: '#2196f3',
      noteText: '#757575',
    },
    borderWidths: {
      cell: 1,
      box: 2,
    },
  },
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Easy on the eyes',
    colors: {
      background: '#121212',
      grid: '#ffffff',
      text: '#ffffff',
      highlight: '#1e1e1e',
      error: '#cf6679',
      success: '#81c784',
      note: '#b0bec5',
      selectedBackground: '#1e1e1e',
      initialNumber: '#ffffff',
      userNumber: '#64b5f6',
      noteText: '#b0bec5',
    },
    borderWidths: {
      cell: 1,
      box: 2,
    },
  },
  sepia: {
    id: 'sepia',
    name: 'Sepia',
    description: 'Warm and comfortable',
    colors: {
      background: '#f4ecd8',
      grid: '#5d4037',
      text: '#5d4037',
      highlight: '#efe5cf',
      error: '#c62828',
      success: '#2e7d32',
      note: '#795548',
      selectedBackground: '#efe5cf',
      initialNumber: '#5d4037',
      userNumber: '#795548',
      noteText: '#795548',
    },
    borderWidths: {
      cell: 1,
      box: 2,
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool and calming',
    colors: {
      background: '#e3f2fd',
      grid: '#1565c0',
      text: '#0d47a1',
      highlight: '#bbdefb',
      error: '#ef5350',
      success: '#66bb6a',
      note: '#42a5f5',
      selectedBackground: '#bbdefb',
      initialNumber: '#1565c0',
      userNumber: '#42a5f5',
      noteText: '#42a5f5',
    },
    borderWidths: {
      cell: 1,
      box: 2,
    },
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'Natural and serene',
    colors: {
      background: '#e8f5e9',
      grid: '#2e7d32',
      text: '#1b5e20',
      highlight: '#c8e6c9',
      error: '#e57373',
      success: '#81c784',
      note: '#66bb6a',
      selectedBackground: '#c8e6c9',
      initialNumber: '#2e7d32',
      userNumber: '#66bb6a',
      noteText: '#66bb6a',
    },
    borderWidths: {
      cell: 1,
      box: 2,
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm and vibrant',
    colors: {
      background: '#fff3e0',
      grid: '#f57c00',
      text: '#e65100',
      highlight: '#ffe0b2',
      error: '#ef5350',
      success: '#66bb6a',
      note: '#ffb74d',
      selectedBackground: '#ffe0b2',
      initialNumber: '#f57c00',
      userNumber: '#ffb74d',
      noteText: '#ffb74d',
    },
    borderWidths: {
      cell: 1,
      box: 2,
    },
  },
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Simple and clean',
    colors: {
      background: '#fafafa',
      grid: '#212121',
      text: '#212121',
      highlight: '#eeeeee',
      error: '#757575',
      success: '#424242',
      note: '#9e9e9e',
      selectedBackground: '#eeeeee',
      initialNumber: '#212121',
      userNumber: '#9e9e9e',
      noteText: '#9e9e9e',
    },
    borderWidths: {
      cell: 1,
      box: 2,
    },
  },
  neon: {
    id: 'neon',
    name: 'Neon',
    description: 'Bold and energetic',
    colors: {
      background: '#000000',
      grid: '#00ff00',
      text: '#00ff00',
      highlight: '#1a1a1a',
      error: '#ff0000',
      success: '#00ff00',
      note: '#00ffff',
      selectedBackground: '#1a1a1a',
      initialNumber: '#00ff00',
      userNumber: '#00ffff',
      noteText: '#00ffff',
    },
    borderWidths: {
      cell: 1,
      box: 2,
    },
  },
};

export default boardThemes;
