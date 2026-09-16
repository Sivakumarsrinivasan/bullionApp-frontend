
import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {
  ArrowLeft,
  ChevronRight,
  Edit3,
  History,
  Moon,
  Plus,
  RefreshCw,
  Sun,
  TrendingUp,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import {RootStackParamList} from '../navigations/AppNavigator';
import {useTheme} from '../theme/ThemeProvider';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

import {
  getCurrentProductRates,
} from '../services/product.service';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AdminProductRates'
>;

type ProductRate = {
  id: number;
  product_id: number;
  product_name?: string;
  name?: string;
  metal_type?: string;
  purity?: string | number;
  unit?: string;
  buy_price: string | number;
  sell_price: string | number;
  created_at?: string;
  updated_at?: string;
};

const AdminProductRatesScreen = ({
  navigation,
}: Props) => {
  const {colors, mode, toggleTheme} = useTheme();

  const [rates, setRates] = useState<ProductRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRates = async () => {
    try {
      const response =
        await getCurrentProductRates();

      console.log(
        'Current product rates:',
        response,
      );

      setRates(response || []);
    } catch (error: any) {
      console.log(
        'Get product rates error:',
        error,
      );

      Toast.show({
        type: 'error',
        text1: 'Failed to load product rates',
        text2:
          error?.response?.data?.message ||
          'Something went wrong',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRates();
    }, []),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRates();
  };

  const formatPrice = (
    value: string | number,
  ) => {
    const price = Number(value);

    if (Number.isNaN(price)) {
      return String(value);
    }

    return price.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const renderRate = ({
    item,
  }: {
    item: ProductRate;
  }) => {
    const productName =
      item.product_name ||
      item.name ||
      'Product';

    const metalType =
      item.metal_type || '';

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}>

        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.productInfo}>
            <View
              style={[
                styles.productIcon,
                {
                  backgroundColor:
                    colors.primary + '15',
                },
              ]}>
              <TrendingUp
                size={22}
                color={colors.primary}
              />
            </View>

            <View style={styles.productTitle}>
              <Text
                style={[
                  styles.productName,
                  {
                    color: colors.text,
                  },
                ]}
                numberOfLines={1}>
                {productName}
              </Text>

              <Text
                style={[
                  styles.productMeta,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}>
                {metalType}
                {item.purity
                  ? ` • ${item.purity}`
                  : ''}
                {item.unit
                  ? ` • ${item.unit}`
                  : ''}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.rateBadge,
              {
                backgroundColor:
                  colors.success + '15',
              },
            ]}>
            <Text
              style={[
                styles.rateBadgeText,
                {
                  color:
                    colors.success,
                },
              ]}>
              CURRENT
            </Text>
          </View>
        </View>

        {/* Buy / Sell */}
        <View
          style={[
            styles.priceContainer,
            {
              backgroundColor:
                colors.background,
            },
          ]}>

          <View style={styles.priceColumn}>
            <Text
              style={[
                styles.priceLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}>
              BUY PRICE
            </Text>

            <Text
              style={[
                styles.buyPrice,
                {
                  color: colors.text,
                },
              ]}>
              ₹ {formatPrice(item.buy_price)}
            </Text>
          </View>

          <View
            style={[
              styles.priceDivider,
              {
                backgroundColor:
                  colors.border,
              },
            ]}
          />

          <View style={styles.priceColumn}>
            <Text
              style={[
                styles.priceLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}>
              SELL PRICE
            </Text>

            <Text
              style={[
                styles.sellPrice,
                {
                  color: colors.primary,
                },
              ]}>
              ₹ {formatPrice(item.sell_price)}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                backgroundColor:
                  colors.background,
                borderColor:
                  colors.border,
              },
            ]}
            onPress={() =>
              navigation.navigate(
                'EditProductRate',
                {
                  rateId: item.id,
                },
              )
            }
            activeOpacity={0.8}>
            <Edit3
              size={16}
              color={colors.primary}
            />

            <Text
              style={[
                styles.secondaryButtonText,
                {
                  color:
                    colors.primary,
                },
              ]}>
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                backgroundColor:
                  colors.background,
                borderColor:
                  colors.border,
              },
            ]}
            onPress={() =>
              navigation.navigate(
                'ProductRateHistory',
                {
                  productId:
                    item.product_id,
                },
              )
            }
            activeOpacity={0.8}>
            <History
              size={16}
              color={colors.text}
            />

            <Text
              style={[
                styles.secondaryButtonText,
                {
                  color: colors.text,
                },
              ]}>
              History
            </Text>

            <ChevronRight
              size={15}
              color={
                colors.textSecondary
              }
            />
          </TouchableOpacity>
        </View>
      </View>
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
          Loading product rates...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}>

      <FlatList
        data={rates}
        keyExtractor={item =>
          item.id.toString()
        }
        renderItem={renderRate}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <>
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
                }
                activeOpacity={0.7}>
                <ArrowLeft
                  size={21}
                  color={colors.text}
                />
              </TouchableOpacity>

              <View
                style={styles.headerText}>
                <Text
                  style={[
                    styles.headerTitle,
                    {
                      color:
                        colors.text,
                    },
                  ]}>
                  Product Rates
                </Text>

                <Text
                  style={[
                    styles.headerSubtitle,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}>
                  Manage BUY and SELL prices
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

            {/* Overview */}
            <View
              style={[
                styles.overviewCard,
                {
                  backgroundColor:
                    colors.primary,
                },
              ]}>
              <View
                style={[
                  styles.overviewIcon,
                  {
                    backgroundColor:
                      colors.white + '20',
                  },
                ]}>
                <TrendingUp
                  size={27}
                  color={colors.white}
                />
              </View>

              <View
                style={
                  styles.overviewContent
                }>
                <Text
                  style={[
                    styles.overviewTitle,
                    {
                      color:
                        colors.white,
                    },
                  ]}>
                  Rate Management
                </Text>

                <Text
                  style={[
                    styles.overviewSubtitle,
                    {
                      color:
                        colors.white +
                        'CC',
                    },
                  ]}>
                  Manage current prices for
                  your bullion products.
                </Text>
              </View>
            </View>

            {/* Add Button */}
            <TouchableOpacity
              style={[
                styles.addButton,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
              onPress={() =>
                navigation.navigate(
                  'AddProductRate',
                )
              }
              activeOpacity={0.8}>

              <View
                style={[
                  styles.addIcon,
                  {
                    backgroundColor:
                      colors.primary,
                  },
                ]}>
                <Plus
                  size={20}
                  color={colors.white}
                />
              </View>

              <View
                style={
                  styles.addContent
                }>
                <Text
                  style={[
                    styles.addTitle,
                    {
                      color:
                        colors.text,
                    },
                  ]}>
                  Add Product Rate
                </Text>

                <Text
                  style={[
                    styles.addSubtitle,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}>
                  Set BUY and SELL prices
                </Text>
              </View>

              <ChevronRight
                size={20}
                color={
                  colors.textSecondary
                }
              />
            </TouchableOpacity>

            {/* Section */}
            <View
              style={
                styles.sectionHeader
              }>
              <View>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color:
                        colors.text,
                    },
                  ]}>
                  Current Rates
                </Text>

                <Text
                  style={[
                    styles.sectionSubtitle,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}>
                  {rates.length}{' '}
                  {rates.length === 1
                    ? 'rate'
                    : 'rates'}{' '}
                  configured
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.refreshIconButton,
                  {
                    backgroundColor:
                      colors.card,
                    borderColor:
                      colors.border,
                  },
                ]}
                onPress={
                  handleRefresh
                }
                disabled={
                  refreshing
                }>
                {refreshing ? (
                  <ActivityIndicator
                    size="small"
                    color={
                      colors.primary
                    }
                  />
                ) : (
                  <RefreshCw
                    size={18}
                    color={
                      colors.primary
                    }
                  />
                )}
              </TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}>
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor:
                    colors.primary +
                    '15',
                },
              ]}>
              <TrendingUp
                size={30}
                color={
                  colors.primary
                }
              />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                {
                  color:
                    colors.text,
                },
              ]}>
              No Product Rates
            </Text>

            <Text
              style={[
                styles.emptyText,
                {
                  color:
                    colors.textSecondary,
                },
              ]}>
              Add a product rate to start
              managing BUY and SELL prices.
            </Text>

            <TouchableOpacity
              style={[
                styles.emptyButton,
                {
                  backgroundColor:
                    colors.primary,
                },
              ]}
              onPress={() =>
                navigation.navigate(
                  'AddProductRate',
                )
              }>
              <Plus
                size={18}
                color={colors.white}
              />

              <Text
                style={[
                  styles.emptyButtonText,
                  {
                    color:
                      colors.white,
                  },
                ]}>
                Add Product Rate
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
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

  /* Overview */

  overviewCard: {
    minHeight: 125,
    borderRadius: 20,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  overviewIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  overviewContent: {
    flex: 1,
    marginLeft: spacing.md,
  },

  overviewTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  overviewSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.xs,
  },

  /* Add */

  addButton: {
    minHeight: 76,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  addIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addContent: {
    flex: 1,
    marginLeft: spacing.md,
  },

  addTitle: {
    fontSize: 15,
    fontWeight: '700',
  },

  addSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },

  /* Section */

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  sectionSubtitle: {
    fontSize: 11,
    marginTop: 3,
  },

  refreshIconButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Rate Card */

  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  productInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  productTitle: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  productName: {
    fontSize: 16,
    fontWeight: '700',
  },

  productMeta: {
    fontSize: 11,
    marginTop: 3,
  },

  rateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: spacing.sm,
  },

  rateBadgeText: {
    fontSize: 8,
    fontWeight: '700',
  },

  /* Price */

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },

  priceColumn: {
    flex: 1,
    alignItems: 'center',
  },

  priceLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginBottom: 4,
  },

  buyPrice: {
    fontSize: 18,
    fontWeight: '700',
  },

  sellPrice: {
    fontSize: 18,
    fontWeight: '700',
  },

  priceDivider: {
    width: 1,
    height: 38,
  },

  /* Actions */

  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  secondaryButton: {
    flex: 1,
    minHeight: 40,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },

  secondaryButtonText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
    marginRight: 3,
  },

  /* Empty */

  emptyCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
  },

  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 11,
    marginTop: spacing.lg,
  },

  emptyButtonText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: spacing.xs,
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

export default AdminProductRatesScreen;
