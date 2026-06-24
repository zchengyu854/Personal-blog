import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientProviders from '../components/ClientProviders'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '个人网站 - 全栈开发者',
  description: '欢迎来到我的个人网站，这里展示我的项目作品集、技术博客和联系方式',
  keywords: ['前端开发', '全栈开发', 'React', 'Next.js', 'TypeScript'],
  authors: [{ name: '个人开发者' }],
  creator: '个人开发者',
  publisher: '个人开发者',
  formatDetection: {
    email: true,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://example.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background text-text dark:bg-background-dark dark:text-text-dark transition-colors duration-300`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
