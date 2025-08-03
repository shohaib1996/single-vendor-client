import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { User } from "lucide-react"

const CheckoutLoginRequired = () => {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Login Required</h3>
          <p className="text-muted-foreground mb-4">Please login to proceed with checkout</p>
          <Button asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default CheckoutLoginRequired
