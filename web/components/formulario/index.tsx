'use client'

import { useState } from 'react'

export default function LeadForm() {
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    cnpj: '',
    faturamento: '',
    colaboradores: '',
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    console.log(form)

    alert('Cadastro realizado com sucesso!')
  }

  return (
    <div className="w-full rounded-3xl border border-indigo-500/30 bg-[#0b1220]/80 p-8 shadow-2xl backdrop-blur">
      <h2 className="mb-2 text-center font-serif text-4xl text-white">
        Garanta seu Nome na Lista
      </h2>

      <p className="mb-8 text-center text-gray-300">
        Preencha o formulário abaixo e garanta seu brinde na inauguração.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          className="w-full rounded-xl border border-indigo-500/30 bg-[#111827] px-4 py-4 text-white outline-none transition focus:border-indigo-400"
          required
        />

        <input
          type="text"
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
          className="w-full rounded-xl border border-indigo-500/30 bg-[#111827] px-4 py-4 text-white outline-none transition focus:border-indigo-400"
          required
        />

        <input
          type="text"
          name="cnpj"
          placeholder="CNPJ"
          value={form.cnpj}
          onChange={handleChange}
          className="w-full rounded-xl border border-indigo-500/30 bg-[#111827] px-4 py-4 text-white outline-none transition focus:border-indigo-400"
          required
        />

        <input
          type="text"
          name="faturamento"
          placeholder="Faturamento"
          value={form.faturamento}
          onChange={handleChange}
          className="w-full rounded-xl border border-indigo-500/30 bg-[#111827] px-4 py-4 text-white outline-none transition focus:border-indigo-400"
          required
        />

        <input
          type="number"
          name="colaboradores"
          placeholder="Número de colaboradores"
          value={form.colaboradores}
          onChange={handleChange}
          className="w-full rounded-xl border border-indigo-500/30 bg-[#111827] px-4 py-4 text-white outline-none transition focus:border-indigo-400"
          required
        />

        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-4 font-semibold text-white transition hover:scale-[1.02]"
        >
          Confirmar Agora
        </button>
      </form>
    </div>
  )
}