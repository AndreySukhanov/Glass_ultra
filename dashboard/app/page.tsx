'use client'

import { useState } from 'react'
import { Settings, Users, FileText, Home } from 'lucide-react'
import PersonalizePage from '@/components/PersonalizePage'
import MeetingNotesPage from '@/components/MeetingNotesPage'
import SettingsPage from '@/components/SettingsPage'
import DashboardHome from '@/components/DashboardHome'

type Tab = 'home' | 'personalize' | 'meetings' | 'settings'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('home')

  const tabs = [
    { id: 'home' as Tab, name: 'Главная', icon: Home },
    { id: 'personalize' as Tab, name: 'Персонализация', icon: Users },
    { id: 'meetings' as Tab, name: 'Заметки встреч', icon: FileText },
    { id: 'settings' as Tab, name: 'Настройки', icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome />
      case 'personalize':
        return <PersonalizePage />
      case 'meetings':
        return <MeetingNotesPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <DashboardHome />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Glass Ultra</h1>
          <p className="text-sm text-gray-500 mt-1">Панель управления</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                  transition-colors duration-150 ease-in-out
                  ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-500'}`} />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Glass Ultra v1.0.0
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
