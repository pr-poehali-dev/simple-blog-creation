import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: 'Минимализм в современном дизайне',
    excerpt: 'Исследование принципов минималистичного подхода к созданию интерфейсов и его влияние на пользовательский опыт.',
    date: '2024-10-20',
    category: 'Дизайн',
    tags: ['UI/UX', 'Минимализм', 'Тренды'],
    readTime: '5 мин'
  },
  {
    id: 2,
    title: 'Типографика и читабельность',
    excerpt: 'Как правильный выбор шрифтов и их комбинаций влияет на восприятие контента и удержание внимания читателя.',
    date: '2024-10-18',
    category: 'Типографика',
    tags: ['Шрифты', 'Типографика', 'Читабельность'],
    readTime: '7 мин'
  },
  {
    id: 3,
    title: 'Архитектура информации',
    excerpt: 'Структурирование контента для максимальной эффективности навигации и понимания иерархии данных.',
    date: '2024-10-15',
    category: 'Архитектура',
    tags: ['IA', 'Структура', 'Навигация'],
    readTime: '6 мин'
  },
  {
    id: 4,
    title: 'Цветовые системы в веб-дизайне',
    excerpt: 'Создание согласованных цветовых палитр и их применение для достижения визуальной гармонии.',
    date: '2024-10-12',
    category: 'Дизайн',
    tags: ['Цвет', 'Палитра', 'Визуал'],
    readTime: '4 мин'
  },
  {
    id: 5,
    title: 'Адаптивная типографика',
    excerpt: 'Методы масштабирования текста на разных устройствах с сохранением читабельности и эстетики.',
    date: '2024-10-10',
    category: 'Типографика',
    tags: ['Адаптив', 'Типографика', 'Мобильный'],
    readTime: '5 мин'
  },
  {
    id: 6,
    title: 'Пространство и ритм',
    excerpt: 'Использование белого пространства и вертикального ритма для создания визуальной иерархии.',
    date: '2024-10-08',
    category: 'Архитектура',
    tags: ['Пространство', 'Композиция', 'Ритм'],
    readTime: '6 мин'
  }
];

const categories = ['Все', 'Дизайн', 'Типографика', 'Архитектура'];
const allTags = ['UI/UX', 'Минимализм', 'Тренды', 'Шрифты', 'Типографика', 'Читабельность', 'IA', 'Структура', 'Навигация', 'Цвет', 'Палитра', 'Визуал', 'Адаптив', 'Мобильный', 'Пространство', 'Композиция', 'Ритм'];

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showArchive, setShowArchive] = useState(false);

  const filteredArticles = articles.filter(article => {
    const categoryMatch = selectedCategory === 'Все' || article.category === selectedCategory;
    const tagMatch = selectedTags.length === 0 || selectedTags.some(tag => article.tags.includes(tag));
    return categoryMatch && tagMatch;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const articlesByMonth = articles.reduce((acc, article) => {
    const date = new Date(article.date);
    const monthYear = date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' });
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(article);
    return acc;
  }, {} as Record<string, Article[]>);

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight">БЛОГ</h1>
            <div className="flex gap-8">
              <button 
                onClick={() => { setShowArchive(false); setSelectedCategory('Все'); setSelectedTags([]); }}
                className="text-base hover:opacity-60 transition-opacity"
              >
                Главная
              </button>
              <button className="text-base hover:opacity-60 transition-opacity">
                Категории
              </button>
              <button 
                onClick={() => setShowArchive(!showArchive)}
                className="text-base hover:opacity-60 transition-opacity"
              >
                Архив
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showArchive ? (
        <main className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-12">Архив статей</h2>
          <div className="space-y-12">
            {Object.entries(articlesByMonth).map(([month, articles]) => (
              <div key={month} className="border-l-2 border-black pl-8">
                <h3 className="text-xl font-bold mb-6 uppercase">{month}</h3>
                <div className="space-y-4">
                  {articles.map(article => (
                    <div key={article.id} className="flex justify-between items-baseline hover:opacity-60 transition-opacity cursor-pointer">
                      <span className="text-lg">{article.title}</span>
                      <span className="text-sm text-gray-600">
                        {new Date(article.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : (
        <>
          <div className="border-b border-gray-300">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex gap-4 mb-6">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 border transition-colors ${
                      selectedCategory === category
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className={`cursor-pointer transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black hover:bg-gray-100'
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <main className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {filteredArticles.map(article => (
                <Card 
                  key={article.id} 
                  className="border-2 border-black shadow-none hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow cursor-pointer"
                  onClick={() => navigate(`/article/${article.id}`)}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
                      <Icon name="Calendar" size={16} />
                      <span>{new Date(article.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      <span>•</span>
                      <Icon name="Clock" size={16} />
                      <span>{article.readTime}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3">{article.title}</h3>
                    
                    <p className="blog-content text-gray-700 mb-6">{article.excerpt}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {article.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="border-black text-black">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-black hover:bg-black hover:text-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/article/${article.id}`);
                      }}
                    >
                      Читать далее
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-20">
                <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-xl text-gray-600">Статьи не найдены</p>
                <Button
                  onClick={() => { setSelectedCategory('Все'); setSelectedTags([]); }}
                  variant="outline"
                  className="mt-6 border-black hover:bg-black hover:text-white"
                >
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </main>
        </>
      )}

      <footer className="border-t border-gray-300 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h4 className="font-bold mb-4">Навигация</h4>
              <div className="space-y-2 text-sm">
                <div className="hover:opacity-60 cursor-pointer">Главная</div>
                <div className="hover:opacity-60 cursor-pointer">Категории</div>
                <div className="hover:opacity-60 cursor-pointer">Архив</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Категории</h4>
              <div className="space-y-2 text-sm">
                {categories.filter(c => c !== 'Все').map(cat => (
                  <div key={cat} className="hover:opacity-60 cursor-pointer">{cat}</div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Контакты</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>blog@example.com</div>
                <div>© 2024 Минималистичный блог</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;