import React, {useEffect, useState} from 'react';
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
import Toast from 'react-native-toast-message';
import { verifyLoginOtp } from '../services/authService';
import { saveTokens } from '../services/tokenStorage';
import {RootStackParamList} from '../navigations/AppNavigator'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
type OtpScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Otp'
>

const OtpScreen = ({route, navigation}: OtpScreenProps) => {
  const {colors} = useTheme();
const [loading, setLoading] = useState(false);

  const {identifier} = route.params;

  const [otp, setOtp] = useState('');
const [timer, setTimer] = useState(5 * 60);
  useEffect(() => {
    if (timer === 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer(current => current - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

const handleVerifyOtp = async () => {
  if (otp.length !== 6) {
    Toast.show({
      type: 'error',
      text1: 'Invalid OTP',
      text2: 'Please enter a valid 6-digit OTP.',
    });
    return;
  }

  try {
    setLoading(true);

    const isEmail = identifier.includes('@');

    const payload = isEmail
      ? {
          email: identifier,
          otp,
        }
      : {
          mobile: identifier,
          otp,
        };

    const data = await verifyLoginOtp(payload);
    // console.log('Login verify response:', response?.data?.accessToken);
    // console.log('Login verify response:', response?.data?.refreshToken);
    console.log(data)
const {
  accessToken,
  refreshToken,
  role,
} = data.data
console.log("a1",accessToken);
console.log("ar1",refreshToken);
console.log("a12",role);
await saveTokens(
  accessToken,
  refreshToken
);    

  Toast.show({
  type: 'success',
  text1: 'Login Successful',
  text2:
    role === 'ADMIN'
      ? 'Welcome Admin'
      : 'Welcome back',
});

if (role === 'ADMIN') {
  navigation.replace('AdminHome');
} else {
  navigation.replace('Home');
}

    // Token storage → Home
  } catch (error: any) {
    console.log('Login OTP verification error:', error.response.data);

    const message =
      error?.response?.data?.message ||
      'Invalid OTP. Please try again.';

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
    });
  } finally {
    setLoading(false);
  }
};
  const handleResendOtp = () => {
    if (timer > 0) {
      return;
    }

    console.log('Resend OTP:', identifier);
    setTimer(30);
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

    content: {
      flex: 1,
    },

    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: '700',
      marginBottom: spacing.sm,
    },

    description: {
      color: colors.textSecondary,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: spacing.xxl,
    },

    identifier: {
      color: colors.text,
      fontWeight: '600',
    },

    resendContainer: {
      alignItems: 'center',
      marginTop: spacing.xl,
    },

    resendText: {
      color: colors.textSecondary,
      fontSize: 14,
    },

    resendButton: {
      marginTop: spacing.sm,
    },

    resendLink: {
      color: timer === 0
        ? colors.primary
        : colors.textMuted,
      fontSize: 14,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          <TouchableOpacity
            style={styles.backButton}
            onPress={navigation.goBack}>
            <Text style={styles.backText}>
              ← Back
            </Text>
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.title}>
              Verify OTP
            </Text>

            <Text style={styles.description}>
              We've sent a 6-digit OTP to{' '}
              <Text style={styles.identifier}>
                {identifier}
              </Text>
              . Enter it below to continue.
            </Text>

            <AppInput
              label="One-Time Password"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChangeText={value =>
                setOtp(value.replace(/[^0-9]/g, ''))
              }
              keyboardType="number-pad"
              maxLength={6}
            />

            <AppButton
              title="Verify OTP"
              onPress={handleVerifyOtp}
              loading={loading}
              disabled={otp.length !== 6}
            />

            <View style={styles.resendContainer}>
              {timer > 0 ? (
                <Text style={styles.resendText}>
                  Resend OTP in {timer}s
                </Text>
              ) : (
                <Text style={styles.resendText}>
                  Didn't receive the OTP?
                </Text>
              )}

              {timer === 0 && (
                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={handleResendOtp}>
                  <Text style={styles.resendLink}>
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OtpScreen;