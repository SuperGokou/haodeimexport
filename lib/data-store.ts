import { promises as fs } from 'fs'
import path from 'path'
import type { CompanyInfo, Product, SiteData } from './types'

const root = process.cwd()
const productsPath = path.join(root, 'data', 'products.json')
const companyPath = path.join(root, 'data', 'company.json')

type GithubFile = {
  sha?: string
  content?: string
}

function githubConfig() {
  return {
    token: process.env.GITHUB_TOKEN,
    repo: process.env.GITHUB_REPO || 'SuperGokou/haodeimexport',
    branch: process.env.GITHUB_BRANCH || 'main'
  }
}

function shouldUseGithub() {
  const { token, repo } = githubConfig()
  return Boolean(token && repo)
}

async function readLocalJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw) as T
}

async function writeLocalJson(filePath: string, data: unknown) {
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

async function getGithubFile(filePath: string): Promise<GithubFile | null> {
  const { token, repo, branch } = githubConfig()
  if (!token) return null

  const response = await fetch(
    `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      cache: 'no-store'
    }
  )

  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error(`GitHub read failed for ${filePath}: ${response.status}`)
  }

  return (await response.json()) as GithubFile
}

async function readGithubJson<T>(filePath: string): Promise<T | null> {
  const file = await getGithubFile(filePath)
  if (!file?.content) return null
  const raw = Buffer.from(file.content, 'base64').toString('utf8')
  return JSON.parse(raw) as T
}

async function writeGithubJson(filePath: string, data: unknown, message: string) {
  const { token, repo, branch } = githubConfig()
  if (!token) throw new Error('Missing GITHUB_TOKEN')

  const existing = await getGithubFile(filePath)
  const body: Record<string, unknown> = {
    message,
    branch,
    content: Buffer.from(`${JSON.stringify(data, null, 2)}\n`, 'utf8').toString('base64')
  }

  if (existing?.sha) {
    body.sha = existing.sha
  }

  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`GitHub write failed for ${filePath}: ${response.status} ${text}`)
  }
}

export async function getProducts(): Promise<Product[]> {
  if (shouldUseGithub()) {
    const remote = await readGithubJson<Product[]>('data/products.json')
    if (remote) return remote
  }
  return readLocalJson<Product[]>(productsPath)
}

export async function saveProducts(products: Product[]) {
  const sorted = [...products].sort((a, b) => a.updatedAt.localeCompare(b.updatedAt)).reverse()
  if (shouldUseGithub()) {
    await writeGithubJson('data/products.json', sorted, 'Update Haode product data')
    return
  }
  await writeLocalJson(productsPath, sorted)
}

export async function getCompany(): Promise<CompanyInfo> {
  if (shouldUseGithub()) {
    const remote = await readGithubJson<CompanyInfo>('data/company.json')
    if (remote) return remote
  }
  return readLocalJson<CompanyInfo>(companyPath)
}

export async function saveCompany(company: CompanyInfo) {
  if (shouldUseGithub()) {
    await writeGithubJson('data/company.json', company, 'Update Haode company data')
    return
  }
  await writeLocalJson(companyPath, company)
}

export async function getSiteData(): Promise<SiteData> {
  const [products, company] = await Promise.all([getProducts(), getCompany()])
  return { products, company }
}

export function publicProducts(products: Product[]) {
  return products.filter((product) => product.status === 'published')
}
