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
import { CalendarIcon, Search, Download, Filter, Eye, Receipt, CreditCard, ChevronLeft, ChevronRight, Mail, ExternalLink } from "lucide-react"
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
  paymentChannel: "credit_card" | "qr_payment" | "counter_bank"
  payerName: string
  parentEmail: string
  status: "paid" | "pending" | "overdue" | "cancelled"
  transactionDate: Date
  lastEmailSentDate?: Date
  emailStatus?: "sent" | "pending" | "not_sent" | "failed"
  navSyncStatus?: "synced" | "pending" | "failed"
  navSyncDate?: Date
  parentType?: "internal" | "external"
  referenceNumber?: string
  paymentDescription?: string
  dueDate?: Date
  notes?: string
  creditNoteUsed?: boolean
  creditNoteNumber?: string
  creditNoteAmount?: number
}

// Generate mock payments data with more entries for pagination testing
const generateMockPayments = (): PaymentRecord[] => {
  const grades = ["Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  const rooms = ["A", "B", "C", "D", "E", "F", "G", "H"]
  const firstNames = ["John", "Sarah", "Mike", "Lisa", "David", "Emma", "James", "Sophia", "William", "Olivia", "Benjamin", "Ava", "Lucas", "Isabella", "Henry", "Mia", "Alexander", "Charlotte", "Mason", "Amelia", "Ethan", "Harper", "Daniel", "Evelyn", "Matthew", "Abigail", "Jackson", "Emily", "Sebastian", "Elizabeth", "Jack", "Sofia", "Aiden", "Avery", "Owen", "Ella", "Samuel", "Madison", "Gabriel", "Scarlett", "Carter", "Victoria", "Wyatt", "Aria", "Jayden", "Grace", "John", "Chloe", "Luke", "Camila", "Anthony", "Penelope", "Isaac", "Riley"]
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"]
  const paymentMethods = ["Credit Card", "PromptPay", "Bank Counter", "Bank Transfer", "Cash"]
  const paymentChannels: ("credit_card" | "qr_payment" | "counter_bank")[] = ["credit_card", "qr_payment", "counter_bank"]
  const payerNames = ["Mr. John Smith", "Mrs. Sarah Johnson", "Mr. David Williams", "Ms. Emily Brown", "Mr. Michael Davis", "Mrs. Lisa Garcia", "Mr. James Wilson", "Ms. Maria Rodriguez"]
  const statuses: ("paid" | "pending" | "overdue" | "cancelled")[] = ["paid", "paid", "paid", "pending", "pending", "cancelled", "overdue"]

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

    const parentEmail = `${payerName.split(' ')[1].toLowerCase()}@example.com`

    // Generate NAV sync status for paid invoices
    let navSyncStatus: "synced" | "pending" | "failed" | undefined
    let navSyncDate: Date | undefined
    let lastEmailSentDate: Date | undefined
    let emailStatus: "sent" | "pending" | "not_sent" | "failed" | undefined

    if (status === "paid") {
      // All paid invoices are synced
      navSyncStatus = "synced"
      navSyncDate = new Date(date)
      navSyncDate.setHours(navSyncDate.getHours() + Math.floor(Math.random() * 24) + 1)

      // Generate email status randomly
      const randomEmail = Math.random()
      if (randomEmail > 0.7) {
        // 30% not sent
        emailStatus = "not_sent"
      } else if (randomEmail > 0.6) {
        // 10% pending
        emailStatus = "pending"
      } else if (randomEmail > 0.55) {
        // 5% failed - also has date showing when it failed
        emailStatus = "failed"
        lastEmailSentDate = new Date(navSyncDate)
        lastEmailSentDate.setDate(lastEmailSentDate.getDate() + Math.floor(Math.random() * 7) + 1)
      } else {
        // 55% sent successfully
        emailStatus = "sent"
        lastEmailSentDate = new Date(navSyncDate)
        lastEmailSentDate.setDate(lastEmailSentDate.getDate() + Math.floor(Math.random() * 7) + 1)
      }
    }

    // Generate credit note information (20% of paid invoices use credit notes)
    let creditNoteUsed = false
    let creditNoteNumber: string | undefined
    let creditNoteAmount: number | undefined

    if (status === "paid" && Math.random() > 0.8) {
      creditNoteUsed = true
      creditNoteNumber = `CN-2025-${String(Math.floor(Math.random() * 1000)).padStart(6, '0')}`
      creditNoteAmount = Math.floor(Math.random() * 10000) + 1000 // Random amount between 1000-11000
    }

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
      parentEmail,
      status,
      transactionDate: date,
      lastEmailSentDate,
      emailStatus,
      navSyncStatus,
      navSyncDate,
      parentType: Math.random() > 0.7 ? "external" : "internal", // 30% external, 70% internal
      referenceNumber: `REF-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      paymentDescription: paymentType === "yearly" ? "Annual tuition fee payment for academic year 2025-2026" : "Term 1 tuition fee payment",
      dueDate: new Date(date.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days after transaction date
      notes: status === "cancelled" ? "Payment cancelled by parent request" :
             status === "overdue" ? "Payment overdue - reminder sent" :
             status === "pending" ? "Payment pending - awaiting confirmation" :
             "Payment completed successfully",
      creditNoteUsed,
      creditNoteNumber,
      creditNoteAmount
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
  const [payments, setPayments] = useState<PaymentRecord[]>(mockPayments)
  const [filteredPayments, setFilteredPayments] = useState<PaymentRecord[]>(
    mockPayments.filter(p => p.navSyncStatus !== undefined)
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [emailSentFilter, setEmailSentFilter] = useState<"all" | "sent" | "pending" | "not_sent" | "failed">("all")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [schoolLevelFilter, setSchoolLevelFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date | null>(null)
  const [dateTo, setDateTo] = useState<Date | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null)

  // Email sending limit tracking
  const DAILY_EMAIL_LIMIT = 500
  const [emailsSentToday, setEmailsSentToday] = useState(235)
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString())

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Reset email counter at midnight
  const checkAndResetEmailCounter = () => {
    const today = new Date().toDateString()
    if (today !== lastResetDate) {
      setEmailsSentToday(0)
      setLastResetDate(today)
    }
  }

  // Action handlers
  const handleViewPDF = (payment: PaymentRecord) => {
    setSelectedPayment(payment)
    // In real app, this would open the PDF viewer dialog
  }

  const handleSendEmail = (payment: PaymentRecord) => {
    // Check and reset email counter if needed
    checkAndResetEmailCounter()

    // Check if daily limit reached
    if (emailsSentToday >= DAILY_EMAIL_LIMIT) {
      toast.error(`Daily email limit reached (${DAILY_EMAIL_LIMIT} emails). Please try again tomorrow.`)
      return
    }

    // Update lastEmailSentDate and emailStatus to current date
    const updatedPayments = payments.map(p =>
      p.id === payment.id ? { ...p, lastEmailSentDate: new Date(), emailStatus: "sent" as const } : p
    )
    setPayments(updatedPayments)

    // Also update filtered payments
    const updatedFilteredPayments = filteredPayments.map(p =>
      p.id === payment.id ? { ...p, lastEmailSentDate: new Date(), emailStatus: "sent" as const } : p
    )
    setFilteredPayments(updatedFilteredPayments)

    // Increment email counter
    setEmailsSentToday(prev => prev + 1)

    toast.success(`Email sent to ${payment.parentEmail}`)
    // In real app, this would trigger email sending API
  }

  const handleDownloadInvoice = (payment: PaymentRecord) => {
    toast.success(`Downloading invoice ${payment.invoiceNumber}`)
    // In real app, this would trigger invoice PDF download
  }

  const handleViewTransaction = (payment: PaymentRecord) => {
    toast.info(`Viewing transaction for invoice ${payment.invoiceNumber}`)
    // In real app, this would navigate to transaction details page
  }

  const applyFilters = () => {
    let filtered = payments

    // Only show payments with NAV sync status
    filtered = filtered.filter(payment => payment.navSyncStatus !== undefined)

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (emailSentFilter !== "all") {
      filtered = filtered.filter(payment => payment.emailStatus === emailSentFilter)
    }

    if (gradeFilter !== "all") {
      filtered = filtered.filter(payment => payment.studentGrade === gradeFilter)
    }

    if (schoolLevelFilter !== "all") {
      filtered = filtered.filter(payment => payment.schoolLevel === schoolLevelFilter)
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
    setEmailSentFilter("all")
    setGradeFilter("all")
    setSchoolLevelFilter("all")
    setDateFrom(null)
    setDateTo(null)
    setFilteredPayments(payments.filter(p => p.navSyncStatus !== undefined))
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
  const uniqueGrades = Array.from(new Set(payments.map(payment => payment.studentGrade))).sort((a, b) => {
    // Handle Reception first
    if (a === "Reception") return -1
    if (b === "Reception") return 1

    // Extract year numbers and compare numerically
    const yearA = parseInt(a.replace("Year ", ""))
    const yearB = parseInt(b.replace("Year ", ""))
    return yearA - yearB
  })
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

  const emailPercentage = (emailsSentToday / DAILY_EMAIL_LIMIT) * 100
  const remainingEmails = DAILY_EMAIL_LIMIT - emailsSentToday

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Sent</label>
                <Select value={emailSentFilter} onValueChange={setEmailSentFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="not_sent">Not Sent</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
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
          {t('paymentHistory.totalAmount')}: ฿{filteredPayments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                <TableHead>{t('paymentHistory.parentName')}</TableHead>
                <TableHead>{t('paymentHistory.grade')}</TableHead>
                <TableHead>{t('paymentHistory.amount')}</TableHead>
                <TableHead>Email Sent</TableHead>
                <TableHead>NAV Sync</TableHead>
                <TableHead>{t('paymentHistory.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPagePayments.map((payment) => {
                const isOverdue = payment.dueDate && payment.dueDate < new Date() && payment.status !== "paid"
                return (
                <TableRow
                  key={payment.id}
                  className={isOverdue ? "bg-red-50 border-l-4 border-l-red-500" : ""}
                >
                  <TableCell className="font-mono text-sm">
                    <div className="flex items-center gap-2">
                      {isOverdue && (
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span>{payment.invoiceNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.studentName}</div>
                      <div className="text-sm text-muted-foreground">{payment.studentId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.payerName}</div>
                      <div className="text-sm text-muted-foreground">{payment.parentEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{payment.studentGrade}</Badge>
                  </TableCell>
                  <TableCell>฿{payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    {payment.emailStatus === "sent" && (
                      <div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Sent</Badge>
                        {payment.lastEmailSentDate && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {format(payment.lastEmailSentDate, "MMM dd, yyyy")}
                          </div>
                        )}
                      </div>
                    )}
                    {payment.emailStatus === "pending" && (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
                    )}
                    {payment.emailStatus === "not_sent" && (
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Not sent</Badge>
                    )}
                    {payment.emailStatus === "failed" && (
                      <div>
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
                        {payment.lastEmailSentDate && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {format(payment.lastEmailSentDate, "MMM dd, yyyy")}
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {payment.navSyncDate ? (
                      <div className="text-sm text-muted-foreground">
                        {format(payment.navSyncDate, "MMM dd, yyyy")}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {/* View PDF Button */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewPDF(payment)}
                            className="h-8 w-8 p-0"
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
                              <h3 className="font-semibold text-lg">฿{payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                              <p className="text-sm text-muted-foreground">{payment.paymentDescription}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
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
                                {payment.creditNoteUsed && (
                                  <>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Credit Note</p>
                                      <p className="font-mono text-sm">{payment.creditNoteNumber}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Credit Amount</p>
                                      <p className="font-medium text-green-600">-฿{payment.creditNoteAmount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                  </>
                                )}
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

                    {/* Send Email Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSendEmail(payment)}
                      className="h-8 w-8 p-0"
                    >
                      <Mail className="w-4 h-4" />
                    </Button>

                    {/* Download Invoice Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadInvoice(payment)}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
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