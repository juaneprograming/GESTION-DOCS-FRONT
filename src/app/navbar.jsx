import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function Navbar() {
  return (
    <div className="relative w-full max-w-2xl mb-8">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input type="search" placeholder="Search your page..." className="pl-10 pr-16" />
      <Badge variant="secondary" className="absolute right-3 top-1/2 transform -translate-y-1/2">
        ⌘K
      </Badge>
    </div>
  )
}

