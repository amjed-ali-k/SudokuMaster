import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { startNewGame, loadGame } from '../store/gameSlice';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { username } = useSelector((state) => state.settings);
  const { gameHistory, isGameActive } = useSelector((state) => state.game);
  const buttonScale = new Animated.Value(1);

  const animateButton = (scale) => {
    Animated.spring(buttonScale, {
      toValue: scale,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleNewGame = () => {
    navigation.navigate('DifficultySelect');
  };

  const handleResumeGame = () => {
    if (isGameActive) {
      navigation.navigate('Game');
    }
  };

  const renderWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = 'Good ';
    if (hour < 12) greeting += 'morning';
    else if (hour < 18) greeting += 'afternoon';
    else greeting += 'evening';

    return (
      <Text style={styles.welcomeText}>
        {greeting}, {username || 'Player'}!
      </Text>
    );
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <View style={styles.content}>
        {renderWelcomeMessage()}
        
        <Animated.View
          style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}
        >
          <TouchableOpacity
            style={[styles.button, styles.newGameButton]}
            onPress={handleNewGame}
            onPressIn={() => animateButton(0.95)}
            onPressOut={() => animateButton(1)}
          >
            <Text style={styles.buttonText}>New Game</Text>
          </TouchableOpacity>

          {isGameActive && (
            <TouchableOpacity
              style={[styles.button, styles.resumeButton]}
              onPress={handleResumeGame}
            >
              <Text style={styles.buttonText}>Resume Game</Text>
            </TouchableOpacity>
          )}

          {gameHistory.length > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.historyButton]}
              onPress={() => navigation.navigate('GameHistory')}
            >
              <Text style={styles.buttonText}>Game History</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: width * 0.8,
    maxWidth: 300,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
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
  newGameButton: {
    backgroundColor: '#4CAF50',
  },
  resumeButton: {
    backgroundColor: '#2196F3',
  },
  historyButton: {
    backgroundColor: '#9C27B0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
