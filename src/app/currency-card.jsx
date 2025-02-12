import { Card, CardContent } from "@/components/ui/card"
import { Plus } from 'lucide-react'

export function CurrencyCard({ currency, amount, code }) {
  return (
    <div className="relative">
      <Card className="w-full">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium">{currency}</span>
            </div>
            <div>
              <p className="text-2xl font-semibold">{amount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{code}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {code === "GBP" && (
        <button className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}

