"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

// Array de meses
const months = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
]

const tiposPQRSD = [
  { value: "todos", label: "Todos los tipos" },
  { value: "Peticion", label: "Petición" },
  { value: "queja", label: "Queja" },
  { value: "Reclamo", label: "Reclamo" },
  { value: "Sugerencia", label: "Sugerencia" },
  { value: "Denuncia", label: "Denuncia" },
]

const estadoColors = {
  radicadas: "hsl(var(--primary))",
  distribucion: "hsl(var(--warning))",
  finalizadas: "hsl(var(--success))",
}

export default function PqrsdBarChart() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedTipo, setSelectedTipo] = useState("todos")
  const [selectedMonth, setSelectedMonth] = useState("todos")
  const [selectedYear, setSelectedYear] = useState("todos")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [years, setYears] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pqrsdEstadisticas`)
        const jsonData = await response.json()

        // Establecer los años disponibles
        setYears(jsonData.years)
        setData(jsonData.pqrsdPorMes)
      } catch (err) {
        console.error("Error fetching statistics:", err)
        setError("Failed to load statistics")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!data.length) return

    let processedData = data

    if (selectedTipo !== "todos") {
      processedData = processedData.filter((item) => item.tipo_solicitud === selectedTipo)
    }

    if (selectedMonth !== "todos") {
      processedData = processedData.filter((item) => item.mes === selectedMonth)
    }

    if (selectedYear !== "todos") {
      processedData = processedData.filter((item) => item.mes.startsWith(selectedYear))
    }

    setFilteredData(processedData)
  }, [data, selectedTipo, selectedMonth, selectedYear])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  const uniqueMonths = [...new Set(data.map((item) => item.mes))]

  // Función para mapear el valor del mes a su nombre
  const getMonthName = (monthValue) => {
    const month = months.find((m) => m.value === monthValue)
    return month ? month.label : monthValue
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div>
          <CardTitle>Estadísticas PQRSD</CardTitle>
          <CardDescription>PQRSD por Estado y Mes</CardDescription>
        </div>
        <div className="flex gap-4">
          <Select value={selectedTipo} onValueChange={setSelectedTipo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposPQRSD.map((tipo) => (
                <SelectItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los años</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los meses</SelectItem>
              {uniqueMonths.map((month) => (
                <SelectItem key={month} value={month}>
                  {getMonthName(month)} {/* Muestra el nombre del mes */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" tickFormatter={getMonthName} /> {/* Muestra el nombre del mes */}
              <YAxis label={{ value: "Cantidad de PQRSD", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Bar name="Radicadas" dataKey="radicadas" fill={estadoColors.radicadas} radius={[4, 4, 0, 0]} />
              <Bar name="En Distribución" dataKey="distribucion" fill={estadoColors.distribucion} radius={[4, 4, 0, 0]} />
              <Bar name="Finalizadas" dataKey="finalizadas" fill={estadoColors.finalizadas} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
