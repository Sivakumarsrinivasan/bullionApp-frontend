import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {RootStackParamList} from '../navigations/AppNavigator';
import {useTheme} from '../theme/ThemeProvider';
import AppButton from '../components/AppButton';
import {
  getProductRate,
} from '../services/product.service';
import {ProductRate} from "../types/product";
import {
  createOrder,
} from '../services/order.service';
import Toast from 'react-native-toast-message';
type Props = NativeStackScreenProps<
  RootStackParamList,
  'ProductDetails'
>;

type OrderType = 'BUY' | 'SELL';

const ProductDetailsScreen = ({route, navigation}: Props) => {
  const {productId} = route.params;
  const {colors} = useTheme();

  const [product, setProduct] = useState<ProductRate | null>(null);
  const [orderType, setOrderType] = useState<OrderType>('BUY');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProductRate();
  }, []);

  const loadProductRate = async () => {
    try {
      setLoading(true);
      setError('');
//           console.log('PRODUCT ID:', productId);
//     console.log('PRODUCT ID NUMBER:', Number(productId));
// console.log(productId,'****************')
      const data = await getProductRate(Number(productId));

      // console.log('PRODUCT RATE:', data);

      setProduct(data?.data);
    } catch (err: any) {
      console.log('PRODUCT RATE ERROR:', err.response.data);

      setError(
        err?.response?.data?.message ||
          'Unable to fetch product details',
      );
    } finally {
      setLoading(false);
    }
  };
const handleCreateOrder = async () => {
  try {
    setOrderLoading(true);

    const response = await createOrder({
      product_id: Number(productId),
      order_type: orderType,
      quantity,
    });

    // console.log('CREATE ORDER RESPONSE:', response);

    Toast.show({
      type: 'success',
      text1: 'Order Successful',
      text2:
        response?.message || 'Your order has been created successfully',
    });

  } catch (err: any) {
    console.log(
      'CREATE ORDER ERROR:',
      err?.response?.data || err,
    );

    Toast.show({
      type: 'error',
      text1: 'Order Failed',
      text2:
        err?.response?.data?.message ||
        'Unable to create order',
    });
  } finally {
    setOrderLoading(false);
  }
};
  const increaseQuantity = () => {
    setQuantity(previous => Number((previous + 0.001).toFixed(3)));
  };

  const decreaseQuantity = () => {
    setQuantity(previous =>
      previous > 0.001
        ? Number((previous - 0.001).toFixed(3))
        : 0.001,
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          {backgroundColor: colors.background},
        ]}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View
        style={[
          styles.center,
          {backgroundColor: colors.background},
        ]}>
        <Text
          style={[
            styles.errorText,
            {color: colors.error},
          ]}>
          {error || 'Product not found'}
        </Text>

        <Pressable
          onPress={loadProductRate}
          style={[
            styles.retryButton,
            {borderColor: colors.primary},
          ]}>
          <Text
            style={[
              styles.retryText,
              {color: colors.primary},
            ]}>
            Retry
          </Text>
        </Pressable>
      </View>
    );
  }

  const buyPrice = Number(product.buy_price) || 0;
  const sellPrice = Number(product.sell_price) || 0;

  const selectedPrice =
    orderType === 'BUY' ? buyPrice : sellPrice;

  const total = selectedPrice * quantity;

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colors.background},
      ]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[
              styles.backButton,
              {backgroundColor: colors.surface},
            ]}>
            <Text
              style={[
                styles.backText,
                {color: colors.text},
              ]}>
              ‹
            </Text>
          </Pressable>

          <Text
            style={[
              styles.headerTitle,
              {color: colors.text},
            ]}>
            Product Details
          </Text>

          <View style={styles.headerSpace} />
        </View>

        {/* Product Information */}
        <View
          style={[
            styles.productCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}>
          <View
            style={[
              styles.metalIcon,
              {backgroundColor: colors.primaryLight},
            ]}>
            <Text style={styles.metalIconText}>
              {product.metal_type === 'GOLD' ? 'Au' : 'Ag'}
            </Text>
          </View>

          <Text
            style={[
              styles.productName,
              {color: colors.text},
            ]}>
            {product.product_name}
          </Text>

          <Text
            style={[
              styles.productSubtitle,
              {color: colors.textSecondary},
            ]}>
            {product.purity} • Per {product?.unit?.toLowerCase()}
          </Text>
        </View>

        {/* Buy / Sell */}
        <View
          style={[
            styles.toggleContainer,
            {backgroundColor: colors.surface},
          ]}>
          <Pressable
            onPress={() => setOrderType('BUY')}
            style={[
              styles.toggleButton,
              orderType === 'BUY' && {
                backgroundColor: colors.primary,
              },
            ]}>
            <Text
              style={[
                styles.toggleText,
                {
                  color:
                    orderType === 'BUY'
                      ? colors.white
                      : colors.textSecondary,
                },
              ]}>
              BUY
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setOrderType('SELL')}
            style={[
              styles.toggleButton,
              orderType === 'SELL' && {
                backgroundColor: colors.primary,
              },
            ]}>
            <Text
              style={[
                styles.toggleText,
                {
                  color:
                    orderType === 'SELL'
                      ? colors.white
                      : colors.textSecondary,
                },
              ]}>
              SELL
            </Text>
          </Pressable>
        </View>

        {/* Current Price */}
        <View
          style={[
            styles.priceCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}>
          <Text
            style={[
              styles.label,
              {color: colors.textSecondary},
            ]}>
            {orderType === 'BUY'
              ? 'Buy Price'
              : 'Sell Price'}
          </Text>

          <Text
            style={[
              styles.price,
              {color: colors.text},
            ]}>
            ₹
            {selectedPrice.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>

          <Text
            style={[
              styles.perGram,
              {color: colors.textMuted},
            ]}>
            per {product?.unit?.toLowerCase()}
          </Text>
        </View>

        {/* Quantity */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}>
          <Text
            style={[
              styles.sectionTitle,
              {color: colors.text},
            ]}>
            Quantity
          </Text>

          <View style={styles.quantityContainer}>
            <Pressable
              onPress={decreaseQuantity}
              style={[
                styles.quantityButton,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                },
              ]}>
              <Text
                style={[
                  styles.quantityButtonText,
                  {color: colors.text},
                ]}>
                −
              </Text>
            </Pressable>

            <View style={styles.quantityValue}>
              <Text
                style={[
                  styles.quantityText,
                  {color: colors.text},
                ]}>
                {quantity.toFixed(3)}
              </Text>

              <Text
                style={[
                  styles.quantityUnit,
                  {color: colors.textSecondary},
                ]}>
                {product?.unit?.toLowerCase()}
              </Text>
            </View>

            <Pressable
              onPress={increaseQuantity}
              style={[
                styles.quantityButton,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                },
              ]}>
              <Text
                style={[
                  styles.quantityButtonText,
                  {color: colors.text},
                ]}>
                +
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Order Summary */}
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}>
          <View style={styles.summaryRow}>
            <Text
              style={[
                styles.summaryLabel,
                {color: colors.textSecondary},
              ]}>
              Price
            </Text>

            <Text
              style={[
                styles.summaryValue,
                {color: colors.text},
              ]}>
              ₹
              {selectedPrice.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text
              style={[
                styles.summaryLabel,
                {color: colors.textSecondary},
              ]}>
              Quantity
            </Text>

            <Text
              style={[
                styles.summaryValue,
                {color: colors.text},
              ]}>
              {quantity.toFixed(3)} {product?.unit?.toLowerCase()}
            </Text>
          </View>

          <View
            style={[
              styles.divider,
              {backgroundColor: colors.border},
            ]}
          />

          <View style={styles.summaryRow}>
            <Text
              style={[
                styles.totalLabel,
                {color: colors.text},
              ]}>
              Total
            </Text>

            <Text
              style={[
                styles.totalValue,
                {color: colors.primary},
              ]}>
              ₹
              {total.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>

        {/* Continue Button */}
       <AppButton
  title={
    orderType === 'BUY'
      ? 'Buy Now'
      : 'Sell Now'
  }
  onPress={handleCreateOrder}
  loading={orderLoading}
  disabled={orderLoading}
  style={styles.orderButton}
/>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },

  retryButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },

  retryText: {
    fontSize: 14,
    fontWeight: '600',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backText: {
    fontSize: 32,
    lineHeight: 34,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  headerSpace: {
    width: 42,
  },

  productCard: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    marginBottom: 16,
  },

  metalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  metalIconText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#9A7200',
  },

  productName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },

  productSubtitle: {
    fontSize: 14,
  },

  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },

  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 9,
  },

  toggleText: {
    fontSize: 14,
    fontWeight: '700',
  },

  priceCard: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 22,
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    marginBottom: 6,
  },

  price: {
    fontSize: 30,
    fontWeight: '700',
  },

  perGram: {
    fontSize: 13,
    marginTop: 4,
  },

  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 16,
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityButtonText: {
    fontSize: 25,
    fontWeight: '500',
  },

  quantityValue: {
    alignItems: 'center',
  },

  quantityText: {
    fontSize: 24,
    fontWeight: '700',
  },

  quantityUnit: {
    fontSize: 12,
    marginTop: 2,
  },

  summaryCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },

  summaryLabel: {
    fontSize: 14,
  },

  summaryValue: {
    fontSize: 15,
    fontWeight: '500',
  },

  divider: {
    height: 1,
    marginVertical: 12,
  },

  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
  },

  totalValue: {
    fontSize: 21,
    fontWeight: '700',
  },

  orderButton: {
    marginTop: 4,
  },
});

export default ProductDetailsScreen;

