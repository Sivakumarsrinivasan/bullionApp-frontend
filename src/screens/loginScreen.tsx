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

import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import {useTheme} from '../theme/ThemeProvider';
import {spacing} from '../theme/spacing';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigations/AppNavigator';
import Toast from 'react-native-toast-message';
import { sendLoginOtp } from '../services/authService';


type LoginNavigationProp =
  NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginNavigationProp;
}

const LoginScreen = ({navigation}: LoginScreenProps)  => {
  const {colors, mode, toggleTheme} = useTheme();

  const [identifier, setIdentifier] = useState('');
const [loading, setLoading] = useState(false);

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

    header: {
      alignItems: 'center',
      marginTop: spacing.huge,
      marginBottom: spacing.xxxl,
    },

    logo: {
      width: 68,
      height: 68,
      borderRadius: 34,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },

    logoText: {
      color: colors.white,
      fontSize: 30,
      fontWeight: '700',
    },

    appName: {
      color: colors.text,
      fontSize: 28,
      fontWeight: '700',
      marginBottom: spacing.xs,
    },

    subtitle: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
    },

    form: {
      width: '100%',
    },

    heading: {
      color: colors.text,
      fontSize: 22,
      fontWeight: '600',
      marginBottom: spacing.xs,
    },

    description: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 21,
      marginBottom: spacing.xl,
    },

    registerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: spacing.xxxl,
    },

    registerText: {
      color: colors.textSecondary,
      fontSize: 14,
    },

    registerLink: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '700',
    },

    themeButton: {
      alignSelf: 'center',
      marginTop: spacing.xxl,
      padding: spacing.sm,
    },

    themeText: {
      color: colors.textSecondary,
      fontSize: 13,
    },
  });

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

  try {
    setLoading(true);

    const isEmail = value.includes('@');

    const payload = isEmail
      ? {
          email: value,
        }
      : {
          mobile: value,
        };

    // console.log('Login OTP payload:', payload);

    const response = await sendLoginOtp(payload);

    // console.log('Login OTP response:', response?.response);

    Toast.show({
      type: 'success',
      text1: 'OTP Sent',
      text2: response.message || 'OTP sent successfully.',
    });

    navigation.navigate('Otp', {
      identifier: value,
    });
  } catch (error: any) {
    // console.log('Login Send OTP error:', error);
  console.log("========== API ERROR ==========");
    console.log("========== API ERROR ==========");
  console.log("MESSAGE:", error?.message);
  console.log("STATUS:", error?.response?.status);
  console.log("DATA:", JSON.stringify(error?.response?.data));
  console.log("CONFIG URL:", error?.config?.url);
  console.log("FULL URL:", error?.config?.baseURL + error?.config?.url);
  console.log("==============================");
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

const handleRegister = () => {
  // console.log("Hiii")
  navigation.navigate('Register');
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Branding */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>B</Text>
            </View>

            <Text style={styles.appName}>
              BullionApp
            </Text>

            <Text style={styles.subtitle}>
              Your trusted bullion investment platform
            </Text>
          </View>

          {/* Login */}
          <View style={styles.form}>
            <Text style={styles.heading}>
              Welcome Back
            </Text>

            <Text style={styles.description}>
              Enter your mobile number or email address.
              We'll send you a one-time password to continue.
            </Text>

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
            />
          </View>

          {/* Register */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don't have an account?{' '}
            </Text>

            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Temporary theme switch */}
          <TouchableOpacity
            style={styles.themeButton}
            onPress={toggleTheme}>
            <Text style={styles.themeText}>
              {mode === 'light'
                ? '🌙  Dark Mode'
                : '☀️  Light Mode'}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;