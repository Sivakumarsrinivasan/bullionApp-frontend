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

import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import {RootStackParamList} from '../navigations/AppNavigator';
import {useTheme} from '../theme/ThemeProvider';
import {spacing} from '../theme/spacing';
import { completeRegistration } from '../services/authService';
import Toast from 'react-native-toast-message';

type CompleteProfileNavigationProp =
  NativeStackNavigationProp<
    RootStackParamList,
    'CompleteProfile'
  >;

interface CompleteProfileScreenProps {
  navigation: CompleteProfileNavigationProp;
  route: {
    params: {
      identifier: string;
      token:string
    };
  };
}

const CompleteProfileScreen = ({
  navigation,
  route,
}: CompleteProfileScreenProps) => {
  const {colors} = useTheme();

  const {identifier} = route.params;

  const [fullName, setFullName] = useState('');
const [loading, setLoading] = useState(false);
const handleCompleteProfile = async () => {
  const name = fullName.trim();
  const identifier = route.params.identifier.trim();
  const registrationToken = route.params.token;

  if (!name) {
    Toast.show({
      type: 'error',
      text1: 'Invalid Input',
      text2: 'Please enter your name.',
    });
    return;
  }

  try {
    setLoading(true);

    const isEmail = identifier.includes('@');

    const payload = isEmail
      ? {
          name,
          email: identifier,
        }
      : {
          name,
          mobile: identifier,
        };

    console.log('Complete Profile payload:', payload);

    const response = await completeRegistration(payload,registrationToken);

    console.log('Complete Profile response:', response);

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2:
        response.message ||
        'Registration completed successfully.',
    });

    navigation.navigate('Login');
  } catch (error: any) {
    console.log('Complete Profile error:', error);

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
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      flexGrow: 1,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxxl,
    },

    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      marginBottom: spacing.xl,
    },

    backText: {
      color: colors.text,
      fontSize: 28,
    },

    logoContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: spacing.xl,
    },

    logoText: {
      color: colors.white,
      fontSize: 30,
      fontWeight: '700',
    },

    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: spacing.sm,
    },

    subtitle: {
      color: colors.textSecondary,
      fontSize: 15,
      lineHeight: 22,
      textAlign: 'center',
      marginBottom: spacing.xxxl,
    },

    section: {
      marginBottom: spacing.lg,
    },

    identifierLabel: {
      color: colors.textSecondary,
      fontSize: 13,
      marginBottom: spacing.xs,
    },

    identifierText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
      marginBottom: spacing.xl,
    },

    button: {
      marginTop: spacing.md,
    },

    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: spacing.xl,
    },

    loginText: {
      color: colors.textSecondary,
      fontSize: 14,
    },

    loginLink: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>B</Text>
          </View>

          {/* Heading */}
          <Text style={styles.title}>
            Complete Your Profile
          </Text>

          <Text style={styles.subtitle}>
            Tell us a little about yourself to complete your
            Bullion account.
          </Text>

          {/* Verified Identifier */}
          <View style={styles.section}>
            <Text style={styles.identifierLabel}>
              Verified Mobile / Email
            </Text>

            <Text style={styles.identifierText}>
              {identifier}
            </Text>
          </View>

          {/* Name */}
          <AppInput
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          {/* Date of Birth */}

          {/* Continue */}
          <AppButton
            title="Continue"
            onPress={handleCompleteProfile}
            disabled={!fullName.trim()}
            loading={loading}
            style={styles.button}
          />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CompleteProfileScreen;