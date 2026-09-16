import React from 'react';
import {
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
  Moon,
  Package,
  Settings,
  ShieldCheck,
  Sun,
} from 'lucide-react-native';

import {RootStackParamList} from '../navigations/AppNavigator';
import {useTheme} from '../theme/ThemeProvider';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AdminHome'
>;

const AdminHomeScreen = ({navigation}: Props) => {
  const {colors, mode, toggleTheme} = useTheme();

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

          {/* Theme Button */}
          <TouchableOpacity
            style={[
              styles.themeButton,
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
        </View>

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
                      backgroundColor:
                        colors.background,
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

  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

export default AdminHomeScreen;
