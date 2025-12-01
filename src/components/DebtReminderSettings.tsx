import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Switch } from "./ui/switch"
import { Progress } from "./ui/progress"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Save, Bell, Plus, Trash2, Mail, Send, CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface ReminderConfig {
  id: string
  name: string
  reminderDate: Date | null
  method: "email" | "sms" | "both"
  enabled: boolean
  subject: string
  message: string
}

const initialReminders: ReminderConfig[] = [
  {
    id: "1",
    name: "First Reminder",
    reminderDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    method: "email",
    enabled: true,
    subject: "Tuition Payment Reminder - 30 Days",
    message: "<p>Dear Parent,</p><p>This is a friendly reminder that your child's tuition payment is due in 30 days. Please make your payment to avoid any late fees.</p>"
  },
  {
    id: "2",
    name: "Second Reminder",
    reminderDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    method: "both",
    enabled: true,
    subject: "Urgent: Tuition Payment Due in 14 Days",
    message: "<p>Dear Parent,</p><p>Your child's tuition payment is due in 14 days. Please complete your payment as soon as possible to ensure continuous enrollment.</p>"
  },
  {
    id: "3",
    name: "Overdue Notice",
    reminderDate: null,
    method: "both",
    enabled: true,
    subject: "OVERDUE: Tuition Payment Past Due",
    message: "<p>Dear Parent,</p><p>Your child's tuition payment is now overdue. Please contact our office immediately to arrange payment.</p>"
  }
]

type FormatCommand = "bold" | "italic" | "underline"

interface SimpleRichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const toolbarActions: { label: string; command: FormatCommand; className: string; ariaLabel: string }[] = [
  { label: "B", command: "bold", className: "font-semibold", ariaLabel: "Bold" },
  { label: "I", command: "italic", className: "italic", ariaLabel: "Italic" },
  { label: "U", command: "underline", className: "underline", ariaLabel: "Underline" }
]

const isHtmlEmpty = (html: string) => {
  if (!html) return true
  const stripped = html
    .replace(/<br\s*\/?>/gi, "")
    .replace(/&nbsp;/gi, "")
    .replace(/<div>\s*<\/div>/gi, "")
    .replace(/<p>\s*<\/p>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim()
  return stripped.length === 0
}

function SimpleRichTextEditor({ value, onChange, placeholder }: SimpleRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const content = value || ""

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    if (editor.innerHTML !== content) {
      editor.innerHTML = content
    }
  }, [content])

  const handleInput = () => {
    const editor = editorRef.current
    if (!editor) return
    onChange(editor.innerHTML)
  }

  const applyFormatting = (command: FormatCommand) => {
    const editor = editorRef.current
    if (!editor) return
    editor.focus()
    document.execCommand(command, false)
    handleInput()
  }

  const showPlaceholder = isHtmlEmpty(content)

  return (
    <div className="space-y-2">
      <div className="inline-flex rounded-md border bg-muted/30 p-1">
        {toolbarActions.map(action => (
          <button
            key={action.command}
            type="button"
            onClick={() => applyFormatting(action.command)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium text-foreground hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={action.ariaLabel}
          >
            <span className={action.className}>{action.label}</span>
          </button>
        ))}
      </div>
      <div className="relative">
        {showPlaceholder && (
          <span className="pointer-events-none absolute left-3 top-3 text-sm text-muted-foreground">
            {placeholder}
          </span>
        )}
        <div
          ref={editorRef}
          className="min-h-[120px] w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
        />
      </div>
    </div>
  )
}

export function DebtReminderSettings() {
  const [reminders, setReminders] = useState<ReminderConfig[]>(initialReminders)
  const [globalSettings, setGlobalSettings] = useState({
    enableReminders: true,
    fromEmail: "noreply@rugby.ac.th",
    smsEnabled: false
  })

  // Daily sending limit tracking
  const dailyLimit = 500
  const messagesSentToday = 235 // Mock data - in real app, this would come from backend
  const remainingMessages = dailyLimit - messagesSentToday
  const usagePercentage = (messagesSentToday / dailyLimit) * 100

  const addReminder = () => {
    const newReminder: ReminderConfig = {
      id: Date.now().toString(),
      name: "New Reminder",
      reminderDate: null,
      method: "email",
      enabled: true,
      subject: "Tuition Payment Reminder",
      message: "<p>Dear Parent,</p><p>This is a reminder that your child's tuition payment is due. Please make your payment to avoid any late fees.</p><p>Thank you.</p>"
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

  const getPreviewHtml = (template: string, reminder: ReminderConfig) => {
    const base = template || ""
    const reminderDateText = reminder.reminderDate ? format(reminder.reminderDate, "dd MMMM yyyy") : "Not set"

    return base
      .replace(/{parent_name}/g, "Mr. John Smith")
      .replace(/{student_name}/g, "Emma Smith")
      .replace(/{amount}/g, "฿45,000")
      .replace(/{due_date}/g, "November 15, 2025")
      .replace(/{reminder_date}/g, reminderDateText)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Debt Reminder Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure up to 10 reminder periods for unpaid tuition
          </p>
        </div>
        <Button onClick={addReminder} disabled={reminders.length >= 10} className="flex items-center gap-2">
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
        {reminders.map((reminder, index) => {
          const previewHtml = getPreviewHtml(reminder.message, reminder) || "<p>No message template defined.</p>"
          return (
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
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Reminder Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !reminder.reminderDate && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {reminder.reminderDate ? format(reminder.reminderDate, "dd/MM/yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={reminder.reminderDate || undefined}
                      onSelect={(date) => updateReminder(reminder.id, "reminderDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Email Subject</Label>
                <Input
                  value={reminder.subject}
                  onChange={(e) => updateReminder(reminder.id, "subject", e.target.value)}
                  placeholder="Enter email subject line"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Message Template</Label>
                <SimpleRichTextEditor
                  value={reminder.message}
                  onChange={(content) => updateReminder(reminder.id, "message", content)}
                  placeholder="Enter reminder message template"
                />
                <p className="text-xs text-muted-foreground">
                  Available variables: {"{parent_name}"}, {"{student_name}"}, {"{amount}"}, {"{due_date}"}, {"{reminder_date}"}
                </p>
              </div>

              {/* Preview */}
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Reminder Preview</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Reminder Date:</strong> {reminder.reminderDate ? format(reminder.reminderDate, "dd MMMM yyyy") : "Not set"}</p>
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
                    <div className="space-y-3 text-sm">
                      <div
                        className="text-sm leading-relaxed space-y-2"
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                      />

                      {/* Sample Footer */}
                      <div className="pt-3 mt-3 border-t text-xs text-muted-foreground">
                        <p>Best regards,</p>
                        <p>Rugby Accounting Department</p>
                        <p className="mt-2">This is an automated message. Please do not reply to this email.</p>
                      </div>
                    </div>
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
          Save All Reminder Settings
        </Button>
      </div>
    </div>
  )
}
