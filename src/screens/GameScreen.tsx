import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import useStore from '../store/useStore';
import { validateMove, checkCompletion } from '../utils/sudokuGenerator';
import * as Haptics from 'expo-haptics';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { boardThemes } from '../themes/boardThemes';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';

type GameScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
  route: RouteProp<RootStackParamList, 'Game'>;
};

type CellPosition = {
  row: number;
  col: number;
} | null;

const { width } = Dimensions.get('window');
const CELL_SIZE = Math.floor((width - 40) / 9);

const GameScreen= ({ navigation }: GameScreenProps) => {
  const {
    game,
    settings,
    makeMove,
    toggleNote,
    pauseGame,
    resumeGame,
    unlockAchievement,
  } = useStore();

  const [selectedCell, setSelectedCell] = useState<CellPosition>(null);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const boardScale = useSharedValue(0.95);
  const cellHighlight = useSharedValue(0);

  const springConfig: any = {
    damping: 10,
    mass: 1,
    stiffness: 100,
  };

  const animateBoard = () => {
    boardScale.value = withSpring(1, springConfig);
  };

  const animateCell = (row: number, col: number) => {
    if (settings.hapticEnabled) {
      Haptics.selectionAsync();
    }
    cellHighlight.value = withSpring(1, springConfig);
    setTimeout(() => {
      cellHighlight.value = withSpring(0, springConfig);
    }, 300);
  };

  const boardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: boardScale.value }],
    };
  });

  const cellAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(cellHighlight.value, [0, 1], [0, 0.3]),
    };
  });

  useEffect(() => {
    animateBoard();

    // Start timer
    const timer = setInterval(() => {
      resumeGame();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle cell selection
  const handleCellPress = (row: number, col: number) => {
    if (settings.hapticEnabled) {
      Haptics.selectionAsync();
    }

    if (game.initialBoard[row][col] === 0) {
      setSelectedCell({ row, col });
      animateCell(row, col);
    }
  };

  // Handle number input
  const handleNumberInput = (number: number) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;

    if (settings.hapticEnabled) {
      Haptics.selectionAsync();
    }

    if (game.initialBoard[row][col] !== 0) {
      return;
    }

    if (isNotesMode) {
      toggleNote(row, col, number);
      return;
    }

    if (validateMove(game.board, row, col, number)) {
      makeMove(row, col, number);
      
      // Check if the move completes the game
      if (checkCompletion(game.board)) {
        handleGameCompletion();
      }
    } else {
      // Invalid move
      if (settings.hapticEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      pauseGame();
      Alert.alert(
        'Invalid Move',
        'Please try again.',
        [
          {
            text: 'OK',
            onPress: () => resumeGame(),
          },
        ]
      );
    }
  };

  const handleGameCompletion = () => {
    // Check for achievements
    if (game.difficulty === 3) { // Expert difficulty
      unlockAchievement({
        id: 'master',
        title: 'Sudoku Master',
        description: 'Complete an Expert level puzzle',
        icon: '🏆',
        unlocked: true
      });
    }
    if (game.mistakes === 0) {
      unlockAchievement({
        id: 'perfect',
        title: 'Perfect Game',
        description: 'Complete a puzzle with no mistakes',
        icon: '✨',
        unlocked: true
      });
    }

    Alert.alert(
      'Congratulations!',
      'You have completed the puzzle!',
      [
        {
          text: 'New Game',
          onPress: () => navigation.navigate('DifficultySelect'),
        },
        {
          text: 'Main Menu',
          onPress: () => navigation.navigate('Home'),
        },
      ]
    );
  };

  const renderCell = (row: number, col: number) => {
    const value = game.board[row][col];
    const isInitial = game.initialBoard[row][col] !== 0;
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const notes = game.notes[`${row}-${col}`] || [];
    const theme = boardThemes[settings.boardTheme || 'classic'];

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={[
          styles.cell,
          {
            borderRightWidth: (col + 1) % 3 === 0 ? theme.borderWidths.box : theme.borderWidths.cell,
            borderBottomWidth: (row + 1) % 3 === 0 ? theme.borderWidths.box : theme.borderWidths.cell,
            borderColor: theme.colors.grid,
            backgroundColor: isSelected
              ? theme.colors.selectedBackground
              : theme.colors.background,
          },
        ]}
        onPress={() => handleCellPress(row, col)}
      >
        {value !== 0 ? (
          <Text
            style={[
              styles.cellText,
              {
                color: isInitial
                  ? theme.colors.initialNumber
                  : theme.colors.userNumber,
              },
            ]}
          >
            {value}
          </Text>
        ) : (
          <View style={styles.notesContainer}>
            {notes.map((note) => (
              <Text key={note} style={[styles.noteText, { color: theme.colors.noteText }]}>
                {note}
              </Text>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderBoard = () => {
    return (
      <View style={boardAnimatedStyle}>
        {Array(9)
          .fill(null)
          .map((_, row) => (
            <View key={row} style={styles.row}>
              {Array(9)
                .fill(null)
                .map((_, col) => renderCell(row, col))}
            </View>
          ))}
      </View>
    );
  };

  const renderNumberPad = () => {
    return (
      <View style={styles.numberPad}>
        <View style={styles.numberRow}>
          {[1, 2, 3, 4, 5].map((number) => (
            <TouchableOpacity
              key={number}
              style={styles.numberButton}
              onPress={() => handleNumberInput(number)}
            >
              <Text style={styles.numberButtonText}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.numberRow}>
          {[6, 7, 8, 9].map((number) => (
            <TouchableOpacity
              key={number}
              style={styles.numberButton}
              onPress={() => handleNumberInput(number)}
            >
              <Text style={styles.numberButtonText}>{number}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.numberButton, isNotesMode && styles.notesButtonActive]}
            onPress={() => setIsNotesMode(!isNotesMode)}
          >
            <Ionicons
              name="pencil"
              size={24}
              color={isNotesMode ? '#fff' : '#333'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={24} color="#fff" />
            <Text style={styles.statText}>
              {Math.floor(game.timer / 60)}:
              {(game.timer % 60).toString().padStart(2, '0')}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="alert-circle-outline" size={24} color="#fff" />
            <Text style={styles.statText}>{game.mistakes}/3</Text>
          </View>
        </View>
      </View>

      {renderBoard()}
      {renderNumberPad()}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 5,
  },
  board: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  cellText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    padding: 2,
  },
  noteText: {
    fontSize: 10,
    width: '33.33%',
    height: '33.33%',
    textAlign: 'center',
  },
  numberPad: {
    padding: 20,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  numberButton: {
    width: CELL_SIZE * 1.2,
    height: CELL_SIZE * 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: CELL_SIZE * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  numberButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  notesButtonActive: {
    backgroundColor: '#4CAF50',
  },
});

export default GameScreen;
