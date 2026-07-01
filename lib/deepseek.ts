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

function cleanErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown error'
  return message.replace(/\s+/g, ' ').slice(0, 260)
}

export function formatDeepSeekAdminError(error: unknown) {
  const message = cleanErrorMessage(error)

  if (message.includes('DEEPSEEK_API_KEY')) {
    return 'DeepSeek 自动翻译失败：服务器没有配置 DEEPSEEK_API_KEY。'
  }

  if (message.includes('401') || message.includes('403')) {
    return 'DeepSeek 自动翻译失败：API Key 无效、余额不足或没有模型权限。'
  }

  if (message.includes('429')) {
    return 'DeepSeek 自动翻译失败：请求过于频繁，请稍后再试。'
  }

  if (message.includes('No JSON object') || message.includes('Unexpected token')) {
    return 'DeepSeek 自动翻译失败：机器人返回的内容不是有效 JSON，请再保存一次。'
  }

  return `DeepSeek 自动翻译失败：${message}`
}

function requireChineseSource(product: Product) {
  const source = product.translations.zh
  if (!source.name.trim()) {
    throw new Error('请先填写中文产品名称，再使用 DeepSeek 自动翻译。')
  }
  if (!source.tagline.trim() && !source.description.trim()) {
    throw new Error('请先填写中文短标语或产品描述，再使用 DeepSeek 自动翻译。')
  }
  return source
}

export async function translateProductToEnglish(product: Product): Promise<ProductTranslation> {
  const source = requireChineseSource(product)
  const previous = product.translations.en

  const content = await callDeepSeek(
    [
      {
        role: 'system',
        content:
          'You are a professional textile export copywriter. Translate Chinese product data to polished, concise English for an international B2B textile website. Return only valid JSON. Do not use Markdown.'
      },
      {
        role: 'user',
        content: JSON.stringify({
          instruction:
            'Translate to English. Preserve technical meaning. Keep specs as an array of {label,value}. Return every field in the required shape.',
          requiredJsonShape: {
            name: 'English product name',
            tagline: 'One concise B2B sales sentence',
            description: 'One practical paragraph for textile buyers',
            applications: ['Application'],
            specs: [{ label: 'Spec label', value: 'Spec value' }],
            seoTitle: 'SEO title',
            seoDescription: 'SEO description'
          },
          product: source
        })
      }
    ],
    0.2
  )

  const translated = extractJson<ProductTranslation>(content)
  const name = translated.name?.trim()
  if (!name) {
    throw new Error('DeepSeek returned JSON without a translated product name')
  }

  return {
    name,
    tagline: translated.tagline?.trim() || previous.tagline,
    description: translated.description?.trim() || previous.description,
    applications: Array.isArray(translated.applications) ? translated.applications : previous.applications,
    specs: Array.isArray(translated.specs) ? translated.specs : previous.specs,
    seoTitle: translated.seoTitle,
    seoDescription: translated.seoDescription,
    translationStatus: 'ai'
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
  const capabilitiesContext = company.capabilityLabels?.[locale] || company.capabilities
  const factsContext = company.facts
    .map((fact) => `${fact.labels?.[locale] || fact.label}: ${fact.value}`)
    .join(', ')
  const knowledgeContext = company.aiKnowledge?.[locale]?.map((item) => `- ${item}`).join('\n') || ''
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
Capabilities: ${capabilitiesContext.join(', ')}
Facts: ${factsContext}
AI customer service knowledge:
${knowledgeContext}
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
