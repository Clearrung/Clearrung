import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clearrung — climb out of debt',
  description: 'See exactly when you\'ll be debt-free, and how to get there faster.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
