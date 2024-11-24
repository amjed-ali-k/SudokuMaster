import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import useStore from '../store/useStore';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue,
  withSpring,
  WithSpringConfig
} from 'react-native-reanimated';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { settings, game, profile } = useStore();
  const buttonScale = useSharedValue(1);

  const springConfig: WithSpringConfig = {
    damping: 10,
    mass: 1,
    stiffness: 100,
  };

  const animateButton = (scale: number) => {
    buttonScale.value = withSpring(scale, springConfig);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const handleNewGame = () => {
    navigation.navigate('DifficultySelect');
  };

  const handleContinueGame = () => {
    navigation.navigate('Game');
  };

  const renderWelcomeMessage = () => {
    const hasActiveGame = game.board.some(row => row.some(cell => cell !== 0));
    const username = profile?.username || 'Player';
    
    return (
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>
          Welcome back, {username}!
        </Text>
        <Text style={styles.subtitleText}>
          {hasActiveGame 
            ? "You have an active game. Continue your progress!" 
            : "Ready for a new challenge?"}
        </Text>
      </View>
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
          style={[styles.buttonContainer, animatedStyle]}
        >
          <TouchableOpacity
            style={[styles.button, styles.newGameButton]}
            onPressIn={() => animateButton(0.95)}
            onPressOut={() => animateButton(1)}
            onPress={handleNewGame}
          >
            <Text style={styles.buttonText}>New Game</Text>
          </TouchableOpacity>

          {game.board.some(row => row.some(cell => cell !== 0)) && (
            <TouchableOpacity
              style={[styles.button, styles.continueButton]}
              onPressIn={() => animateButton(0.95)}
              onPressOut={() => animateButton(1)}
              onPress={handleContinueGame}
            >
              <Text style={styles.buttonText}>Continue Game</Text>
            </TouchableOpacity>
          )}

          {game.history.length > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.historyButton]}
              onPressIn={() => animateButton(0.95)}
              onPressOut={() => animateButton(1)}
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
  welcomeContainer: {
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 18,
    color: '#fff',
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
  continueButton: {
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
