import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { CalendarIcon, Save, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { useTranslation } from 'react-i18next'

interface Term {
  id: string
  name: string
  billingStartDate: Date | null
  startDate: Date | null
  endDate: Date | null
}

export function TuitionTermSettings() {
  const { t } = useTranslation()

  const getInitialTerms = (): Term[] => {
    const savedTerms = localStorage.getItem('tuitionTerms')
    if (savedTerms) {
      const parsed = JSON.parse(savedTerms)
      // Convert date strings back to Date objects
      return parsed.map((term: any) => ({
        ...term,
        billingStartDate: term.billingStartDate ? new Date(term.billingStartDate) : null,
        startDate: term.startDate ? new Date(term.startDate) : null,
        endDate: term.endDate ? new Date(term.endDate) : null
      }))
    }
    // Default terms if no saved data
    return [
      {
        id: "1",
        name: t('termSettings.term1'),
        billingStartDate: new Date("2025-07-15"),
        startDate: new Date("2025-08-15"),
        endDate: new Date("2025-12-20")
      },
      {
        id: "2",
        name: t('termSettings.term2'),
        billingStartDate: new Date("2025-12-01"),
        startDate: new Date("2026-01-08"),
        endDate: new Date("2026-03-20")
      },
      {
        id: "3",
        name: t('termSettings.term3'),
        billingStartDate: new Date("2026-03-01"),
        startDate: new Date("2026-04-01"),
        endDate: new Date("2026-06-15")
      }
    ]
  }

  const [terms, setTerms] = useState<Term[]>(getInitialTerms)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const addNewTerm = () => {
    const newTerm: Term = {
      id: Date.now().toString(),
      name: "New Term",
      billingStartDate: null,
      startDate: null,
      endDate: null
    }
    setTerms([...terms, newTerm])
  }

  const updateTerm = (id: string, field: keyof Term, value: any) => {
    setTerms(terms.map(term => 
      term.id === id ? { ...term, [field]: value } : term
    ))
  }

  const deleteTerm = (id: string) => {
    setTerms(terms.filter(term => term.id !== id))
  }

  const saveTerm = (id: string) => {
    // Save to localStorage
    localStorage.setItem('tuitionTerms', JSON.stringify(terms))
    // In a real app, this would save to backend
    console.log("Saving term", id)
    setShowSuccessModal(true)
  }

  const saveAllChanges = () => {
    // Save to localStorage
    localStorage.setItem('tuitionTerms', JSON.stringify(terms))
    // In a real app, this would also save all terms to backend
    console.log("Saving all changes", terms)
    setShowSuccessModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{t('termSettings.title')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('termSettings.description')} 2025-2026
          </p>
        </div>
        <Button onClick={addNewTerm} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t('termSettings.addTerm')}
        </Button>
      </div>

      <div className="grid gap-6">
        {terms.map((term) => (
          <Card key={term.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <Input
                  value={term.name}
                  onChange={(e) => updateTerm(term.id, "name", e.target.value)}
                  className="text-lg font-semibold border-none p-0 h-9 focus-visible:ring-0"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => saveTerm(term.id)}
                    className="flex items-center gap-1 h-9"
                  >
                    <Save className="w-3 h-3" />
                    {t('termSettings.save')}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteTerm(term.id)}
                    className="h-9"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Billing Start Date */}
                <div className="space-y-2">
                  <Label>{t('termSettings.billingStartDate')}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-9"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {term.billingStartDate ? format(term.billingStartDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={term.billingStartDate || undefined}
                        onSelect={(date) => updateTerm(term.id, "billingStartDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <Label>{t('termSettings.startDate')}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-9"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {term.startDate ? format(term.startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={term.startDate || undefined}
                        onSelect={(date) => updateTerm(term.id, "startDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label>{t('termSettings.endDate')}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-9"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {term.endDate ? format(term.endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={term.endDate || undefined}
                        onSelect={(date) => updateTerm(term.id, "endDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Term Summary */}
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">{t('termSettings.termSummary')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t('termSettings.billingPeriod')}:</span>{" "}
                    {term.billingStartDate && term.endDate
                      ? `${Math.ceil((term.endDate.getTime() - term.billingStartDate.getTime()) / (1000 * 60 * 60 * 24))} ${t('termSettings.days')}`
                      : "Not set"
                    }
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('termSettings.duration')}:</span>{" "}
                    {term.startDate && term.endDate
                      ? `${Math.ceil((term.endDate.getTime() - term.startDate.getTime()) / (1000 * 60 * 60 * 24))} ${t('termSettings.days')}`
                      : "Not set"
                    }
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('termSettings.status')}:</span>{" "}
                    <span className={term.billingStartDate && term.startDate && term.endDate ? "text-green-600" : "text-red-600"}>
                      {term.billingStartDate && term.startDate && term.endDate ? t('termSettings.complete') : t('termSettings.incomplete')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save All Button */}
      <div className="flex justify-end">
        <Button size="lg" className="px-8" onClick={saveAllChanges}>
          <Save className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('termSettings.saveSuccess')}</DialogTitle>
            <DialogDescription>
              {t('termSettings.saveSuccessMessage')}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}