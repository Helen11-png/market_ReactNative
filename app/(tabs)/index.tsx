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
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock данные курсов (оставляем как есть)
const MOCK_COURSES = [
  // ... ваш массив курсов без изменений ...
];

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(MOCK_COURSES);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  
  const categories = ['Все', 'Программирование', 'Дизайн', 'Маркетинг', 'Бизнес'];

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

  const filterCourses = (searchText: string, category: string) => {
    let result = [...MOCK_COURSES];
    
    if (category !== 'Все') {
      result = result.filter(course => course.category === category);
    }
    
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

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterCourses(searchQuery, category);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('Все');
    setFilteredCourses(MOCK_COURSES);
  };

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

  // Главный рендер
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* Хедер - ВНЕ ScrollView, чтобы не скроллился */}
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

      {/* ОДИН главный ScrollView для всего контента */}
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
            contentContainerStyle={styles.bannerContent}
          >
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
          contentContainerStyle={styles.categoriesContent}
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
            
            {filteredCourses.length === 0 && (
              <View style={styles.noCoursesContainer}>
                <Text style={styles.noCoursesText}>Курсы не найдены</Text>
              </View>
            )}
          </View>
        )}
        
        {/* Отступ внизу для ScrollView */}
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
    marginBottom: 10,
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
    marginBottom: 16,
  },
  bannerContent: {
    paddingHorizontal: 16,
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
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    minWidth: 140,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryChipActive: {
    backgroundColor: '#4A90E2',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    lineHeight: 16,
    includeFontPadding: false,
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
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    minHeight: 300,
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
    paddingVertical: 50,
    alignItems: 'center',
  },
  noCoursesText: {
    fontSize: 16,
    color: '#666',
  },
  bottomSpacer: {
    height: 50,
  },
});