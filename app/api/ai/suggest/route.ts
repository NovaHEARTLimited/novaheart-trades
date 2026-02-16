import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: Request) {
  try {
    const { prompt, sectionName, pageTitle, businessType } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

    const systemContext = `You are a professional copywriter helping a ${businessType || 'trade business'} write website content. 
Current page: ${pageTitle || 'Home'}
Current section: ${sectionName || 'Content'}

Write concise, professional copy suitable for a trade business website. Keep it under 100 words unless asked otherwise. Be specific and action-oriented.`

    const result = await model.generateContent([systemContext, prompt])
    const text = result.response.text()

    return NextResponse.json({ suggestion: text })
  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json({ error: 'Failed to generate suggestion' }, { status: 500 })
  }
}
