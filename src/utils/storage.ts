import AsyncStorage from '@react-native-async-storage/async-storage';
import type { 
  GameState, 
  Settings, 
  GameHistory, 
  Achievement, 
  Profile, 
  Theme, 
  ThemeType 
} from '../types';

const STORAGE_KEYS = {
  GAME_STATE: '@SudokuMaster:gameState',
  SETTINGS: '@SudokuMaster:settings',
  GAME_HISTORY: '@SudokuMaster:gameHistory',
  ACHIEVEMENTS: '@SudokuMaster:achievements',
  PROFILE: '@SudokuMaster:profile',
  THEME: '@SudokuMaster:theme',
  THEMES: '@SudokuMaster:themes',
} as const;

export type StorageData = {
  gameState: GameState;
  settings: Settings;
  profile: Profile;
  theme: ThemeType;
  themes: Theme[];
  selectedTheme: Theme;
  achievements: Achievement[];
};

class StorageManager {
  private static instance: StorageManager;

  private constructor() {}

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  async getData(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting data for key ${key}:`, error);
      return null;
    }
  }

  async setData(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting data for key ${key}:`, error);
    }
  }

  async removeData(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
    }
  }

  async saveGameState(gameState: Partial<GameState>): Promise<void> {
    try {
      const currentState = await this.getGameState();
      const newState = { ...currentState, ...gameState };
      await AsyncStorage.setItem(
        STORAGE_KEYS.GAME_STATE,
        JSON.stringify(newState)
      );
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  }

  async getGameState(): Promise<GameState | null> {
    try {
      const state = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATE);
      return state ? JSON.parse(state) : null;
    } catch (error) {
      console.error('Error getting game state:', error);
      return null;
    }
  }

  async saveSettings(settings: Partial<Settings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(newSettings)
      );
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  async getSettings(): Promise<Settings | null> {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  }

  async saveGameHistory(history: GameHistory[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.GAME_HISTORY,
        JSON.stringify(history)
      );
    } catch (error) {
      console.error('Error saving game history:', error);
    }
  }

  async getGameHistory(): Promise<GameHistory[]> {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting game history:', error);
      return [];
    }
  }

  async addGameToHistory(game: GameHistory): Promise<void> {
    try {
      const history = await this.getGameHistory();
      history.unshift(game); // Add new game at the beginning
      await this.saveGameHistory(history);
    } catch (error) {
      console.error('Error adding game to history:', error);
    }
  }

  async saveAchievements(achievements: Achievement[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.ACHIEVEMENTS,
        JSON.stringify(achievements)
      );
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  }

  async getAchievements(): Promise<Achievement[] | null> {
    try {
      const achievements = await AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return achievements ? JSON.parse(achievements) : null;
    } catch (error) {
      console.error('Error getting achievements:', error);
      return null;
    }
  }

  async unlockAchievement(achievement: Achievement): Promise<void> {
    try {
      const achievements = await this.getAchievements();
      if (!achievements?.some((a) => a.id === achievement.id)) {
        achievements?.push(achievement);
        if(achievements)
        await this.saveAchievements(achievements);
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  }

  async saveProfile(profile: Profile): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.PROFILE,
        JSON.stringify(profile)
      );
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }

  async getProfile(): Promise<Profile | null> {
    try {
      const profile = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }

  async saveTheme(theme: ThemeType): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.THEME,
        JSON.stringify(theme)
      );
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }

  async getTheme(): Promise<ThemeType | null> {
    try {
      const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      return theme ? JSON.parse(theme) : null;
    } catch (error) {
      console.error('Error getting theme:', error);
      return null;
    }
  }

  async saveThemes(themes: Theme[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.THEMES,
        JSON.stringify(themes)
      );
    } catch (error) {
      console.error('Error saving themes:', error);
    }
  }

  async getThemes(): Promise<Theme[] | null> {
    try {
      const themes = await AsyncStorage.getItem(STORAGE_KEYS.THEMES);
      return themes ? JSON.parse(themes) : null;
    } catch (error) {
      console.error('Error getting themes:', error);
      return null;
    }
  }

  async getSelectedTheme(): Promise<Theme | null> {
    try {
      const themes = await this.getThemes();
      const theme = await this.getTheme();
      if (!themes || !theme) return null;
      return themes.find(t => t.id === theme) || null;
    } catch (error) {
      console.error('Error getting selected theme:', error);
      return null;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }

  async migrateData(version: string): Promise<void> {
    try {
      const currentVersion = await AsyncStorage.getItem('@SudokuMaster:version');
      if (currentVersion !== version) {
        // Perform migration steps based on version differences
        await AsyncStorage.setItem('@SudokuMaster:version', version);
      }
    } catch (error) {
      console.error('Error migrating data:', error);
    }
  }
}

export const storageManager = StorageManager.getInstance();
export default storageManager;
