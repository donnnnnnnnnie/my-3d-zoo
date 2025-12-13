import './globals.css'

export const metadata = {
  title: 'My 3D Zoo',
  description: '3D 동물원',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
