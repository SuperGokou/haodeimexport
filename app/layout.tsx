import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Huzhou Haode Import and Export Co.,Ltd. | Home Textile Fabrics',
  description:
    'Bilingual textile export website for upholstery, curtain, jacquard, chenille, and linen-look fabrics.',
  keywords: [
    'Huzhou Haode',
    'textile export',
    'upholstery fabric',
    'curtain fabric',
    'home textiles'
  ]
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
