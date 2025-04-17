import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const BlogLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl p-6 shadow-lg">
        <CardContent className="flex flex-col space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-60 w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  )
}

export default BlogLoading
