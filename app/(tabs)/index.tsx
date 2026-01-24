import React, { useState, useEffect } from 'react';
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
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '@/contexts/CartContext';

// Mock данные курсов
const MOCK_COURSES = [
  {
    id: '1',
    title: 'React Native с нуля до PRO',
    instructor: 'Иван Иванов',
    price: 2990,
    rating: 4.8,
    students: 1245,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    category: 'Программирование',
    tags: ['react', 'mobile', 'javascript']
  },
  {
    id: '2',
    title: 'UI/UX Дизайн для начинающих',
    instructor: 'Анна Смирнова',
    price: 3990,
    rating: 4.9,
    students: 856,
    image: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400&h=300&fit=crop',
    category: 'Дизайн',
    tags: ['ui', 'ux', 'figma', 'дизайн']
  },
  {
    id: '3',
    title: 'Маркетинг для начинающих',
    instructor: 'Петр Иванов',
    price: 2490,
    rating: 4.6,
    students: 2103,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    category: 'Маркетинг',
    tags: ['маркетинг', 'smm', 'реклама']
  },
  {
    id: '4',
    title: 'Бизнес-аналитика и Excel',
    instructor: 'Мария Петрова',
    price: 4590,
    rating: 4.7,
    students: 934,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    category: 'Бизнес',
    tags: ['excel', 'бизнес', 'аналитика']
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { addToCart } = useCart(); // Используем корзину
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(MOCK_COURSES);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [loading, setLoading] = useState(true);
  
  const categories = ['Все', 'Программирование', 'Дизайн', 'Маркетинг', 'Бизнес'];

  // Имитация загрузки данных
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    };
    loadCourses();
  }, []);

  // Функция поиска
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      filterCourses('', selectedCategory);
    } else {
      setIsSearching(true);
      setTimeout(() => {
        filterCourses(text, selectedCategory);
        setIsSearching(false);
      }, 300);
    }
  };

  // Функция фильтрации курсов
  const filterCourses = (searchText: string, category: string) => {
    let result = [...MOCK_COURSES];
    
    // Фильтрация по категории
    if (category !== 'Все') {
      result = result.filter(course => course.category === category);
    }
    
    // Фильтрация по поисковому запросу
    if (searchText.trim() !== '') {
      const query = searchText.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query) ||
        (course.tags && course.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    setFilteredCourses(result);
  };

  // Фильтрация по категории
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterCourses(searchQuery, category);
  };

  // Сброс поиска
  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('Все');
    setFilteredCourses(MOCK_COURSES);
  };

  // Навигация
  const handleCartPress = () => router.push('/cart');
  const handleProfilePress = () => router.push('/profile');

  // Компонент карточки курса
  const CourseCard = ({ course }) => (
    <View style={styles.courseCard}>
      <TouchableOpacity onPress={() => router.push(`/course/${course.id}`)}>
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
      
      {/* Кнопка добавления в корзину */}
      <TouchableOpacity 
        style={styles.buyButton}
        onPress={() => addToCart(course)}
      >
        <Text style={styles.buyButtonText}>В корзину</Text>
      </TouchableOpacity>
    </View>
  );

  // Компонент пустого состояния поиска
  const EmptySearchResults = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={80} color="#DDD" />
      <Text style={styles.emptyTitle}>Ничего не найдено</Text>
      <Text style={styles.emptyText}>
        Попробуйте изменить запрос или выбрать другую категорию
      </Text>
      <TouchableOpacity 
        style={styles.clearSearchButton}
        onPress={handleClearSearch}
      >
        <Text style={styles.clearSearchButtonText}>Сбросить поиск</Text>
      </TouchableOpacity>
    </View>
  );

  // Показываем индикатор загрузки
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Загружаем курсы...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Главный рендер
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* Хедер */}
      <View style={styles.header}>
        <Text style={styles.logo}>EduShop</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleCartPress}>
            <Ionicons name="cart-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleProfilePress}>
            <Ionicons name="person-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Основной ScrollView */}
      <ScrollView 
        style={styles.mainScrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Поисковая строка */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск курсов, авторов, тем..."
            value={searchQuery}
            onChangeText={handleSearch}
            clearButtonMode="while-editing"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Индикатор поиска */}
        {isSearching && (
          <View style={styles.searchingIndicator}>
            <ActivityIndicator size="small" color="#4A90E2" />
            <Text style={styles.searchingText}>Ищем курсы...</Text>
          </View>
        )}

        {/* Результаты поиска или баннеры */}
        {searchQuery.length > 0 ? (
          <View style={styles.searchResultsHeader}>
            <Text style={styles.searchResultsTitle}>
              Результаты поиска: "{searchQuery}"
            </Text>
            <Text style={styles.searchResultsCount}>
              Найдено: {filteredCourses.length} курсов
            </Text>
          </View>
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.bannerContainer}
          >
            <View style={styles.banner}>
              <Text style={styles.bannerText}>Скидка 30% на все курсы</Text>
            </View>
            <View style={styles.banner}>
              <Text style={styles.bannerText}>Новые курсы уже доступны</Text>
            </View>
          </ScrollView>
        )}

        {/* Категории */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesContainer}
        >
          {categories.map((cat, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive
              ]}
              onPress={() => handleCategoryFilter(cat)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Основной контент */}
        {filteredCourses.length === 0 && searchQuery.length > 0 ? (
          <EmptySearchResults />
        ) : (
          <View style={styles.coursesSection}>
            {searchQuery.length === 0 && (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {selectedCategory === 'Все' ? 'Популярные курсы' : selectedCategory}
                </Text>
                <TouchableOpacity onPress={() => router.push('/explore')}>
                  <Text style={styles.seeAll}>Смотреть все</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Сетка курсов */}
            <View style={styles.coursesGrid}>
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </View>
          </View>
        )}
        
        {/* Отступ внизу */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  mainScrollView: {
    flex: 1,
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
  searchingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  searchingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  searchResultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  searchResultsCount: {
    fontSize: 14,
    color: '#666',
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
  categoryChipActive: {
    backgroundColor: '#4A90E2',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  categoryTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  coursesSection: {
    paddingBottom: 20,
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
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
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
    marginBottom: 8,
  },
  buyButton: {
    backgroundColor: '#4A90E2',
    marginHorizontal: 12,
    marginBottom: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  clearSearchButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  clearSearchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 50,
  },
});