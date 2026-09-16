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
  CheckCircle2,
  History,
  Moon,
  Package,
  Save,
  Sun,
  TrendingDown,
  TrendingUp,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import {RootStackParamList} from '../navigations/AppNavigator';
import {
    getCurrentProductRates,
    getProductRate,
  updateProductRate,
} from '../services/product.service';

import {useTheme} from '../theme/ThemeProvider';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'EditProductRate'
>;

type ProductRate = {
  id: number;
  product_id: number;
  buy_price: string | number;
  sell_price: string | number;
};

const EditProductRateScreen = ({
  navigation,
  route,
}: Props) => {
  const {colors, mode, toggleTheme} = useTheme();

  const {rateId} = route.params;

  const [productId, setProductId] =
    useState<number | null>(null);

  const [productName, setProductName] =
    useState('Product');

  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] =
    useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /*
   * Load the existing product rate.
   */
  useEffect(() => {
const loadRate = async () => {
  try {
    setLoading(true);

    const rates = await getCurrentProductRates();

    console.log('Current product rates:', rates);
    console.log('Selected rate ID:', rateId);

    const selectedRate = rates.find(
      (rate: ProductRate) =>
        Number(rate.id) === Number(rateId),
    );

    if (!selectedRate) {
      Toast.show({
        type: 'error',
        text1: 'Rate not found',
        text2: 'Unable to load the selected product rate.',
      });

      navigation.goBack();
      return;
    }

    setProductId(selectedRate.product_id);

    setBuyPrice(
      String(selectedRate.buy_price),
    );

    setSellPrice(
      String(selectedRate.sell_price),
    );

  } catch (error: any) {
    console.log(
      'Get product rate error:',
      error,
    );

    Toast.show({
      type: 'error',
      text1: 'Failed to load rate',
      text2:
        error?.response?.data?.message ||
        'Something went wrong',
    });

    navigation.goBack();
  } finally {
    setLoading(false);
  }
};

    loadRate();
  }, [navigation, rateId]);

  const handleUpdate = async () => {
    const buy = Number(
      buyPrice.trim(),
    );

    const sell = Number(
      sellPrice.trim(),
    );

    if (
      !buyPrice.trim() ||
      !sellPrice.trim() ||
      Number.isNaN(buy) ||
      Number.isNaN(sell)
    ) {
      Toast.show({
        type: 'error',
        text1: 'Invalid price',
        text2:
          'Please enter valid BUY and SELL prices.',
      });
      return;
    }

    if (buy <= 0 || sell <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Invalid price',
        text2:
          'Prices must be greater than zero.',
      });
      return;
    }

    /*
     * This matches your current backend
     * updateProductRateSchema.
     */
    if (buy < sell) {
      Toast.show({
        type: 'error',
        text1: 'Invalid price range',
        text2:
          'BUY price must be greater than or equal to SELL price.',
      });
      return;
    }

    try {
      setSaving(true);

      const response =
        await updateProductRate(
          rateId,
          {
            buy_price: buy,
            sell_price: sell,
          },
        );

      console.log(
        'Update product rate response:',
        response,
      );

      Toast.show({
        type: 'success',
        text1:
          response?.message ||
          'Product rate updated successfully',
      });

      navigation.goBack();
    } catch (error: any) {
      console.log(
        'Update product rate error:',
        error,
      );

      Toast.show({
        type: 'error',
        text1:
          'Failed to update product rate',
        text2:
          error?.response?.data?.message ||
          'Something went wrong',
      });
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (
    value: string,
  ) => {
    if (!value) {
      return '0.00';
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return '0.00';
    }

    return numericValue.toLocaleString(
      'en-IN',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    );
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
          Loading rate...
        </Text>
      </View>
    );
  }

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
        contentContainerStyle={
          styles.content
        }>

        {/* ================= HEADER ================= */}

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
            }
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
                {
                  color: colors.text,
                },
              ]}>
              Edit Product Rate
            </Text>

            <Text
              style={[
                styles.headerSubtitle,
                {
                  color:
                    colors.textSecondary,
                },
              ]}>
              Update BUY and SELL prices
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

        {/* ================= HERO ================= */}

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
            <Save
              size={30}
              color={colors.white}
            />
          </View>

          <View style={styles.heroContent}>
            <Text
              style={[
                styles.heroTitle,
                {
                  color:
                    colors.white,
                },
              ]}>
              Update Pricing
            </Text>

            <Text
              style={[
                styles.heroDescription,
                {
                  color:
                    colors.white + 'CC',
                },
              ]}>
              Change the current BUY and
              SELL prices for this product.
            </Text>
          </View>
        </View>

        {/* ================= PRODUCT ================= */}

        <View
          style={[
            styles.productCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}>
          <View
            style={[
              styles.productIcon,
              {
                backgroundColor:
                  colors.primary + '15',
              },
            ]}>
            <Package
              size={24}
              color={colors.primary}
            />
          </View>

          <View style={styles.productInfo}>
            <Text
              style={[
                styles.productName,
                {
                  color: colors.text,
                },
              ]}>
              {productName}
            </Text>

            <Text
              style={[
                styles.productId,
                {
                  color:
                    colors.textSecondary,
                },
              ]}>
              Product ID:{' '}
              {productId
                ? `#${productId}`
                : 'Not available'}
            </Text>
          </View>

          <View
            style={[
              styles.currentBadge,
              {
                backgroundColor:
                  colors.success + '15',
              },
            ]}>
            <CheckCircle2
              size={14}
              color={
                colors.success
              }
            />

            <Text
              style={[
                styles.currentBadgeText,
                {
                  color:
                    colors.success,
                },
              ]}>
              CURRENT
            </Text>
          </View>
        </View>

        {/* ================= FORM ================= */}

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
            Rate Details
          </Text>

          <Text
            style={[
              styles.formSubtitle,
              {
                color:
                  colors.textSecondary,
              },
            ]}>
            Enter the updated pricing.
          </Text>

          {/* BUY */}

          <View style={styles.field}>
            <View style={styles.labelRow}>
              <View
                style={
                  styles.labelWithIcon
                }>
                <TrendingUp
                  size={16}
                  color={
                    colors.success
                  }
                />

                <Text
                  style={[
                    styles.label,
                    {
                      color:
                        colors.text,
                    },
                  ]}>
                  BUY Price
                </Text>
              </View>

              <Text
                style={[
                  styles.required,
                  {
                    color:
                      colors.success,
                  },
                ]}>
                Required
              </Text>
            </View>

            <View
              style={[
                styles.priceInputWrapper,
                {
                  backgroundColor:
                    colors.background,
                  borderColor:
                    colors.border,
                },
              ]}>
              <Text
                style={[
                  styles.currency,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}>
                ₹
              </Text>

              <TextInput
                style={[
                  styles.priceInput,
                  {
                    color:
                      colors.text,
                  },
                ]}
                value={buyPrice}
                onChangeText={
                  setBuyPrice
                }
                placeholder="0.00"
                placeholderTextColor={
                  colors.textSecondary
                }
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* SELL */}

          <View
            style={[
              styles.field,
              styles.lastField,
            ]}>
            <View style={styles.labelRow}>
              <View
                style={
                  styles.labelWithIcon
                }>
                <TrendingDown
                  size={16}
                  color={
                    colors.primary
                  }
                />

                <Text
                  style={[
                    styles.label,
                    {
                      color:
                        colors.text,
                    },
                  ]}>
                  SELL Price
                </Text>
              </View>

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

            <View
              style={[
                styles.priceInputWrapper,
                {
                  backgroundColor:
                    colors.background,
                  borderColor:
                    colors.border,
                },
              ]}>
              <Text
                style={[
                  styles.currency,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}>
                ₹
              </Text>

              <TextInput
                style={[
                  styles.priceInput,
                  {
                    color:
                      colors.text,
                  },
                ]}
                value={sellPrice}
                onChangeText={
                  setSellPrice
                }
                placeholder="0.00"
                placeholderTextColor={
                  colors.textSecondary
                }
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </View>

        {/* ================= PREVIEW ================= */}

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
          <View style={styles.previewHeader}>
            <View>
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
                Review before saving.
              </Text>
            </View>

            <History
              size={20}
              color={
                colors.textSecondary
              }
            />
          </View>

          <View
            style={[
              styles.previewPrices,
              {
                backgroundColor:
                  colors.background,
              },
            ]}>
            <View
              style={
                styles.previewPriceItem
              }>
              <View
                style={
                  styles.previewLabelRow
                }>
                <TrendingUp
                  size={14}
                  color={
                    colors.success
                  }
                />

                <Text
                  style={[
                    styles.previewLabel,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}>
                  BUY
                </Text>
              </View>

              <Text
                style={[
                  styles.previewPrice,
                  {
                    color:
                      colors.text,
                  },
                ]}>
                ₹ {formatPrice(buyPrice)}
              </Text>
            </View>

            <View
              style={[
                styles.previewDivider,
                {
                  backgroundColor:
                    colors.border,
                },
              ]}
            />

            <View
              style={
                styles.previewPriceItem
              }>
              <View
                style={
                  styles.previewLabelRow
                }>
                <TrendingDown
                  size={14}
                  color={
                    colors.primary
                  }
                />

                <Text
                  style={[
                    styles.previewLabel,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}>
                  SELL
                </Text>
              </View>

              <Text
                style={[
                  styles.previewPrice,
                  {
                    color:
                      colors.primary,
                  },
                ]}>
                ₹ {formatPrice(sellPrice)}
              </Text>
            </View>
          </View>
        </View>

        {/* ================= SAVE ================= */}

        <TouchableOpacity
          style={[
            styles.updateButton,
            {
              backgroundColor:
                colors.primary,
              opacity: saving
                ? 0.7
                : 1,
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
                Updating Rate...
              </Text>
            </>
          ) : (
            <>
              <Save
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
                Update Product Rate
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
          Rate ID: #{rateId}
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

  /* Product */

  productCard: {
    minHeight: 76,
    borderWidth: 1,
    borderRadius: 18,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  productInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  productName: {
    fontSize: 15,
    fontWeight: '700',
  },

  productId: {
    fontSize: 10,
    marginTop: 3,
  },

  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },

  currentBadgeText: {
    fontSize: 8,
    fontWeight: '700',
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

  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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

  priceInputWrapper: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },

  currency: {
    fontSize: 16,
    fontWeight: '700',
  },

  priceInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
    paddingVertical: 0,
  },

  /* Preview */

  previewCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },

  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  previewSubtitle: {
    fontSize: 11,
    marginTop: 3,
  },

  previewPrices: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 13,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },

  previewPriceItem: {
    flex: 1,
    alignItems: 'center',
  },

  previewLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  previewLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginLeft: 4,
  },

  previewPrice: {
    fontSize: 17,
    fontWeight: '700',
  },

  previewDivider: {
    width: 1,
    height: 38,
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

export default EditProductRateScreen;
