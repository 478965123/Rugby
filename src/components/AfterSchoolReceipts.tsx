import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { CalendarIcon, Search, Download, Filter, Eye, Mail, FileText, Receipt, Users } from "lucide-react"
import { format } from "date-fns"
import { InternalEmailManagement } from "./InternalEmailManagement"

interface AfterSchoolReceipt {
  id: string
  receiptNumber: string
  parentName: string
  studentName: string
  studentId: string
  activities: string[]
  totalAmount: number
  paymentMethod: string
  transactionDate: Date
  paymentType: "single" | "complete"
  downloadCount: number
  isExternal: boolean
}

const mockReceipts: AfterSchoolReceipt[] = [
  {
    id: "1",
    receiptNumber: "AS-RCP-2025-001234",
    parentName: "Jennifer Wilson",
    studentName: "Emma Wilson",
    studentId: "EXT001234",
    activities: ["Swimming - Beginner", "Art & Craft"],
    totalAmount: 500,
    paymentMethod: "Credit Card",
    transactionDate: new Date("2025-08-15"),
    paymentType: "complete",
    status: "issued",
    downloadCount: 2,
    isExternal: true
  },
  {
    id: "2",
    receiptNumber: "AS-RCP-2025-001235",
    parentName: "David Chen",
    studentName: "Alex Chen",
    studentId: "ST001235",
    activities: ["Football Training"],
    totalAmount: 250,
    paymentMethod: "PromptPay",
    transactionDate: new Date("2025-08-14"),
    paymentType: "single",
    status: "issued",
    downloadCount: 1,
    isExternal: false
  },
  {
    id: "3",
    receiptNumber: "AS-RCP-2025-001236",
    parentName: "Sarah Thompson",
    studentName: "Lily Thompson",
    studentId: "EXT001236",
    activities: ["Drama Club", "Music Theory"],
    totalAmount: 480,
    paymentMethod: "Bank Counter",
    transactionDate: new Date("2025-08-13"),
    paymentType: "complete",
    status: "resent",
    downloadCount: 0,
    isExternal: true
  },
  {
    id: "4",
    receiptNumber: "AS-RCP-2025-001237",
    parentName: "Michael Brown",
    studentName: "James Brown",
    studentId: "ST001237",
    activities: ["Basketball Skills"],
    totalAmount: 220,
    paymentMethod: "WeChat Pay",
    transactionDate: new Date("2025-08-12"),
    paymentType: "single",
    status: "issued",
    downloadCount: 3,
    isExternal: false
  },
  {
    id: "5",
    receiptNumber: "AS-RCP-2025-001238",
    parentName: "Amanda Lee",
    studentName: "Sophie Lee",
    studentId: "EXT001238",
    activities: ["Piano Lessons", "Chess Club"],
    totalAmount: 620,
    paymentMethod: "Credit Card",
    transactionDate: new Date("2025-08-11"),
    paymentType: "complete",
    status: "failed",
    downloadCount: 0,
    isExternal: true
  }
]

export function AfterSchoolReceipts() {
  const [receipts] = useState<AfterSchoolReceipt[]>(mockReceipts)
  const [filteredReceipts, setFilteredReceipts] = useState<AfterSchoolReceipt[]>(mockReceipts)
  const [searchTerm, setSearchTerm] = useState("")
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all")
  const [parentTypeFilter, setParentTypeFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date | null>(null)
  const [dateTo, setDateTo] = useState<Date | null>(null)

  const applyFilters = () => {
    let filtered = receipts

    if (searchTerm) {
      filtered = filtered.filter(receipt => 
        receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.activities.some(activity => 
          activity.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(receipt => receipt.status === statusFilter)
    }

    if (paymentTypeFilter !== "all") {
      filtered = filtered.filter(receipt => receipt.paymentType === paymentTypeFilter)
    }

    if (parentTypeFilter !== "all") {
      filtered = filtered.filter(receipt => 
        parentTypeFilter === "external" ? receipt.isExternal : !receipt.isExternal
      )
    }

    if (dateFrom) {
      filtered = filtered.filter(receipt => receipt.transactionDate >= dateFrom)
    }

    if (dateTo) {
      filtered = filtered.filter(receipt => receipt.transactionDate <= dateTo)
    }

    setFilteredReceipts(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setPaymentTypeFilter("all")
    setParentTypeFilter("all")
    setDateFrom(null)
    setDateTo(null)
    setFilteredReceipts(receipts)
  }

  const downloadReceipt = (receiptId: string) => {
    console.log("Downloading receipt", receiptId)
    // In a real app, this would generate and download PDF
  }

  const resendReceipt = (receiptId: string) => {
    console.log("Resending receipt via email", receiptId)
    // In a real app, this would resend receipt email
  }

  const viewReceipt = (receiptId: string) => {
    console.log("Viewing receipt", receiptId)
    // In a real app, this would open receipt in modal or new tab
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "issued":
        return <Badge className="bg-green-100 text-green-800">Issued</Badge>
      case "resent":
        return <Badge className="bg-blue-100 text-blue-800">Resent</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentTypeBadge = (paymentType: string) => {
    return paymentType === "complete" 
      ? <Badge variant="default">Complete Package</Badge>
      : <Badge variant="outline">Single Activity</Badge>
  }

  const summaryStats = {
    total: receipts.length,
    issued: receipts.filter(r => r.status === "issued").length,
    resent: receipts.filter(r => r.status === "resent").length,
    failed: receipts.filter(r => r.status === "failed").length,
    totalDownloads: receipts.reduce((sum, r) => sum + r.downloadCount, 0),
    externalParents: receipts.filter(r => r.isExternal).length,
    totalRevenue: receipts.reduce((sum, r) => sum + r.totalAmount, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">After School Receipt Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage receipts and internal email notifications
          </p>
        </div>
      </div>

      <Tabs defaultValue="receipts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="receipts" className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Receipt Management
          </TabsTrigger>
          <TabsTrigger value="whitelist" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Internal Email Whitelist
          </TabsTrigger>
        </TabsList>

        <TabsContent value="receipts" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-medium">Receipt Management</h3>
              <p className="text-sm text-muted-foreground">
                View and download after school activity payment receipts
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Bulk Resend
              </Button>
              <Button className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export All
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {summaryStats.externalParents} from external parents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Successfully Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summaryStats.issued}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((summaryStats.issued / summaryStats.total) * 100)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{summaryStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From after school activities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalDownloads}</div>
            <p className="text-xs text-muted-foreground">
              Avg {(summaryStats.totalDownloads / summaryStats.total).toFixed(1)} per receipt
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Receipt, parent, student, activity"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="issued">Issued</SelectItem>
                  <SelectItem value="resent">Resent</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Type</label>
              <Select value={paymentTypeFilter} onValueChange={setPaymentTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="single">Single Activity</SelectItem>
                  <SelectItem value="complete">Complete Package</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Parent Type</label>
              <Select value={parentTypeFilter} onValueChange={setParentTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Parents</SelectItem>
                  <SelectItem value="internal">SISB Parents</SelectItem>
                  <SelectItem value="external">External Parents</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {dateFrom ? format(dateFrom, "MM/dd") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFrom || undefined}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {dateTo ? format(dateTo, "MM/dd") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateTo || undefined}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={clearFilters}>Clear All</Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredReceipts.length} of {receipts.length} receipts
        </p>
      </div>

      {/* Receipt Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt Number</TableHead>
                <TableHead>Parent & Student</TableHead>
                <TableHead>Activities</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReceipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-mono text-sm">
                    {receipt.receiptNumber}
                    {receipt.isExternal && <Badge variant="secondary" className="ml-2 text-xs">External</Badge>}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{receipt.parentName}</div>
                      <div className="text-sm text-muted-foreground">
                        {receipt.studentName} ({receipt.studentId})
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {receipt.activities.slice(0, 2).map((activity, index) => (
                        <Badge key={index} variant="outline" className="block w-fit text-xs">
                          {activity}
                        </Badge>
                      ))}
                      {receipt.activities.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{receipt.activities.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>฿{receipt.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{receipt.paymentMethod}</TableCell>
                  <TableCell>{getPaymentTypeBadge(receipt.paymentType)}</TableCell>
                  <TableCell>{format(receipt.transactionDate, "MMM dd, yyyy")}</TableCell>
                  <TableCell>{getStatusBadge(receipt.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {receipt.downloadCount} times
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => viewReceipt(receipt.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => downloadReceipt(receipt.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => resendReceipt(receipt.id)}
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Activity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Activities</CardTitle>
            <p className="text-sm text-muted-foreground">Based on receipt volume</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { activity: "Swimming - Beginner", receipts: 8, revenue: 2400 },
                { activity: "Football Training", receipts: 6, revenue: 1500 },
                { activity: "Art & Craft", receipts: 5, revenue: 1000 },
                { activity: "Piano Lessons", receipts: 4, revenue: 1600 },
                { activity: "Basketball Skills", receipts: 3, revenue: 660 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.activity}</div>
                    <div className="text-sm text-muted-foreground">{item.receipts} receipts</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">฿{item.revenue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>External vs Internal Parents</CardTitle>
            <p className="text-sm text-muted-foreground">Revenue comparison</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">SISB Parents</div>
                  <div className="text-sm text-muted-foreground">
                    {receipts.filter(r => !r.isExternal).length} receipts
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    ฿{receipts.filter(r => !r.isExternal).reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round((receipts.filter(r => !r.isExternal).reduce((sum, r) => sum + r.totalAmount, 0) / summaryStats.totalRevenue) * 100)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">External Parents</div>
                  <div className="text-sm text-muted-foreground">
                    {receipts.filter(r => r.isExternal).length} receipts
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    ฿{receipts.filter(r => r.isExternal).reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round((receipts.filter(r => r.isExternal).reduce((sum, r) => sum + r.totalAmount, 0) / summaryStats.totalRevenue) * 100)}%
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm">
                  <strong>Insight:</strong> External parents represent {Math.round((summaryStats.externalParents / summaryStats.total) * 100)}% of receipts and contribute significantly to after school revenue.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="whitelist">
          <InternalEmailManagement 
            title="After School Receipt Email Whitelist"
            description="Manage internal staff emails who receive after school receipt notifications"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}