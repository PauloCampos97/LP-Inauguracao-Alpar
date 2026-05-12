import Image from 'next/image'
import LeadForm from '@/components/LeadForm'
import {
  GraduationCap,
  ClipboardCheck,
  Handshake,
  Headphones,
  ShieldCheck,
  Lightbulb,
  Sofa,
} from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1e3a8a33,transparent_50%)]" />

        <div className="mx-auto items-center justify-center max-w-7xl  gap-10 px-6 py-12 lg:grid-cols-2">
          <div>
            <div className="mb-10 mx-auto" >
              <h1 className="mb-6  font-serif text-6xl text-[#d4b06a]">
                ALPAR
              </h1>

              <div className="relative overflow-hidden rounded-3xl border border-white/10">
                <Image
                  src="/banner.png"
                  alt="Evento"
                  width={1200}
                  height={700}
                  className="h-[500px] w-full object-cover"
                />

                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.55)_40%,#050816_100%)]" />

                <div className="absolute inset-0 flex items-center justify-end p-10">
                  <div className="mr-10 text-left">
                    <h2 className="max-w-xl font-serif text-5xl leading-tight">
                      O seu caminho estratégico começa aqui. 
                    </h2>

                    <p className="mt-6 max-w-lg text-2xl text-gray-300">
                      Convidamos você para um brinde ao futuro do seu negócio em nossa nova sede no Shopping Paragem.  
                    </p>

                    <button className="mt-8 w-fit rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 px-8 py-4 text-xl font-semibold transition hover:scale-105">
                       Quero participar da inauguração
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SOBRE */}
            <div className="mt-16 text-center mb-12">
              <h2 className="font-serif text-5xl">Sobre a Alpar</h2>

              <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-400">
                Aqui a tecnologia encontra o olhar humano para impulsionar seu negócio.
              </p>

              <div className="mt-12 grid gap-6 md:grid-cols-3">
                <Card
                  icon={<ShieldCheck size={42} />}
                  title="PRESENÇA QUE FAZ A DIFERENÇA"
                  text="Um atendimento humano e presencial em BH para planejar o seu futuro."
                />

                <Card
                  icon={<Lightbulb size={42} />}
                  title="INTELIGENCIA DE DADOS"
                  text="Tecnologia de ponta convertendo números em estratégias claras para o seu bolso."
                />

                <Card
                  icon={<Sofa size={42} />}
                  title="AMBIENTE ESTRATÉGICO"
                  text="Uma nova sede pensada para receber grandes parcerias e fomentar o seu sucesso."
                />
              </div>
            </div>
          </div>

          <div className="rounded-[40px] mb-12 border border-white/10 bg-[#081120]/90 p-8 shadow-2xl backdrop-blur">
            <div className="text-center">
              <h2 className="mt-2 font-serif text-5xl">
                O Que Esperar do Evento
              </h2>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <FeatureCard
                icon={<GraduationCap size={42} />}
                title="PÍLULAS DE CONHECIMENTO"
                text=" Breves apresentações sobre escala de negócios, métricas de sucesso e como manter seu financeiro atualizado."
              />

              <FeatureCard
                icon={<ClipboardCheck size={42} />}
                title="CONSULTORIA EXPRESS"
                text=" Garanta sua pré-análise gratuita no dia e tire dúvidas com nossos especialistas sobre o seu Imposto de Renda e gestão.   "
              />

              <FeatureCard
                icon={<Handshake size={42} />}
                title="NETWORKING QUALIFICADO"
                text="Um coquetel pensado para conectar você a outros empresários e fortalecer parcerias estratégicas em um ambiente acolhedor.   "
              />

              <FeatureCard
                icon={<Headphones size={42} />}
                title="SUPORTE INVIDUALIZADO"
                text="Nossa equipe estará disponível durante todo o evento para esclarecer dúvidas específicas sobre os desafios do seu negócio."
              />
            </div>

            {/* INFO */}
            <div className="mt-14">
              <h3 className="mb-6 font-serif text-4xl">
                Informações Práticas
              </h3>

              <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-6">
                <div className="space-y-3 text-lg text-gray-300">
                  <p>📅 Sexta, 29 de Maio de 2026</p>
                  <p>🕖 Início às 19h00</p>
                  <p>Local: Shopping Paragem <br/>  
                    Avenida Mário Werneck, 1360
                    Estoril-BH MG <br/>
                    Estacionamento E2/G2 Sala 351</p>
                </div>
              </div>
            </div>

            {/* FORM */}
            <div className="mt-12">
              <LeadForm />
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
              <h2 className="font-serif text-4xl text-[#d4b06a]">ALPAR</h2>

              <p className="text-sm text-gray-500">
                © 2026 Alpar. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function Card({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-[#0f172a]/80 p-8 shadow-xl">
      <div className="mb-4 flex justify-center text-indigo-400">{icon}</div>

      <h3 className="text-2xl font-bold">{title}</h3>

      <p className="mt-2 text-gray-400">{text}</p>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-[#0f172a]/80 p-6 text-center">
      <div className="mb-4 flex justify-center text-indigo-400">{icon}</div>

      <h3 className="text-lg font-bold">{title}</h3>

      <p className="mt-2 text-sm text-gray-400">{text}</p>
    </div>
  )
}