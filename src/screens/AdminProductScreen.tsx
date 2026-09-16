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
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Moon,
  Package,
  Pencil,
  Plus,
  Sun,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import {RootStackParamList} from '../navigations/AppNavigator';
import {useTheme} from '../theme/ThemeProvider';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

import {getProducts} from '../services/product.service';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AdminProducts'
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

const AdminProductsScreen = ({navigation}: Props) => {
  const {colors, mode, toggleTheme} = useTheme();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();

      console.log('Products response:', response);

      setProducts(response.products || []);
    } catch (error: any) {
      console.log('Get products error:', error);

      Toast.show({
        type: 'error',
        text1: 'Failed to load products',
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
      fetchProducts();
    }, []),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const activeProducts = products.filter(
    product => product.is_active,
  ).length;

  const goldProducts = products.filter(
    product => product.metal_type === 'GOLD',
  ).length;

  const silverProducts = products.filter(
    product => product.metal_type === 'SILVER',
  ).length;

  const renderProduct = ({item}: {item: Product}) => {
    const isGold = item.metal_type === 'GOLD';

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.productCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}>

        {/* Top section */}
        <View style={styles.cardTop}>
          <View style={styles.productLeft}>

            {/* Product Icon */}
            <View
              style={[
                styles.productIcon,
                {
                  backgroundColor: isGold
                    ? '#D4A01720'
                    : '#94A3B820',
                },
              ]}>
              {isGold ? (
                <CircleDollarSign
                  size={24}
                  color="#D4A017"
                />
              ) : (
                <Package
                  size={24}
                  color="#94A3B8"
                />
              )}
            </View>

            <View style={styles.productTitleContainer}>
              <Text
                style={[
                  styles.productName,
                  {
                    color: colors.text,
                  },
                ]}
                numberOfLines={1}>
                {item.name}
              </Text>

              <Text
                style={[
                  styles.productId,
                  {
                    color: colors.textSecondary,
                  },
                ]}>
                Product #{item.id}
              </Text>
            </View>
          </View>

          {/* Status */}
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: item.is_active
                  ? colors.success + '18'
                  : colors.textSecondary + '18',
              },
            ]}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: item.is_active
                    ? colors.success
                    : colors.textSecondary,
                },
              ]}
            />

            <Text
              style={[
                styles.statusText,
                {
                  color: item.is_active
                    ? colors.success
                    : colors.textSecondary,
                },
              ]}>
              {item.is_active ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        {/* Product details */}
        <View
          style={[
            styles.detailsBox,
            {
              backgroundColor: colors.background,
            },
          ]}>

          <View style={styles.detailItem}>
            <Text
              style={[
                styles.detailLabel,
                {
                  color: colors.textSecondary,
                },
              ]}>
              Metal
            </Text>

            <View style={styles.metalValueRow}>
              <View
                style={[
                  styles.metalDot,
                  {
                    backgroundColor: isGold
                      ? '#D4A017'
                      : '#94A3B8',
                  },
                ]}
              />

              <Text
                style={[
                  styles.detailValue,
                  {
                    color: colors.text,
                  },
                ]}>
                {item.metal_type}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.verticalDivider,
              {
                backgroundColor: colors.border,
              },
            ]}
          />

          <View style={styles.detailItem}>
            <Text
              style={[
                styles.detailLabel,
                {
                  color: colors.textSecondary,
                },
              ]}>
              Purity
            </Text>

            <Text
              style={[
                styles.detailValue,
                {
                  color: colors.text,
                },
              ]}>
              {item.purity}
            </Text>
          </View>

          <View
            style={[
              styles.verticalDivider,
              {
                backgroundColor: colors.border,
              },
            ]}
          />

          <View style={styles.detailItem}>
            <Text
              style={[
                styles.detailLabel,
                {
                  color: colors.textSecondary,
                },
              ]}>
              Unit
            </Text>

            <Text
              style={[
                styles.detailValue,
                {
                  color: colors.text,
                },
              ]}>
              {item.unit}
            </Text>
          </View>
        </View>

        {/* Edit */}
        <View style={styles.cardBottom}>
          <Text
            style={[
              styles.updatedText,
              {
                color: colors.textSecondary,
              },
            ]}>
            Manage product
          </Text>

          <TouchableOpacity
            style={[
              styles.editButton,
              {
                backgroundColor: colors.primary + '12',
              },
            ]}
            onPress={() =>
              navigation.navigate('EditProduct', {
                productId: item.id,
              })
            }>
            <Pencil
              size={16}
              color={colors.primary}
            />

            <Text
              style={[
                styles.editText,
                {
                  color: colors.primary,
                },
              ]}>
              Edit
            </Text>

            <ChevronRight
              size={16}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor: colors.background,
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
              color: colors.textSecondary,
            },
          ]}>
          Loading products...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}>

      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderProduct}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }

        ListHeaderComponent={
          <>
            {/* ================= HEADER ================= */}
            <View style={styles.header}>

              <TouchableOpacity
                style={[
                  styles.headerIconButton,
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
                    {
                      color: colors.text,
                    },
                  ]}>
                  Products
                </Text>

                <Text
                  style={[
                    styles.headerSubtitle,
                    {
                      color: colors.textSecondary,
                    },
                  ]}>
                  Manage your bullion products
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.headerIconButton,
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

            {/* ================= SUMMARY ================= */}
            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}>

              <View style={styles.summaryHeader}>
                <View>
                  <Text
                    style={[
                      styles.summaryTitle,
                      {
                        color: colors.text,
                      },
                    ]}>
                    Product Overview
                  </Text>

                  <Text
                    style={[
                      styles.summarySubtitle,
                      {
                        color: colors.textSecondary,
                      },
                    ]}>
                    Current product inventory
                  </Text>
                </View>

                <View
                  style={[
                    styles.summaryIcon,
                    {
                      backgroundColor:
                        colors.primary + '15',
                    },
                  ]}>
                  <Package
                    size={22}
                    color={colors.primary}
                  />
                </View>
              </View>

              <View style={styles.statsRow}>

                <View style={styles.statItem}>
                  <Text
                    style={[
                      styles.statNumber,
                      {
                        color: colors.text,
                      },
                    ]}>
                    {products.length}
                  </Text>

                  <Text
                    style={[
                      styles.statLabel,
                      {
                        color: colors.textSecondary,
                      },
                    ]}>
                    Total
                  </Text>
                </View>

                <View
                  style={[
                    styles.statDivider,
                    {
                      backgroundColor: colors.border,
                    },
                  ]}
                />

                <View style={styles.statItem}>
                  <Text
                    style={[
                      styles.statNumber,
                      {
                        color: colors.success,
                      },
                    ]}>
                    {activeProducts}
                  </Text>

                  <Text
                    style={[
                      styles.statLabel,
                      {
                        color: colors.textSecondary,
                      },
                    ]}>
                    Active
                  </Text>
                </View>

                <View
                  style={[
                    styles.statDivider,
                    {
                      backgroundColor: colors.border,
                    },
                  ]}
                />

                <View style={styles.statItem}>
                  <Text
                    style={[
                      styles.statNumber,
                      {
                        color: '#D4A017',
                      },
                    ]}>
                    {goldProducts}
                  </Text>

                  <Text
                    style={[
                      styles.statLabel,
                      {
                        color: colors.textSecondary,
                      },
                    ]}>
                    Gold
                  </Text>
                </View>

                <View
                  style={[
                    styles.statDivider,
                    {
                      backgroundColor: colors.border,
                    },
                  ]}
                />

                <View style={styles.statItem}>
                  <Text
                    style={[
                      styles.statNumber,
                      {
                        color: '#94A3B8',
                      },
                    ]}>
                    {silverProducts}
                  </Text>

                  <Text
                    style={[
                      styles.statLabel,
                      {
                        color: colors.textSecondary,
                      },
                    ]}>
                    Silver
                  </Text>
                </View>
              </View>
            </View>

            {/* ================= ADD PRODUCT ================= */}
            <TouchableOpacity
              style={[
                styles.addButton,
                {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() =>
                navigation.navigate('AddProduct')
              }
              activeOpacity={0.85}>

              <View style={styles.addIcon}>
                <Plus
                  size={20}
                  color={colors.white}
                />
              </View>

              <View style={styles.addTextContainer}>
                <Text
                  style={[
                    styles.addTitle,
                    {
                      color: colors.white,
                    },
                  ]}>
                  Add New Product
                </Text>

                <Text
                  style={[
                    styles.addSubtitle,
                    {
                      color: colors.white + 'CC',
                    },
                  ]}>
                  Create a new bullion product
                </Text>
              </View>

              <ChevronRight
                size={21}
                color={colors.white}
              />
            </TouchableOpacity>

            {/* Section title */}
            <View style={styles.sectionHeader}>
              <View>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: colors.text,
                    },
                  ]}>
                  All Products
                </Text>

                <Text
                  style={[
                    styles.sectionSubtitle,
                    {
                      color: colors.textSecondary,
                    },
                  ]}>
                  {products.length}{' '}
                  {products.length === 1
                    ? 'product'
                    : 'products'}{' '}
                  available
                </Text>
              </View>
            </View>
          </>
        }

        ListEmptyComponent={
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}>
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor:
                    colors.primary + '15',
                },
              ]}>
              <Package
                size={30}
                color={colors.primary}
              />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: colors.text,
                },
              ]}>
              No Products Yet
            </Text>

            <Text
              style={[
                styles.emptyText,
                {
                  color: colors.textSecondary,
                },
              ]}>
              Add your first product to get started.
            </Text>

            <TouchableOpacity
              style={[
                styles.emptyButton,
                {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() =>
                navigation.navigate('AddProduct')
              }>
              <Plus
                size={18}
                color={colors.white}
              />

              <Text
                style={[
                  styles.emptyButtonText,
                  {
                    color: colors.white,
                  },
                ]}>
                Add Product
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

  listContent: {
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

  headerIconButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

  /* ================= SUMMARY ================= */

  summaryCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },

  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: '700',
  },

  summarySubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  summaryIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 21,
    fontWeight: '700',
  },

  statLabel: {
    fontSize: 11,
    marginTop: 3,
  },

  statDivider: {
    width: 1,
    height: 32,
  },

  /* ================= ADD BUTTON ================= */

  addButton: {
    minHeight: 76,
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  addIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#FFFFFF20',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addTextContainer: {
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

  /* ================= SECTION ================= */

  sectionHeader: {
    marginBottom: spacing.md,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  sectionSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  /* ================= PRODUCT CARD ================= */

  productCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  productLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  productIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productTitleContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },

  productName: {
    fontSize: 17,
    fontWeight: '700',
  },

  productId: {
    fontSize: 11,
    marginTop: 3,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: spacing.sm,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },

  detailsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 13,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.md,
  },

  detailItem: {
    flex: 1,
    alignItems: 'center',
  },

  detailLabel: {
    fontSize: 10,
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 13,
    fontWeight: '700',
  },

  metalValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  metalDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },

  verticalDivider: {
    width: 1,
    height: 30,
  },

  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },

  updatedText: {
    fontSize: 11,
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },

  editText: {
    fontSize: 12,
    fontWeight: '700',
    marginHorizontal: 5,
  },

  /* ================= EMPTY ================= */

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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  emptyText: {
    fontSize: 13,
    marginTop: spacing.xs,
    textAlign: 'center',
  },

  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    marginTop: spacing.lg,
  },

  emptyButtonText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: spacing.xs,
  },

  /* ================= LOADING ================= */

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 13,
    marginTop: spacing.md,
  },
});

export default AdminProductsScreen;
