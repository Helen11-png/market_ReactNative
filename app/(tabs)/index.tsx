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

// Mock данные курсов
const MOCK_COURSES = [
  {
    id: '1',
    title: 'React Native с нуля до PRO',
    instructor: 'Иван Иванов',
    price: 2990,
    rating: 4.8,
    students: 1245,
    image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=React+Native',
    category: 'Программирование',
    tags: ['react', 'mobile', 'javascript']
  },
  {
    id: '2',
    title: 'Дизайн интерфейсов UI/UX',
    instructor: 'Анна Смирнова',
    price: 3990,
    rating: 4.9,
    students: 856,
    image: 'https://via.placeholder.com/300x200/50C878/FFFFFF?text=UI/UX+Design',
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
    image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Marketing',
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
    image: 'https://via.placeholder.com/300x200/FFA500/FFFFFF?text=Business+Analytics',
    category: 'Бизнес',
    tags: ['excel', 'бизнес', 'аналитика']
  },
  {
    id: '5',
    title: 'JavaScript продвинутый уровень',
    instructor: 'Алексей Сидоров',
    price: 3490,
    rating: 4.8,
    students: 1876,
    image: 'https://via.placeholder.com/300x200/F0DB4F/000000?text=JavaScript',
    category: 'Программирование',
    tags: ['javascript', 'frontend', 'web']
  },
  {
    id: '6',
    title: 'Python для анализа данных',
    instructor: 'Дмитрий Козлов',
    price: 4290,
    rating: 4.9,
    students: 1321,
    image: 'https://via.placeholder.com/300x200/3776AB/FFFFFF?text=Python+Data',
    category: 'Программирование',
    tags: ['python', 'data', 'анализ']
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(MOCK_COURSES);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  
  // Категории для фильтрации
  const categories = ['Все', 'Программирование', 'Дизайн', 'Маркетинг', 'Бизнес'];

  // Функция поиска
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      // Если поиск пустой, показываем все курсы с учетом категории
      filterCourses('', selectedCategory);
    } else {
      setIsSearching(true);
      // Имитация задержки поиска
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
        course.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredCourses(result);
  };

  // Функция фильтрации по категории
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

  // Компонент карточки курса
  const CourseCard = ({ course }) => (
    <TouchableOpacity 
      style={styles.courseCard}
      onPress={() => router.push(`/course/${course.id}`)}
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

  const handleCartPress = () => router.push('/cart');
  const handleProfilePress = () => router.push('/profile');

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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannerContainer}>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>Скидка 30% на все курсы</Text>
          </View>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>Новые курсы уже доступны</Text>
          </View>
        </ScrollView>
      )}

      {/* Категории (фильтры) */}
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

      {/* Список курсов или результаты поиска */}
      {filteredCourses.length === 0 && searchQuery.length > 0 ? (
        <EmptySearchResults />
      ) : (
        <>
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
          
          <FlatList
            data={filteredCourses}
            renderItem={({ item }) => <CourseCard course={item} />}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.coursesRow}
            contentContainerStyle={styles.coursesContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.noCoursesContainer}>
                <Text style={styles.noCoursesText}>Курсы не найдены</Text>
              </View>
            }
          />
        </>
      )}
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
  emptyContainer: {
    flex: 1,
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
  noCoursesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noCoursesText: {
    fontSize: 16,
    color: '#666',
  },
});