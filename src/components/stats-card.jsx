import { Card } from "@/components/ui/card"

export function StatsCard({ stat }) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-medium text-muted-foreground">{stat.title}</div>
          <div className="text-2xl font-bold mt-2">{stat.value}</div>
          <div
            className={`text-sm mt-2 ${
              stat.trend === "up" ? "text-green-500" : "text-red-500"
            }`}
          >
            {stat.change} last month
          </div>
        </div>
        <div className="relative w-16 h-16">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-primary/10"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${stat.percent * 1.76} 176`}
              className="text-primary"
            />
          </svg>
        </div>
      </div>
    </Card>
  )
}

