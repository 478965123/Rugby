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
import { CalendarIcon, Search, Download, Filter, Eye, Receipt, CreditCard, ChevronLeft, ChevronRight, Mail, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { getPaymentChannelLabel } from "./StatusFilter"

interface ReceiptRecord {
  id: string
  receiptNumber: string
  invoiceNumber: string
  studentName: string
  studentId: string
  studentGrade: string
  studentRoom: string
  schoolLevel: "preprep" | "prep" | "senior"
  amount: number
  paymentType: "yearly" | "termly"
  paymentMethod: string
  paymentChannel: "credit_card" | "qr_payment" | "counter_bank"
  payerName: string
  parentEmail: string
  transactionDate: Date
  lastEmailSentDate?: Date
  emailStatus?: "sent" | "pending" | "not_sent" | "failed"
  navSyncStatus: "synced" | "pending" | "failed"
  navSyncDate?: Date
  parentType?: "internal" | "external"
  referenceNumber?: string
  paymentDescription?: string
  notes?: string
}

// Generate mock receipts data
const generateMockReceipts = (): ReceiptRecord[] => {
  const grades = ["Pre-nursery", "Nursery", "Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13"]
  const rooms = ["A", "B", "C", "D", "E", "F", "G", "H"]
  const firstNames = ["John", "Sarah", "Mike", "Lisa", "David", "Emma", "James", "Sophia", "William", "Olivia", "Benjamin", "Ava", "Lucas", "Isabella", "Henry", "Mia", "Alexander", "Charlotte", "Mason", "Amelia", "Ethan", "Harper", "Daniel", "Evelyn", "Matthew", "Abigail", "Jackson", "Emily", "Sebastian", "Elizabeth", "Jack", "Sofia", "Aiden", "Avery", "Owen", "Ella", "Samuel", "Madison", "Gabriel", "Scarlett", "Carter", "Victoria", "Wyatt", "Aria", "Jayden", "Grace", "John", "Chloe", "Luke", "Camila", "Anthony", "Penelope", "Isaac", "Riley"]
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"]
  const paymentMethods = ["Credit Card", "PromptPay", "Bank Counter", "Bank Transfer", "Cash"]
  const paymentChannels: ("credit_card" | "qr_payment" | "counter_bank")[] = ["credit_card", "qr_payment", "counter_bank"]
  const payerNames = ["Mr. John Smith", "Mrs. Sarah Johnson", "Mr. David Williams", "Ms. Emily Brown", "Mr. Michael Davis", "Mrs. Lisa Garcia", "Mr. James Wilson", "Ms. Maria Rodriguez"]

  const receipts: ReceiptRecord[] = []

  for (let i = 1; i <= 125; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const grade = grades[Math.floor(Math.random() * grades.length)]
    const room = rooms[Math.floor(Math.random() * rooms.length)]

    // Determine school level based on grade
    // Preprep: Pre-nursery to Year 2
    // Prep: Year 3 to Year 8
    // Senior: Year 9 to Year 13
    let schoolLevel: "preprep" | "prep" | "senior"
    if (grade === "Pre-nursery" || grade === "Nursery" || grade === "Reception" || grade === "Year 1" || grade === "Year 2") {
      schoolLevel = "preprep"
    } else {
      const yearNumber = parseInt(grade.replace("Year ", ""))
      if (yearNumber >= 3 && yearNumber <= 8) {
        schoolLevel = "prep"
      } else {
        schoolLevel = "senior"
      }
    }

    const paymentType = Math.random() > 0.6 ? "yearly" : "termly"
    const amount = paymentType === "yearly" ? 125000 : 42000
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
    const paymentChannel = paymentChannels[Math.floor(Math.random() * paymentChannels.length)]
    const payerName = payerNames[Math.floor(Math.random() * payerNames.length)]

    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 90))

    const parentEmail = `${payerName.split(' ')[1].toLowerCase()}@example.com`

    // Generate NAV sync status (80% synced, 15% pending, 5% failed)
    const rand = Math.random()
    let navSyncStatus: "synced" | "pending" | "failed"
    let navSyncDate: Date | undefined
    let receiptNumber: string
    let lastEmailSentDate: Date | undefined
    let emailStatus: "sent" | "pending" | "not_sent" | "failed" | undefined

    if (rand > 0.2) {
      // Synced - has receipt number and may have email sent
      navSyncStatus = "synced"
      navSyncDate = new Date(date)
      navSyncDate.setHours(navSyncDate.getHours() + Math.floor(Math.random() * 24) + 1) // 1-24 hours after transaction
      receiptNumber = `RCP-2025-${String(i).padStart(6, '0')}`

      // Generate email status randomly
      const randomEmail = Math.random()
      if (randomEmail > 0.7) {
        // 30% not sent
        emailStatus = "not_sent"
      } else if (randomEmail > 0.6) {
        // 10% pending
        emailStatus = "pending"
      } else if (randomEmail > 0.55) {
        // 5% failed
        emailStatus = "failed"
        lastEmailSentDate = new Date(navSyncDate)
        lastEmailSentDate.setDate(lastEmailSentDate.getDate() + Math.floor(Math.random() * 7) + 1)
      } else {
        // 55% sent successfully
        emailStatus = "sent"
        lastEmailSentDate = new Date(navSyncDate)
        lastEmailSentDate.setDate(lastEmailSentDate.getDate() + Math.floor(Math.random() * 7) + 1)
      }
    } else if (rand > 0.05) {
      // Pending - no receipt number, no email
      navSyncStatus = "pending"
      receiptNumber = "-"
      emailStatus = "not_sent"
    } else {
      // Failed - no receipt number, no email
      navSyncStatus = "failed"
      receiptNumber = "-"
      emailStatus = "not_sent"
    }

    receipts.push({
      id: i.toString(),
      receiptNumber,
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
      transactionDate: date,
      lastEmailSentDate,
      emailStatus,
      navSyncStatus,
      navSyncDate,
      parentType: Math.random() > 0.7 ? "external" : "internal",
      referenceNumber: `REF-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      paymentDescription: paymentType === "yearly" ? "Annual tuition fee payment for academic year 2025-2026" : "Term 1 tuition fee payment",
      notes: "Payment completed successfully"
    })
  }

  return receipts
}

const mockReceipts: ReceiptRecord[] = generateMockReceipts()

export function ReceiptPageUpdated() {
  const { t } = useTranslation()
  const [receipts, setReceipts] = useState<ReceiptRecord[]>(mockReceipts)
  const [filteredReceipts, setFilteredReceipts] = useState<ReceiptRecord[]>(mockReceipts)
  const [searchTerm, setSearchTerm] = useState("")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [schoolLevelFilter, setSchoolLevelFilter] = useState("all")
  const [emailSentFilter, setEmailSentFilter] = useState<"all" | "sent" | "pending" | "not_sent" | "failed">("all")
  const [dateFrom, setDateFrom] = useState<Date | null>(null)
  const [dateTo, setDateTo] = useState<Date | null>(null)
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptRecord | null>(null)

  // Email sending limit tracking
  const DAILY_EMAIL_LIMIT = 500
  const [emailsSentToday, setEmailsSentToday] = useState(235)
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString())

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Sorting states
  type SortField = "receiptNumber" | "studentName" | "studentGrade" | "amount" | "transactionDate"
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Reset email counter at midnight
  const checkAndResetEmailCounter = () => {
    const today = new Date().toDateString()
    if (today !== lastResetDate) {
      setEmailsSentToday(0)
      setLastResetDate(today)
    }
  }

  // Action handlers
  const handleViewPDF = (receipt: ReceiptRecord) => {
    setSelectedReceipt(receipt)
  }

  const handleSendEmail = (receipt: ReceiptRecord) => {
    // Check and reset email counter if needed
    checkAndResetEmailCounter()

    // Check if daily limit reached
    if (emailsSentToday >= DAILY_EMAIL_LIMIT) {
      toast.error(`Daily email limit reached (${DAILY_EMAIL_LIMIT} emails). Please try again tomorrow.`)
      return
    }

    // Check if receipt is synced to NAV
    if (receipt.navSyncStatus !== "synced") {
      toast.error("Cannot send email. Receipt must be synced to NAV first.")
      return
    }

    // Update lastEmailSentDate and emailStatus to current date
    const updatedReceipts = receipts.map(r =>
      r.id === receipt.id ? { ...r, lastEmailSentDate: new Date(), emailStatus: "sent" as const } : r
    )
    setReceipts(updatedReceipts)

    // Also update filtered receipts
    const updatedFilteredReceipts = filteredReceipts.map(r =>
      r.id === receipt.id ? { ...r, lastEmailSentDate: new Date(), emailStatus: "sent" as const } : r
    )
    setFilteredReceipts(updatedFilteredReceipts)

    // Increment email counter
    setEmailsSentToday(prev => prev + 1)

    toast.success(`Email sent to ${receipt.parentEmail}`)
  }

  const handleDownloadReceipt = (receipt: ReceiptRecord) => {
    // Check if receipt is synced to NAV
    if (receipt.navSyncStatus !== "synced") {
      toast.error("Cannot download receipt. Receipt must be synced to NAV first.")
      return
    }

    toast.success(`Downloading receipt ${receipt.receiptNumber}`)
  }

  const applyFilters = () => {
    let filtered = receipts

    if (searchTerm) {
      filtered = filtered.filter(receipt =>
        receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (gradeFilter !== "all") {
      filtered = filtered.filter(receipt => receipt.studentGrade === gradeFilter)
    }

    if (schoolLevelFilter !== "all") {
      filtered = filtered.filter(receipt => receipt.schoolLevel === schoolLevelFilter)
    }

    if (emailSentFilter !== "all") {
      filtered = filtered.filter(receipt => receipt.emailStatus === emailSentFilter)
    }

    if (dateFrom) {
      filtered = filtered.filter(receipt => receipt.transactionDate >= dateFrom)
    }

    if (dateTo) {
      filtered = filtered.filter(receipt => receipt.transactionDate <= dateTo)
    }

    setFilteredReceipts(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setGradeFilter("all")
    setSchoolLevelFilter("all")
    setEmailSentFilter("all")
    setDateFrom(null)
    setDateTo(null)
    setFilteredReceipts(receipts)
    setCurrentPage(1)
  }

  const getPaymentTypeBadge = (paymentType: string) => {
    return paymentType === "yearly"
      ? <Badge variant="default">{t('paymentHistory.yearly')}</Badge>
      : <Badge variant="secondary">{t('paymentHistory.termly')}</Badge>
  }

  const downloadReceipt = (receipt: ReceiptRecord) => {
    console.log("Downloading receipt", receipt.receiptNumber)
    toast.success(`Receipt ${receipt.receiptNumber} downloaded`)
  }

  // Sort receipts
  const sortedReceipts = sortField ? [...filteredReceipts].sort((a, b) => {
    let aValue: any = a[sortField]
    let bValue: any = b[sortField]

    if (sortField === "transactionDate") {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    } else if (sortField === "studentGrade") {
      // Handle Year Group sorting (Reception, Year 1, Year 2, etc.)
      const getGradeNumber = (grade: string) => {
        if (grade === "Reception") return 0
        const match = grade.match(/Year (\d+)/)
        return match ? parseInt(match[1]) : 999
      }
      aValue = getGradeNumber(aValue)
      bValue = getGradeNumber(bValue)
    } else if (typeof aValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  }) : filteredReceipts

  // Pagination logic
  const totalPages = Math.ceil(sortedReceipts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPageReceipts = sortedReceipts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value))
    setCurrentPage(1)
  }

  const exportData = () => {
    const csvContent = [
      // Header
      ['Receipt Number', 'Invoice Number', 'Student Name', 'Student ID', 'Grade', 'Parent Name', 'Parent Email', 'Amount', 'Payment Channel', 'Transaction Date', 'Email Status', 'NAV Sync Status'].join(','),
      // Data rows
      ...filteredReceipts.map(receipt => [
        receipt.receiptNumber,
        receipt.invoiceNumber,
        receipt.studentName,
        receipt.studentId,
        receipt.studentGrade,
        receipt.payerName,
        receipt.parentEmail,
        receipt.amount,
        receipt.paymentChannel,
        format(receipt.transactionDate, 'yyyy-MM-dd'),
        receipt.emailStatus || 'not_sent',
        receipt.navSyncStatus || '-'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `receipts-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Receipt data exported successfully')
  }

  const grades = ["Pre-nursery", "Nursery", "Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13"]

  const emailPercentage = (emailsSentToday / DAILY_EMAIL_LIMIT) * 100
  const remainingEmails = DAILY_EMAIL_LIMIT - emailsSentToday

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Receipt</h2>
          <p className="text-muted-foreground">
            View receipt records and transaction details
          </p>
        </div>
        <Button onClick={exportData} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Data
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
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('paymentHistory.search')}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Receipt, invoice, student name, or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Grade Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('paymentHistory.gradeLevel')}</label>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('paymentHistory.allGrades')}</SelectItem>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* School Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('paymentHistory.schoolLevel')}</label>
              <Select value={schoolLevelFilter} onValueChange={setSchoolLevelFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('paymentHistory.allSchoolLevels')}</SelectItem>
                  <SelectItem value="preprep">{t('paymentHistory.schoolLevels.preprep')}</SelectItem>
                  <SelectItem value="prep">{t('paymentHistory.schoolLevels.prep')}</SelectItem>
                  <SelectItem value="senior">{t('paymentHistory.schoolLevels.senior')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email Sent */}
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

            {/* Date Range */}
            <div className="space-y-2 col-span-3">
              <label className="text-sm font-medium">{t('paymentHistory.dateRange')}</label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal w-full">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "MMM dd, yyyy") : t('paymentHistory.from')}
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

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal w-full">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "MMM dd, yyyy") : t('paymentHistory.to')}
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
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={applyFilters}>
              {t('paymentHistory.applyFilters')}
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              {t('paymentHistory.clearAll')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {t('paymentHistory.showing')} {startIndex + 1}-{Math.min(endIndex, filteredReceipts.length)} {t('paymentHistory.of')} {filteredReceipts.length} receipts
          {filteredReceipts.length !== receipts.length && (
            <span> ({t('paymentHistory.filteredFrom')} {receipts.length} {t('paymentHistory.total')})</span>
          )}
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
        {t('paymentHistory.totalAmount')}: ฿{filteredReceipts.reduce((sum, receipt) => sum + receipt.amount, 0).toLocaleString()}
      </div>

      {/* Receipt Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort("receiptNumber")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Receipt Number
                    {sortField === "receiptNumber" ? (
                      sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </button>
                </TableHead>
                <TableHead>Invoice Number</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("studentName")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    {t('paymentHistory.student')}
                    {sortField === "studentName" ? (
                      sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </button>
                </TableHead>
                <TableHead>{t('paymentHistory.parentName')}</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("studentGrade")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    {t('paymentHistory.grade')}
                    {sortField === "studentGrade" ? (
                      sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("amount")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    {t('paymentHistory.amount')}
                    {sortField === "amount" ? (
                      sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("transactionDate")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Payment Date
                    {sortField === "transactionDate" ? (
                      sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </button>
                </TableHead>
                <TableHead>Email Sent</TableHead>
                <TableHead>NAV Sync</TableHead>
                <TableHead>{t('paymentHistory.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageReceipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-mono text-sm">
                    {receipt.receiptNumber}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {receipt.invoiceNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{receipt.studentName}</div>
                      <div className="text-sm text-muted-foreground">{receipt.studentId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{receipt.payerName}</div>
                      <div className="text-sm text-muted-foreground">{receipt.parentEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{receipt.studentGrade}</Badge>
                  </TableCell>
                  <TableCell>฿{receipt.amount.toLocaleString()}</TableCell>
                  <TableCell>{format(receipt.transactionDate, "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    {receipt.emailStatus === "sent" && (
                      <div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Sent</Badge>
                        {receipt.lastEmailSentDate && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {format(receipt.lastEmailSentDate, "MMM dd, yyyy")}
                          </div>
                        )}
                      </div>
                    )}
                    {receipt.emailStatus === "pending" && (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
                    )}
                    {receipt.emailStatus === "not_sent" && (
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Not sent</Badge>
                    )}
                    {receipt.emailStatus === "failed" && (
                      <div>
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
                        {receipt.lastEmailSentDate && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {format(receipt.lastEmailSentDate, "MMM dd, yyyy")}
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {receipt.navSyncDate ? (
                      <div className="text-sm text-muted-foreground">
                        {format(receipt.navSyncDate, "MMM dd, yyyy")}
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
                            onClick={() => handleViewPDF(receipt)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Receipt className="w-5 h-5" />
                              Receipt Details
                            </DialogTitle>
                            <DialogDescription>
                              Complete receipt information for {receipt.receiptNumber}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-6">
                            {/* Payment Summary */}
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg">฿{receipt.amount.toLocaleString()}</h3>
                                <p className="text-sm text-muted-foreground">{receipt.paymentDescription}</p>
                              </div>
                              <div className="text-right">
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {format(receipt.transactionDate, "MMM dd, yyyy 'at' HH:mm")}
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
                                    <p className="font-medium">{receipt.studentName}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">{t('paymentHistory.studentId')}</p>
                                    <p className="font-mono text-sm">{receipt.studentId}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">{t('paymentHistory.gradeLevel')}</p>
                                    <Badge variant="secondary">{receipt.studentGrade}</Badge>
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
                                      <span>{receipt.paymentMethod}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">{t('paymentHistory.paymentChannel')}</p>
                                    <p>{receipt.paymentChannel}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">{t('paymentHistory.payerName')}</p>
                                    <p className="font-medium">{receipt.payerName}</p>
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
                                  <p className="text-sm text-muted-foreground">Receipt Number</p>
                                  <p className="font-mono text-sm">{receipt.receiptNumber}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Invoice Number</p>
                                  <p className="font-mono text-sm">{receipt.invoiceNumber}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">{t('paymentHistory.referenceNumber')}</p>
                                  <p className="font-mono text-sm">{receipt.referenceNumber || "N/A"}</p>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between pt-4">
                              <Button
                                variant="outline"
                                onClick={() => downloadReceipt(receipt)}
                                className="flex items-center gap-2"
                              >
                                <Download className="w-4 h-4" />
                                Download Receipt
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Send Email Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSendEmail(receipt)}
                        disabled={receipt.navSyncStatus !== "synced"}
                        className="h-8 w-8 p-0"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>

                      {/* Download Receipt Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownloadReceipt(receipt)}
                        disabled={receipt.navSyncStatus !== "synced"}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
              </PaginationItem>

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
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={currentPage === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
