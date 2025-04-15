'use client'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="bg-gray-50">
      <main>{children}</main>
    </div>
  )
}
