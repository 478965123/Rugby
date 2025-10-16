import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Separator } from "./ui/separator"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Textarea } from "./ui/textarea"
import { Search, Filter, Eye, Plus, Download, Mail, CalendarIcon, Coins, FileText, AlertCircle, CheckCircle, Clock, RefreshCw, Trash2, Edit, X, Upload, Users, User, FileSpreadsheet } from "lucide-react"
import { ViewModal } from "./ViewModal"
import { format } from "date-fns"
import { toast } from "sonner@2.0.3"

interface Invoice {
  id: string
  invoiceNumber: string
  studentName: string
  studentId: string
  studentGrade: string
  parentName: string
  parentEmail: string
  totalAmount: number
  discountAmount: number
  finalAmount: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  issueDate: Date
  dueDate: Date
  paidDate?: Date
  issuedBy: string
  items: InvoiceItem[]
  notes: string
}

interface InvoiceItem {
  id: string
  description: string
  amount: number
  discountPercent: number
  discountedAmount: number
}

interface PreCreatedItem {
  id: string
  name: string
  description: string
  amount: number
  category: string
  isActive: boolean
  applicableGrades: string[]
}

interface InvoiceTemplate {
  id: string
  name: string
  grade: string
  items: Omit<InvoiceItem, 'id'>[]
  isDefault: boolean
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2025-001234",
    studentName: "John Smith",
    studentId: "ST001234",
    studentGrade: "Year 10",
    parentName: "Robert Smith",
    parentEmail: "robert.smith@email.com",
    totalAmount: 125000,
    discountAmount: 5000,
    finalAmount: 120000,
    status: "sent",
    issueDate: new Date("2025-08-20"),
    dueDate: new Date("2025-09-20"),
    issuedBy: "Finance Team",
    items: [
      {
        id: "1",
        description: "Swimming Program - Term 2",
        amount: 80000,
        discountPercent: 0,
        discountedAmount: 80000
      },
      {
        id: "2",
        description: "Advanced Mathematics",
        amount: 50000,
        discountPercent: 10,
        discountedAmount: 45000
      }
    ],
    notes: "Standard term 2 invoice"
  },
  {
    id: "2",
    invoiceNumber: "INV-2025-001235",
    studentName: "Sarah Wilson",
    studentId: "ST001235",
    studentGrade: "Year 7",
    parentName: "Michael Wilson",
    parentEmail: "michael.wilson@email.com",
    totalAmount: 42000,
    discountAmount: 2000,
    finalAmount: 40000,
    status: "paid",
    issueDate: new Date("2025-08-15"),
    dueDate: new Date("2025-09-15"),
    paidDate: new Date("2025-08-20"),
    issuedBy: "Admin Office",
    items: [
      {
        id: "1",
        description: "Art & Craft Program",
        amount: 42000,
        discountPercent: 5,
        discountedAmount: 39900
      }
    ],
    notes: "Sibling discount applied"
  }
]

const mockTemplates: InvoiceTemplate[] = [
  {
    id: "1",
    name: "Standard Year 10",
    grade: "Year 10",
    isDefault: true,
    items: [
      {
        description: "Swimming Program",
        amount: 80000,
        discountPercent: 0,
        discountedAmount: 80000
      },
      {
        description: "Advanced Mathematics",
        amount: 50000,
        discountPercent: 0,
        discountedAmount: 50000
      },
      {
        description: "Science Laboratory",
        amount: 30000,
        discountPercent: 0,
        discountedAmount: 30000
      }
    ]
  },
  {
    id: "2",
    name: "Standard Year 7",
    grade: "Year 7",
    isDefault: true,
    items: [
      {
        description: "Art & Craft Program",
        amount: 42000,
        discountPercent: 0,
        discountedAmount: 42000
      },
      {
        description: "Basic Computer Skills",
        amount: 25000,
        discountPercent: 0,
        discountedAmount: 25000
      }
    ]
  }
]

const grades = [
  "Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", 
  "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"
]

const mockStudents = [
  { id: "ST001234", name: "John Smith", grade: "Year 10", parentName: "Robert Smith", email: "robert.smith@email.com" },
  { id: "ST001235", name: "Sarah Wilson", grade: "Year 7", parentName: "Michael Wilson", email: "michael.wilson@email.com" },
  { id: "ST001236", name: "Mike Johnson", grade: "Year 12", parentName: "Lisa Johnson", email: "lisa.johnson@email.com" },
  { id: "ST001237", name: "Emma Davis", grade: "Year 3", parentName: "David Davis", email: "david.davis@email.com" },
  { id: "ST001238", name: "Tom Brown", grade: "Year 10", parentName: "Jane Brown", email: "jane.brown@email.com" },
  { id: "ST001239", name: "Lisa Chen", grade: "Year 10", parentName: "David Chen", email: "david.chen@email.com" },
  { id: "ST001240", name: "Mark Taylor", grade: "Year 10", parentName: "Susan Taylor", email: "susan.taylor@email.com" },
  { id: "ST001241", name: "Anna Martinez", grade: "Year 7", parentName: "Carlos Martinez", email: "carlos.martinez@email.com" },
  { id: "ST001242", name: "Peter Lee", grade: "Year 7", parentName: "Michelle Lee", email: "michelle.lee@email.com" },
]

const mockPreCreatedItems: PreCreatedItem[] = [
  {
    id: "item-001",
    name: "Swimming Program Fee",
    description: "Swimming lessons and pool maintenance fee",
    amount: 80000,
    category: "Sports & Activities",
    isActive: true,
    applicableGrades: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  },
  {
    id: "item-002",
    name: "Advanced Mathematics",
    description: "Additional mathematics tutoring program",
    amount: 50000,
    category: "Academic Programs",
    isActive: true,
    applicableGrades: ["Year 9", "Year 10", "Year 11", "Year 12"]
  },
  {
    id: "item-003",
    name: "Science Laboratory Fee",
    description: "Laboratory equipment and materials fee",
    amount: 30000,
    category: "Academic Programs",
    isActive: true,
    applicableGrades: ["Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  },
  {
    id: "item-004",
    name: "Art & Craft Program",
    description: "Art supplies and craft materials",
    amount: 42000,
    category: "Creative Arts",
    isActive: true,
    applicableGrades: ["Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7"]
  },
  {
    id: "item-005",
    name: "Music Lessons",
    description: "Individual and group music instruction",
    amount: 35000,
    category: "Creative Arts",
    isActive: true,
    applicableGrades: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10"]
  },
  {
    id: "item-006",
    name: "Computer Programming",
    description: "Introduction to coding and programming",
    amount: 45000,
    category: "Technology",
    isActive: true,
    applicableGrades: ["Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  },
  {
    id: "item-007",
    name: "Field Trip Allowance",
    description: "Educational excursions and field studies",
    amount: 25000,
    category: "Educational Activities",
    isActive: true,
    applicableGrades: ["Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  },
  {
    id: "item-008",
    name: "Uniform & Textbooks",
    description: "School uniform and required textbooks",
    amount: 15000,
    category: "School Supplies",
    isActive: true,
    applicableGrades: ["Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  }
]

interface InvoiceManagementProps {
  onNavigateToSubPage: (subPage: string) => void
  onNavigateToView?: (type: "invoice" | "student" | "item" | "receipt" | "payment" | "course" | "template", data: any) => void
}

export function InvoiceManagement({ onNavigateToSubPage, onNavigateToView }: InvoiceManagementProps) {
  const [invoices] = useState<Invoice[]>(mockInvoices)
  const [templates, setTemplates] = useState<InvoiceTemplate[]>(mockTemplates)
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(mockInvoices)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date | null>(null)
  const [dateTo, setDateTo] = useState<Date | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewModalData, setViewModalData] = useState<any>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  
  // Create invoice state
  const [selectedGrade, setSelectedGrade] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate | null>(null)
  
  // Student selection state
  const [studentSelectionType, setStudentSelectionType] = useState<"individual" | "csv" | "all">("individual")
  const [searchStudentTerm, setSearchStudentTerm] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<any[]>([])
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvStudents, setCsvStudents] = useState<any[]>([])
  
  // Item selection state
  const [availableItems, setAvailableItems] = useState<PreCreatedItem[]>([])
  const [selectedItems, setSelectedItems] = useState<PreCreatedItem[]>([])
  
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    description: "",
    amount: "",
    discountPercent: ""
  })

  const applyFilters = () => {
    let filtered = invoices

    if (searchTerm) {
      filtered = filtered.filter(inv => 
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.parentName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(inv => inv.status === statusFilter)
    }

    if (gradeFilter !== "all") {
      filtered = filtered.filter(inv => inv.studentGrade === gradeFilter)
    }

    if (dateFrom) {
      filtered = filtered.filter(inv => inv.issueDate >= dateFrom)
    }

    if (dateTo) {
      filtered = filtered.filter(inv => inv.issueDate <= dateTo)
    }

    setFilteredInvoices(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setGradeFilter("all")
    setDateFrom(null)
    setDateTo(null)
    setFilteredInvoices(invoices)
  }

  const openInvoiceDetail = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsModalOpen(true)
  }

  const openViewModal = (invoice: Invoice) => {
    const modalData = {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      studentName: invoice.studentName,
      studentId: invoice.studentId,
      grade: invoice.studentGrade,
      parentEmail: invoice.parentEmail,
      amount: invoice.finalAmount,
      total: invoice.finalAmount,
      status: invoice.status,
      issueDate: invoice.issueDate.toISOString(),
      dueDate: invoice.dueDate.toISOString(),
      category: "Invoice",
      academicYear: "2024-2025",
      items: invoice.items.map(item => ({
        name: item.description,
        description: item.description,
        amount: item.discountedAmount,
        quantity: 1
      })),
      student: {
        name: invoice.studentName,
        id: invoice.studentId,
        grade: invoice.studentGrade,
        parentEmail: invoice.parentEmail,
        parentName: invoice.parentName
      }
    }
    
    // Use new navigation instead of modal
    if (onNavigateToView) {
      onNavigateToView("invoice", modalData)
    } else {
      // Fallback to modal if navigation function not provided
      setViewModalData(modalData)
      setIsViewModalOpen(true)
    }
  }

  const handleEditInvoice = (data: any) => {
    setIsViewModalOpen(false)
    // Open edit modal or navigate to edit page
    toast.success("Edit functionality would be implemented here")
  }

  const handleDownloadInvoice = (data: any) => {
    toast.success(`Downloading invoice ${data.invoiceNumber}...`)
    // Implement download logic
  }

  const handlePrintInvoice = (data: any) => {
    toast.success(`Printing invoice ${data.invoiceNumber}...`)
    // Implement print logic
  }

  const closeInvoiceModal = () => {
    setIsModalOpen(false)
    setSelectedInvoice(null)
  }

  const openCreateModal = () => {
    setIsCreateModalOpen(true)
    resetCreateForm()
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
    resetCreateForm()
  }

  const resetCreateForm = () => {
    setSelectedGrade("")
    setSelectedTemplate(null)
    setStudentSelectionType("individual")
    setSearchStudentTerm("")
    setSelectedStudents([])
    setCsvFile(null)
    setCsvStudents([])
    setAvailableItems([])
    setSelectedItems([])
  }

  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade)
    setSelectedStudents([])
    setCsvStudents([])
    setCsvFile(null)
    setSelectedItems([])
    
    // Filter available items for this grade
    const gradeItems = mockPreCreatedItems.filter(item => 
      item.isActive && item.applicableGrades.includes(grade)
    )
    setAvailableItems(gradeItems)
  }

  const filteredStudents = mockStudents.filter(student => 
    (student.id.toLowerCase().includes(searchStudentTerm.toLowerCase()) ||
     student.name.toLowerCase().includes(searchStudentTerm.toLowerCase())) &&
    student.grade === selectedGrade &&
    !selectedStudents.find(s => s.id === student.id)
  )

  const handleIndividualStudentSelect = (student: any) => {
    setSelectedStudents([...selectedStudents, student])
    setSearchStudentTerm("")
  }

  const handleRemoveStudent = (studentId: string) => {
    setSelectedStudents(selectedStudents.filter(s => s.id !== studentId))
  }

  const handleSelectAllStudents = () => {
    const gradeStudents = mockStudents.filter(s => s.grade === selectedGrade)
    setSelectedStudents(gradeStudents)
  }

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCsvFile(file)
      // Simulate CSV parsing
      const mockCsvData = [
        { id: "ST001301", name: "CSV Student 1", grade: selectedGrade, parentName: "Parent 1", email: "parent1@email.com" },
        { id: "ST001302", name: "CSV Student 2", grade: selectedGrade, parentName: "Parent 2", email: "parent2@email.com" },
        { id: "ST001303", name: "CSV Student 3", grade: selectedGrade, parentName: "Parent 3", email: "parent3@email.com" },
      ]
      setCsvStudents(mockCsvData)
      setSelectedStudents(mockCsvData)
      toast.success(`Loaded ${mockCsvData.length} students from CSV`)
    }
  }

  const handleItemSelect = (item: PreCreatedItem) => {
    if (!selectedItems.find(i => i.id === item.id)) {
      setSelectedItems([...selectedItems, item])
    }
  }

  const handleItemRemove = (itemId: string) => {
    setSelectedItems(selectedItems.filter(i => i.id !== itemId))
  }

  const openAddItemModal = () => {
    setNewItem({ description: "", amount: "", discountPercent: "" })
    setIsAddItemModalOpen(true)
  }

  const closeAddItemModal = () => {
    setIsAddItemModalOpen(false)
  }

  const handleAddItem = () => {
    if (!newItem.description || !newItem.amount) {
      toast.error("Please fill in required fields")
      return
    }

    const amount = parseFloat(newItem.amount)
    const discountPercent = parseFloat(newItem.discountPercent || "0")
    const discountedAmount = amount * (1 - discountPercent / 100)

    const item: InvoiceItem = {
      id: (invoiceItems.length + 1).toString(),
      description: newItem.description,
      amount,
      discountPercent,
      discountedAmount
    }

    setInvoiceItems([...invoiceItems, item])
    closeAddItemModal()
    toast.success("Item added successfully")
  }

  const removeItem = (itemId: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== itemId))
    toast.success("Item removed")
  }

  const updateItemDiscount = (itemId: string, discountPercent: number) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id === itemId) {
        const discountedAmount = item.amount * (1 - discountPercent / 100)
        return { ...item, discountPercent, discountedAmount }
      }
      return item
    }))
  }

  const calculateTotals = () => {
    const totalAmount = invoiceItems.reduce((sum, item) => sum + item.amount, 0)
    const finalAmount = invoiceItems.reduce((sum, item) => sum + item.discountedAmount, 0)
    const discountAmount = totalAmount - finalAmount
    return { totalAmount, finalAmount, discountAmount }
  }

  const handleCreateInvoice = () => {
    if (selectedStudents.length === 0 || selectedItems.length === 0) {
      toast.error("Please select students and items")
      return
    }

    const totalItems = selectedItems.reduce((sum, item) => sum + item.amount, 0)
    
    toast.success(`Created ${selectedStudents.length} invoices with ${selectedItems.length} items each - Total per invoice: ฿${totalItems.toLocaleString()}`)
    closeCreateModal()
  }

  const sendInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (invoice) {
      toast.success(`Invoice ${invoice.invoiceNumber} sent to ${invoice.parentEmail}`)
    }
  }

  const downloadInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (invoice) {
      toast.success(`Invoice ${invoice.invoiceNumber} downloaded`)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary"><FileText className="w-3 h-3 mr-1" />Draft</Badge>
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800"><Mail className="w-3 h-3 mr-1" />Sent</Badge>
      case "paid":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Overdue</Badge>
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800"><X className="w-3 h-3 mr-1" />Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const summaryStats = {
    total: invoices.length,
    draft: invoices.filter(inv => inv.status === "draft").length,
    sent: invoices.filter(inv => inv.status === "sent").length,
    paid: invoices.filter(inv => inv.status === "paid").length,
    overdue: invoices.filter(inv => inv.status === "overdue").length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.finalAmount, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Invoice Management</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage student invoices with templates and discounts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{summaryStats.draft}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{summaryStats.sent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summaryStats.paid}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summaryStats.overdue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{summaryStats.totalAmount.toLocaleString()}</div>
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
                  placeholder="Invoice, student, parent"
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Grade</label>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {grades.map(grade => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <CalendarIcon className="mr-2 h-4 w-4" />
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
                      <CalendarIcon className="mr-2 h-4 w-4" />
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

            <div className="flex items-end gap-2">
              <Button onClick={applyFilters}>Apply</Button>
              <Button variant="outline" onClick={clearFilters}>Clear</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredInvoices.length} of {invoices.length} invoices
        </p>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono text-sm">
                    {invoice.invoiceNumber}
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
                  <TableCell>
                    <div className="font-medium">
                      ฿{invoice.finalAmount.toLocaleString()}
                    </div>
                    {invoice.discountAmount > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Discount: ฿{invoice.discountAmount.toLocaleString()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>{format(invoice.issueDate, "MMM dd, yyyy")}</TableCell>
                  <TableCell>{format(invoice.dueDate, "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => openViewModal(invoice)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => downloadInvoice(invoice.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => sendInvoice(invoice.id)}
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

      {/* Invoice Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Invoice Details
            </DialogTitle>
            <DialogDescription>
              View invoice information and manage payment status
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-6">
              {/* Invoice Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Invoice Number</p>
                  <p className="font-mono text-lg font-medium">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(selectedInvoice.status)}
                </div>
              </div>

              <Separator />

              {/* Student & Parent Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-medium">Student Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Student Name</p>
                      <p className="font-medium">{selectedInvoice.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Student ID</p>
                      <p className="font-mono">{selectedInvoice.studentId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Grade</p>
                      <Badge variant="secondary">{selectedInvoice.studentGrade}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Parent Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Parent/Guardian</p>
                      <p className="font-medium">{selectedInvoice.parentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedInvoice.parentEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Invoice Items */}
              <div className="space-y-3">
                <h3 className="font-medium">Invoice Items</h3>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Final Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>฿{item.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            {item.discountPercent > 0 ? `${item.discountPercent}%` : "-"}
                          </TableCell>
                          <TableCell className="font-medium">
                            ฿{item.discountedAmount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Totals */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>฿{selectedInvoice.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span className="text-red-600">-฿{selectedInvoice.discountAmount.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total:</span>
                    <span>฿{selectedInvoice.finalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Issue Date</p>
                  <p className="font-medium">{format(selectedInvoice.issueDate, "MMM dd, yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">{format(selectedInvoice.dueDate, "MMM dd, yyyy")}</p>
                </div>
                {selectedInvoice.paidDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Paid Date</p>
                    <p className="font-medium">{format(selectedInvoice.paidDate, "MMM dd, yyyy")}</p>
                  </div>
                )}
              </div>

              {selectedInvoice.notes && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="font-medium">Notes</h3>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm">{selectedInvoice.notes}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    downloadInvoice(selectedInvoice.id)
                    closeInvoiceModal()
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    sendInvoice(selectedInvoice.id)
                    closeInvoiceModal()
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invoice
                </Button>
                
                <Button variant="ghost" onClick={closeInvoiceModal}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Invoice Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Invoice
            </DialogTitle>
            <DialogDescription>
              Create an invoice using templates or custom items for students
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Step 1: Select Grade */}
            <div className="space-y-3">
              <h3 className="font-medium">1. Select Grade</h3>
              <Select value={selectedGrade} onValueChange={handleGradeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose grade level" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map(grade => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Step 2: Select Items */}
            {selectedGrade && (
              <div className="space-y-4">
                <h3 className="font-medium">2. Select Items</h3>
                
                {/* Available Items */}
                <div className="space-y-3">
                  <label className="font-medium">Available Items for {selectedGrade}</label>
                  <div className="grid grid-cols-1 gap-3">
                    {availableItems.map((item) => {
                      const isSelected = selectedItems.find(i => i.id === item.id)
                      return (
                        <Card 
                          key={item.id} 
                          className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"}`}
                          onClick={() => isSelected ? handleItemRemove(item.id) : handleItemSelect(item)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <Badge variant="outline" className="text-xs">{item.category}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                                <div className="flex items-center gap-4">
                                  <p className="font-medium text-lg">฿{item.amount.toLocaleString()}</p>
                                  <Badge variant="secondary" className="text-xs">
                                    {item.applicableGrades.length} grades
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {isSelected ? (
                                  <CheckCircle className="w-5 h-5 text-primary" />
                                ) : (
                                  <Plus className="w-5 h-5 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                {/* Selected Items Summary */}
                {selectedItems.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="font-medium">Selected Items ({selectedItems.length})</label>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedItems([])}
                      >
                        Clear All
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{item.category}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                ฿{item.amount.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleItemRemove(item.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Items Summary */}
                      <div className="p-4 bg-muted/50 border-t">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Total Items:</span>
                            <span>{selectedItems.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Students:</span>
                            <span>{selectedStudents.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Amount per Student:</span>
                            <span>฿{selectedItems.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-medium text-lg">
                            <span>Total Amount:</span>
                            <span>฿{(selectedItems.reduce((sum, item) => sum + item.amount, 0) * selectedStudents.length).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {availableItems.length === 0 && (
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                    <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No items available for this grade</p>
                    <p className="text-sm text-muted-foreground">Please select a different grade or contact admin to add items</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Select Students */}
            {selectedItems.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">3. Select Students</h3>
                
                {/* Selection Type */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className={`cursor-pointer transition-all ${studentSelectionType === "individual" ? "ring-2 ring-primary" : ""}`}>
                    <CardContent className="p-4" onClick={() => setStudentSelectionType("individual")}>
                      <div className="flex items-center justify-center mb-2">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-center text-sm">Individual</h4>
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        Select specific students
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`cursor-pointer transition-all ${studentSelectionType === "csv" ? "ring-2 ring-primary" : ""}`}>
                    <CardContent className="p-4" onClick={() => setStudentSelectionType("csv")}>
                      <div className="flex items-center justify-center mb-2">
                        <FileSpreadsheet className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-medium text-center text-sm">CSV Upload</h4>
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        Upload student list
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`cursor-pointer transition-all ${studentSelectionType === "all" ? "ring-2 ring-primary" : ""}`}>
                    <CardContent className="p-4" onClick={() => setStudentSelectionType("all")}>
                      <div className="flex items-center justify-center mb-2">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-medium text-center text-sm">All Students</h4>
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        Select entire grade
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Individual Selection */}
                {studentSelectionType === "individual" && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search by Student ID or name"
                        value={searchStudentTerm}
                        onChange={(e) => setSearchStudentTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    {searchStudentTerm && (
                      <div className="border rounded-lg max-h-48 overflow-y-auto">
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map((student) => (
                            <div
                              key={student.id}
                              className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                              onClick={() => handleIndividualStudentSelect(student)}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{student.name}</p>
                                  <p className="text-sm text-muted-foreground">{student.id}</p>
                                </div>
                                <Badge variant="secondary">{student.grade}</Badge>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-center text-muted-foreground">
                            No students found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* CSV Upload */}
                {studentSelectionType === "csv" && (
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Upload CSV file with student information</p>
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={handleCsvUpload}
                        className="max-w-xs mx-auto"
                      />
                    </div>
                    {csvFile && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-700">
                          <span className="font-medium">File uploaded:</span> {csvFile.name}
                        </p>
                        <p className="text-sm text-green-600">Loaded {csvStudents.length} students</p>
                      </div>
                    )}
                  </div>
                )}

                {/* All Students */}
                {studentSelectionType === "all" && (
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-blue-700 mb-2">
                        Select all students in {selectedGrade}
                      </p>
                      <p className="text-sm text-blue-600 mb-3">
                        {mockStudents.filter(s => s.grade === selectedGrade).length} students will be selected
                      </p>
                      <Button onClick={handleSelectAllStudents} size="sm">
                        Select All Students
                      </Button>
                    </div>
                  </div>
                )}

                {/* Selected Students Display */}
                {selectedStudents.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="font-medium">Selected Students ({selectedStudents.length})</label>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedStudents([])}
                      >
                        Clear All
                      </Button>
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {selectedStudents.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-2 bg-muted rounded-lg text-sm">
                          <div>
                            <span className="font-medium">{student.name}</span>
                            <span className="text-muted-foreground ml-2">({student.id})</span>
                          </div>
                          {studentSelectionType === "individual" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveStudent(student.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Create Invoice */}
            {selectedStudents.length > 0 && selectedItems.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">4. Create Invoice</h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Invoice Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700">Grade: <span className="font-medium">{selectedGrade}</span></p>
                      <p className="text-blue-700">Students: <span className="font-medium">{selectedStudents.length}</span></p>
                      <p className="text-blue-700">Items per Invoice: <span className="font-medium">{selectedItems.length}</span></p>
                    </div>
                    <div>
                      <p className="text-blue-700">Amount per Student: <span className="font-medium">฿{selectedItems.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</span></p>
                      <p className="text-blue-700">Total Amount: <span className="font-medium">฿{(selectedItems.reduce((sum, item) => sum + item.amount, 0) * selectedStudents.length).toLocaleString()}</span></p>
                      <p className="text-blue-700">Invoices to Create: <span className="font-medium">{selectedStudents.length}</span></p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleCreateInvoice}
                    className="flex-1"
                  >
                    Create {selectedStudents.length} Invoice{selectedStudents.length > 1 ? 's' : ''}
                  </Button>
                  <Button variant="outline" onClick={closeCreateModal}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons when not all steps completed */}
            {(selectedStudents.length === 0 || selectedItems.length === 0) && (
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleCreateInvoice}
                  disabled={selectedStudents.length === 0 || selectedItems.length === 0}
                  className="flex-1"
                >
                  Create Invoice
                </Button>
                <Button variant="outline" onClick={closeCreateModal}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Item Modal */}
      <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Invoice Item</DialogTitle>
            <DialogDescription>
              Add a new item to the invoice with optional discount
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Input
                placeholder="Item description"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (฿) *</label>
              <Input
                type="number"
                placeholder="0"
                value={newItem.amount}
                onChange={(e) => setNewItem({...newItem, amount: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Discount Percentage</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={newItem.discountPercent}
                onChange={(e) => setNewItem({...newItem, discountPercent: e.target.value})}
              />
            </div>

            {newItem.amount && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex justify-between text-sm">
                  <span>Original Amount:</span>
                  <span>฿{parseFloat(newItem.amount || "0").toLocaleString()}</span>
                </div>
                {newItem.discountPercent && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Discount ({newItem.discountPercent}%):</span>
                      <span className="text-red-600">
                        -฿{(parseFloat(newItem.amount || "0") * parseFloat(newItem.discountPercent || "0") / 100).toLocaleString()}
                      </span>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between font-medium">
                      <span>Final Amount:</span>
                      <span>
                        ฿{(parseFloat(newItem.amount || "0") * (1 - parseFloat(newItem.discountPercent || "0") / 100)).toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleAddItem} className="flex-1">
              Add Item
            </Button>
            <Button variant="outline" onClick={closeAddItemModal}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <ViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        type="invoice"
        data={viewModalData}
        onEdit={handleEditInvoice}
        onDownload={handleDownloadInvoice}
        onPrint={handlePrintInvoice}
      />
    </div>
  )
}