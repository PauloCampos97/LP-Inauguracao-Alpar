'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Dialog } from '@/components/ui/Dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import {
  Eye,
  EyeOff,
  LogOut,
  Search,
  Calendar,
  Clock,
  Users,
  UserCheck,
  DollarSign,
  Download,
  Phone,
  Mail,
  CheckCircle2,
  CircleX,
  ArrowUpDown,
  ChartBar,
  ChartPie,
  Filter,
  Copy,
  Check,
  Info,
  Sun,
  Moon,
  Gauge,
  MapPin,
  Building2,
  Trash2,
  AlertTriangle,
  Loader2,
} from 'lucide-react'

type Lead = {
  id: number
  nome: string
  email: string
  telefone: string
  cnpj: string
  faturamento: string
  colaboradores: string
  horario: string
  createdAt: string
}

const HORARIOS = [
  '17:00 às 18:00',
  '18:00 às 19:00',
  '19:00 às 20:00',
  '20:00 às 21:00',
]

const VAGAS_POR_HORARIO = 15

function formatCNPJ(cnpj: string): string {
  const digits = cnpj.replace(/\D/g, '').padStart(14, '0')
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`
}

function formatBRL(digits: string): string {
  const numericValue = parseInt(digits, 10) / 100
  return numericValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatTelefone(telefone: string): string {
  const digits = telefone.replace(/\D/g, '')
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return telefone
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getCapacityColor(fill: number): string {
  if (fill >= 100) return 'from-red-500 to-rose-600'
  if (fill >= 66) return 'from-yellow-500 to-orange-500'
  if (fill >= 33) return 'from-blue-500 to-indigo-500'
  return 'from-green-500 to-emerald-500'
}

function getCapacityBadgeVariant(fill: number): 'destructive' | 'warning' | 'info' | 'success' {
  if (fill >= 100) return 'destructive'
  if (fill >= 66) return 'warning'
  if (fill >= 33) return 'info'
  return 'success'
}

function getCapacityLabel(fill: number): string {
  if (fill >= 100) return 'Esgotado'
  if (fill >= 80) return 'Quase cheio'
  if (fill >= 50) return 'Mais da metade'
  if (fill >= 20) return 'Disponível'
  return 'Muitas vagas'
}

type SortKey = 'nome' | 'email' | 'horario' | 'createdAt' | 'colaboradores'
type SortDir = 'asc' | 'desc'

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [timeFilter, setTimeFilter] = useState<string>('all')
  const [theme, setTheme] = useState<'upfly' | 'dark' | 'light'>('upfly')
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  const themeLabel: Record<string, string> = {
    upfly: 'Alpar',
    dark: 'Escuro',
    light: 'Claro',
  }

  function cycleTheme() {
    const order = ['upfly', 'dark', 'light']
    const idx = order.indexOf(theme)
    setTheme(order[(idx + 1) % order.length] as 'upfly' | 'dark' | 'light')
  }

  const fetchLeads = useCallback(async () => {
    const token = sessionStorage.getItem('admin_token')
    const res = await fetch('/api/admin/leads', {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.status === 401) {
      sessionStorage.removeItem('admin_token')
      setLoggedIn(false)
      return
    }

    const data = await res.json()
    setLeads(data)
  }, [])

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token')
    const name = sessionStorage.getItem('admin_name')
    if (token) {
      setUserName(name || 'Admin')
      setLoggedIn(true)
      fetchLeads()
    }
  }, [fetchLeads])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setLoginError(data.message || 'Falha no login')
        return
      }

      sessionStorage.setItem('admin_token', data.token)
      sessionStorage.setItem('admin_name', data.user.name)
      setUserName(data.user.name)
      setLoggedIn(true)
      fetchLeads()
    } catch {
      setLoginError('Erro de rede')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_token')
    sessionStorage.removeItem('admin_name')
    setLoggedIn(false)
    setLeads([])
    setEmail('')
    setPassword('')
  }

  async function handleDelete() {
    if (!leadToDelete) return
    setDeleteLoading(true)
    setDeleteError(null)

    const token = sessionStorage.getItem('admin_token')

    try {
      const res = await fetch(`/api/admin/leads/${leadToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.status === 401) {
        sessionStorage.removeItem('admin_token')
        setLoggedIn(false)
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setDeleteError(data.message || 'Erro ao excluir agendamento.')
        return
      }

      setLeadToDelete(null)
      setSelectedLead(null)
      fetchLeads()
    } catch {
      setDeleteError('Erro de conexão com o servidor.')
    } finally {
      setDeleteLoading(false)
    }
  }

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function exportToCSV() {
    const headers = ['Nome', 'Email', 'Telefone', 'CNPJ', 'Faturamento', 'Colaboradores', 'Horário', 'Data de Cadastro']
    const rows = filteredLeads.map((lead) => [
      lead.nome,
      lead.email,
      formatTelefone(lead.telefone),
      formatCNPJ(lead.cnpj),
      (parseInt(lead.faturamento, 10) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      lead.colaboradores,
      lead.horario,
      new Date(lead.createdAt).toLocaleString('pt-BR'),
    ])

    const delimiter = ';'
    const csvContent = [headers.join(delimiter), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(delimiter))].join('\n')
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-alpar-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const stats = useMemo(() => {
    const total = leads.length
    const totalVagas = HORARIOS.length * VAGAS_POR_HORARIO
    const preenchidas = total
    const restantes = totalVagas - preenchidas
    const ocupacao = totalVagas > 0 ? Math.round((preenchidas / totalVagas) * 100) : 0

    const porHorario = HORARIOS.map((horario) => {
      const count = leads.filter((l) => l.horario === horario).length
      return { horario, count, capacidade: VAGAS_POR_HORARIO, fill: Math.round((count / VAGAS_POR_HORARIO) * 100) }
    })

    const cadastrosHoje = leads.filter((l) => {
      const hoje = new Date()
      const data = new Date(l.createdAt)
      return data.toDateString() === hoje.toDateString()
    }).length

    return { total, totalVagas, preenchidas, restantes, ocupacao, porHorario, cadastrosHoje }
  }, [leads])

  const filteredLeads = useMemo(() => {
    let result = [...leads]

    if (timeFilter !== 'all') {
      result = result.filter((l) => l.horario === timeFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (l) =>
          l.nome.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.telefone.includes(q) ||
          l.cnpj.includes(q) ||
          l.horario.toLowerCase().includes(q)
      )
    }

    result.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'nome':
          cmp = a.nome.localeCompare(b.nome, 'pt-BR')
          break
        case 'email':
          cmp = a.email.localeCompare(b.email)
          break
        case 'horario':
          cmp = a.horario.localeCompare(b.horario)
          break
        case 'createdAt':
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'colaboradores':
          cmp = (parseInt(a.colaboradores, 10) || 0) - (parseInt(b.colaboradores, 10) || 0)
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

    return result
  }, [leads, searchQuery, sortKey, sortDir, timeFilter])

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return <ArrowUpDown size={12} className="ml-1 text-muted-foreground" />
    return (
      <span className="ml-1 inline-block">
        {sortDir === 'asc' ? '▲' : '▼'}
      </span>
    )
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <h1 className="font-serif text-xl text-[#d4b06a]">ALPAR</h1>
            <button
              onClick={cycleTheme}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition hover:bg-hover hover:text-foreground"
              title={`Tema: ${themeLabel[theme]}`}
            >
              {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
              <span className="hidden sm:inline">{themeLabel[theme]}</span>
            </button>
          </div>
        </header>
        <div className="flex min-h-[calc(100vh-73px)] w-full items-center justify-center px-4 py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in srgb,var(--primary)20%,transparent),transparent_50%)]" />
          <div className="relative w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="font-serif text-3xl text-[#d4b06a]">ALPAR</h1>
              <p className="mt-1 text-sm text-muted-foreground">Painel Administrativo</p>
            </div>

          <Card className="border-border bg-card text-foreground shadow-2xl backdrop-blur-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-foreground">Entrar</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {loginError && (
                <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  disabled={loading}
                  className="h-10 border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:ring-ring"
                />

                <div className="space-y-1">
                  <label className="block text-xs leading-none text-muted-foreground">Senha</label>
                  <div className="flex gap-2">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                      className="h-10 flex-1 border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:ring-ring"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPassword((v) => !v)}
                      className="h-10 min-w-[92px] cursor-pointer border-border bg-secondary text-muted-foreground hover:bg-hover hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="mt-2 h-10 w-full bg-gradient-to-r from-primary to-blue-600 text-primary-foreground hover:from-primary/80 hover:to-blue-500"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    )
  }

  return (
    <>
      <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="font-serif text-xl text-[#d4b06a]">ALPAR</h1>
              <p className="text-xs text-muted-foreground">Painel Administrativo</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">{userName}</span>
            </div>
            <button
              onClick={cycleTheme}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition hover:bg-hover hover:text-foreground"
              title={`Tema: ${themeLabel[theme]}`}
            >
              {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
              <span className="hidden sm:inline">{themeLabel[theme]}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive transition hover:bg-destructive/20"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-2 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={exportToCSV}
              className="border-border bg-card text-muted-foreground hover:bg-hover hover:text-foreground cursor-pointer"
            >
              <Download size={16} className="mr-2" />
              Exportar CSV
            </Button>
            <button
              onClick={fetchLeads}
              className="cursor-pointer rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition hover:bg-hover hover:text-foreground"
            >
              Atualizar
            </button>
          </div>
          <div className="mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="overview">
                  <ChartBar size={16} className="mr-2" />
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="leads">
                    <Users size={16} className="mr-2" />
                    Leads
                    {leads.length > 0 && (
                      <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                        {leads.length}
                      </span>
                    )}
                  </TabsTrigger>
                <TabsTrigger value="horarios">
                  <Calendar size={16} className="mr-2" />
                  Horários
                </TabsTrigger>
              </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40">
                    <div className="mb-3 flex items-center gap-2 text-primary">
                      <UserCheck size={20} />
                      <span className="text-sm text-muted-foreground">Total de Cadastros</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stats.cadastrosHoje} hoje
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40">
                    <div className="mb-3 flex items-center gap-2 text-primary">
                      <Gauge size={20} />
                      <span className="text-sm text-muted-foreground">Taxa de Ocupação</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{stats.ocupacao}%</p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${getCapacityColor(stats.ocupacao)}`}
                        style={{ width: `${Math.min(stats.ocupacao, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40">
                    <div className="mb-3 flex items-center gap-2 text-primary">
                      <MapPin size={20} />
                      <span className="text-sm text-muted-foreground">Vagas Restantes</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{stats.restantes}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      De {stats.totalVagas} vagas no total
                    </p>
                  </div>
                </div>

                <div className="mb-6 grid gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                      <ChartBar size={18} className="text-primary" />
                      Ocupação por Horário
                    </h3>
                    <div className="space-y-4">
                      {stats.porHorario.map(({ horario, count, capacidade, fill }) => (
                        <div key={horario}>
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">{horario}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {count}/{capacidade}
                              </span>
                              <Badge variant={getCapacityBadgeVariant(fill)} className="text-xs">
                                {fill}%
                              </Badge>
                            </div>
                          </div>
                          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${getCapacityColor(fill)}`}
                              style={{ width: `${Math.min(fill, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                      <ChartPie size={18} className="text-primary" />
                      Distribuição Geral
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <div className="relative h-40 w-40">
                          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                            {stats.porHorario.map(({ fill, horario }, i) => {
                              const offset = stats.porHorario
                                .slice(0, i)
                                .reduce((sum, h) => sum + (h.count / stats.total) * 100, 0)
                              const value = stats.total > 0 ? (fill * stats.porHorario[i].count) / 100 : 0
                              const pct = stats.total > 0 ? (stats.porHorario[i].count / stats.total) * 100 : 0

                              if (pct === 0) return null

                              const circumference = 2 * Math.PI * 15
                              const dashLength = (pct / 100) * circumference
                              const dashOffset = (offset / 100) * circumference

                              const colors = ['#6366f1', '#06b6d4', '#8b5cf6', '#ec4899']

                              return (
                                <circle
                                  key={horario}
                                  cx="18"
                                  cy="18"
                                  r="15"
                                  fill="none"
                                  stroke={colors[i % colors.length]}
                                  strokeWidth="4"
                                  strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                                  strokeDashoffset={-dashOffset}
                                  className="transition-all duration-700"
                                />
                              )
                            })}
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                              <p className="text-xs text-muted-foreground">total</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {stats.porHorario.map(({ horario, count }, i) => {
                          const colors = ['bg-primary', 'bg-cyan-500', 'bg-violet-500', 'bg-pink-500']
                          return (
                            <div key={horario} className="flex items-center gap-2">
                              <div className={`h-3 w-3 rounded-full ${colors[i % colors.length]}`} />
                              <div className="flex-1">
                                <p className="text-xs text-muted-foreground truncate">{horario}</p>
                                <p className="text-sm font-medium text-foreground">{count} leads</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Info size={18} className="text-primary" />
                    Resumo Rápido
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-primary/10 bg-secondary p-4">
                      <p className="text-xs text-muted-foreground">Lead mais recente</p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {leads.length > 0 ? leads[0].nome : '---'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {leads.length > 0 ? formatDate(leads[0].createdAt) : '---'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-primary/10 bg-secondary p-4">
                      <p className="text-xs text-muted-foreground">Horário mais concorrido</p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {stats.porHorario.reduce((max, h) => (h.count > max.count ? h : max), stats.porHorario[0])
                          .horario || '---'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-primary/10 bg-secondary p-4">
                      <p className="text-xs text-muted-foreground">Faturamento médio</p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {leads.length > 0
                          ? formatBRL(String(leads.reduce((acc, l) => acc + Number(l.faturamento), 0) / leads.length))
                          : formatBRL('0')}
                      </p>
                    </div>
                    <div className="rounded-xl border border-primary/10 bg-secondary p-4">
                      <p className="text-xs text-muted-foreground">Capacidade total</p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {stats.totalVagas} vagas
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stats.restantes} disponíveis
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="leads">
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar por nome, email, telefone, CNPJ ou horário..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-ring/50 focus:ring-1 focus:ring-ring/30"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                      >
                        <CircleX size={16} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-muted-foreground" />
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="h-10 cursor-pointer rounded-xl border border-border bg-card px-3 text-sm text-muted-foreground outline-none transition focus:border-ring/50"
                    >
                      <option value="all">Todos os horários</option>
                      {HORARIOS.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {filteredLeads.length} de {leads.length} leads
                  </p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-border bg-card">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border/50 text-muted-foreground">
                        <th
                          className="cursor-pointer p-4 font-medium transition hover:text-foreground"
                          onClick={() => toggleSort('nome')}
                        >
                          <span className="flex items-center">
                            Nome
                            <SortIcon columnKey="nome" />
                          </span>
                        </th>
                        <th
                          className="cursor-pointer p-4 font-medium transition hover:text-foreground"
                          onClick={() => toggleSort('email')}
                        >
                          <span className="flex items-center">
                            E-mail
                            <SortIcon columnKey="email" />
                          </span>
                        </th>
                        <th className="p-4 font-medium">Telefone</th>
                        <th className="p-4 font-medium">CNPJ</th>
                        <th className="p-4 font-medium">Faturamento</th>
                        <th
                          className="cursor-pointer p-4 font-medium transition hover:text-foreground"
                          onClick={() => toggleSort('colaboradores')}
                        >
                          <span className="flex items-center">
                            Colab.
                            <SortIcon columnKey="colaboradores" />
                          </span>
                        </th>
                        <th
                          className="cursor-pointer p-4 font-medium transition hover:text-foreground"
                          onClick={() => toggleSort('horario')}
                        >
                          <span className="flex items-center">
                            Horário
                            <SortIcon columnKey="horario" />
                          </span>
                        </th>
                        <th
                          className="cursor-pointer p-4 font-medium transition hover:text-foreground"
                          onClick={() => toggleSort('createdAt')}
                        >
                          <span className="flex items-center">
                            Cadastro
                            <SortIcon columnKey="createdAt" />
                          </span>
                        </th>
                        <th className="p-4 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-12 text-center text-muted-foreground">
                            {searchQuery || timeFilter !== 'all'
                              ? 'Nenhum lead encontrado com esses filtros.'
                              : 'Nenhum cadastro realizado ainda.'}
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead) => (
                          <tr
                            key={lead.id}
                            className="border-b border-border/30 transition hover:bg-hover"
                          >
                            <td className="p-4">
                              <button
                                onClick={() => setSelectedLead(lead)}
                                className="cursor-pointer font-medium text-foreground transition hover:text-primary"
                              >
                                {lead.nome}
                              </button>
                            </td>
                            <td className="p-4 text-muted-foreground">{lead.email}</td>
                            <td className="p-4 text-muted-foreground">{formatTelefone(lead.telefone)}</td>
                            <td className="p-4 font-mono text-xs text-muted-foreground">
                              {formatCNPJ(lead.cnpj)}
                            </td>
                            <td className="p-4 text-muted-foreground">
                              <span className="font-medium text-success">
                                {formatBRL(lead.faturamento)}
                              </span>
                            </td>
                            <td className="p-4 text-muted-foreground">{lead.colaboradores}</td>
                            <td className="p-4">
                              <Badge variant="info" className="text-xs">
                                {lead.horario}
                              </Badge>
                            </td>
                            <td className="p-4 text-xs text-muted-foreground">
                              {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedLead(lead)}
                                  className="cursor-pointer rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs text-primary transition hover:bg-primary/20"
                                >
                                  Detalhes
                                </button>
                                <button
                                  onClick={() => setLeadToDelete(lead)}
                                  className="cursor-pointer rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-xs text-destructive transition hover:bg-destructive/20"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="horarios">
              <div className="grid gap-4 lg:grid-cols-2">
                {stats.porHorario.map(({ horario, count, capacidade, fill }) => {
                  const leadsDoHorario = leads.filter((l) => l.horario === horario)
                  return (
                    <div
                      key={horario}
                      className="rounded-2xl border border-border bg-card p-6"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                            <Clock size={18} className="text-primary" />
                            {horario}
                          </h3>
                          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <Users size={14} />
                            {count} de {capacidade} vagas preenchidas
                          </p>
                        </div>
                        <Badge variant={getCapacityBadgeVariant(fill)} className="text-sm">
                          {fill}%
                        </Badge>
                      </div>

                      <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${getCapacityColor(fill)}`}
                          style={{ width: `${Math.min(fill, 100)}%` }}
                        />
                      </div>

                      <div className="mb-3 flex flex-wrap gap-2">
                        <Badge variant="outline" className="border-border text-muted-foreground">
                          <CheckCircle2 size={12} className="mr-1 text-success" />
                          {count} confirmados
                        </Badge>
                        <Badge variant="outline" className="border-border text-muted-foreground">
                          <CircleX size={12} className="mr-1 text-destructive" />
                          {capacidade - count} restantes
                        </Badge>
                        <Badge variant={getCapacityBadgeVariant(fill)} className="text-xs">
                          {getCapacityLabel(fill)}
                        </Badge>
                      </div>

                      {leadsDoHorario.length > 0 && (
                        <div className="mt-4 max-h-48 space-y-1.5 overflow-y-auto custom-scrollbar">
                          {leadsDoHorario.map((lead) => (
                            <button
                              key={lead.id}
                              onClick={() => setSelectedLead(lead)}
                              className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-border/50 bg-secondary px-4 py-2.5 text-left transition hover:border-primary/30 hover:bg-hover">
                              <div>
                                <p className="text-sm font-medium text-foreground">{lead.nome}</p>
                                <p className="text-xs text-muted-foreground">{formatBRL(lead.faturamento)}</p>
                              </div>
                              <ChevronIcon />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title="Detalhes do Lead"
        className="max-w-3xl"
      >
        {selectedLead && <LeadDetail lead={selectedLead} onCopy={handleCopy} copiedId={copiedId} />}
        <div className="flex items-center justify-between gap-4 pt-4">
          <div className="flex gap-2">
            <button
              onClick={() => setLeadToDelete(selectedLead)}
              className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive transition hover:bg-destructive/20"
            >
              <Trash2 size={16} />
              Excluir
            </button>
          </div>
          <button
            onClick={() => setSelectedLead(null)}
            className="cursor-pointer rounded-lg bg-muted px-4 py-2 text-sm text-muted-foreground transition hover:bg-muted/80"
          >
            Fechar
          </button>
        </div>
      </Dialog>
      </div>

      {leadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-destructive/30 bg-card p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle size={24} className="text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">
                  Excluir Agendamento
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tem certeza que deseja excluir o agendamento de{' '}
                  <strong className="text-card-foreground">
                    {leadToDelete.nome}
                  </strong>
                  ?
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {deleteError}
              </div>
            )}

            <p className="mb-6 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
              Esta ação não pode ser desfeita. O lead receberá um e-mail de
              confirmação sobre o cancelamento.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setLeadToDelete(null)
                  setDeleteError(null)
                }}
                disabled={deleteLoading}
                className="cursor-pointer rounded-lg border border-border bg-card px-4 py-2 text-sm text-card-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm text-destructive-foreground transition hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteLoading && <Loader2 size={16} className="animate-spin" />}
                {deleteLoading ? 'Excluindo...' : 'Sim, excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
      </>
    )
  }

function ChevronIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-foreground"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function LeadDetail({
  lead,
  onCopy,
  copiedId,
}: {
  lead: Lead
  onCopy: (text: string, id: string) => void
  copiedId: string | null
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-border/50 pb-4">
        <Avatar name={lead.nome} size="lg" />
        <div>
          <h3 className="text-2xl font-bold text-foreground">{lead.nome}</h3>
          <p className="text-sm text-muted-foreground">Lead #{lead.id}</p>
        </div>
        <Badge variant="info" className="ml-auto">
          {lead.horario}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InfoField
          icon={<Mail size={16} />}
          label="E-mail"
          value={lead.email}
          onCopy={() => onCopy(lead.email, `email-${lead.id}`)}
          copied={copiedId === `email-${lead.id}`}
        />
        <InfoField
          icon={<Phone size={16} />}
          label="Telefone"
          value={formatTelefone(lead.telefone)}
          onCopy={() => onCopy(lead.telefone, `tel-${lead.id}`)}
          copied={copiedId === `tel-${lead.id}`}
        />
        <InfoField
          icon={<Building2 size={16} />}
          label="CNPJ"
          value={formatCNPJ(lead.cnpj)}
          onCopy={() => onCopy(formatCNPJ(lead.cnpj), `cnpj-${lead.id}`)}
          copied={copiedId === `cnpj-${lead.id}`}
        />
        <InfoField
          icon={<DollarSign size={16} />}
          label="Faturamento"
          value={formatBRL(lead.faturamento)}
          highlight
        />
        <InfoField
          icon={<Users size={16} />}
          label="Colaboradores"
          value={`${lead.colaboradores} colaboradores`}
        />
        <InfoField
          icon={<Clock size={16} />}
          label="Horário Selecionado"
          value={lead.horario}
        />
      </div>

      <div className="rounded-xl border border-border/50 bg-secondary p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar size={14} />
          <span>Cadastrado em: <span className="text-foreground">{formatDate(lead.createdAt)}</span></span>
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-secondary p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Informações Brutas
        </p>
        <pre className="overflow-x-auto text-xs text-muted-foreground">
          {JSON.stringify(lead, null, 2)}
        </pre>
      </div>
    </div>
  )
}

function InfoField({
  icon,
  label,
  value,
  highlight,
  onCopy,
  copied,
}: {
  icon: React.ReactNode
  label: string
  value: string
  highlight?: boolean
  onCopy?: () => void
  copied?: boolean
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-secondary p-4 transition hover:border-primary/20">
      <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <p className={`text-sm ${highlight ? 'text-success font-semibold' : 'text-foreground'}`}>
          {value}
        </p>
        {onCopy && (
          <button
            onClick={onCopy}
            className="ml-2 cursor-pointer rounded-lg p-1.5 text-muted-foreground transition hover:bg-hover hover:text-foreground"
            title="Copiar"
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          </button>
        )}
      </div>
    </div>
  )
}
