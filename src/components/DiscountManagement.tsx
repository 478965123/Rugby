import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { Switch } from "./ui/switch"
import { Textarea } from "./ui/textarea"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Progress } from "./ui/progress"
import { 
  Percent, 
  Tag, 
  Gift, 
  TrendingDown, 
  Plus, 
  Edit, 
  Trash2, 
  CalendarDays, 
  Users, 
  Coins,
  Copy,
  Eye,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  TrendingUp,
  Upload,
  Download,
  FileText,
  X,
  UserPlus,
  GraduationCap,
  Search
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner@2.0.3"
import { WaiveFeeManagement } from "./WaiveFeeManagement"

interface Student {
  id: string
  name: string
  yearGroup: string
  parentName: string
}

interface DiscountCode {
  id: number
  code: string
  type: 'percentage' | 'fixed'
  value: number
  description: string
  startDate: Date
  endDate: Date
  usageLimit: number
  usedCount: number
  isActive: boolean
  targetTypes: string[]
  minAmount: number
  category: string
  createdBy: string
  period: 'general' | 'yearly' | 'termly'
  selectedStudents: Student[]
  applicableTerms?: string[]
}

interface PromotionalCampaign {
  id: number
  name: string
  description: string
  startDate: Date
  endDate: Date
  status: 'draft' | 'active' | 'paused' | 'expired'
  targetGroups: string[]
  discountType: 'percentage' | 'fixed'
  discountValue: number
  totalBudget: number
  usedBudget: number
  participantCount: number
  targetParticipants: number
  category: string
}

const mockStudents: Student[] = [
  { id: "S001", name: "Emma Johnson", yearGroup: "Year 7", parentName: "Sarah Johnson" },
  { id: "S002", name: "Liam Smith", yearGroup: "Year 8", parentName: "Michael Smith" },
  { id: "S003", name: "Olivia Brown", yearGroup: "Year 9", parentName: "Jennifer Brown" },
  { id: "S004", name: "Noah Davis", yearGroup: "Year 10", parentName: "David Davis" },
  { id: "S005", name: "Ava Wilson", yearGroup: "Year 11", parentName: "Lisa Wilson" },
]

const mockDiscountCodes: DiscountCode[] = [
  {
    id: 1,
    code: "EARLY2024",
    type: "percentage",
    value: 15,
    description: "Early bird discount for 2024 activities",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    usageLimit: 500,
    usedCount: 234,
    isActive: true,
    targetTypes: ["Tuition", "After School", "Events"],
    minAmount: 1000,
    category: "Early Bird",
    createdBy: "Admin",
    period: "general",
    selectedStudents: []
  },
  {
    id: 2,
    code: "SIBLING10",
    type: "percentage",
    value: 10,
    description: "Sibling discount for families with multiple children",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    usageLimit: 1000,
    usedCount: 456,
    isActive: true,
    targetTypes: ["Tuition", "After School"],
    minAmount: 0,
    category: "Family",
    createdBy: "Admin",
    period: "yearly",
    selectedStudents: [mockStudents[0], mockStudents[1]]
  },
  {
    id: 3,
    code: "TERMLY15",
    type: "percentage",
    value: 15,
    description: "Termly discount for selected students",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-04-30"),
    usageLimit: 200,
    usedCount: 89,
    isActive: true,
    targetTypes: ["Tuition"],
    minAmount: 0,
    category: "Academic",
    createdBy: "Admin",
    period: "termly",
    selectedStudents: [mockStudents[2], mockStudents[3]],
    applicableTerms: ["Term 1", "Term 2"]
  }
]

const mockCampaigns: PromotionalCampaign[] = [
  {
    id: 1,
    name: "Back to School 2024",
    description: "Special promotion for new academic year",
    startDate: new Date("2024-08-01"),
    endDate: new Date("2024-09-30"),
    status: "active",
    targetGroups: ["Reception", "Year 1", "Year 2"],
    discountType: "percentage",
    discountValue: 20,
    totalBudget: 100000,
    usedBudget: 45000,
    participantCount: 180,
    targetParticipants: 300,
    category: "Academic"
  },
  {
    id: 2,
    name: "Holiday Camp Special",
    description: "Special pricing for holiday activities",
    startDate: new Date("2024-12-01"),
    endDate: new Date("2024-12-31"),
    status: "draft",
    targetGroups: ["All Students"],
    discountType: "fixed",
    discountValue: 1000,
    totalBudget: 50000,
    usedBudget: 0,
    participantCount: 0,
    targetParticipants: 150,
    category: "Holiday"
  }
]

interface DiscountManagementProps {
  activeTab: string
  onNavigateToSubPage?: (subPage: string, params?: any) => void
}

export function DiscountManagement({ activeTab, onNavigateToSubPage }: DiscountManagementProps) {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(mockDiscountCodes)
  const [campaigns, setCampaigns] = useState<PromotionalCampaign[]>(mockCampaigns)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null)
  const [editingCampaign, setEditingCampaign] = useState<PromotionalCampaign | null>(null)

  // Form states for discount codes
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage" as const,
    value: 0,
    description: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    usageLimit: 100,
    targetTypes: [] as string[],
    minAmount: 0,
    category: "",
    period: "general" as const,
    selectedStudents: [] as Student[],
    applicableTerms: [] as string[]
  })

  // Student Groups Management
  const [studentGroups, setStudentGroups] = useState([
    { id: "GRP001", name: "Year 7 Excellence", students: [mockStudents[0], mockStudents[1]], discountPercentage: 15, departments: ["Tuition"] },
    { id: "GRP002", name: "After School Bundle", students: [mockStudents[2], mockStudents[3]], discountPercentage: 10, departments: ["After School", "Event Management"] }
  ])
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false)
  const [groupForm, setGroupForm] = useState({
    name: "",
    discountPercentage: 0,
    departments: [] as string[],
    selectedStudents: [] as Student[]
  })

  // Student selection states
  const [studentInput, setStudentInput] = useState("")
  const [availableStudents] = useState<Student[]>(mockStudents)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [fileParseErrors, setFileParseErrors] = useState<string[]>([])

  // Group view and edit states
  const [viewGroupDialog, setViewGroupDialog] = useState<{isOpen: boolean, group: any | null}>({isOpen: false, group: null})
  const [editGroupDialog, setEditGroupDialog] = useState<{isOpen: boolean, group: any | null}>({isOpen: false, group: null})
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{isOpen: boolean, group: any | null}>({isOpen: false, group: null})
  
  // CSV Upload and Individual Add states
  const [csvUploadDialog, setCsvUploadDialog] = useState<{isOpen: boolean, groupId: string | null}>({isOpen: false, groupId: null})
  const [addIndividualDialog, setAddIndividualDialog] = useState<{isOpen: boolean, groupId: string | null}>({isOpen: false, groupId: null})
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvPreviewData, setCsvPreviewData] = useState<Student[]>([])
  const [isPreviewingCsv, setIsPreviewingCsv] = useState(false)
  const [individualStudentForm, setIndividualStudentForm] = useState({
    id: "",
    name: "",
    yearGroup: "",
    parentName: ""
  })
  
  // Student search states
  const [studentSearchQuery, setStudentSearchQuery] = useState("")
  const [studentSearchResults, setStudentSearchResults] = useState<Student[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Form states for campaigns
  const [campaignForm, setCampaignForm] = useState({
    name: "",
    description: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    targetGroups: [] as string[],
    discountType: "percentage" as const,
    discountValue: 0,
    totalBudget: 0,
    targetParticipants: 0,
    category: ""
  })

  const getStatusBadge = (status: PromotionalCampaign['status']) => {
    const variants = {
      draft: { variant: "secondary" as const, label: "Draft" },
      active: { variant: "default" as const, label: "Active" },
      paused: { variant: "outline" as const, label: "Paused" },
      expired: { variant: "destructive" as const, label: "Expired" }
    }
    
    return (
      <Badge variant={variants[status].variant}>
        {variants[status].label}
      </Badge>
    )
  }

  const getUsageProgress = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100)
  }

  const getBudgetProgress = (used: number, total: number) => {
    return Math.min((used / total) * 100, 100)
  }

  // CSV Upload handlers
  const handleCsvUpload = (file: File) => {
    setCsvFile(file)
    setIsPreviewingCsv(true)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      
      // Check if required columns exist
      const requiredColumns = ['id', 'name', 'year_group', 'parent_name']
      const missingColumns = requiredColumns.filter(col => !headers.includes(col))
      
      if (missingColumns.length > 0) {
        toast.error(`Missing required columns: ${missingColumns.join(', ')}`)
        setIsPreviewingCsv(false)
        setCsvFile(null)
        return
      }
      
      // Parse CSV data
      const students: Student[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        if (values.length >= 4) {
          students.push({
            id: values[headers.indexOf('id')],
            name: values[headers.indexOf('name')],
            yearGroup: values[headers.indexOf('year_group')],
            parentName: values[headers.indexOf('parent_name')]
          })
        }
      }
      
      setCsvPreviewData(students)
      setIsPreviewingCsv(false)
    }
    
    reader.readAsText(file)
  }

  const handleConfirmCsvUpload = () => {
    if (csvUploadDialog.groupId && csvPreviewData.length > 0) {
      const groupIndex = studentGroups.findIndex(g => g.id === csvUploadDialog.groupId)
      if (groupIndex !== -1) {
        const updatedGroups = [...studentGroups]
        const existingStudentIds = updatedGroups[groupIndex].students.map(s => s.id)
        const newStudents = csvPreviewData.filter(s => !existingStudentIds.includes(s.id))
        
        updatedGroups[groupIndex].students = [...updatedGroups[groupIndex].students, ...newStudents]
        setStudentGroups(updatedGroups)
        
        toast.success(`Added ${newStudents.length} students to group`)
        setCsvUploadDialog({isOpen: false, groupId: null})
        setCsvFile(null)
        setCsvPreviewData([])
      }
    }
  }

  // Student search handlers
  const handleStudentSearch = (query: string) => {
    setStudentSearchQuery(query)
    
    if (query.trim().length < 2) {
      setStudentSearchResults([])
      setShowSearchResults(false)
      return
    }
    
    setIsSearching(true)
    
    // Simulate search delay
    setTimeout(() => {
      const lowercaseQuery = query.toLowerCase()
      const results = mockStudents.filter(student => 
        student.id.toLowerCase().includes(lowercaseQuery) ||
        student.name.toLowerCase().includes(lowercaseQuery)
      )
      
      setStudentSearchResults(results)
      setShowSearchResults(true)
      setIsSearching(false)
    }, 300)
  }

  const handleSelectSearchResult = (student: Student) => {
    setIndividualStudentForm({
      id: student.id,
      name: student.name,
      yearGroup: student.yearGroup,
      parentName: student.parentName
    })
    setStudentSearchQuery(student.name)
    setShowSearchResults(false)
    setStudentSearchResults([])
  }

  const clearStudentSearch = () => {
    setStudentSearchQuery("")
    setStudentSearchResults([])
    setShowSearchResults(false)
    setIndividualStudentForm({ id: "", name: "", yearGroup: "", parentName: "" })
  }

  // Individual Student handlers
  const handleAddIndividualStudent = () => {
    const { id, name, yearGroup, parentName } = individualStudentForm
    
    if (!id || !name || !yearGroup || !parentName) {
      toast.error("Please fill in all fields")
      return
    }
    
    if (addIndividualDialog.groupId) {
      const groupIndex = studentGroups.findIndex(g => g.id === addIndividualDialog.groupId)
      if (groupIndex !== -1) {
        const updatedGroups = [...studentGroups]
        const existingStudent = updatedGroups[groupIndex].students.find(s => s.id === id)
        
        if (existingStudent) {
          toast.error("Student with this ID already exists in the group")
          return
        }
        
        const newStudent: Student = { id, name, yearGroup, parentName }
        updatedGroups[groupIndex].students = [...updatedGroups[groupIndex].students, newStudent]
        setStudentGroups(updatedGroups)
        
        toast.success("Student added successfully")
        setAddIndividualDialog({isOpen: false, groupId: null})
        setIndividualStudentForm({ id: "", name: "", yearGroup: "", parentName: "" })
        clearStudentSearch()
      }
    }
  }

  const resetDiscountForm = () => {
    setFormData({
      code: "",
      type: "percentage",
      value: 0,
      description: "",
      startDate: undefined,
      endDate: undefined,
      usageLimit: 100,
      targetTypes: [],
      minAmount: 0,
      category: "",
      period: "general",
      selectedStudents: [],
      applicableTerms: []
    })
    setEditingDiscount(null)
  }

  const resetGroupForm = () => {
    setGroupForm({
      name: "",
      discountPercentage: 0,
      departments: [],
      selectedStudents: []
    })
    setStudentInput("")
    setUploadedFile(null)
    setFileParseErrors([])
    setIsProcessingFile(false)
  }

  const addStudentToGroup = () => {
    const studentId = studentInput.trim().toUpperCase()
    if (!studentId) {
      toast.error("Please enter a student ID")
      return
    }

    // Validate student ID format (assuming format like S001, S002, etc.)
    if (!/^S\d{3,}$/i.test(studentId)) {
      toast.error("Invalid student ID format. Expected format: S001, S002, etc.")
      return
    }

    const student = availableStudents.find(s => s.id.toUpperCase() === studentId)
    if (student && !groupForm.selectedStudents.find(s => s.id === studentId)) {
      setGroupForm(prev => ({
        ...prev,
        selectedStudents: [...prev.selectedStudents, student]
      }))
      setStudentInput("")
      toast.success(`Added ${student.name} (${student.id}) to group`)
    } else if (!student) {
      toast.error(`Student ID "${studentId}" not found in database`)
    } else {
      toast.error("Student already added to this group")
    }
  }

  const processCSVFile = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim())
    const errors: string[] = []
    const validStudents: Student[] = []

    // Skip header if present
    const dataLines = lines[0].includes('Student ID') || lines[0].includes('ID') ? lines.slice(1) : lines

    dataLines.forEach((line, index) => {
      const columns = line.split(',').map(col => col.trim().replace(/"/g, ''))
      
      if (columns.length < 1) {
        errors.push(`Line ${index + 1}: Empty line`)
        return
      }

      const studentId = columns[0].toUpperCase()
      
      // Validate student ID format
      if (!/^S\d{3,}$/i.test(studentId)) {
        errors.push(`Line ${index + 1}: Invalid student ID format "${studentId}"`)
        return
      }

      // Check if student exists in database
      const existingStudent = availableStudents.find(s => s.id.toUpperCase() === studentId)
      if (!existingStudent) {
        errors.push(`Line ${index + 1}: Student ID "${studentId}" not found in database`)
        return
      }

      // Check for duplicates in current selection
      if (validStudents.find(s => s.id === studentId) || 
          groupForm.selectedStudents.find(s => s.id === studentId)) {
        errors.push(`Line ${index + 1}: Student ID "${studentId}" already selected`)
        return
      }

      validStudents.push(existingStudent)
    })

    return { validStudents, errors }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large. Maximum size is 5MB.")
      return
    }

    setUploadedFile(file)
    setIsProcessingFile(true)
    setFileParseErrors([])

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const { validStudents, errors } = processCSVFile(text)

        if (validStudents.length > 0) {
          setGroupForm(prev => ({
            ...prev,
            selectedStudents: [...prev.selectedStudents, ...validStudents]
          }))
          toast.success(`Successfully imported ${validStudents.length} students`)
        }

        if (errors.length > 0) {
          setFileParseErrors(errors)
          if (validStudents.length === 0) {
            toast.error(`Failed to import students. Check file format.`)
          } else {
            toast.warning(`Imported ${validStudents.length} students with ${errors.length} errors`)
          }
        }
      } catch (error) {
        toast.error("Failed to process file. Please check the file format.")
        setFileParseErrors(["Failed to parse file. Please ensure it's a valid CSV file."])
      } finally {
        setIsProcessingFile(false)
      }
    }

    reader.onerror = () => {
      toast.error("Failed to read file")
      setIsProcessingFile(false)
    }

    reader.readAsText(file)
  }

  const downloadStudentTemplate = () => {
    const csvContent = "Student ID\n" +
      "S001\n" +
      "S002\n" +
      "S003\n" +
      "S004\n" +
      "S005"
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'student_ids_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Student ID template downloaded")
  }

  const removeStudentFromGroup = (studentId: string) => {
    setGroupForm(prev => ({
      ...prev,
      selectedStudents: prev.selectedStudents.filter(s => s.id !== studentId)
    }))
  }

  const handleSaveGroup = () => {
    if (!groupForm.name || groupForm.discountPercentage === 0 || groupForm.departments.length === 0) {
      toast.error("Please fill in all required fields")
      return
    }

    if (editGroupDialog.group) {
      // Update existing group
      const updatedGroup = {
        ...editGroupDialog.group,
        name: groupForm.name,
        students: groupForm.selectedStudents,
        discountPercentage: groupForm.discountPercentage,
        departments: groupForm.departments
      }

      setStudentGroups(prev => prev.map(g => g.id === editGroupDialog.group.id ? updatedGroup : g))
      toast.success("Student group updated successfully")
      setEditGroupDialog({isOpen: false, group: null})
    } else {
      // Create new group
      const newGroup = {
        id: `GRP${String(studentGroups.length + 1).padStart(3, '0')}`,
        name: groupForm.name,
        students: groupForm.selectedStudents,
        discountPercentage: groupForm.discountPercentage,
        departments: groupForm.departments
      }

      setStudentGroups(prev => [...prev, newGroup])
      toast.success("Student group created successfully")
      setIsGroupDialogOpen(false)
    }
    resetGroupForm()
  }

  const handleViewGroup = (group: any) => {
    setViewGroupDialog({isOpen: true, group})
  }

  const handleEditGroup = (group: any) => {
    setEditGroupDialog({isOpen: true, group})
    setGroupForm({
      name: group.name,
      discountPercentage: group.discountPercentage,
      departments: [...group.departments],
      selectedStudents: [...group.students]
    })
  }

  const handleDeleteGroup = (group: any) => {
    setDeleteConfirmDialog({isOpen: true, group})
  }

  const confirmDeleteGroup = () => {
    if (deleteConfirmDialog.group) {
      setStudentGroups(prev => prev.filter(g => g.id !== deleteConfirmDialog.group.id))
      toast.success("Student group deleted successfully")
      setDeleteConfirmDialog({isOpen: false, group: null})
    }
  }



  const resetCampaignForm = () => {
    setCampaignForm({
      name: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      targetGroups: [],
      discountType: "percentage",
      discountValue: 0,
      totalBudget: 0,
      targetParticipants: 0,
      category: ""
    })
    setEditingCampaign(null)
  }

  const handleSaveDiscount = () => {
    if (!formData.code || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields")
      return
    }

    if (editingDiscount) {
      setDiscountCodes(prev => prev.map(discount => 
        discount.id === editingDiscount.id 
          ? { 
              ...discount, 
              ...formData,
              startDate: formData.startDate!,
              endDate: formData.endDate!
            }
          : discount
      ))
      toast.success("Discount code updated successfully")
    } else {
      const newDiscount: DiscountCode = {
        id: Date.now(),
        ...formData,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        usedCount: 0,
        isActive: true,
        createdBy: "Admin"
      }
      setDiscountCodes(prev => [...prev, newDiscount])
      toast.success("Discount code created successfully")
    }

    setIsDialogOpen(false)
    resetDiscountForm()
  }

  const handleSaveCampaign = () => {
    if (!campaignForm.name || !campaignForm.startDate || !campaignForm.endDate) {
      toast.error("Please fill in all required fields")
      return
    }

    if (editingCampaign) {
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === editingCampaign.id 
          ? { 
              ...campaign, 
              ...campaignForm,
              startDate: campaignForm.startDate!,
              endDate: campaignForm.endDate!
            }
          : campaign
      ))
      toast.success("Campaign updated successfully")
    } else {
      const newCampaign: PromotionalCampaign = {
        id: Date.now(),
        ...campaignForm,
        startDate: campaignForm.startDate!,
        endDate: campaignForm.endDate!,
        status: "draft",
        usedBudget: 0,
        participantCount: 0
      }
      setCampaigns(prev => [...prev, newCampaign])
      toast.success("Campaign created successfully")
    }

    setIsCampaignDialogOpen(false)
    resetCampaignForm()
  }

  const handleEditDiscount = (discount: DiscountCode) => {
    setEditingDiscount(discount)
    setFormData({
      code: discount.code,
      type: discount.type,
      value: discount.value,
      description: discount.description,
      startDate: discount.startDate,
      endDate: discount.endDate,
      usageLimit: discount.usageLimit,
      targetTypes: discount.targetTypes,
      minAmount: discount.minAmount,
      category: discount.category,
      period: discount.period,
      selectedStudents: discount.selectedStudents,
      applicableTerms: discount.applicableTerms || []
    })
    setIsDialogOpen(true)
  }

  const handleEditCampaign = (campaign: PromotionalCampaign) => {
    setEditingCampaign(campaign)
    setCampaignForm({
      name: campaign.name,
      description: campaign.description,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      targetGroups: campaign.targetGroups,
      discountType: campaign.discountType,
      discountValue: campaign.discountValue,
      totalBudget: campaign.totalBudget,
      targetParticipants: campaign.targetParticipants,
      category: campaign.category
    })
    setIsCampaignDialogOpen(true)
  }

  const toggleDiscountStatus = (id: number) => {
    setDiscountCodes(prev => prev.map(discount => 
      discount.id === id 
        ? { ...discount, isActive: !discount.isActive }
        : discount
    ))
    toast.success("Discount status updated")
  }

  const toggleCampaignStatus = (id: number) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === id 
        ? { 
            ...campaign, 
            status: campaign.status === 'active' ? 'paused' : 'active'
          }
        : campaign
    ))
    toast.success("Campaign status updated")
  }

  const copyDiscountCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success("Discount code copied to clipboard")
  }

  const getActiveTab = () => {
    switch (activeTab) {
      case "discount-overview":
        return "overview"
      case "student-groups":
        return "groups"
      case "promotional-campaigns":
        return "campaigns"
      case "waive-fee":
        return "waive-fee"
      case "discount-reports":
        return "reports"
      default:
        return "overview"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Discount Management</h2>
          <p className="text-muted-foreground">
            Manage discount codes, promotional campaigns, and analyze discount performance
          </p>
        </div>
      </div>

      <Tabs value={getActiveTab()} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="groups">Student Groups</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="waive-fee">Waive Fee</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Dashboard */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Student Groups</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {studentGroups.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  active groups
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaigns.filter(c => c.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  campaigns running
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">฿127,500</div>
                <p className="text-xs text-muted-foreground">
                  provided to families
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students in Whitelist</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {studentGroups.reduce((total, group) => total + group.students.length, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  across all groups
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Top Student Groups</CardTitle>
                <CardDescription>Groups with highest discount rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentGroups
                    .sort((a, b) => b.discountPercentage - a.discountPercentage)
                    .slice(0, 3)
                    .map((group) => (
                    <div key={group.id} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{group.name}</h4>
                        <p className="text-sm text-muted-foreground">{group.departments.join(", ")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{group.discountPercentage}% discount</p>
                        <p className="text-sm text-muted-foreground">
                          {group.students.length} students
                        </p>
                      </div>
                    </div>
                  ))}
                  {studentGroups.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No student groups created yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Groups by Department</CardTitle>
                <CardDescription>Distribution across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Tuition", "After School", "Event Management", "Summer Activities"].map((dept) => {
                    const count = studentGroups.filter(g => g.departments.includes(dept)).length
                    return (
                      <div key={dept} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            dept === 'Tuition' ? 'bg-blue-500' :
                            dept === 'After School' ? 'bg-green-500' : 
                            dept === 'Event Management' ? 'bg-purple-500' : 'bg-orange-500'
                          }`} />
                          <span>{dept}</span>
                        </div>
                        <span className="font-medium">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Coverage</CardTitle>
                <CardDescription>Students enrolled in targeted discounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Show student groups first */}
                  {studentGroups.slice(0, 2).map((group) => (
                    <div key={group.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{group.name} (Group)</h4>
                          <p className="text-xs text-muted-foreground">{group.departments.join(", ")} • {group.discountPercentage}%</p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {group.students.length} students
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {group.students.slice(0, 4).map(student => (
                          <Badge key={student.id} variant="secondary" className="text-xs">
                            {student.name.split(' ')[0]}
                          </Badge>
                        ))}
                        {group.students.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{group.students.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Then show individual discount codes */}
                  {discountCodes
                    .filter(d => d.selectedStudents.length > 0)
                    .slice(0, studentGroups.length > 0 ? 1 : 3)
                    .map((discount) => (
                    <div key={discount.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{discount.code}</h4>
                          <p className="text-xs text-muted-foreground">{discount.period} • {discount.targetTypes.join(", ")}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {discount.selectedStudents.length} students
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {discount.selectedStudents.slice(0, 4).map(student => (
                          <Badge key={student.id} variant="outline" className="text-xs">
                            {student.name.split(' ')[0]}
                          </Badge>
                        ))}
                        {discount.selectedStudents.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{discount.selectedStudents.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {studentGroups.length === 0 && discountCodes.filter(d => d.selectedStudents.length > 0).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No student groups or targeted discounts available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Student Groups & Whitelist</h3>
              <p className="text-sm text-muted-foreground">
                Create student groups with specific discount rates and manage discount whitelist
              </p>
            </div>
            
            <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetGroupForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Student Group
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Create Student Group</DialogTitle>
                  <DialogDescription>
                    Create a group of students with specific discount percentage for selected departments
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="group-name">Group Name</Label>
                      <Input
                        id="group-name"
                        value={groupForm.name}
                        onChange={(e) => setGroupForm({...groupForm, name: e.target.value})}
                        placeholder="Year 7 Excellence Group"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="group-discount">Discount Percentage (%)</Label>
                      <Input
                        id="group-discount"
                        type="number"
                        value={groupForm.discountPercentage}
                        onChange={(e) => setGroupForm({...groupForm, discountPercentage: Number(e.target.value)})}
                        placeholder="15"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Applicable Departments</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Tuition", "After School", "Event Management", "Summer Activities"].map(dept => (
                        <div key={dept} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`group-${dept}`}
                            checked={groupForm.departments.includes(dept)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setGroupForm(prev => ({
                                  ...prev,
                                  departments: [...prev.departments, dept]
                                }))
                              } else {
                                setGroupForm(prev => ({
                                  ...prev,
                                  departments: prev.departments.filter(d => d !== dept)
                                }))
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`group-${dept}`} className="text-sm">{dept}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Student ID Input Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Add Students to Whitelist</Label>
                      <span className="text-sm text-muted-foreground">
                        {groupForm.selectedStudents.length} students added
                      </span>
                    </div>
                    
                    <Tabs defaultValue="individual" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="individual">Individual Input</TabsTrigger>
                        <TabsTrigger value="csv-upload">CSV Upload</TabsTrigger>
                      </TabsList>

                      <TabsContent value="individual" className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="student-input">Add Student by ID</Label>
                          <div className="flex gap-2">
                            <Input
                              id="student-input"
                              value={studentInput}
                              onChange={(e) => setStudentInput(e.target.value)}
                              placeholder="Enter Student ID (e.g., S001)"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  addStudentToGroup()
                                }
                              }}
                            />
                            <Button type="button" onClick={addStudentToGroup}>Add</Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Format: S001, S002, etc. Press Enter to add quickly.
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="csv-upload" className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Upload Student CSV File</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={downloadStudentTemplate}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Template
                            </Button>
                          </div>

                          <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-2">
                              Upload CSV file with student IDs
                            </p>
                            <input
                              type="file"
                              accept=".csv"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="csv-file-upload"
                              disabled={isProcessingFile}
                            />
                            <Button asChild variant="outline" disabled={isProcessingFile}>
                              <label htmlFor="csv-file-upload" className="cursor-pointer">
                                {isProcessingFile ? "Processing..." : "Choose CSV File"}
                              </label>
                            </Button>
                          </div>

                          {uploadedFile && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">{uploadedFile.name}</span>
                                {isProcessingFile && (
                                  <div className="ml-auto">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                  </div>
                                )}
                              </div>
                              
                              {fileParseErrors.length > 0 && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded p-3">
                                  <h4 className="text-sm font-medium text-destructive mb-2">
                                    File Processing Errors ({fileParseErrors.length}):
                                  </h4>
                                  <div className="max-h-24 overflow-y-auto text-xs text-destructive space-y-1">
                                    {fileParseErrors.slice(0, 10).map((error, index) => (
                                      <div key={index}>{error}</div>
                                    ))}
                                    {fileParseErrors.length > 10 && (
                                      <div className="font-medium">
                                        ...and {fileParseErrors.length - 10} more errors
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="text-xs text-muted-foreground space-y-1">
                            <p><strong>File format requirements:</strong></p>
                            <p>• CSV file with Student ID in the first column</p>
                            <p>• Optional header row (will be automatically detected)</p>
                            <p>• Student ID format: S001, S002, S003, etc.</p>
                            <p>• One student ID per row</p>
                            <p>• Maximum file size: 5MB</p>
                          </div>

                          <div className="bg-muted/50 p-3 rounded text-xs">
                            <strong>Example CSV content:</strong>
                            <pre className="mt-1 text-muted-foreground">
Student ID{'\n'}S001{'\n'}S002{'\n'}S003
                            </pre>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Selected Students Preview */}
                    {groupForm.selectedStudents.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Selected Students ({groupForm.selectedStudents.length})</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setGroupForm(prev => ({ ...prev, selectedStudents: [] }))}
                          >
                            Clear All
                          </Button>
                        </div>
                        <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                          <div className="grid grid-cols-1 gap-2">
                            {groupForm.selectedStudents.map(student => (
                              <div key={student.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs">
                                    {student.name.charAt(0)}
                                  </div>
                                  <div>
                                    <span className="font-medium">{student.name}</span>
                                    <span className="text-muted-foreground ml-2">({student.id})</span>
                                    <span className="text-muted-foreground ml-2">{student.yearGroup}</span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeStudentFromGroup(student.id)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsGroupDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveGroup}>
                      Create Group
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Student Groups Display */}
          <div className="space-y-4">
            {studentGroups.map((group) => (
              <Card key={group.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{group.name}</h4>
                        <Badge variant="secondary">{group.discountPercentage}% Discount</Badge>
                        {group.departments.map(dept => (
                          <Badge key={dept} variant="outline" className="text-xs">{dept}</Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Users className="w-4 h-4" />
                        <span>{group.students.length} students in whitelist</span>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm">Students in Group:</Label>
                        <div className="flex flex-wrap gap-1">
                          {group.students.slice(0, 10).map(student => (
                            <Badge key={student.id} variant="outline" className="text-xs">
                              {student.name} ({student.id})
                            </Badge>
                          ))}
                          {group.students.length > 10 && (
                            <Badge variant="outline" className="text-xs">
                              +{group.students.length - 10} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewGroup(group)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View All
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditGroup(group)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGroup(group)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {studentGroups.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">No Student Groups</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first student group to manage discount whitelist
                  </p>
                  <Button onClick={() => setIsGroupDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Student Group
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* View Group Dialog */}
          <Dialog open={viewGroupDialog.isOpen} onOpenChange={(open) => setViewGroupDialog({isOpen: open, group: null})}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {viewGroupDialog.group?.name} - Student List
                </DialogTitle>
                <DialogDescription>
                  Complete list of students in this discount group
                </DialogDescription>
              </DialogHeader>
              
              {viewGroupDialog.group && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{viewGroupDialog.group.discountPercentage}% Discount</Badge>
                      {viewGroupDialog.group.departments.map((dept: string) => (
                        <Badge key={dept} variant="outline" className="text-xs">{dept}</Badge>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {viewGroupDialog.group.students.length} students total
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    <div className="grid gap-2">
                      {viewGroupDialog.group.students.map((student: Student) => (
                        <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {student.id} • {student.yearGroup} • Parent: {student.parentName}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">{student.yearGroup}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setCsvUploadDialog({isOpen: true, groupId: viewGroupDialog.group?.id})
                          setViewGroupDialog({isOpen: false, group: null})
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload CSV
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setAddIndividualDialog({isOpen: true, groupId: viewGroupDialog.group?.id})
                          setViewGroupDialog({isOpen: false, group: null})
                        }}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Individual
                      </Button>
                    </div>
                    <Button onClick={() => setViewGroupDialog({isOpen: false, group: null})}>
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Group Dialog */}
          <Dialog open={editGroupDialog.isOpen} onOpenChange={(open) => {
            if (!open) {
              setEditGroupDialog({isOpen: false, group: null})
              resetGroupForm()
            }
          }}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Edit Student Group</DialogTitle>
                <DialogDescription>
                  Update group information and manage student whitelist
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-group-name">Group Name</Label>
                    <Input
                      id="edit-group-name"
                      value={groupForm.name}
                      onChange={(e) => setGroupForm({...groupForm, name: e.target.value})}
                      placeholder="Year 7 Excellence Group"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-group-discount">Discount Percentage (%)</Label>
                    <Input
                      id="edit-group-discount"
                      type="number"
                      value={groupForm.discountPercentage}
                      onChange={(e) => setGroupForm({...groupForm, discountPercentage: Number(e.target.value)})}
                      placeholder="15"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Applicable Departments</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Tuition", "After School", "Event Management", "Summer Activities"].map(dept => (
                      <div key={dept} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`edit-group-${dept}`}
                          checked={groupForm.departments.includes(dept)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setGroupForm(prev => ({
                                ...prev,
                                departments: [...prev.departments, dept]
                              }))
                            } else {
                              setGroupForm(prev => ({
                                ...prev,
                                departments: prev.departments.filter(d => d !== dept)
                              }))
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`edit-group-${dept}`} className="text-sm">{dept}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Student Management Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Manage Students in Whitelist</Label>
                    <span className="text-sm text-muted-foreground">
                      {groupForm.selectedStudents.length} students
                    </span>
                  </div>

                  <Tabs defaultValue="add-student" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="add-student">Add Individual</TabsTrigger>
                      <TabsTrigger value="csv-upload">CSV Upload</TabsTrigger>
                      <TabsTrigger value="current-students">Current Students ({groupForm.selectedStudents.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="add-student" className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="edit-student-input">Add Student by ID</Label>
                        <div className="flex gap-2">
                          <Input
                            id="edit-student-input"
                            value={studentInput}
                            onChange={(e) => setStudentInput(e.target.value)}
                            placeholder="Enter Student ID (e.g., S001)"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                addStudentToGroup()
                              }
                            }}
                          />
                          <Button type="button" onClick={addStudentToGroup}>Add</Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="csv-upload" className="space-y-3">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-csv-file">Upload Student CSV File</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                            <div className="flex flex-col items-center gap-2 text-center">
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <div className="space-y-1">
                                <p className="text-sm">
                                  <label htmlFor="edit-csv-file" className="font-medium text-primary hover:underline cursor-pointer">
                                    Click to upload
                                  </label>
                                  {" "}or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  CSV file with columns: id, name, year_group, parent_name
                                </p>
                              </div>
                              <input
                                id="edit-csv-file"
                                type="file"
                                accept=".csv"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    handleFileUpload(e)
                                  }
                                }}
                                className="hidden"
                              />
                            </div>
                          </div>
                        </div>
                        
                        {uploadedFile && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                              <FileText className="h-4 w-4" />
                              <span className="text-sm font-medium">{uploadedFile.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setUploadedFile(null)
                                  setFileParseErrors([])
                                }}
                                className="ml-auto p-1"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {isProcessingFile && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                Processing file...
                              </div>
                            )}
                            
                            {fileParseErrors.length > 0 && (
                              <div className="space-y-2">
                                <Label>Import Errors:</Label>
                                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 max-h-32 overflow-y-auto">
                                  {fileParseErrors.map((error, index) => (
                                    <div key={index} className="text-sm text-destructive">
                                      {error}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={downloadStudentTemplate}
                            className="flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Download Template
                          </Button>
                          <span className="text-xs text-muted-foreground">
                            Need a template? Download the CSV format.
                          </span>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="current-students" className="space-y-3">
                      {groupForm.selectedStudents.length > 0 ? (
                        <div className="border rounded-lg p-3 max-h-60 overflow-y-auto">
                          <div className="grid gap-2">
                            {groupForm.selectedStudents.map(student => (
                              <div key={student.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs">
                                    {student.name.charAt(0)}
                                  </div>
                                  <div>
                                    <span className="font-medium">{student.name}</span>
                                    <span className="text-muted-foreground ml-2">({student.id})</span>
                                    <span className="text-muted-foreground ml-2">{student.yearGroup}</span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeStudentFromGroup(student.id)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No students in this group
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {
                    setEditGroupDialog({isOpen: false, group: null})
                    resetGroupForm()
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveGroup}>
                    Update Group
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteConfirmDialog.isOpen} onOpenChange={(open) => {
            if (!open) setDeleteConfirmDialog({isOpen: false, group: null})
          }}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Student Group</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this student group? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              {deleteConfirmDialog.group && (
                <div className="p-4 bg-muted/50 rounded-lg my-4">
                  <div className="font-medium mb-1">{deleteConfirmDialog.group.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {deleteConfirmDialog.group.students.length} students • {deleteConfirmDialog.group.discountPercentage}% discount
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Departments: {deleteConfirmDialog.group.departments.join(", ")}
                  </div>
                </div>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteConfirmDialog({isOpen: false, group: null})}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteGroup} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Group
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Promotional Campaigns</h3>
              <p className="text-sm text-muted-foreground">
                Manage large-scale promotional campaigns and track their performance
              </p>
            </div>
            
            <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetCampaignForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingCampaign ? "Edit Campaign" : "Add Campaign"}
                  </DialogTitle>
                  <DialogDescription>
                    Configure promotional campaign settings and targets
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="campaign-name">Campaign Name</Label>
                      <Input
                        id="campaign-name"
                        value={campaignForm.name}
                        onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})}
                        placeholder="Back to School 2024"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="campaign-category">Category</Label>
                      <Select value={campaignForm.category} onValueChange={(value) => setCampaignForm({...campaignForm, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Academic">Academic</SelectItem>
                          <SelectItem value="Holiday">Holiday</SelectItem>
                          <SelectItem value="Summer">Summer</SelectItem>
                          <SelectItem value="Special">Special Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaign-description">Description</Label>
                    <Textarea
                      id="campaign-description"
                      value={campaignForm.description}
                      onChange={(e) => setCampaignForm({...campaignForm, description: e.target.value})}
                      placeholder="Describe this campaign..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarDays className="w-4 h-4 mr-2" />
                            {campaignForm.startDate ? format(campaignForm.startDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={campaignForm.startDate}
                            onSelect={(date) => setCampaignForm({...campaignForm, startDate: date})}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarDays className="w-4 h-4 mr-2" />
                            {campaignForm.endDate ? format(campaignForm.endDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={campaignForm.endDate}
                            onSelect={(date) => setCampaignForm({...campaignForm, endDate: date})}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discount-type">Discount Type</Label>
                      <Select value={campaignForm.discountType} onValueChange={(value: 'percentage' | 'fixed') => setCampaignForm({...campaignForm, discountType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount-value">
                        Value {campaignForm.discountType === 'percentage' ? '(%)' : '(฿)'}
                      </Label>
                      <Input
                        id="discount-value"
                        type="number"
                        value={campaignForm.discountValue}
                        onChange={(e) => setCampaignForm({...campaignForm, discountValue: Number(e.target.value)})}
                        placeholder={campaignForm.discountType === 'percentage' ? "20" : "1000"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="total-budget">Total Budget (฿)</Label>
                      <Input
                        id="total-budget"
                        type="number"
                        value={campaignForm.totalBudget}
                        onChange={(e) => setCampaignForm({...campaignForm, totalBudget: Number(e.target.value)})}
                        placeholder="100000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Applicable Departments</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Tuition", "After School", "Event Management", "Summer Activities"].map(dept => (
                        <div key={dept} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`campaign-${dept}`}
                            checked={campaignForm.targetGroups.includes(dept)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCampaignForm(prev => ({
                                  ...prev,
                                  targetGroups: [...prev.targetGroups, dept]
                                }))
                              } else {
                                setCampaignForm(prev => ({
                                  ...prev,
                                  targetGroups: prev.targetGroups.filter(t => t !== dept)
                                }))
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`campaign-${dept}`} className="text-sm">{dept}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target-participants">Target Participants</Label>
                    <Input
                      id="target-participants"
                      type="number"
                      value={campaignForm.targetParticipants}
                      onChange={(e) => setCampaignForm({...campaignForm, targetParticipants: Number(e.target.value)})}
                      placeholder="300"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCampaignDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveCampaign}>
                      {editingCampaign ? "Update" : "Create"} Campaign
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{campaign.name}</h3>
                        {getStatusBadge(campaign.status)}
                        <Badge variant="outline">{campaign.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{campaign.description}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <span>Duration: {format(campaign.startDate, "MMM dd")} - {format(campaign.endDate, "MMM dd")}</span>
                        <span>Discount: {campaign.discountType === 'percentage' ? `${campaign.discountValue}%` : `฿${campaign.discountValue}`}</span>
                        <span>Target: {campaign.targetGroups.join(", ")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCampaignStatus(campaign.id)}
                      >
                        {campaign.status === 'active' ? 'Pause' : 'Activate'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditCampaign(campaign)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Participants</span>
                        <span>{campaign.participantCount}/{campaign.targetParticipants}</span>
                      </div>
                      <Progress value={(campaign.participantCount / campaign.targetParticipants) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Budget Used</span>
                        <span>฿{campaign.usedBudget.toLocaleString()}/฿{campaign.totalBudget.toLocaleString()}</span>
                      </div>
                      <Progress value={getBudgetProgress(campaign.usedBudget, campaign.totalBudget)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Student Groups Performance */}
          {studentGroups.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Student Groups Performance</CardTitle>
                <CardDescription>Performance analysis of student groups with specific discounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {studentGroups.map((group) => (
                    <div key={group.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{group.name}</h4>
                        <Badge variant="outline">{group.discountPercentage}% Discount</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {group.students.length} students • {group.departments.join(", ")}
                      </p>
                      <div className="flex gap-1 mb-2">
                        {group.students.slice(0, 5).map(student => (
                          <Badge key={student.id} variant="secondary" className="text-xs">
                            {student.name.split(' ')[0]}
                          </Badge>
                        ))}
                        {group.students.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{group.students.length - 5}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Est. savings: ฿{(group.students.length * group.discountPercentage * 35).toLocaleString()}/month
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Groups by Department</CardTitle>
                <CardDescription>Groups breakdown by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Tuition", "After School", "Event Management", "Summer Activities"].map((dept) => {
                    const groups = studentGroups.filter(g => g.departments.includes(dept))
                    const totalStudents = groups.reduce((sum, group) => sum + group.students.length, 0)
                    return (
                      <div key={dept} className="flex items-center justify-between">
                        <span className="text-sm">{dept}</span>
                        <span className="font-medium">{groups.length} groups ({totalStudents} students)</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Discount Rates</CardTitle>
                <CardDescription>Distribution of discount percentages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { range: "0-10%", min: 0, max: 10, color: "bg-blue-500" },
                    { range: "11-20%", min: 11, max: 20, color: "bg-green-500" },
                    { range: "21-30%", min: 21, max: 30, color: "bg-purple-500" },
                    { range: "31%+", min: 31, max: 100, color: "bg-orange-500" }
                  ].map((range) => {
                    const count = studentGroups.filter(g => g.discountPercentage >= range.min && g.discountPercentage <= range.max).length
                    return (
                      <div key={range.range} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${range.color}`} />
                          <span className="text-sm">{range.range}</span>
                        </div>
                        <span className="font-medium">{count} groups</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Enrollment</CardTitle>
                <CardDescription>Students in discount groups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Students in Groups</span>
                    <span className="font-medium">{studentGroups.reduce((sum, group) => sum + group.students.length, 0)} students</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Group Size</span>
                    <span className="font-medium">
                      {studentGroups.length > 0 
                        ? Math.round(studentGroups.reduce((sum, group) => sum + group.students.length, 0) / studentGroups.length)
                        : 0
                      } students
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Discount Rate</span>
                    <span className="font-medium">
                      {studentGroups.length > 0 
                        ? Math.round(studentGroups.reduce((sum, group) => sum + group.discountPercentage, 0) / studentGroups.length)
                        : 0
                      }%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Savings by Category</CardTitle>
                <CardDescription>Total savings provided by discount type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Academic</span>
                    <span className="font-medium">฿52,400</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Family</span>
                    <span className="font-medium">฿38,200</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Early Bird</span>
                    <span className="font-medium">฿36,900</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Group Discounts</span>
                    <span className="font-medium">฿{(studentGroups.reduce((sum, group) => sum + (group.students.length * group.discountPercentage * 35), 0)).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="waive-fee" className="space-y-6">
          <WaiveFeeManagement onNavigateToSubPage={onNavigateToSubPage} />
        </TabsContent>
      </Tabs>

      {/* CSV Upload Dialog */}
      <Dialog open={csvUploadDialog.isOpen} onOpenChange={(open) => {
        if (!open) {
          setCsvUploadDialog({isOpen: false, groupId: null})
          setCsvFile(null)
          setCsvPreviewData([])
          setIsPreviewingCsv(false)
        }
      }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Upload Students via CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file to add multiple students to the group. Required columns: id, name, year_group, parent_name
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!csvFile && (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload CSV File</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleCsvUpload(file)
                    }}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Select CSV File
                    </Button>
                  </label>
                </div>
              </div>
            )}

            {isPreviewingCsv && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Processing CSV file...</p>
              </div>
            )}

            {csvFile && csvPreviewData.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Preview: {csvPreviewData.length} students found</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCsvFile(null)
                      setCsvPreviewData([])
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>

                <div className="max-h-60 overflow-y-auto border rounded-lg">
                  <div className="grid gap-2 p-4">
                    {csvPreviewData.slice(0, 10).map((student, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs">
                          {student.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{student.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {student.id} • {student.yearGroup} • Parent: {student.parentName}
                          </div>
                        </div>
                      </div>
                    ))}
                    {csvPreviewData.length > 10 && (
                      <div className="text-center text-sm text-muted-foreground py-2">
                        ...and {csvPreviewData.length - 10} more students
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCsvUploadDialog({isOpen: false, groupId: null})}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmCsvUpload}
                disabled={!csvFile || csvPreviewData.length === 0}
              >
                Add {csvPreviewData.length} Students
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Individual Student Dialog */}
      <Dialog open={addIndividualDialog.isOpen} onOpenChange={(open) => {
        if (!open) {
          setAddIndividualDialog({isOpen: false, groupId: null})
          setIndividualStudentForm({ id: "", name: "", yearGroup: "", parentName: "" })
          clearStudentSearch()
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Individual Student</DialogTitle>
            <DialogDescription>
              Add a single student to the group manually
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Student Search */}
            <div className="space-y-2">
              <Label htmlFor="student-search">Search Student</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="student-search"
                  value={studentSearchQuery}
                  onChange={(e) => handleStudentSearch(e.target.value)}
                  placeholder="Search by Student ID or Name..."
                  className="pl-10 pr-10"
                />
                {studentSearchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearStudentSearch}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                
                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-md z-50 max-h-60 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-3 text-center text-muted-foreground">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto mb-2"></div>
                        Searching...
                      </div>
                    ) : studentSearchResults.length > 0 ? (
                      <div className="py-1">
                        {studentSearchResults.map((student) => (
                          <button
                            key={student.id}
                            onClick={() => handleSelectSearchResult(student)}
                            className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs">
                                {student.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{student.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {student.id} • {student.yearGroup} • Parent: {student.parentName}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-center text-muted-foreground">
                        No students found matching "{studentSearchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Search by Student ID (e.g., S001) or Name (e.g., Emma Johnson) to auto-fill the form
              </p>
            </div>

            {/* Manual Form Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student-id">Student ID</Label>
                <Input
                  id="student-id"
                  value={individualStudentForm.id}
                  onChange={(e) => setIndividualStudentForm({...individualStudentForm, id: e.target.value})}
                  placeholder="S001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-name">Student Name</Label>
                <Input
                  id="student-name"
                  value={individualStudentForm.name}
                  onChange={(e) => setIndividualStudentForm({...individualStudentForm, name: e.target.value})}
                  placeholder="Emma Johnson"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year-group">Year Group</Label>
                <Select 
                  value={individualStudentForm.yearGroup} 
                  onValueChange={(value) => setIndividualStudentForm({...individualStudentForm, yearGroup: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reception">Reception</SelectItem>
                    {Array.from({length: 12}, (_, i) => (
                      <SelectItem key={i + 1} value={`Year ${i + 1}`}>Year {i + 1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent-name">Parent Name</Label>
                <Input
                  id="parent-name"
                  value={individualStudentForm.parentName}
                  onChange={(e) => setIndividualStudentForm({...individualStudentForm, parentName: e.target.value})}
                  placeholder="Sarah Johnson"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddIndividualDialog({isOpen: false, groupId: null})}>
                Cancel
              </Button>
              <Button onClick={handleAddIndividualStudent}>
                Add Student
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}