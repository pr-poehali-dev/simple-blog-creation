import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Comment {
  id: number;
  author: string;
  date: string;
  text: string;
}

interface ArticleData {
  id: number;
  title: string;
  content: string[];
  date: string;
  category: string;
  tags: string[];
  readTime: string;
  author: string;
}

const articlesData: Record<string, ArticleData> = {
  '1': {
    id: 1,
    title: 'Минимализм в современном дизайне',
    content: [
      'Минимализм в дизайне — это не просто отсутствие декоративных элементов. Это философия, которая требует глубокого понимания сути создаваемого продукта и умения выразить её максимально лаконично.',
      'Основные принципы минималистичного подхода базируются на идее «меньше значит больше». Каждый элемент интерфейса должен иметь чёткую функцию и работать на общую композицию.',
      'Пространство играет ключевую роль в минималистичном дизайне. Негативное пространство не является пустотой — это активный элемент композиции, который создаёт визуальную иерархию и направляет внимание пользователя.',
      'Типографика в минимализме требует особого внимания. Выбор одного-двух шрифтов, их размеров и интерлиньяжа становится критически важным для создания визуальной структуры.',
      'Цветовая палитра обычно ограничена. Чёрный, белый и оттенки серого создают строгую иерархию, а один акцентный цвет может использоваться для привлечения внимания к ключевым элементам.',
      'Минимализм не означает простоту реализации. Напротив, создание действительно минималистичного дизайна требует множества итераций и глубокого анализа каждого решения.'
    ],
    date: '2024-10-20',
    category: 'Дизайн',
    tags: ['UI/UX', 'Минимализм', 'Тренды'],
    readTime: '5 мин',
    author: 'Анна Дизайнова'
  },
  '2': {
    id: 2,
    title: 'Типографика и читабельность',
    content: [
      'Типографика является основой любого текстового контента. От правильного выбора шрифтов и их комбинаций зависит не только эстетика, но и удобство чтения.',
      'Читабельность определяется множеством факторов: размером шрифта, интерлиньяжем, длиной строки и контрастом между текстом и фоном.',
      'Оптимальная длина строки для чтения составляет 50-75 символов. Слишком длинные строки утомляют глаза, а слишком короткие разбивают естественный ритм чтения.',
      'Иерархия заголовков помогает структурировать информацию. Разница в размерах должна быть достаточной, чтобы мозг мгновенно считывал уровень важности.',
      'Интерлиньяж влияет на комфорт чтения. Для основного текста рекомендуется значение 1.5-1.6 от размера шрифта.',
      'Выбор шрифтовой пары требует понимания характера шрифтов. Гротеск для заголовков и антиква для текста — классическое сочетание, проверенное временем.'
    ],
    date: '2024-10-18',
    category: 'Типографика',
    tags: ['Шрифты', 'Типографика', 'Читабельность'],
    readTime: '7 мин',
    author: 'Пётр Шрифтов'
  }
};

const mockComments: Comment[] = [
  {
    id: 1,
    author: 'Мария К.',
    date: '2024-10-21',
    text: 'Отличная статья! Очень полезные практические советы, которые можно сразу применить в работе.'
  },
  {
    id: 2,
    author: 'Дмитрий С.',
    date: '2024-10-21',
    text: 'Согласен с автором на все 100%. Минимализм — это действительно сложная работа над деталями.'
  },
  {
    id: 3,
    author: 'Елена В.',
    date: '2024-10-22',
    text: 'Хотелось бы больше примеров из реальных проектов. Может быть, стоит добавить кейс-стади?'
  }
];

export default function Article() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');

  const article = id ? articlesData[id] : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Статья не найдена</h1>
          <Button onClick={() => navigate('/')} variant="outline" className="border-2 border-black hover:bg-black hover:text-white">
            Вернуться на главную
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && commentAuthor.trim()) {
      setCommentText('');
      setCommentAuthor('');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-300">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-60 transition-opacity"
          >
            <Icon name="ArrowLeft" size={20} />
            <span className="text-base">Назад к статьям</span>
          </button>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12 pb-8 border-b-2 border-black">
          <div className="flex items-center gap-3 mb-6 text-sm text-gray-600">
            <Icon name="Calendar" size={16} />
            <span>{new Date(article.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>•</span>
            <Icon name="Clock" size={16} />
            <span>{article.readTime}</span>
            <span>•</span>
            <Icon name="User" size={16} />
            <span>{article.author}</span>
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight">{article.title}</h1>

          <div className="flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <Badge key={tag} variant="outline" className="border-black text-black">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        <div className="prose prose-lg max-w-none mb-16">
          {article.content.map((paragraph, index) => (
            <p key={index} className="blog-content mb-6 leading-relaxed text-gray-800">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="border-t-2 border-black pt-8 mb-16">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Поделиться статьёй</span>
            <div className="flex gap-4">
              <button className="hover:opacity-60 transition-opacity">
                <Icon name="Twitter" size={20} />
              </button>
              <button className="hover:opacity-60 transition-opacity">
                <Icon name="Facebook" size={20} />
              </button>
              <button className="hover:opacity-60 transition-opacity">
                <Icon name="Link" size={20} />
              </button>
            </div>
          </div>
        </div>

        <section className="border-t-2 border-black pt-12">
          <h2 className="text-3xl font-bold mb-8">Комментарии ({mockComments.length})</h2>

          <Card className="border-2 border-black shadow-none mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Ваш комментарий"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none transition-colors resize-none"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors"
                >
                  Отправить комментарий
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {mockComments.map(comment => (
              <Card key={comment.id} className="border-2 border-gray-300 shadow-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold">{comment.author}</span>
                    <span className="text-sm text-gray-600">
                      {new Date(comment.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </article>

      <footer className="border-t border-gray-300 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h4 className="font-bold mb-4">Навигация</h4>
              <div className="space-y-2 text-sm">
                <div onClick={() => navigate('/')} className="hover:opacity-60 cursor-pointer">Главная</div>
                <div className="hover:opacity-60 cursor-pointer">Категории</div>
                <div className="hover:opacity-60 cursor-pointer">Архив</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Категории</h4>
              <div className="space-y-2 text-sm">
                <div className="hover:opacity-60 cursor-pointer">Дизайн</div>
                <div className="hover:opacity-60 cursor-pointer">Типографика</div>
                <div className="hover:opacity-60 cursor-pointer">Архитектура</div>
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
}
