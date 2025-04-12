import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const COLORS = ["#6B4226", "#4CAF50", "#FF9800", "#F44336", "#8D6E63"]

// Mock data for charts
const stockTrendData = [
  { day: "1", coffee: 400, milk: 240, sugar: 320 },
  { day: "5", coffee: 380, milk: 220, sugar: 290 },
  { day: "10", coffee: 310, milk: 280, sugar: 270 },
  { day: "15", coffee: 260, milk: 250, sugar: 300 },
  { day: "20", coffee: 320, milk: 230, sugar: 280 },
  { day: "25", coffee: 290, milk: 270, sugar: 250 },
  { day: "30", coffee: 350, milk: 240, sugar: 290 }
]

const categoryData = [
  { name: "Beverages", value: 35 },
  { name: "Food", value: 28 },
  { name: "Ingredients", value: 20 },
  { name: "Supplies", value: 17 }
]

export const CategoryDonutChart = () => {
  return (
    <Card className="border-0 shadow-sm h-full">
      <CardHeader className="pb-0 bg-white">
        <CardTitle className="text-base text-[#6B4226]">
          Café Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={value => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="bg-white pt-0 flex justify-between text-xs">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-[#6B4226] mr-1"></span>
          <span>Beverages (35%)</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-[#4CAF50] mr-1"></span>
          <span>Food (28%)</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-[#FF9800] mr-1"></span>
          <span>Other (37%)</span>
        </div>
      </CardFooter>
    </Card>
  )
}

export const StockTrendChart = () => {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <Card className="border-0 shadow-sm h-full">
      <CardHeader className="pb-0 bg-white flex flex-row items-center justify-between">
        <CardTitle className="text-base text-[#6B4226]">
          30-Day Stock Level Trend
        </CardTitle>
        <div className="flex items-center space-x-1">
          <Button
            variant={timeRange === "30d" ? "secondary" : "outline"}
            onClick={() => setTimeRange("30d")}
            size="sm"
            className="h-8 px-3"
          >
            30d
          </Button>
          <Button
            variant={timeRange === "60d" ? "secondary" : "outline"}
            onClick={() => setTimeRange("60d")}
            size="sm"
            className="h-8 px-3"
          >
            60d
          </Button>
          <Button
            variant={timeRange === "90d" ? "secondary" : "outline"}
            onClick={() => setTimeRange("90d")}
            size="sm"
            className="h-8 px-3"
          >
            90d
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stockTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="coffee"
                stroke="#6B4226"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="milk" stroke="#8D6E63" />
              <Line type="monotone" dataKey="sugar" stroke="#4CAF50" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

