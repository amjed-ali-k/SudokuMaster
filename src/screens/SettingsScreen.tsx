import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import useStore from '../store/useStore';
import { boardThemes } from '../themes/boardThemes';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import * as Haptics from 'expo-haptics';
import * as Application from 'expo-application';
import storageManager from '../utils/storage';

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
  route: RouteProp<RootStackParamList, 'Settings'>;
};

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

interface SettingsItemProps {
  title: string;
  description?: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
  icon?: string;
  showArrow?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  description,
  value,
  onValueChange,
  onPress,
  icon,
  showArrow,
}) => {
  const content = (
    <View style={styles.settingItem}>
      {icon && (
        <View style={styles.settingIcon}>
          <Ionicons name={icon as any} size={24} color="#4c669f" />
        </View>
      )}
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && (
          <Text style={styles.settingDescription}>{description}</Text>
        )}
      </View>
      {onValueChange && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={value ? '#4c669f' : '#f4f3f4'}
          ios_backgroundColor="#767577"
        />
      )}
      {showArrow && (
        <Ionicons name="chevron-forward" size={24} color="#666" />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.settingTouchable}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { settings, updateSettings } = useStore();

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all app data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await storageManager.clearAllData();
            if (settings.hapticEnabled) {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
            }
            Alert.alert(
              'Data Cleared',
              'All app data has been successfully cleared.'
            );
          },
        },
      ]
    );
  };

  const handleToggleSetting = (key: keyof typeof settings) => (value: boolean) => {
    if (settings.hapticEnabled) {
      Haptics.selectionAsync();
    }
    updateSettings({ [key]: value });
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <SettingsSection title="Game Settings">
          <SettingsItem
            title="Board Theme"
            description="Choose your preferred board style"
            icon="color-palette"
            showArrow
            onPress={() => navigation.navigate('ThemeSelect')}
          />
          <SettingsItem
            title="Sound Effects"
            description="Play sounds during gameplay"
            icon="volume-high"
            value={settings.soundEnabled}
            onValueChange={handleToggleSetting('soundEnabled')}
          />
          <SettingsItem
            title="Haptic Feedback"
            description="Vibrate on actions"
            icon="vibrate"
            value={settings.hapticEnabled}
            onValueChange={handleToggleSetting('hapticEnabled')}
          />
        </SettingsSection>

        <SettingsSection title="Gameplay">
          <SettingsItem
            title="Auto Notes"
            description="Automatically update notes when placing numbers"
            icon="pencil"
            value={settings.autoNotesEnabled}
            onValueChange={handleToggleSetting('autoNotesEnabled')}
          />
          <SettingsItem
            title="Highlight Matching"
            description="Highlight matching numbers on the board"
            icon="grid"
            value={settings.highlightMatchingNumbers}
            onValueChange={handleToggleSetting('highlightMatchingNumbers')}
          />
          <SettingsItem
            title="Show Mistakes"
            description="Highlight incorrect numbers"
            icon="alert-circle"
            value={settings.showMistakes}
            onValueChange={handleToggleSetting('showMistakes')}
          />
        </SettingsSection>

        <SettingsSection title="Statistics">
          <SettingsItem
            title="Games Played"
            description={settings.statistics.gamesPlayed.toString()}
            icon="game-controller"
          />
          <SettingsItem
            title="Perfect Games"
            description={settings.statistics.perfectGames.toString()}
            icon="star"
          />
          <SettingsItem
            title="Best Streak"
            description={settings.statistics.bestStreak.toString()}
            icon="flame"
          />
          <SettingsItem
            title="Average Time"
            description={`${Math.floor(settings.statistics.averageTime / 60)}:${(
              settings.statistics.averageTime % 60
            )
              .toString()
              .padStart(2, '0')}`}
            icon="time"
          />
        </SettingsSection>

        <SettingsSection title="App Info">
          <SettingsItem
            title="Version"
            description={Application.nativeApplicationVersion || '1.0.0'}
            icon="information-circle"
          />
          <SettingsItem
            title="Rate App"
            description="Love the app? Give us a rating!"
            icon="star-half"
            showArrow
            onPress={() => {
              // Implement app store rating
            }}
          />
          <SettingsItem
            title="Share App"
            description="Share with friends and family"
            icon="share-social"
            showArrow
            onPress={() => {
              // Implement app sharing
            }}
          />
          <SettingsItem
            title="Clear Data"
            description="Reset all app data"
            icon="trash"
            showArrow
            onPress={handleClearData}
          />
        </SettingsSection>
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
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    marginTop: 20,
  },
  settingTouchable: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 102, 159, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default SettingsScreen;
