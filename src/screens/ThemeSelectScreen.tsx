import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import useStore from '../store/useStore';
import { boardThemes } from '../themes/boardThemes';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import * as Haptics from 'expo-haptics';

type ThemeSelectScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ThemeSelect'>;
  route: RouteProp<RootStackParamList, 'ThemeSelect'>;
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const PREVIEW_SIZE = CARD_WIDTH * 0.6;

const ThemeSelectScreen: React.FC<ThemeSelectScreenProps> = ({ navigation }) => {
  const { settings, updateSettings } = useStore();
  const [selectedTheme, setSelectedTheme] = useState(settings.boardTheme);

  const handleThemeSelect = (themeId: string) => {
    if (settings.hapticEnabled) {
      Haptics.selectionAsync();
    }
    setSelectedTheme(themeId);
    updateSettings({ boardTheme: themeId });
  };

  const renderPreviewBoard = (colors: typeof boardThemes.classic.colors) => {
    const cells = Array(9)
      .fill(0)
      .map((_, i) =>
        Array(9)
          .fill(0)
          .map((_, j) => (Math.random() > 0.7 ? Math.floor(Math.random() * 9) + 1 : 0))
      );

    return (
      <View
        style={[styles.previewBoard, { backgroundColor: colors.background }]}
      >
        {cells.map((row, i) => (
          <View key={i} style={styles.previewRow}>
            {row.map((cell, j) => (
              <View
                key={`${i}-${j}`}
                style={[
                  styles.previewCell,
                  {
                    borderRightWidth: (j + 1) % 3 === 0 ? 2 : 1,
                    borderBottomWidth: (i + 1) % 3 === 0 ? 2 : 1,
                    borderColor: colors.grid,
                  },
                ]}
              >
                {cell !== 0 && (
                  <Text
                    style={[
                      styles.previewCellText,
                      { color: colors.text },
                    ]}
                  >
                    {cell}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderThemeCard = (theme: typeof boardThemes.classic) => {
    const scale = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
      if (selectedTheme === theme.id) {
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
    }, [selectedTheme]);

    return (
      <TouchableOpacity
        key={theme.id}
        onPress={() => handleThemeSelect(theme.id)}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.themeCard,
            selectedTheme === theme.id && styles.selectedCard,
            { transform: [{ scale }] },
          ]}
        >
          <View style={styles.previewContainer}>
            {renderPreviewBoard(theme.colors)}
          </View>
          <View style={styles.themeInfo}>
            <Text style={styles.themeName}>{theme.name}</Text>
            <Text style={styles.themeDescription}>{theme.description}</Text>
          </View>
          {selectedTheme === theme.id && (
            <View style={styles.selectedIcon}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Select Theme</Text>
        <Text style={styles.subtitle}>Choose your preferred board style</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {Object.values(boardThemes).map((theme) => renderThemeCard(theme))}
      </ScrollView>
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
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  themeCard: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
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
  previewContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  previewBoard: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderWidth: 2,
    borderColor: '#000',
  },
  previewRow: {
    flex: 1,
    flexDirection: 'row',
  },
  previewCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  previewCellText: {
    fontSize: PREVIEW_SIZE / 25,
    fontWeight: '600',
  },
  themeInfo: {
    alignItems: 'center',
  },
  themeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  themeDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  selectedIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default ThemeSelectScreen;
