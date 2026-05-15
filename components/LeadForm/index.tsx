'use client'

import { useState, useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

const horarios = [
  '17:00 às 18:00',
  '18:00 às 19:00',
  '19:00 às 20:00',
  '20:00 às 21:00',
]

export default function LeadForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    cnpj: '',
    faturamento: '',
    colaboradores: '',
    horario: '',
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onSuccess?.()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, onSuccess])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  function formatBRL(digits: string): string {
    const numericValue = parseInt(digits, 10) / 100
    return numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function handleFaturamentoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '')
    setForm({ ...form, faturamento: digits })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      const data = await res.json()

      setLoading(false)

      if (!res.ok) {
        setError(data.message || 'Erro ao realizar cadastro.')
        return
      }

      setSuccess(true)
    } catch {
      clearTimeout(timeout)
      setLoading(false)
      setError('Erro de conexão com o servidor. Verifique as configurações de SMTP.')
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/30">
          <CheckCircle size={52} className="text-white" />
        </div>
        <h2 className="mb-2 text-center font-serif text-4xl text-white">
          Vaga Confirmada!
        </h2>
        <p className="text-center text-lg text-gray-300">
          Sua reserva foi realizada com sucesso.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full rounded-3xl border border-indigo-500/30 bg-[#0b1220]/80 p-8 shadow-2xl backdrop-blur">
      <h2 className="mb-2 text-center font-serif text-4xl text-white">
        Garanta seu Nome na Lista
      </h2>

      <p className="mb-8 text-center text-gray-300">
        Preencha o formulário abaixo e garanta seu brinde na inauguração.
      </p>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required className="w-full rounded-xl border border-indigo-500/30 bg-[#111827] px-4 py-4 text-white outline-none transition focus:border-indigo-400" />

        <input type="email" name="email" placeholder="E-mail" value={form.email} onChange={handleChange} required className="w-full rounded-xl border border-indigo-500/30 bg-[#111827] px-4 py-4 text-white outline-none transition focus:border-indigo-400" />

        <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} required className="w-full rounded-xl border border-indigo-500/30 bg-[#111827] px-4 py-4 text-white outline-none transition focus:border-indigo-400" />

        <input name="cnpj" placeholder="CNPJ" value={form.cnpj} onChange={handleChange} required className="w-full rounded-xl border border-indigo-500/30 bg-[#111827] px-4 py-4 text-white outline-none transition focus:border-indigo-400" />

        <input name="faturamento" placeholder="Faturamento da empresa" value={form.faturamento ? formatBRL(form.faturamento) : ''} onChange={handleFaturamentoChange} required className="w-full rounded-xl border border-indigo-500/30 bg-[#111827] px-4 py-4 text-white outline-none transition focus:border-indigo-400" />

        <input type="number" name="colaboradores" placeholder="Número de colaboradores" value={form.colaboradores} onChange={handleChange} required className="w-full rounded-xl border border-indigo-500/30 bg-[#111827] px-4 py-4 text-white outline-none transition focus:border-indigo-400" />

        <select
          name="horario"
          value={form.horario}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-indigo-500/30 bg-[#111827] px-4 py-4 text-white outline-none transition focus:border-indigo-400"
        >
          <option value="">Selecione um horário</option>
          {horarios.map((horario) => (
            <option key={horario} value={horario}>
              {horario}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading || !form.horario}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-4 font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? 'Enviando...' : 'Confirmar Agora'}
        </button>
      </form>
    </div>
  )
}
