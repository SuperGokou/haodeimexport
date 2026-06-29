import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Huzhou Haode Console',
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
}

export default function ConsoleLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
