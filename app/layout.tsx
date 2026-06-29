import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '湖州好德进出口有限公司 | Huzhou Haode Home Textile Fabrics',
  description:
    '湖州好德进出口有限公司外贸官网，提供沙发布、窗帘布、提花、雪尼尔、仿麻及家纺装饰面料。',
  keywords: [
    '湖州好德',
    'Huzhou Haode',
    'textile export',
    'upholstery fabric',
    'curtain fabric',
    'home textiles'
  ],
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png' }],
    apple: [{ url: '/apple-icon.png', type: 'image/png' }]
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
