import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import { prisma } from '@/app/lib/prisma'
import { buildConfirmationEmail } from '@/lib/email-template'

const mailFromName = process.env.MAIL_FROM_NAME || 'Alpar'
const EMAIL_FROM = `"${mailFromName}" <comercial@alparcontabilidade.com.br>`

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

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  )
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })

  let accessToken: string
  try {
    const { token } = await oauth2Client.getAccessToken()
    accessToken = token!
  } catch (error) {
    console.error('Erro ao gerar accessToken:', error)
    return NextResponse.json(
      { message: 'Erro de conexão com o servidor. Verifique as configurações de SMTP.' },
      { status: 500 }
    )
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_FROM,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken,
    },
    connectionTimeout: 10000,
  })

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: '✅ Vaga Confirmada - Inauguração Alpar',
      html: buildConfirmationEmail({ nome, horario }),
    })
  } catch (error) {
    console.error('Erro ao enviar e-mail de confirmação:', error)
  }

  return NextResponse.json({ message: 'Cadastro realizado com sucesso!' })
}
