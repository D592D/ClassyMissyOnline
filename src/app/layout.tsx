import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Classy Missy | Collection Storefront',
  description: 'Mobile-first e-commerce storefront for Classy Missy Collection.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-gradient-to-br from-pink-50 via-gray-50 to-purple-50 min-h-screen text-gray-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}