import { Card, CardContent } from "@/components/ui/card"

export function CategorySkeleton() {
  return (
    <Card className="bg-card backdrop-blur-sm border-border/50 p-0">
      <CardContent className="p-2 text-center">
        <div className="mb-4">
          <div
            className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-muted animate-pulse`}
          ></div>
        </div>

        <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-2 animate-pulse"></div>

        <div className="h-3 bg-muted rounded w-1/2 mx-auto mb-2 animate-pulse hidden md:block"></div>

        <div className="h-3 bg-muted rounded w-1/4 mx-auto animate-pulse"></div>
      </CardContent>
    </Card>
  )
}
