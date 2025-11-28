import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Label } from "./ui/label"
import {
  Search,
  Filter,
  CalendarIcon,
  User,
  FileEdit,
  Trash2,
  Plus,
  Mail,
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { format } from "date-fns"

interface ActivityLog {
  id: string
  timestamp: Date
  user: string
  userId: string
  action: "create" | "update" | "delete" | "send_email" | "download"
  module: string
  target: string
  targetId: string
  details: string
  ipAddress: string
}

// Generate mock activity logs
const generateMockLogs = (): ActivityLog[] => {
  const users = [
    { name: "John Smith", id: "john.smith" },
    { name: "David Wilson", id: "david.wilson" },
    { name: "Sarah Johnson", id: "sarah.johnson" }
  ]

  const modules = [
    "Invoice", "Receipt", "Payment History", "User Management",
    "Semester Settings", "Debt Reminders", "Payment Transactions"
  ]

  const actions: ActivityLog["action"][] = ["create", "update", "delete", "send_email", "download"]

  const logs: ActivityLog[] = []

  for (let i = 1; i <= 100; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const module = modules[Math.floor(Math.random() * modules.length)]
    let action = actions[Math.floor(Math.random() * actions.length)]

    // Skip delete action for modules that cannot be deleted
    const nonDeletableModules = ["Invoice", "Receipt", "Payment History", "Payment Transactions"]
    if (action === "delete" && nonDeletableModules.includes(module)) {
      // Change to update instead
      action = "update"
    }

    const date = new Date()
    date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 10000))

    let details = ""
    let target = ""
    let targetId = ""

    switch (action) {
      case "create":
        if (module === "Invoice") {
          targetId = `INV-2025-${String(i).padStart(6, '0')}`
          target = `Invoice ${targetId}`
          const studentId = `ST${String(i).padStart(6, '0')}`
          const amounts = ["฿42,000", "฿125,000", "฿85,000"]
          const amount = amounts[Math.floor(Math.random() * amounts.length)]
          details = `Created new invoice ${targetId} for student ${studentId}, Amount: ${amount}`
        } else if (module === "User Management") {
          targetId = `user-${i}`
          target = `User account`
          const userNames = ["John Smith", "Sarah Wilson", "David Brown"]
          const userName = userNames[Math.floor(Math.random() * userNames.length)]
          details = `Created new user account for ${userName} with role "Viewer"`
        } else if (module === "Receipt") {
          targetId = `RCP-2025-${String(i).padStart(6, '0')}`
          target = `Receipt ${targetId}`
          const invoiceId = `INV-2025-${String(i).padStart(6, '0')}`
          details = `Created new receipt ${targetId} for invoice ${invoiceId}`
        } else if (module === "Semester Settings") {
          target = "Term settings"
          details = `Created new term "Term 1 2025-2026" with deadline December 20, 2025`
        } else if (module === "Payment History") {
          targetId = `PAY-2025-${String(i).padStart(6, '0')}`
          target = `Payment record ${targetId}`
          const studentId = `ST${String(i).padStart(6, '0')}`
          const invoiceId = `INV-2025-${String(i).padStart(6, '0')}`
          const amount = "฿42,000"
          details = `Created payment record ${targetId} for student ${studentId}, Invoice: ${invoiceId}, Amount: ${amount}`
        } else if (module === "Payment Transactions") {
          targetId = `TXN-2025-${String(i).padStart(6, '0')}`
          target = `Transaction ${targetId}`
          const methods = ["Credit Card", "QR Payment", "Bank Transfer"]
          const method = methods[Math.floor(Math.random() * methods.length)]
          const amount = "฿42,000"
          details = `Created transaction ${targetId}, Payment method: ${method}, Amount: ${amount}`
        } else if (module === "Debt Reminders") {
          targetId = `REMINDER-${String(i).padStart(4, '0')}`
          target = `Reminder template`
          const templates = ["First Reminder", "Second Reminder", "Final Notice"]
          const template = templates[Math.floor(Math.random() * templates.length)]
          details = `Created reminder template "${template}" (${targetId}), Send after: 7 days overdue`
        }
        break
      case "update":
        if (module === "Invoice") {
          targetId = `INV-2025-${String(i).padStart(6, '0')}`
          target = `Invoice ${targetId}`
          const oldStatuses = ["unpaid", "pending", "overdue"]
          const newStatuses = ["paid", "partially_paid", "cancelled"]
          const oldStatus = oldStatuses[Math.floor(Math.random() * oldStatuses.length)]
          const newStatus = newStatuses[Math.floor(Math.random() * newStatuses.length)]
          details = `Updated invoice ${targetId} status from "${oldStatus}" to "${newStatus}"`
        } else if (module === "Semester Settings") {
          target = "Term 1 settings"
          const oldDate = "December 15, 2025"
          const newDate = "December 20, 2025"
          details = `Updated payment deadline from "${oldDate}" to "${newDate}"`
        } else if (module === "User Management") {
          targetId = `user-${i}`
          target = `User account`
          const userName = "John Smith"
          details = `Updated user "${userName}" role from "Viewer" to "Administrator"`
        } else if (module === "Receipt") {
          targetId = `RCP-2025-${String(i).padStart(6, '0')}`
          target = `Receipt ${targetId}`
          const oldAmount = "฿42,000"
          const newAmount = "฿45,000"
          details = `Updated receipt ${targetId} amount from "${oldAmount}" to "${newAmount}"`
        } else if (module === "Payment History") {
          targetId = `PAY-2025-${String(i).padStart(6, '0')}`
          target = `Payment record ${targetId}`
          const oldStatus = "pending"
          const newStatus = "completed"
          details = `Updated payment ${targetId} status from "${oldStatus}" to "${newStatus}"`
        } else if (module === "Payment Transactions") {
          targetId = `TXN-2025-${String(i).padStart(6, '0')}`
          target = `Transaction ${targetId}`
          const oldStatus = "pending"
          const newStatus = "success"
          details = `Updated transaction ${targetId} status from "${oldStatus}" to "${newStatus}"`
        } else if (module === "Debt Reminders") {
          targetId = `REMINDER-${String(i).padStart(4, '0')}`
          target = `Reminder template`
          const oldDays = "7 days"
          const newDays = "10 days"
          details = `Updated reminder template ${targetId}, Send after changed from "${oldDays}" to "${newDays}"`
        }
        break
      case "delete":
        if (module === "User Management") {
          targetId = `user-${i}`
          target = `User account`
          const userNames = ["John Doe", "Jane Smith", "Mike Wilson"]
          const userName = userNames[Math.floor(Math.random() * userNames.length)]
          details = `Deleted user account "${userName}" (${targetId})`
        } else if (module === "Semester Settings") {
          target = `Term settings`
          details = `Deleted term "Summer 2025" configuration`
        } else if (module === "Debt Reminders") {
          targetId = `REMINDER-${String(i).padStart(4, '0')}`
          target = `Reminder template`
          details = `Deleted reminder template "${targetId}" - "Overdue Payment Reminder"`
        }
        break
      case "send_email":
        targetId = `INV-2025-${String(i).padStart(6, '0')}`
        target = `Invoice ${targetId}`
        details = `Sent invoice email to parent@example.com`
        break
      case "download":
        targetId = `RCP-2025-${String(i).padStart(6, '0')}`
        target = `Receipt ${targetId}`
        details = `Downloaded receipt PDF`
        break
    }

    logs.push({
      id: i.toString(),
      timestamp: date,
      user: user.name,
      userId: user.id,
      action,
      module,
      target,
      targetId,
      details,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`
    })
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

const mockLogs: ActivityLog[] = generateMockLogs()

export function ActivityLog() {
  const [logs, setLogs] = useState<ActivityLog[]>(mockLogs)
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>(mockLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [userFilter, setUserFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("all")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date | null>(null)
  const [dateTo, setDateTo] = useState<Date | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  const applyFilters = () => {
    let filtered = logs

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.targetId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (userFilter !== "all") {
      filtered = filtered.filter(log => log.userId === userFilter)
    }

    if (actionFilter !== "all") {
      filtered = filtered.filter(log => log.action === actionFilter)
    }

    if (moduleFilter !== "all") {
      filtered = filtered.filter(log => log.module === moduleFilter)
    }

    if (dateFrom) {
      filtered = filtered.filter(log => log.timestamp >= dateFrom)
    }

    if (dateTo) {
      const endOfDay = new Date(dateTo)
      endOfDay.setHours(23, 59, 59, 999)
      filtered = filtered.filter(log => log.timestamp <= endOfDay)
    }

    setFilteredLogs(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setUserFilter("all")
    setActionFilter("all")
    setModuleFilter("all")
    setDateFrom(null)
    setDateTo(null)
    setFilteredLogs(logs)
    setCurrentPage(1)
  }

  const getActionBadge = (action: ActivityLog["action"]) => {
    switch (action) {
      case "create":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1"><Plus className="w-3 h-3" />Create</Badge>
      case "update":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex items-center gap-1"><FileEdit className="w-3 h-3" />Update</Badge>
      case "delete":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1"><Trash2 className="w-3 h-3" />Delete</Badge>
      case "send_email":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 flex items-center gap-1"><Mail className="w-3 h-3" />Send Email</Badge>
      case "download":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 flex items-center gap-1"><Download className="w-3 h-3" />Download</Badge>
      default:
        return <Badge variant="secondary">{action}</Badge>
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPageLogs = filteredLogs.slice(startIndex, endIndex)

  const uniqueUsers = Array.from(new Set(logs.map(log => log.userId))).map(userId => {
    const log = logs.find(l => l.userId === userId)
    return { id: userId, name: log?.user || userId }
  })

  const modules = Array.from(new Set(logs.map(log => log.module)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Activity Log</h2>
        <p className="text-muted-foreground">
          Track all user actions and system activities
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="User, target, details, or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* User Filter */}
            <div className="space-y-2">
              <Label>User</Label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Filter */}
            <div className="space-y-2">
              <Label>Action</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="send_email">Send Email</SelectItem>
                  <SelectItem value="download">Download</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Module Filter */}
            <div className="space-y-2">
              <Label>Module</Label>
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  {modules.map((module) => (
                    <SelectItem key={module} value={module}>
                      {module}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Items per page */}
            <div className="space-y-2">
              <Label>Show</Label>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                setItemsPerPage(parseInt(value))
                setCurrentPage(1)
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFrom || undefined}
                    onSelect={(date) => setDateFrom(date || null)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateTo || undefined}
                    onSelect={(date) => setDateTo(date || null)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={clearFilters}>Clear All</Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} activities
          {filteredLogs.length !== logs.length && (
            <span> (filtered from {logs.length} total)</span>
          )}
        </p>
      </div>

      {/* Activity Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">
                    {format(log.timestamp, "MMM dd, yyyy HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{log.user}</div>
                        <div className="text-xs text-muted-foreground">{log.userId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.module}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{log.target}</div>
                    {log.targetId && (
                      <div className="text-xs text-muted-foreground font-mono">{log.targetId}</div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="text-sm">{log.details}</div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {log.ipAddress}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No activity logs found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber
              if (totalPages <= 5) {
                pageNumber = i + 1
              } else if (currentPage <= 3) {
                pageNumber = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i
              } else {
                pageNumber = currentPage - 2 + i
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
