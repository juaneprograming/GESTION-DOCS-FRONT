import Link from "next/link"
import { LayoutDashboard, Activity, CreditCard, FileText, Bell, Receipt, HelpCircle, Settings } from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Activity, label: "Activities", href: "/activities" },
  { icon: CreditCard, label: "Card", href: "/card" },
  { icon: FileText, label: "Report", href: "/report" },
  { icon: Bell, label: "Notifications", href: "/notifications", badge: 4 },
  { icon: Receipt, label: "Billing", href: "/billing" },
  { icon: FileText, label: "Invoices", href: "/invoices" },
  { icon: HelpCircle, label: "Help Center", href: "/help" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-gray-50 border-r p-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-blue-500 rounded-lg" />
        <div>
          <h2 className="font-semibold">Ficecorp</h2>
          <p className="text-sm text-muted-foreground">Finance Apps</p>
        </div>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  )
}

