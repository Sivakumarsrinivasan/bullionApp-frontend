import React, {useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Check,
  CircleDollarSign,
  Moon,
  PackagePlus,
  Scale,
  Sparkles,
  Sun,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import {RootStackParamList} from '../navigations/AppNavigator';
import {createProduct} from '../services/product.service';
import {useTheme} from '../theme/ThemeProvider';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AddProduct'
>;

const AddProductScreen = ({navigation}: Props) => {
  const {colors, mode, toggleTheme} = useTheme();

  const [name, setName] = useState('');
  const [metalType, setMetalType] =
    useState<'GOLD' | 'SILVER'>('GOLD');
  const [purity, setPurity] = useState('');
  const [unit, setUnit] =
    useState<'GRAM' | 'KILOGRAM'>('GRAM');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedPurity = purity.trim();

    if (!trimmedName || !trimmedPurity) {
      Toast.show({
        type: 'error',
        text1: 'Required fields missing',
        text2: 'Please enter product name and purity.',
      });
      return;
    }

    const purityValue = Number(trimmedPurity);

    if (Number.isNaN(purityValue)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid purity',
        text2: 'Please enter a valid purity value.',
      });
      return;
    }

    try {
      setLoading(true);

      const product = await createProduct({
        name: trimmedName,
        metal_type: metalType,
        purity: purityValue,
        unit,
      });

      Toast.show({
        type: 'success',
        text1:
          product?.message ||
          'Product created successfully',
      });

      navigation.goBack();
    } catch (error: any) {
      console.log('Create product error:', error);

      Toast.show({
        type: 'error',
        text1: 'Failed to create product',
        text2:
          error?.response?.data?.message ||
          'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  const isGold = metalType === 'GOLD';

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}>

        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.headerButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <ArrowLeft
              size={21}
              color={colors.text}
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text
              style={[
                styles.headerTitle,
                {color: colors.text},
              ]}>
              Add Product
            </Text>

            <Text
              style={[
                styles.headerSubtitle,
                {color: colors.textSecondary},
              ]}>
              Create a new bullion product
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.headerButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={toggleTheme}
            activeOpacity={0.7}>
            {mode === 'dark' ? (
              <Sun
                size={20}
                color={colors.text}
              />
            ) : (
              <Moon
                size={20}
                color={colors.text}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* ================= INTRO CARD ================= */}
        <View
          style={[
            styles.introCard,
            {
              backgroundColor: colors.primary,
            },
          ]}>
          <View
            style={[
              styles.introIcon,
              {
                backgroundColor:
                  colors.white + '20',
              },
            ]}>
            <PackagePlus
              size={30}
              color={colors.white}
            />
          </View>

          <View style={styles.introContent}>
            <Text
              style={[
                styles.introTitle,
                {color: colors.white},
              ]}>
              Product Information
            </Text>

            <Text
              style={[
                styles.introDescription,
                {
                  color: colors.white + 'CC',
                },
              ]}>
              Add the metal, purity and measurement
              details for your product.
            </Text>
          </View>
        </View>

        {/* ================= FORM ================= */}
        <View
          style={[
            styles.formCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}>

          <Text
            style={[
              styles.formTitle,
              {color: colors.text},
            ]}>
            Basic Details
          </Text>

          <Text
            style={[
              styles.formSubtitle,
              {color: colors.textSecondary},
            ]}>
            Enter the product information below
          </Text>

          {/* Product Name */}
          <View style={styles.field}>
            <View style={styles.labelRow}>
              <Text
                style={[
                  styles.label,
                  {color: colors.text},
                ]}>
                Product Name
              </Text>

              <Text
                style={[
                  styles.required,
                  {color: colors.primary},
                ]}>
                Required
              </Text>
            </View>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Example: 24K Gold"
              placeholderTextColor={
                colors.textSecondary
              }
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* Metal Type */}
          <View style={styles.field}>
            <Text
              style={[
                styles.label,
                {color: colors.text},
              ]}>
              Metal Type
            </Text>

            <View style={styles.optionsRow}>
              {/* Gold */}
              <TouchableOpacity
                style={[
                  styles.metalCard,
                  {
                    backgroundColor:
                      metalType === 'GOLD'
                        ? colors.primary + '12'
                        : colors.background,
                    borderColor:
                      metalType === 'GOLD'
                        ? colors.primary
                        : colors.border,
                  },
                ]}
                onPress={() =>
                  setMetalType('GOLD')
                }
                activeOpacity={0.8}>

                <View
                  style={[
                    styles.optionIcon,
                    {
                      backgroundColor:
                        metalType === 'GOLD'
                          ? colors.primary
                          : colors.card,
                    },
                  ]}>
                  <CircleDollarSign
                    size={21}
                    color={
                      metalType === 'GOLD'
                        ? colors.white
                        : colors.textSecondary
                    }
                  />
                </View>

                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionTitle,
                      {color: colors.text},
                    ]}>
                    Gold
                  </Text>

                  <Text
                    style={[
                      styles.optionSubtitle,
                      {
                        color:
                          colors.textSecondary,
                      },
                    ]}>
                    GOLD
                  </Text>
                </View>

                {metalType === 'GOLD' && (
                  <View
                    style={[
                      styles.selectedIcon,
                      {
                        backgroundColor:
                          colors.primary,
                      },
                    ]}>
                    <Check
                      size={13}
                      color={colors.white}
                    />
                  </View>
                )}
              </TouchableOpacity>

              {/* Silver */}
              <TouchableOpacity
                style={[
                  styles.metalCard,
                  {
                    backgroundColor:
                      metalType === 'SILVER'
                        ? colors.primary + '12'
                        : colors.background,
                    borderColor:
                      metalType === 'SILVER'
                        ? colors.primary
                        : colors.border,
                  },
                ]}
                onPress={() =>
                  setMetalType('SILVER')
                }
                activeOpacity={0.8}>

                <View
                  style={[
                    styles.optionIcon,
                    {
                      backgroundColor:
                        metalType === 'SILVER'
                          ? colors.primary
                          : colors.card,
                    },
                  ]}>
                  <Sparkles
                    size={21}
                    color={
                      metalType === 'SILVER'
                        ? colors.white
                        : colors.textSecondary
                    }
                  />
                </View>

                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionTitle,
                      {color: colors.text},
                    ]}>
                    Silver
                  </Text>

                  <Text
                    style={[
                      styles.optionSubtitle,
                      {
                        color:
                          colors.textSecondary,
                      },
                    ]}>
                    SILVER
                  </Text>
                </View>

                {metalType === 'SILVER' && (
                  <View
                    style={[
                      styles.selectedIcon,
                      {
                        backgroundColor:
                          colors.primary,
                      },
                    ]}>
                    <Check
                      size={13}
                      color={colors.white}
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Purity */}
          <View style={styles.field}>
            <View style={styles.labelRow}>
              <Text
                style={[
                  styles.label,
                  {color: colors.text},
                ]}>
                Purity
              </Text>

              <Text
                style={[
                  styles.hint,
                  {color: colors.textSecondary},
                ]}>
                Example: 99.99
              </Text>
            </View>

            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor:
                    colors.background,
                  borderColor: colors.border,
                },
              ]}>
              <TextInput
                style={[
                  styles.purityInput,
                  {color: colors.text},
                ]}
                placeholder="99.99"
                placeholderTextColor={
                  colors.textSecondary
                }
                value={purity}
                onChangeText={setPurity}
                keyboardType="decimal-pad"
              />

              <Text
                style={[
                  styles.percent,
                  {
                    color: colors.textSecondary,
                  },
                ]}>
                %
              </Text>
            </View>
          </View>

          {/* Unit */}
          <View style={styles.field}>
            <Text
              style={[
                styles.label,
                {color: colors.text},
              ]}>
              Measurement Unit
            </Text>

            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[
                  styles.unitCard,
                  {
                    backgroundColor:
                      unit === 'GRAM'
                        ? colors.primary
                        : colors.background,
                    borderColor:
                      unit === 'GRAM'
                        ? colors.primary
                        : colors.border,
                  },
                ]}
                onPress={() => setUnit('GRAM')}
                activeOpacity={0.8}>
                <Scale
                  size={20}
                  color={
                    unit === 'GRAM'
                      ? colors.white
                      : colors.textSecondary
                  }
                />

                <Text
                  style={[
                    styles.unitText,
                    {
                      color:
                        unit === 'GRAM'
                          ? colors.white
                          : colors.text,
                    },
                  ]}>
                  Gram
                </Text>

                {unit === 'GRAM' && (
                  <Check
                    size={17}
                    color={colors.white}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.unitCard,
                  {
                    backgroundColor:
                      unit === 'KILOGRAM'
                        ? colors.primary
                        : colors.background,
                    borderColor:
                      unit === 'KILOGRAM'
                        ? colors.primary
                        : colors.border,
                  },
                ]}
                onPress={() =>
                  setUnit('KILOGRAM')
                }
                activeOpacity={0.8}>
                <Scale
                  size={20}
                  color={
                    unit === 'KILOGRAM'
                      ? colors.white
                      : colors.textSecondary
                  }
                />

                <Text
                  style={[
                    styles.unitText,
                    {
                      color:
                        unit === 'KILOGRAM'
                          ? colors.white
                          : colors.text,
                    },
                  ]}>
                  Kilogram
                </Text>

                {unit === 'KILOGRAM' && (
                  <Check
                    size={17}
                    color={colors.white}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ================= PREVIEW ================= */}
        <View
          style={[
            styles.previewCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}>
          <View style={styles.previewHeader}>
            <View>
              <Text
                style={[
                  styles.previewTitle,
                  {color: colors.text},
                ]}>
                Preview
              </Text>

              <Text
                style={[
                  styles.previewSubtitle,
                  {
                    color: colors.textSecondary,
                  },
                ]}>
                How this product will appear
              </Text>
            </View>
          </View>

          <View style={styles.previewRow}>
            <View
              style={[
                styles.previewIcon,
                {
                  backgroundColor:
                    colors.primary + '15',
                },
              ]}>
              {isGold ? (
                <CircleDollarSign
                  size={24}
                  color={colors.primary}
                />
              ) : (
                <Sparkles
                  size={24}
                  color={colors.primary}
                />
              )}
            </View>

            <View style={styles.previewInfo}>
              <Text
                style={[
                  styles.previewName,
                  {color: colors.text},
                ]}>
                {name.trim() || 'Product Name'}
              </Text>

              <Text
                style={[
                  styles.previewDetails,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}>
                {metalType} •{' '}
                {purity.trim() || 'Purity'} •{' '}
                {unit}
              </Text>
            </View>

            <View
              style={[
                styles.newBadge,
                {
                  backgroundColor:
                    colors.success + '18',
                },
              ]}>
              <Text
                style={[
                  styles.newBadgeText,
                  {
                    color: colors.success,
                  },
                ]}>
                NEW
              </Text>
            </View>
          </View>
        </View>

        {/* ================= CREATE ================= */}
        <TouchableOpacity
          style={[
            styles.createButton,
            {
              backgroundColor: colors.primary,
              opacity: loading ? 0.7 : 1,
            },
          ]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}>
          {loading ? (
            <>
              <ActivityIndicator
                size="small"
                color={colors.white}
              />

              <Text
                style={[
                  styles.createButtonText,
                  {color: colors.white},
                ]}>
                Creating Product...
              </Text>
            </>
          ) : (
            <>
              <PackagePlus
                size={20}
                color={colors.white}
              />

              <Text
                style={[
                  styles.createButtonText,
                  {color: colors.white},
                ]}>
                Create Product
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text
          style={[
            styles.footerText,
            {
              color: colors.textSecondary,
            },
          ]}>
          You can edit these details later.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxxl,
  },

  /* ================= HEADER ================= */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  headerButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerText: {
    flex: 1,
    marginHorizontal: spacing.md,
  },

  headerTitle: {
    ...typography.title,
    fontWeight: '700',
  },

  headerSubtitle: {
    ...typography.small,
    marginTop: spacing.xs,
  },

  /* ================= INTRO ================= */

  introCard: {
    minHeight: 135,
    borderRadius: 20,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  introIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  introContent: {
    flex: 1,
    marginLeft: spacing.md,
  },

  introTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  introDescription: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.xs,
  },

  /* ================= FORM ================= */

  formCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },

  formTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  formSubtitle: {
    fontSize: 12,
    marginTop: 3,
    marginBottom: spacing.xl,
  },

  field: {
    marginBottom: spacing.xl,
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },

  label: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },

  required: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  hint: {
    fontSize: 11,
  },

  input: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: spacing.md,
    fontSize: 14,
  },

  inputWrapper: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },

  purityInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },

  percent: {
    fontSize: 14,
    fontWeight: '700',
  },

  /* ================= METAL OPTIONS ================= */

  optionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  metalCard: {
    flex: 1,
    minHeight: 76,
    borderWidth: 1,
    borderRadius: 15,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },

  optionSubtitle: {
    fontSize: 10,
    marginTop: 2,
  },

  selectedIcon: {
    width: 21,
    height: 21,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ================= UNIT ================= */

  unitCard: {
    flex: 1,
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },

  unitText: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 13,
    fontWeight: '600',
  },

  /* ================= PREVIEW ================= */

  previewCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },

  previewHeader: {
    marginBottom: spacing.md,
  },

  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  previewSubtitle: {
    fontSize: 11,
    marginTop: 3,
  },

  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  previewInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  previewName: {
    fontSize: 14,
    fontWeight: '700',
  },

  previewDetails: {
    fontSize: 11,
    marginTop: 3,
  },

  newBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
  },

  newBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },

  /* ================= CREATE ================= */

  createButton: {
    minHeight: 55,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },

  createButtonText: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },

  footerText: {
    textAlign: 'center',
    fontSize: 11,
    marginTop: spacing.md,
  },
});

export default AddProductScreen;
