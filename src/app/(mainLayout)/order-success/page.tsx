import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

const OrderSuccessPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-2">
          Order Successful!
        </h1>
        <p className="text-green-600 dark:text-green-400">
          You can pay upon delivery.
        </p>
        <div className="flex items-center justify-center mt-3">
            <Link href={'/'}> <Button className="bg-primary">Home</Button></Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
