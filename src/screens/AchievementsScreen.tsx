import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import useStore from '../store/useStore';

type AchievementsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Achievements'>;
};

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

interface AchievementItemProps {
  item: Achievement;
  recent: boolean;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ item, recent }) => {
  const scaleAnim = React.useRef(new Animated.Value(recent ? 0.5 : 1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (recent) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [recent]);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  return (
    <Animated.View
      style={[
        styles.achievementItem,
        {
          transform: [{ scale: scaleAnim }, { rotate }],
          opacity: item.unlocked ? 1 : 0.5,
        },
      ]}
    >
      <View style={styles.achievementIcon}>
        <Text style={styles.iconText}>{item.icon}</Text>
      </View>
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementTitle}>{item.title}</Text>
        <Text style={styles.achievementDescription}>{item.description}</Text>
        {item.progress !== undefined && item.total !== undefined && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(item.progress / item.total) * 100}%` },
              ]}
            />
            <Text style={styles.progressText}>
              {item.progress}/{item.total}
            </Text>
          </View>
        )}
      </View>
      {item.unlocked && (
        <View style={styles.unlockedBadge}>
          <Text style={styles.unlockedText}>✓</Text>
        </View>
      )}
    </Animated.View>
  );
};

const AchievementsScreen: React.FC<AchievementsScreenProps> = () => {
  const { achievements, recentUnlocks, clearRecentUnlocks } = useStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      clearRecentUnlocks();
    }, 3000);

    return () => clearTimeout(timer);
  }, [recentUnlocks]);

  const renderItem: ListRenderItem<Achievement> = ({ item }) => (
    <AchievementItem
      item={item}
      recent={recentUnlocks.some((unlock) => unlock.id === item.id)}
    />
  );

  const achievementsArray = Object.values(achievements);
  const unlockedCount = achievementsArray.filter((a) => a.unlocked).length;

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Achievements</Text>
        <Text style={styles.headerSubtitle}>
          {unlockedCount}/{achievementsArray.length} Unlocked
        </Text>
      </View>
      <FlatList
        data={achievementsArray}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  listContainer: {
    padding: 15,
  },
  achievementItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
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
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    position: 'absolute',
    right: 0,
    top: 8,
    fontSize: 12,
    color: '#666',
  },
  unlockedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  unlockedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AchievementsScreen;
