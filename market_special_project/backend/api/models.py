from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Author(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='author_profile')
    bio = models.TextField('Biography', blank=True)
    specialization = models.CharField('Specialization', max_length=200)
    avatar = models.ImageField('Avatar', upload_to='authors/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username}"
    class Meta:
        verbose_name = 'Author'
        verbose_name_plural = 'Authors'

class Category(models.Model):
    name = models.CharField('Name', max_length=100)
    slug = models.SlugField('URL', unique=True)
    description = models.TextField('Description', blank=True)
    image = models.ImageField('Image', upload_to='categories/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name
    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

class Course(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    title = models.CharField('Name', max_length=200)
    slug = models.SlugField('URL', unique=True)
    description = models.TextField('Description')
    short_description = models.CharField('Brief description', max_length=500)
    price = models.DecimalField('Price', max_digits=10, decimal_places=2)
    discount_price = models.DecimalField('Discounted price', max_digits=10, decimal_places=2, null=True, blank=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='courses')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='courses')
    level = models.CharField('Level', max_length=20, choices=LEVEL_CHOICES, default='beginner')
    duration_hours = models.IntegerField('Duration')
    language = models.CharField('Language', max_length=50, default='English')
    cover_image = models.ImageField('Cover', upload_to='courses/covers/', null=True, blank=True)
    preview_video = models.FileField('Preview', upload_to='courses/previews/', null=True, blank=True)
    is_published = models.BooleanField('Published', default=False)
    is_featured = models.BooleanField('Reccomended', default=False)
    students_count = models.IntegerField('Number of students', default=0)
    rating = models.FloatField('Rating', default=0.0)
    reviews_count = models.IntegerField('Number of reviews', default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.title
    class Meta:
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'
        ordering = ['-created_at']