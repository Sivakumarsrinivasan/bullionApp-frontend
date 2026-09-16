import React, {useCallback, useEffect, useState} from 'react';
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
import {
  ArrowLeft,
  Clock3,
  History,
  Moon,
  RefreshCw,
  Sun,
  TrendingDown,
  TrendingUp,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import {RootStackParamList} from '../navigations/AppNavigator';
import {getProductRateHistory} from '../services/product.service';
import {useTheme} from '../theme/ThemeProvider';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ProductRateHistory'
>;

type RateHistory = {
  id: number;
  product_id: number;
  buy_price: string | number;
  sell_price: string | number;
  created_at?: string;
  updated_at?: string;
  recorded_at?: string;
};

type HistoryResponse = {
  rates?: RateHistory[];
  history?: RateHistory[];
  data?: RateHistory[];
  total?: number;
  totalPages?: number;
  page?: number;
  limit?: number;
};

const ProductRateHistoryScreen = ({
  navigation,
  route,
}: Props) => {
  const {colors, mode, toggleTheme} = useTheme();

  const {productId} = route.params;

  const [history, setHistory] = useState<
    RateHistory[]
  >([]);

  const [page, setPage] = useState(1);

  const limit = 20;

  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState(false);

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

  const formatDate = (value?: string) => {
    if (!value) {
      return 'Date not available';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getRecordedDate = (
    item: RateHistory,
  ) => {
    return (
      item.recorded_at ||
      item.created_at ||
      item.updated_at
    );
  };

  const fetchHistory = async (
  pageNumber: number,
  append: boolean = false,
) => {
  try {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    setError(false);

    const response = await getProductRateHistory(
      productId,
      pageNumber,
      limit,
    );

    console.log(
      'Product rate history response:',
      response,
    );

    const newHistory = response?.data?.rates || [];

    const pagination =
      response?.data?.pagination;

    if (!Array.isArray(newHistory)) {
      console.log(
        'History is not an array:',
        newHistory,
      );
      return;
    }

    if (append) {
      setHistory(current => [
        ...current,
        ...newHistory,
      ]);
    } else {
      setHistory(newHistory);
    }

    if (pagination) {
      setPage(pagination.page);

      setHasMore(
        pagination.page <
          pagination.totalPages,
      );
    } else {
      setHasMore(
        newHistory.length === limit,
      );
    }
  } catch (err: any) {
    console.log(
      'Product rate history error:',
      err,
    );

    setError(true);

    Toast.show({
      type: 'error',
      text1: 'Failed to load history',
      text2:
        err?.response?.data?.message ||
        'Something went wrong',
    });
  } finally {
    setLoading(false);
    setLoadingMore(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    fetchHistory(1);
  }, [productId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);

    await fetchHistory(1);
  };

  const handleLoadMore = () => {
    if (
      loading ||
      loadingMore ||
      !hasMore
    ) {
      return;
    }

    fetchHistory(page + 1, true);
  };

  const renderHistoryItem = ({
    item,
    index,
  }: {
    item: RateHistory;
    index: number;
  }) => {
    const buyPrice = Number(
      item.buy_price,
    );

    const sellPrice = Number(
      item.sell_price,
    );

    const difference =
      !Number.isNaN(buyPrice) &&
      !Number.isNaN(sellPrice)
        ? buyPrice - sellPrice
        : null;

    return (
      <View
        style={[
          styles.historyCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}>

        {/* Top Row */}
        <View style={styles.historyHeader}>
          <View style={styles.historyTitleRow}>
            <View
              style={[
                styles.historyIcon,
                {
                  backgroundColor:
                    colors.primary + '15',
                },
              ]}>
              <History
                size={19}
                color={colors.primary}
              />
            </View>

            <View style={styles.historyTitle}>
              <Text
                style={[
                  styles.historyNumber,
                  {
                    color: colors.text,
                  },
                ]}>
                Rate #{history.length - index}
              </Text>

              <View style={styles.dateRow}>
                <Clock3
                  size={12}
                  color={
                    colors.textSecondary
                  }
                />

                <Text
                  style={[
                    styles.dateText,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}>
                  {formatDate(
                    getRecordedDate(item),
                  )}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.historyBadge,
              {
                backgroundColor:
                  colors.primary + '12',
              },
            ]}>
            <Text
              style={[
                styles.historyBadgeText,
                {
                  color:
                    colors.primary,
                },
              ]}>
              #{item.id}
            </Text>
          </View>
        </View>

        {/* Prices */}
        <View
          style={[
            styles.priceContainer,
            {
              backgroundColor:
                colors.background,
            },
          ]}>

          {/* BUY */}
          <View style={styles.priceColumn}>
            <View style={styles.priceLabelRow}>
              <TrendingUp
                size={14}
                color={colors.success}
              />

              <Text
                style={[
                  styles.priceLabel,
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
                styles.priceValue,
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

          {/* SELL */}
          <View style={styles.priceColumn}>
            <View style={styles.priceLabelRow}>
              <TrendingDown
                size={14}
                color={colors.primary}
              />

              <Text
                style={[
                  styles.priceLabel,
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
                styles.priceValue,
                {
                  color: colors.primary,
                },
              ]}>
              ₹ {formatPrice(item.sell_price)}
            </Text>
          </View>
        </View>

        {/* Difference */}
        {difference !== null && (
          <View
            style={[
              styles.differenceContainer,
              {
                backgroundColor:
                  colors.success + '12',
              },
            ]}>
            <Text
              style={[
                styles.differenceLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}>
              Price difference
            </Text>

            <Text
              style={[
                styles.differenceValue,
                {
                  color:
                    colors.success,
                },
              ]}>
              ₹ {formatPrice(difference)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) {
      return null;
    }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator
          size="small"
          color={colors.primary}
        />

        <Text
          style={[
            styles.footerLoaderText,
            {
              color:
                colors.textSecondary,
            },
          ]}>
          Loading more...
        </Text>
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
          Loading rate history...
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
        data={history}
        keyExtractor={(item, index) =>
          `${item.id}-${index}`
        }
        renderItem={renderHistoryItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
        onEndReached={
          handleLoadMore
        }
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          renderFooter
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={
              handleRefresh
            }
            tintColor={
              colors.primary
            }
          />
        }
        ListHeaderComponent={
          <>
            {/* Header */}
            <View
              style={styles.header}>
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
                  color={
                    colors.text
                  }
                />
              </TouchableOpacity>

              <View
                style={
                  styles.headerText
                }>
                <Text
                  style={[
                    styles.headerTitle,
                    {
                      color:
                        colors.text,
                    },
                  ]}>
                  Rate History
                </Text>

                <Text
                  style={[
                    styles.headerSubtitle,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}>
                  Previous BUY and SELL rates
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
                onPress={
                  toggleTheme
                }
                activeOpacity={0.7}>
                {mode ===
                'dark' ? (
                  <Sun
                    size={20}
                    color={
                      colors.text
                    }
                  />
                ) : (
                  <Moon
                    size={20}
                    color={
                      colors.text
                    }
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
                      colors.white +
                      '20',
                  },
                ]}>
                <History
                  size={27}
                  color={
                    colors.white
                  }
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
                  Rate History
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
                  Track previous price
                  changes for this product.
                </Text>
              </View>
            </View>

            {/* Summary */}
            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}>
              <View
                style={
                  styles.summaryItem
                }>
                <Text
                  style={[
                    styles.summaryLabel,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}>
                  Records
                </Text>

                <Text
                  style={[
                    styles.summaryValue,
                    {
                      color:
                        colors.text,
                    },
                  ]}>
                  {history.length}
                </Text>
              </View>

              <View
                style={[
                  styles.summaryDivider,
                  {
                    backgroundColor:
                      colors.border,
                  },
                ]}
              />

              <View
                style={
                  styles.summaryItem
                }>
                <Text
                  style={[
                    styles.summaryLabel,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}>
                  Product ID
                </Text>

                <Text
                  style={[
                    styles.summaryValue,
                    {
                      color:
                        colors.text,
                    },
                  ]}>
                  #{productId}
                </Text>
              </View>

              <View
                style={[
                  styles.summaryDivider,
                  {
                    backgroundColor:
                      colors.border,
                  },
                ]}
              />

              <TouchableOpacity
                style={
                  styles.summaryRefresh
                }
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
                    size={17}
                    color={
                      colors.primary
                    }
                  />
                )}

                <Text
                  style={[
                    styles.summaryRefreshText,
                    {
                      color:
                        colors.primary,
                    },
                  ]}>
                  Refresh
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={
                styles.sectionHeader
              }>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}>
                Previous Rates
              </Text>

              <Text
                style={[
                  styles.sectionSubtitle,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}>
                Newest first
              </Text>
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
              <History
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
              No Rate History
            </Text>

            <Text
              style={[
                styles.emptyText,
                {
                  color:
                    colors.textSecondary,
                },
              ]}>
              No previous rate records are
              available for this product.
            </Text>
          </View>
        }
      />

      {error && history.length > 0 && (
        <View
          style={[
            styles.errorBanner,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}>
          <Text
            style={[
              styles.errorText,
              {
                color:
                  colors.text,
              },
            ]}>
            Unable to load more history.
          </Text>

          <TouchableOpacity
            onPress={() =>
              fetchHistory(
                page + 1,
                true,
              )
            }>
            <Text
              style={[
                styles.retryText,
                {
                  color:
                    colors.primary,
                },
              ]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}
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

  /* Summary */

  summaryCard: {
    minHeight: 72,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },

  summaryLabel: {
    fontSize: 10,
  },

  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 3,
  },

  summaryDivider: {
    width: 1,
    height: 34,
  },

  summaryRefresh: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryRefreshText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },

  /* Section */

  sectionHeader: {
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

  /* History */

  historyCard: {
    borderWidth: 1,
    borderRadius: 19,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  historyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  historyIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  historyTitle: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  historyNumber: {
    fontSize: 14,
    fontWeight: '700',
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },

  dateText: {
    fontSize: 10,
    marginLeft: 4,
  },

  historyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 15,
    marginLeft: spacing.sm,
  },

  historyBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },

  /* Price */

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 13,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },

  priceColumn: {
    flex: 1,
    alignItems: 'center',
  },

  priceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  priceLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginLeft: 4,
  },

  priceValue: {
    fontSize: 16,
    fontWeight: '700',
  },

  priceDivider: {
    width: 1,
    height: 35,
  },

  differenceContainer: {
    marginTop: spacing.sm,
    borderRadius: 9,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  differenceLabel: {
    fontSize: 10,
  },

  differenceValue: {
    fontSize: 11,
    fontWeight: '700',
  },

  /* Loading more */

  footerLoader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },

  footerLoaderText: {
    fontSize: 11,
    marginTop: spacing.xs,
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

  /* Error */

  errorBanner: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  errorText: {
    fontSize: 11,
  },

  retryText: {
    fontSize: 11,
    fontWeight: '700',
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

export default ProductRateHistoryScreen;
