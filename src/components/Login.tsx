import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Mail, KeyRound, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import rugbyLogo from "/rugby-school-logo.jpeg"

interface LoginProps {
  onLoginSuccess: () => void
}

export function Login({ onLoginSuccess }: LoginProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate email
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1500))

      // In real app, this would call your backend API to send OTP email
      console.log("Sending OTP to:", email)

      setOtpSent(true)
      setStep("otp")
      toast.success("OTP has been sent to your email", {
        description: `Check your inbox at ${email}`
      })
    } catch (error) {
      toast.error("Failed to send OTP", {
        description: "Please try again"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate OTP
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1500))

      // In real app, this would call your backend API to verify OTP
      console.log("Verifying OTP:", otp, "for email:", email)

      // For demo purposes, accept any 6-digit OTP
      toast.success("Login successful!")
      onLoginSuccess()
    } catch (error) {
      toast.error("Invalid OTP", {
        description: "Please check your code and try again"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success("OTP has been resent to your email")
    } catch (error) {
      toast.error("Failed to resend OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep("email")
    setOtp("")
    setOtpSent(false)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img
              src={rugbyLogo}
              alt="Rugby School Thailand"
              className="h-24 w-auto object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === "email" ? "Welcome Back" : "Verify OTP"}
          </CardTitle>
          <CardDescription>
            {step === "email"
              ? "Enter your email address to receive a one-time password"
              : `We've sent a 6-digit code to ${email}`
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-11"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                    setOtp(value)
                  }}
                  disabled={isLoading}
                  className="h-11 text-center text-2xl font-mono tracking-widest"
                  autoFocus
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground text-center">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Login"
                )}
              </Button>

              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                >
                  Resend OTP
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={handleBackToEmail}
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Email
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
