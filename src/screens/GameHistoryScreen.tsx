import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import useStore from '../store/useStore';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import type { GameHistory } from '../types';

type GameHistoryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GameHistory'>;
  route: RouteProp<RootStackParamList, 'GameHistory'>;
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

const GameHistoryScreen: React.FC<GameHistoryScreenProps> = ({ navigation }) => {
  const { game, settings } = useStore();

  const renderHistoryItem = ({ item }: { item: GameHistory }) => {
    const date = new Date(item.completedAt);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <TouchableOpacity
        style={styles.historyCard}
        onPress={() => navigation.navigate('GameDetails', { gameId: item.id })}
      >
        <LinearGradient
          colors={['#ffffff', '#f8f9fa']}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.difficultyText}>
              Level {item.difficulty}
            </Text>
            <Text style={styles.dateText}>
              {formattedDate} {formattedTime}
            </Text>
          </View>

          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.statText}>
                {Math.floor(item.duration / 60)}:
                {(item.duration % 60).toString().padStart(2, '0')}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="alert-circle-outline" size={20} color="#666" />
              <Text style={styles.statText}>{item.mistakes} mistakes</Text>
            </View>
            {item.perfect && (
              <View style={styles.perfectBadge}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.perfectText}>Perfect</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderStats = () => {
    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Your Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{settings.statistics.gamesPlayed}</Text>
            <Text style={styles.statLabel}>Games Played</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{settings.statistics.perfectGames}</Text>
            <Text style={styles.statLabel}>Perfect Games</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {settings.statistics.averageTime
                ? `${Math.floor(settings.statistics.averageTime / 60)}:${(
                    settings.statistics.averageTime % 60
                  ).toString().padStart(2, '0')}`
                : '--:--'}
            </Text>
            <Text style={styles.statLabel}>Average Time</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{settings.statistics.bestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <FlatList
        data={game.history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderStats}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  statsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 14,
  },
  historyCard: {
    width: CARD_WIDTH,
    marginBottom: 15,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardGradient: {
    borderRadius: 15,
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  difficultyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  perfectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  perfectText: {
    color: '#FFB700',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default GameHistoryScreen;
