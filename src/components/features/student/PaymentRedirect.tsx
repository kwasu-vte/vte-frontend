"use client"
import React from "react"
import { Card, CardBody, Button, Divider } from "@heroui/react"
import { CreditCard, ArrowRight, ShieldCheck } from "lucide-react"

export type PaymentRedirectProps = {
  enrollment: { id: string }
  amount?: number
  onProceed?: () => void
  userId?: string
}

function PaymentRedirect({ enrollment, amount, onProceed, userId }: PaymentRedirectProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleProceed = async () => {
    if (typeof onProceed === 'function') {
      onProceed()
      return
    }
    if (!userId) return
    
    setIsLoading(true)
    
    // * Log API request details
    const requestPayload = { enrollment_id: enrollment.id }
    const requestUrl = `/api/v1/users/${userId}/enrollment/pay`
    console.log('[PaymentRedirect:handleProceed] API Request:', {
      url: requestUrl,
      method: 'POST',
      payload: requestPayload,
      timestamp: new Date().toISOString()
    })
    
    try {
      const resp = await fetch(requestUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(requestPayload),
        cache: 'no-store' as any,
      })
      
      // * Log API response details
      const responseStatus = resp.status
      const responseHeaders = Object.fromEntries(resp.headers.entries())
      const responseText = await resp.text()
      
      console.log('[PaymentRedirect:handleProceed] API Response:', {
        status: responseStatus,
        statusText: resp.statusText,
        headers: responseHeaders,
        body: responseText,
        timestamp: new Date().toISOString()
      })
      
      // * Parse JSON response
      let json: any = {}
      try {
        json = JSON.parse(responseText)
        console.log('[PaymentRedirect:handleProceed] Parsed JSON:', json)
      } catch (parseError) {
        console.error('[PaymentRedirect:handleProceed] JSON Parse Error:', parseError, 'Raw response:', responseText)
      }
      
      const url = json?.data?.payment_url || json?.payment_url
      
      if (resp.ok && url) {
        console.log('[PaymentRedirect:handleProceed] Redirecting to payment URL:', url)
        window.location.href = url
      } else {
        console.warn('[PaymentRedirect:handleProceed] Payment request failed:', {
          status: responseStatus,
          hasUrl: !!url,
          response: json
        })
        setIsLoading(false)
      }
    } catch (error) {
      console.error('[PaymentRedirect:handleProceed] API Request Error:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      })
      setIsLoading(false)
    }
  }

  return (
    <Card shadow="sm" className="w-full border border-neutral-100">
      <CardBody className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
              <CreditCard className="h-6 w-6 text-primary-600" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                Complete Your Payment
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Secure your enrollment by completing payment through Paystack
              </p>
            </div>
          </div>

          {/* Amount section */}
          {typeof amount === 'number' && !Number.isNaN(amount) && (
            <>
              <Divider />
              <div className="flex items-baseline justify-between py-2">
                <span className="text-sm font-medium text-neutral-600">Amount Due</span>
                <span className="text-3xl font-bold text-neutral-900">
                  ₦{new Intl.NumberFormat('en-NG').format(amount)}
                </span>
              </div>
              <Divider />
            </>
          )}

          {/* Payment button */}
          <Button 
            color="primary" 
            size="lg"
            className="w-full font-semibold"
            endContent={<ArrowRight className="h-4 w-4" />}
            onPress={handleProceed}
            isLoading={isLoading}
          >
            Proceed to Paystack
          </Button>

          {/* Trust indicator */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <ShieldCheck className="h-4 w-4 text-success-600" />
            <p className="text-xs text-neutral-500">
              Secured by Paystack • Your data is encrypted
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export { PaymentRedirect }
export default PaymentRedirect