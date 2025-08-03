"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react"

const PaymentSuccessError = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-red-800 dark:text-red-200 mb-2">Payment Verification Failed</h1>
          <p className="text-red-600 dark:text-red-400">We couldn't verify your payment details</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 dark:bg-card/80 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-4">What happened?</h3>
            <p className="text-muted-foreground mb-6">
              There was an issue retrieving your payment information. This could be due to:
            </p>
            <ul className="text-left text-muted-foreground mb-8 space-y-2 max-w-md mx-auto">
              <li>• Invalid or expired session ID</li>
              <li>• Network connectivity issues</li>
              <li>• Server temporarily unavailable</li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.location.reload()} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button variant="outline" className="bg-transparent" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PaymentSuccessError
