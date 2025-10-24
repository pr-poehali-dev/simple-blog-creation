import { useState, useEffect } from 'react';
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
  excerpt: string;
  content: string[];
  date: string;
  category: string;
  tags: string[];
  readTime: string;
  author: string;
  comments: Comment[];
}

export default function Article() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`https://functions.poehali.dev/0cc3e868-c12d-45a9-a98f-d20d44d179da?id=${id}`);
        const data = await response.json();
        setArticle(data);
      } catch (error) {
        console.error('Error fetching article:', error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && commentAuthor.trim() && id) {
      try {
        const response = await fetch('https://functions.poehali.dev/acbc0236-6715-4480-aa55-e8d091ef1506', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            article_id: parseInt(id),
            author: commentAuthor,
            text: commentText
          })
        });
        
        if (response.ok) {
          const newComment = await response.json();
          setArticle(prev => prev ? { ...prev, comments: [...prev.comments, newComment] } : null);
          setCommentText('');
          setCommentAuthor('');
        }
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-xl text-gray-600">Загрузка...</p>
      </div>
    );
  }

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
          <h2 className="text-3xl font-bold mb-8">Комментарии ({article.comments.length})</h2>

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
            {article.comments.map(comment => (
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