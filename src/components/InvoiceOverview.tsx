import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { CalendarIcon, Search, Download, Filter, Eye, Send, AlertTriangle, ChevronLeft, ChevronRight, X, User, FileText, Calendar as CalendarEmoji, Coins, Clock, MessageSquare } from "lucide-react"
import { StatusFilter, PaymentStatus, getStatusBadge, PaymentChannelFilter, PaymentChannel, getPaymentChannelLabel } from "./StatusFilter"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Separator } from "./ui/separator"
import { format } from "date-fns"
import { toast } from "sonner@2.0.3"

interface Invoice {
  id: string
  invoiceNumber: string
  studentName: string
  studentId: string
  studentGrade: string
  studentRoom: string
  schoolLevel: "nk" | "primary" | "secondary"
  amount: number
  dueDate: Date
  issueDate: Date
  status: "paid" | "partial" | "unpaid" | "cancelled" | "overdue"
  term: string
  paymentType: "yearly" | "termly"
  paymentChannel?: "credit_card" | "wechat_pay" | "alipay" | "qr_payment" | "counter_bank"
  remindersSent: number
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2025-001234",
    studentName: "John Smith",
    studentId: "ST001234",
    studentGrade: "Year 10",
    studentRoom: "A",
    schoolLevel: "secondary",
    amount: 125000,
    dueDate: new Date("2025-08-01"),
    issueDate: new Date("2025-07-01"),
    status: "paid",
    term: "2025-2026",
    paymentType: "yearly",
    remindersSent: 0
  },
  {
    id: "2",
    invoiceNumber: "INV-2025-001235",
    studentName: "Sarah Wilson",
    studentId: "ST001235",
    studentGrade: "Year 7",
    studentRoom: "B",
    schoolLevel: "secondary",
    amount: 42000,
    dueDate: new Date("2025-08-01"),
    issueDate: new Date("2025-07-01"),
    status: "unpaid",
    term: "Term 1",
    paymentType: "termly",
    remindersSent: 1
  },
  {
    id: "3",
    invoiceNumber: "INV-2025-001236",
    studentName: "Mike Johnson",
    studentId: "ST001236",
    studentGrade: "Year 12",
    studentRoom: "C",
    schoolLevel: "secondary",
    amount: 125000,
    dueDate: new Date("2025-07-15"),
    issueDate: new Date("2025-06-15"),
    status: "overdue",
    term: "2025-2026",
    paymentType: "yearly",
    remindersSent: 3
  },
  {
    id: "4",
    invoiceNumber: "INV-2025-001237",
    studentName: "Lisa Chen",
    studentId: "ST001237",
    studentGrade: "Year 3",
    studentRoom: "D",
    schoolLevel: "primary",
    amount: 42000,
    dueDate: new Date("2025-08-15"),
    issueDate: new Date("2025-07-15"),
    status: "unpaid",
    term: "Term 1",
    paymentType: "termly",
    remindersSent: 0
  },
  {
    id: "5",
    invoiceNumber: "INV-2025-001238",
    studentName: "David Brown",
    studentId: "ST001238",
    studentGrade: "Reception",
    studentRoom: "E",
    schoolLevel: "nk",
    amount: 125000,
    dueDate: new Date("2025-06-01"),
    issueDate: new Date("2025-05-01"),
    status: "cancelled",
    term: "2025-2026",
    paymentType: "yearly",
    remindersSent: 2
  }
]

// Add more mock data for pagination testing
for (let i = 6; i <= 120; i++) {
  const grades = ["Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  const rooms = ["A", "B", "C", "D", "E", "F", "G", "H"]
  const statuses: ("paid" | "partial" | "unpaid" | "cancelled" | "overdue")[] = ["paid", "partial", "unpaid", "cancelled", "overdue"]
  const paymentTypes: ("yearly" | "termly")[] = ["yearly", "termly"]
  const paymentChannels: ("credit_card" | "wechat_pay" | "alipay" | "qr_payment" | "counter_bank")[] = ["credit_card", "wechat_pay", "alipay", "qr_payment", "counter_bank"]

  const grade = grades[i % grades.length]
  const room = rooms[i % rooms.length]

  // Determine school level based on grade
  let schoolLevel: "nk" | "primary" | "secondary"
  if (grade === "Reception") {
    schoolLevel = "nk"
  } else {
    const yearNumber = parseInt(grade.replace("Year ", ""))
    if (yearNumber <= 6) {
      schoolLevel = "primary"
    } else {
      schoolLevel = "secondary"
    }
  }

  mockInvoices.push({
    id: i.toString(),
    invoiceNumber: `INV-2025-${String(1234 + i).padStart(6, '0')}`,
    studentName: `Student ${i}`,
    studentId: `ST${String(1234 + i).padStart(6, '0')}`,
    studentGrade: grade,
    studentRoom: room,
    schoolLevel,
    amount: Math.floor(Math.random() * 100000) + 25000,
    dueDate: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    issueDate: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    term: Math.random() > 0.5 ? "2025-2026" : `Term ${Math.floor(Math.random() * 3) + 1}`,
    paymentType: paymentTypes[Math.floor(Math.random() * paymentTypes.length)],
    paymentChannel: paymentChannels[Math.floor(Math.random() * paymentChannels.length)],
    remindersSent: Math.floor(Math.random() * 5)
  })
}

export function InvoiceOverview() {
  const [invoices] = useState<Invoice[]>(mockInvoices)
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(mockInvoices)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<PaymentStatus>("all")
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [roomFilter, setRoomFilter] = useState("all")
  const [schoolLevelFilter, setSchoolLevelFilter] = useState("all")
  const [paymentChannelFilter, setPaymentChannelFilter] = useState<PaymentChannel>("all")
  const [dueDateFrom, setDueDateFrom] = useState<Date | null>(null)
  const [dueDateTo, setDueDateTo] = useState<Date | null>(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  // Modal states
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Grade and room options for filter
  const gradeOptions = ["Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  const uniqueRooms = Array.from(new Set(invoices.map(invoice => invoice.studentRoom))).sort()

  const applyFilters = () => {
    let filtered = invoices

    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(invoice => invoice.status === statusFilter)
    }

    if (paymentTypeFilter !== "all") {
      filtered = filtered.filter(invoice => invoice.paymentType === paymentTypeFilter)
    }

    if (gradeFilter !== "all") {
      filtered = filtered.filter(invoice => invoice.studentGrade === gradeFilter)
    }

    if (roomFilter !== "all") {
      filtered = filtered.filter(invoice => invoice.studentRoom === roomFilter)
    }

    if (schoolLevelFilter !== "all") {
      filtered = filtered.filter(invoice => invoice.schoolLevel === schoolLevelFilter)
    }

    if (paymentChannelFilter !== "all") {
      filtered = filtered.filter(invoice => invoice.paymentChannel === paymentChannelFilter)
    }

    if (dueDateFrom) {
      filtered = filtered.filter(invoice => invoice.dueDate >= dueDateFrom)
    }

    if (dueDateTo) {
      filtered = filtered.filter(invoice => invoice.dueDate <= dueDateTo)
    }

    setFilteredInvoices(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setPaymentTypeFilter("all")
    setGradeFilter("all")
    setRoomFilter("all")
    setSchoolLevelFilter("all")
    setPaymentChannelFilter("all")
    setDueDateFrom(null)
    setDueDateTo(null)
    setFilteredInvoices(invoices)
    setCurrentPage(1)
  }

  const sendReminder = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (invoice) {
      // Update reminders sent count in a real app
      toast.success(`Reminder sent to ${invoice.studentName}'s parent`)
    }
  }

  const downloadInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (invoice) {
      // Generate CSV content for the invoice
      const csvContent = [
        "Field,Value",
        `Invoice Number,${invoice.invoiceNumber}`,
        `Student Name,${invoice.studentName}`,
        `Student ID,${invoice.studentId}`,
        `Grade,${invoice.studentGrade}`,
        `Amount,${invoice.amount}`,
        `Due Date,${format(invoice.dueDate, "yyyy-MM-dd")}`,
        `Issue Date,${format(invoice.issueDate, "yyyy-MM-dd")}`,
        `Status,${invoice.status}`,
        `Term,${invoice.term}`,
        `Payment Type,${invoice.paymentType}`,
        `Reminders Sent,${invoice.remindersSent}`,
      ].join("\n")

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${invoice.invoiceNumber}_invoice.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success(`Invoice ${invoice.invoiceNumber} downloaded`)
    }
  }

  const openInvoiceDetail = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedInvoice(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "unpaid":
        return <Badge className="bg-blue-100 text-blue-800">Unpaid</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPageInvoices = filteredInvoices.slice(startIndex, endIndex)

  const summaryStats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === "paid").length,
    unpaid: invoices.filter(i => i.status === "unpaid").length,
    overdue: invoices.filter(i => i.status === "overdue").length,
    totalAmount: invoices.reduce((sum, i) => sum + i.amount, 0),
    unpaidAmount: invoices.filter(i => i.status === "unpaid" || i.status === "overdue").reduce((sum, i) => sum + i.amount, 0)
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Invoice Overview</h2>
          <p className="text-sm text-muted-foreground">
            Manage all invoices and track payment status
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.total}</div>
            <p className="text-xs text-muted-foreground">
              Total value: ฿{summaryStats.totalAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summaryStats.paid}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((summaryStats.paid / summaryStats.total) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{summaryStats.unpaid}</div>
            <p className="text-xs text-muted-foreground">
              ฿{invoices.filter(i => i.status === "unpaid").reduce((sum, i) => sum + i.amount, 0).toLocaleString()} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summaryStats.overdue}</div>
            <p className="text-xs text-muted-foreground">
              ฿{invoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0).toLocaleString()} overdue
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
          <div className="space-y-4">
            {/* First Row: Search */}
            <div className="w-full">
              <label className="text-sm font-medium">Search</label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Invoice, student name, or ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Second Row: Main Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <StatusFilter
                selectedStatus={statusFilter}
                onStatusChange={setStatusFilter}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Type</label>
                <Select value={paymentTypeFilter} onValueChange={setPaymentTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="termly">Termly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">School Level</label>
                <Select value={schoolLevelFilter} onValueChange={setSchoolLevelFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="nk">NK</SelectItem>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Grade Level</label>
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {gradeOptions.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Room</label>
                <Select value={roomFilter} onValueChange={setRoomFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rooms</SelectItem>
                    {uniqueRooms.map((room) => (
                      <SelectItem key={room} value={room}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <PaymentChannelFilter
                selectedChannel={paymentChannelFilter}
                onChannelChange={setPaymentChannelFilter}
              />
            </div>

            {/* Third Row: Due Date Range and Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date Range</label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full md:w-[180px] justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDateFrom ? format(dueDateFrom, "dd/MM/yyyy") : "From"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDateFrom || undefined}
                        onSelect={setDueDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full md:w-[180px] justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDateTo ? format(dueDateTo, "dd/MM/yyyy") : "To"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDateTo || undefined}
                        onSelect={setDueDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 items-end justify-end">
                <Button onClick={applyFilters}>Apply Filters</Button>
                <Button variant="outline" onClick={clearFilters}>Clear All</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredInvoices.length)} of {filteredInvoices.length} invoices
          {filteredInvoices.length !== invoices.length && (
            <span> (filtered from {invoices.length} total)</span>
          )}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      {/* Invoice Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Reminders</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageInvoices.map((invoice) => {
                const daysUntilDue = getDaysUntilDue(invoice.dueDate)
                const isUrgent = daysUntilDue <= 7 && invoice.status === "unpaid"
                
                return (
                  <TableRow key={invoice.id} className={isUrgent ? "bg-red-50" : ""}>
                    <TableCell className="font-mono text-sm">
                      {invoice.invoiceNumber}
                      {isUrgent && <AlertTriangle className="w-4 h-4 text-red-500 inline ml-2" />}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.studentName}</div>
                        <div className="text-sm text-muted-foreground">{invoice.studentId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{invoice.studentGrade}</Badge>
                    </TableCell>
                    <TableCell>฿{invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div>
                        <div>{format(invoice.dueDate, "MMM dd, yyyy")}</div>
                        {invoice.status === "unpaid" && (
                          <div className={`text-sm ${daysUntilDue < 0 ? "text-red-600" : daysUntilDue <= 7 ? "text-orange-600" : "text-muted-foreground"}`}>
                            {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days left`}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      <Badge variant={invoice.paymentType === "yearly" ? "default" : "outline"}>
                        {invoice.paymentType === "yearly" ? "Yearly" : "Termly"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {invoice.paymentChannel ? getPaymentChannelLabel(invoice.paymentChannel) : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {invoice.remindersSent} sent
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => openInvoiceDetail(invoice)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => downloadInvoice(invoice.id)}
                          title="Download Invoice"
                        >
                          <Download className="w-4 h-4 text-blue-600" />
                        </Button>

                        {(invoice.status === "unpaid" || invoice.status === "overdue") && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => sendReminder(invoice.id)}
                            title="Send Reminder"
                          >
                            <Send className="w-4 h-4 text-purple-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => goToPage(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {/* First page */}
              {currentPage > 2 && (
                <>
                  <PaginationItem>
                    <PaginationLink onClick={() => goToPage(1)} className="cursor-pointer">
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {currentPage > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              )}
              
              {/* Previous page */}
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => goToPage(currentPage - 1)} className="cursor-pointer">
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}
              
              {/* Current page */}
              <PaginationItem>
                <PaginationLink isActive>
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
              
              {/* Next page */}
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationLink onClick={() => goToPage(currentPage + 1)} className="cursor-pointer">
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}
              
              {/* Last page */}
              {currentPage < totalPages - 1 && (
                <>
                  {currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink onClick={() => goToPage(totalPages)} className="cursor-pointer">
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => goToPage(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Go to page:</span>
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value)
                if (page >= 1 && page <= totalPages) {
                  goToPage(page)
                }
              }}
              className="w-16 h-8"
            />
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Invoice Details
            </DialogTitle>
            <DialogDescription>
              View complete invoice information, payment status, and send reminders
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-6">
              {/* Invoice Number and Status */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Invoice Number</p>
                  <p className="font-mono text-lg font-medium">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(selectedInvoice.status)}
                  <Badge variant={selectedInvoice.paymentType === "yearly" ? "default" : "outline"}>
                    {selectedInvoice.paymentType === "yearly" ? "Yearly" : "Termly"}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Student Information */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 font-medium">
                  <User className="w-4 h-4" />
                  Student Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{selectedInvoice.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Student ID</p>
                    <p className="font-mono">{selectedInvoice.studentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Grade Level</p>
                    <Badge variant="secondary">{selectedInvoice.studentGrade}</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Financial Information */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 font-medium">
                  <Coins className="w-4 h-4" />
                  Financial Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount Due</p>
                    <p className="text-2xl font-bold">฿{selectedInvoice.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Academic Term</p>
                    <p className="font-medium">{selectedInvoice.term}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Date Information */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 font-medium">
                  <CalendarEmoji className="w-4 h-4" />
                  Important Dates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <p className="font-medium">{format(selectedInvoice.issueDate, "MMM dd, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <div>
                      <p className="font-medium">{format(selectedInvoice.dueDate, "MMM dd, yyyy")}</p>
                      {selectedInvoice.status === "unpaid" && (
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {(() => {
                            const daysUntilDue = getDaysUntilDue(selectedInvoice.dueDate)
                            return (
                              <span className={`text-xs ${daysUntilDue < 0 ? "text-red-600" : daysUntilDue <= 7 ? "text-orange-600" : "text-muted-foreground"}`}>
                                {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days remaining`}
                              </span>
                            )
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Communication History */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 font-medium">
                  <MessageSquare className="w-4 h-4" />
                  Communication History
                </h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Reminders Sent</p>
                      <p className="text-sm text-muted-foreground">
                        Total reminders sent to parent/guardian
                      </p>
                    </div>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {selectedInvoice.remindersSent}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    toast.success("Invoice downloaded successfully")
                    closeModal()
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                
                {(selectedInvoice.status === "unpaid" || selectedInvoice.status === "overdue") && (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      sendReminder(selectedInvoice.id)
                      closeModal()
                    }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Reminder
                  </Button>
                )}
                
                <Button variant="ghost" onClick={closeModal}>
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}