import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  soundEnabled: true,
  vibrationEnabled: true,
  highlightSameNumbers: true,
  showMistakes: true,
  autoNotesEnabled: false,
  username: '',
  avatar: null,
  statistics: {
    gamesPlayed: 0,
    gamesWon: 0,
    totalPlayTime: 0,
    averageTime: 0,
    bestTime: null,
    difficultyDistribution: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0, 10: 0
    },
  },
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    toggleVibration: (state) => {
      state.vibrationEnabled = !state.vibrationEnabled;
    },
    toggleHighlightSameNumbers: (state) => {
      state.highlightSameNumbers = !state.highlightSameNumbers;
    },
    toggleShowMistakes: (state) => {
      state.showMistakes = !state.showMistakes;
    },
    toggleAutoNotes: (state) => {
      state.autoNotesEnabled = !state.autoNotesEnabled;
    },
    updateProfile: (state, action) => {
      const { username, avatar } = action.payload;
      state.username = username;
      if (avatar) state.avatar = avatar;
    },
    updateStatistics: (state, action) => {
      const { gameTime, won, difficulty } = action.payload;
      state.statistics.gamesPlayed += 1;
      if (won) {
        state.statistics.gamesWon += 1;
      }
      state.statistics.totalPlayTime += gameTime;
      state.statistics.averageTime = state.statistics.totalPlayTime / state.statistics.gamesPlayed;
      if (!state.statistics.bestTime || gameTime < state.statistics.bestTime) {
        state.statistics.bestTime = gameTime;
      }
      state.statistics.difficultyDistribution[difficulty] += 1;
    },
  },
});

export const {
  setTheme,
  toggleSound,
  toggleVibration,
  toggleHighlightSameNumbers,
  toggleShowMistakes,
  toggleAutoNotes,
  updateProfile,
  updateStatistics,
} = settingsSlice.actions;

export default settingsSlice.reducer;
