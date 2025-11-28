import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Upload, Save, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"

interface SchoolSettings {
  schoolName: string
  schoolEmail: string
  logoUrl: string | null
}

export function SchoolSettings() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<SchoolSettings>({
    schoolName: "Rugby School Thailand",
    schoolEmail: "info@rugbyschool.ac.th",
    logoUrl: "/rugby-logo.png"
  })

  const [previewUrl, setPreviewUrl] = useState<string | null>(settings.logoUrl)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB')
        return
      }

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      // In a real application, you would upload the file to a server here
      // For now, we'll just store the preview URL
      setSettings({ ...settings, logoUrl: url })
    }
  }

  const handleSave = () => {
    // In a real application, this would save to a backend
    console.log('Saving settings:', settings)
    toast.success(t('schoolSettings.saveSuccess'), {
      description: t('schoolSettings.saveSuccessMessage')
    })
  }

  const handleRemoveLogo = () => {
    setPreviewUrl(null)
    setSettings({ ...settings, logoUrl: null })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('schoolSettings.title')}</h2>
        <p className="text-muted-foreground">
          {t('schoolSettings.description')}
        </p>
      </div>

      <div className="grid gap-6">
        {/* School Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('schoolSettings.schoolInformation')}</CardTitle>
            <CardDescription>
              {t('schoolSettings.schoolInformationDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schoolName">{t('schoolSettings.schoolName')}</Label>
              <Input
                id="schoolName"
                value={settings.schoolName}
                onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                placeholder={t('schoolSettings.schoolNamePlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schoolEmail">{t('schoolSettings.schoolEmail')}</Label>
              <Input
                id="schoolEmail"
                type="email"
                value={settings.schoolEmail}
                onChange={(e) => setSettings({ ...settings, schoolEmail: e.target.value })}
                placeholder={t('schoolSettings.schoolEmailPlaceholder')}
              />
              <p className="text-xs text-muted-foreground">
                {t('schoolSettings.emailHelpText')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* School Logo Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('schoolSettings.schoolLogo')}</CardTitle>
            <CardDescription>
              {t('schoolSettings.schoolLogoDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Logo Preview */}
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="School Logo"
                    className="max-w-full max-h-full object-contain p-2"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">{t('schoolSettings.logoRequirements')}</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• {t('schoolSettings.logoFormat')}</li>
                    <li>• {t('schoolSettings.logoSize')}</li>
                    <li>• {t('schoolSettings.logoRecommendation')}</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {t('schoolSettings.uploadLogo')}
                  </Button>

                  {previewUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveLogo}
                    >
                      {t('schoolSettings.removeLogo')}
                    </Button>
                  )}
                </div>

                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            <Save className="w-4 h-4 mr-2" />
            {t('schoolSettings.saveChanges')}
          </Button>
        </div>
      </div>
    </div>
  )
}
