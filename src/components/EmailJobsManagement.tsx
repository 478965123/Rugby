import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"
import {
  Mail,
  Search,
  Filter,
  MoreHorizontal,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  AlertCircle,
  History,
  FileSpreadsheet,
  Plus
} from "lucide-react"
import { toast } from "sonner"

interface EmailJob {
  id: string
  batchId: string
  invoiceType: "tuition" | "eca" | "trip"
  yearGroup: string
  totalEmails: number
  sentCount: number
  failedCount: number
  pendingCount: number
  status: "completed" | "in-progress" | "failed" | "pending"
  createdAt: string
  completedAt?: string
  createdBy: string
  description: string
}

// Mock data
const mockEmailJobs: EmailJob[] = [
  {
    id: "EJ001",
    batchId: "BATCH-2024-001",
    invoiceType: "tuition",
    yearGroup: "Year 7",
    totalEmails: 45,
    sentCount: 43,
    failedCount: 2,
    pendingCount: 0,
    status: "completed",
    createdAt: "2024-01-15T08:30:00Z",
    completedAt: "2024-01-15T08:45:00Z",
    createdBy: "admin@sisb.ac.th",
    description: "Term 2 Tuition Invoice - Year 7"
  },
  {
    id: "EJ002", 
    batchId: "BATCH-2024-002",
    invoiceType: "eca",
    yearGroup: "Year 8-9",
    totalEmails: 38,
    sentCount: 35,
    failedCount: 0,
    pendingCount: 3,
    status: "in-progress",
    createdAt: "2024-01-15T10:15:00Z",
    createdBy: "admin@sisb.ac.th",
    description: "Football Club Registration - Year 8-9"
  },
  {
    id: "EJ003",
    batchId: "BATCH-2024-003", 
    invoiceType: "trip",
    yearGroup: "Year 10",
    totalEmails: 28,
    sentCount: 0,
    failedCount: 28,
    pendingCount: 0,
    status: "failed",
    createdAt: "2024-01-15T14:20:00Z",
    createdBy: "admin@sisb.ac.th",
    description: "Science Museum Trip - Year 10"
  },
  {
    id: "EJ004",
    batchId: "BATCH-2024-004",
    invoiceType: "tuition", 
    yearGroup: "Reception",
    totalEmails: 22,
    sentCount: 0,
    failedCount: 0,
    pendingCount: 22,
    status: "pending",
    createdAt: "2024-01-15T16:00:00Z",
    createdBy: "admin@sisb.ac.th",
    description: "Term 2 Tuition Invoice - Reception"
  }
]

interface EmailJobsManagementProps {
  onNavigateToSubPage?: (subPage: string, params?: any) => void
}

export function EmailJobsManagement({ onNavigateToSubPage }: EmailJobsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  // Create Email Job Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newEmailJob, setNewEmailJob] = useState({
    type: "",
    yearGroups: [] as string[],
    description: "",
    subject: ""
  })

  const yearGroupOptions = [
    "Reception",
    "Year 1",
    "Year 2",
    "Year 3",
    "Year 4",
    "Year 5",
    "Year 6",
    "Year 7",
    "Year 8",
    "Year 9",
    "Year 10",
    "Year 11",
    "Year 12"
  ]

  const handleCreateEmailJob = () => {
    setIsCreateModalOpen(true)
  }

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false)
    setNewEmailJob({
      type: "",
      yearGroups: [],
      description: "",
      subject: ""
    })
  }

  const handleYearGroupToggle = (yearGroup: string) => {
    setNewEmailJob(prev => ({
      ...prev,
      yearGroups: prev.yearGroups.includes(yearGroup)
        ? prev.yearGroups.filter(y => y !== yearGroup)
        : [...prev.yearGroups, yearGroup]
    }))
  }

  const handleSelectAllYearGroups = () => {
    setNewEmailJob(prev => ({
      ...prev,
      yearGroups: prev.yearGroups.length === yearGroupOptions.length ? [] : [...yearGroupOptions]
    }))
  }

  const handleSubmitEmailJob = () => {
    if (!newEmailJob.type || newEmailJob.yearGroups.length === 0 || !newEmailJob.description || !newEmailJob.subject) {
      toast.error("Please fill in all required fields")
      return
    }

    // TODO: Create email job API call
    toast.success(`Email job created successfully for ${newEmailJob.yearGroups.length} year group(s)`)
    handleCloseCreateModal()
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "in-progress": 
        return "secondary"
      case "failed":
        return "destructive"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "in-progress":
        return <Clock className="w-4 h-4" />
      case "failed":
        return <XCircle className="w-4 h-4" />
      case "pending":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredJobs = mockEmailJobs.filter(job => {
    const matchesSearch = job.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.yearGroup.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    const matchesType = typeFilter === "all" || job.invoiceType === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }



  const handleViewHistory = (job: EmailJob) => {
    if (onNavigateToSubPage) {
      onNavigateToSubPage("email-history-view", { jobId: job.id, job })
    }
  }

  const handleExportCsv = (job: EmailJob) => {
    if (onNavigateToSubPage) {
      onNavigateToSubPage("email-csv-export", { jobId: job.id, job })
    }
  }

  const getSuccessRate = (job: EmailJob) => {
    if (job.totalEmails === 0) return 0
    return Math.round((job.sentCount / job.totalEmails) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Email Jobs Management</h2>
          <p className="text-muted-foreground">
            Monitor and manage email delivery status for invoice batches
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleCreateEmailJob}>
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEmailJobs.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockEmailJobs.filter(j => j.status === "completed").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockEmailJobs.filter(j => j.status === "in-progress").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockEmailJobs.filter(j => j.status === "failed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by batch ID, description, or year group..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="tuition">Tuition</SelectItem>
                <SelectItem value="eca">ECA</SelectItem>
                <SelectItem value="trip">Trip & Activities</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Email Jobs Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Year Group</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-mono">{job.batchId}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {job.invoiceType}
                    </Badge>
                  </TableCell>
                  <TableCell>{job.yearGroup}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {job.description}
                  </TableCell>
                  <TableCell>{job.totalEmails}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{getSuccessRate(job)}%</span>
                      <div className="text-xs text-muted-foreground">
                        ({job.sentCount}/{job.totalEmails})
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(job.status)} className="flex items-center gap-1 w-fit">
                      {getStatusIcon(job.status)}
                      <span className="capitalize">{job.status.replace('-', ' ')}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(job.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewHistory(job)}>
                          <History className="mr-2 h-4 w-4" />
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportCsv(job)}>
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                          Export CSV Log
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredJobs.length === 0 && (
            <div className="text-center py-8">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3>No email jobs found</h3>
              <p className="text-muted-foreground">
                No email jobs match your current filters.
              </p>
            </div>
          )}
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

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Create Email Job Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Create Email Job
            </DialogTitle>
            <DialogDescription>
              Create a new email notification job to send invoices to parents
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Type *</label>
              <Select
                value={newEmailJob.type}
                onValueChange={(value) => setNewEmailJob({ ...newEmailJob, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select invoice type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tuition">Tuition</SelectItem>
                  <SelectItem value="eca">ECA</SelectItem>
                  <SelectItem value="trip">Trip & Activities</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Year Groups */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Year Groups *</label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAllYearGroups}
                  className="h-auto py-1 text-xs"
                >
                  {newEmailJob.yearGroups.length === yearGroupOptions.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  {yearGroupOptions.map((yearGroup) => (
                    <div key={yearGroup} className="flex items-center space-x-2">
                      <Checkbox
                        id={yearGroup}
                        checked={newEmailJob.yearGroups.includes(yearGroup)}
                        onCheckedChange={() => handleYearGroupToggle(yearGroup)}
                      />
                      <label
                        htmlFor={yearGroup}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {yearGroup}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {newEmailJob.yearGroups.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {newEmailJob.yearGroups.length} year group{newEmailJob.yearGroups.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject *</label>
              <Input
                placeholder="Enter email subject"
                value={newEmailJob.subject}
                onChange={(e) => setNewEmailJob({ ...newEmailJob, subject: e.target.value })}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                placeholder="Enter job description"
                value={newEmailJob.description}
                onChange={(e) => setNewEmailJob({ ...newEmailJob, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleCloseCreateModal}>
              Cancel
            </Button>
            <Button onClick={handleSubmitEmailJob}>
              Create Email Job
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}