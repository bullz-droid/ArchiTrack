import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ArchiTrack | Studio Management',
  description: 'Interactive architectural studio management ecosystem',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased text-foreground bg-background">
        {children}
      </body>
    </html>
  )
}
