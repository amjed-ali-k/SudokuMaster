import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import PersonalScreen from './src/screens/PersonalScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
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
            tabBarActiveTintColor: '#4A90E2',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Achievements" component={AchievementsScreen} />
          <Tab.Screen name="Personal" component={PersonalScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
