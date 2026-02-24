import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'

const apiKey = process.env.GEMINI_API_KEY
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null

export async function POST(request: Request) {
  if (!ai) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY가 설정되지 않았습니다.' },
      { status: 500 }
    )
  }

  try {
    const { content } = await request.json()

    if (typeof content !== 'string') {
      return NextResponse.json(
        { error: 'content는 문자열이어야 합니다.' },
        { status: 400 }
      )
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: `다음 메모 내용을 3줄 이내로 핵심만 요약해주세요:\n\n${content}`,
    })

    const summary = response.text ?? ''

    return NextResponse.json({ summary })
  } catch (err) {
    const message = err instanceof Error ? err.message : '요약 중 오류가 발생했습니다.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
