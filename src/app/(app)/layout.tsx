'use client'
import Navbar from '@/components/Navbar/navbar'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="bg-gray-50">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
