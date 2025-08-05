"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Download,
  CreditCard,
  Calendar,
  Mail,
  User,
  Receipt,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks/hooks";

interface PaymentData {
  id: string;
  amount_total: number;
  currency: string;
  payment_status: string;
  status: string;
  created: number;
  customer_details: {
    email: string;
    name: string;
    address: {
      country: string;
    };
  };
  payment_intent: {
    id: string;
    payment_method: {
      card: {
        brand: string;
        last4: string;
        exp_month: number;
        exp_year: number;
      };
    };
  };
  metadata: {
    orderId: string;
  };
}

interface PaymentSuccessContentProps {
  paymentData: PaymentData;
}

const PaymentSuccessContent = ({ paymentData }: PaymentSuccessContentProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const [isDownloading, setIsDownloading] = useState(false);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Stripe amounts are in cents
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const generateReceiptHTML = () => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Receipt - ${paymentData.id}</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 20px; }
        .success-badge { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; }
        .info-row { display: flex; justify-content: space-between; margin: 10px 0; align-items: flex-start; }
        .info-row .value { word-break: break-all; max-width: 60%; text-align: right; }
        .label { font-weight: bold; flex-shrink: 0; }
        .total { font-size: 24px; font-weight: bold; color: #059669; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
        @media (max-width: 600px) {
          .info-row { flex-direction: column; gap: 5px; }
          .info-row .value { max-width: 100%; text-align: left; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>EcoShop</h1>
        <div class="success-badge">Payment Successful</div>
        <h2>Payment Receipt</h2>
      </div>
      
      <div class="info-row">
        <span class="label">Transaction ID:</span>
        <span class="value">${paymentData.id}</span>
      </div>
      <div class="info-row">
        <span class="label">Order ID:</span>
        <span class="value">${paymentData.metadata.orderId}</span>
      </div>
      <div class="info-row">
        <span class="label">Payment Date:</span>
        <span class="value">${formatDate(paymentData.created)}</span>
      </div>
      <div class="info-row">
        <span class="label">Customer Name:</span>
        <span class="value">${paymentData.customer_details.name}</span>
      </div>
      <div class="info-row">
        <span class="label">Email:</span>
        <span class="value">${paymentData.customer_details.email}</span>
      </div>
      <div class="info-row">
        <span class="label">Payment Method:</span>
        <span class="value">${paymentData.payment_intent.payment_method.card.brand.toUpperCase()} •••• ${
      paymentData.payment_intent.payment_method.card.last4
    }</span>
      </div>
      
      <hr style="margin: 20px 0;">
      
      <div class="info-row">
        <span class="label total">Total Amount:</span>
        <span class="total">${formatPrice(
          paymentData.amount_total,
          paymentData.currency
        )}</span>
      </div>
      
      <div class="footer">
        <p>Thank you for your purchase!</p>
        <p>EcoShop - Your trusted shopping partner</p>
      </div>
    </body>
    </html>
  `;
  };

  const downloadReceipt = async () => {
    setIsDownloading(true);

    try {
      const receiptHTML = generateReceiptHTML();
      const blob = new Blob([receiptHTML], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${paymentData.id}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Receipt downloaded successfully!");
    } catch (error) {
      console.log(error)
      toast.error("Failed to download receipt");
    } finally {
      setIsDownloading(false);
    }
  };

  const printReceipt = () => {
    const receiptHTML = generateReceiptHTML();
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-2">
            Payment Successful!
          </h1>
          <p className="text-green-600 dark:text-green-400">
            Your payment has been processed successfully
          </p>
        </div>

        {/* Receipt Card */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Receipt className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Payment Receipt</CardTitle>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-green-200 dark:border-green-800">
              {paymentData.payment_status.toUpperCase()}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Transaction Details */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-2">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-mono text-sm bg-muted px-2 py-1 rounded break-all max-w-full overflow-hidden">
                  {paymentData.id}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-2">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-mono text-sm bg-muted px-2 py-1 rounded break-all max-w-full overflow-hidden">
                  {paymentData.metadata.orderId}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-2">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Payment Date:
                </span>
                <span className="font-medium">
                  {formatDate(paymentData.created)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Customer Information</h3>

              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Name:
                </span>
                <span className="font-medium">
                  {paymentData.customer_details.name}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email:
                </span>
                <span className="font-medium">
                  {paymentData.customer_details.email}
                </span>
              </div>
            </div>

            <Separator />

            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Payment Method</h3>

              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Card:
                </span>
                <span className="font-medium">
                  {paymentData.payment_intent.payment_method.card.brand.toUpperCase()}
                  •••• {paymentData.payment_intent.payment_method.card.last4}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Expires:</span>
                <span className="font-medium">
                  {paymentData.payment_intent.payment_method.card.exp_month}/
                  {paymentData.payment_intent.payment_method.card.exp_year}
                </span>
              </div>
            </div>

            <Separator />

            {/* Total Amount */}
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatPrice(paymentData.amount_total, paymentData.currency)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={downloadReceipt}
                disabled={isDownloading}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? "Downloading..." : "Download Receipt"}
              </Button>

              <Button
                onClick={printReceipt}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Receipt
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Message */}
        <div className="text-center mt-8 p-4 bg-white/50 dark:bg-card/50 rounded-lg backdrop-blur-sm">
          <p className="text-muted-foreground">
            Thank you for your purchase! A confirmation email has been sent to{" "}
            <span className="font-medium">
              {user?.email}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessContent;
