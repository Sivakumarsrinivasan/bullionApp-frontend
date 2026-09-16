import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {RootStackParamList} from '../navigations/AppNavigator';
import {useTheme} from '../theme/ThemeProvider';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

import {getCurrentProductRates} from '../services/product.service';
import {getLatestMarketRates} from '../services/marketRate.service';

import {ProductRate} from '../types/product';
import {MarketRate} from '../types/marketRate';

import {logout, logoutAll} from '../services/authService';
import {clearTokens, getTokens} from '../services/tokenStorage';

import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;

const HomeScreen = ({navigation}: Props) => {
  const {
    colors,
    mode,
    toggleTheme,
  } = useTheme();

  const styles = createStyles(colors);

  // =========================
  // Product Rate State
  // =========================

  const [rates, setRates] = useState<ProductRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // =========================
  // Market Rate State
  // =========================

  const [marketRates, setMarketRates] = useState<MarketRate[]>([]);
  const [marketLoading, setMarketLoading] = useState(true);
  const [marketError, setMarketError] = useState('');

  // =========================
  // Fetch Product Rates
  // =========================

  const loadRates = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const result = await getCurrentProductRates();

      console.log(
        'CURRENT PRODUCT RATES:',
        result,
      );

      setRates(result);
    } catch (error: any) {
      console.log(
        'RATE API ERROR:',
        error?.response?.data || error?.message,
      );

      setErrorMessage(
        error?.response?.data?.message ||
          'Unable to load product rates',
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Fetch Market Rates
  // =========================

  const loadMarketRates = async () => {
    try {
      setMarketLoading(true);
      setMarketError('');

      const result =
        await getLatestMarketRates();

      console.log(
        'LATEST MARKET RATES:',
        result,
      );

      setMarketRates(result);
    } catch (error: any) {
      console.log(
        'MARKET RATE API ERROR:',
        error?.response?.data ||
          error?.message,
      );

      setMarketError(
        error?.response?.data?.message ||
          'Unable to load market rates',
      );
    } finally {
      setMarketLoading(false);
    }
  };

  // =========================
  // Initial Load
  // =========================

  useEffect(() => {
    loadRates();
    loadMarketRates();
  }, []);

  // =========================
  // Separate Gold / Silver
  // =========================

  const goldRates = rates.filter(
    rate =>
      rate.metal_type?.toUpperCase() ===
      'GOLD',
  );

  const silverRates = rates.filter(
    rate =>
      rate.metal_type?.toUpperCase() ===
      'SILVER',
  );

  // =========================
  // Format Price
  // =========================

  const formatPrice = (
    price: number | string | undefined,
  ) => {
    if (
      price === undefined ||
      price === null ||
      price === ''
    ) {
      return '--';
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      return '--';
    }

    return numericPrice.toLocaleString(
      'en-IN',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    );
  };

  // =========================
  // Format Unit
  // =========================

  const formatUnit = (
    unit: string | undefined,
  ) => {
    if (!unit) {
      return '--';
    }

    return unit.toLowerCase();
  };

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log(
                'LOGOUT STARTED',
              );

              const tokens =
                await getTokens();

              if (!tokens?.refreshToken) {
                throw new Error(
                  'Refresh token not found',
                );
              }

              const response =
                await logout(
                  tokens.refreshToken,
                );

              console.log(
                'LOGOUT RESPONSE:',
                response,
              );

              await clearTokens();

              Toast.show({
                type: 'success',
                text1: 'Logout Successful',
                text2:
                  response?.message ||
                  'You have been logged out successfully',
              });

              navigation.replace('Login');
            } catch (error: any) {
              Toast.show({
                type: 'error',
                text1: 'Logout',
                text2:
                  error?.response?.data
                    ?.message ||
                  'Logged out successfully',
              });

              console.log(
                'LOGOUT ERROR:',
                error?.response?.data ||
                  error?.message,
              );

              await clearTokens();

              navigation.replace('Login');
            }
          },
        },
      ],
    );
  };

  // =========================
  // Logout All Devices
  // =========================

  const handleLogoutAll = () => {
    Alert.alert(
      'Logout from all devices',
      'This will sign you out from all devices where your account is currently logged in.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout All',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log(
                'LOGOUT ALL STARTED',
              );

              const response =
                await logoutAll();

              Toast.show({
                type: 'success',
                text1: 'Logout Successful',
                text2: `${response?.message?.message} (${response?.message?.count} device${
                  response?.message?.count === 1
                    ? ''
                    : 's'
                } logged out)`,
              });

              console.log(
                'LOGOUT ALL RESPONSE:',
                response,
              );

              await clearTokens();

              navigation.replace('Login');
            } catch (error: any) {
              Toast.show({
                type: 'error',
                text1: 'Logout All',
                text2:
                  error?.response?.data
                    ?.message?.message ||
                  'Failed to logout from all devices',
              });

              console.log(
                'LOGOUT ALL ERROR:',
                error?.response?.data ||
                  error?.message,
              );

              await clearTokens();

              navigation.replace('Login');
            }
          },
        },
      ],
    );
  };

  // =========================
  // Market Card
  // =========================

  const renderMarketRate = (
    rate: MarketRate,
  ) => {
    const isGold =
      rate.metal_type?.toUpperCase() ===
      'GOLD';

    return (
      <View
        key={rate.id}
        style={styles.marketItem}>

        <View style={styles.marketItemTop}>
          <View
            style={[
              styles.marketSymbol,
              {
                backgroundColor:
                  isGold
                    ? 'rgba(255,255,255,0.18)'
                    : 'rgba(255,255,255,0.10)',
              },
            ]}>
            <Text
              style={styles.marketSymbolText}>
              {isGold ? 'Au' : 'Ag'}
            </Text>
          </View>

          <View
            style={styles.marketNameContainer}>
            <Text
              style={styles.marketName}>
              {isGold
                ? 'Gold'
                : 'Silver'}
            </Text>

            <Text
              style={styles.marketUnit}>
              Per gram
            </Text>
          </View>
        </View>

        <Text
          style={styles.marketPrice}>
          ₹ {formatPrice(rate.price)}
        </Text>

        <Text
          style={styles.marketSource}>
          {rate.source}
        </Text>
      </View>
    );
  };

  // =========================
  // Product Card
  // =========================

  const renderProductCard = (
    rate: ProductRate,
    isGold: boolean,
  ) => {
    return (
      <TouchableOpacity
        key={rate.id}
        activeOpacity={0.88}
        style={styles.productCard}
        onPress={() =>
          navigation.navigate(
            'ProductDetails',
            {
              productId:
                Number(rate.product_id),
            },
          )
        }>

        {/* Product Header */}

        <View style={styles.productHeader}>
          <View
            style={[
              styles.productIcon,
              {
                backgroundColor:
                  isGold
                    ? colors.primaryLight
                    : colors.surface,
              },
            ]}>
            <Text
              style={styles.productIconText}>
              {isGold ? 'Au' : 'Ag'}
            </Text>
          </View>

          <View
            style={styles.productInformation}>
            <Text
              numberOfLines={1}
              style={styles.productName}>
              {rate.name}
            </Text>

            <Text
              style={styles.productDescription}>
              {rate.purity}
              {' • '}
              Per {formatUnit(rate.unit)}
            </Text>
          </View>

          <View style={styles.arrowCircle}>
            <Text
              style={styles.arrowText}>
              →
            </Text>
          </View>
        </View>

        {/* Main Price */}

        <View style={styles.mainPriceSection}>
          <View>
            <Text
              style={styles.mainPriceLabel}>
              SELL PRICE
            </Text>

            <View
              style={styles.priceRow}>
              <Text
                style={styles.mainPrice}>
                ₹ {formatPrice(rate.sell_price)}
              </Text>

              <Text
                style={styles.priceUnit}>
                / {formatUnit(rate.unit)}
              </Text>
            </View>
          </View>

          <View
            style={styles.liveSmallBadge}>
            <View
              style={styles.smallLiveDot}
            />

            <Text
              style={styles.liveSmallText}>
              LIVE
            </Text>
          </View>
        </View>

        {/* Buy / Sell */}

        <View style={styles.buySellSection}>

          <View style={styles.buySellColumn}>
            <Text style={styles.priceLabel}>
              BUY
            </Text>

            <Text style={styles.buyPrice}>
              ₹ {formatPrice(rate.buy_price)}
            </Text>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.buySellColumn}>
            <Text style={styles.priceLabel}>
              SELL
            </Text>

            <Text style={styles.sellPrice}>
              ₹ {formatPrice(rate.sell_price)}
            </Text>
          </View>

        </View>
      </TouchableOpacity>
    );
  };

  // =========================
  // UI
  // =========================

  return (
    <View
      style={styles.container}>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={false}>

        {/* =========================
            HEADER
        ========================= */}

        <View style={styles.header}>

          <View>
            <Text
              style={styles.greeting}>
              Welcome back
            </Text>

            <View
              style={styles.nameRow}>
              <Text
                style={styles.userName}>
                Sivakumar
              </Text>

              <Text
                style={styles.wave}>
                👋
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.themeButton}
            onPress={toggleTheme}>

            <Text
              style={styles.themeIcon}>
              {mode === 'light'
                ? '☾'
                : '☀'}
            </Text>
          </TouchableOpacity>

        </View>


        {/* =========================
            MARKET SNAPSHOT
        ========================= */}

        <View
          style={styles.heroCard}>

          <View
            style={styles.heroHeader}>

            <View>
              <Text
                style={styles.heroLabel}>
                MARKET SNAPSHOT
              </Text>

              <Text
                style={styles.heroTitle}>
                Precious Metals
              </Text>
            </View>

            <View
              style={styles.liveBadge}>

              <View
                style={styles.heroLiveDot}
              />

              <Text
                style={styles.heroLiveText}>
                LIVE
              </Text>

            </View>

          </View>

          {marketLoading ? (
            <View
              style={
                styles.marketLoading
              }>
              <ActivityIndicator
                size="small"
                color={colors.white}
              />

              <Text
                style={
                  styles.marketLoadingText
                }>
                Loading market rates...
              </Text>
            </View>
          ) : marketError ? (
            <View
              style={styles.marketError}>
              <Text
                style={
                  styles.marketErrorText
                }>
                {marketError}
              </Text>
            </View>
          ) : (
            <View
              style={styles.marketRow}>
              {marketRates.map(
                renderMarketRate,
              )}
            </View>
          )}

          <View
            style={styles.heroFooter}>

            <Text
              style={
                styles.heroFooterText
              }>
              Live market reference
            </Text>

            {!marketLoading &&
              !marketError && (
                <Text
                  style={
                    styles.heroUpdatedText
                  }>
                  Updated just now
                </Text>
              )}

          </View>

        </View>


        {/* =========================
            QUICK TRADE
        ========================= */}

        <View
          style={styles.sectionHeader}>

          <View>
            <Text
              style={styles.sectionTitle}>
              Quick Trade
            </Text>

            <Text
              style={
                styles.sectionSubtitle
              }>
              Buy or sell precious metals
            </Text>
          </View>

        </View>

        <View
          style={styles.tradeRow}>

          <TouchableOpacity
            activeOpacity={0.85}
            style={
              styles.tradeCardPrimary
            }
            onPress={() => {
              // Connect Buy screen here
            }}>

            <View
              style={
                styles.tradeIcon
              }>
              <Text
                style={
                  styles.tradeIconText
                }>
                ↑
              </Text>
            </View>

            <Text
              style={
                styles.tradeTitle
              }>
              Buy
            </Text>

            <Text
              style={
                styles.tradeSubtitle
              }>
              Purchase gold or silver
            </Text>

            <Text
              style={
                styles.tradeArrow
              }>
              →
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            activeOpacity={0.85}
            style={
              styles.tradeCard
            }
            onPress={() => {
              // Connect Sell screen here
            }}>

            <View
              style={
                styles.tradeIcon
              }>
              <Text
                style={
                  styles.tradeIconText
                }>
                ↓
              </Text>
            </View>

            <Text
              style={
                styles.tradeTitle
              }>
              Sell
            </Text>

            <Text
              style={
                styles.tradeSubtitle
              }>
              Sell your metal
            </Text>

            <Text
              style={
                styles.tradeArrow
              }>
              →
            </Text>

          </TouchableOpacity>

        </View>


        {/* =========================
            PRODUCT RATES
        ========================= */}

        <View
          style={styles.sectionHeader}>

          <View>
            <Text
              style={styles.sectionTitle}>
              Live Product Rates
            </Text>

            <Text
              style={
                styles.sectionSubtitle
              }>
              Current market pricing
            </Text>
          </View>

          <View
            style={styles.countBadge}>
            <Text
              style={styles.countText}>
              {rates.length}
            </Text>
          </View>

        </View>


        {/* Loading */}

        {loading && (
          <View
            style={
              styles.loadingContainer
            }>
            <ActivityIndicator
              size="small"
              color={colors.primary}
            />

            <Text
              style={
                styles.loadingText
              }>
              Loading product rates...
            </Text>
          </View>
        )}


        {/* Error */}

        {!loading &&
          errorMessage !== '' && (
            <View
              style={
                styles.errorContainer
              }>
              <Text
                style={
                  styles.errorTitle
                }>
                Unable to load rates
              </Text>

              <Text
                style={
                  styles.errorText
                }>
                {errorMessage}
              </Text>
            </View>
          )}


        {/* Gold */}

        {!loading &&
          goldRates.length > 0 && (
            <View
              style={
                styles.metalSection
              }>

              <View
                style={
                  styles.metalHeader
                }>

                <View
                  style={
                    styles.metalTitleRow
                  }>
                  <View
                    style={
                      styles.goldIndicator
                    }
                  />

                  <Text
                    style={
                      styles.metalTitle
                    }>
                    Gold
                  </Text>
                </View>

                <Text
                  style={
                    styles.rateCount
                  }>
                  {goldRates.length}{' '}
                  rates
                </Text>

              </View>

              {goldRates.map(
                rate =>
                  renderProductCard(
                    rate,
                    true,
                  ),
              )}

            </View>
          )}


        {/* Silver */}

        {!loading &&
          silverRates.length > 0 && (
            <View
              style={
                styles.metalSection
              }>

              <View
                style={
                  styles.metalHeader
                }>

                <View
                  style={
                    styles.metalTitleRow
                  }>
                  <View
                    style={
                      styles.silverIndicator
                    }
                  />

                  <Text
                    style={
                      styles.metalTitle
                    }>
                    Silver
                  </Text>
                </View>

                <Text
                  style={
                    styles.rateCount
                  }>
                  {silverRates.length}{' '}
                  rates
                </Text>

              </View>

              {silverRates.map(
                rate =>
                  renderProductCard(
                    rate,
                    false,
                  ),
              )}

            </View>
          )}


        {/* No Rates */}

        {!loading &&
          rates.length === 0 &&
          errorMessage === '' && (
            <View
              style={
                styles.emptyCard
              }>

              <Text
                style={
                  styles.emptyIcon
                }>
                ◌
              </Text>

              <Text
                style={
                  styles.emptyTitle
                }>
                No rates available
              </Text>

              <Text
                style={
                  styles.emptyText
                }>
                Product prices will appear
                here when available.
              </Text>

            </View>
          )}


        {/* =========================
            MY ORDERS
        ========================= */}

        <TouchableOpacity
          activeOpacity={0.88}
          style={
            styles.ordersCard
          }
          onPress={() =>
            navigation.navigate(
              'MyOrders',
            )
          }>

          <View
            style={
              styles.ordersIcon
            }>
            <Text
              style={
                styles.ordersIconText
              }>
              ≡
            </Text>
          </View>

          <View
            style={
              styles.ordersContent
            }>
            <Text
              style={
                styles.ordersTitle
              }>
              My Orders
            </Text>

            <Text
              style={
                styles.ordersSubtitle
              }>
              Track your transactions
            </Text>
          </View>

          <View
            style={
              styles.ordersArrow
            }>
            <Text
              style={
                styles.ordersArrowText
              }>
              →
            </Text>
          </View>

        </TouchableOpacity>


        {/* =========================
            ACCOUNT
        ========================= */}

        <View
          style={
            styles.accountSection
          }>

          <TouchableOpacity
            style={
              styles.logoutButton
            }
            onPress={handleLogout}>

            <Text
              style={
                styles.logoutIcon
              }>
              ↪
            </Text>

            <Text
              style={
                styles.logoutText
              }>
              Logout
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={
              styles.logoutAllButton
            }
            onPress={
              handleLogoutAll
            }>

            <Text
              style={
                styles.logoutAllText
              }>
              Logout from all devices
            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>
    </View>
  );
};


// ======================================================
// Styles
// ======================================================

const createStyles = (colors: any) =>
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        colors.background,
    },

    content: {
      paddingHorizontal:
        spacing.xl,
      paddingTop: spacing.lg,
      paddingBottom:
        spacing.xxxl,
    },


    // =========================
    // Header
    // =========================

    header: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom:
        spacing.xl,
    },

    greeting: {
      fontSize: 13,
      color: colors.textSecondary,
    },

    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
    },

    userName: {
      fontSize: 25,
      fontWeight: '800',
      color: colors.text,
    },

    wave: {
      fontSize: 19,
      marginLeft: 7,
    },

    themeButton: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor:
        colors.card,
      borderWidth: 1,
      borderColor:
        colors.border,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    themeIcon: {
      fontSize: 21,
      color: colors.primary,
    },


    // =========================
    // Market Hero
    // =========================

    heroCard: {
      backgroundColor:
        colors.primary,
      borderRadius: 28,
      padding: spacing.xl,
      marginBottom:
        spacing.xl,
    },

    heroHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'flex-start',
    },

    heroLabel: {
      fontSize: 9,
      fontWeight: '800',
      letterSpacing: 1.5,
      color: colors.white,
      opacity: 0.72,
    },

    heroTitle: {
      fontSize: 21,
      fontWeight: '800',
      color: colors.white,
      marginTop: 4,
    },

    liveBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor:
        'rgba(255,255,255,0.15)',
    },

    heroLiveDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor:
        colors.success,
      marginRight: 6,
    },

    heroLiveText: {
      fontSize: 9,
      fontWeight: '800',
      letterSpacing: 1,
      color: colors.white,
    },

    marketRow: {
      flexDirection: 'row',
      marginTop: spacing.xl,
    },

    marketItem: {
      flex: 1,
      paddingRight: spacing.md,
    },

    marketItemRight: {
      borderLeftWidth: 1,
      borderLeftColor:
        'rgba(255,255,255,0.17)',
      paddingLeft: spacing.md,
      paddingRight: 0,
    },

    marketItemTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    marketSymbol: {
      width: 35,
      height: 35,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 9,
    },

    marketSymbolText: {
      fontSize: 13,
      fontWeight: '800',
      color: colors.white,
    },

    marketNameContainer: {
      flex: 1,
    },

    marketName: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.white,
    },

    marketUnit: {
      fontSize: 10,
      color: colors.white,
      opacity: 0.62,
      marginTop: 2,
    },

    marketPrice: {
      fontSize: 23,
      fontWeight: '800',
      color: colors.white,
      marginTop: 13,
    },

    marketSource: {
      fontSize: 9,
      color: colors.white,
      opacity: 0.6,
      marginTop: 4,
    },

    marketLoading: {
      paddingVertical: 35,
      alignItems: 'center',
      justifyContent: 'center',
    },

    marketLoadingText: {
      marginTop: 8,
      fontSize: 11,
      color: colors.white,
      opacity: 0.75,
    },

    marketError: {
      paddingVertical: 25,
    },

    marketErrorText: {
      fontSize: 11,
      color: colors.white,
      opacity: 0.78,
    },

    heroFooter: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginTop: spacing.xl,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor:
        'rgba(255,255,255,0.16)',
    },

    heroFooterText: {
      fontSize: 10,
      color: colors.white,
      opacity: 0.62,
    },

    heroUpdatedText: {
      fontSize: 10,
      color: colors.white,
      opacity: 0.75,
    },


    // =========================
    // Sections
    // =========================

    sectionHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },

    sectionTitle: {
      fontSize: 19,
      fontWeight: '800',
      color: colors.text,
    },

    sectionSubtitle: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 3,
    },


    // =========================
    // Quick Trade
    // =========================

    tradeRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.xl,
    },

    tradeCardPrimary: {
      flex: 1,
      minHeight: 140,
      backgroundColor:
        colors.primaryLight,
      borderRadius: 21,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor:
        colors.primary,
    },

    tradeCard: {
      flex: 1,
      minHeight: 140,
      backgroundColor:
        colors.card,
      borderRadius: 21,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor:
        colors.border,
    },

    tradeIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    tradeIconText: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.white,
    },

    tradeTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.text,
      marginTop: 14,
    },

    tradeSubtitle: {
      fontSize: 10,
      lineHeight: 15,
      color: colors.textSecondary,
      marginTop: 3,
      maxWidth: 105,
    },

    tradeArrow: {
      position: 'absolute',
      right: 16,
      bottom: 14,
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
    },


    // =========================
    // Count
    // =========================

    countBadge: {
      minWidth: 30,
      height: 30,
      paddingHorizontal: 8,
      borderRadius: 15,
      backgroundColor:
        colors.primaryLight,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    countText: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.primary,
    },


    // =========================
    // Metal
    // =========================

    metalSection: {
      marginBottom: spacing.sm,
    },

    metalHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
      marginTop: spacing.sm,
    },

    metalTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    goldIndicator: {
      width: 9,
      height: 9,
      borderRadius: 5,
      backgroundColor: '#D4A72C',
      marginRight: 8,
    },

    silverIndicator: {
      width: 9,
      height: 9,
      borderRadius: 5,
      backgroundColor: '#8D99AE',
      marginRight: 8,
    },

    metalTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
    },

    rateCount: {
      fontSize: 10,
      color: colors.textMuted,
    },


    // =========================
    // Product
    // =========================

    productCard: {
      backgroundColor:
        colors.card,
      borderRadius: 22,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor:
        colors.border,
    },

    productHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    productIcon: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    productIconText: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.primary,
    },

    productInformation: {
      flex: 1,
      marginLeft: 12,
    },

    productName: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
    },

    productDescription: {
      fontSize: 10,
      color: colors.textSecondary,
      marginTop: 4,
    },

    arrowCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor:
        colors.inputBackground,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    arrowText: {
      fontSize: 17,
      color: colors.textSecondary,
    },

    mainPriceSection: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'flex-end',
      marginTop: spacing.lg,
    },

    mainPriceLabel: {
      fontSize: 9,
      fontWeight: '800',
      letterSpacing: 1,
      color: colors.textMuted,
    },

    priceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginTop: 3,
    },

    mainPrice: {
      fontSize: 25,
      fontWeight: '800',
      color: colors.text,
    },

    priceUnit: {
      fontSize: 10,
      color: colors.textSecondary,
      marginLeft: 5,
    },

    liveSmallBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 9,
      paddingVertical: 5,
      borderRadius: 15,
      backgroundColor:
        colors.primaryLight,
    },

    smallLiveDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor:
        colors.success,
      marginRight: 5,
    },

    liveSmallText: {
      fontSize: 9,
      fontWeight: '800',
      color: colors.success,
    },

    buySellSection: {
      flexDirection: 'row',
      marginTop: spacing.lg,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor:
        colors.border,
    },

    buySellColumn: {
      flex: 1,
    },

    verticalDivider: {
      width: 1,
      backgroundColor:
        colors.border,
      marginHorizontal: spacing.md,
    },

    priceLabel: {
      fontSize: 9,
      fontWeight: '800',
      letterSpacing: 0.8,
      color: colors.textMuted,
    },

    buyPrice: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      marginTop: 4,
    },

    sellPrice: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.primary,
      marginTop: 4,
    },


    // =========================
    // Loading / Error
    // =========================

    loadingContainer: {
      minHeight: 100,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    loadingText: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 8,
    },

    errorContainer: {
      backgroundColor:
        colors.card,
      borderRadius: 18,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor:
        colors.error,
      marginBottom: spacing.md,
    },

    errorTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.error,
    },

    errorText: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 4,
    },


    // =========================
    // Empty
    // =========================

    emptyCard: {
      backgroundColor:
        colors.card,
      borderRadius: 20,
      padding: spacing.xl,
      alignItems: 'center',
      borderWidth: 1,
      borderColor:
        colors.border,
      marginBottom: spacing.lg,
    },

    emptyIcon: {
      fontSize: 34,
      color: colors.primary,
    },

    emptyTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
      marginTop: 8,
    },

    emptyText: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 4,
      textAlign: 'center',
    },


    // =========================
    // Orders
    // =========================

    ordersCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        colors.card,
      borderRadius: 22,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor:
        colors.border,
      marginTop: spacing.md,
    },

    ordersIcon: {
      width: 46,
      height: 46,
      borderRadius: 15,
      backgroundColor:
        colors.primaryLight,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    ordersIconText: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.primary,
    },

    ordersContent: {
      flex: 1,
      marginLeft: 13,
    },

    ordersTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
    },

    ordersSubtitle: {
      fontSize: 10,
      color: colors.textSecondary,
      marginTop: 4,
    },

    ordersArrow: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor:
        colors.inputBackground,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    ordersArrowText: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.primary,
    },


    // =========================
    // Account
    // =========================

    accountSection: {
      marginTop: spacing.xl,
    },

    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
    },

    logoutIcon: {
      fontSize: 18,
      color: colors.error,
      marginRight: 7,
    },

    logoutText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.error,
    },

    logoutAllButton: {
      alignItems: 'center',
      paddingVertical: 13,
      borderRadius: 14,
      borderWidth: 1,
      borderColor:
        colors.error,
    },

    logoutAllText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.error,
    },

  });

export default HomeScreen;
