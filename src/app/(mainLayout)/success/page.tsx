"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { usePaymentSuccessQuery } from "@/redux/api/payment/paymentApi"
import PaymentSuccessContent from "@/components/pages/PaymentSuccess/PaymentSuccessContent"
import PaymentSuccessLoading from "@/components/pages/PaymentSuccess/PaymentSuccessLoading"
import PaymentSuccessError from "@/components/pages/PaymentSuccess/PaymentSuccessError"

const PaymentSuccess = () => {
  const searchParams = useSearchParams()
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const session_id = searchParams.get("session_id")
    setSessionId(session_id)
  }, [searchParams])

  const {
    data: paymentData,
    isLoading,
    error,
  } = usePaymentSuccessQuery({ session_id: sessionId }, { skip: !sessionId })

  if (isLoading || !sessionId) {
    return <PaymentSuccessLoading />
  }

  if (error || !paymentData?.success) {
    return <PaymentSuccessError />
  }

  return <PaymentSuccessContent paymentData={paymentData.data} />
}

export default PaymentSuccess
