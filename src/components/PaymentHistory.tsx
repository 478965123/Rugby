import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Separator } from "./ui/separator"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination"
import { CalendarIcon, Search, Download, Filter, Eye, Receipt, CreditCard, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner@2.0.3"
import { StatusFilter, PaymentStatus, getStatusBadge, PaymentChannelFilter, PaymentChannel, getPaymentChannelLabel } from "./StatusFilter"

interface PaymentRecord {
  id: string
  invoiceNumber: string
  studentName: string
  studentId: string
  studentGrade: string
  studentRoom: string
  schoolLevel: "nk" | "primary" | "secondary"
  amount: number
  paymentType: "yearly" | "termly"
  paymentMethod: string
  paymentChannel: "credit_card" | "wechat_pay" | "alipay" | "qr_payment" | "counter_bank"
  payerName: string
  status: "paid" | "partial" | "unpaid" | "cancelled" | "overdue"
  transactionDate: Date
  parentType?: "internal" | "external"
  referenceNumber?: string
  paymentDescription?: string
  dueDate?: Date
  notes?: string
}

// Generate mock payments data with more entries for pagination testing
const generateMockPayments = (): PaymentRecord[] => {
  const grades = ["Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  const rooms = ["A", "B", "C", "D", "E", "F", "G", "H"]
  const firstNames = ["John", "Sarah", "Mike", "Lisa", "David", "Emma", "James", "Sophia", "William", "Olivia", "Benjamin", "Ava", "Lucas", "Isabella", "Henry", "Mia", "Alexander", "Charlotte", "Mason", "Amelia", "Ethan", "Harper", "Daniel", "Evelyn", "Matthew", "Abigail", "Jackson", "Emily", "Sebastian", "Elizabeth", "Jack", "Sofia", "Aiden", "Avery", "Owen", "Ella", "Samuel", "Madison", "Gabriel", "Scarlett", "Carter", "Victoria", "Wyatt", "Aria", "Jayden", "Grace", "John", "Chloe", "Luke", "Camila", "Anthony", "Penelope", "Isaac", "Riley"]
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"]
  const paymentMethods = ["Credit Card", "PromptPay", "Bank Counter", "WeChat Pay", "Bank Transfer", "Cash"]
  const paymentChannels: ("credit_card" | "wechat_pay" | "alipay" | "qr_payment" | "counter_bank")[] = ["credit_card", "wechat_pay", "alipay", "qr_payment", "counter_bank"]
  const payerNames = ["Mr. John Smith", "Mrs. Sarah Johnson", "Mr. David Williams", "Ms. Emily Brown", "Mr. Michael Davis", "Mrs. Lisa Garcia", "Mr. James Wilson", "Ms. Maria Rodriguez"]
  const statuses: ("paid" | "partial" | "unpaid" | "cancelled" | "overdue")[] = ["paid", "paid", "paid", "partial", "unpaid", "cancelled", "overdue"]

  const payments: PaymentRecord[] = []

  for (let i = 1; i <= 125; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const grade = grades[Math.floor(Math.random() * grades.length)]
    const room = rooms[Math.floor(Math.random() * rooms.length)]

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

    const paymentType = Math.random() > 0.6 ? "yearly" : "termly"
    const amount = paymentType === "yearly" ? 125000 : 42000
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
    const paymentChannel = paymentChannels[Math.floor(Math.random() * paymentChannels.length)]
    const payerName = payerNames[Math.floor(Math.random() * payerNames.length)]

    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 90))

    payments.push({
      id: i.toString(),
      invoiceNumber: `INV-2025-${String(i).padStart(6, '0')}`,
      studentName: `${firstName} ${lastName}`,
      studentId: `ST${String(i).padStart(6, '0')}`,
      studentGrade: grade,
      studentRoom: room,
      schoolLevel,
      amount,
      paymentType,
      paymentMethod,
      paymentChannel,
      payerName,
      status,
      transactionDate: date,
      parentType: Math.random() > 0.7 ? "external" : "internal", // 30% external, 70% internal
      referenceNumber: `REF-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      paymentDescription: paymentType === "yearly" ? "Annual tuition fee payment for academic year 2025-2026" : "Term 1 tuition fee payment",
      dueDate: new Date(date.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days after transaction date
      notes: status === "cancelled" ? "Payment cancelled by parent request" :
             status === "overdue" ? "Payment overdue - reminder sent" :
             status === "unpaid" ? "Payment not yet received" :
             status === "partial" ? "Partial payment received, balance pending" :
             "Payment completed successfully"
    })
  }

  return payments
}

const mockPayments: PaymentRecord[] = generateMockPayments()

interface PaymentHistoryProps {
  type?: "tuition" | "afterschool"
}

export function PaymentHistory({ type = "tuition" }: PaymentHistoryProps) {
  const { t } = useTranslation()
  const [payments] = useState<PaymentRecord[]>(mockPayments)
  const [filteredPayments, setFilteredPayments] = useState<PaymentRecord[]>(mockPayments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<PaymentStatus>("all")
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [roomFilter, setRoomFilter] = useState("all")
  const [schoolLevelFilter, setSchoolLevelFilter] = useState("all")
  const [paymentChannelFilter, setPaymentChannelFilter] = useState<PaymentChannel>("all")
  const [dateFrom, setDateFrom] = useState<Date | null>(null)
  const [dateTo, setDateTo] = useState<Date | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const applyFilters = () => {
    let filtered = payments

    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(payment => payment.status === statusFilter)
    }

    if (paymentTypeFilter !== "all") {
      filtered = filtered.filter(payment => payment.paymentType === paymentTypeFilter)
    }

    if (gradeFilter !== "all") {
      filtered = filtered.filter(payment => payment.studentGrade === gradeFilter)
    }

    if (roomFilter !== "all") {
      filtered = filtered.filter(payment => payment.studentRoom === roomFilter)
    }

    if (schoolLevelFilter !== "all") {
      filtered = filtered.filter(payment => payment.schoolLevel === schoolLevelFilter)
    }

    if (paymentChannelFilter !== "all") {
      filtered = filtered.filter(payment => payment.paymentChannel === paymentChannelFilter)
    }

    if (dateFrom) {
      filtered = filtered.filter(payment => payment.transactionDate >= dateFrom)
    }

    if (dateTo) {
      filtered = filtered.filter(payment => payment.transactionDate <= dateTo)
    }

    setFilteredPayments(filtered)
    setCurrentPage(1) // Reset to first page when filters are applied
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setPaymentTypeFilter("all")
    setGradeFilter("all")
    setRoomFilter("all")
    setSchoolLevelFilter("all")
    setPaymentChannelFilter("all")
    setDateFrom(null)
    setDateTo(null)
    setFilteredPayments(payments)
    setCurrentPage(1)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const exportData = () => {
    // Helper function to escape CSV values
    const escapeCsvValue = (value: any): string => {
      if (value === null || value === undefined) return ''
      const stringValue = String(value)
      // If value contains comma, newline, or quotes, wrap in quotes and escape internal quotes
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }
    
    // Create metadata section
    const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)
    
    const metadata = [
      'SISB Schooney Payment History Export',
      `Export Date: ${currentDate}`,
      `Report Type: ${type === 'tuition' ? 'Tuition Management' : 'After School Management'}`,
      `Total Records: ${filteredPayments.length}`,
      `Total Amount: ฿${totalAmount.toLocaleString()}`,
      '',
      'Applied Filters:',
      `- Status: ${statusFilter === 'all' ? 'All Statuses' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}`,
      `- Payment Type: ${paymentTypeFilter === 'all' ? 'All Types' : paymentTypeFilter.charAt(0).toUpperCase() + paymentTypeFilter.slice(1)}`,
      `- Grade Level: ${gradeFilter === 'all' ? 'All Grades' : gradeFilter}`,
      `- Date Range: ${dateFrom ? format(dateFrom, 'yyyy-MM-dd') : 'No start date'} to ${dateTo ? format(dateTo, 'yyyy-MM-dd') : 'No end date'}`,
      `- Search Term: ${searchTerm || 'No search applied'}`,
      '',
      '--- Payment Data ---',
      ''
    ]
    
    // Create CSV headers
    const headers = [
      'Invoice Number',
      'Student Name', 
      'Student ID',
      'Grade Level',
      'Amount (THB)',
      'Payment Type',
      'Payment Method',
      'Payment Channel',
      'Payer Name',
      'Status',
      'Transaction Date',
      'Reference Number',
      'Due Date',
      'Notes'
    ]
    
    // Create CSV rows
    const csvRows = [
      ...metadata.map(line => escapeCsvValue(line)),
      headers.join(','), // Header row
      ...filteredPayments.map(payment => [
        escapeCsvValue(payment.invoiceNumber),
        escapeCsvValue(payment.studentName),
        escapeCsvValue(payment.studentId),
        escapeCsvValue(payment.studentGrade),
        escapeCsvValue(payment.amount),
        escapeCsvValue(payment.paymentType === 'yearly' ? 'Yearly' : 'Termly'),
        escapeCsvValue(payment.paymentMethod),
        escapeCsvValue(payment.paymentChannel),
        escapeCsvValue(payment.payerName),
        escapeCsvValue(payment.status.charAt(0).toUpperCase() + payment.status.slice(1)),
        escapeCsvValue(format(payment.transactionDate, 'yyyy-MM-dd HH:mm:ss')),
        escapeCsvValue(payment.referenceNumber || ''),
        escapeCsvValue(payment.dueDate ? format(payment.dueDate, 'yyyy-MM-dd') : ''),
        escapeCsvValue(payment.notes || '')
      ].join(','))
    ]
    
    // Create CSV content
    const csvContent = csvRows.join('\n')
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      
      // Generate filename with current date and filter info
      const currentDate = format(new Date(), 'yyyy-MM-dd')
      const paymentTypeText = paymentTypeFilter === 'all' ? 'all' : paymentTypeFilter
      const statusText = statusFilter === 'all' ? 'all' : statusFilter
      const gradeText = gradeFilter === 'all' ? 'all-grades' : gradeFilter.replace(/\s+/g, '-').toLowerCase()
      
      const filename = `payment-history-${type}-${paymentTypeText}-${statusText}-${gradeText}-${currentDate}.csv`
      link.setAttribute('download', filename)
      
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Show success toast
      toast.success(`Successfully exported ${filteredPayments.length} payment records`, {
        description: `File: ${filename}`,
        duration: 4000,
      })
    } else {
      toast.error("Export failed", {
        description: "Your browser does not support file downloads",
        duration: 4000,
      })
    }
  }



  const getPaymentTypeBadge = (paymentType: string) => {
    return paymentType === "yearly"
      ? <Badge variant="default">{t('paymentHistory.yearly')}</Badge>
      : <Badge variant="outline">{t('paymentHistory.termly')}</Badge>
  }

  // Get unique grades and rooms for filter dropdown
  const uniqueGrades = Array.from(new Set(payments.map(payment => payment.studentGrade))).sort()
  const uniqueRooms = Array.from(new Set(payments.map(payment => payment.studentRoom))).sort()

  // Pagination calculations
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPagePayments = filteredPayments.slice(startIndex, endIndex)

  const downloadReceipt = (payment: PaymentRecord) => {
    // In a real app, this would generate and download a PDF receipt
    console.log("Downloading receipt for payment:", payment.invoiceNumber)
    // Create a mock download
    const element = document.createElement('a')
    const content = `Receipt for ${payment.invoiceNumber}\nStudent: ${payment.studentName}\nGrade: ${payment.studentGrade}\nAmount: ฿${payment.amount.toLocaleString()}\nPayer: ${payment.payerName}\nPayment Channel: ${payment.paymentChannel}\nDate: ${format(payment.transactionDate, "MMM dd, yyyy")}`
    const file = new Blob([content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `receipt-${payment.invoiceNumber}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">
            {t(`paymentHistory.title.${type}`)}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('paymentHistory.description')}
          </p>
        </div>
        <Button onClick={exportData} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          {t('paymentHistory.exportData')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {t('paymentHistory.searchAndFilter')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* First Row: Search */}
            <div className="w-full">
              <label className="text-sm font-medium">{t('paymentHistory.search')}</label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t('paymentHistory.searchPlaceholder')}
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
                <label className="text-sm font-medium">{t('paymentHistory.paymentType')}</label>
                <Select value={paymentTypeFilter} onValueChange={setPaymentTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('paymentHistory.allTypes')}</SelectItem>
                    <SelectItem value="yearly">{t('paymentHistory.yearly')}</SelectItem>
                    <SelectItem value="termly">{t('paymentHistory.termly')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('paymentHistory.schoolLevel')}</label>
                <Select value={schoolLevelFilter} onValueChange={setSchoolLevelFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('paymentHistory.allSchoolLevels')}</SelectItem>
                    <SelectItem value="nk">{t('paymentHistory.schoolLevels.nk')}</SelectItem>
                    <SelectItem value="primary">{t('paymentHistory.schoolLevels.primary')}</SelectItem>
                    <SelectItem value="secondary">{t('paymentHistory.schoolLevels.secondary')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('paymentHistory.gradeLevel')}</label>
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('paymentHistory.allGrades')}</SelectItem>
                    {uniqueGrades.map((grade) => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('paymentHistory.room')}</label>
                <Select value={roomFilter} onValueChange={setRoomFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('paymentHistory.allRooms')}</SelectItem>
                    {uniqueRooms.map((room) => (
                      <SelectItem key={room} value={room}>{room}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <PaymentChannelFilter
                selectedChannel={paymentChannelFilter}
                onChannelChange={setPaymentChannelFilter}
              />
            </div>

            {/* Third Row: Date Range and Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('paymentHistory.dateRange')}</label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full md:w-[180px] justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "dd/MM/yyyy") : t('paymentHistory.from')}
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
                      <Button variant="outline" className="w-full md:w-[180px] justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "dd/MM/yyyy") : t('paymentHistory.to')}
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

              {/* Buttons */}
              <div className="flex gap-2 items-end justify-end">
                <Button onClick={applyFilters}>{t('paymentHistory.applyFilters')}</Button>
                <Button variant="outline" onClick={clearFilters}>{t('paymentHistory.clearAll')}</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {t('paymentHistory.showing')} {startIndex + 1}-{Math.min(endIndex, filteredPayments.length)} {t('paymentHistory.of')} {filteredPayments.length} {t('paymentHistory.paymentRecords')}
            {filteredPayments.length < payments.length && ` (${t('paymentHistory.filteredFrom')} ${payments.length} ${t('paymentHistory.total')})`}
          </p>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">{t('paymentHistory.show')}:</label>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">{t('paymentHistory.perPage')}</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {t('paymentHistory.totalAmount')}: ฿{filteredPayments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}
        </div>
      </div>

      {/* Payment Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('paymentHistory.invoiceNumber')}</TableHead>
                <TableHead>{t('paymentHistory.student')}</TableHead>
                <TableHead>{t('paymentHistory.grade')}</TableHead>
                <TableHead>{t('paymentHistory.room')}</TableHead>
                <TableHead>{t('paymentHistory.amount')}</TableHead>
                <TableHead>{t('paymentHistory.type')}</TableHead>
                <TableHead>{t('paymentHistory.channel')}</TableHead>
                <TableHead>{t('paymentHistory.status')}</TableHead>
                <TableHead>{t('paymentHistory.date')}</TableHead>
                <TableHead>{t('paymentHistory.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPagePayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">
                    {payment.invoiceNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.studentName}</div>
                      <div className="text-sm text-muted-foreground">{payment.studentId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{payment.studentGrade}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.studentRoom}</Badge>
                  </TableCell>
                  <TableCell>฿{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{getPaymentTypeBadge(payment.paymentType)}</TableCell>
                  <TableCell>{getPaymentChannelLabel(payment.paymentChannel, t)}</TableCell>
                  <TableCell>{getStatusBadge(payment.status, t)}</TableCell>
                  <TableCell>{format(payment.transactionDate, "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setSelectedPayment(payment)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Receipt className="w-5 h-5" />
                            {t('paymentHistory.paymentDetails')}
                          </DialogTitle>
                          <DialogDescription>
                            {t('paymentHistory.completePaymentInfo')} {payment.invoiceNumber}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          {/* Payment Summary */}
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">฿{payment.amount.toLocaleString()}</h3>
                              <p className="text-sm text-muted-foreground">{payment.paymentDescription}</p>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(payment.status, t)}
                              <p className="text-sm text-muted-foreground mt-1">
                                {format(payment.transactionDate, "MMM dd, yyyy 'at' HH:mm")}
                              </p>
                            </div>
                          </div>

                          <Separator />

                          {/* Student Information */}
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-3">{t('paymentHistory.studentInformation')}</h4>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm text-muted-foreground">{t('paymentHistory.studentName')}</p>
                                  <p className="font-medium">{payment.studentName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">{t('paymentHistory.studentId')}</p>
                                  <p className="font-mono text-sm">{payment.studentId}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">{t('paymentHistory.gradeLevel')}</p>
                                  <Badge variant="secondary">{payment.studentGrade}</Badge>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-3">{t('paymentHistory.paymentInformation')}</h4>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm text-muted-foreground">{t('paymentHistory.paymentType')}</p>
                                  <div>{getPaymentTypeBadge(payment.paymentType)}</div>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">{t('paymentHistory.paymentMethod')}</p>
                                  <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    <span>{payment.paymentMethod}</span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">{t('paymentHistory.paymentChannel')}</p>
                                  <p>{payment.paymentChannel}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">{t('paymentHistory.payerName')}</p>
                                  <p className="font-medium">{payment.payerName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">{t('paymentHistory.dueDate')}</p>
                                  <p>{payment.dueDate ? format(payment.dueDate, "MMM dd, yyyy") : "N/A"}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Transaction Details */}
                          <div>
                            <h4 className="font-medium mb-3">{t('paymentHistory.transactionDetails')}</h4>
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">{t('paymentHistory.referenceNumber')}</p>
                                <p className="font-mono text-sm">{payment.referenceNumber || "N/A"}</p>
                              </div>
                            </div>
                          </div>

                          {/* Notes */}
                          {payment.notes && (
                            <>
                              <Separator />

                            </>
                          )}

                          {/* Action Buttons */}
                          <div className="flex justify-between pt-4">
                            <Button
                              variant="outline"
                              onClick={() => downloadReceipt(payment)}
                              className="flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              {t('paymentHistory.downloadReceipt')}
                            </Button>

                            <div className="space-x-2">
                              {payment.status === "failed" && (
                                <Button
                                  onClick={() => console.log("Retry payment for", payment.invoiceNumber)}
                                >
                                  {t('paymentHistory.retryPayment')}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {/* Show first few pages */}
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(page => (
              <PaginationItem key={page}>
                <PaginationLink 
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {/* Show ellipsis if there are many pages */}
            {totalPages > 6 && currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            {/* Show current page area if it's in the middle */}
            {currentPage > 3 && currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationLink 
                  onClick={() => setCurrentPage(currentPage)}
                  isActive={true}
                  className="cursor-pointer"
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
            )}
            
            {/* Show last few pages */}
            {totalPages > 3 && (
              <>
                {totalPages > 6 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => totalPages - 2 + i).filter(page => page > 3).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </>
            )}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}