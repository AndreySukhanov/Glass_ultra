'use client'

import { useState, useEffect } from 'react'
import { Save, User, Briefcase, Target, Heart } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PersonalizePage() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    goals: '',
    interests: '',
    workStyle: '',
    preferredTone: 'professional',
    language: 'ru',
  })
  const [loading, setLoading] = useState(true)

  // Load existing personalization data on mount
  useEffect(() => {
    const loadPersonalization = async () => {
      try {
        const response = await fetch('/api/personalization')
        const result = await response.json()

        if (result.success && result.data) {
          setFormData({
            name: result.data.name || '',
            role: result.data.role || '',
            company: result.data.company || '',
            goals: result.data.goals || '',
            interests: result.data.interests || '',
            workStyle: result.data.work_style || '',
            preferredTone: result.data.preferred_tone || 'professional',
            language: result.data.language || 'ru',
          })
        }
      } catch (error) {
        console.error('Failed to load personalization:', error)
        toast.error('Не удалось загрузить настройки персонализации')
      } finally {
        setLoading(false)
      }
    }

    loadPersonalization()
  }, [])

  const handleSave = async () => {
    try {
      const response = await fetch('/api/personalization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          company: formData.company,
          goals: formData.goals,
          interests: formData.interests,
          work_style: formData.workStyle,
          preferred_tone: formData.preferredTone,
          language: formData.language,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Настройки сохранены!')
      } else {
        throw new Error(result.error || 'Failed to save')
      }
    } catch (error) {
      console.error('Error saving personalization:', error)
      toast.error('Ошибка при сохранении настроек')
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Персонализация</h2>
        <p className="mt-2 text-gray-600">
          Настройте Glass Ultra под себя для более персонализированного опыта
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="space-y-6">
          {/* Personal Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-600" />
              Личная информация
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Имя
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Введите ваше имя"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Язык
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-primary-600" />
              Профессиональная информация
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Должность
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  placeholder="Например: Разработчик"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Компания
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Название компании"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Goals & Interests */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary-600" />
              Цели и интересы
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цели
                </label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => handleChange('goals', e.target.value)}
                  placeholder="Опишите ваши цели и задачи..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Интересы
                </label>
                <textarea
                  value={formData.interests}
                  onChange={(e) => handleChange('interests', e.target.value)}
                  placeholder="Ваши профессиональные интересы..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Work Style Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-primary-600" />
              Предпочтения
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Стиль работы
                </label>
                <textarea
                  value={formData.workStyle}
                  onChange={(e) => handleChange('workStyle', e.target.value)}
                  placeholder="Опишите ваш стиль работы..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Предпочитаемый тон общения AI
                </label>
                <select
                  value={formData.preferredTone}
                  onChange={(e) => handleChange('preferredTone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="professional">Профессиональный</option>
                  <option value="casual">Неформальный</option>
                  <option value="friendly">Дружелюбный</option>
                  <option value="concise">Лаконичный</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <Save className="w-5 h-5" />
              <span>Сохранить настройки</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
