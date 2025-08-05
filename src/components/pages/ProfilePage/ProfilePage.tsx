"use client"

import React from "react"
import { useGetUserProfileQuery, useUpdateUserMutation } from "@/redux/api/user/userApi"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit, Save, X, User, Mail, Phone, MapPin, Calendar, Shield, Upload, Home, ChevronRight } from "lucide-react"
import { uploadFiles } from "@/lib/uploadFile"
import Link from "next/link"
import { IUser } from "@/types/user/user"
import { toast } from "sonner"

const ProfilePage = () => {
  const { data: profile, isLoading } = useGetUserProfileQuery({})
  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const profileData: IUser = profile?.data

  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatarUrl: "",
  })

  // Initialize form data when profile loads
  React.useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        avatarUrl: profileData.avatarUrl || "",
      })
    }
  }, [profileData])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    // Reset form data to original values
    if (profileData) {
      setFormData({
        name: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        avatarUrl: profileData.avatarUrl || "",
      })
    }
    setIsEditing(false)
  }

  const handleSave = async () => {
    try {
      await updateUser({
        id: profileData.id,
        data: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          avatarUrl: formData.avatarUrl,
        },
      }).unwrap()

      toast.success( "Your profile has been successfully updated.")

      setIsEditing(false)
    } catch (error: any) {
      toast.error(`${error?.data?.message}|| "Failed to update profile. Please try again."`)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const uploadedUrls = await uploadFiles(files)
      if (uploadedUrls.length > 0) {
        handleInputChange("avatarUrl", uploadedUrls[0])
        toast.success("Profile picture has been uploaded successfully.")
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 w-48 rounded mb-6"></div>
            <div className="bg-gray-200 h-96 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600">Unable to load profile information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="flex items-center hover:text-foreground transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Profile</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information</p>
        </div>

        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={isEditing ? formData.avatarUrl : profileData.avatarUrl} alt={profileData.name} />
                    <AvatarFallback className="text-xl">{getInitials(profileData.name)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{profileData.name}</h2>
                    <Badge variant={profileData.role === "ADMIN" ? "default" : "secondary"}>
                      <Shield className="h-3 w-3 mr-1" />
                      {profileData.role}
                    </Badge>
                  </div>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {profileData.email}
                  </p>
                  <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    Member since {formatDate(profileData.createdAt)}
                  </p>
                </div>
              </div>

              {!isEditing && (
                <Button onClick={handleEdit} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Separator />

            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

            {/* Profile Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    className=""
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="p-3 bg-backgroundrounded-md ">{profileData.name || "Not provided"}</div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <div className="p-3 bg-background rounded-md  text-gray-600">
                  {profileData.email}
                  <span className="text-xs text-gray-500 block mt-1">Email cannot be changed</span>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="p-3 bg-backgroundrounded-md">{profileData.phone || "Not provided"}</div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </Label>
              {isEditing ? (
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter your full address (Country, City, Postal Code, Street Address)"
                  rows={3}
                />
              ) : (
                <div className="p-3 bg-backgroundrounded-md min-h-[80px]">{profileData.address || "Not provided"}</div>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <>
                <Separator />
                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={updateLoading || uploading}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={updateLoading || uploading}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {updateLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">User ID:</span>
                <span className="font-mono text-sm">{profileData.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Account Type:</span>
                <Badge variant={profileData.role === "ADMIN" ? "default" : "secondary"}>{profileData.role}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Member Since:</span>
                <span>{formatDate(profileData.createdAt)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Name:</span>
                  <span className={profileData.name ? "text-green-600" : "text-red-600"}>
                    {profileData.name ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phone:</span>
                  <span className={profileData.phone ? "text-green-600" : "text-red-600"}>
                    {profileData.phone ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Address:</span>
                  <span className={profileData.address ? "text-green-600" : "text-red-600"}>
                    {profileData.address ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avatar:</span>
                  <span className={profileData.avatarUrl ? "text-green-600" : "text-red-600"}>
                    {profileData.avatarUrl ? "✓" : "✗"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
