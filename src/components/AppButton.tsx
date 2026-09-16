import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import {useTheme} from '../theme/ThemeProvider';
import {spacing} from '../theme/spacing';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const AppButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
}: AppButtonProps) => {
  const {colors} = useTheme();

  const isDisabled = disabled || loading;

  const styles = StyleSheet.create({
    button: {
      height: 52,
      backgroundColor: colors.primary,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      opacity: isDisabled ? 0.6 : 1,
    },

    text: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.button, style]}>
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;