import { useTranslation } from "react-i18next"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"

export type PaymentStatus = "paid" | "partial" | "unpaid" | "cancelled" | "overdue" | "all"

export type PaymentChannel = "credit_card" | "wechat_pay" | "alipay" | "qr_payment" | "counter_bank" | "all"

interface StatusFilterProps {
  selectedStatus: PaymentStatus
  onStatusChange: (status: PaymentStatus) => void
}

export function StatusFilter({ selectedStatus, onStatusChange }: StatusFilterProps) {
  const { t } = useTranslation()

  const statusOptions = [
    { value: "all" as PaymentStatus, label: t('paymentHistory.allStatus'), color: undefined },
    { value: "paid" as PaymentStatus, label: t('paymentHistory.paymentStatus.paid'), color: "bg-green-100 text-green-800 hover:bg-green-100" },
    { value: "partial" as PaymentStatus, label: t('paymentHistory.paymentStatus.partial'), color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
    { value: "unpaid" as PaymentStatus, label: t('paymentHistory.paymentStatus.unpaid'), color: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
    { value: "cancelled" as PaymentStatus, label: t('paymentHistory.paymentStatus.cancelled'), color: "bg-red-100 text-red-800 hover:bg-red-100" },
    { value: "overdue" as PaymentStatus, label: t('paymentHistory.paymentStatus.overdue'), color: "bg-orange-100 text-orange-800 hover:bg-orange-100" }
  ]

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t('paymentHistory.status')}</label>
      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                {option.color && (
                  <Badge className={`text-xs px-2 py-0.5 ${option.color}`}>
                    {option.label}
                  </Badge>
                )}
                {!option.color && <span>{option.label}</span>}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

interface PaymentChannelFilterProps {
  selectedChannel: PaymentChannel
  onChannelChange: (channel: PaymentChannel) => void
}

export function PaymentChannelFilter({ selectedChannel, onChannelChange }: PaymentChannelFilterProps) {
  const { t } = useTranslation()

  const channelOptions = [
    { value: "all" as PaymentChannel, label: t('paymentHistory.allChannels') },
    { value: "credit_card" as PaymentChannel, label: t('paymentHistory.paymentChannels.credit_card') },
    { value: "wechat_pay" as PaymentChannel, label: t('paymentHistory.paymentChannels.wechat_pay') },
    { value: "alipay" as PaymentChannel, label: t('paymentHistory.paymentChannels.alipay') },
    { value: "qr_payment" as PaymentChannel, label: t('paymentHistory.paymentChannels.qr_payment') },
    { value: "counter_bank" as PaymentChannel, label: t('paymentHistory.paymentChannels.counter_bank') }
  ]

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t('paymentHistory.paymentChannel')}</label>
      <Select value={selectedChannel} onValueChange={onChannelChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {channelOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function getStatusBadge(status: string, t?: any) {
  const statusLower = status.toLowerCase()

  // If translation function is not provided, use English labels
  const getLabel = (key: string) => t ? t(`paymentHistory.paymentStatus.${key}`) : key.charAt(0).toUpperCase() + key.slice(1)

  switch (statusLower) {
    case "paid":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          {getLabel('paid')}
        </Badge>
      )
    case "partial":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          {getLabel('partial')}
        </Badge>
      )
    case "unpaid":
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          {getLabel('unpaid')}
        </Badge>
      )
    case "cancelled":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          {getLabel('cancelled')}
        </Badge>
      )
    case "overdue":
      return (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
          {getLabel('overdue')}
        </Badge>
      )
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          {status}
        </Badge>
      )
  }
}

export function getPaymentChannelLabel(channel: string, t?: any) {
  const channelLower = channel.toLowerCase()

  // If translation function is not provided, use English labels
  const getLabel = (key: string) => {
    if (t) return t(`paymentHistory.paymentChannels.${key}`)

    // Fallback English labels
    switch (key) {
      case "credit_card": return "Credit Card"
      case "wechat_pay": return "WeChat Pay"
      case "alipay": return "Alipay"
      case "qr_payment": return "QR Payment"
      case "counter_bank": return "Counter Bank"
      default: return channel
    }
  }

  switch (channelLower) {
    case "credit_card":
      return getLabel("credit_card")
    case "wechat_pay":
      return getLabel("wechat_pay")
    case "alipay":
      return getLabel("alipay")
    case "qr_payment":
      return getLabel("qr_payment")
    case "counter_bank":
      return getLabel("counter_bank")
    default:
      return channel
  }
}