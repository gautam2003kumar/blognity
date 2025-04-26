'use client'

import Footer from '@/components/Footer/footer'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import BlogLoading from '@/components/Loader/BlogLoading'
import { Category } from '@/utils/Category'
import BlogCard from '@/components/blog/blog-card'
import { useIsMobile } from '@/hooks/use-mobile' // import the hook
import { CategoryIcon } from '@/components/blog/CategoryIcon'

import CategoryCarousel from '@/components/blog/BlogCategory'

const Home = () => {
  interface Blog {
    _id: string
    title: string
    bannerUrl: string
    description: string
    category: string[]
    author: string
    views: number
    likes: number
    createdAt: string
    updatedAt: string
  }

  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const isMobile = useIsMobile() // use the hook to determine if it's a mobile device

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('/api/blog/all-blogs')
        setBlogs(response.data.data)
      } catch (error) {
        console.error('Error fetching blogs:', error)
        alert('Failed to fetch blogs. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  return (
    <div className="py-20 px-6 bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <section>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Blognity</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            The ultimate platform to explore and share amazing blogs on various topics.
          </p>
          <Link href="/blog/write-blog">
            <Button
              variant={'outline'}
              className="px-6 py-3 text-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {!isMobile && <CategoryCarousel />}

      {/* Blogs Section */}
      <section className="py-20 px-6 bg-white dark:bg-black text-black dark:text-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">Latest Blogs</h3>

          {loading ? (
            <BlogLoading />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map(blog => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  )
}

export default Home
