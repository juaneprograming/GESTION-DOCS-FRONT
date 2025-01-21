import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"
// import { Breadcrumb } from "@/app/componentes/breadcrumb"

// Helper function to format GB values
function formatGB(value) {
  return `${value.toLocaleString()} GB`
}

// Helper function to format percentage with sign
function formatPercentage(value) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(2)}%`
}

export default function Dashboard() {
  const metrics = [
    {
      title: "Total Images",
      value: 36476,
      percentage: 32,
      change: 32.4,
      period: "last month",
    },
    {
      title: "Total Videos",
      value: 53406,
      percentage: 48,
      change: -18.45,
      period: "last month",
    },
    {
      title: "Total Documents",
      value: 90875,
      percentage: 89,
      change: 20.34,
      period: "last month",
    },
    {
      title: "Total Musics",
      value: 63076,
      percentage: 54,
      change: 14.45,
      period: "last month",
    },
  ]

  const monthlyData = [
    { month: "Jan", images: 5000, videos: 2000, documents: 1000, musics: 1500 },
    { month: "Feb", images: 8000, videos: 3000, documents: 2000, musics: 2500 },
    { month: "Mar", images: 7000, videos: 4000, documents: 3000, musics: 3000 },
    { month: "Apr", images: 6000, videos: 3500, documents: 2500, musics: 2000 },
    { month: "May", images: 7500, videos: 4500, documents: 3500, musics: 2500 },
    { month: "Jun", images: 8500, videos: 5000, documents: 4000, musics: 3000 },
    { month: "Jul", images: 9000, videos: 5500, documents: 4500, musics: 3500 },
    { month: "Aug", images: 8000, videos: 5000, documents: 4000, musics: 3000 },
    { month: "Sep", images: 7500, videos: 4500, documents: 3500, musics: 2500 },
    { month: "Oct", images: 7000, videos: 4000, documents: 3000, musics: 2000 },
    { month: "Nov", images: 6500, videos: 3500, documents: 2500, musics: 1500 },
    { month: "Dec", images: 8000, videos: 4500, documents: 3500, musics: 2500 },
  ]

  return (
    <div className="p-6">
      {/* <Breadcrumb /> */}

      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardContent className="p-6">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{formatGB(metric.value)}</p>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center ${metric.change > 0 ? "text-green-500" : "text-red-500"}`}>
                        {metric.change > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        <span className="font-medium">{formatPercentage(metric.change)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{metric.period}</span>
                    </div>
                  </div>
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        className="text-muted stroke-current"
                        strokeWidth="5"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="32"
                        cy="32"
                      />
                      <circle
                        className={
                          metric.title.includes("Documents")
                            ? "text-red-500 stroke-current"
                            : "text-blue-500 stroke-current"
                        }
                        strokeWidth="5"
                        strokeDasharray={`${metric.percentage * 1.88} 188.4`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="32"
                        cy="32"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Storage Chart */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Total Storage used</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">105,000 GB</span>
                  <div className="flex items-center text-green-500">
                    <ArrowUp className="w-4 h-4" />
                    <span>32.40%</span>
                  </div>
                  <span className="text-sm text-muted-foreground">last year</span>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <div className="flex items-end justify-between h-full w-full">
                  {monthlyData.map((data) => (
                    <div key={data.month} className="w-16 flex flex-col items-center gap-2">
                      <div className="w-full bg-blue-500" style={{ height: `${data.images / 100}px` }} />
                      <div className="w-full bg-blue-400" style={{ height: `${data.videos / 100}px` }} />
                      <div className="w-full bg-blue-300" style={{ height: `${data.documents / 100}px` }} />
                      <div className="w-full bg-blue-200" style={{ height: `${data.musics / 100}px` }} />
                      <span className="text-sm text-muted-foreground">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Image</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400" />
                  <span className="text-sm">Video</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-300" />
                  <span className="text-sm">Documents</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-200" />
                  <span className="text-sm">Musics</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-8">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="70"
                    cx="80"
                    cy="80"
                  />
                  <circle
                    className="text-blue-500 stroke-current"
                    strokeWidth="8"
                    strokeDasharray={`${78 * 4.4} 440`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="70"
                    cx="80"
                    cy="80"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">78 GB</span>
                  <span className="text-sm text-muted-foreground">Used of 100</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-100" />
                    <span className="text-sm">Available storage</span>
                  </div>
                  <span className="font-medium">22%</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm">Total used storage</span>
                  </div>
                  <span className="font-medium">78%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

