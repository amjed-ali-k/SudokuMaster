import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, FlatList } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  WithSpringConfig,
  WithTimingConfig
} from 'react-native-reanimated';
import  useStore  from '../store/useStore';
import type { Achievement } from '../types';

type AchievementCardProps = {
  achievement: Achievement;
  recent?: boolean;
};

const AchievementCard = ({ achievement, recent = false }: AchievementCardProps) => {
  const scale = useSharedValue(recent ? 0.5 : 1);
  const rotate = useSharedValue(0);

  const springConfig: WithSpringConfig = {
    damping: 10,
    mass: 1,
    stiffness: 100,
  };

  const timingConfig: WithTimingConfig = {
    duration: 300,
  };

  React.useEffect(() => {
    if (recent) {
      scale.value = withSpring(1, springConfig);
      rotate.value = withSequence(
        withTiming(10, timingConfig),
        withTiming(-10, timingConfig),
        withTiming(0, timingConfig)
      );
    }
  }, [recent]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value}deg` }
      ],
    };
  });

  return (
    <Animated.View style={[styles.achievementCard, animatedStyle]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{achievement.icon}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{achievement.title}</Text>
        <Text style={styles.description}>{achievement.description}</Text>
        {achievement.progress !== undefined && achievement.total !== undefined && (
          <View style={styles.progressContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${(achievement.progress / achievement.total) * 100}%` }
              ]} 
            />
            <Text style={styles.progressText}>
              {achievement.progress}/{achievement.total}
            </Text>
          </View>
        )}
      </View>
      {achievement.unlocked && (
        <View style={styles.unlockedBadge}>
          <Text style={styles.unlockedText}>✓</Text>
        </View>
      )}
    </Animated.View>
  );
};

const AchievementsScreen = () => {
  const { achievements, recentUnlocks, clearRecentUnlocks } = useStore();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      clearRecentUnlocks();
    }, 3000);

    return () => clearTimeout(timer);
  }, [recentUnlocks]);

  const renderItem = ({ item }) => (
    <AchievementCard 
      achievement={item}
      recent={recentUnlocks.some(a => a.id === item.id)}
    />
  );

  const achievementsArray = Object.values(achievements);
  const unlockedCount = achievementsArray.filter((a) => a.unlocked).length;

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    opacity: 0.8,
  },
  listContainer: {
    padding: 15,
  },
  achievementCard: {
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
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBar: {
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
