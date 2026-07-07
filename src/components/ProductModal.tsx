'use client';

import { useState } from 'react';

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

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const photos = product.photos && product.photos.length > 0 
    ? product.photos 
    : ['https://via.placeholder.com/600x400?text=Нет+фото'];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок с кнопкой закрытия */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-900">{product.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Контент */}
        <div className="p-6 flex flex-col md:flex-row gap-6">
          {/* Галерея фото */}
          <div className="md:w-1/2">
            <div className="relative bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={photos[currentPhotoIndex]}
                alt={`${product.title} - фото ${currentPhotoIndex + 1}`}
                className="w-full h-96 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Нет+фото';
                }}
              />

              {/* Навигация по фото */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentPhotoIndex + 1} / {photos.length}
                  </div>
                </>
              )}
            </div>

            {/* Миниатюры */}
            {photos.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Миниатюра ${index + 1}`}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`w-20 h-20 object-cover rounded cursor-pointer border-2 transition ${
                      index === currentPhotoIndex
                        ? 'border-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=Нет';
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Информация о товаре */}
          <div className="md:w-1/2 space-y-4">
            <div>
              <p className="text-sm text-gray-500 uppercase">{product.category}</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {product.price.toLocaleString('ru-RU')} ₽
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Описание</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
            </div>

            {/* Кнопки контактов */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Связаться с продавцом</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.linkTelegram && (
                  <a
                    href={product.linkTelegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.001.321.023.465.14.121.099.155.232.171.325.016.093.037.305.021.469z"/>
                    </svg>
                    Telegram
                  </a>
                )}

                {product.linkVk && (
                  <a
                    href={product.linkVk}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-700 text-white px-4 py-3 rounded-lg hover:bg-green-800 transition font-medium"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.066 13.216c.557.548 1.143 1.075 1.594 1.703.2.279.388.568.513.899.176.467.008.98-.408 1.008h-2.667c-.693.056-1.252-.217-1.735-.698-.387-.387-.745-.799-1.117-1.198-.157-.168-.321-.323-.516-.447-.372-.237-.697-.161-.914.223-.222.39-.271.821-.292 1.253-.033.688-.259.869-.949.9-1.484.066-2.891-.162-4.17-.97-1.128-.712-1.999-1.676-2.758-2.764-1.474-2.117-2.602-4.446-3.607-6.846-.213-.509-.059-.783.489-.794.916-.017 1.833-.015 2.75-.002.377.007.627.227.779.575.481 1.102.998 2.176 1.642 3.188.171.27.345.541.593.733.276.214.486.146.623-.174.092-.214.138-.444.164-.675.088-.831.099-1.663-.01-2.493-.064-.487-.307-.804-.791-.896-.247-.047-.211-.139-.091-.279.192-.224.372-.363.732-.363h2.704c.427.083.522.273.581.703l.002 2.997c-.005.168.084.668.387.779.243.084.404-.119.55-.269.659-.674 1.128-1.478 1.554-2.312.186-.366.346-.748.503-1.128.118-.286.302-.427.627-.419l2.952.004c.088 0 .177.001.263.019.481.1.613.353.467.818-.205.653-.596 1.199-1.001 1.738-.432.575-.894 1.13-1.318 1.711-.392.536-.362.806.115 1.268z"/>
                    </svg>
                    ВКонтакте
                  </a>
                )}

                {product.linkAvito && (
                  <a
                    href={product.linkAvito}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition font-medium"
                  >
                    Avito
                  </a>
                )}

                {product.linkKopeyka && (
                  <a
                    href={product.linkKopeyka}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition font-medium"
                  >
                    Копейка
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
