import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import {useTheme} from '../theme/ThemeProvider';
import {spacing} from '../theme/spacing';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

const AppInput = ({
  label,
  error,
  ...textInputProps
}: AppInputProps) => {
  const {colors} = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.lg,
    },

    label: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
      marginBottom: spacing.sm,
    },

    input: {
      height: 52,
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: error ? colors.error : colors.border,
      borderRadius: 12,
      paddingHorizontal: spacing.lg,
      color: colors.text,
      fontSize: 16,
    },

    error: {
      color: colors.error,
      fontSize: 12,
      marginTop: spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        {...textInputProps}
        style={[styles.input, textInputProps.style]}
        placeholderTextColor={colors.textMuted}
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default AppInput;