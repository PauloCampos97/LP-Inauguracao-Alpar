import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { prisma } from '@/app/lib/prisma'
import fs from 'fs'
import path from 'path'

const credentialsPath = path.join(process.cwd(), 'oauth-google.json')
let oauth: { client_id: string; client_secret: string } | null = null

try {
  const raw = fs.readFileSync(credentialsPath, 'utf-8')
  const parsed = JSON.parse(raw)
  oauth = parsed.web
} catch {
  // oauth-google.json não encontrado
}

export async function POST(req: Request) {
  const data = await req.json()

  const {
    nome,
    email,
    telefone,
    cnpj,
    faturamento,
    colaboradores,
    horario,
  } = data

  if (!nome || !email || !telefone || !cnpj || !faturamento || !colaboradores || !horario) {
    return NextResponse.json(
      { message: 'Preencha todos os campos.' },
      { status: 400 }
    )
  }

  const existingLead = await prisma.lead.findFirst({
    where: { email },
  })

  if (existingLead) {
    return NextResponse.json(
      { message: 'Você já possui uma reserva para o evento.' },
      { status: 409 }
    )
  }

  const vagasPreenchidas = await prisma.lead.count({
    where: { horario },
  })

  if (vagasPreenchidas >= 15) {
    return NextResponse.json(
      { message: 'Esse horário já atingiu o limite de 15 cadastros.' },
      { status: 400 }
    )
  }

  await prisma.lead.create({
    data: {
      nome,
      email,
      telefone,
      cnpj,
      faturamento,
      colaboradores,
      horario,
    },
  })

  const auth =
    oauth && process.env.SMTP_REFRESH_TOKEN
      ? {
          type: 'OAuth2' as const,
          user: process.env.SMTP_USER,
          clientId: oauth.client_id,
          clientSecret: oauth.client_secret,
          refreshToken: process.env.SMTP_REFRESH_TOKEN,
        }
      : {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth,
    connectionTimeout: 10000,
  })

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Confirmação de cadastro - Inauguração Alpar',
      html: `
        <h2>Cadastro confirmado!</h2>
        <p>Olá, ${nome}.</p>
        <p>Seu cadastro foi confirmado para o horário:</p>
        <strong>${horario}</strong>
        <p>Esperamos você na inauguração!</p>
      `,
    })
  } catch (error) {
    console.error('Erro ao enviar e-mail de confirmação:', error)
  }

  return NextResponse.json({ message: 'Cadastro realizado com sucesso!' })
}
