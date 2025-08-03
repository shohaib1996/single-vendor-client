import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"

const CheckoutError = () => {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Error Loading Cart</h3>
          <p className="text-muted-foreground mb-4">Failed to load cart details. Please try again later.</p>
          <Button asChild>
            <Link href="/cart">Go to Cart</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default CheckoutError
