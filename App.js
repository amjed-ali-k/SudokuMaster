import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import DifficultySelectScreen from './src/screens/DifficultySelectScreen';
import GameScreen from './src/screens/GameScreen';
import GameHistoryScreen from './src/screens/GameHistoryScreen';
import GameDetailsScreen from './src/screens/GameDetailsScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import PersonalScreen from './src/screens/PersonalScreen';
import ThemeSelectScreen from './src/screens/ThemeSelectScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DifficultySelect" component={DifficultySelectScreen} options={{ title: 'Select Difficulty' }} />
      <Stack.Screen name="Game" component={GameScreen} options={{ headerShown: false }} />
      <Stack.Screen name="GameHistory" component={GameHistoryScreen} options={{ title: 'Game History' }} />
      <Stack.Screen name="GameDetails" component={GameDetailsScreen} options={{ title: 'Game Details' }} />
      <Stack.Screen name="ThemeSelect" component={ThemeSelectScreen} options={{ title: 'Select Theme' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Achievements') {
                iconName = focused ? 'trophy' : 'trophy-outline';
              } else if (route.name === 'Personal') {
                iconName = focused ? 'person' : 'person-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#2196f3',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeStack} 
            options={{ headerShown: false }}
          />
          <Tab.Screen name="Achievements" component={AchievementsScreen} />
          <Tab.Screen name="Personal" component={PersonalScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
