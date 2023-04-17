import './globals.css'

export const metadata = {
  title: 'Simple Books API using Next.js 13 and Neon',
  description: '',
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
