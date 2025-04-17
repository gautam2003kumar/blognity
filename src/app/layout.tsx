import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/context/AuthProvider'
import { Toaster } from '@/components/ui/sonner'
import Navbar from '@/components/Navbar/navbar'

export const metadata: Metadata = {
  title: 'Blognity',
  description: 'Explore amazing blogs!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className="bg-gray-50">
          <Navbar />
          <main>{children}</main>
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  )
}
