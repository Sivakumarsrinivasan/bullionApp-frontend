export const lightColors = {
  background: '#F8F8F8',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  primary: '#C99700',
  primaryLight: '#F4E3A1',

  text: '#171717',
  textSecondary: '#6B6B6B',
  textMuted: '#999999',

  border: '#E5E5E5',
  inputBackground: '#F5F5F5',

  success: '#16A34A',
  error: '#DC2626',

  white: '#FFFFFF',
  black: '#000000',
};

export const darkColors = {
  background: '#0D0D0D',
  surface: '#171717',
  card: '#1E1E1E',

  primary: '#D4A72C',
  primaryLight: '#5C4A19',

  text: '#FFFFFF',
  textSecondary: '#B5B5B5',
  textMuted: '#777777',

  border: '#303030',
  inputBackground: '#202020',

  success: '#22C55E',
  error: '#EF4444',

  white: '#FFFFFF',
  black: '#000000',
};

export type AppColors =
  | typeof lightColors
  | typeof darkColors;