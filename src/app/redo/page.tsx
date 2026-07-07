'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  photos: string[];
  linkVk?: string;
  linkTelegram?: string;
  linkAvito?: string;
  linkKopeyka?: string;
}

interface AdminSettings {
  defaultVk?: string;
  defaultTelegram?: string;
}

export default function RedoPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({});

  // Форма
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('одежда');
  const [description, setDescription] = useState('');
  const [photoLinks, setPhotoLinks] = useState<string[]>(['']);
  const [linkVk, setLinkVk] = useState('');
  const [linkTelegram, setLinkTelegram] = useState('');
  const [linkAvito, setLinkAvito] = useState('');
  const [linkKopeyka, setLinkKopeyka] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/');
      return;
    }

    const userData = JSON.parse(savedUser);
    if (!userData.isAdmin) {
      router.push('/');
      return;
    }

    setUser(userData);
    fetchAdminSettings();
    fetchProducts();
  }, []);

  const fetchAdminSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      setAdminSettings(data.settings || {});
      
      // Устанавливаем дефолтные значения
      if (data.settings?.defaultVk) setLinkVk(data.settings.defaultVk);
      if (data.settings?.defaultTelegram) setLinkTelegram(data.settings.defaultTelegram);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddPhotoLink = () => {
    setPhotoLinks([...photoLinks, '']);
  };

  const handleRemovePhotoLink = (index: number) => {
    setPhotoLinks(photoLinks.filter((_, i) => i !== index));
  };

  const handlePhotoLinkChange = (index: number, value: string) => {
    const newLinks = [...photoLinks];
    newLinks[index] = value;
    setPhotoLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const photos = photoLinks.filter(link => link.trim() !== '');

      const productData = {
        title,
        price,
        category,
        description,
        photos,
        linkVk: linkVk || undefined,
        linkTelegram: linkTelegram || undefined,
        linkAvito: linkAvito || undefined,
        linkKopeyka: linkKopeyka || undefined,
      };

      let response;
      if (editingProductId) {
        response = await fetch(`/api/products/${editingProductId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      } else {
        response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при сохранении');
      }

      // Сохраняем дефолтные настройки
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defaultVk: linkVk,
          defaultTelegram: linkTelegram,
        }),
      });

      setMessage(editingProductId ? 'Товар успешно обновлён!' : 'Товар успешно добавлен!');
      
      // Очищаем форму
      resetForm();
      fetchProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setPrice('');
    setCategory('одежда');
    setDescription('');
    setPhotoLinks(['']);
    setLinkAvito('');
    setLinkKopeyka('');
    setEditingProductId(null);
    
    // Восстанавливаем дефолтные значения
    setLinkVk(adminSettings.defaultVk || '');
    setLinkTelegram(adminSettings.defaultTelegram || '');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setTitle(product.title);
    setPrice(product.price.toString());
    setCategory(product.category);
    setDescription(product.description);
    setPhotoLinks(product.photos.length > 0 ? product.photos : ['']);
    setLinkVk(product.linkVk || adminSettings.defaultVk || '');
    setLinkTelegram(product.linkTelegram || adminSettings.defaultTelegram || '');
    setLinkAvito(product.linkAvito || '');
    setLinkKopeyka(product.linkKopeyka || '');

    // Прокручиваем к форме
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении');
      }

      setMessage('Товар успешно удалён!');
      fetchProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Произошла ошибка');
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            {editingProductId ? 'Редактирование товара' : 'Добавление товара'}
          </h1>
          <button
            onClick={() => router.push('/')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
          >
            Назад к каталогу
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Форма */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className={`p-4 rounded-lg ${message.includes('успешно') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Название товара *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Например: Синяя куртка Nike"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Цена (₽) *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Категория *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="одежда">Одежда</option>
                  <option value="техника">Техника</option>
                  <option value="предметы">Предметы</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Описание *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
                placeholder="Подробное описание товара..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Фотографии (до 10 шт.)
              </label>
              <div className="space-y-2">
                {photoLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => handlePhotoLinkChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="https://drive.google.com/..."
                    />
                    {photoLinks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePhotoLink(index)}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                {photoLinks.length < 10 && (
                  <button
                    type="button"
                    onClick={handleAddPhotoLink}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                  >
                    + Добавить ещё фото
                  </button>
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ссылки для связи</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ВКонтакте (дефолтная)
                  </label>
                  <input
                    type="url"
                    value={linkVk}
                    onChange={(e) => setLinkVk(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="https://vk.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telegram (дефолтный)
                  </label>
                  <input
                    type="url"
                    value={linkTelegram}
                    onChange={(e) => setLinkTelegram(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="https://t.me/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Avito (для этого товара)
                  </label>
                  <input
                    type="url"
                    value={linkAvito}
                    onChange={(e) => setLinkAvito(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="https://www.avito.ru/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Копейка (для этого товара)
                  </label>
                  <input
                    type="url"
                    value={linkKopeyka}
                    onChange={(e) => setLinkKopeyka(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Сохранение...' : editingProductId ? 'Сохранить изменения' : 'Добавить товар'}
              </button>
              
              {editingProductId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Отменить
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Список товаров */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Все товары</h2>
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.title}</h3>
                  <p className="text-sm text-gray-600">
                    {product.price.toLocaleString('ru-RU')} ₽ • {product.category}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-medium border border-green-200"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium border border-red-200"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-gray-500 text-center py-8">Товары отсутствуют</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
