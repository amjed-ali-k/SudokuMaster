import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import achievementsReducer from './achievementsSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    achievements: achievementsReducer,
    settings: settingsReducer,
  },
});
