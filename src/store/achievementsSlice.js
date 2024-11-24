import { createSlice } from '@reduxjs/toolkit';

const achievements = {
  firstGame: {
    id: 'firstGame',
    title: 'First Steps',
    description: 'Complete your first game',
    icon: '🎮',
    unlocked: false,
  },
  speedster: {
    id: 'speedster',
    title: 'Speedster',
    description: 'Complete a game under 5 minutes',
    icon: '⚡',
    unlocked: false,
  },
  master: {
    id: 'master',
    title: 'Sudoku Master',
    description: 'Complete a game on highest difficulty',
    icon: '👑',
    unlocked: false,
  },
  perfectionist: {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete a game with no mistakes',
    icon: '✨',
    unlocked: false,
  },
  persistent: {
    id: 'persistent',
    title: 'Persistent',
    description: 'Complete 10 games',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    total: 10,
  },
  variety: {
    id: 'variety',
    title: 'Variety Seeker',
    description: 'Try all board designs',
    icon: '🎨',
    unlocked: false,
    progress: 0,
    total: 5,
  },
  // Add more achievements as needed
};

const initialState = {
  achievements,
  recentUnlocks: [],
};

export const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    unlockAchievement: (state, action) => {
      const achievement = state.achievements[action.payload];
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        state.recentUnlocks.push({
          id: achievement.id,
          timestamp: Date.now(),
        });
      }
    },
    updateProgress: (state, action) => {
      const { id, progress } = action.payload;
      const achievement = state.achievements[id];
      if (achievement && !achievement.unlocked) {
        achievement.progress = progress;
        if (achievement.progress >= achievement.total) {
          achievement.unlocked = true;
          state.recentUnlocks.push({
            id: achievement.id,
            timestamp: Date.now(),
          });
        }
      }
    },
    clearRecentUnlocks: (state) => {
      state.recentUnlocks = [];
    },
  },
});

export const { unlockAchievement, updateProgress, clearRecentUnlocks } = achievementsSlice.actions;

export default achievementsSlice.reducer;
