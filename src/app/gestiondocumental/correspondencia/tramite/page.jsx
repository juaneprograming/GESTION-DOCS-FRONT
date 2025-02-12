import DashboardLayout from '@/app/dashboard/layout'
import React from 'react'
import { Breadcrumb } from "@/app/componentes/breadcrumb"

const Tramite = () => {
  return (
    <DashboardLayout>
    <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Tramite </h2>  
            <Breadcrumb/>
          </div>
        </div>
      </div>
    </DashboardLayout>

  )
}

export default Tramite
