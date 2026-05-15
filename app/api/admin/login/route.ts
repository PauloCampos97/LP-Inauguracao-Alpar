import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const usersPath = path.join(process.cwd(), 'users.json')
const raw = fs.readFileSync(usersPath, 'utf-8')
const users: { email: string; password: string; name: string }[] = JSON.parse(raw)

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ message: 'Email e senha obrigatórios.' }, { status: 400 })
  }

  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    return NextResponse.json({ message: 'Credenciais inválidas.' }, { status: 401 })
  }

  const token = Buffer.from(`${user.email}:${user.name}:${Date.now()}`).toString('base64')

  return NextResponse.json({
    token,
    user: { email: user.email, name: user.name },
  })
}
