'use client';

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (price: string) => void;
  onMaxPriceChange: (price: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showViewedOnly: boolean;
  onViewedFilterClick: () => void;
}

const categories = [
  { value: 'all', label: 'Все товары' },
  { value: 'одежда', label: 'Одежда' },
  { value: 'техника', label: 'Техника' },
  { value: 'предметы', label: 'Предметы' },
];

export default function Sidebar({
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  searchQuery,
  onSearchChange,
  showViewedOnly,
  onViewedFilterClick,
}: SidebarProps) {
  return (
    <aside className="w-full md:w-64 lg:w-80 bg-white border-r border-gray-200 p-4 md:p-6 space-y-6">
      {/* Поиск */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Поиск
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Название товара..."
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
        />
      </div>

      {/* Категории */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Категории
        </label>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => onCategoryChange(category.value)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition font-medium ${
                selectedCategory === category.value
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Просмотренное */}
      <div>
        <button
          onClick={onViewedFilterClick}
          className={`w-full text-left px-4 py-2.5 rounded-lg transition font-medium ${
            showViewedOnly
              ? 'bg-green-600 text-white'
              : 'bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700'
          }`}
        >
          Просмотренное
        </button>
      </div>

      {/* Фильтр по цене */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Диапазон цены
        </label>
        <div className="space-y-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            placeholder="От"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            placeholder="До"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
          />
        </div>
      </div>
    </aside>
  );
}
