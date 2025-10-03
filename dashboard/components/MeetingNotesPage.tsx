'use client'

import { useState } from 'react'
import { Search, Calendar, Download, Eye, Trash2, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

interface MeetingNote {
  id: string
  title: string
  date: string
  duration: string
  summary: string
  participants: string[]
  actionItems: string[]
}

export default function MeetingNotesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNote, setSelectedNote] = useState<MeetingNote | null>(null)

  // Mock data - заменить на реальные данные из БД
  const [notes] = useState<MeetingNote[]>([
    {
      id: '1',
      title: 'Встреча команды разработки',
      date: '2025-10-03',
      duration: '45 мин',
      summary: 'Обсудили текущий прогресс по проекту и планы на следующую неделю.',
      participants: ['Иван', 'Мария', 'Петр'],
      actionItems: [
        'Завершить фичу авторизации к пятнице',
        'Провести code review',
        'Обновить документацию',
      ],
    },
  ])

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.summary.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDownload = (note: MeetingNote) => {
    // TODO: Реализовать экспорт заметки
    toast.success(`Загрузка заметки: ${note.title}`)
  }

  const handleDelete = (noteId: string) => {
    // TODO: Реализовать удаление заметки
    toast.success('Заметка удалена')
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Заметки встреч</h2>
        <p className="mt-2 text-gray-600">
          Просматривайте и управляйте заметками ваших встреч
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по заметкам..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">Фильтр по дате</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Все заметки ({filteredNotes.length})
          </h3>

          {filteredNotes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Нет заметок</p>
              <p className="text-sm text-gray-500 mt-2">
                Заметки появятся после ваших встреч с Glass Ultra
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`
                  bg-white rounded-xl shadow-sm border p-6 cursor-pointer
                  transition-all hover:shadow-md
                  ${selectedNote?.id === note.id ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-200'}
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{note.title}</h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {note.duration}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {note.summary}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(note.date).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(note)
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(note.id)
                      }}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Note Detail */}
        <div className="sticky top-8 h-fit">
          {selectedNote ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedNote.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(selectedNote.date).toLocaleDateString('ru-RU')}</span>
                    <span className="mx-2">•</span>
                    <span>{selectedNote.duration}</span>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Eye className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Резюме</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedNote.summary}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Участники</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNote.participants.map((participant, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                      >
                        {participant}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Action Items ({selectedNote.actionItems.length})
                  </h4>
                  <ul className="space-y-2">
                    {selectedNote.actionItems.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <input
                          type="checkbox"
                          className="mt-1 mr-3 rounded text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleDownload(selectedNote)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Экспорт</span>
                  </button>
                  <button
                    onClick={() => handleDelete(selectedNote.id)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Удалить</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Выберите заметку для просмотра</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
