import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const LowStockTable = ({ limit = 5 }) => {
  const { data: lowStockItems, isLoading } = useQuery({
    queryKey: ["/api/ingredients/low-stock"]
  })

  return (
    <Card className="border-0 shadow-sm h-full">
      <CardHeader className="bg-white flex flex-row items-center justify-between">
        <CardTitle className="text-base text-[#6B4226]">
          Low Stock Items
        </CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  Item
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  Current Stock
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-center">
                    Loading...
                  </td>
                </tr>
              ) : lowStockItems && lowStockItems.length > 0 ? (
                lowStockItems.slice(0, limit).map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">Ingredients</td>
                    <td className="px-4 py-3">
                      {item.quantity} {item.measurement}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge
                        variant="outline"
                        className={
                          item.status === "low"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }
                      >
                        {item.status === "low" ? "Low Stock" : "Critical"}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-center">
                    No low stock items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default LowStockTable

