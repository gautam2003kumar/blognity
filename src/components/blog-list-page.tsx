import BlogTable from '@/components/blog/BlogTable'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const res = await axios.get('/api/blog/user-blogs')
        if (res.status === 200) {
          setBlogs(res.data.data)
        } else {
          toast.error(res.data.message || 'Blogs not found')
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Error fetching blogs')
      }
    }

    getBlogs()
  }, [])

  const editBlog = (id: string) => {}
  const deleteBlog = async (blogId: string) => {
    try {
      const res = await axios.delete(`/api/${blogId}/delete`)
      if (res.status === 200) {
        toast.success(res.data.message || 'Blog deleted successfully')
      } else {
        toast.error(res.data.message || 'Failed to delete blog')
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error deleting blog')
    }
  }

  return <BlogTable data={blogs} onEdit={editBlog} onDelete={deleteBlog} />
}
