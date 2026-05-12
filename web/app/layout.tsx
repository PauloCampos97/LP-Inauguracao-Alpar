import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Alpar Inauguração',
  description: 'Evento exclusivo de inauguração da Alpar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#050816] text-white antialiased">
        {children}
      </body>
    </html>
  )
}