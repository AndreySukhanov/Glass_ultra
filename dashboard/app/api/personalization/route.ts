import { NextRequest, NextResponse } from 'next/server'

// GET: Получить данные персонализации
export async function GET() {
  try {
    // Вызываем Electron IPC через window API (будет доступно через fetch)
    const response = await fetch('http://localhost:3002/api/electron/personalization')
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('[API] Error fetching personalization:', error)
    return NextResponse.json(
      { error: 'Failed to fetch personalization data' },
      { status: 500 }
    )
  }
}

// POST: Сохранить данные персонализации
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Валидация данных
    const requiredFields = ['name', 'language', 'preferredTone']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Отправляем данные в Electron
    const response = await fetch('http://localhost:3002/api/electron/personalization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const result = await response.json()

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data })
    } else {
      throw new Error(result.error || 'Failed to save')
    }
  } catch (error) {
    console.error('[API] Error saving personalization:', error)
    return NextResponse.json(
      { error: 'Failed to save personalization data' },
      { status: 500 }
    )
  }
}
