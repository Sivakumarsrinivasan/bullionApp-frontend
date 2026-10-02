import * as Keychain from 'react-native-keychain';

const SERVICE_NAME = 'BullionAppTokens';

export const saveTokens = async (
  accessToken: string,
  refreshToken: string,
  role?: string,
) => {
  try {
    const existingTokens = await getTokens();

    await Keychain.setGenericPassword(
      'bullion_user',
      JSON.stringify({
        accessToken,
        refreshToken,
        role: role ?? existingTokens?.role,
      }),
      { service: SERVICE_NAME },
    );
  } catch (error) {
    console.log('Keychain save error:', error);
    throw error;
  }
};

export const getTokens = async () => {
  const credentials = await Keychain.getGenericPassword({
    service: SERVICE_NAME,
  });

  if (!credentials) return null;

  return JSON.parse(credentials.password) as {
    accessToken: string;
    refreshToken: string;
    role: string;
  };
};

export const clearTokens = async () => {
  await Keychain.resetGenericPassword({
    service: SERVICE_NAME,
  });
};