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
  ChevronDown,
  CircleDollarSign,
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
  getProducts,
} from '../services/product.service';
import {
  createProductRate,
} from '../services/product.service';
import {useTheme} from '../theme/ThemeProvider';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AddProductRate'
>;

type Product = {
  id: number;
  name: string;
  metal_type: 'GOLD' | 'SILVER';
  purity: string | number;
  unit: 'GRAM' | 'KILOGRAM';
  is_active: boolean;
};

const AddProductRateScreen = ({
  navigation,
}: Props) => {
  const {colors, mode, toggleTheme} = useTheme();

  const [products, setProducts] = useState<Product[]>(
    [],
  );

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [saving, setSaving] = useState(false);

  const [showProductList, setShowProductList] =
    useState(false);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);

      const response = await getProducts();

      console.log(
        'Products for rate:',
        response,
      );

      setProducts(response?.products || []);
    } catch (error: any) {
      console.log(
        'Get products for rate error:',
        error,
      );

      Toast.show({
        type: 'error',
        text1: 'Failed to load products',
        text2:
          error?.response?.data?.message ||
          'Something went wrong',
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSelectProduct = (
    product: Product,
  ) => {
    setSelectedProduct(product);
    setShowProductList(false);
  };

  const handleSubmit = async () => {
    if (!selectedProduct) {
      Toast.show({
        type: 'error',
        text1: 'Select a product',
        text2:
          'Please select a product before saving.',
      });
      return;
    }

    const buy = Number(buyPrice.trim());
    const sell = Number(sellPrice.trim());

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

      const response = await createProductRate({
        product_id: selectedProduct.id,
        buy_price: buy,
        sell_price: sell,
      });

      console.log(
        'Create product rate response:',
        response,
      );

      Toast.show({
        type: 'success',
        text1:
          response?.message ||
          'Product rate created successfully',
      });

      navigation.goBack();
    } catch (error: any) {
      console.log(
        'Create product rate error:',
        error,
      );

      Toast.show({
        type: 'error',
        text1: 'Failed to create product rate',
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

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      return '0.00';
    }

    return numberValue.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

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
              Add Product Rate
            </Text>

            <Text
              style={[
                styles.headerSubtitle,
                {
                  color:
                    colors.textSecondary,
                },
              ]}>
              Set BUY and SELL prices
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
            <TrendingUp
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
              Create New Rate
            </Text>

            <Text
              style={[
                styles.heroDescription,
                {
                  color:
                    colors.white + 'CC',
                },
              ]}>
              Select a product and configure
              its current BUY and SELL prices.
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
            Enter the pricing information below.
          </Text>

          {/* Product */}

          <View style={styles.field}>
            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                },
              ]}>
              Product
            </Text>

            <TouchableOpacity
              style={[
                styles.productSelector,
                {
                  backgroundColor:
                    colors.background,
                  borderColor:
                    showProductList
                      ? colors.primary
                      : colors.border,
                },
              ]}
              onPress={() =>
                setShowProductList(
                  current => !current,
                )
              }
              activeOpacity={0.8}>

              {selectedProduct ? (
                <>
                  <View
                    style={[
                      styles.selectedProductIcon,
                      {
                        backgroundColor:
                          colors.primary +
                          '15',
                      },
                    ]}>
                    <Package
                      size={21}
                      color={
                        colors.primary
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.selectedProductText
                    }>
                    <Text
                      style={[
                        styles.selectedProductName,
                        {
                          color:
                            colors.text,
                        },
                      ]}>
                      {selectedProduct.name}
                    </Text>

                    <Text
                      style={[
                        styles.selectedProductMeta,
                        {
                          color:
                            colors.textSecondary,
                        },
                      ]}>
                      {selectedProduct.metal_type}
                      {' • '}
                      {selectedProduct.purity}
                      {' • '}
                      {selectedProduct.unit}
                    </Text>
                  </View>
                </>
              ) : (
                <Text
                  style={[
                    styles.placeholder,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}>
                  Select a product
                </Text>
              )}

              <ChevronDown
                size={20}
                color={
                  colors.textSecondary
                }
              />
            </TouchableOpacity>

            {/* Product List */}

            {showProductList && (
              <View
                style={[
                  styles.productList,
                  {
                    backgroundColor:
                      colors.card,
                    borderColor:
                      colors.border,
                  },
                ]}>

                {loadingProducts ? (
                  <View
                    style={
                      styles.productLoading
                    }>
                    <ActivityIndicator
                      size="small"
                      color={
                        colors.primary
                      }
                    />

                    <Text
                      style={[
                        styles.productLoadingText,
                        {
                          color:
                            colors.textSecondary,
                        },
                      ]}>
                      Loading products...
                    </Text>
                  </View>
                ) : products.length === 0 ? (
                  <View
                    style={
                      styles.noProducts
                    }>
                    <Text
                      style={[
                        styles.noProductsText,
                        {
                          color:
                            colors.textSecondary,
                        },
                      ]}>
                      No products available.
                    </Text>
                  </View>
                ) : (
                  products.map(product => {
                    const selected =
                      selectedProduct?.id ===
                      product.id;

                    return (
                      <TouchableOpacity
                        key={product.id}
                        style={[
                          styles.productOption,
                          {
                            backgroundColor:
                              selected
                                ? colors.primary +
                                  '10'
                                : colors.card,
                          },
                        ]}
                        onPress={() =>
                          handleSelectProduct(
                            product,
                          )
                        }
                        activeOpacity={0.8}>

                        <View
                          style={[
                            styles.productOptionIcon,
                            {
                              backgroundColor:
                                selected
                                  ? colors.primary
                                  : colors.background,
                            },
                          ]}>
                          <CircleDollarSign
                            size={18}
                            color={
                              selected
                                ? colors.white
                                : colors.textSecondary
                            }
                          />
                        </View>

                        <View
                          style={
                            styles.productOptionContent
                          }>
                          <Text
                            style={[
                              styles.productOptionName,
                              {
                                color:
                                  colors.text,
                              },
                            ]}>
                            {product.name}
                          </Text>

                          <Text
                            style={[
                              styles.productOptionMeta,
                              {
                                color:
                                  colors.textSecondary,
                              },
                            ]}>
                            {product.metal_type}
                            {' • '}
                            {product.purity}
                            {' • '}
                            {product.unit}
                          </Text>
                        </View>

                        {selected && (
                          <Check
                            size={18}
                            color={
                              colors.primary
                            }
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
            )}
          </View>

          {/* BUY PRICE */}

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
                placeholder="0.00"
                placeholderTextColor={
                  colors.textSecondary
                }
                value={buyPrice}
                onChangeText={
                  setBuyPrice
                }
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* SELL PRICE */}

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
                placeholder="0.00"
                placeholderTextColor={
                  colors.textSecondary
                }
                value={sellPrice}
                onChangeText={
                  setSellPrice
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
          <Text
            style={[
              styles.previewTitle,
              {
                color: colors.text,
              },
            ]}>
            Rate Preview
          </Text>

          <View
            style={styles.previewProduct}>
            <View
              style={[
                styles.previewIcon,
                {
                  backgroundColor:
                    colors.primary +
                    '15',
                },
              ]}>
              <CircleDollarSign
                size={23}
                color={
                  colors.primary
                }
              />
            </View>

            <View
              style={
                styles.previewProductInfo
              }>
              <Text
                style={[
                  styles.previewName,
                  {
                    color:
                      colors.text,
                  },
                ]}>
                {selectedProduct?.name ||
                  'Select Product'}
              </Text>

              <Text
                style={[
                  styles.previewMeta,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}>
                {selectedProduct
                  ? `${selectedProduct.metal_type} • ${selectedProduct.purity} • ${selectedProduct.unit}`
                  : 'Product details'}
              </Text>
            </View>
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
            styles.saveButton,
            {
              backgroundColor:
                colors.primary,
              opacity: saving ? 0.7 : 1,
            },
          ]}
          onPress={handleSubmit}
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
                  styles.saveButtonText,
                  {
                    color:
                      colors.white,
                  },
                ]}>
                Saving Rate...
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
                  styles.saveButtonText,
                  {
                    color:
                      colors.white,
                  },
                ]}>
                Create Product Rate
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
          BUY price must be greater than or
          equal to SELL price.
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

  /* Product selector */

  productSelector: {
    minHeight: 60,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },

  selectedProductIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedProductText: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  selectedProductName: {
    fontSize: 14,
    fontWeight: '700',
  },

  selectedProductMeta: {
    fontSize: 10,
    marginTop: 3,
  },

  placeholder: {
    flex: 1,
    fontSize: 14,
    marginLeft: spacing.xs,
  },

  productList: {
    borderWidth: 1,
    borderRadius: 14,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },

  productOption: {
    minHeight: 63,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },

  productOptionIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  productOptionContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  productOptionName: {
    fontSize: 13,
    fontWeight: '700',
  },

  productOptionMeta: {
    fontSize: 10,
    marginTop: 2,
  },

  productLoading: {
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  productLoadingText: {
    fontSize: 11,
    marginLeft: spacing.sm,
  },

  noProducts: {
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  noProductsText: {
    fontSize: 12,
  },

  /* Price inputs */

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

  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  previewProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },

  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  previewProductInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  previewName: {
    fontSize: 14,
    fontWeight: '700',
  },

  previewMeta: {
    fontSize: 10,
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

  previewLabel: {
    fontSize: 9,
    fontWeight: '600',
  },

  previewPrice: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },

  previewDivider: {
    width: 1,
    height: 35,
  },

  /* Save */

  saveButton: {
    minHeight: 55,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },

  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },

  footerText: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 17,
    marginTop: spacing.md,
  },
});

export default AddProductRateScreen;
