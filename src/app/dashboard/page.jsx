import { Sidebar } from "@/app/sidebar"
import { Navbar } from "@/app/navbar"
import { StatsCard } from "@/components/stats-card"
import  DashboardLayout  from "@/app/dashboard/layout";


const stats = [
  { title: "Total Images", value: "36,476 GB", percent: 32, change: "+32.40%", trend: "up" },
  { title: "Total Videos", value: "53,406 GB", percent: 48, change: "-18.45%", trend: "down" },
  { title: "Total Documents", value: "90,875 GB", percent: 89, change: "+20.34%", trend: "up" },
  { title: "Total Musics", value: "63,076 GB", percent: 78, change: "+14.45%", trend: "up" },
]

export default function Dashboard() {
  return (


    <div className="flex h-screen bg-background font-poppins">
     
      <main className="flex-1 p-8 overflow-y-auto">
        
        <h1>bienvenido al dashboard</h1>
      </main>
    </div>

  )
}

