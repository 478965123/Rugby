import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Textarea } from "./ui/textarea"
import { CalendarIcon, Save, Plus, Trash2, Settings, Clock } from "lucide-react"
import { format } from "date-fns"

interface RegistrationPeriod {
  id: string
  name: string
  description: string
  openDate: Date | null
  closeDate: Date | null
  isActive: boolean
  maxRegistrationsPerStudent: number
  schoolLevels: string[] // ["NK", "Primary", "Secondary"]
}

const initialPeriods: RegistrationPeriod[] = [
  {
    id: "1",
    name: "Term 1 Registration 2025-2026",
    description: "ECA & EAS activities registration for Term 1 (August - December 2025)",
    openDate: new Date("2025-07-01"),
    closeDate: new Date("2025-07-31"),
    isActive: true,
    maxRegistrationsPerStudent: 3,
    schoolLevels: ["NK", "Primary", "Secondary"]
  },
  {
    id: "2",
    name: "Term 2 Registration 2025-2026",
    description: "ECA & EAS activities registration for Term 2 (January - March 2026)",
    openDate: new Date("2025-12-01"),
    closeDate: new Date("2025-12-31"),
    isActive: false,
    maxRegistrationsPerStudent: 3,
    schoolLevels: ["Primary", "Secondary"]
  }
]

interface AfterSchoolSettingsProps {
  onSaveComplete?: () => void
}

export function AfterSchoolSettings({ onSaveComplete }: AfterSchoolSettingsProps = {}) {
  const [periods, setPeriods] = useState<RegistrationPeriod[]>(initialPeriods)
  const [globalSettings, setGlobalSettings] = useState({
    autoCloseRegistration: true,
    sendConfirmationEmails: true,
    paymentDeadlineDays: 7,
    cancellationDeadlineDays: 3
  })

  const addPeriod = () => {
    const newPeriod: RegistrationPeriod = {
      id: Date.now().toString(),
      name: "New Registration Period",
      description: "",
      openDate: null,
      closeDate: null,
      isActive: false,
      maxRegistrationsPerStudent: 3,
      schoolLevels: []
    }
    setPeriods([...periods, newPeriod])
  }

  const updatePeriod = (id: string, field: keyof RegistrationPeriod, value: any) => {
    setPeriods(periods.map(period => 
      period.id === id ? { ...period, [field]: value } : period
    ))
  }

  const deletePeriod = (id: string) => {
    setPeriods(periods.filter(period => period.id !== id))
  }

  const saveSettings = () => {
    console.log("Saving settings", { periods, globalSettings })
    // In a real app, this would save to backend

    // Navigate to activity list after save
    if (onSaveComplete) {
      onSaveComplete()
    }
  }

  const getPeriodStatus = (period: RegistrationPeriod) => {
    const now = new Date()
    if (!period.openDate || !period.closeDate) return "incomplete"
    if (now < period.openDate) return "upcoming"
    if (now > period.closeDate) return "closed"
    return "active"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
      case "upcoming":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Upcoming</span>
      case "closed":
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Closed</span>
      case "incomplete":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Incomplete</span>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">ECA & EAS Registration Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure registration periods and global settings for ECA & EAS activities
          </p>
        </div>
        <Button onClick={addPeriod} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Period
        </Button>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Global Registration Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-close Registration</Label>
                  <p className="text-sm text-muted-foreground">Automatically close when deadline reached</p>
                </div>
                <Switch
                  checked={globalSettings.autoCloseRegistration}
                  onCheckedChange={(checked) => 
                    setGlobalSettings({...globalSettings, autoCloseRegistration: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Send Confirmation Emails</Label>
                  <p className="text-sm text-muted-foreground">Email parents upon successful registration</p>
                </div>
                <Switch
                  checked={globalSettings.sendConfirmationEmails}
                  onCheckedChange={(checked) =>
                    setGlobalSettings({...globalSettings, sendConfirmationEmails: checked})
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Deadline (Days)</Label>
                <Input
                  type="number"
                  value={globalSettings.paymentDeadlineDays}
                  onChange={(e) =>
                    setGlobalSettings({...globalSettings, paymentDeadlineDays: parseInt(e.target.value)})
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Days after registration to complete payment
                </p>
              </div>

              <div className="space-y-2">
                <Label>Cancellation Deadline (Days)</Label>
                <Input
                  type="number"
                  value={globalSettings.cancellationDeadlineDays}
                  onChange={(e) =>
                    setGlobalSettings({...globalSettings, cancellationDeadlineDays: parseInt(e.target.value)})
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Days before activity start to allow cancellation
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Periods */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Registration Periods</h3>
        
        {periods.map((period) => {
          const status = getPeriodStatus(period)
          
          return (
            <Card key={period.id}>
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 w-full">
                    <Input
                      value={period.name}
                      onChange={(e) => updatePeriod(period.id, "name", e.target.value)}
                      className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0 flex-1"
                    />
                    {getStatusBadge(status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={period.isActive}
                      onCheckedChange={(checked) => updatePeriod(period.id, "isActive", checked)}
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deletePeriod(period.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={period.description}
                    onChange={(e) => updatePeriod(period.id, "description", e.target.value)}
                    placeholder="Enter period description"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Registration Opens</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {period.openDate ? format(period.openDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={period.openDate || undefined}
                          onSelect={(date) => updatePeriod(period.id, "openDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Registration Closes</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {period.closeDate ? format(period.closeDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={period.closeDate || undefined}
                          onSelect={(date) => updatePeriod(period.id, "closeDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Max Activities per Student</Label>
                  <Input
                    type="number"
                    value={period.maxRegistrationsPerStudent}
                    onChange={(e) => updatePeriod(period.id, "maxRegistrationsPerStudent", parseInt(e.target.value))}
                    min="1"
                    max="10"
                  />
                </div>

                <div className="space-y-2">
                  <Label>School Levels</Label>
                  <p className="text-sm text-muted-foreground mb-2">Select which school levels can register for this period</p>
                  <div className="grid grid-cols-3 gap-4">
                    {["NK", "Primary", "Secondary"].map((level) => (
                      <div key={level} className="flex items-center justify-between p-3 border rounded-lg">
                        <Label htmlFor={`${period.id}-${level}`} className="cursor-pointer">
                          {level}
                        </Label>
                        <Switch
                          id={`${period.id}-${level}`}
                          checked={period.schoolLevels.includes(level)}
                          onCheckedChange={(checked) => {
                            const newLevels = checked
                              ? [...period.schoolLevels, level]
                              : period.schoolLevels.filter(l => l !== level)
                            updatePeriod(period.id, "schoolLevels", newLevels)
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Period Summary */}
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Period Summary
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Status:</span>{" "}
                      <span className={
                        status === "active" ? "text-green-600" :
                        status === "upcoming" ? "text-blue-600" :
                        status === "closed" ? "text-gray-600" : "text-red-600"
                      }>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span>{" "}
                      {period.openDate && period.closeDate
                        ? `${Math.ceil((period.closeDate.getTime() - period.openDate.getTime()) / (1000 * 60 * 60 * 24))} days`
                        : "Not set"
                      }
                    </div>
                    <div>
                      <span className="text-muted-foreground">School Levels:</span>{" "}
                      <span className={period.schoolLevels.length > 0 ? "text-green-600" : "text-red-600"}>
                        {period.schoolLevels.length > 0 ? period.schoolLevels.join(", ") : "None selected"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} size="lg" className="px-8">
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  )
}