import * as Keychain from 'react-native-keychain';

const SERVICE_NAME = 'BullionAppTokens';

export const saveTokens = async (
  accessToken: string,
  refreshToken: string,
) => {
  // console.log('saveTokens called');

  // console.log('Keychain:', Keychain);
  // console.log(
  //   'setGenericPassword:',
  //   Keychain.setGenericPassword,
  // );

  try {
    const result = await Keychain.setGenericPassword(
      'bullion_user',
      JSON.stringify({
        accessToken,
        refreshToken,
      }),
      {
        service: SERVICE_NAME,
      },
    );

    // console.log('Keychain result:', result);
    // console.log('Tokens saved successfully');
  } catch (error) {
    console.log('Keychain save error:', error);
    throw error;
  }
};

export const getTokens = async () => {
  const credentials = await Keychain.getGenericPassword({
    service: SERVICE_NAME,
  });

  if (!credentials) {
    return null;
  }

  return JSON.parse(credentials.password) as {
    accessToken: string;
    refreshToken: string;
  };
};

export const clearTokens = async () => {
  await Keychain.resetGenericPassword({
    service: SERVICE_NAME,
  });
};