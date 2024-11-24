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
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  setTheme,
  toggleSound,
  toggleVibration,
  toggleHighlightSameNumbers,
  toggleShowMistakes,
  toggleAutoNotes,
  updateProfile,
} from '../store/settingsSlice';

const SettingItem = ({ title, value, onValueChange, type = 'switch' }) => (
  <View style={styles.settingItem}>
    <Text style={styles.settingTitle}>{title}</Text>
    {type === 'switch' ? (
      <Switch
        value={value}
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

const StatisticsCard = ({ title, value }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const PersonalScreen = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempUsername, setTempUsername] = useState(settings.username);

  const handleUpdateProfile = () => {
    dispatch(updateProfile({ username: tempUsername }));
    setIsEditingProfile(false);
  };

  const formatTime = (seconds) => {
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
            {settings.avatar ? (
              <Image source={{ uri: settings.avatar }} style={styles.avatar} />
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
            <Text style={styles.username}>{settings.username || 'Player'}</Text>
            <Text style={styles.editProfile}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <StatisticsCard
              title="Games Played"
              value={settings.statistics.gamesPlayed}
            />
            <StatisticsCard
              title="Win Rate"
              value={`${Math.round((settings.statistics.gamesWon / settings.statistics.gamesPlayed) * 100) || 0}%`}
            />
            <StatisticsCard
              title="Best Time"
              value={settings.statistics.bestTime ? formatTime(settings.statistics.bestTime) : '-'}
            />
            <StatisticsCard
              title="Avg Time"
              value={settings.statistics.averageTime ? formatTime(settings.statistics.averageTime) : '-'}
            />
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsContainer}>
            <SettingItem
              title="Theme"
              value={settings.theme === 'light' ? 'Light' : 'Dark'}
              onValueChange={() =>
                dispatch(setTheme(settings.theme === 'light' ? 'dark' : 'light'))
              }
              type="button"
            />
            <SettingItem
              title="Sound"
              value={settings.soundEnabled}
              onValueChange={() => dispatch(toggleSound())}
            />
            <SettingItem
              title="Vibration"
              value={settings.vibrationEnabled}
              onValueChange={() => dispatch(toggleVibration())}
            />
            <SettingItem
              title="Highlight Same Numbers"
              value={settings.highlightSameNumbers}
              onValueChange={() => dispatch(toggleHighlightSameNumbers())}
            />
            <SettingItem
              title="Show Mistakes"
              value={settings.showMistakes}
              onValueChange={() => dispatch(toggleShowMistakes())}
            />
            <SettingItem
              title="Auto Notes"
              value={settings.autoNotesEnabled}
              onValueChange={() => dispatch(toggleAutoNotes())}
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
