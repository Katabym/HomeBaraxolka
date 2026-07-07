'use client';

import Link from 'next/link';

interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Header({ user, onLoginClick, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          {/* Логотип */}
          <Link href="/" className="text-2xl md:text-3xl font-semibold text-gray-800 hover:text-green-600 transition">
            Домашняя барахолка
          </Link>

          {/* Социальные сети */}
          <div className="flex items-center gap-2 md:gap-4">
            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
              title="Telegram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.001.321.023.465.14.121.099.155.232.171.325.016.093.037.305.021.469z"/>
              </svg>
            </a>
            <a
              href="https://vk.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
              title="ВКонтакте"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.066 13.216c.557.548 1.143 1.075 1.594 1.703.2.279.388.568.513.899.176.467.008.98-.408 1.008h-2.667c-.693.056-1.252-.217-1.735-.698-.387-.387-.745-.799-1.117-1.198-.157-.168-.321-.323-.516-.447-.372-.237-.697-.161-.914.223-.222.39-.271.821-.292 1.253-.033.688-.259.869-.949.9-1.484.066-2.891-.162-4.17-.97-1.128-.712-1.999-1.676-2.758-2.764-1.474-2.117-2.602-4.446-3.607-6.846-.213-.509-.059-.783.489-.794.916-.017 1.833-.015 2.75-.002.377.007.627.227.779.575.481 1.102.998 2.176 1.642 3.188.171.27.345.541.593.733.276.214.486.146.623-.174.092-.214.138-.444.164-.675.088-.831.099-1.663-.01-2.493-.064-.487-.307-.804-.791-.896-.247-.047-.211-.139-.091-.279.192-.224.372-.363.732-.363h2.704c.427.083.522.273.581.703l.002 2.997c-.005.168.084.668.387.779.243.084.404-.119.55-.269.659-.674 1.128-1.478 1.554-2.312.186-.366.346-.748.503-1.128.118-.286.302-.427.627-.419l2.952.004c.088 0 .177.001.263.019.481.1.613.353.467.818-.205.653-.596 1.199-1.001 1.738-.432.575-.894 1.13-1.318 1.711-.392.536-.362.806.115 1.268z"/>
              </svg>
            </a>
            <a
              href="https://www.avito.ru/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition text-sm font-medium"
              title="Avito"
            >
              Avito
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition text-sm font-medium"
              title="Копейка"
            >
              Копейка
            </a>

            {/* Кнопка авторизации / профиля */}
            <div className="ml-2 md:ml-4 flex items-center gap-2">
              {user ? (
                <>
                  <span className="hidden md:inline text-sm text-gray-700 font-medium">
                    {user.username}
                  </span>
                  <button
                    onClick={onLogout}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                    title="Выйти"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                  title="Войти"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              )}

              {/* Админская кнопка добавления */}
              {user?.isAdmin && (
                <Link
                  href="/redo"
                  className="p-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
                  title="Добавить товар"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
