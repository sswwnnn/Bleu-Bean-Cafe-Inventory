import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function DataTable({
  title,
  data,
  columns,
  isLoading = false,
  filterKey,
  filterOptions,
  searchPlaceholder = "Search...",
  onEdit,
  onDelete,
  onAdd,
  renderBadge
}) {
  const { user } = useAuth()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  const canModify = user?.role === "admin" || user?.role === "staff"
  const canDelete = user?.role === "admin"

  const filteredData = data.filter(item => {
    const searchMatch =
      search === "" ||
      Object.values(item).some(value =>
        String(value)
          .toLowerCase()
          .includes(search.toLowerCase())
      )

    const filterMatch =
      filter === "all" || (filterKey && String(item[filterKey]) === filter)

    return searchMatch && filterMatch
  })

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="bg-white flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-[#6B4226]">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {user?.role === "admin" && onAdd && (
            <Button onClick={onAdd} size="sm">
              <PlusCircle className="h-4 w-4 mr-2" /> Add New
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          {filterOptions && filterKey && (
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {filterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">#</th>
                {columns.map(column => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left font-medium"
                  >
                    {column.header}
                  </th>
                ))}
                {(canModify || renderBadge) && (
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length + 2}
                    className="px-4 py-6 text-center"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 2}
                    className="px-4 py-6 text-center"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    {columns.map(column => (
                      <td key={column.key} className="px-4 py-3">
                        {column.render ? (
                          column.render(item[column.key], item)
                        ) : (
                          <span>{String(item[column.key])}</span>
                        )}
                      </td>
                    ))}

                    {(canModify || renderBadge) && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {renderBadge && (
                            <Badge variant={renderBadge(item).variant}>
                              {renderBadge(item).text}
                            </Badge>
                          )}

                          {canModify && onEdit && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(item)}
                            >
                              <i className="bi bi-pencil me-1"></i> Edit
                            </Button>
                          )}

                          {canDelete && onDelete && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => onDelete(item)}
                            >
                              <i className="bi bi-trash me-1"></i> Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

