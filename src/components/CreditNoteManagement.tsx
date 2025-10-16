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
import { Search, Filter, Eye, Plus, Download, Mail, CalendarIcon, Coins, FileText, AlertCircle, CheckCircle, Clock, RefreshCw, CreditCard } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner@2.0.3"

interface CreditNote {
  id: string
  creditNoteNumber: string
  invoiceNumber: string
  studentName: string
  studentId: string
  studentGrade: string
  parentName: string
  originalAmount: number
  creditAmount: number
  reason: string
  type: "refund" | "adjustment" | "cancellation" | "discount"
  status: "draft" | "issued" | "applied" | "cancelled"
  issueDate: Date
  dueDate?: Date
  appliedDate?: Date
  issuedBy: string
  approvedBy?: string
  notes: string
}

const mockCreditNotes: CreditNote[] = [
  {
    id: "1",
    creditNoteNumber: "CN-2025-001234",
    invoiceNumber: "INV-2025-001234",
    studentName: "John Smith",
    studentId: "ST001234",
    studentGrade: "Year 10",
    parentName: "Robert Smith",
    originalAmount: 125000,
    creditAmount: 25000,
    reason: "Partial refund due to early withdrawal from swimming program",
    type: "refund",
    status: "issued",
    issueDate: new Date("2025-08-20"),
    dueDate: new Date("2025-09-20"),
    issuedBy: "Finance Team",
    notes: "Student withdrew after 2 weeks of the term"
  },
  {
    id: "2",
    creditNoteNumber: "CN-2025-001235",
    invoiceNumber: "INV-2025-001235",
    studentName: "Sarah Wilson",
    studentId: "ST001235",
    studentGrade: "Year 7",
    parentName: "Michael Wilson",
    originalAmount: 42000,
    creditAmount: 5000,
    reason: "Discount for multiple siblings enrollment",
    type: "discount",
    status: "applied",
    issueDate: new Date("2025-08-15"),
    appliedDate: new Date("2025-08-16"),
    issuedBy: "Admin Office",
    approvedBy: "Principal",
    notes: "Family discount applied as per school policy"
  },
  {
    id: "3",
    creditNoteNumber: "CN-2025-001236",
    invoiceNumber: "INV-2025-001236",
    studentName: "Mike Johnson",
    studentId: "ST001236",
    studentGrade: "Year 12",
    parentName: "Lisa Johnson",
    originalAmount: 125000,
    creditAmount: 42000,
    reason: "Course cancellation - Advanced Physics",
    type: "cancellation",
    status: "draft",
    issueDate: new Date("2025-08-18"),
    issuedBy: "Academic Office",
    notes: "Course cancelled due to insufficient enrollment"
  },
  {
    id: "4",
    creditNoteNumber: "CN-2025-001237",
    invoiceNumber: "INV-2025-001237",
    studentName: "Emma Davis",
    studentId: "ST001237",
    studentGrade: "Year 3",
    parentName: "David Davis",
    originalAmount: 85000,
    creditAmount: 10000,
    reason: "Billing adjustment for incorrect charges",
    type: "adjustment",
    status: "issued",
    issueDate: new Date("2025-08-12"),
    dueDate: new Date("2025-09-12"),
    issuedBy: "Finance Team",
    notes: "Correction for overcharged lunch program fees"
  }
]

export function CreditNoteManagement() {
  const [creditNotes] = useState<CreditNote[]>(mockCreditNotes)
  const [filteredCreditNotes, setFilteredCreditNotes] = useState<CreditNote[]>(mockCreditNotes)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date | null>(null)
  const [dateTo, setDateTo] = useState<Date | null>(null)
  const [selectedCreditNote, setSelectedCreditNote] = useState<CreditNote | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Create new credit note form state
  const [newCreditNote, setNewCreditNote] = useState({
    invoiceNumber: "",
    studentName: "",
    creditAmount: "",
    reason: "",
    type: "refund" as CreditNote["type"],
    notes: ""
  })

  const applyFilters = () => {
    let filtered = creditNotes

    if (searchTerm) {
      filtered = filtered.filter(cn => 
        cn.creditNoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cn.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cn.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cn.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cn.parentName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(cn => cn.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(cn => cn.type === typeFilter)
    }

    if (dateFrom) {
      filtered = filtered.filter(cn => cn.issueDate >= dateFrom)
    }

    if (dateTo) {
      filtered = filtered.filter(cn => cn.issueDate <= dateTo)
    }

    setFilteredCreditNotes(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setTypeFilter("all")
    setDateFrom(null)
    setDateTo(null)
    setFilteredCreditNotes(creditNotes)
  }

  const openCreditNoteDetail = (creditNote: CreditNote) => {
    setSelectedCreditNote(creditNote)
    setIsModalOpen(true)
  }

  const closeCreditNoteModal = () => {
    setIsModalOpen(false)
    setSelectedCreditNote(null)
  }

  const openCreateModal = () => {
    setIsCreateModalOpen(true)
    setNewCreditNote({
      invoiceNumber: "",
      studentName: "",
      creditAmount: "",
      reason: "",
      type: "refund",
      notes: ""
    })
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
  }

  const handleCreateCreditNote = () => {
    if (!newCreditNote.invoiceNumber || !newCreditNote.creditAmount || !newCreditNote.reason) {
      toast.error("Please fill in all required fields")
      return
    }

    toast.success("Credit note created successfully")
    closeCreateModal()
  }

  const downloadCreditNote = (creditNoteId: string) => {
    const creditNote = creditNotes.find(cn => cn.id === creditNoteId)
    if (creditNote) {
      toast.success(`Credit note ${creditNote.creditNoteNumber} downloaded`)
    }
  }

  const sendCreditNote = (creditNoteId: string) => {
    const creditNote = creditNotes.find(cn => cn.id === creditNoteId)
    if (creditNote) {
      toast.success(`Credit note sent to ${creditNote.parentName}`)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary"><FileText className="w-3 h-3 mr-1" />Draft</Badge>
      case "issued":
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Issued</Badge>
      case "applied":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Applied</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "refund":
        return <Badge className="bg-purple-100 text-purple-800">Refund</Badge>
      case "adjustment":
        return <Badge className="bg-orange-100 text-orange-800">Adjustment</Badge>
      case "cancellation":
        return <Badge className="bg-red-100 text-red-800">Cancellation</Badge>
      case "discount":
        return <Badge className="bg-green-100 text-green-800">Discount</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const summaryStats = {
    total: creditNotes.length,
    draft: creditNotes.filter(cn => cn.status === "draft").length,
    issued: creditNotes.filter(cn => cn.status === "issued").length,
    applied: creditNotes.filter(cn => cn.status === "applied").length,
    totalAmount: creditNotes.reduce((sum, cn) => sum + cn.creditAmount, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Credit Note Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage credit notes, refunds, and billing adjustments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button onClick={openCreateModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Credit Note
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Credit Notes</CardTitle>
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
            <CardTitle className="text-sm font-medium">Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{summaryStats.issued}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Applied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summaryStats.applied}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Credit Amount</CardTitle>
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
                  placeholder="Credit note, invoice, student"
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
                  <SelectItem value="issued">Issued</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                  <SelectItem value="cancellation">Cancellation</SelectItem>
                  <SelectItem value="discount">Discount</SelectItem>
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
          Showing {filteredCreditNotes.length} of {creditNotes.length} credit notes
        </p>
      </div>

      {/* Credit Notes Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Credit Note Number</TableHead>
                <TableHead>Invoice Reference</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCreditNotes.map((creditNote) => (
                <TableRow key={creditNote.id}>
                  <TableCell className="font-mono text-sm">
                    {creditNote.creditNoteNumber}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {creditNote.invoiceNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{creditNote.studentName}</div>
                      <div className="text-sm text-muted-foreground">{creditNote.studentId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{creditNote.studentGrade}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-red-600">
                      -฿{creditNote.creditAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      of ฿{creditNote.originalAmount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(creditNote.type)}</TableCell>
                  <TableCell>{getStatusBadge(creditNote.status)}</TableCell>
                  <TableCell>{format(creditNote.issueDate, "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => openCreditNoteDetail(creditNote)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => downloadCreditNote(creditNote.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => sendCreditNote(creditNote.id)}
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

      {/* Credit Note Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Credit Note Details
            </DialogTitle>
            <DialogDescription>
              View and manage credit note information and processing details
            </DialogDescription>
          </DialogHeader>
          
          {selectedCreditNote && (
            <div className="space-y-6">
              {/* Credit Note Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Credit Note Number</p>
                  <p className="font-mono text-lg font-medium">{selectedCreditNote.creditNoteNumber}</p>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(selectedCreditNote.status)}
                  {getTypeBadge(selectedCreditNote.type)}
                </div>
              </div>

              <Separator />

              {/* Student & Invoice Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-medium">Student Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Student Name</p>
                      <p className="font-medium">{selectedCreditNote.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Student ID</p>
                      <p className="font-mono">{selectedCreditNote.studentId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Grade</p>
                      <Badge variant="secondary">{selectedCreditNote.studentGrade}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Parent/Guardian</p>
                      <p className="font-medium">{selectedCreditNote.parentName}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Credit Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Related Invoice</p>
                      <p className="font-mono">{selectedCreditNote.invoiceNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Original Amount</p>
                      <p className="font-medium">฿{selectedCreditNote.originalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Credit Amount</p>
                      <p className="text-xl font-bold text-red-600">-฿{selectedCreditNote.creditAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Credit Details */}
              <div className="space-y-3">
                <h3 className="font-medium">Credit Details</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Reason</p>
                    <p className="font-medium">{selectedCreditNote.reason}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <p className="font-medium">{format(selectedCreditNote.issueDate, "MMM dd, yyyy")}</p>
                  </div>
                  {selectedCreditNote.dueDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-medium">{format(selectedCreditNote.dueDate, "MMM dd, yyyy")}</p>
                    </div>
                  )}
                  {selectedCreditNote.appliedDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Applied Date</p>
                      <p className="font-medium">{format(selectedCreditNote.appliedDate, "MMM dd, yyyy")}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Processing Information */}
              <div className="space-y-3">
                <h3 className="font-medium">Processing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Issued By</p>
                    <p className="font-medium">{selectedCreditNote.issuedBy}</p>
                  </div>
                  {selectedCreditNote.approvedBy && (
                    <div>
                      <p className="text-sm text-muted-foreground">Approved By</p>
                      <p className="font-medium">{selectedCreditNote.approvedBy}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedCreditNote.notes && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="font-medium">Notes</h3>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm">{selectedCreditNote.notes}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    downloadCreditNote(selectedCreditNote.id)
                    closeCreditNoteModal()
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    sendCreditNote(selectedCreditNote.id)
                    closeCreditNoteModal()
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send to Parent
                </Button>
                
                <Button variant="ghost" onClick={closeCreditNoteModal}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Credit Note Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Credit Note
            </DialogTitle>
            <DialogDescription>
              Create a new credit note for refunds, adjustments, or cancellations
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Invoice Number *</label>
                <Input
                  placeholder="INV-2025-XXXXXX"
                  value={newCreditNote.invoiceNumber}
                  onChange={(e) => setNewCreditNote({...newCreditNote, invoiceNumber: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Student Name</label>
                <Input
                  placeholder="Enter student name"
                  value={newCreditNote.studentName}
                  onChange={(e) => setNewCreditNote({...newCreditNote, studentName: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Credit Amount *</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newCreditNote.creditAmount}
                  onChange={(e) => setNewCreditNote({...newCreditNote, creditAmount: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Credit Type *</label>
                <Select 
                  value={newCreditNote.type} 
                  onValueChange={(value: CreditNote["type"]) => setNewCreditNote({...newCreditNote, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="adjustment">Billing Adjustment</SelectItem>
                    <SelectItem value="cancellation">Course Cancellation</SelectItem>
                    <SelectItem value="discount">Discount Applied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reason *</label>
              <Input
                placeholder="Enter reason for credit note"
                value={newCreditNote.reason}
                onChange={(e) => setNewCreditNote({...newCreditNote, reason: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Notes</label>
              <Textarea
                placeholder="Enter any additional notes or comments"
                value={newCreditNote.notes}
                onChange={(e) => setNewCreditNote({...newCreditNote, notes: e.target.value})}
                className="min-h-20"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleCreateCreditNote} className="flex-1">
                Create Credit Note
              </Button>
              <Button variant="outline" onClick={closeCreateModal}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}