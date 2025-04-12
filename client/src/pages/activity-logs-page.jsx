import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ActivityLogsPage() {
  const { data: logs = [] } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: () => fetch("/api/activity-logs").then((res) => res.json()),
  });

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Activity Logs</h1>
      <div className="grid gap-4">
        {logs.map((log, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {log.action}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                By {log.user} at {new Date(log.timestamp).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

