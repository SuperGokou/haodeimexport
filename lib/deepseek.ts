import type { CompanyInfo, Locale, Product, ProductTranslation } from './types'

const defaultBaseUrl = 'https://api.deepseek.com'

type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

function deepseekConfig() {
  return {
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseUrl: (process.env.DEEPSEEK_API_BASE_URL || defaultBaseUrl).replace(/\/$/, ''),
    model: process.env.DEEPSEEK_MODEL || process.env.DEEPSEEK_CHAT_MODEL || 'deepseek-chat'
  }
}

async function callDeepSeek(messages: ChatMessage[], temperature = 0.3) {
  const { apiKey, baseUrl, model } = deepseekConfig()
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not configured')
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature
    })
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`DeepSeek request failed: ${response.status} ${text}`)
  }

  const json = await response.json()
  const content = json?.choices?.[0]?.message?.content
  if (typeof content !== 'string') {
    throw new Error('DeepSeek returned an empty response')
  }
  return content
}

function extractJson<T>(content: string): T {
  const fenced = content.match(/```json\s*([\s\S]*?)```/i)
  const raw = fenced?.[1] || content
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON object in DeepSeek response')
  return JSON.parse(raw.slice(start, end + 1)) as T
}

export async function translateProductToEnglish(product: Product): Promise<ProductTranslation> {
  const source = product.translations.zh
  const previous = product.translations.en

  try {
    const content = await callDeepSeek(
      [
        {
          role: 'system',
          content:
            'You are a professional textile export copywriter. Translate Chinese product data to polished, concise English for an international B2B textile website. Return only valid JSON.'
        },
        {
          role: 'user',
          content: JSON.stringify({
            instruction:
              'Translate to English. Preserve technical meaning. Keep specs as an array of {label,value}.',
            product: source
          })
        }
      ],
      0.2
    )

    const translated = extractJson<ProductTranslation>(content)
    return {
      name: translated.name || previous.name,
      tagline: translated.tagline || previous.tagline,
      description: translated.description || previous.description,
      applications: Array.isArray(translated.applications) ? translated.applications : previous.applications,
      specs: Array.isArray(translated.specs) ? translated.specs : previous.specs,
      seoTitle: translated.seoTitle,
      seoDescription: translated.seoDescription,
      translationStatus: 'ai'
    }
  } catch {
    return {
      ...previous,
      translationStatus: previous.translationStatus === 'manual' ? 'manual' : 'failed'
    }
  }
}

export async function answerCustomerQuestion({
  locale,
  message,
  products,
  company
}: {
  locale: Locale
  message: string
  products: Product[]
  company: CompanyInfo
}) {
  const language = locale === 'zh' ? 'Chinese' : 'English'
  const companyText = company.translations[locale]
  const productContext = products
    .slice(0, 8)
    .map((product) => {
      const text = product.translations[locale]
      return `${text.name}: ${text.tagline}; ${text.specs.map((spec) => `${spec.label} ${spec.value}`).join(', ')}`
    })
    .join('\n')

  try {
    const answer = await callDeepSeek(
      [
        {
          role: 'system',
          content: `You are the AI customer service assistant for ${companyText.name}. Reply in ${language}. Be concise, practical, and sales-support oriented. Use plain text only, with no Markdown and no emoji. Use only the company and product context provided. If information is missing, ask for the buyer's target usage, composition, width, color, quantity, and destination. Do not invent certifications or prices.`
        },
        {
          role: 'user',
          content: `Company: ${companyText.intro}
Contact: ${company.email}, ${company.phone}
Markets: ${company.markets.join(', ')}
Capabilities: ${company.capabilities.join(', ')}
Products:
${productContext}

Customer question:
${message}`
        }
      ],
      0.4
    )
    return toPlainText(answer)
  } catch {
    return locale === 'zh'
      ? '我已收到您的问题。请补充目标用途、成分、门幅、颜色、数量和目的港，我们会尽快为您匹配面料并准备样品方案。'
      : 'Thanks for your question. Please share the target usage, composition, width, color, quantity, and destination port. Our team will match suitable fabrics and prepare sample options.'
  }
}

function toPlainText(value: string) {
  return value
    .replace(/\*\*/g, '')
    .replace(/[`#>]/g, '')
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
    .trim()
}
