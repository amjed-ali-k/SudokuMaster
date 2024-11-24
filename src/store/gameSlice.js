import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentGame: null,
  gameHistory: [],
  difficulty: 1,
  boardDesign: 'classic',
  isGameActive: false,
  timer: 0,
  mistakes: 0,
  notes: {},
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startNewGame: (state, action) => {
      state.currentGame = action.payload;
      state.isGameActive = true;
      state.timer = 0;
      state.mistakes = 0;
      state.notes = {};
    },
    updateCell: (state, action) => {
      const { row, col, value } = action.payload;
      if (state.currentGame) {
        state.currentGame.board[row][col] = value;
      }
    },
    setDifficulty: (state, action) => {
      state.difficulty = action.payload;
    },
    setBoardDesign: (state, action) => {
      state.boardDesign = action.payload;
    },
    updateTimer: (state) => {
      state.timer += 1;
    },
    addMistake: (state) => {
      state.mistakes += 1;
    },
    toggleNote: (state, action) => {
      const { row, col, value } = action.payload;
      const key = `${row}-${col}`;
      if (!state.notes[key]) {
        state.notes[key] = [];
      }
      const index = state.notes[key].indexOf(value);
      if (index === -1) {
        state.notes[key].push(value);
      } else {
        state.notes[key].splice(index, 1);
      }
    },
    saveGame: (state) => {
      if (state.currentGame) {
        state.gameHistory.push({
          ...state.currentGame,
          timestamp: Date.now(),
          timer: state.timer,
          difficulty: state.difficulty,
        });
      }
    },
    loadGame: (state, action) => {
      const savedGame = action.payload;
      state.currentGame = savedGame;
      state.isGameActive = true;
      state.timer = savedGame.timer;
      state.difficulty = savedGame.difficulty;
    },
  },
});

export const {
  startNewGame,
  updateCell,
  setDifficulty,
  setBoardDesign,
  updateTimer,
  addMistake,
  toggleNote,
  saveGame,
  loadGame,
} = gameSlice.actions;

export default gameSlice.reducer;
