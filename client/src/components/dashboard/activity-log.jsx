import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { format, subDays, isToday, isYesterday } from "date-fns"

const formatActivityTime = timestamp => {
  if (isToday(new Date(timestamp))) {
    return format(new Date(timestamp), "h:mm a")
  } else if (isYesterday(new Date(timestamp))) {
    return "Yesterday"
  } else {
    return format(new Date(timestamp), "MMM d")
  }
}

const getActionIcon = action => {
  if (action.includes("CREATED") || action.includes("ADDED")) {
    return { icon: "bi-plus-lg", bgColor: "bg-success" }
  } else if (action.includes("UPDATED") || action.includes("EDITED")) {
    return { icon: "bi-pencil", bgColor: "bg-info" }
  } else if (action.includes("DELETED") || action.includes("REMOVED")) {
    return { icon: "bi-trash", bgColor: "bg-danger" }
  } else if (action.includes("WARNING") || action.includes("ALERT")) {
    return { icon: "bi-exclamation-triangle", bgColor: "bg-warning" }
  } else {
    return { icon: "bi-check-circle", bgColor: "bg-primary" }
  }
}

const getUsername = activityLog => {
  
  // Mock user data
  const users = [
    { id: 1, name: "Admin User" },
    { id: 2, name: "Sarah Johnson" },
    { id: 3, name: "John Smith" }
  ]

  const user = users.find(u => u.id === activityLog.userId)
  return user ? user.name : "System"
}

const ActivityLogComponent = ({ limit = 5 }) => {
  const [timeFilter, setTimeFilter] = useState("Today")

  const getTimeRange = () => {
    const now = new Date()
    switch (timeFilter) {
      case "Today":
        return { start: subDays(now, 1), end: now }
      case "Yesterday":
        return { start: subDays(now, 2), end: subDays(now, 1) }
      case "This Week":
        return { start: subDays(now, 7), end: now }
      case "This Month":
        return { start: subDays(now, 30), end: now }
      default:
        return { start: subDays(now, 1), end: now }
    }
  }

  const { data: activityLogs, isLoading } = useQuery({
    queryKey: ["/api/activity-logs/recent"]
  })

  const filteredLogs =
    activityLogs?.filter(log => {
      const timestamp = new Date(log.timestamp)
      const range = getTimeRange()
      return timestamp >= range.start && timestamp <= range.end
    }) || []

  return (
    <Card className="border-0 shadow-sm h-full">
      <CardHeader className="bg-white flex flex-row items-center justify-between">
        <CardTitle className="text-base text-[#6B4226]">
          Recent Activity
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {timeFilter} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTimeFilter("Today")}>
              Today
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeFilter("Yesterday")}>
              Yesterday
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeFilter("This Week")}>
              This Week
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeFilter("This Month")}>
              This Month
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : filteredLogs.length > 0 ? (
            filteredLogs.slice(0, limit).map(log => {
              const { icon, bgColor } = getActionIcon(log.actionType)
              return (
                <div key={log.id} className="flex items-center p-4">
                  <div className="mr-3">
                    <span
                      className={`inline-flex items-center justify-center p-2 rounded-full ${bgColor}`}
                    >
                      <i className={`bi ${icon} text-white`}></i>
                    </span>
                  </div>
                  <div className="flex-grow-1 flex justify-between w-full">
                    <div>
                      <p className="mb-0">
                        <span className="font-medium">{getUsername(log)}</span>{" "}
                        {log.description.split(":")[0]}
                      </p>
                      <p className="text-muted text-sm mb-0">
                        {log.description.split(":")[1] || ""}
                      </p>
                    </div>
                    <small className="text-muted">
                      {formatActivityTime(log.timestamp)}
                    </small>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-4 text-center">No recent activity</div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-white text-center">
        <Button variant="link" className="w-full">
          View All Activity
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ActivityLogComponent

