import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // ← ДОБАВЬТЕ ЭТОТ ИМПОРТ

export default function HomeScreen() {
  const router = useRouter(); // ← СОЗДАЙТЕ router
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([
    {
      id: '1',
      title: 'React Native с нуля',
      instructor: 'Иван Иванов',
      price: 2990,
      rating: 4.8,
      students: 1245,
      image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=React+Native',
      category: 'Программирование'
    },
    {
      id: '2',
      title: 'Дизайн интерфейсов',
      instructor: 'Анна Смирнова',
      price: 3990,
      rating: 4.9,
      students: 856,
      image: 'https://via.placeholder.com/300x200/50C878/FFFFFF?text=UI/UX',
      category: 'Дизайн'
    },
    {
      id: '3',
      title: 'Маркетинг для начинающих',
      instructor: 'Петр Иванов',
      price: 2490,
      rating: 4.6,
      students: 2103,
      image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Marketing',
      category: 'Маркетинг'
    },
    {
      id: '4',
      title: 'Бизнес-аналитика',
      instructor: 'Мария Петрова',
      price: 4590,
      rating: 4.7,
      students: 934,
      image: 'https://via.placeholder.com/300x200/FFA500/FFFFFF?text=Business',
      category: 'Бизнес'
    },
  ]);

  // Добавьте эти функции для навигации:
  const handleCartPress = () => {
    router.push('/cart'); // ← Переход на корзину
  };

  const handleProfilePress = () => {
    router.push('/profile'); // ← Переход на профиль
  };

  // Если хотите использовать навигацию через табы (из нижнего меню):
  const handleTabNavigation = (screenName: string) => {
    // Это переключит таб в нижнем меню
    router.replace(`/(tabs)/${screenName}`);
  };

  const CourseCard = ({ course }) => (
    <TouchableOpacity 
      style={styles.courseCard}
      onPress={() => router.push(`/course/${course.id}`)} // ← Навигация на детали курса
    >
      <Image source={{ uri: course.image }} style={styles.courseImage} />
      <View style={styles.courseContent}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {course.title}
        </Text>
        <Text style={styles.courseInstructor}>{course.instructor}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{course.rating}</Text>
          <Text style={styles.studentsText}>({course.students})</Text>
        </View>
        <Text style={styles.coursePrice}>{course.price} ₽</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* Хедер */}
      <View style={styles.header}>
        <Text style={styles.logo}>EduShop</Text>
        
        {/* Правая часть хедера - ТЕПЕРЬ С НАВИГАЦИЕЙ */}
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleCartPress} // ← ДОБАВЬТЕ onPress
            // Или используйте handleTabNavigation('cart') для переключения табов
          >
            <Ionicons name="cart-outline" size={24} color="#333" />
            {/* Можно добавить бейдж с количеством товаров */}
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleProfilePress} // ← ДОБАВЬТЕ onPress
            // Или используйте handleTabNavigation('profile') для переключения табов
          >
            <Ionicons name="person-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Остальной код без изменений */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск курсов..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannerContainer}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Скидка 30% на все курсы</Text>
        </View>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Новые курсы уже доступны</Text>
        </View>
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {['Все', 'Программирование', 'Дизайн', 'Маркетинг', 'Бизнес'].map((cat, index) => (
          <TouchableOpacity key={index} style={styles.categoryChip}>
            <Text style={styles.categoryText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Популярные курсы</Text>
        <TouchableOpacity onPress={() => router.push('/explore')}>
          <Text style={styles.seeAll}>Смотреть все</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={courses}
        renderItem={({ item }) => <CourseCard course={item} />}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.coursesRow}
        contentContainerStyle={styles.coursesContainer}
        showsVerticalScrollIndicator={false}
      />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  bannerContainer: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  banner: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginRight: 10,
    minWidth: 250,
  },
  bannerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingLeft: 16,
    marginBottom: 20,
  },
  categoryChip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#4A90E2',
    fontSize: 14,
  },
  coursesContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  coursesRow: {
    justifyContent: 'space-between',
  },
  courseCard: {
    width: (Dimensions.get('window').width - 36) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: 120,
  },
  courseContent: {
    padding: 12,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    height: 40,
  },
  courseInstructor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 8,
  },
  studentsText: {
    fontSize: 12,
    color: '#999',
  },
  coursePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});