import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { Users, Coins, Calendar as CalendarIcon, CreditCard, Filter, RotateCcw, GraduationCap, UserX, AlertCircle, DollarSign } from "lucide-react"
import { format, subDays, startOfYear, endOfYear } from "date-fns"

const weeklyPaymentData = [
  { week: "Week 1", amount: 1250000 },
  { week: "Week 2", amount: 1480000 },
  { week: "Week 3", amount: 980000 },
  { week: "Week 4", amount: 1650000 },
  { week: "Week 5", amount: 1320000 },
  { week: "Week 6", amount: 1580000 },
  { week: "Week 7", amount: 1420000 },
  { week: "Week 8", amount: 1750000 }
]

const getPaymentChannelData = (t: (key: string) => string) => [
  { name: t('dashboard.creditCard'), value: 45, color: "#8884d8" },
  { name: t('dashboard.promptPay'), value: 30, color: "#82ca9d" },
  { name: t('dashboard.bankCounter'), value: 15, color: "#ffc658" },
  { name: t('dashboard.wechatPay'), value: 7, color: "#ff7300" },
  { name: t('dashboard.alipay'), value: 3, color: "#00ff88" }
]

const top10GradeDebtData = [
  { grade: "Grade 12", unpaid: 85, paid: 120 },
  { grade: "Grade 11", unpaid: 78, paid: 115 },
  { grade: "Grade 10", unpaid: 72, paid: 110 },
  { grade: "Grade 9", unpaid: 68, paid: 105 },
  { grade: "Grade 8", unpaid: 65, paid: 100 },
  { grade: "Grade 7", unpaid: 58, paid: 95 },
  { grade: "Grade 6", unpaid: 52, paid: 90 },
  { grade: "Grade 5", unpaid: 48, paid: 85 },
  { grade: "Grade 4", unpaid: 42, paid: 80 },
  { grade: "Grade 3", unpaid: 38, paid: 75 }
]

// Generate academic years (current year - 5 to current year + 1)
const generateAcademicYears = () => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear - 5; i <= currentYear + 1; i++) {
    years.push({
      value: `${i}-${i + 1}`,
      label: `${i}/${i + 1}`
    })
  }
  return years.reverse()
}

interface DateRange {
  from?: Date
  to?: Date
}

export function TuitionDashboard() {
  const { t } = useTranslation()
  // Filter states
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedTerm, setSelectedTerm] = useState<string>("")
  const [dateRange, setDateRange] = useState<DateRange>({})
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const academicYears = generateAcademicYears()
  const currentYear = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
  const paymentChannelData = getPaymentChannelData(t)

  // Filter functions
  const handleYearChange = (year: string) => {
    setSelectedYear(year)
  }

  const handleTermChange = (term: string) => {
    setSelectedTerm(term)
  }

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range || {})
  }

  const resetFilters = () => {
    setSelectedYear("")
    setSelectedTerm("")
    setDateRange({})
  }

  const applyFilters = () => {
    // In a real application, this would trigger data fetching with the applied filters
    console.log("Applied filters:", {
      year: selectedYear,
      term: selectedTerm,
      dateRange
    })
    setIsDatePickerOpen(false)
  }

  // Get filtered data display text
  const getFilteredDisplay = () => {
    if (!selectedYear && !selectedTerm && !dateRange.from) {
      return t('dashboard.allData')
    }
    
    let display = "Filtered: "
    const filters = []
    
    if (selectedYear) {
      filters.push(academicYears.find(y => y.value === selectedYear)?.label || selectedYear)
    }
    
    if (selectedTerm) {
      const termDisplay = selectedTerm === "term1" ? "Term 1" : selectedTerm === "term2" ? "Term 2" : "Term 3"
      filters.push(termDisplay)
    }
    
    if (dateRange.from) {
      if (dateRange.to) {
        filters.push(`${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`)
      } else {
        filters.push(`From ${format(dateRange.from, "MMM dd")}`)
      }
    }
    
    return display + filters.join(", ")
  }

  return (
    <div className="space-y-6">
      {/* Simple Term Filter */}
      <div className="flex justify-end">
        <div className="w-64">
          <Select value={selectedTerm} onValueChange={handleTermChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder={t('dashboard.selectTerm')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('dashboard.allTerms')}</SelectItem>
              <SelectItem value="term1">Term 1</SelectItem>
              <SelectItem value="term2">Term 2</SelectItem>
              <SelectItem value="term3">Term 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.studentsPaid')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              {selectedTerm && selectedTerm !== "all" ? `${selectedTerm === "term1" ? "Term 1" : selectedTerm === "term2" ? "Term 2" : "Term 3"}` : `+12% ${t('dashboard.fromLastMonth')}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.studentsUnpaid')}</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">438</div>
            <p className="text-xs text-muted-foreground">
              {selectedTerm && selectedTerm !== "all" ? `${selectedTerm === "term1" ? "Term 1" : selectedTerm === "term2" ? "Term 2" : "Term 3"}` : `-5% ${t('dashboard.fromLastMonth')}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalRevenue')}</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿7,350,000</div>
            <p className="text-xs text-muted-foreground">
              {selectedTerm && selectedTerm !== "all" ? `${selectedTerm === "term1" ? "Term 1" : selectedTerm === "term2" ? "Term 2" : "Term 3"}` : `+8% ${t('dashboard.fromLastTerm')}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.overduePayments')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">125</div>
            <p className="text-xs text-muted-foreground">
              {selectedTerm && selectedTerm !== "all" ? `${selectedTerm === "term1" ? "Term 1" : selectedTerm === "term2" ? "Term 2" : "Term 3"}` : `${t('dashboard.studentsOverdue')}`}
            </p>
            <p className="text-xs text-red-500 mt-1">
              ฿1,575,000 {t('dashboard.totalOverdue')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.outstandingBalance')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">฿3,280,000</div>
            <p className="text-xs text-muted-foreground">
              {selectedTerm && selectedTerm !== "all" ? `${selectedTerm === "term1" ? "Term 1" : selectedTerm === "term2" ? "Term 2" : "Term 3"}` : `${t('dashboard.totalOutstanding')}`}
            </p>
            <p className="text-xs text-orange-500 mt-1">
              {t('dashboard.fromStudents', { count: 438 })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Payment Trend */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.weeklyPaymentTrend')}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedTerm && selectedTerm !== "all" ? `${selectedTerm === "term1" ? "Term 1" : selectedTerm === "term2" ? "Term 2" : "Term 3"}` : t('dashboard.last8Weeks')}
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyPaymentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip formatter={(value) => [`฿${Number(value).toLocaleString()}`, t('dashboard.amount')]} />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} dot={{ fill: "#8884d8", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Channels */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.paymentChannels')}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedTerm && selectedTerm !== "all" ? `${selectedTerm === "term1" ? "Term 1" : selectedTerm === "term2" ? "Term 2" : "Term 3"}` : t('dashboard.allData')}
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentChannelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentChannelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top 10 Grades by Debt */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.top10GradesByDebt')}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {selectedTerm && selectedTerm !== "all" ? `${selectedTerm === "term1" ? "Term 1" : selectedTerm === "term2" ? "Term 2" : "Term 3"}` : t('dashboard.allData')}
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={top10GradeDebtData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="grade" type="category" width={80} />
              <Tooltip formatter={(value) => [`${value} ${t('dashboard.students')}`, ""]} />
              <Bar dataKey="unpaid" stackId="a" fill="#ef4444" name={t('dashboard.unpaid')} />
              <Bar dataKey="paid" stackId="a" fill="#22c55e" name={t('dashboard.paid')} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.recentPaymentActivity')}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {selectedTerm && selectedTerm !== "all" ? `${selectedTerm === "term1" ? "Term 1" : selectedTerm === "term2" ? "Term 2" : "Term 3"}` : t('dashboard.allData')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { student: "John Smith", grade: "Grade 10", amount: "฿125,000", time: "2 hours ago" },
              { student: "Sarah Wilson", grade: "Grade 8", amount: "฿42,000", time: "4 hours ago" },
              { student: "Mike Johnson", grade: "Grade 11", amount: "฿125,000", time: "6 hours ago" },
              { student: "Lisa Chen", grade: "Grade 9", amount: "฿42,000", time: "8 hours ago" },
              { student: "David Brown", grade: "Grade 12", amount: "฿125,000", time: "1 day ago" }
            ].map((payment, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{payment.student}</p>
                  <p className="text-sm text-muted-foreground">{payment.grade}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{payment.amount}</p>
                  <p className="text-sm text-muted-foreground">{payment.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}