import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Checkbox } from "./ui/checkbox"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Separator } from "./ui/separator"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination"
import { CalendarIcon, Search, Download, Filter, Eye, Receipt, CreditCard, ChevronLeft, ChevronRight, Mail, ExternalLink, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
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
  schoolLevel: "preprep" | "prep" | "senior"
  amount: number
  paymentType: "yearly" | "termly"
  paymentMethod: string
  paymentChannel: "credit_card" | "qr_payment" | "counter_bank"
  payerName: string
  parentEmail: string
  status: "paid" | "pending" | "overdue" | "cancelled"
  invoiceStatus: "paid" | "unpaid" | "overdue" | "cancelled" | "partial"
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
  const grades = ["Pre-nursery", "Nursery", "Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13"]
  const rooms = ["A", "B", "C", "D", "E", "F", "G", "H"]
  const firstNames = ["John", "Sarah", "Mike", "Lisa", "David", "Emma", "James", "Sophia", "William", "Olivia", "Benjamin", "Ava", "Lucas", "Isabella", "Henry", "Mia", "Alexander", "Charlotte", "Mason", "Amelia", "Ethan", "Harper", "Daniel", "Evelyn", "Matthew", "Abigail", "Jackson", "Emily", "Sebastian", "Elizabeth", "Jack", "Sofia", "Aiden", "Avery", "Owen", "Ella", "Samuel", "Madison", "Gabriel", "Scarlett", "Carter", "Victoria", "Wyatt", "Aria", "Jayden", "Grace", "John", "Chloe", "Luke", "Camila", "Anthony", "Penelope", "Isaac", "Riley"]
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"]
  const paymentMethods = ["Credit Card", "PromptPay", "Bank Counter", "Bank Transfer", "Cash"]
  const paymentChannels: ("credit_card" | "qr_payment" | "counter_bank")[] = ["credit_card", "qr_payment", "counter_bank"]
  const payerNames = ["Mr. John Smith", "Mrs. Sarah Johnson", "Mr. David Williams", "Ms. Emily Brown", "Mr. Michael Davis", "Mrs. Lisa Garcia", "Mr. James Wilson", "Ms. Maria Rodriguez"]
  const statuses: ("paid" | "pending" | "overdue" | "cancelled")[] = ["paid", "paid", "paid", "pending", "pending", "cancelled", "overdue"]
  const invoiceStatuses: ("paid" | "unpaid" | "overdue" | "cancelled" | "partial")[] = ["paid", "paid", "paid", "unpaid", "unpaid", "overdue", "cancelled"]

  const payments: PaymentRecord[] = []

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
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const invoiceStatus = invoiceStatuses[Math.floor(Math.random() * invoiceStatuses.length)]
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
      invoiceStatus,
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
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<"all" | "paid" | "unpaid" | "overdue">("all")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [schoolLevelFilter, setSchoolLevelFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date | null>(null)
  const [dateTo, setDateTo] = useState<Date | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null)
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<Set<string>>(new Set())

  // Email sending limit tracking
  const DAILY_EMAIL_LIMIT = 500
  const [emailsSentToday, setEmailsSentToday] = useState(235)
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString())
  const emailsSentTodayRef = useRef(emailsSentToday)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Sorting states
  type SortField = "invoiceNumber" | "studentName" | "studentGrade" | "amount" | "invoiceStatus" | "transactionDate"
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    emailsSentTodayRef.current = emailsSentToday
  }, [emailsSentToday])

  useEffect(() => {
    setSelectedInvoiceIds(prev => {
      if (prev.size === 0) return prev
      const visibleIds = new Set(filteredPayments.map(payment => payment.id))
      let changed = false
      const next = new Set<string>()
      prev.forEach(id => {
        if (visibleIds.has(id)) {
          next.add(id)
        } else {
          changed = true
        }
      })
      return changed ? next : prev
    })
  }, [filteredPayments])

  // Reset email counter at midnight
  const checkAndResetEmailCounter = () => {
    const today = new Date().toDateString()
    if (today !== lastResetDate) {
      setEmailsSentToday(() => {
        emailsSentTodayRef.current = 0
        return 0
      })
      setLastResetDate(today)
      emailsSentTodayRef.current = 0
    }
  }

  const incrementEmailsSent = () => {
    setEmailsSentToday(prev => {
      const updated = prev + 1
      emailsSentTodayRef.current = updated
      return updated
    })
  }

  // Action handlers
  const handleViewPDF = (payment: PaymentRecord) => {
    setSelectedPayment(payment)
    // In real app, this would open the PDF viewer dialog
  }

  const performEmailSend = (payment: PaymentRecord): boolean => {
    checkAndResetEmailCounter()

    if (emailsSentTodayRef.current >= DAILY_EMAIL_LIMIT) {
      return false
    }

    const timestamp = new Date()

    setPayments(prev =>
      prev.map(p =>
        p.id === payment.id ? { ...p, lastEmailSentDate: timestamp, emailStatus: "sent" as const } : p
      )
    )

    setFilteredPayments(prev =>
      prev.map(p =>
        p.id === payment.id ? { ...p, lastEmailSentDate: timestamp, emailStatus: "sent" as const } : p
      )
    )

    incrementEmailsSent()

    setSelectedInvoiceIds(prev => {
      if (!prev.has(payment.id)) return prev
      const next = new Set(prev)
      next.delete(payment.id)
      return next
    })

    return true
  }

  const handleSendEmail = (payment: PaymentRecord) => {
    const success = performEmailSend(payment)

    if (!success) {
      toast.error(`Daily email limit reached (${DAILY_EMAIL_LIMIT} emails). Please try again tomorrow.`)
      return
    }

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

  const handleBulkSendEmails = () => {
    if (selectedInvoiceIds.size === 0) {
      toast.error("Please select at least one invoice to send reminder emails.")
      return
    }

    const paymentsToEmail = filteredPayments.filter(payment => selectedInvoiceIds.has(payment.id))
    if (paymentsToEmail.length === 0) {
      toast.error("Selected invoices are not available with the current filters.")
      return
    }

    let sentCount = 0
    for (const payment of paymentsToEmail) {
      const success = performEmailSend(payment)
      if (!success) {
        toast.error(sentCount === 0
          ? `Daily email limit reached (${DAILY_EMAIL_LIMIT} emails). Please try again tomorrow.`
          : `Daily email limit reached. Sent ${sentCount} of ${paymentsToEmail.length} selected invoices.`)
        return
      }
      sentCount++
    }

    toast.success(`Email reminders sent to ${sentCount} invoice${sentCount > 1 ? "s" : ""}.`)
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

    if (invoiceStatusFilter !== "all") {
      filtered = filtered.filter(payment => payment.invoiceStatus === invoiceStatusFilter)
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
    setInvoiceStatusFilter("all")
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field with ascending direction
      setSortField(field)
      setSortDirection("asc")
    }
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
      `- Invoice Status: ${invoiceStatusFilter === 'all' ? 'All Statuses' : invoiceStatusFilter.charAt(0).toUpperCase() + invoiceStatusFilter.slice(1)}`,
      `- Email Sent: ${emailSentFilter === 'all' ? 'All' : emailSentFilter.charAt(0).toUpperCase() + emailSentFilter.slice(1)}`,
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
        const invoiceStatusText = invoiceStatusFilter === 'all' ? 'all' : invoiceStatusFilter
        const emailStatusText = emailSentFilter === 'all' ? 'all' : emailSentFilter
        const gradeText = gradeFilter === 'all' ? 'all-grades' : gradeFilter.replace(/\s+/g, '-').toLowerCase()

        const filename = `payment-history-${type}-${invoiceStatusText}-${emailStatusText}-${gradeText}-${currentDate}.csv`
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
    // Define the correct order
    const gradeOrder = ["Pre-nursery", "Nursery", "Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13"]
    const indexA = gradeOrder.indexOf(a)
    const indexB = gradeOrder.indexOf(b)

    // If both grades are in the order array, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }
    // If only one is in the array, prioritize it
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1
    // If neither is in the array, maintain alphabetical order
    return a.localeCompare(b)
  })
  const uniqueRooms = Array.from(new Set(payments.map(payment => payment.studentRoom))).sort()

  // Sort payments
  const sortedPayments = sortField ? [...filteredPayments].sort((a, b) => {
    let aValue: any = a[sortField]
    let bValue: any = b[sortField]

    // Handle date sorting
    if (sortField === "transactionDate") {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    } else if (sortField === "studentGrade") {
      // Handle Year Group sorting (Pre-nursery, Nursery, Reception, Year 1, Year 2, etc.)
      const getGradeNumber = (grade: string) => {
        if (grade === "Pre-nursery") return -2
        if (grade === "Nursery") return -1
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
  }) : filteredPayments

  // Pagination calculations
  const totalPages = Math.ceil(sortedPayments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPagePayments = sortedPayments.slice(startIndex, endIndex)
  const isCurrentPageFullySelected = currentPagePayments.length > 0 && currentPagePayments.every(payment => selectedInvoiceIds.has(payment.id))
  const isCurrentPagePartiallySelected = currentPagePayments.some(payment => selectedInvoiceIds.has(payment.id)) && !isCurrentPageFullySelected

  const toggleSelectCurrentPage = () => {
    setSelectedInvoiceIds(prev => {
      const next = new Set(prev)
      if (isCurrentPageFullySelected) {
        currentPagePayments.forEach(payment => next.delete(payment.id))
      } else {
        currentPagePayments.forEach(payment => next.add(payment.id))
      }
      return next
    })
  }

  const handleInvoiceSelection = (invoiceId: string) => {
    setSelectedInvoiceIds(prev => {
      const next = new Set(prev)
      if (next.has(invoiceId)) {
        next.delete(invoiceId)
      } else {
        next.add(invoiceId)
      }
      return next
    })
  }

  const selectedInvoicesCount = selectedInvoiceIds.size
  const hasSelectedInvoices = selectedInvoicesCount > 0

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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleBulkSendEmails}
            disabled={!hasSelectedInvoices}
          >
            <Mail className="w-4 h-4" />
            Send Reminder Emails{hasSelectedInvoices ? ` (${selectedInvoicesCount})` : ""}
          </Button>
          <Button onClick={exportData} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            {t('paymentHistory.exportData')}
          </Button>
        </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <label className="text-sm font-medium">Invoice Status</label>
                <Select value={invoiceStatusFilter} onValueChange={setInvoiceStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
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
                    <SelectItem value="preprep">{t('paymentHistory.schoolLevels.preprep')}</SelectItem>
                    <SelectItem value="prep">{t('paymentHistory.schoolLevels.prep')}</SelectItem>
                    <SelectItem value="senior">{t('paymentHistory.schoolLevels.senior')}</SelectItem>
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
                <TableHead className="w-12">
                  <Checkbox
                    aria-label="Select all invoices on this page"
                    checked={
                      currentPagePayments.length === 0
                        ? false
                        : isCurrentPageFullySelected
                          ? true
                          : isCurrentPagePartiallySelected
                            ? "indeterminate"
                            : false
                    }
                    onCheckedChange={() => toggleSelectCurrentPage()}
                    disabled={currentPagePayments.length === 0}
                  />
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("invoiceNumber")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    {t('paymentHistory.invoiceNumber')}
                    {sortField === "invoiceNumber" ? (
                      sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </button>
                </TableHead>
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
                    onClick={() => handleSort("invoiceStatus")}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Invoice Status
                    {sortField === "invoiceStatus" ? (
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
              {currentPagePayments.map((payment) => {
                const isOverdue = payment.dueDate && payment.dueDate < new Date() && payment.status !== "paid"
                return (
                <TableRow
                  key={payment.id}
                  className={isOverdue ? "bg-red-50 border-l-4 border-l-red-500" : ""}
                >
                  <TableCell className="w-12">
                    <Checkbox
                      aria-label={`Select ${payment.invoiceNumber}`}
                      checked={selectedInvoiceIds.has(payment.id)}
                      onCheckedChange={() => handleInvoiceSelection(payment.id)}
                    />
                  </TableCell>
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
                    {payment.invoiceStatus === "paid" && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
                    )}
                    {payment.invoiceStatus === "unpaid" && (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Unpaid</Badge>
                    )}
                    {payment.invoiceStatus === "overdue" && (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>
                    )}
                    {payment.invoiceStatus === "cancelled" && (
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Cancelled</Badge>
                    )}
                    {payment.invoiceStatus === "partial" && (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Partial</Badge>
                    )}
                  </TableCell>
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
