import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const MetricCard = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  trend,
  valueColor = "text-[#6B4226]"
}) => {
  return (
    <Card className="border-0 shadow-sm h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-muted text-sm">{title}</div>
            <h3 className={cn("mb-0 mt-1 text-2xl font-semibold", valueColor)}>
              {value}
            </h3>
          </div>
          <div className={cn("rounded-full p-2", iconBgColor)}>
            <i className={cn(`bi ${icon} text-xl`, iconColor)}></i>
          </div>
        </div>

        {trend && (
          <div className="mt-3">
            <span
              className={cn(
                "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                trend.isPositive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              {trend.value}
              <i
                className={cn(
                  "ml-1",
                  trend.isPositive ? "bi-arrow-up" : "bi-arrow-down"
                )}
              ></i>
            </span>
            <span className="text-muted text-xs ml-1">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MetricCard

