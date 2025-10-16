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
import { CalendarIcon, Search, Download, Filter, Eye, Mail, Receipt, Users, Sun, Clock, Users as UsersIcon } from "lucide-react"
import { format } from "date-fns"
import { InternalEmailManagement } from "./InternalEmailManagement"

interface SummerActivityReceipt {
  id: string
  receiptNumber: string
  activityName: string
  activityType: "camp" | "workshop" | "sports" | "art" | "language" | "stem"
  duration: string
  ageGroup: string
  participantName: string
  participantAge: number
  parentName: string
  amount: number
  paymentMethod: string
  transactionDate: Date
  status: "issued" | "resent" | "failed"
  downloadCount: number
  sessionTimes: string
  isEarlyBird: boolean
}

const mockReceipts: SummerActivityReceipt[] = [
  {
    id: "1",
    receiptNumber: "SUM-RCP-2025-001234",
    activityName: "Creative Arts Camp",
    activityType: "art",
    duration: "2 weeks",
    ageGroup: "8-12 years",
    participantName: "Emma Thompson",
    participantAge: 10,
    parentName: "Sarah Thompson",
    amount: 2500,
    paymentMethod: "Credit Card",
    transactionDate: new Date("2025-04-15"),
    status: "issued",
    downloadCount: 2,
    sessionTimes: "09:00-15:00",
    isEarlyBird: true
  },
  {
    id: "2",
    receiptNumber: "SUM-RCP-2025-001235",
    activityName: "Football Skills Training",
    activityType: "sports",
    duration: "1 week",
    ageGroup: "10-16 years",
    participantName: "Alex Johnson",
    participantAge: 14,
    parentName: "David Johnson",
    amount: 1800,
    paymentMethod: "PromptPay",
    transactionDate: new Date("2025-04-14"),
    status: "issued",
    downloadCount: 1,
    sessionTimes: "08:00-12:00",
    isEarlyBird: false
  },
  {
    id: "3",
    receiptNumber: "SUM-RCP-2025-001236",
    activityName: "Science Discovery Workshop",
    activityType: "stem",
    duration: "3 days",
    ageGroup: "12-16 years",
    participantName: "Maya Patel",
    participantAge: 13,
    parentName: "Raj Patel",
    amount: 1200,
    paymentMethod: "Bank Transfer",
    transactionDate: new Date("2025-04-13"),
    status: "resent",
    downloadCount: 0,
    sessionTimes: "10:00-16:00",
    isEarlyBird: true
  },
  {
    id: "4",
    receiptNumber: "SUM-RCP-2025-001237",
    activityName: "French Language Immersion",
    activityType: "language",
    duration: "2 weeks",
    ageGroup: "14-18 years",
    participantName: "Sophie Chen",
    participantAge: 16,
    parentName: "Jennifer Chen",
    amount: 3200,
    paymentMethod: "WeChat Pay",
    transactionDate: new Date("2025-04-12"),
    status: "issued",
    downloadCount: 3,
    sessionTimes: "09:00-15:00",
    isEarlyBird: false
  },
  {
    id: "5",
    receiptNumber: "SUM-RCP-2025-001238",
    activityName: "Coding Bootcamp",
    activityType: "stem",
    duration: "1 week",
    ageGroup: "12-18 years",
    participantName: "James Wilson",
    participantAge: 15,
    parentName: "Michael Wilson",
    amount: 2800,
    paymentMethod: "Cash",
    transactionDate: new Date("2025-04-11"),
    status: "failed",
    downloadCount: 0,
    sessionTimes: "13:00-17:00",
    isEarlyBird: true
  }
]

export function SummerActivitiesReceipts() {
  const [receipts] = useState<SummerActivityReceipt[]>(mockReceipts)
  const [filteredReceipts, setFilteredReceipts] = useState<SummerActivityReceipt[]>(mockReceipts)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activityTypeFilter, setActivityTypeFilter] = useState("all")
  const [earlyBirdFilter, setEarlyBirdFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date | null>(null)
  const [dateTo, setDateTo] = useState<Date | null>(null)

  const applyFilters = () => {
    let filtered = receipts

    if (searchTerm) {
      filtered = filtered.filter(receipt => 
        receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.parentName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(receipt => receipt.status === statusFilter)
    }

    if (activityTypeFilter !== "all") {
      filtered = filtered.filter(receipt => receipt.activityType === activityTypeFilter)
    }

    if (earlyBirdFilter !== "all") {
      filtered = filtered.filter(receipt => 
        earlyBirdFilter === "yes" ? receipt.isEarlyBird : !receipt.isEarlyBird
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
    setActivityTypeFilter("all")
    setEarlyBirdFilter("all")
    setDateFrom(null)
    setDateTo(null)
    setFilteredReceipts(receipts)
  }

  const downloadReceipt = (receiptId: string) => {
    console.log("Downloading summer activity receipt", receiptId)
    // In a real app, this would generate and download PDF
  }

  const resendReceipt = (receiptId: string) => {
    console.log("Resending summer activity receipt via email", receiptId)
    // In a real app, this would resend receipt email
  }

  const viewReceipt = (receiptId: string) => {
    console.log("Viewing summer activity receipt", receiptId)
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

  const getActivityTypeBadge = (activityType: string) => {
    switch (activityType) {
      case "camp":
        return <Badge variant="default" className="bg-green-500">Camp</Badge>
      case "workshop":
        return <Badge variant="default" className="bg-blue-500">Workshop</Badge>
      case "sports":
        return <Badge variant="default" className="bg-orange-500">Sports</Badge>
      case "art":
        return <Badge variant="default" className="bg-purple-500">Art</Badge>
      case "language":
        return <Badge variant="default" className="bg-pink-500">Language</Badge>
      case "stem":
        return <Badge variant="default" className="bg-teal-500">STEM</Badge>
      default:
        return <Badge variant="secondary">{activityType}</Badge>
    }
  }

  const summaryStats = {
    total: receipts.length,
    issued: receipts.filter(r => r.status === "issued").length,
    resent: receipts.filter(r => r.status === "resent").length,
    failed: receipts.filter(r => r.status === "failed").length,
    totalDownloads: receipts.reduce((sum, r) => sum + r.downloadCount, 0),
    earlyBird: receipts.filter(r => r.isEarlyBird).length,
    totalRevenue: receipts.reduce((sum, r) => sum + r.amount, 0),
    avgAmount: receipts.reduce((sum, r) => sum + r.amount, 0) / receipts.length,
    avgAge: receipts.reduce((sum, r) => sum + r.participantAge, 0) / receipts.length
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Summer Activities Receipt Management</h2>
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
                View and download summer activities payment receipts
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryStats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {summaryStats.earlyBird} early bird discounts
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
                  Avg ฿{Math.round(summaryStats.avgAmount).toLocaleString()} per activity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Age</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(summaryStats.avgAge)} years</div>
                <p className="text-xs text-muted-foreground">
                  Participant average
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
                      placeholder="Receipt, activity, participant"
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
                  <label className="text-sm font-medium">Activity Type</label>
                  <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="camp">Camp</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="art">Art</SelectItem>
                      <SelectItem value="language">Language</SelectItem>
                      <SelectItem value="stem">STEM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Early Bird</label>
                  <Select value={earlyBirdFilter} onValueChange={setEarlyBirdFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Bookings</SelectItem>
                      <SelectItem value="yes">Early Bird</SelectItem>
                      <SelectItem value="no">Regular Price</SelectItem>
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
                    <TableHead>Activity Details</TableHead>
                    <TableHead>Participant</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
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
                        {receipt.isEarlyBird && (
                          <Badge variant="secondary" className="ml-2 text-xs bg-yellow-100 text-yellow-800">
                            Early Bird
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{receipt.activityName}</div>
                          <div className="flex items-center gap-2">
                            {getActivityTypeBadge(receipt.activityType)}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {receipt.duration} - {receipt.sessionTimes}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <UsersIcon className="w-3 h-3" />
                            Age: {receipt.ageGroup}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{receipt.participantName}</div>
                          <div className="text-sm text-muted-foreground">
                            {receipt.participantAge} years old
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{receipt.parentName}</div>
                      </TableCell>
                      <TableCell>฿{receipt.amount.toLocaleString()}</TableCell>
                      <TableCell>{receipt.paymentMethod}</TableCell>
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

          {/* Activity Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-yellow-500" />
                  Popular Activity Types
                </CardTitle>
                <p className="text-sm text-muted-foreground">Revenue by activity category</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: "STEM", count: 2, revenue: 4000, color: "bg-teal-500" },
                    { type: "Language", count: 1, revenue: 3200, color: "bg-pink-500" },
                    { type: "Art", count: 1, revenue: 2500, color: "bg-purple-500" },
                    { type: "Sports", count: 1, revenue: 1800, color: "bg-orange-500" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <div>
                          <div className="font-medium">{item.type}</div>
                          <div className="text-sm text-muted-foreground">{item.count} activities</div>
                        </div>
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
                <CardTitle>Booking Analysis</CardTitle>
                <p className="text-sm text-muted-foreground">Early bird vs regular bookings</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Early Bird Bookings</div>
                      <div className="text-sm text-muted-foreground">
                        {receipts.filter(r => r.isEarlyBird).length} participants
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ฿{receipts.filter(r => r.isEarlyBird).reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round((receipts.filter(r => r.isEarlyBird).reduce((sum, r) => sum + r.amount, 0) / summaryStats.totalRevenue) * 100)}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Regular Bookings</div>
                      <div className="text-sm text-muted-foreground">
                        {receipts.filter(r => !r.isEarlyBird).length} participants
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ฿{receipts.filter(r => !r.isEarlyBird).reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round((receipts.filter(r => !r.isEarlyBird).reduce((sum, r) => sum + r.amount, 0) / summaryStats.totalRevenue) * 100)}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm">
                      <strong>Insight:</strong> Early bird bookings represent {Math.round((summaryStats.earlyBird / summaryStats.total) * 100)}% of total registrations, encouraging advance planning and commitment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="whitelist">
          <InternalEmailManagement 
            title="Summer Activities Receipt Email Whitelist"
            description="Manage internal staff emails who receive summer activities receipt notifications"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}