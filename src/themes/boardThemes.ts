interface ThemeColors {
  background: string;
  grid: string;
  text: string;
  highlight: string;
  error: string;
  success: string;
  note: string;
}

export interface BoardTheme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
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
    },
  },
  sepia: {
    id: 'sepia',
    name: 'Sepia',
    description: 'Warm and comfortable',
    colors: {
      background: '#f4ecd8',
      grid: '#78664c',
      text: '#5c4d3c',
      highlight: '#e8dcc8',
      error: '#c94d4d',
      success: '#4a7c59',
      note: '#8b7355',
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
    },
  },
};

export default boardThemes;
