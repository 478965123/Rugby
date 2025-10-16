import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Switch } from "./ui/switch"
import { Progress } from "./ui/progress"
import { Save, Bell, Plus, Trash2, Mail, Send } from "lucide-react"

interface ReminderConfig {
  id: string
  name: string
  daysBefore: number
  method: "email" | "sms" | "both"
  enabled: boolean
  subject: string
  message: string
}

const initialReminders: ReminderConfig[] = [
  {
    id: "1",
    name: "First Reminder",
    daysBefore: 30,
    method: "email",
    enabled: true,
    subject: "Tuition Payment Reminder - 30 Days",
    message: "Dear Parent, This is a friendly reminder that your child's tuition payment is due in 30 days. Please make your payment to avoid any late fees."
  },
  {
    id: "2",
    name: "Second Reminder", 
    daysBefore: 14,
    method: "both",
    enabled: true,
    subject: "Urgent: Tuition Payment Due in 14 Days",
    message: "Dear Parent, Your child's tuition payment is due in 14 days. Please complete your payment as soon as possible to ensure continuous enrollment."
  },
  {
    id: "3",
    name: "Final Notice",
    daysBefore: 7,
    method: "both",
    enabled: true,
    subject: "FINAL NOTICE: Tuition Payment Due in 7 Days",
    message: "Dear Parent, This is a final notice that your child's tuition payment is due in 7 days. Please contact our office immediately if you need assistance with payment arrangements."
  }
]

export function DebtReminderSettings() {
  const [reminders, setReminders] = useState<ReminderConfig[]>(initialReminders)
  const [globalSettings, setGlobalSettings] = useState({
    enableReminders: true,
    fromEmail: "noreply@sisb.ac.th",
    smsEnabled: false
  })

  // Daily sending limit tracking
  const dailyLimit = 10000
  const messagesSentToday = 3247 // Mock data - in real app, this would come from backend
  const remainingMessages = dailyLimit - messagesSentToday
  const usagePercentage = (messagesSentToday / dailyLimit) * 100

  const addReminder = () => {
    const newReminder: ReminderConfig = {
      id: Date.now().toString(),
      name: "New Reminder",
      daysBefore: 7,
      method: "email",
      enabled: true,
      subject: "Tuition Payment Reminder",
      message: "Dear Parent,\n\nThis is a reminder that your child's tuition payment is due. Please make your payment to avoid any late fees.\n\nThank you."
    }
    setReminders([...reminders, newReminder])
  }

  const updateReminder = (id: string, field: keyof ReminderConfig, value: any) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, [field]: value } : reminder
    ))
  }

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id))
  }

  const saveSettings = () => {
    console.log("Saving reminder settings", { reminders, globalSettings })
    // In a real app, this would save to backend
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Debt Reminder Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure up to 3 reminder periods for unpaid tuition
          </p>
        </div>
        <Button onClick={addReminder} disabled={reminders.length >= 3} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Reminder
        </Button>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Global Reminder Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Automatic Reminders</Label>
              <p className="text-sm text-muted-foreground">Turn on/off all reminder notifications</p>
            </div>
            <Switch
              checked={globalSettings.enableReminders}
              onCheckedChange={(checked) => 
                setGlobalSettings({...globalSettings, enableReminders: checked})
              }
            />
          </div>

          <div className="space-y-2">
            <Label>From Email Address</Label>
            <Input
              value={globalSettings.fromEmail}
              onChange={(e) =>
                setGlobalSettings({...globalSettings, fromEmail: e.target.value})
              }
              placeholder="noreply@example.com"
            />
          </div>

          {/* Daily Sending Limit */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-muted-foreground" />
                <Label>Daily Sending Limit</Label>
              </div>
              <div className="text-sm font-medium">
                {messagesSentToday.toLocaleString()} / {dailyLimit.toLocaleString()} messages
              </div>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{remainingMessages.toLocaleString()} messages remaining today</span>
              <span>{usagePercentage.toFixed(1)}% used</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reminder Configurations */}
      <div className="space-y-4">
        {reminders.map((reminder, index) => (
          <Card key={reminder.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <Input
                    value={reminder.name}
                    onChange={(e) => updateReminder(reminder.id, "name", e.target.value)}
                    className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={reminder.enabled}
                    onCheckedChange={(checked) => updateReminder(reminder.id, "enabled", checked)}
                  />
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => deleteReminder(reminder.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Days Before Due Date</Label>
                <Input
                  type="number"
                  value={reminder.daysBefore}
                  onChange={(e) => updateReminder(reminder.id, "daysBefore", parseInt(e.target.value))}
                  min="1"
                  max="365"
                />
              </div>

              <div className="space-y-2">
                <Label>Email Subject</Label>
                <Input
                  value={reminder.subject}
                  onChange={(e) => updateReminder(reminder.id, "subject", e.target.value)}
                  placeholder="Enter email subject line"
                />
              </div>

              <div className="space-y-2">
                <Label>Message Template</Label>
                <Textarea
                  value={reminder.message}
                  onChange={(e) => updateReminder(reminder.id, "message", e.target.value)}
                  placeholder="Enter reminder message template"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Available variables: {"{parent_name}"}, {"{student_name}"}, {"{amount}"}, {"{due_date}"}, {"{days_remaining}"}
                </p>
              </div>

              {/* Preview */}
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Reminder Preview</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Timing:</strong> {reminder.daysBefore} days before payment due date</p>
                    <p><strong>Status:</strong>
                      <span className={reminder.enabled ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
                        {reminder.enabled ? "Active" : "Disabled"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Email Preview with Sample Data */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 border-b px-4 py-2">
                    <h4 className="font-medium text-sm">Email Preview (Sample Data)</h4>
                  </div>
                  <div className="p-4 bg-white">
                    {/* Email Header */}
                    <div className="mb-4 pb-3 border-b space-y-1">
                      <div className="text-xs text-muted-foreground">
                        <strong>From:</strong> {globalSettings.fromEmail}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <strong>To:</strong> parent.example@email.com
                      </div>
                      <div className="text-sm">
                        <strong>Subject:</strong> {reminder.subject}
                      </div>
                    </div>

                    {/* Email Body */}
                    <div className="space-y-3">
                      <div className="text-sm whitespace-pre-wrap">
                        {reminder.message
                          .replace(/{parent_name}/g, "Mr. John Smith")
                          .replace(/{student_name}/g, "Emma Smith")
                          .replace(/{amount}/g, "฿45,000")
                          .replace(/{due_date}/g, "November 15, 2025")
                          .replace(/{days_remaining}/g, reminder.daysBefore.toString())}
                      </div>

                      {/* Sample Footer */}
                      <div className="pt-3 mt-3 border-t text-xs text-muted-foreground">
                        <p>Best regards,</p>
                        <p>SISB Accounting Department</p>
                        <p className="mt-2">This is an automated message. Please do not reply to this email.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} size="lg" className="px-8">
          <Save className="w-4 h-4 mr-2" />
          Save All Reminder Settings
        </Button>
      </div>
    </div>
  )
}