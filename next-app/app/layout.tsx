import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ArchiTrack Next',
  description: 'ArchiTrack mobile visibility application',
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
