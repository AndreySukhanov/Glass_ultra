'use client'

import { Activity, Mic, MessageSquare, Zap } from 'lucide-react'

export default function DashboardHome() {
  const stats = [
    {
      name: 'Всего сессий',
      value: '0',
      icon: Activity,
      color: 'bg-blue-500',
    },
    {
      name: 'Транскрибировано',
      value: '0 мин',
      icon: Mic,
      color: 'bg-green-500',
    },
    {
      name: 'AI запросов',
      value: '0',
      icon: MessageSquare,
      color: 'bg-purple-500',
    },
    {
      name: 'Заметки встреч',
      value: '0',
      icon: Zap,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Добро пожаловать!</h2>
        <p className="mt-2 text-gray-600">
          Обзор вашей активности в Glass Ultra
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Последняя активность
        </h3>
        <div className="text-center py-12 text-gray-500">
          <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>Пока нет активности</p>
          <p className="text-sm mt-2">
            Начните использовать Glass Ultra для отслеживания статистики
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Быстрый старт</h3>
          <p className="text-blue-100 text-sm mb-4">
            Настройте персонализацию для лучшего опыта
          </p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
            Перейти к настройкам
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Заметки</h3>
          <p className="text-purple-100 text-sm mb-4">
            Просмотрите и управляйте заметками встреч
          </p>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
            Открыть заметки
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Документация</h3>
          <p className="text-green-100 text-sm mb-4">
            Узнайте больше о возможностях Glass Ultra
          </p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
            Читать документацию
          </button>
        </div>
      </div>
    </div>
  )
}
