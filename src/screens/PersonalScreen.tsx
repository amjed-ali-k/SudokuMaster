import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  TextInput,
  Modal,
  ImageSourcePropType,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import useStore from '../store/useStore';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

interface PersonalScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Personal'>;
}

interface SettingItemProps {
  title: string;
  value: boolean | string;
  onValueChange: () => void;
  type?: 'switch' | 'button';
}

interface StatisticsCardProps {
  title: string;
  value: string | number;
}

interface Statistics {
  gamesPlayed: number;
  gamesWon: number;
  bestTime: number | null;
  averageTime: number | null;
}

interface UserProfile {
  username: string;
  avatar?: string;
  statistics: Statistics;
}

const SettingItem: React.FC<SettingItemProps> = ({ 
  title, 
  value, 
  onValueChange, 
  type = 'switch' 
}) => (
  <View style={styles.settingItem}>
    <Text style={styles.settingTitle}>{title}</Text>
    {type === 'switch' ? (
      <Switch
        value={value as boolean}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: '#4CAF50' }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    ) : (
      <TouchableOpacity onPress={onValueChange}>
        <Text style={styles.settingValue}>{value}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const StatisticsCard: React.FC<StatisticsCardProps> = ({ title, value }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const PersonalScreen: React.FC<PersonalScreenProps> = () => {
  const {
    theme,
    soundEnabled,
    vibrationEnabled,
    highlightSameNumbers,
    showMistakes,
    autoNotesEnabled,
    profile,
    setTheme,
    toggleSound,
    toggleVibration,
    toggleHighlightSameNumbers,
    toggleShowMistakes,
    toggleAutoNotes,
    updateProfile,
  } = useStore();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempUsername, setTempUsername] = useState(profile.username);

  const handleUpdateProfile = () => {
    updateProfile({ username: tempUsername });
    setIsEditingProfile(false);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => {/* Handle avatar change */}}
          >
            {profile.avatar ? (
              <Image 
                source={{ uri: profile.avatar } as ImageSourcePropType} 
                style={styles.avatar} 
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#fff" />
              </View>
            )}
            <View style={styles.editAvatarBadge}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditingProfile(true)}>
            <Text style={styles.username}>{profile.username || 'Player'}</Text>
            <Text style={styles.editProfile}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <StatisticsCard
              title="Games Played"
              value={profile.statistics.gamesPlayed}
            />
            <StatisticsCard
              title="Win Rate"
              value={`${Math.round((profile.statistics.gamesWon / profile.statistics.gamesPlayed) * 100) || 0}%`}
            />
            <StatisticsCard
              title="Best Time"
              value={profile.statistics.bestTime ? formatTime(profile.statistics.bestTime) : '-'}
            />
            <StatisticsCard
              title="Avg Time"
              value={profile.statistics.averageTime ? formatTime(profile.statistics.averageTime) : '-'}
            />
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsContainer}>
            <SettingItem
              title="Theme"
              value={theme === 'light' ? 'Light' : 'Dark'}
              onValueChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              type="button"
            />
            <SettingItem
              title="Sound"
              value={soundEnabled}
              onValueChange={toggleSound}
            />
            <SettingItem
              title="Vibration"
              value={vibrationEnabled}
              onValueChange={toggleVibration}
            />
            <SettingItem
              title="Highlight Same Numbers"
              value={highlightSameNumbers}
              onValueChange={toggleHighlightSameNumbers}
            />
            <SettingItem
              title="Show Mistakes"
              value={showMistakes}
              onValueChange={toggleShowMistakes}
            />
            <SettingItem
              title="Auto Notes"
              value={autoNotesEnabled}
              onValueChange={toggleAutoNotes}
            />
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditingProfile}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditingProfile(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              value={tempUsername}
              onChangeText={setTempUsername}
              placeholder="Enter username"
              placeholderTextColor="#666"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditingProfile(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  editProfile: {
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  settingsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PersonalScreen;
