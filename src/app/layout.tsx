import React, { ReactNode } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { MainNavigationMenu } from '@/components/main-navigation-menu'
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

interface RootLayoutProps {
  children: ReactNode
}

export const metadata = {
  title: 'My App',
  description: 'Example Next.js + TypeScript layout',
}

export default function RootLayout({
  children,
}: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <body className='bg-gray-50 text-gray-900 antialiased font-sans'>
        <div className='flex justify-center'>
          <MainNavigationMenu />
        </div>
        {children}
      </body>
    </html>
  )
}
