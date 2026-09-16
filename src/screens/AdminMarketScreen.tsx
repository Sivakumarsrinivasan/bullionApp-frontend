import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ArrowLeft,
  CircleDollarSign,
  Clock3,
  Moon,
  RefreshCw,
  Sparkles,
  Sun,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import {RootStackParamList} from '../navigations/AppNavigator';
import {
  getLatestMarketRates,
  refreshMarketRate,
} from '../services/marketRate.service';
import {MarketRate} from '../types/marketRate';
import {useTheme} from '../theme/ThemeProvider';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AdminMarketRates'
>;

const AdminMarketRatesScreen = ({
  navigation,
}: Props) => {
  const {colors, mode, toggleTheme} = useTheme();

  const [rates, setRates] = useState<MarketRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getRates = async () => {
    try {
      const response = await getLatestMarketRates();

      console.log(
        'Latest market rates:',
        response,
      );

      setRates(response || []);
    } catch (error: any) {
      console.log(
        'Get market rates error:',
        error,
      );

      Toast.show({
        type: 'error',
        text1: 'Failed to load market rates',
        text2:
          error?.response?.data?.message ||
          'Something went wrong',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getRates();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      /*
       * Fetch fresh GOLD price from provider
       * and store it in the backend database.
       */
      await refreshMarketRate('XAU');

      /*
       * Fetch fresh SILVER price from provider
       * and store it in the backend database.
       */
      await refreshMarketRate('XAG');

      /*
       * Finally read the latest values from DB.
       */
      await getRates();

      Toast.show({
        type: 'success',
        text1: 'Market rates refreshed',
        text2: 'Latest Gold and Silver rates loaded.',
      });
    } catch (error: any) {
      console.log(
        'Refresh market rates error:',
        error?.response,
      );

      setRefreshing(false);

      Toast.show({
        type: 'error',
        text1: 'Failed to refresh rates',
        text2:
          error?.response?.data?.message ||
          'Unable to fetch latest market rates.',
      });
    }
  };

  const getRate = (
    metalType: string,
  ) => {
    return rates.find(
      rate =>
        rate.metal_type.toUpperCase() ===
        metalType,
    );
  };

  const goldRate = getRate('GOLD');
  const silverRate = getRate('SILVER');

  const formatPrice = (
    rate?: MarketRate,
  ) => {
    if (!rate) {
      return '--';
    }

    const numericPrice = Number(rate.price);

    if (Number.isNaN(numericPrice)) {
      return String(rate.price);
    }

    return numericPrice.toLocaleString(
      'en-IN',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    );
  };

  const formatRecordedAt = (
    recordedAt?: string,
  ) => {
    if (!recordedAt) {
      return 'Not available';
    }

    const date = new Date(recordedAt);

    if (Number.isNaN(date.getTime())) {
      return recordedAt;
    }

    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
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
          Loading market rates...
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
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
              Market Rates
            </Text>

            <Text
              style={[
                styles.headerSubtitle,
                {
                  color:
                    colors.textSecondary,
                },
              ]}>
              Latest Gold and Silver prices
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

        {/* ================= INFO CARD ================= */}

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor:
                colors.primary,
            },
          ]}>
          <View
            style={[
              styles.infoIcon,
              {
                backgroundColor:
                  colors.white + '20',
              },
            ]}>
            <RefreshCw
              size={27}
              color={colors.white}
            />
          </View>

          <View
            style={styles.infoContent}>
            <Text
              style={[
                styles.infoTitle,
                {
                  color: colors.white,
                },
              ]}>
              Live Market Rates
            </Text>

            <Text
              style={[
                styles.infoDescription,
                {
                  color:
                    colors.white + 'CC',
                },
              ]}>
              Refresh to fetch the latest
              prices from the market provider.
            </Text>
          </View>
        </View>

        {/* ================= REFRESH BUTTON ================= */}

        <TouchableOpacity
          style={[
            styles.refreshButton,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
          onPress={handleRefresh}
          disabled={refreshing}
          activeOpacity={0.8}>

          {refreshing ? (
            <ActivityIndicator
              size="small"
              color={colors.primary}
            />
          ) : (
            <RefreshCw
              size={20}
              color={colors.primary}
            />
          )}

          <Text
            style={[
              styles.refreshButtonText,
              {
                color: colors.primary,
              },
            ]}>
            {refreshing
              ? 'Refreshing Rates...'
              : 'Refresh Market Rates'}
          </Text>
        </TouchableOpacity>

        {/* ================= RATES ================= */}

        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
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
            Values currently stored in database
          </Text>
        </View>

        {/* ================= GOLD CARD ================= */}

        <View
          style={[
            styles.rateCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}>

          <View style={styles.rateHeader}>
            <View style={styles.rateTitleRow}>
              <View
                style={[
                  styles.metalIcon,
                  {
                    backgroundColor:
                      '#D4A01720',
                  },
                ]}>
                <CircleDollarSign
                  size={25}
                  color="#D4A017"
                />
              </View>

              <View style={styles.rateTitleContainer}>
                <Text
                  style={[
                    styles.rateTitle,
                    {
                      color: colors.text,
                    },
                  ]}>
                  Gold
                </Text>

                <Text
                  style={[
                    styles.rateSymbol,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}>
                  XAU
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.sourceBadge,
                {
                  backgroundColor:
                    colors.primary + '12',
                },
              ]}>
              <Text
                style={[
                  styles.sourceText,
                  {
                    color:
                      colors.primary,
                  },
                ]}>
                {goldRate?.source ||
                  'Market'}
              </Text>
            </View>
          </View>

          <View style={styles.priceSection}>
            <Text
              style={[
                styles.currency,
                {
                  color:
                    colors.textSecondary,
                },
              ]}>
              {goldRate?.currency || '--'}
            </Text>

            <Text
              style={[
                styles.price,
                {
                  color: colors.text,
                },
              ]}>
              {formatPrice(goldRate)}
            </Text>
          </View>

          <View
            style={[
              styles.rateFooter,
              {
                borderTopColor:
                  colors.border,
              },
            ]}>

            <View style={styles.footerItem}>
              <Text
                style={[
                  styles.footerLabel,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}>
                Unit
              </Text>

              <Text
                style={[
                  styles.footerValue,
                  {
                    color: colors.text,
                  },
                ]}>
                {goldRate?.unit ||
                  '--'}
              </Text>
            </View>

            <View style={styles.footerItem}>
              <View style={styles.timeRow}>
                <Clock3
                  size={13}
                  color={
                    colors.textSecondary
                  }
                />

                <Text
                  style={[
                    styles.footerLabel,
                    {
                      color:
                        colors.textSecondary,
                      marginLeft: 4,
                    },
                  ]}>
                  Updated
                </Text>
              </View>

              <Text
                style={[
                  styles.footerValue,
                  {
                    color: colors.text,
                  },
                ]}>
                {formatRecordedAt(
                  goldRate?.recorded_at,
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* ================= SILVER CARD ================= */}

        <View
          style={[
            styles.rateCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}>

          <View style={styles.rateHeader}>
            <View style={styles.rateTitleRow}>
              <View
                style={[
                  styles.metalIcon,
                  {
                    backgroundColor:
                      '#94A3B820',
                  },
                ]}>
                <Sparkles
                  size={25}
                  color="#94A3B8"
                />
              </View>

              <View style={styles.rateTitleContainer}>
                <Text
                  style={[
                    styles.rateTitle,
                    {
                      color: colors.text,
                    },
                  ]}>
                  Silver
                </Text>

                <Text
                  style={[
                    styles.rateSymbol,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}>
                  XAG
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.sourceBadge,
                {
                  backgroundColor:
                    colors.primary + '12',
                },
              ]}>
              <Text
                style={[
                  styles.sourceText,
                  {
                    color:
                      colors.primary,
                  },
                ]}>
                {silverRate?.source ||
                  'Market'}
              </Text>
            </View>
          </View>

          <View style={styles.priceSection}>
            <Text
              style={[
                styles.currency,
                {
                  color:
                    colors.textSecondary,
                },
              ]}>
              {silverRate?.currency ||
                '--'}
            </Text>

            <Text
              style={[
                styles.price,
                {
                  color: colors.text,
                },
              ]}>
              {formatPrice(silverRate)}
            </Text>
          </View>

          <View
            style={[
              styles.rateFooter,
              {
                borderTopColor:
                  colors.border,
              },
            ]}>

            <View style={styles.footerItem}>
              <Text
                style={[
                  styles.footerLabel,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}>
                Unit
              </Text>

              <Text
                style={[
                  styles.footerValue,
                  {
                    color: colors.text,
                  },
                ]}>
                {silverRate?.unit ||
                  '--'}
              </Text>
            </View>

            <View style={styles.footerItem}>
              <View style={styles.timeRow}>
                <Clock3
                  size={13}
                  color={
                    colors.textSecondary
                  }
                />

                <Text
                  style={[
                    styles.footerLabel,
                    {
                      color:
                        colors.textSecondary,
                      marginLeft: 4,
                    },
                  ]}>
                  Updated
                </Text>
              </View>

              <Text
                style={[
                  styles.footerValue,
                  {
                    color: colors.text,
                  },
                ]}>
                {formatRecordedAt(
                  silverRate?.recorded_at,
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* ================= NOTE ================= */}

        <View
          style={[
            styles.noteCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}>
          <Clock3
            size={17}
            color={
              colors.textSecondary
            }
          />

          <Text
            style={[
              styles.noteText,
              {
                color:
                  colors.textSecondary,
              },
            ]}>
            Rates shown here are the latest
            values stored by the backend.
          </Text>
        </View>

      </ScrollView>
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

  /* Info */

  infoCard: {
    minHeight: 125,
    borderRadius: 20,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  infoIcon: {
    width: 57,
    height: 57,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoContent: {
    flex: 1,
    marginLeft: spacing.md,
  },

  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  infoDescription: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.xs,
  },

  /* Refresh */

  refreshButton: {
    minHeight: 54,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },

  refreshButtonText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: spacing.sm,
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

  /* Rate Card */

  rateCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },

  rateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rateTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  metalIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rateTitleContainer: {
    marginLeft: spacing.md,
  },

  rateTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  rateSymbol: {
    fontSize: 11,
    marginTop: 2,
  },

  sourceBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
  },

  sourceText: {
    fontSize: 9,
    fontWeight: '700',
  },

  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },

  currency: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: spacing.sm,
  },

  price: {
    fontSize: 31,
    fontWeight: '700',
    letterSpacing: -0.5,
  },

  rateFooter: {
    borderTopWidth: 1,
    paddingTop: spacing.md,
    flexDirection: 'row',
  },

  footerItem: {
    flex: 1,
  },

  footerLabel: {
    fontSize: 10,
  },

  footerValue: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* Note */

  noteCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },

  noteText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
    marginLeft: spacing.sm,
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

export default AdminMarketRatesScreen;
