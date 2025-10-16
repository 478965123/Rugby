import { useTranslation } from 'react-i18next'
import { TuitionDashboard } from './TuitionDashboard'

// This is a wrapper to provide translations to TuitionDashboard
// In the future, we'll update TuitionDashboard itself to use useTranslation
export function TuitionDashboardTranslated() {
  const { t } = useTranslation()

  return <TuitionDashboard />
}
