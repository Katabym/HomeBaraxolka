'use client';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  photos: string[];
}

interface ProductCardProps {
  product: Product;
  isViewed: boolean;
  onClick: () => void;
}

export default function ProductCard({ product, isViewed, onClick }: ProductCardProps) {
  const mainPhoto = product.photos && product.photos.length > 0 
    ? product.photos[0] 
    : 'https://via.placeholder.com/300x200?text=Нет+фото';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:border-green-500 hover:shadow-md transition relative"
    >
      {/* Метка просмотрено */}
      {isViewed && (
        <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2.5 py-1 rounded-lg font-medium z-10">
          Просмотрено
        </div>
      )}

      {/* Изображение */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={mainPhoto}
          alt={product.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Нет+фото';
          }}
        />
      </div>

      {/* Информация */}
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-2xl font-bold text-green-600">
          {product.price.toLocaleString('ru-RU')} ₽
        </p>
        <p className="text-sm text-gray-500 mt-1 capitalize">
          {product.category}
        </p>
      </div>
    </div>
  );
}
