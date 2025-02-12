'use client'
import DashboardLayout from '@/app/dashboard/layout'
import React from 'react'
import { Breadcrumb } from "@/app/componentes/breadcrumb"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"



const Consultadocuental = () => {
  const [isLoading, setIsLoading] = React.useState(false)

  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }


  return (
    <DashboardLayout>
    <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Consulta Documental</h2>  
            <Breadcrumb/>
          </div>
        </div>
        <div className="container mx-auto p-4">
      <div className="flex flex-nowrap space-x-4">
        {/* Left side - Form */}
        <Card className="flex-1 min-w-[300px]">
          <CardHeader className="pb-2">
            <CardTitle>Consulta Documental</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documentType">Tipo de Documento</Label>
                <Select>
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Tipo 1</SelectItem>
                    <SelectItem value="2">Tipo 2</SelectItem>
                    <SelectItem value="3">Tipo 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metadata">Metadatos</Label>
                <Input id="metadata" placeholder="Ingrese metadatos" />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Consultando...
                  </>
                ) : (
                  "Consultar"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right side - Results */}
        <Card className="flex-[2] min-w-[300px]">
          <CardHeader className="pb-2">
            <CardTitle>Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[calc(100%-2rem)] rounded-lg border border-dashed flex items-center justify-center text-muted-foreground">
              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
      </div>
    </DashboardLayout>

  )
}

export default Consultadocuental
