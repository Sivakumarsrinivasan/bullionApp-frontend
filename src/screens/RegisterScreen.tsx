import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import {useTheme} from '../theme/ThemeProvider';
import {spacing} from '../theme/spacing';
import {RootStackParamList} from '../navigations/AppNavigator';
import { sendRegistrationOtp } from '../services/authService';

type RegisterNavigationProp =
  NativeStackNavigationProp<
    RootStackParamList,
    'Register'
  >;

interface RegisterScreenProps {
  navigation: RegisterNavigationProp;
}

const RegisterScreen = ({
  navigation,
}: RegisterScreenProps) => {
  const {colors} = useTheme();

  const [identifier, setIdentifier] = useState('');
const [loading, setLoading] = useState(false);
const handleSendOtp = async () => {
  const value = identifier.trim();

  if (!value) {
    Toast.show({
      type: 'error',
      text1: 'Invalid Input',
      text2: 'Please enter your email or mobile number.',
    });
    return;
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  try {
    setLoading(true);

    const payload = isEmail
      ? {email: value}
      : {mobile: value};

    console.log('OTP payload:', payload);

    const response = await sendRegistrationOtp(payload);

    Toast.show({
      type: 'success',
      text1: 'OTP Sent',
      text2: response.message || 'OTP sent successfully.',
    });

    navigation.navigate('RegisterOtp', {
      identifier: value,
    });
  } catch (error: any) {
    console.log('Send OTP error:', error);

    const message =
      error?.response?.data?.message ||
      'Something went wrong. Please try again.';

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
    });
  } finally {
    setLoading(false);
  }
};

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: {
      flexGrow: 1,
      paddingHorizontal: spacing.xxl,
      paddingVertical: spacing.xl,
    },

    backButton: {
      marginTop: spacing.sm,
      marginBottom: spacing.xxxl,
    },

    backText: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: '600',
    },

    header: {
      alignItems: 'center',
      marginBottom: spacing.xxxl,
    },

    logo: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },

    logoText: {
      color: colors.white,
      fontSize: 28,
      fontWeight: '700',
    },

    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: '700',
      marginBottom: spacing.sm,
    },

    subtitle: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 21,
    },

    form: {
      marginTop: spacing.lg,
    },

    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: spacing.xxxl,
    },

    loginText: {
      color: colors.textSecondary,
      fontSize: 14,
    },

    loginLink: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '700',
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }>

        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Back */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>
              ← Back
            </Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>
                B
              </Text>
            </View>

            <Text style={styles.title}>
              Create Account
            </Text>

            <Text style={styles.subtitle}>
              Create your BullionApp account using your
              mobile number or email address.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <AppInput
              label="Mobile Number or Email"
              placeholder="Enter mobile number or email"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />

            <AppButton
              title="Send OTP"
              onPress={handleSendOtp}
              loading={loading}
              disabled={!identifier.trim()}
            />
          </View>

          {/* Login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account?{' '}
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>
                Login
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;