import { Card } from "@/components/ui/card"

export function CreditCard({ number, type, variant = "primary" }) {
  return (
    <Card className={`w-full h-48 p-6 flex flex-col justify-between ${variant === "primary" ? "bg-blue-500 text-white" : "bg-gray-100"}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Ficecorp</h3>
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20" />
          <div className="w-8 h-8 rounded-full bg-white/40" />
        </div>
      </div>
      <div>
        <p className="text-sm mb-1">PREMIUM CARD</p>
        <p className="text-xl font-mono">{number}</p>
      </div>
    </Card>
  )
}

