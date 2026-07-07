'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import AuthModal from '@/components/AuthModal';

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
  viewedAt?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [viewedProducts, setViewedProducts] = useState<Set<number>>(new Set());
  
  // Фильтры
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showViewedOnly, setShowViewedOnly] = useState(false);

  // Загрузка пользователя из localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Загрузка товаров
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, searchQuery]);

  // Загрузка просмотренных товаров
  useEffect(() => {
    if (user) {
      fetchViewedProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchViewedProducts = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/view-history?userId=${user.id}`);
      const data = await response.json();
      
      if (showViewedOnly) {
        setFilteredProducts(data.products || []);
      }
      
      const viewedIds = new Set<number>(data.products?.map((p: Product) => p.id) || []);
      setViewedProducts(viewedIds);
    } catch (error) {
      console.error('Error fetching viewed products:', error);
    }
  };

  useEffect(() => {
    if (showViewedOnly && user) {
      fetchViewedProducts();
    } else {
      setFilteredProducts(products);
    }
  }, [showViewedOnly, products, user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setViewedProducts(new Set());
  };

  const handleProductClick = async (product: Product) => {
    setSelectedProduct(product);
    
    // Добавляем в историю просмотров
    if (user && !viewedProducts.has(product.id)) {
      try {
        await fetch('/api/view-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, productId: product.id }),
        });
        setViewedProducts(prev => new Set([...prev, product.id]));
      } catch (error) {
        console.error('Error adding view history:', error);
      }
    }
  };

  const handleViewedFilterClick = () => {
    if (!user) {
      setShowAuthModal(true);
      setAuthMode('login');
    } else {
      setShowViewedOnly(!showViewedOnly);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user}
        onLoginClick={() => {
          setAuthMode('login');
          setShowAuthModal(true);
        }}
        onLogout={handleLogout}
      />

      <div className="flex">
        <Sidebar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showViewedOnly={showViewedOnly}
          onViewedFilterClick={handleViewedFilterClick}
        />

        <main className="flex-1 p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isViewed={viewedProducts.has(product.id)}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Товары не найдены</p>
            </div>
          )}
        </main>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
        />
      )}
    </div>
  );
}
