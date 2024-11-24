import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import useStore from '../store/useStore';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { boardThemes } from '../themes/boardThemes';

type GameDetailsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GameDetails'>;
  route: RouteProp<RootStackParamList, 'GameDetails'>;
};

const { width } = Dimensions.get('window');
const GRID_SIZE = width * 0.9;
const CELL_SIZE = GRID_SIZE / 9;

const GameDetailsScreen: React.FC<GameDetailsScreenProps> = ({ route, navigation }) => {
  const { game } = useStore();
  const gameHistory = game.history.find((h) => h.id === route.params.gameId);

  if (!gameHistory) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Game not found</Text>
      </View>
    );
  }

  const date = new Date(gameHistory.completedAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    try {
      const message = `I completed a Level ${gameHistory.difficulty} Sudoku puzzle in ${formatDuration(gameHistory.duration)}${
        gameHistory.perfect ? ' with a perfect score!' : '!'
      }\nPlay SudokuMaster now!`;
      await Share.share({
        message,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderGrid = () => {
    const theme = boardThemes[gameHistory.boardTheme || 'classic'];

    return (
      <View style={[styles.grid, { backgroundColor: theme.colors.background }]}>
        {gameHistory.finalBoard.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <View
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  {
                    borderColor: theme.colors.grid,
                    borderRightWidth: (colIndex + 1) % 3 === 0 ? 2 : 1,
                    borderBottomWidth: (rowIndex + 1) % 3 === 0 ? 2 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cellText,
                    {
                      color: gameHistory.initialBoard[rowIndex][colIndex] === 0
                        ? theme.colors.text
                        : theme.colors.note,
                    },
                  ]}
                >
                  {cell !== 0 ? cell : ''}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Game Details</Text>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardItem}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{formattedDate}</Text>
              <Text style={styles.value}>{formattedTime}</Text>
            </View>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.cardItem}>
              <Text style={styles.label}>Difficulty</Text>
              <Text style={styles.value}>Level {gameHistory.difficulty}</Text>
            </View>
            <View style={styles.cardItem}>
              <Text style={styles.label}>Duration</Text>
              <Text style={styles.value}>{formatDuration(gameHistory.duration)}</Text>
            </View>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.cardItem}>
              <Text style={styles.label}>Mistakes</Text>
              <Text style={styles.value}>{gameHistory.mistakes}</Text>
            </View>
            <View style={styles.cardItem}>
              <Text style={styles.label}>Perfect Game</Text>
              <Text style={styles.value}>{gameHistory.perfect ? 'Yes' : 'No'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.boardContainer}>
          <Text style={styles.boardTitle}>Final Board</Text>
          {renderGrid()}
        </View>

        <View style={styles.achievementsContainer}>
          <Text style={styles.achievementsTitle}>Achievements Earned</Text>
          {gameHistory.achievementsEarned?.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Ionicons name={achievement.icon} size={24} color="#FFD700" />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  shareButton: {
    padding: 10,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardItem: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  boardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  boardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  grid: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    borderWidth: 2,
    borderColor: '#000',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  cellText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  achievementsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  achievementsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF8E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default GameDetailsScreen;
