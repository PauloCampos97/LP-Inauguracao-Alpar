import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import fs from 'fs'
import path from 'path'

const usersPath = path.join(process.cwd(), 'users.json')
const raw = fs.readFileSync(usersPath, 'utf-8')
const users: { email: string }[] = JSON.parse(raw)
const allowedEmails = users.map((u) => u.email)

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')?.replace('Bearer ', '')

  if (!auth) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
  }

  const decoded = Buffer.from(auth, 'base64').toString('utf-8')
  const email = decoded.split(':')[0]

  if (!allowedEmails.includes(email)) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
  }

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(leads)
}
