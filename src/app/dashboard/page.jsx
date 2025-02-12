"use client"

import { useEffect, useState } from "react"
import { FileText, MessageSquare, Users } from "lucide-react"
import dynamic from "next/dynamic"

// Importar dinámicamente para evitar errores de SSR
const PqrsdBarChart = dynamic(() => import("../componentes/pqrsd-bar-chart"), { ssr: false })
const PqrsdpieChart = dynamic(() => import("../componentes/pqrsdpiechart"), { ssr: false })
const Toaster = dynamic(() => import("sonner").then((mod) => mod.Toaster), { ssr: false })
const AnimatedView = dynamic(() => import("../componentes/AnimatedView"), { ssr: false })
const Loanding = dynamic(() => import("../componentes/loanding"), { ssr: false })

export default function Dashboard() {
  const [adminData, setAdminData] = useState(null)
  const [pqrsdData, setPqrsdData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adminRes, pqrsdRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin`).then((res) => res.json()),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/Dashboardpqrsd`).then((res) => res.json()),
        ])

        setAdminData(adminRes)
        setPqrsdData(pqrsdRes)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <Loanding />
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <AnimatedView>
      <div className="p-6">
        <Toaster richColors />

        {/* Administración y PQRSDF en un grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Administración */}
          <Section title="🛠️ Administración">
            <MetricCard title="Total Usuarios" value={adminData?.totalUsuarios} icon={<Users className="w-8 h-8 text-blue-500" />} />
            <MetricCard title="Usuarios Activos" value={adminData?.usuariosActivos} icon={<Users className="w-8 h-8 text-green-500" />} />
          </Section>

          {/* PQRSDF */}
          <Section title="📑 PQRSDF">
            <MetricCard title="Total PQRSD" value={pqrsdData?.totalPqrsd} icon={<MessageSquare className="w-8 h-8 text-blue-500" />} />
            <MetricCard title="PQRSD Radicadas" value={pqrsdData?.pqrsdResueltas} icon={<MessageSquare className="w-8 h-8 text-green-500" />} />
          </Section>
        </div>

        {/* PQRSD Charts */}
        {pqrsdData && (
          <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-6 mb-6">
            <PqrsdBarChart />
            <PqrsdpieChart data={pqrsdData} />
          </div>
        )}
      </div>
    </AnimatedView>
  )
}

// Componente reutilizable para secciones
const Section = ({ title, children }) => (
  <section className="mb-8">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">{children}</div>
  </section>
)

// Componente reutilizable para tarjetas de métricas con animación
const MetricCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold">{value !== undefined && value !== null ? value : "N/A"}</p>
      </div>
      {icon}
    </div>
  </div>
)
