import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Label } from "./ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import {
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  username: string
  role: "admin" | "viewer"
  status: "active" | "inactive"
  createdAt: Date
  lastLogin?: Date
}

interface StudentParent {
  id: string
  studentId: string
  studentName: string
  studentGrade: string
  parentName: string
  parentEmail: string
  parentPhone: string
  relationship: "Father" | "Mother" | "Guardian"
  syncedAt: Date
  navId: string
}

const mockUsers: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@rugby.ac.th",
    phone: "+66 81 234 5678",
    username: "john.smith",
    role: "admin",
    status: "active",
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date("2025-10-14T09:30:00")
  },
  {
    id: "2",
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@rugby.ac.th",
    phone: "+66 85 678 9012",
    username: "david.wilson",
    role: "viewer",
    status: "inactive",
    createdAt: new Date("2024-05-12"),
    lastLogin: new Date("2025-09-20T10:30:00")
  }
]

const mockStudents: StudentParent[] = [
  {
    id: "1",
    studentId: "ST000001",
    studentName: "Emma Johnson",
    studentGrade: "Year 5",
    parentName: "Mrs. Sarah Johnson",
    parentEmail: "sarah.johnson@example.com",
    parentPhone: "+66 81 234 5678",
    relationship: "Mother",
    syncedAt: new Date("2025-11-20T14:30:00"),
    navId: "NAV-P-00001"
  },
  {
    id: "2",
    studentId: "ST000002",
    studentName: "Lucas Williams",
    studentGrade: "Year 3",
    parentName: "Mr. David Williams",
    parentEmail: "david.williams@example.com",
    parentPhone: "+66 85 678 9012",
    relationship: "Father",
    syncedAt: new Date("2025-11-20T14:30:00"),
    navId: "NAV-P-00002"
  },
  {
    id: "3",
    studentId: "ST000003",
    studentName: "Sophia Brown",
    studentGrade: "Year 7",
    parentName: "Mrs. Emily Brown",
    parentEmail: "emily.brown@example.com",
    parentPhone: "+66 82 345 6789",
    relationship: "Mother",
    syncedAt: new Date("2025-11-20T14:30:00"),
    navId: "NAV-P-00003"
  },
  {
    id: "4",
    studentId: "ST000004",
    studentName: "James Miller",
    studentGrade: "Year 10",
    parentName: "Mr. Michael Miller",
    parentEmail: "michael.miller@example.com",
    parentPhone: "+66 89 012 3456",
    relationship: "Father",
    syncedAt: new Date("2025-11-20T14:30:00"),
    navId: "NAV-P-00004"
  },
  {
    id: "5",
    studentId: "ST000005",
    studentName: "Olivia Davis",
    studentGrade: "Year 2",
    parentName: "Mrs. Lisa Davis",
    parentEmail: "lisa.davis@example.com",
    parentPhone: "+66 86 789 0123",
    relationship: "Mother",
    syncedAt: new Date("2025-11-20T14:30:00"),
    navId: "NAV-P-00005"
  }
]

const roleLabels = {
  admin: "Administrator",
  viewer: "Viewer"
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Students tab states
  const [students, setStudents] = useState<StudentParent[]>(mockStudents)
  const [filteredStudents, setFilteredStudents] = useState<StudentParent[]>(mockStudents)
  const [studentSearchTerm, setStudentSearchTerm] = useState("")
  const [lastSyncDate, setLastSyncDate] = useState<Date>(new Date("2025-11-20T14:30:00"))
  const [activeTab, setActiveTab] = useState("users")

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    role: "viewer" as User["role"],
    status: "active" as User["status"]
  })

  const applyFilters = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setRoleFilter("all")
    setStatusFilter("all")
    setFilteredUsers(users)
  }

  // Student filter functions
  const applyStudentFilters = () => {
    let filtered = students

    if (studentSearchTerm) {
      filtered = filtered.filter(student =>
        student.studentName.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        student.parentName.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        student.parentEmail.toLowerCase().includes(studentSearchTerm.toLowerCase())
      )
    }

    setFilteredStudents(filtered)
  }

  const clearStudentFilters = () => {
    setStudentSearchTerm("")
    setFilteredStudents(students)
  }

  const handleSyncFromNAV = () => {
    toast.info("Syncing student data from Dynamic NAV...")
    // Simulate sync
    setTimeout(() => {
      setLastSyncDate(new Date())
      toast.success("Student data synced successfully!")
    }, 1500)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800">Administrator</Badge>
      case "viewer":
        return <Badge className="bg-gray-100 text-gray-800">Viewer</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Active</Badge>
    }
    return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="w-3 h-3" />Inactive</Badge>
  }

  const openCreateModal = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      role: "viewer",
      status: "active"
    })
    setIsCreateModalOpen(true)
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      username: user.username,
      password: "",
      role: user.role,
      status: user.status
    })
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (user: User) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleCreateUser = () => {
    const newUser: User = {
      id: String(users.length + 1),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      username: formData.username,
      role: formData.role,
      status: formData.status,
      createdAt: new Date()
    }

    // In a real app, password would be hashed and sent to backend
    console.log("Creating user with password:", formData.password)

    setUsers([...users, newUser])
    setFilteredUsers([...users, newUser])
    setIsCreateModalOpen(false)
    toast.success(`User ${formData.firstName} ${formData.lastName} created successfully`)
  }

  const handleUpdateUser = () => {
    if (!selectedUser) return

    const updatedUsers = users.map(user =>
      user.id === selectedUser.id
        ? {
            ...user,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            username: formData.username,
            role: formData.role,
            status: formData.status
          }
        : user
    )

    // In a real app, password would be hashed and sent to backend if changed
    if (formData.password) {
      console.log("Updating password for user:", formData.username)
    }

    setUsers(updatedUsers)
    setFilteredUsers(updatedUsers)
    setIsEditModalOpen(false)
    toast.success(`User ${formData.firstName} ${formData.lastName} updated successfully`)
  }

  const handleDeleteUser = () => {
    if (!selectedUser) return

    const updatedUsers = users.filter(user => user.id !== selectedUser.id)
    setUsers(updatedUsers)
    setFilteredUsers(updatedUsers)
    setIsDeleteModalOpen(false)
    toast.success(`User ${selectedUser.firstName} ${selectedUser.lastName} deleted successfully`)
  }

  const summaryStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === "active").length,
    admins: users.filter(u => u.role === "admin").length,
    viewers: users.filter(u => u.role === "viewer").length
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add New User
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="students">Students (นักเรียน)</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {summaryStats.activeUsers} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.admins}</div>
            <p className="text-xs text-muted-foreground">Full access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Viewers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.viewers}</div>
            <p className="text-xs text-muted-foreground">Read-only access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((summaryStats.activeUsers / summaryStats.totalUsers) * 100)}% of total
            </p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={clearFilters}>Clear All</Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.firstName} {user.lastName}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {user.phone}
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.lastLogin ? (
                        <>
                          <div>{user.lastLogin.toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {user.lastLogin.toLocaleTimeString()}
                          </div>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {user.createdAt.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditModal(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openDeleteModal(user)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create User Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Add New User
            </DialogTitle>
            <DialogDescription>
              Create a new user account with role
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Smith"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john.smith@rugby.ac.th"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+66 81 234 5678"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit User
            </DialogTitle>
            <DialogDescription>
              Update user information and role
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">First Name</Label>
                <Input
                  id="edit-firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input
                  id="edit-lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">Password</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave blank to keep current"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Delete User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="py-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="font-medium">
                  {selectedUser.firstName} {selectedUser.lastName}
                </div>
                <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                <div className="text-sm">{getRoleBadge(selectedUser.role)}</div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          {/* Last Sync Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Last synced from Dynamic NAV</p>
                    <p className="text-lg font-semibold">{format(lastSyncDate, "PPpp")}</p>
                  </div>
                </div>
                <Button onClick={handleSyncFromNAV} className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Sync from NAV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search & Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Student name, student ID, parent name, or email"
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={applyStudentFilters}>Apply Filters</Button>
                <Button variant="outline" onClick={clearStudentFilters}>Clear All</Button>
              </div>
            </CardContent>
          </Card>

          {/* Students Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Parent Name</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>NAV ID</TableHead>
                    <TableHead>Synced At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-sm">{student.studentId}</TableCell>
                      <TableCell>
                        <div className="font-medium">{student.studentName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{student.studentGrade}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{student.parentName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.relationship}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            {student.parentEmail}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            {student.parentPhone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{student.navId}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(student.syncedAt, "MMM dd, yyyy HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredStudents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No students found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
