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
import { CalendarIcon, Search, Filter, Eye, CreditCard, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"

interface PaymentTransaction {
  id: string
  invoiceNumber: string
  studentName: string
  studentId: string
  studentGrade: string
  parentEmail: string
  paymentChannel: string
  paymentStatus: "success" | "pending" | "failed" | "refunded"
  amount: number
  fee: number
  totalAmount: number
  transactionDate: Date
  cardBrand?: string
  cardLastFour?: string
  paymentMethod: string
  referenceNumber: string
}

// Generate mock payment transactions
const generateMockTransactions = (): PaymentTransaction[] => {
  const grades = ["Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  const firstNames = ["John", "Sarah", "Mike", "Lisa", "David", "Emma", "James", "Sophia", "William", "Olivia"]
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]
  const paymentChannels = ["Credit Card", "QR Payment", "Bank Counter", "Bank Transfer"]
  const cardBrands = ["Visa", "Mastercard", "American Express", "JCB"]
  const statuses: ("success" | "pending" | "failed" | "refunded")[] = ["success", "pending", "failed", "refunded"]

  const transactions: PaymentTransaction[] = []

  for (let i = 1; i <= 150; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const grade = grades[Math.floor(Math.random() * grades.length)]
    const paymentChannel = paymentChannels[Math.floor(Math.random() * paymentChannels.length)]

    // 85% success, 8% pending, 5% failed, 2% refunded
    const rand = Math.random()
    let status: "success" | "pending" | "failed" | "refunded"
    if (rand > 0.15) status = "success"
    else if (rand > 0.07) status = "pending"
    else if (rand > 0.02) status = "failed"
    else status = "refunded"

    const amount = Math.random() > 0.6 ? 125000 : 42000
    const fee = paymentChannel === "Credit Card" ? amount * 0.03 : (paymentChannel === "QR Payment" ? amount * 0.015 : 0)
    const totalAmount = amount + fee

    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 90))

    const parentEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`

    // Card info only for credit card payments
    const cardBrand = paymentChannel === "Credit Card" ? cardBrands[Math.floor(Math.random() * cardBrands.length)] : undefined
    const cardLastFour = paymentChannel === "Credit Card" ? String(Math.floor(Math.random() * 9999)).padStart(4, '0') : undefined

    transactions.push({
      id: i.toString(),
      invoiceNumber: `INV-2025-${String(i).padStart(6, '0')}`,
      studentName: `${firstName} ${lastName}`,
      studentId: `ST${String(i).padStart(6, '0')}`,
      studentGrade: grade,
      parentEmail,
      paymentChannel,
      paymentStatus: status,
      amount,
      fee,
      totalAmount,
      transactionDate: date,
      cardBrand,
      cardLastFour,
      paymentMethod: paymentChannel,
      referenceNumber: `REF-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`
    })
  }

  return transactions.sort((a, b) => b.transactionDate.getTime() - a.transactionDate.getTime())
}

const mockTransactions: PaymentTransaction[] = generateMockTransactions()

export function PaymentTransactions() {
  const { t } = useTranslation()
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(mockTransactions)
  const [filteredTransactions, setFilteredTransactions] = useState<PaymentTransaction[]>(mockTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [channelFilter, setChannelFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date | null>(null)
  const [dateTo, setDateTo] = useState<Date | null>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const applyFilters = () => {
    let filtered = transactions

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(tx =>
        tx.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.parentEmail.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Grade filter
    if (gradeFilter !== "all") {
      filtered = filtered.filter(tx => tx.studentGrade === gradeFilter)
    }

    // Channel filter
    if (channelFilter !== "all") {
      filtered = filtered.filter(tx => tx.paymentChannel === channelFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(tx => tx.paymentStatus === statusFilter)
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(tx => tx.transactionDate >= dateFrom)
    }

    if (dateTo) {
      filtered = filtered.filter(tx => tx.transactionDate <= dateTo)
    }

    setFilteredTransactions(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setGradeFilter("all")
    setChannelFilter("all")
    setStatusFilter("all")
    setDateFrom(null)
    setDateTo(null)
    setFilteredTransactions(transactions)
    setCurrentPage(1)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Success</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
      case "refunded":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Refunded</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPageTransactions = filteredTransactions.slice(startIndex, endIndex)

  const grades = ["Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  const paymentChannels = ["Credit Card", "QR Payment", "Bank Counter", "Bank Transfer"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Payment Transactions</h2>
        <p className="text-muted-foreground">
          View detailed payment transaction history and card information
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search and Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Invoice number, student name, student ID, or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Year Group */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Year Group</label>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Channel */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Channel</label>
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  {paymentChannels.map((channel) => (
                    <SelectItem key={channel} value={channel}>
                      {channel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2 col-span-3">
              <label className="text-sm font-medium">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal w-full">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "From"}
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
                      {dateTo ? format(dateTo, "MMM dd, yyyy") : "To"}
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
              Apply Filters
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
          {filteredTransactions.length !== transactions.length && (
            <span> (filtered from {transactions.length} total)</span>
          )}
        </p>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Show:</label>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => {
            setItemsPerPage(parseInt(value))
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>
      </div>

      {/* Transaction Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No.</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Year Group</TableHead>
                <TableHead>Parent Email</TableHead>
                <TableHead>Payment Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Transaction Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">
                    {transaction.invoiceNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{transaction.studentName}</div>
                      <div className="text-sm text-muted-foreground">{transaction.studentId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{transaction.studentGrade}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{transaction.parentEmail}</TableCell>
                  <TableCell>{transaction.paymentChannel}</TableCell>
                  <TableCell>{getStatusBadge(transaction.paymentStatus)}</TableCell>
                  <TableCell>฿{transaction.amount.toLocaleString()}</TableCell>
                  <TableCell>฿{transaction.fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>{format(transaction.transactionDate, "MMM dd, yyyy HH:mm")}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedTransaction(transaction)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Transaction Details
                          </DialogTitle>
                          <DialogDescription>
                            Complete payment information for {transaction.invoiceNumber}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* Payment Summary */}
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">฿{transaction.totalAmount.toLocaleString()}</h3>
                              <p className="text-sm text-muted-foreground">Total Amount (including fees)</p>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(transaction.paymentStatus)}
                              <p className="text-sm text-muted-foreground mt-1">
                                {format(transaction.transactionDate, "MMM dd, yyyy 'at' HH:mm")}
                              </p>
                            </div>
                          </div>

                          <Separator />

                          {/* Student Information */}
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-3">Student Information</h4>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm text-muted-foreground">Student Name</p>
                                  <p className="font-medium">{transaction.studentName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Student ID</p>
                                  <p className="font-mono text-sm">{transaction.studentId}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Year Group</p>
                                  <Badge variant="secondary">{transaction.studentGrade}</Badge>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Parent Email</p>
                                  <p className="text-sm">{transaction.parentEmail}</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-3">Payment Information</h4>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm text-muted-foreground">Payment Channel</p>
                                  <p>{transaction.paymentChannel}</p>
                                </div>
                                {transaction.cardBrand && transaction.cardLastFour && (
                                  <div>
                                    <p className="text-sm text-muted-foreground">Card Details</p>
                                    <div className="flex items-center gap-2">
                                      <CreditCard className="w-4 h-4" />
                                      <span>{transaction.cardBrand} •••• {transaction.cardLastFour}</span>
                                    </div>
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm text-muted-foreground">Reference Number</p>
                                  <p className="font-mono text-sm">{transaction.referenceNumber}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Amount Breakdown */}
                          <div>
                            <h4 className="font-medium mb-3">Amount Breakdown</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Tuition Amount</span>
                                <span className="font-mono">฿{transaction.amount.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Transaction Fee</span>
                                <span className="font-mono">฿{transaction.fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between font-semibold">
                                <span>Total Amount</span>
                                <span className="font-mono">฿{transaction.totalAmount.toLocaleString()}</span>
                              </div>
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
