import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Alpar Contabilidade',
  description: 'Evento exclusivo de inauguração da Alpar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="upfly">
      <body className="text-foreground antialiased" suppressHydrationWarning>
          <link rel="icon" href="alpar-logo-SVG.svg" type="image/svg+xml" />
          <link rel="alternate icon" href="/favicon.ico" />
        {children}
      </body>
    </html>
  )
}