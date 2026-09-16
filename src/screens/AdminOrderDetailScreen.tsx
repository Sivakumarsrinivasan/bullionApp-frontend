import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import {RootStackParamList} from '../navigations/AppNavigator';
import {
  getAdminOrderById,
  updateOrderStatus,
} from '../services/order.service';
import {useTheme} from '../theme/ThemeProvider';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AdminOrderDetails'
>;

type Order = {
  id: number;
  user_id: number;
  product_id: number;
  product_name: string;
  metal_type: string;
  purity: number;
  unit: string;
  product_rate_id: number;
  order_type: 'BUY' | 'SELL';
  quantity: string | number;
  price: string | number;
  total_amount: string | number;
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'COMPLETED'
    | 'CANCELLED';
  created_at: string;
  updated_at: string;
};

const AdminOrderDetailsScreen = ({
  navigation,
  route,
}: Props) => {
  const {colors, mode, toggleTheme} = useTheme();

  const {orderId} = route.params;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      setLoading(true);

      const response =
        await getAdminOrderById(orderId);

      console.log(
        'Admin order response:',
        response,
      );

      const orderData =
        response?.data;

      if (!orderData) {
        Toast.show({
          type: 'error',
          text1: 'Order not found',
        });

        navigation.goBack();
        return;
      }

      setOrder(orderData);
    } catch (error: any) {
      console.log(
        'Get admin order error:',
        error,
      );

      Toast.show({
        type: 'error',
        text1: 'Failed to load order',
        text2:
          error?.response?.data?.message ||
          'Something went wrong',
      });

      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    status:
      | 'CONFIRMED'
      | 'PROCESSING'
      | 'COMPLETED'
      | 'CANCELLED',
  ) => {
    if (!order) {
      return;
    }

    try {
      setUpdating(true);

      const response =
        await updateOrderStatus(
          order.id,
          status,
        );

      console.log(
        'Update status response:',
        response,
      );

      const updatedOrder =
        response?.data;

      if (updatedOrder) {
        setOrder(updatedOrder);
      } else {
        await loadOrder();
      }

      Toast.show({
        type: 'success',
        text1: 'Status updated',
        text2: `Order is now ${status}`,
      });
    } catch (error: any) {
      console.log(
        'Update order status error:',
        error,
      );

      Toast.show({
        type: 'error',
        text1: 'Unable to update status',
        text2:
          error?.response?.data?.message ||
          'Something went wrong',
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusStyle = () => {
    if (!order) {
      return {
        backgroundColor: colors.card,
        color: colors.text,
      };
    }

    switch (order.status) {
      case 'PENDING':
        return {
          backgroundColor: '#FFF3CD',
          color: '#856404',
        };

      case 'CONFIRMED':
        return {
          backgroundColor: '#D1ECF1',
          color: '#0C5460',
        };

      case 'PROCESSING':
        return {
          backgroundColor: '#E2D9F3',
          color: '#59359A',
        };

      case 'COMPLETED':
        return {
          backgroundColor: '#D4EDDA',
          color: '#155724',
        };

      case 'CANCELLED':
        return {
          backgroundColor: '#F8D7DA',
          color: '#721C24',
        };

      default:
        return {
          backgroundColor: colors.card,
          color: colors.text,
        };
    }
  };

  const canConfirm =
    order?.status === 'PENDING';

  const canProcess =
    order?.status === 'CONFIRMED';

  const canComplete =
    order?.status === 'PROCESSING';

  const canCancel =
    order?.status === 'PENDING' ||
    order?.status === 'CONFIRMED' ||
    order?.status === 'PROCESSING';

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
            {color: colors.text},
          ]}>
          Loading order...
        </Text>
      </View>
    );
  }

  if (!order) {
    return null;
  }

  const statusStyle =
    getStatusStyle();

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor:
          colors.background,
      }}
      contentContainerStyle={
        styles.container
      }>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.iconButton,
            {
              backgroundColor:
                colors.card,
            },
          ]}
          onPress={() =>
            navigation.goBack()
          }>
          <Text
            style={[
              styles.backText,
              {color: colors.text},
            ]}>
            ‹
          </Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text
            style={[
              styles.title,
              {color: colors.text},
            ]}>
            Order Details
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color:
                  colors.textSecondary,
              },
            ]}>
            Order #{order.id}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.iconButton,
            {
              backgroundColor:
                colors.card,
            },
          ]}
          onPress={toggleTheme}>
          <Text style={{fontSize: 18}}>
            {mode === 'light'
              ? '🌙'
              : '☀️'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Status */}
      <View
        style={[
          styles.statusCard,
          {
            backgroundColor:
              statusStyle.backgroundColor,
          },
        ]}>
        <Text
          style={[
            styles.statusLabel,
            {color: statusStyle.color},
          ]}>
          CURRENT STATUS
        </Text>

        <Text
          style={[
            styles.statusValue,
            {color: statusStyle.color},
          ]}>
          {order.status}
        </Text>
      </View>

      {/* Product */}
      <View
        style={[
          styles.card,
          {
            backgroundColor:
              colors.card,
            borderColor:
              colors.border,
          },
        ]}>

        <Text
          style={[
            styles.cardTitle,
            {color: colors.text},
          ]}>
          Product Information
        </Text>

        <Text
          style={[
            styles.productName,
            {color: colors.text},
          ]}>
          {order.product_name}
        </Text>

        <View style={styles.row}>
          <Text
            style={[
              styles.label,
              {
                color:
                  colors.textSecondary,
              },
            ]}>
            Metal
          </Text>

          <Text
            style={[
              styles.value,
              {color: colors.text},
            ]}>
            {order.metal_type}
          </Text>
        </View>

        <View style={styles.row}>
          <Text
            style={[
              styles.label,
              {
                color:
                  colors.textSecondary,
              },
            ]}>
            Purity
          </Text>

          <Text
            style={[
              styles.value,
              {color: colors.text},
            ]}>
            {order.purity}
          </Text>
        </View>

        <View style={styles.row}>
          <Text
            style={[
              styles.label,
              {
                color:
                  colors.textSecondary,
              },
            ]}>
            Unit
          </Text>

          <Text
            style={[
              styles.value,
              {color: colors.text},
            ]}>
            {order.unit}
          </Text>
        </View>

        <View style={styles.row}>
          <Text
            style={[
              styles.label,
              {
                color:
                  colors.textSecondary,
              },
            ]}>
            Product Rate ID
          </Text>

          <Text
            style={[
              styles.value,
              {color: colors.text},
            ]}>
            {order.product_rate_id}
          </Text>
        </View>
      </View>

      {/* Order information */}
      <View
        style={[
          styles.card,
          {
            backgroundColor:
              colors.card,
            borderColor:
              colors.border,
          },
        ]}>

        <Text
          style={[
            styles.cardTitle,
            {color: colors.text},
          ]}>
          Order Information
        </Text>

        <View style={styles.row}>
          <Text
            style={[
              styles.label,
              {
                color:
                  colors.textSecondary,
              },
            ]}>
            Customer ID
          </Text>

          <Text
            style={[
              styles.value,
              {color: colors.text},
            ]}>
            {order.user_id}
          </Text>
        </View>

        <View style={styles.row}>
          <Text
            style={[
              styles.label,
              {
                color:
                  colors.textSecondary,
              },
            ]}>
            Order Type
          </Text>

          <Text
            style={[
              styles.value,
              {color: colors.text},
            ]}>
            {order.order_type}
          </Text>
        </View>

        <View style={styles.row}>
          <Text
            style={[
              styles.label,
              {
                color:
                  colors.textSecondary,
              },
            ]}>
            Quantity
          </Text>

          <Text
            style={[
              styles.value,
              {color: colors.text},
            ]}>
            {order.quantity}
          </Text>
        </View>

        <View style={styles.row}>
          <Text
            style={[
              styles.label,
              {
                color:
                  colors.textSecondary,
              },
            ]}>
            Price
          </Text>

          <Text
            style={[
              styles.value,
              {color: colors.text},
            ]}>
            ₹
            {Number(
              order.price,
            ).toLocaleString()}
          </Text>
        </View>

        <View
          style={[
            styles.totalRow,
            {
              borderTopColor:
                colors.border,
            },
          ]}>
          <Text
            style={[
              styles.totalLabel,
              {
                color:
                  colors.textSecondary,
              },
            ]}>
            Total Amount
          </Text>

          <Text
            style={[
              styles.totalValue,
              {color: colors.text},
            ]}>
            ₹
            {Number(
              order.total_amount,
            ).toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Dates */}
      <View
        style={[
          styles.card,
          {
            backgroundColor:
              colors.card,
            borderColor:
              colors.border,
          },
        ]}>

        <Text
          style={[
            styles.cardTitle,
            {color: colors.text},
          ]}>
          Timeline
        </Text>

        <View style={styles.row}>
          <Text
            style={[
              styles.label,
              {
                color:
                  colors.textSecondary,
              },
            ]}>
            Created
          </Text>

          <Text
            style={[
              styles.value,
              {color: colors.text},
            ]}>
            {new Date(
              order.created_at,
            ).toLocaleString()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text
            style={[
              styles.label,
              {
                color:
                  colors.textSecondary,
              },
            ]}>
            Last Updated
          </Text>

          <Text
            style={[
              styles.value,
              {color: colors.text},
            ]}>
            {new Date(
              order.updated_at,
            ).toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Actions */}
      {(canConfirm ||
        canProcess ||
        canComplete ||
        canCancel) && (
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}>

          <Text
            style={[
              styles.cardTitle,
              {color: colors.text},
            ]}>
            Order Actions
          </Text>

          {canConfirm && (
            <TouchableOpacity
              disabled={updating}
              style={[
                styles.actionButton,
                {
                  backgroundColor:
                    colors.primary,
                  opacity:
                    updating
                      ? 0.6
                      : 1,
                },
              ]}
              onPress={() =>
                handleStatusUpdate(
                  'CONFIRMED',
                )}>

              {updating ? (
                <ActivityIndicator
                  color="#fff"
                />
              ) : (
                <Text
                  style={
                    styles.actionText
                  }>
                  Confirm Order
                </Text>
              )}
            </TouchableOpacity>
          )}

          {canProcess && (
            <TouchableOpacity
              disabled={updating}
              style={[
                styles.actionButton,
                {
                  backgroundColor:
                    colors.primary,
                  opacity:
                    updating
                      ? 0.6
                      : 1,
                },
              ]}
              onPress={() =>
                handleStatusUpdate(
                  'PROCESSING',
                )}>

              {updating ? (
                <ActivityIndicator
                  color="#fff"
                />
              ) : (
                <Text
                  style={
                    styles.actionText
                  }>
                  Start Processing
                </Text>
              )}
            </TouchableOpacity>
          )}

          {canComplete && (
            <TouchableOpacity
              disabled={updating}
              style={[
                styles.actionButton,
                {
                  backgroundColor:
                    colors.primary,
                  opacity:
                    updating
                      ? 0.6
                      : 1,
                },
              ]}
              onPress={() =>
                handleStatusUpdate(
                  'COMPLETED',
                )}>

              {updating ? (
                <ActivityIndicator
                  color="#fff"
                />
              ) : (
                <Text
                  style={
                    styles.actionText
                  }>
                  Mark Completed
                </Text>
              )}
            </TouchableOpacity>
          )}

          {canCancel && (
            <TouchableOpacity
              disabled={updating}
              style={[
                styles.cancelButton,
                {
                  opacity:
                    updating
                      ? 0.6
                      : 1,
                },
              ]}
              onPress={() =>
                handleStatusUpdate(
                  'CANCELLED',
                )}>

              {updating ? (
                <ActivityIndicator
                  color="#fff"
                />
              ) : (
                <Text
                  style={
                    styles.cancelText
                  }>
                  Cancel Order
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 15,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backText: {
    fontSize: 32,
    lineHeight: 35,
  },

  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
  },

  subtitle: {
    fontSize: 13,
    marginTop: 3,
  },

  statusCard: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
  },

  statusLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },

  statusValue: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 4,
  },

  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 16,
  },

  productName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 12,
  },

  label: {
    fontSize: 13,
    flex: 1,
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    marginTop: 18,
    paddingTop: 16,
  },

  totalLabel: {
    fontSize: 14,
  },

  totalValue: {
    fontSize: 20,
    fontWeight: '800',
  },

  actionButton: {
    minHeight: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  actionText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },

  cancelButton: {
    minHeight: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: '#D32F2F',
  },

  cancelText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default AdminOrderDetailsScreen;
