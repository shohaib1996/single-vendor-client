"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Truck, Shield, Clock } from "lucide-react"

interface PaymentMethodCardProps {
  paymentMethod: "pay_now" | "pay_later"
  setPaymentMethod: (method: "pay_now" | "pay_later") => void
}

const PaymentMethodCard = ({ paymentMethod, setPaymentMethod }: PaymentMethodCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="pay_now" id="pay_now" />
            <label htmlFor="pay_now" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Pay Now</h3>
                  <p className="text-sm text-muted-foreground">Secure online payment with credit/debit card</p>
                </div>
              </div>
            </label>
            <Badge variant="secondary">Recommended</Badge>
          </div>

          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="pay_later" id="pay_later" />
            <label htmlFor="pay_later" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Cash on Delivery</h3>
                  <p className="text-sm text-muted-foreground">Pay when your order is delivered</p>
                </div>
              </div>
            </label>
          </div>
        </RadioGroup>

        {/* Payment Method Info */}
        {paymentMethod === "pay_now" && (
          <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Secure Payment</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your payment information is encrypted and secure. We accept all major credit cards.
            </p>
          </div>
        )}

        {paymentMethod === "pay_later" && (
          <div className="mt-4 p-4 bg-accent/5 border border-accent/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Cash on Delivery</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Pay in cash when your order arrives. Additional COD charges may apply.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PaymentMethodCard
