import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameState, Settings, GameHistory, Achievement } from '../types';

const STORAGE_KEYS = {
  GAME_STATE: '@SudokuMaster:gameState',
  SETTINGS: '@SudokuMaster:settings',
  GAME_HISTORY: '@SudokuMaster:gameHistory',
  ACHIEVEMENTS: '@SudokuMaster:achievements',
} as const;

class StorageManager {
  private static instance: StorageManager;

  private constructor() {}

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
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

  async getAchievements(): Promise<Achievement[]> {
    try {
      const achievements = await AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return achievements ? JSON.parse(achievements) : [];
    } catch (error) {
      console.error('Error getting achievements:', error);
      return [];
    }
  }

  async unlockAchievement(achievement: Achievement): Promise<void> {
    try {
      const achievements = await this.getAchievements();
      if (!achievements.some((a) => a.id === achievement.id)) {
        achievements.push(achievement);
        await this.saveAchievements(achievements);
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.GAME_STATE,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.GAME_HISTORY,
        STORAGE_KEYS.ACHIEVEMENTS,
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }

  async migrateData(version: string): Promise<void> {
    // Implement data migration logic here when needed
    // This method will be useful for future app updates
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
