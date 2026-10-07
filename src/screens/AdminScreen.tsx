import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  Coins,
  LogOut,
  Moon,
  MoreVertical,
  Package,
  Settings,
  ShieldCheck,
  Sun,
} from 'lucide-react-native';

import {RootStackParamList} from '../navigations/AppNavigator';
import {useTheme} from '../theme/ThemeProvider';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

import {
  logout,
  logoutAll,
} from '../services/authService';

import {
  clearTokens,
  getTokens,
} from '../services/tokenStorage';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AdminHome'
>;

const AdminScreen = ({navigation}: Props) => {
  const {colors, mode, toggleTheme} = useTheme();

  const [showLogoutMenu, setShowLogoutMenu] = React.useState(false);

  /*
   * ============================
   * LOGOUT CURRENT DEVICE
   * ============================
   */
  const handleLogout = async () => {
    try {
      const tokens = await getTokens();

      if (tokens?.refreshToken) {
        await logout(tokens.refreshToken);
      }
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      await clearTokens();

      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  };

  /*
   * ============================
   * LOGOUT ALL DEVICES
   * ============================
   */
  const handleLogoutAll = () => {
    Alert.alert(
      'Logout from all devices',
      'Are you sure you want to logout from all devices? This will end all active sessions.',
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
              await logoutAll();
            } catch (error) {
              console.log('Logout all error:', error);
            } finally {
              await clearTokens();

              navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
              });
            }
          },
        },
      ],
    );
  };

  /*
   * ============================
   * ADMIN MENU ITEMS
   * ============================
   */
  const menuItems = [
    {
      title: 'Products',
      description: 'Add, edit and manage products',
      icon: Package,
      onPress: () => navigation.navigate('AdminProducts'),
    },
    {
      title: 'Product Rates',
      description: 'Manage BUY and SELL rates',
      icon: BarChart3,
      onPress: () => navigation.navigate('AdminProductRates'),
    },
    {
      title: 'Market Rates',
      description: 'View latest market prices',
      icon: Coins,
      onPress: () => navigation.navigate('AdminMarketRates'),
    },
    {
      title: 'Orders',
      description: 'View and manage customer orders',
      icon: ClipboardList,
      onPress: () => navigation.navigate('AdminOrders'),
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>

        {/* ================= HEADER ================= */}

        <View style={styles.header}>

          <View style={styles.headerLeft}>

            <View
              style={[
                styles.adminIcon,
                {
                  backgroundColor: colors.primary + '18',
                },
              ]}>
              <ShieldCheck
                size={24}
                color={colors.primary}
              />
            </View>

            <View style={styles.headerTextContainer}>

              <Text
                style={[
                  styles.title,
                  {
                    color: colors.text,
                  },
                ]}>
                Admin Dashboard
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  {
                    color: colors.textSecondary,
                  },
                ]}>
                Manage your Bullion application
              </Text>

            </View>
          </View>

          {/* ================= HEADER ACTIONS ================= */}

          <View style={styles.headerActions}>

            {/* Theme Button */}

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={toggleTheme}
              activeOpacity={0.7}>

              {mode === 'dark' ? (
                <Sun
                  size={21}
                  color={colors.text}
                />
              ) : (
                <Moon
                  size={21}
                  color={colors.text}
                />
              )}

            </TouchableOpacity>

            {/* More Button */}

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() =>
                setShowLogoutMenu(prev => !prev)
              }
              activeOpacity={0.7}>

              <MoreVertical
                size={21}
                color={colors.text}
              />

            </TouchableOpacity>

          </View>
        </View>

        {/* ================= LOGOUT MENU ================= */}

    {showLogoutMenu && (
  <Pressable
    style={styles.popupOverlay}
    onPress={() => setShowLogoutMenu(false)}
  >
    <Pressable
      style={[
        styles.logoutMenu,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={e => e.stopPropagation()}
    >
      <TouchableOpacity
        style={styles.logoutMenuItem}
        onPress={() => {
          setShowLogoutMenu(false);
          handleLogout();
        }}
      >
        <LogOut size={18} color={colors.text} />

        <Text
          style={[
            styles.logoutMenuText,
            {color: colors.text},
          ]}
        >
          Logout
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutMenuItem}
        onPress={() => {
          setShowLogoutMenu(false);
          handleLogoutAll();
        }}
      >
        <LogOut size={18} color={colors.error} />

        <Text
          style={[
            styles.logoutMenuText,
            {color: colors.error},
          ]}
        >
          Logout from all devices
        </Text>
      </TouchableOpacity>
    </Pressable>
  </Pressable>
)}

        {/* ================= WELCOME CARD ================= */}

        <View
          style={[
            styles.welcomeCard,
            {
              backgroundColor: colors.primary,
            },
          ]}>

          <View style={styles.welcomeText}>

            <Text
              style={[
                styles.welcomeTitle,
                {
                  color: colors.white,
                },
              ]}>
              Welcome, Admin
            </Text>

            <Text
              style={[
                styles.welcomeDescription,
                {
                  color: colors.white + 'CC',
                },
              ]}>
              Manage products, rates and orders
              from one place.
            </Text>

          </View>

          <View
            style={[
              styles.welcomeIcon,
              {
                backgroundColor: colors.white + '20',
              },
            ]}>

            <Settings
              size={28}
              color={colors.white}
            />

          </View>

        </View>

        {/* ================= SECTION TITLE ================= */}

        <View style={styles.sectionHeader}>

          <View>

            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                },
              ]}>
              Management
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}>
              Quick access to admin features
            </Text>

          </View>

        </View>

        {/* ================= DASHBOARD CARDS ================= */}

        <View style={styles.grid}>

          {menuItems.map((item, index) => {

            const Icon = item.icon;

            return (
              <TouchableOpacity
                key={item.title}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={item.onPress}
                activeOpacity={0.8}>

                {/* Icon */}

                <View
                  style={[
                    styles.cardIcon,
                    {
                      backgroundColor:
                        index % 2 === 0
                          ? colors.primary + '18'
                          : colors.success + '18',
                    },
                  ]}>

                  <Icon
                    size={24}
                    color={
                      index % 2 === 0
                        ? colors.primary
                        : colors.success
                    }
                  />

                </View>

                {/* Card Content */}

                <View style={styles.cardContent}>

                  <Text
                    style={[
                      styles.cardTitle,
                      {
                        color: colors.text,
                      },
                    ]}>
                    {item.title}
                  </Text>

                  <Text
                    style={[
                      styles.cardDescription,
                      {
                        color: colors.textSecondary,
                      },
                    ]}>
                    {item.description}
                  </Text>

                </View>

                {/* Arrow */}

                <View
                  style={[
                    styles.arrowContainer,
                    {
                      backgroundColor: colors.background,
                    },
                  ]}>

                  <ArrowRight
                    size={18}
                    color={colors.textSecondary}
                  />

                </View>

              </TouchableOpacity>
            );
          })}

        </View>

        {/* ================= FOOTER INFO ================= */}

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}>

          <ShieldCheck
            size={20}
            color={colors.success}
          />

          <View style={styles.infoTextContainer}>

            <Text
              style={[
                styles.infoTitle,
                {
                  color: colors.text,
                },
              ]}>
              Admin Access
            </Text>

            <Text
              style={[
                styles.infoDescription,
                {
                  color: colors.textSecondary,
                },
              ]}>
              You have access to manage products,
              rates and orders.
            </Text>

          </View>

        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({

  /* ================= CONTAINER ================= */
popupOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 99,
},
  container: {
    flex: 1,
  },

 content: {
  paddingHorizontal: spacing.xl,
  paddingTop: spacing.xl + 50,
  paddingBottom: spacing.xxxl,
},

  /* ================= HEADER ================= */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  adminIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },

  title: {
    ...typography.title,
    fontWeight: '700',
  },

  subtitle: {
    ...typography.small,
    marginTop: spacing.xs,
  },

  /* ================= HEADER ACTIONS ================= */

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },

  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },

  /* ================= LOGOUT MENU ================= */

  logoutMenu: {
    position: 'absolute',
    top: 88,
    right: spacing.lg,
    width: 225,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: spacing.xs,
    zIndex: 100,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },

  logoutMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },

  logoutMenuText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },

  /* ================= WELCOME CARD ================= */

  welcomeCard: {
    minHeight: 150,
    borderRadius: 20,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },

  welcomeText: {
    flex: 1,
    paddingRight: spacing.md,
  },

  welcomeTitle: {
    fontSize: 23,
    fontWeight: '700',
  },

  welcomeDescription: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.sm,
  },

  welcomeIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ================= SECTION ================= */

  sectionHeader: {
    marginBottom: spacing.md,
  },

  sectionTitle: {
    ...typography.subHeading,
    fontWeight: '700',
  },

  sectionSubtitle: {
    ...typography.small,
    marginTop: spacing.xs,
  },

  /* ================= GRID ================= */

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  /* ================= CARD ================= */

  card: {
    width: '48.2%',
    minHeight: 190,
    borderWidth: 1,
    borderRadius: 18,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
  },

  cardDescription: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.xs,
  },

  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
  },

  /* ================= FOOTER ================= */

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.md,
    marginTop: spacing.sm,
  },

  infoTextContainer: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
  },

  infoDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
});

export default AdminScreen;
