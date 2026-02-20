import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Alert,
  SafeAreaView,
  StatusBar 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/contexts/CartContext';

export default function CartScreen() {
  const router = useRouter();
  const { items, removeFromCart, clearCart } = useCart();
  
  // Вычисляем общую сумму
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  // Оформление заказа
  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Корзина пуста', 'Добавьте курсы в корзину для оформления');
      return;
    }
    
    Alert.alert(
      'Оформление заказа',
      `Вы уверены, что хотите купить ${items.length} курсов на сумму ${total}₽?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Оформить', 
          style: 'default',
          onPress: () => {
            Alert.alert('Заказ оформлен!', 'Курсы добавлены в ваш профиль');
            clearCart();
          }
        }
      ]
    );
  };
  
  // Если корзина пуста
  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="cart-outline" size={100} color="#E0E0E0" />
          </View>
          <Text style={styles.emptyTitle}>Ваша корзина пуста</Text>
          <Text style={styles.emptyText}>
            Добавьте курсы из каталога, чтобы начать обучение
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/')}
          >
            <Ionicons name="book-outline" size={20} color="white" style={styles.browseIcon} />
            <Text style={styles.browseButtonText}>Перейти к курсам</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* Шапка */}
      <View style={styles.header}>
        <Text style={styles.title}>Корзина</Text>
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={() => {
            if (items.length > 0) {
              Alert.alert(
                'Очистить корзину',
                'Вы уверены, что хотите удалить все товары?',
                [
                  { text: 'Отмена', style: 'cancel' },
                  { text: 'Очистить', style: 'destructive', onPress: clearCart }
                ]
              );
            }
          }}
        >
          <Ionicons name="trash-outline" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      {/* Список товаров */}
      <ScrollView 
        style={styles.itemsContainer}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item, index) => (
          <View key={`${item.id}-${index}`} style={styles.cartItem}>
            <View style={styles.itemImageContainer}>
              <Image 
                source={{ uri: item.image }} 
                style={styles.itemImage} 
                defaultSource={{ uri: 'https://via.placeholder.com/100' }}
              />
            </View>
            
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.itemInstructor}>{item.instructor}</Text>
              <View style={styles.itemBottomRow}>
                <Text style={styles.itemPrice}>{item.price} ₽</Text>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeFromCart(item.id)}
                >
                  <Ionicons name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Итоговая панель */}
      <View style={styles.footer}>
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Товаров:</Text>
            <Text style={styles.summaryValue}>{items.length} шт.</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Итого:</Text>
            <Text style={styles.totalPrice}>{total} ₽</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Ionicons name="card-outline" size={22} color="white" />
          <Text style={styles.checkoutButtonText}>Оформить заказ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.continueShopping}
          onPress={() => router.push('/')}
        >
          <Text style={styles.continueShoppingText}>
            <Ionicons name="arrow-back" size={16} /> Продолжить покупки
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    padding: 8,
  },
  itemsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  itemImageContainer: {
    marginRight: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
  itemInstructor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  removeButton: {
    padding: 4,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  summary: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  checkoutButton: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  continueShopping: {
    alignItems: 'center',
  },
  continueShoppingText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  browseButton: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  browseIcon: {
    marginRight: 8,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});