import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { startNewGame } from '../store/gameSlice';
import { generateSudoku } from '../utils/sudokuGenerator';
import { boardThemes } from '../themes/boardThemes';

const difficultyLevels = [
  { level: 1, name: 'Beginner', description: 'Perfect for learning' },
  { level: 2, name: 'Easy', description: 'Basic challenges' },
  { level: 3, name: 'Casual', description: 'Balanced gameplay' },
  { level: 4, name: 'Medium', description: 'More challenging' },
  { level: 5, name: 'Intermediate', description: 'Test your skills' },
  { level: 6, name: 'Hard', description: 'For experienced players' },
  { level: 7, name: 'Expert', description: 'Advanced techniques required' },
  { level: 8, name: 'Master', description: 'Serious challenge' },
  { level: 9, name: 'Grandmaster', description: 'Elite difficulty' },
  { level: 10, name: 'Legendary', description: 'The ultimate test' },
];

const DifficultyCard = ({ item, onSelect, selected }) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (selected) {
      Animated.spring(scale, {
        toValue: 1.05,
        friction: 3,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }
  }, [selected]);

  return (
    <TouchableOpacity
      onPress={() => onSelect(item.level)}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.difficultyCard,
          selected && styles.selectedCard,
          { transform: [{ scale }] },
        ]}
      >
        <Text style={styles.levelName}>{item.name}</Text>
        <Text style={styles.levelNumber}>Level {item.level}</Text>
        <Text style={styles.levelDescription}>{item.description}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const DifficultySelectScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('classic');

  const handleStartGame = () => {
    if (selectedDifficulty) {
      const game = generateSudoku(selectedDifficulty);
      dispatch(startNewGame({ ...game, difficulty: selectedDifficulty }));
      navigation.navigate('Game');
    }
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Select Difficulty</Text>
        <Text style={styles.subtitle}>Choose your challenge level</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {difficultyLevels.map((item) => (
          <DifficultyCard
            key={item.level}
            item={item}
            onSelect={setSelectedDifficulty}
            selected={selectedDifficulty === item.level}
          />
        ))}

        <View style={styles.themeSection}>
          <Text style={styles.themeTitle}>Board Theme</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.themesScrollView}
          >
            {Object.values(boardThemes).map((theme) => (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.themeCard,
                  selectedTheme === theme.id && styles.selectedThemeCard,
                ]}
                onPress={() => setSelectedTheme(theme.id)}
              >
                <View
                  style={[
                    styles.themePreview,
                    { backgroundColor: theme.colors.background },
                  ]}
                >
                  <View
                    style={[
                      styles.themePreviewGrid,
                      { borderColor: theme.colors.grid },
                    ]}
                  />
                </View>
                <Text style={styles.themeName}>{theme.name}</Text>
                <Text style={styles.themeDescription}>{theme.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.startButton,
          !selectedDifficulty && styles.startButtonDisabled,
        ]}
        onPress={handleStartGame}
        disabled={!selectedDifficulty}
      >
        <Text style={styles.startButtonText}>Start Game</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  difficultyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedCard: {
    backgroundColor: '#fff',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  levelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  levelNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  levelDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  themeSection: {
    marginTop: 20,
    marginBottom: 100,
  },
  themeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  themesScrollView: {
    flexDirection: 'row',
  },
  themeCard: {
    width: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedThemeCard: {
    backgroundColor: '#fff',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  themePreview: {
    width: '100%',
    height: 100,
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  themePreviewGrid: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
  },
  themeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  themeDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    margin: 20,
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
  startButtonDisabled: {
    backgroundColor: '#ccc',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DifficultySelectScreen;
