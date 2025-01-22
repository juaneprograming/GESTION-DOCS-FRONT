"use client"

import { Bell, MessageCircle, Search, Settings, User, FileText, Clock, LogOut, Menu } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/app/api/axios"

export function Navbar({ onToggleSidebar }) {
  const [data, setData] = useState({})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    checkAuth()
    if (isAuthenticated) {
      fetchDashboardData()
    }
  }, [isAuthenticated])

  const checkAuth = () => {
    const token = document.cookie.includes("token=")
    setIsAuthenticated(token)
  }

  const fetchDashboardData = () => {
    api
      .get("/dashboard")
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error)
      })
  }

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    setData({})
    setIsAuthenticated(false)
    if (api.defaults.headers.common["Authorization"]) {
      delete api.defaults.headers.common["Authorization"]
    }
    router.push("/login")
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".user-dropdown")) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  return (
    <nav className="border-b bg-white">
      <div className="flex h-[60px] items-center px-4">
        <button onClick={onToggleSidebar} className="mr-4 p-2 hover:bg-gray-100 rounded-full md:hidden">
          <Menu className="h-5 w-5 text-black" />
        </button>
        <div className="flex items-center gap-4">
          <h1 className="text-black">Bienvenido</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          
          <div className="relative user-dropdown">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="h-8 w-8 rounded-full overflow-hidden hover:ring-2 hover:ring-gray-200 transition-all flex items-center justify-center"
            >
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WFtB4q2x4n4Msf43YU4YiikGKIzWGJ.png"
                alt="User avatar"
                className="h-full w-full object-cover"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-1 z-50">
                <div className="px-4 py-3 border-b">
                  <div className="flex items-center space-x-3">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WFtB4q2x4n4Msf43YU4YiikGKIzWGJ.png"
                      alt="Albert Flores"
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-black">Albert Flores</div>
                      <div className="text-sm text-black">flores@doe.io</div>
                    </div>
                  </div>
                </div>

                <button className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-50 flex items-center space-x-2">
                  <User className="h-4 w-4 text-black" />
                  <span>My Profile</span>
                </button>

                <button className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-50 flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-black" />
                  <span>Account Settings</span>
                </button>

                <button className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-50 flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-black" />
                  <span>Activity Log</span>
                </button>

                <div className="sm:hidden">
                  <button className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-50 flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-black" />
                    <span>Notifications</span>
                  </button>

                  <button className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-50 flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4 text-black" />
                    <span>Messages</span>
                  </button>

                  <button className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-50 flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-black" />
                    <span>Settings</span>
                  </button>
                </div>

                <div className="border-t my-1"></div>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                >
                  <LogOut className="h-4 w-4 text-red-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

