import React, {useEffect, useState} from 'react';
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
  PackageCheck,
  Scale,
  Sparkles,
  Sun,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import {RootStackParamList} from '../navigations/AppNavigator';
import {
  getProducts,
  updateProduct,
} from '../services/product.service';
import {useTheme} from '../theme/ThemeProvider';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'EditProduct'
>;

type Product = {
  id: number;
  name: string;
  metal_type: 'GOLD' | 'SILVER';
  purity: string | number;
  unit: 'GRAM' | 'KILOGRAM';
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const EditProductScreen = ({
  navigation,
  route,
}: Props) => {
  const {colors, mode, toggleTheme} = useTheme();

  const {productId} = route.params;

  const [name, setName] = useState('');
  const [metalType, setMetalType] =
    useState<'GOLD' | 'SILVER'>('GOLD');
  const [purity, setPurity] = useState('');
  const [unit, setUnit] =
    useState<'GRAM' | 'KILOGRAM'>('GRAM');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        const response = await getProducts();

        console.log('Products response:', response);

        const product: Product | undefined =
          response.products?.find(
            (item: Product) =>
              item.id === productId,
          );

        if (!product) {
          Toast.show({
            type: 'error',
            text1: 'Product not found',
            text2:
              'Unable to load the selected product.',
          });

          navigation.goBack();
          return;
        }

        setName(product.name);
        setMetalType(product.metal_type);
        setPurity(String(product.purity));
        setUnit(product.unit);
      } catch (error: any) {
        console.log(
          'Get product for edit error:',
          error,
        );

        Toast.show({
          type: 'error',
          text1: 'Failed to load product',
          text2:
            error?.response?.data?.message ||
            'Something went wrong',
        });

        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [navigation, productId]);

  const handleUpdate = async () => {
    const trimmedName = name.trim();
    const trimmedPurity = purity.trim();

    if (!trimmedName || !trimmedPurity) {
      Toast.show({
        type: 'error',
        text1: 'Required fields missing',
        text2:
          'Please enter product name and purity.',
      });
      return;
    }

    const purityValue = Number(trimmedPurity);

    if (
      Number.isNaN(purityValue) ||
      purityValue <= 0
    ) {
      Toast.show({
        type: 'error',
        text1: 'Invalid purity',
        text2:
          'Please enter a valid purity value.',
      });
      return;
    }

    try {
      setSaving(true);

      const response = await updateProduct(
        productId,
        {
          name: trimmedName,
          metal_type: metalType,
          purity: purityValue,
          unit,
        },
      );

      console.log(
        'Update product response:',
        response?.data,
      );

      Toast.show({
        type: 'success',
        text1:
          response?.message ||
          'Product updated successfully',
      });

      navigation.goBack();
    } catch (error: any) {
      console.log(
        'Update product error:',
        error?.response,
      );

      Toast.show({
        type: 'error',
        text1: 'Failed to update product',
        text2:
          error?.response?.data?.message ||
          'Something went wrong',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor:
              colors.background,
          },
        ]}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text
          style={[
            styles.loadingText,
            {
              color:
                colors.textSecondary,
            },
          ]}>
          Loading product...
        </Text>
      </View>
    );
  }

  const isGold = metalType === 'GOLD';

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
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

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.headerButton,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
            onPress={() =>
              navigation.goBack()
            }>
            <ArrowLeft
              size={21}
              color={colors.text}
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text
              style={[
                styles.headerTitle,
                {
                  color: colors.text,
                },
              ]}>
              Edit Product
            </Text>

            <Text
              style={[
                styles.headerSubtitle,
                {
                  color:
                    colors.textSecondary,
                },
              ]}>
              Update product information
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.headerButton,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
            onPress={toggleTheme}>
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

        {/* Hero */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor:
                colors.primary,
            },
          ]}>
          <View
            style={[
              styles.heroIcon,
              {
                backgroundColor:
                  colors.white + '20',
              },
            ]}>
            <PackageCheck
              size={30}
              color={colors.white}
            />
          </View>

          <View style={styles.heroContent}>
            <Text
              style={[
                styles.heroTitle,
                {
                  color: colors.white,
                },
              ]}>
              Update Product
            </Text>

            <Text
              style={[
                styles.heroDescription,
                {
                  color:
                    colors.white + 'CC',
                },
              ]}>
              Modify the details of your
              bullion product.
            </Text>
          </View>
        </View>

        {/* Form */}
        <View
          style={[
            styles.formCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}>
          <Text
            style={[
              styles.formTitle,
              {
                color: colors.text,
              },
            ]}>
            Product Details
          </Text>

          <Text
            style={[
              styles.formSubtitle,
              {
                color:
                  colors.textSecondary,
              },
            ]}>
            Update the information below.
          </Text>

          {/* Product Name */}
          <View style={styles.field}>
            <View style={styles.labelRow}>
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.text,
                  },
                ]}>
                Product Name
              </Text>

              <Text
                style={[
                  styles.required,
                  {
                    color:
                      colors.primary,
                  },
                ]}>
                Required
              </Text>
            </View>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor:
                    colors.background,
                  borderColor:
                    colors.border,
                  color: colors.text,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Example: 24K Gold"
              placeholderTextColor={
                colors.textSecondary
              }
              autoCapitalize="words"
            />
          </View>

          {/* Metal Type */}
          <View style={styles.field}>
            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                },
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
                        ? colors.primary +
                          '12'
                        : colors.background,
                    borderColor:
                      metalType === 'GOLD'
                        ? colors.primary
                        : colors.border,
                  },
                ]}
                onPress={() =>
                  setMetalType('GOLD')
                }>
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
                    size={20}
                    color={
                      metalType === 'GOLD'
                        ? colors.white
                        : colors.textSecondary
                    }
                  />
                </View>

                <View
                  style={
                    styles.optionContent
                  }>
                  <Text
                    style={[
                      styles.optionTitle,
                      {
                        color:
                          colors.text,
                      },
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
                        ? colors.primary +
                          '12'
                        : colors.background,
                    borderColor:
                      metalType === 'SILVER'
                        ? colors.primary
                        : colors.border,
                  },
                ]}
                onPress={() =>
                  setMetalType('SILVER')
                }>
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
                    size={20}
                    color={
                      metalType === 'SILVER'
                        ? colors.white
                        : colors.textSecondary
                    }
                  />
                </View>

                <View
                  style={
                    styles.optionContent
                  }>
                  <Text
                    style={[
                      styles.optionTitle,
                      {
                        color:
                          colors.text,
                      },
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
                  {
                    color: colors.text,
                  },
                ]}>
                Purity
              </Text>

              <Text
                style={[
                  styles.hint,
                  {
                    color:
                      colors.textSecondary,
                  },
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
                  borderColor:
                    colors.border,
                },
              ]}>
              <TextInput
                style={[
                  styles.purityInput,
                  {
                    color: colors.text,
                  },
                ]}
                value={purity}
                onChangeText={setPurity}
                placeholder="99.99"
                placeholderTextColor={
                  colors.textSecondary
                }
                keyboardType="decimal-pad"
              />

              <Text
                style={[
                  styles.percentText,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}>
                %
              </Text>
            </View>
          </View>

          {/* Unit */}
          <View
            style={[
              styles.field,
              styles.lastField,
            ]}>
            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                },
              ]}>
              Measurement Unit
            </Text>

            <View style={styles.optionsRow}>
              {/* Gram */}
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
                onPress={() =>
                  setUnit('GRAM')
                }>
                <Scale
                  size={19}
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

              {/* Kilogram */}
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
                }>
                <Scale
                  size={19}
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

        {/* Preview */}
        <View
          style={[
            styles.previewCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}>
          <Text
            style={[
              styles.previewTitle,
              {
                color: colors.text,
              },
            ]}>
            Updated Preview
          </Text>

          <Text
            style={[
              styles.previewSubtitle,
              {
                color:
                  colors.textSecondary,
              },
            ]}>
            Review the changes before saving.
          </Text>

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
                  {
                    color: colors.text,
                  },
                ]}>
                {name.trim() ||
                  'Product Name'}
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
                {purity.trim() ||
                  'Purity'} • {unit}
              </Text>
            </View>

            <View
              style={[
                styles.editBadge,
                {
                  backgroundColor:
                    colors.primary + '15',
                },
              ]}>
              <Text
                style={[
                  styles.editBadgeText,
                  {
                    color:
                      colors.primary,
                  },
                ]}>
                EDIT
              </Text>
            </View>
          </View>
        </View>

        {/* Update */}
        <TouchableOpacity
          style={[
            styles.updateButton,
            {
              backgroundColor:
                colors.primary,
              opacity: saving ? 0.7 : 1,
            },
          ]}
          onPress={handleUpdate}
          disabled={saving}
          activeOpacity={0.85}>
          {saving ? (
            <>
              <ActivityIndicator
                size="small"
                color={colors.white}
              />

              <Text
                style={[
                  styles.updateButtonText,
                  {
                    color:
                      colors.white,
                  },
                ]}>
                Updating Product...
              </Text>
            </>
          ) : (
            <>
              <PackageCheck
                size={20}
                color={colors.white}
              />

              <Text
                style={[
                  styles.updateButtonText,
                  {
                    color:
                      colors.white,
                  },
                ]}>
                Update Product
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text
          style={[
            styles.footerText,
            {
              color:
                colors.textSecondary,
            },
          ]}>
          Product ID: #{productId}
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

  /* Header */

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

  /* Hero */

  heroCard: {
    minHeight: 130,
    borderRadius: 20,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroContent: {
    flex: 1,
    marginLeft: spacing.md,
  },

  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  heroDescription: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.xs,
  },

  /* Form */

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

  lastField: {
    marginBottom: 0,
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

  percentText: {
    fontSize: 14,
    fontWeight: '700',
  },

  /* Metal */

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

  /* Unit */

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

  /* Preview */

  previewCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },

  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  previewSubtitle: {
    fontSize: 11,
    marginTop: 3,
    marginBottom: spacing.md,
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

  editBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
  },

  editBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },

  /* Update */

  updateButton: {
    minHeight: 55,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },

  updateButtonText: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },

  footerText: {
    textAlign: 'center',
    fontSize: 11,
    marginTop: spacing.md,
  },

  /* Loading */

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    fontSize: 13,
    marginTop: spacing.md,
  },
});

export default EditProductScreen;