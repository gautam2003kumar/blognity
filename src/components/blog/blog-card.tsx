import axios from 'axios'
import { EyeIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface BlogCardProps {
  blog: {
    _id: string
    title: string
    bannerUrl: string
    description: string
    category: string[]
    views: number
    likes: number
    createdAt: string
  }
}

const BlogCard = ({ blog }: BlogCardProps) => {
  const [views, setViews] = useState(blog.views)

  const handleView = async () => {
    try {
      const res = await axios.patch(`/api/${blog._id}/view`)
      setViews(res.data.view)
    } catch (error) {
      console.error('Error updating view count', error)
    }
  }

  return (
    <div className="group border rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all bg-white dark:bg-gray-900">
      <Link href={`/blog/pre-view/${blog._id}`} onClick={handleView} className="block">
        {/* Image */}
        <div className="relative w-full h-56 overflow-hidden">
          <img
            src={blog.bannerUrl}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {blog.category.map((cat, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition">
            {blog.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
            {blog.description.length > 120
              ? `${blog.description.substring(0, 120)}...`
              : blog.description}
          </p>

          {/* Published Date and Views */}
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 pt-2">
            <span>
              Published date:{' '}
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <div className="flex items-center gap-1">
              <EyeIcon className="h-4 w-4" />
              <span>{views}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default BlogCard
