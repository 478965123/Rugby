import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Progress } from "./ui/progress"
import { 
  Upload, 
  Download, 
  FileText, 
  X, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Calendar,
  Award,
  CreditCard,
  Clock,
  Target,
  TrendingUp,
  Coins,
  Eye,
  BarChart3,
  Filter,
  Search,
  RotateCcw,
  Home,
  Building2,
  GraduationCap
} from "lucide-react"
import { toast } from "sonner@2.0.3"

// Types
interface WaiverRecord {
  id: string
  familyCode: string
  academicYear: string
  term: number
  studentType: 'older' | 'younger'
  studentName: string
  studentGrade: string
  waiverAmount: number
  status: 'active' | 'completed' | 'pending'
  startDate: string
  endDate: string
}

interface WaiverSummary {
  academicYear: string
  termSummaries: {
    term: number
    totalStudents: number
    totalFamilies: number
    totalAmount: number
    olderSiblings: number
    youngerSiblings: number
  }[]
  yearlyTotal: {
    totalStudents: number
    totalFamilies: number
    totalAmount: number
  }
}

// Mock data generator
const generateMockWaiverData = (): WaiverRecord[] => {
  const records: WaiverRecord[] = []
  const academicYears = ['2024-2025', '2025-2026', '2026-2027', '2027-2028', '2028-2029']
  const familyCodes = [
    'FAM001', 'FAM002', 'FAM003', 'FAM004', 'FAM005', 'FAM006', 'FAM007', 'FAM008', 'FAM009', 'FAM010',
    'FAM011', 'FAM012', 'FAM013', 'FAM014', 'FAM015', 'FAM016', 'FAM017', 'FAM018', 'FAM019', 'FAM020',
    'FAM021', 'FAM022', 'FAM023', 'FAM024', 'FAM025'
  ]
  
  const studentNames = {
    older: ['Alex Johnson', 'Emma Smith', 'James Brown', 'Sophie Davis', 'Michael Wilson', 'Olivia Garcia', 'Daniel Martinez', 'Isabella Rodriguez', 'William Anderson', 'Charlotte Taylor', 'Benjamin Thomas', 'Amelia Jackson', 'Lucas White', 'Mia Harris', 'Henry Martin'],
    younger: ['Ethan Johnson', 'Ava Smith', 'Liam Brown', 'Grace Davis', 'Noah Wilson', 'Chloe Garcia', 'Mason Martinez', 'Lily Rodriguez', 'Oliver Anderson', 'Zoe Taylor', 'Jacob Thomas', 'Hannah Jackson', 'Alexander White', 'Emily Harris', 'Samuel Martin']
  }

  academicYears.forEach((year, yearIndex) => {
    familyCodes.forEach((familyCode, familyIndex) => {
      const familyNumber = familyIndex + 1
      const olderSiblingName = studentNames.older[familyIndex % studentNames.older.length]
      const youngerSiblingName = studentNames.younger[familyIndex % studentNames.younger.length]
      
      // Determine which sibling gets discount based on timeline logic
      // Year 1-3: Younger sibling gets discount
      // Year 4-6: Older sibling gets discount
      
      if (yearIndex < 3) {
        // Years 0-2 (2024-2025 to 2026-2027): Younger sibling period
        for (let term = 1; term <= 3; term++) {
          records.push({
            id: `${familyCode}-${year}-T${term}-Y`,
            familyCode,
            academicYear: year,
            term,
            studentType: 'younger',
            studentName: youngerSiblingName,
            studentGrade: `Grade ${3 + familyIndex % 3}`,
            waiverAmount: 25000, // ฿75,000 / 3 terms = ฿25,000 per term
            status: yearIndex < 2 ? 'completed' : yearIndex === 2 ? 'active' : 'pending',
            startDate: `${year.split('-')[0]}-0${((term-1) * 4) + 1}-01`,
            endDate: `${year.split('-')[0]}-${String(term * 4).padStart(2, '0')}-30`
          })
        }
      } else if (yearIndex >= 3 && yearIndex < 6) {
        // Years 3-5 (2027-2028 to 2029-2030): Older sibling period
        for (let term = 1; term <= 3; term++) {
          records.push({
            id: `${familyCode}-${year}-T${term}-O`,
            familyCode,
            academicYear: year,
            term,
            studentType: 'older',
            studentName: olderSiblingName,
            studentGrade: `Grade ${6 + familyIndex % 6}`,
            waiverAmount: 25000,
            status: yearIndex < 5 ? 'pending' : 'pending',
            startDate: `${year.split('-')[0]}-0${((term-1) * 4) + 1}-01`,
            endDate: `${year.split('-')[0]}-${String(term * 4).padStart(2, '0')}-30`
          })
        }
      }
    })
  })

  return records
}

interface WaiveFeeManagementProps {
  onNavigateToSubPage?: (subPage: string, params?: any) => void
}

export function WaiveFeeManagement({ onNavigateToSubPage }: WaiveFeeManagementProps = {}) {
  const [waiverRecords] = useState<WaiverRecord[]>(generateMockWaiverData())
  const [selectedYear, setSelectedYear] = useState<string>('2024-2025')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Calculate summary data
  const calculateWaiverSummary = (year: string): WaiverSummary => {
    const yearRecords = waiverRecords.filter(record => record.academicYear === year)
    
    const termSummaries = [1, 2, 3].map(termNumber => {
      const termRecords = yearRecords.filter(record => record.term === termNumber)
      const uniqueFamilies = new Set(termRecords.map(record => record.familyCode))
      
      return {
        term: termNumber,
        totalStudents: termRecords.length,
        totalFamilies: uniqueFamilies.size,
        totalAmount: termRecords.reduce((sum, record) => sum + record.waiverAmount, 0),
        olderSiblings: termRecords.filter(record => record.studentType === 'older').length,
        youngerSiblings: termRecords.filter(record => record.studentType === 'younger').length
      }
    })

    const yearlyTotal = {
      totalStudents: yearRecords.length,
      totalFamilies: new Set(yearRecords.map(record => record.familyCode)).size,
      totalAmount: yearRecords.reduce((sum, record) => sum + record.waiverAmount, 0)
    }

    return {
      academicYear: year,
      termSummaries,
      yearlyTotal
    }
  }

  // Get available years
  const availableYears = [...new Set(waiverRecords.map(record => record.academicYear))].sort()

  // Filter records for list view
  const filteredRecords = waiverRecords.filter(record => {
    const matchesYear = record.academicYear === selectedYear
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus
    const matchesSearch = searchQuery === '' || 
      record.familyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.studentName.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesYear && matchesStatus && matchesSearch
  })

  // Group filtered records by term
  const recordsByTerm = filteredRecords.reduce((acc, record) => {
    if (!acc[record.term]) {
      acc[record.term] = []
    }
    acc[record.term].push(record)
    return acc
  }, {} as Record<number, WaiverRecord[]>)

  const currentSummary = calculateWaiverSummary(selectedYear)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case 'completed':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const resetFilters = () => {
    setSelectedYear('2024-2025')
    setFilterStatus('all')
    setSearchQuery('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Waive Fee Management Dashboard</h2>
          <p className="text-muted-foreground">
            Track and manage sibling discount waivers across academic years
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Button className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2 min-w-[200px]">
              <Label>Academic Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 min-w-[150px]">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex-1 min-w-[200px]">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by family code or student name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentSummary.yearlyTotal.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              receiving waivers in {selectedYear}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Families</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentSummary.yearlyTotal.totalFamilies}</div>
            <p className="text-xs text-muted-foreground">
              families benefiting from waiver
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Waiver Amount</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentSummary.yearlyTotal.totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              total waivers for {selectedYear}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average per Family</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentSummary.yearlyTotal.totalFamilies > 0 
                ? formatCurrency(currentSummary.yearlyTotal.totalAmount / currentSummary.yearlyTotal.totalFamilies)
                : '฿0'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              average waiver per family
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Multi-Year Summary Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Multi-Year Waiver Summary Matrix
          </CardTitle>
          <CardDescription>
            Average waiver amount per student across all academic years and terms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Header Row */}
              <div className="grid grid-cols-[120px_repeat(5,160px)] gap-2 mb-4">
                <div className="font-medium text-sm text-muted-foreground flex items-center justify-center">
                  Academic Year
                </div>
                {availableYears.map(year => (
                  <div key={year} className="font-medium text-sm text-center p-2 bg-muted rounded-lg flex flex-col items-center gap-2">
                    <span>{year}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-6 px-2"
                      onClick={() => onNavigateToSubPage?.('waive-fee-year-details', { academicYear: year })}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View More
                    </Button>
                  </div>
                ))}
              </div>

              {/* Data Rows */}
              <div className="space-y-2">
                {[1, 2, 3].map(termNumber => (
                  <div key={termNumber} className="grid grid-cols-[120px_repeat(5,160px)] gap-2">
                    <div className="font-medium text-sm bg-muted rounded-lg flex items-center justify-center p-2">
                      Term {termNumber}
                    </div>
                    {availableYears.map(year => {
                      const yearSummary = calculateWaiverSummary(year)
                      const termSummary = yearSummary.termSummaries.find(t => t.term === termNumber)
                      const averagePerStudent = termSummary && termSummary.totalStudents > 0 
                        ? termSummary.totalAmount / termSummary.totalStudents 
                        : 0
                      
                      return (
                        <div key={`${year}-${termNumber}`} className="border rounded-lg p-3 bg-card hover:bg-accent/50 transition-colors">
                          <div className="space-y-1">
                            <div className="text-lg font-bold text-center">
                              {averagePerStudent > 0 ? formatCurrency(averagePerStudent) : '-'}
                            </div>
                            <div className="text-xs text-muted-foreground text-center">
                              {termSummary?.totalStudents || 0} students
                            </div>
                            <div className="text-xs text-muted-foreground text-center">
                              {termSummary?.totalFamilies || 0} families
                            </div>
                            {termSummary && termSummary.totalStudents > 0 && (
                              <div className="text-xs text-center">
                                <span className="text-orange-600">
                                  {termSummary.olderSiblings}พี่
                                </span>
                                {" / "}
                                <span className="text-green-600">
                                  {termSummary.youngerSiblings}น้อง
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Summary Row */}
              <div className="grid grid-cols-[120px_repeat(5,160px)] gap-2 mt-4 pt-4 border-t">
                <div className="font-medium text-sm bg-primary/10 rounded-lg flex items-center justify-center p-2">
                  Year Total
                </div>
                {availableYears.map(year => {
                  const yearSummary = calculateWaiverSummary(year)
                  const yearAveragePerStudent = yearSummary.yearlyTotal.totalStudents > 0 
                    ? yearSummary.yearlyTotal.totalAmount / yearSummary.yearlyTotal.totalStudents 
                    : 0
                  
                  return (
                    <div key={`${year}-total`} className="border-2 border-primary/20 rounded-lg p-3 bg-primary/5">
                      <div className="space-y-1">
                        <div className="text-lg font-bold text-center text-primary">
                          {yearAveragePerStudent > 0 ? formatCurrency(yearAveragePerStudent) : '-'}
                        </div>
                        <div className="text-xs text-muted-foreground text-center">
                          {yearSummary.yearlyTotal.totalStudents} total students
                        </div>
                        <div className="text-xs text-muted-foreground text-center">
                          {formatCurrency(yearSummary.yearlyTotal.totalAmount)} total
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Values show average waiver amount per student. 
              Years 1-3: Younger siblings receive discounts. Years 4-6: Older siblings receive discounts.
              Each cell shows: Average Amount / Number of Students / Number of Families / Sibling Distribution
            </p>
          </div>
        </CardContent>
      </Card>




    </div>
  )
}