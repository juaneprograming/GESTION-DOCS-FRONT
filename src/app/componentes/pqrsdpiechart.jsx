"use client"

import { useMemo } from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  peticiones: {
    label: "Peticiones",
    color: "hsl(var(--chart-1))",
  },
  quejas: {
    label: "Quejas",
    color: "hsl(var(--chart-2))",
  },
  reclamos: {
    label: "Reclamos",
    color: "hsl(var(--chart-3))",
  },
  sugerencias: {
    label: "Sugerencias",
    color: "hsl(var(--chart-4))",
  },
  denuncias: {
    label: "Denuncias",
    color: "hsl(var(--chart-5))",
  },
}

export default function PqrsdChart({ data }) {
  const chartData = useMemo(
    () => [
      {
        type: "peticiones",
        value: data.peticiones,
        fill: chartConfig.peticiones.color,
      },
      { type: "quejas", value: data.quejas, fill: chartConfig.quejas.color },
      {
        type: "reclamos",
        value: data.reclamos,
        fill: chartConfig.reclamos.color,
      },
      {
        type: "sugerencias",
        value: data.sugerencias,
        fill: chartConfig.sugerencias.color,
      },
      {
        type: "denuncias",
        value: data.denuncias,
        fill: chartConfig.denuncias.color,
      },
    ],
    [data],
  )

  const totalPqrsd = useMemo(() => data.totalPqrsd, [data.totalPqrsd])

  const percentageResolved = useMemo(() => {
    return ((data.pqrsdResueltas / data.totalPqrsd) * 100).toFixed(1)
  }, [data.pqrsdResueltas, data.totalPqrsd])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribución de PQRSD</CardTitle>
        <CardDescription>Resumen de PQRSD</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px] w-full md:w-1/2">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={chartData} dataKey="value" nameKey="type" innerRadius={60} strokeWidth={5}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                            {totalPqrsd.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                            Total PQRSD
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {percentageResolved}% de PQRSD resueltas <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {data.pqrsdResueltas} de {data.totalPqrsd} PQRSD han sido resueltas
        </div>
        <div className="w-full mt-4">
          <h4 className="text-sm font-semibold mb-4">Leyenda</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {chartData.map((item) => (
              <div key={item.type} className="flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-sm text-muted-foreground">{chartConfig[item.type].label}</span>
                </div>
                <span className="text-xl font-bold">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

