import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Edit, User, Mail, Phone, Home } from "lucide-react"
import Link from "next/link"
import type { IUser } from "@/redux/features/auth/authSlice"

interface ShippingFormProps {
  user: IUser
}

const ShippingForm = ({ user }: ShippingFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Shipping Information
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/profile">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Name */}
        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="font-medium">{user.name}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
          <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Mail className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Email Address</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
          <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
            <Phone className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Phone Number</p>
            <p className="font-medium">{user.phone || "Not provided"}</p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
          <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
            <Home className="h-5 w-5 text-orange-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Shipping Address</p>
            <p className="font-medium">{user.address || "Not provided"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ShippingForm
