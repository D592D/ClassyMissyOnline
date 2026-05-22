import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Classy Missy Collection | Fashion & Accessories — Georgetown, Guyana',
  description: 'Shop premium fashion, handbags, jewellery, and accessories from Classy Missy Collection. Fast MMG checkout. Based in Georgetown, Guyana.',
  keywords: ['Classy Missy', 'fashion Guyana', 'Georgetown clothing', 'MMG payment', 'women fashion GYD'],
  openGraph: {
    title: 'Classy Missy Collection',
    description: 'Premium fashion & accessories. Shop now with MMG.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://classymissy.gy',
    siteName: 'Classy Missy Collection',
    locale: 'en_GY',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Classy Missy Collection',
    description: 'Premium fashion & accessories. Shop now with MMG.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-pink-50 via-gray-50 to-purple-50 min-h-screen text-gray-900`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}