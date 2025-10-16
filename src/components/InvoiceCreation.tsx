import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Search, Plus, CheckCircle, Trash2, X, Upload, Users, User, FileSpreadsheet, FileText, Bookmark, GraduationCap, Zap, MapPin, Calendar, Clock, Eye, Mail } from "lucide-react"
import { toast } from "sonner@2.0.3"

interface PreCreatedItem {
  id: string
  name: string
  description: string
  amount: number
  category: string
  isActive: boolean
  applicableGrades: string[]
}

interface ItemTemplate {
  id: string
  name: string
  description: string
  items: string[] // Item IDs
  applicableGrades: string[]
  isActive: boolean
}

const grades = ["Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]

const rooms = {
  "Reception": ["Reception A", "Reception B", "Reception C"],
  "Year 1": ["1A", "1B", "1C", "1D"],
  "Year 2": ["2A", "2B", "2C", "2D"],
  "Year 3": ["3A", "3B", "3C", "3D"],
  "Year 4": ["4A", "4B", "4C"],
  "Year 5": ["5A", "5B", "5C"],
  "Year 6": ["6A", "6B", "6C"],
  "Year 7": ["7A", "7B", "7C", "7D"],
  "Year 8": ["8A", "8B", "8C", "8D"],
  "Year 9": ["9A", "9B", "9C"],
  "Year 10": ["10A", "10B", "10C"],
  "Year 11": ["11A", "11B"],
  "Year 12": ["12A", "12B"]
}

const mockStudents = [
  // Year 10 students
  { id: "ST001234", name: "John Smith", grade: "Year 10", room: "10A", parentName: "Robert Smith", email: "robert.smith@email.com" },
  { id: "ST001238", name: "Tom Brown", grade: "Year 10", room: "10A", parentName: "Jane Brown", email: "jane.brown@email.com" },
  { id: "ST001239", name: "Lisa Chen", grade: "Year 10", room: "10B", parentName: "David Chen", email: "david.chen@email.com" },
  { id: "ST001240", name: "Mark Taylor", grade: "Year 10", room: "10C", parentName: "Susan Taylor", email: "susan.taylor@email.com" },
  { id: "ST001301", name: "Emily Zhang", grade: "Year 10", room: "10A", parentName: "Kevin Zhang", email: "kevin.zhang@email.com" },
  { id: "ST001302", name: "Alex Johnson", grade: "Year 10", room: "10B", parentName: "Sarah Johnson", email: "sarah.johnson@email.com" },
  { id: "ST001303", name: "Sophie Williams", grade: "Year 10", room: "10C", parentName: "Mark Williams", email: "mark.williams@email.com" },
  { id: "ST001304", name: "Ryan Davis", grade: "Year 10", room: "10A", parentName: "Jennifer Davis", email: "jennifer.davis@email.com" },
  { id: "ST001305", name: "Maya Patel", grade: "Year 10", room: "10B", parentName: "Raj Patel", email: "raj.patel@email.com" },
  { id: "ST001306", name: "Daniel Kim", grade: "Year 10", room: "10C", parentName: "Grace Kim", email: "grace.kim@email.com" },
  
  // Year 7 students
  { id: "ST001235", name: "Sarah Wilson", grade: "Year 7", room: "7B", parentName: "Michael Wilson", email: "michael.wilson@email.com" },
  { id: "ST001241", name: "Anna Martinez", grade: "Year 7", room: "7A", parentName: "Carlos Martinez", email: "carlos.martinez@email.com" },
  { id: "ST001242", name: "Peter Lee", grade: "Year 7", room: "7C", parentName: "Michelle Lee", email: "michelle.lee@email.com" },
  { id: "ST001307", name: "Oliver Thompson", grade: "Year 7", room: "7A", parentName: "Lisa Thompson", email: "lisa.thompson@email.com" },
  { id: "ST001308", name: "Isabella Rodriguez", grade: "Year 7", room: "7B", parentName: "Miguel Rodriguez", email: "miguel.rodriguez@email.com" },
  { id: "ST001309", name: "Lucas Wang", grade: "Year 7", room: "7C", parentName: "Helen Wang", email: "helen.wang@email.com" },
  { id: "ST001310", name: "Chloe Anderson", grade: "Year 7", room: "7A", parentName: "James Anderson", email: "james.anderson@email.com" },
  { id: "ST001311", name: "Noah Garcia", grade: "Year 7", room: "7B", parentName: "Maria Garcia", email: "maria.garcia@email.com" },
  { id: "ST001312", name: "Ava Singh", grade: "Year 7", room: "7C", parentName: "Preet Singh", email: "preet.singh@email.com" },
  { id: "ST001313", name: "Ethan Brown", grade: "Year 7", room: "7D", parentName: "Rachel Brown", email: "rachel.brown@email.com" },
  
  // Year 12 students
  { id: "ST001236", name: "Mike Johnson", grade: "Year 12", room: "12A", parentName: "Lisa Johnson", email: "lisa.johnson@email.com" },
  { id: "ST001314", name: "Victoria Chang", grade: "Year 12", room: "12A", parentName: "Peter Chang", email: "peter.chang@email.com" },
  { id: "ST001315", name: "James Miller", grade: "Year 12", room: "12B", parentName: "Amanda Miller", email: "amanda.miller@email.com" },
  { id: "ST001316", name: "Emma Taylor", grade: "Year 12", room: "12A", parentName: "David Taylor", email: "david.taylor@email.com" },
  { id: "ST001317", name: "William Chen", grade: "Year 12", room: "12B", parentName: "Linda Chen", email: "linda.chen@email.com" },
  
  // Year 3 students
  { id: "ST001237", name: "Emma Davis", grade: "Year 3", room: "3C", parentName: "David Davis", email: "david.davis@email.com" },
  { id: "ST001318", name: "Logan White", grade: "Year 3", room: "3A", parentName: "Karen White", email: "karen.white@email.com" },
  { id: "ST001319", name: "Zoe Martin", grade: "Year 3", room: "3B", parentName: "Steven Martin", email: "steven.martin@email.com" },
  { id: "ST001320", name: "Mason Harris", grade: "Year 3", room: "3C", parentName: "Nicole Harris", email: "nicole.harris@email.com" },
  { id: "ST001321", name: "Lily Thompson", grade: "Year 3", room: "3D", parentName: "Brian Thompson", email: "brian.thompson@email.com" },
  
  // Year 1 students
  { id: "ST001322", name: "Henry Wilson", grade: "Year 1", room: "1A", parentName: "Sophie Wilson", email: "sophie.wilson@email.com" },
  { id: "ST001323", name: "Grace Moore", grade: "Year 1", room: "1B", parentName: "Thomas Moore", email: "thomas.moore@email.com" },
  { id: "ST001324", name: "Jack Robinson", grade: "Year 1", room: "1C", parentName: "Emma Robinson", email: "emma.robinson@email.com" },
  { id: "ST001325", name: "Ruby Clark", grade: "Year 1", room: "1D", parentName: "Paul Clark", email: "paul.clark@email.com" },
  { id: "ST001326", name: "Oscar Lewis", grade: "Year 1", room: "1A", parentName: "Catherine Lewis", email: "catherine.lewis@email.com" },
  
  // Reception students
  { id: "ST001327", name: "Mia Walker", grade: "Reception", room: "Reception A", parentName: "Daniel Walker", email: "daniel.walker@email.com" },
  { id: "ST001328", name: "Charlie Hall", grade: "Reception", room: "Reception B", parentName: "Jessica Hall", email: "jessica.hall@email.com" },
  { id: "ST001329", name: "Aria Young", grade: "Reception", room: "Reception C", parentName: "Matthew Young", email: "matthew.young@email.com" },
  { id: "ST001330", name: "Leo King", grade: "Reception", room: "Reception A", parentName: "Hannah King", email: "hannah.king@email.com" }
]

const mockPreCreatedItems: PreCreatedItem[] = [
  // Tuition items
  {
    id: "item-001",
    name: "Term 1 Tuition Fee",
    description: "First term tuition payment for academic year",
    amount: 150000,
    category: "Tuition",
    isActive: true,
    applicableGrades: ["Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  },
  {
    id: "item-002",
    name: "Term 2 Tuition Fee",
    description: "Second term tuition payment for academic year",
    amount: 150000,
    category: "Tuition",
    isActive: true,
    applicableGrades: ["Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  },
  {
    id: "item-003",
    name: "Registration Fee",
    description: "Annual registration and administrative fee",
    amount: 25000,
    category: "Tuition",
    isActive: true,
    applicableGrades: ["Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  },
  {
    id: "item-004",
    name: "Uniform & Textbooks",
    description: "School uniform and required textbooks",
    amount: 15000,
    category: "Tuition",
    isActive: true,
    applicableGrades: ["Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  },
  // ECA items
  {
    id: "item-005",
    name: "Swimming Program",
    description: "Swimming lessons and pool maintenance fee",
    amount: 80000,
    category: "ECA",
    isActive: true,
    applicableGrades: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  },
  {
    id: "item-006",
    name: "Football Training",
    description: "Professional football coaching and equipment",
    amount: 60000,
    category: "ECA",
    isActive: true,
    applicableGrades: ["Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  },
  {
    id: "item-007",
    name: "Music Lessons",
    description: "Individual and group music instruction",
    amount: 35000,
    category: "ECA",
    isActive: true,
    applicableGrades: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10"]
  },
  {
    id: "item-008",
    name: "Art & Craft Program",
    description: "Art supplies and creative activities",
    amount: 42000,
    category: "ECA",
    isActive: true,
    applicableGrades: ["Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7"]
  },
  {
    id: "item-009",
    name: "Computer Programming",
    description: "Introduction to coding and programming",
    amount: 45000,
    category: "ECA",
    isActive: true,
    applicableGrades: ["Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  },
  // Trip & Other Activity items
  {
    id: "item-010",
    name: "Bangkok City Tour",
    description: "Educational city tour and cultural experience",
    amount: 80000,
    category: "Trip & Other Activity",
    isActive: true,
    applicableGrades: ["Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10"]
  },
  {
    id: "item-011",
    name: "Science Museum Trip",
    description: "Interactive science learning experience",
    amount: 45000,
    category: "Trip & Other Activity",
    isActive: true,
    applicableGrades: ["Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8"]
  },
  {
    id: "item-012",
    name: "Annual Sports Day",
    description: "School sports competition and activities",
    amount: 15000,
    category: "Trip & Other Activity",
    isActive: true,
    applicableGrades: ["Reception", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  },
  {
    id: "item-013",
    name: "International School Fair",
    description: "Educational fair participation and materials",
    amount: 35000,
    category: "Trip & Other Activity",
    isActive: true,
    applicableGrades: ["Year 8", "Year 9", "Year 10", "Year 11", "Year 12"]
  },
  {
    id: "item-014",
    name: "Graduation Ceremony",
    description: "Graduation ceremony and celebration costs",
    amount: 50000,
    category: "Trip & Other Activity",
    isActive: true,
    applicableGrades: ["Year 6", "Year 12"]
  }
]

const mockTemplates: ItemTemplate[] = [
  {
    id: "template-001",
    name: "Year 1 Complete Package",
    description: "Full academic year package for Year 1 students",
    items: ["item-001", "item-002", "item-003", "item-004"],
    applicableGrades: ["Year 1"],
    isActive: true
  },
  {
    id: "template-002", 
    name: "Year 1 Basic Tuition",
    description: "Essential tuition fees only for Year 1",
    items: ["item-001", "item-002", "item-003"],
    applicableGrades: ["Year 1"],
    isActive: true
  },
  {
    id: "template-003",
    name: "Year 10 Full Package",
    description: "Complete package with tuition and activities",
    items: ["item-001", "item-002", "item-003", "item-005", "item-009"],
    applicableGrades: ["Year 10"],
    isActive: true
  },
  {
    id: "template-004",
    name: "Primary ECA Bundle",
    description: "Popular ECA activities for primary students",
    items: ["item-005", "item-007", "item-008"],
    applicableGrades: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6"],
    isActive: true
  },
  {
    id: "template-005",
    name: "Secondary Activities",
    description: "ECA and trip package for secondary students",
    items: ["item-005", "item-006", "item-009", "item-010"],
    applicableGrades: ["Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"],
    isActive: true
  }
]

const formatCurrency = (amount: number): string => {
  return `฿${amount.toLocaleString()}`
}

const itemCategories = [
  { 
    id: "Tuition", 
    label: "Tuition", 
    icon: GraduationCap,
    description: "Academic fees and school essentials"
  },
  { 
    id: "ECA", 
    label: "ECA", 
    icon: Zap,
    description: "Extra-curricular activities"
  },
  { 
    id: "Trip & Other Activity", 
    label: "Trip & Other Activity", 
    icon: MapPin,
    description: "Field trips and special events"
  }
]

interface InvoiceCreationProps {
  defaultCategory?: string
  invoiceType?: string
  onNavigateToEmailSending?: (data: any) => void
}

export function InvoiceCreation({ defaultCategory, invoiceType, onNavigateToEmailSending }: InvoiceCreationProps) {
  // Create invoice state
  const [selectedGrade, setSelectedGrade] = useState("")
  const [selectedRoom, setSelectedRoom] = useState("")
  
  // Tuition type selection (only for tuition-only invoices)
  const [tuitionType, setTuitionType] = useState<"yearly" | "termly" | "">("")
  
  // Payment deadline
  const [paymentDeadline, setPaymentDeadline] = useState("")
  
  // Preview and confirmation states
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  
  // Student selection state
  const [studentSelectionType, setStudentSelectionType] = useState<"individual" | "csv" | "all">("individual")
  const [searchStudentTerm, setSearchStudentTerm] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<any[]>([])
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvStudents, setCsvStudents] = useState<any[]>([])
  
  // Item selection state
  const [availableItems, setAvailableItems] = useState<PreCreatedItem[]>([])
  const [selectedItems, setSelectedItems] = useState<PreCreatedItem[]>([])
  const [availableTemplates, setAvailableTemplates] = useState<ItemTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory || "Tuition")

  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade)
    setSelectedRoom("")
    setSelectedStudents([])
    setCsvStudents([])
    setCsvFile(null)
    setSelectedItems([])
    setSelectedTemplate("")
    setSelectedCategory(defaultCategory || "Tuition")
    setTuitionType("")
    setPaymentDeadline("")
    setIsPreviewMode(false)
    
    // Filter available items for this grade and category
    const gradeItems = mockPreCreatedItems.filter(item => 
      item.isActive && 
      item.applicableGrades.includes(grade) &&
      item.category === (defaultCategory || "Tuition")
    )
    setAvailableItems(gradeItems)

    // Filter available templates for this grade
    const gradeTemplates = mockTemplates.filter(template => 
      template.isActive && template.applicableGrades.includes(grade)
    )
    setAvailableTemplates(gradeTemplates)
  }

  const handleRoomChange = (room: string) => {
    setSelectedRoom(room === "all" ? "" : room)
    // Filter students by room
    setSelectedStudents([])
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setTuitionType("")
    
    // Filter available items for selected grade and new category
    const categoryItems = mockPreCreatedItems.filter(item => 
      item.isActive && 
      item.applicableGrades.includes(selectedGrade) &&
      item.category === category
    )
    setAvailableItems(categoryItems)
  }

  // Check if any tuition items are selected
  const hasTuitionSelected = selectedItems.some(item => item.category === "Tuition")
  
  // Check if only tuition items are selected
  const isOnlyTuitionSelected = selectedItems.length > 0 && selectedItems.every(item => item.category === "Tuition")

  // Check if tuition type restricts other categories
  const isCategoryDisabled = (categoryId: string) => {
    if (tuitionType === "yearly" || tuitionType === "termly") {
      return categoryId !== "Tuition"
    }
    return false
  }

  const filteredStudents = mockStudents.filter(student => 
    (student.id.toLowerCase().includes(searchStudentTerm.toLowerCase()) ||
     student.name.toLowerCase().includes(searchStudentTerm.toLowerCase())) &&
    student.grade === selectedGrade &&
    (selectedRoom === "" || student.room === selectedRoom) &&
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
    const gradeStudents = mockStudents.filter(s => 
      s.grade === selectedGrade && 
      (selectedRoom === "" || s.room === selectedRoom)
    )
    setSelectedStudents(gradeStudents)
  }

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCsvFile(file)
      // Simulate CSV parsing
      const mockCsvData = [
        { id: "ST001301", name: "CSV Student 1", grade: selectedGrade, room: selectedRoom || "Unknown", parentName: "Parent 1", email: "parent1@email.com" },
        { id: "ST001302", name: "CSV Student 2", grade: selectedGrade, room: selectedRoom || "Unknown", parentName: "Parent 2", email: "parent2@email.com" },
        { id: "ST001303", name: "CSV Student 3", grade: selectedGrade, room: selectedRoom || "Unknown", parentName: "Parent 3", email: "parent3@email.com" },
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
    // Reset tuition type if no tuition items left
    const remainingItems = selectedItems.filter(i => i.id !== itemId)
    if (!remainingItems.every(item => item.category === "Tuition")) {
      setTuitionType("")
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === "none") {
      setSelectedTemplate("")
      setSelectedItems([])
      setTuitionType("")
      return
    }

    const template = mockTemplates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      // Auto-fill items from template, but keep existing selected items that are not in the template
      const templateItems = template.items
        .map(itemId => mockPreCreatedItems.find(item => item.id === itemId))
        .filter(item => item !== undefined) as PreCreatedItem[]
      
      // Merge template items with existing selected items (avoid duplicates)
      const existingItems = selectedItems.filter(item => 
        !template.items.includes(item.id)
      )
      const allItems = [...templateItems, ...existingItems]
      
      setSelectedItems(allItems)
      toast.success(`Applied template: ${template.name}. You can still add more items.`)
    }
  }

  const handlePreviewInvoice = () => {
    if (selectedStudents.length === 0 || selectedItems.length === 0) {
      toast.error("Please select students and items")
      return
    }

    if (!paymentDeadline) {
      toast.error("Please set payment deadline")
      return
    }

    setIsPreviewMode(true)
    toast.success("Invoice preview ready")
  }

  const handleConfirmAndSendEmail = () => {
    setIsConfirmationOpen(true)
  }

  const handleFinalConfirmation = () => {
    const totalItems = selectedItems.reduce((sum, item) => sum + item.amount, 0)
    
    // Create invoice data for email sending
    const invoiceData = {
      invoiceNumber: `INV-${Date.now()}`,
      grade: selectedGrade,
      room: selectedRoom,
      students: selectedStudents,
      items: selectedItems,
      tuitionType: tuitionType,
      paymentDeadline: paymentDeadline,
      totalAmount: totalItems,
      totalInvoices: selectedStudents.length,
      grandTotal: totalItems * selectedStudents.length,
      createdAt: new Date().toISOString(),
      status: 'created'
    }
    
    toast.success(`Successfully created ${selectedStudents.length} invoices!`)
    
    // Navigate to email sending page with invoice data
    if (onNavigateToEmailSending) {
      onNavigateToEmailSending(invoiceData)
    }
    
    // Reset form
    setSelectedGrade("")
    setSelectedRoom("")
    setSelectedStudents([])
    setCsvStudents([])
    setCsvFile(null)
    setSelectedItems([])
    setAvailableItems([])
    setAvailableTemplates([])
    setSelectedTemplate("")
    setTuitionType("")
    setPaymentDeadline("")
    setIsPreviewMode(false)
    setIsConfirmationOpen(false)
  }

  const getTotalAmount = () => {
    return selectedItems.reduce((sum, item) => sum + item.amount, 0)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Invoice</CardTitle>
        </CardHeader>
        <CardContent>
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

            {/* Step 2: Select Room */}
            {selectedGrade && (
              <div className="space-y-3">
                <h3 className="font-medium">2. Select Room (Optional)</h3>
                <Select value={selectedRoom === "" ? "all" : selectedRoom} onValueChange={handleRoomChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose room or leave blank for all rooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rooms</SelectItem>
                    {rooms[selectedGrade as keyof typeof rooms]?.map(room => (
                      <SelectItem key={room} value={room}>{room}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Step 3: Select Items */}
            {selectedGrade && (
              <div className="space-y-4">
                <h3 className="font-medium">3. Select Items</h3>
                
                {/* Template Selection */}
                {availableTemplates.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bookmark className="w-4 h-4 text-primary" />
                        <label className="font-medium">Quick Start Templates</label>
                      </div>
                      {selectedTemplate && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleTemplateSelect("none")}
                        >
                          Clear Template
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {availableTemplates.map((template) => {
                        const isSelected = selectedTemplate === template.id
                        const totalAmount = template.items.reduce((sum, itemId) => {
                          const item = mockPreCreatedItems.find(i => i.id === itemId)
                          return sum + (item?.amount || 0)
                        }, 0)
                        
                        return (
                          <Card 
                            key={template.id} 
                            className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"}`}
                            onClick={() => handleTemplateSelect(isSelected ? "none" : template.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <Bookmark className="w-4 h-4 text-primary" />
                                  <h4 className="font-medium">{template.name}</h4>
                                </div>
                                {isSelected && (
                                  <CheckCircle className="w-5 h-5 text-primary" />
                                )}
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium">Items: {template.items.length}</span>
                                  <span className="font-medium">{formatCurrency(totalAmount)}</span>
                                </div>
                                
                                <div className="flex flex-wrap gap-1">
                                  {template.applicableGrades.slice(0, 2).map(grade => (
                                    <Badge key={grade} variant="secondary" className="text-xs">
                                      {grade}
                                    </Badge>
                                  ))}
                                  {template.applicableGrades.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{template.applicableGrades.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                    
                    {selectedTemplate && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-blue-700">
                              <span className="font-medium">Template applied:</span> {availableTemplates.find(t => t.id === selectedTemplate)?.name}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              {availableTemplates.find(t => t.id === selectedTemplate)?.description}
                            </p>
                            <p className="text-xs text-blue-600 mt-2 font-medium">
                              💡 You can still select additional items below
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-blue-700">
                              {formatCurrency(
                                availableTemplates.find(t => t.id === selectedTemplate)?.items.reduce((sum, itemId) => {
                                  const item = mockPreCreatedItems.find(i => i.id === itemId)
                                  return sum + (item?.amount || 0)
                                }, 0) || 0
                              )}
                            </p>
                            <p className="text-xs text-blue-600">{availableTemplates.find(t => t.id === selectedTemplate)?.items.length} template items</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tuition Type Selection (when any tuition items are selected) */}
                {hasTuitionSelected && (
                  <div className="space-y-3">
                    <label className="font-medium">Tuition Payment Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <Card 
                        className={`cursor-pointer transition-all ${tuitionType === "yearly" ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"}`}
                        onClick={() => setTuitionType("yearly")}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Yearly Payment</h4>
                              <p className="text-sm text-muted-foreground">Full year tuition payment</p>
                            </div>
                            {tuitionType === "yearly" && (
                              <CheckCircle className="w-5 h-5 text-primary" />
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card 
                        className={`cursor-pointer transition-all ${tuitionType === "termly" ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"}`}
                        onClick={() => setTuitionType("termly")}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Termly Payment</h4>
                              <p className="text-sm text-muted-foreground">Pay by term installments</p>
                            </div>
                            {tuitionType === "termly" && (
                              <CheckCircle className="w-5 h-5 text-primary" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {tuitionType && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-700">
                          <span className="font-medium">Note:</span> {tuitionType === "yearly" ? "Yearly" : "Termly"} payment selected. 
                          ECA and Trip & Other Activity categories are now disabled.
                        </p>
                        {!isOnlyTuitionSelected && (
                          <p className="text-sm text-yellow-600 mt-1">
                            💡 You have mixed item types. Consider using separate invoices for tuition and activities.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Category Navigation */}
                <div className="space-y-3">
                  <label className="font-medium">Item Categories</label>
                  <div className="grid grid-cols-3 gap-3">
                    {itemCategories.map((category) => {
                      const isDisabled = isCategoryDisabled(category.id)
                      return (
                        <Card 
                          key={category.id}
                          className={`cursor-pointer transition-all ${
                            isDisabled 
                              ? "opacity-50 cursor-not-allowed" 
                              : selectedCategory === category.id 
                                ? "ring-2 ring-primary bg-primary/5" 
                                : "hover:bg-muted/50"
                          }`}
                          onClick={() => !isDisabled && handleCategoryChange(category.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center text-center space-y-2">
                              <category.icon className={`w-6 h-6 ${
                                isDisabled 
                                  ? "text-muted-foreground/50" 
                                  : selectedCategory === category.id 
                                    ? "text-primary" 
                                    : "text-muted-foreground"
                              }`} />
                              <div>
                                <h4 className={`font-medium text-sm ${isDisabled ? "text-muted-foreground/50" : ""}`}>
                                  {category.label}
                                </h4>
                                <p className={`text-xs text-muted-foreground ${isDisabled ? "opacity-50" : ""}`}>
                                  {category.description}
                                </p>
                              </div>
                              {selectedCategory === category.id && !isDisabled && (
                                <CheckCircle className="w-4 h-4 text-primary" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                {/* Available Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-medium">Available {selectedCategory} Items for {selectedGrade}</label>
                    <span className="text-sm text-muted-foreground">{availableItems.length} items available</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {availableItems.map((item) => {
                      const isSelected = selectedItems.find(i => i.id === item.id)
                      const isFromTemplate = selectedTemplate && availableTemplates.find(t => t.id === selectedTemplate)?.items.includes(item.id)
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
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      item.category === "Tuition" ? "border-blue-300 text-blue-700" :
                                      item.category === "ECA" ? "border-green-300 text-green-700" :
                                      "border-orange-300 text-orange-700"
                                    }`}
                                  >
                                    {item.category}
                                  </Badge>
                                  {isFromTemplate && (
                                    <Badge variant="default" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                                      From Template
                                    </Badge>
                                  )}
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
                      <div>
                        <label className="font-medium">Selected Items ({selectedItems.length})</label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Total: {formatCurrency(getTotalAmount())}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedItems([])
                          setTuitionType("")
                        }}
                      >
                        Clear All Items
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
                          {selectedItems.map((item) => {
                            const isFromTemplate = selectedTemplate && availableTemplates.find(t => t.id === selectedTemplate)?.items.includes(item.id)
                            return (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-medium">{item.name}</p>
                                      {isFromTemplate && (
                                        <Badge variant="default" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                                          Template
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant="outline"
                                    className={`${
                                      item.category === "Tuition" ? "border-blue-300 text-blue-700" :
                                      item.category === "ECA" ? "border-green-300 text-green-700" :
                                      "border-orange-300 text-orange-700"
                                    }`}
                                  >
                                    {item.category}
                                  </Badge>
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
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {availableItems.length === 0 && (
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                    <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No {selectedCategory.toLowerCase()} items available for {selectedGrade}</p>
                    <p className="text-sm text-muted-foreground">Try selecting a different category or contact admin to add items</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Set Payment Deadline */}
            {selectedItems.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">4. Set Payment Deadline</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={paymentDeadline}
                    onChange={(e) => setPaymentDeadline(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
                {paymentDeadline && (
                  <p className="text-sm text-green-600">
                    Payment deadline set for {new Date(paymentDeadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {/* Step 5: Select Students */}
            {selectedItems.length > 0 && paymentDeadline && (
              <div className="space-y-4">
                <h3 className="font-medium">5. Select Students</h3>
                
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
                        Select entire {selectedRoom ? "room" : "grade"}
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
                                  <p className="text-sm text-muted-foreground">{student.id} - {student.room}</p>
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
                        Select all students in {selectedGrade} {selectedRoom && `- ${selectedRoom}`}
                      </p>
                      <p className="text-sm text-blue-600 mb-3">
                        {mockStudents.filter(s => 
                          s.grade === selectedGrade && 
                          (selectedRoom === "" || s.room === selectedRoom)
                        ).length} students will be selected
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
                            <span className="text-muted-foreground ml-2">({student.id} - {student.room})</span>
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

            {/* Step 6: Preview and Create Invoice */}
            {selectedStudents.length > 0 && selectedItems.length > 0 && paymentDeadline && (
              <div className="space-y-4">
                <h3 className="font-medium">6. {isPreviewMode ? "Confirm and Send" : "Preview Invoice"}</h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Invoice Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700">Grade: <span className="font-medium">{selectedGrade}</span></p>
                      {selectedRoom && (
                        <p className="text-blue-700">Room: <span className="font-medium">{selectedRoom}</span></p>
                      )}
                      <p className="text-blue-700">Students: <span className="font-medium">{selectedStudents.length}</span></p>
                      <p className="text-blue-700">Items per Invoice: <span className="font-medium">{selectedItems.length}</span></p>
                    </div>
                    <div>
                      <p className="text-blue-700">Amount per Student: <span className="font-medium">฿{getTotalAmount().toLocaleString()}</span></p>
                      <p className="text-blue-700">Total Amount: <span className="font-medium">฿{(getTotalAmount() * selectedStudents.length).toLocaleString()}</span></p>
                      <p className="text-blue-700">Payment Deadline: <span className="font-medium">{new Date(paymentDeadline).toLocaleDateString()}</span></p>
                      <p className="text-blue-700">Invoices to Create: <span className="font-medium">{selectedStudents.length}</span></p>
                    </div>
                  </div>
                  
                  {tuitionType && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-blue-700">Payment Type: <span className="font-medium capitalize">{tuitionType}</span></p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  {!isPreviewMode ? (
                    <Button 
                      onClick={handlePreviewInvoice}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Preview Invoice
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleConfirmAndSendEmail}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Confirm & Send Email
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Email Sending</DialogTitle>
            <DialogDescription>
              Are you sure you want to create and send {selectedStudents.length} invoices via email?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Students:</span> {selectedStudents.length}</p>
                <p><span className="font-medium">Amount per invoice:</span> ฿{getTotalAmount().toLocaleString()}</p>
                <p><span className="font-medium">Total amount:</span> ฿{(getTotalAmount() * selectedStudents.length).toLocaleString()}</p>
                <p><span className="font-medium">Payment deadline:</span> {new Date(paymentDeadline).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsConfirmationOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleFinalConfirmation}
                className="flex-1"
              >
                Send Invoices
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}