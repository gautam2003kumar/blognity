'use client'

import Footer from '@/components/Footer/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Heart, EyeIcon, MessageCircle, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import BlogLoading from '@/components/Loader/BlogLoading'
import { Category } from '@/utils/Category'

const Home = () => {
  interface Blog {
    _id: string
    title: string
    likes: number
    views: number
    comments: Array<string>
    bannerUrl: string
    description: string
  }

  const [latestBlog, setLatestBlog] = useState<Blog[]>([])
  const [trendingBlog, setTrendingBlog] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const [latestRes, trendingRes] = await Promise.all([
          axios.get('/api/blog/latest-blogs'),
          axios.get('/api/blog/trending-blogs'),
        ])
        setLatestBlog(latestRes.data.data)
        setTrendingBlog(trendingRes.data.data)
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
    <div>
      <section className="py-20 px-6 bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        <div className="max-w-6xl mx-auto text-center">
          {/* Hero */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Blognity</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            The ultimate platform to explore and share amazing blogs on various topics.
          </p>
          <Link href="/blog/write-blog">
            <Button className="px-6 py-3 text-lg">Get Started</Button>
          </Link>
        </div>

        {/* Categories */}
        <div className="mt-20 max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Explore Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Category.map((category, index) => (
              <Button
                key={index}
                className="text-md py-6 bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Blog Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20 max-w-6xl mx-auto">
          {/* Latest Blogs */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-center md:text-left">Latest Blogs</h3>
            {loading ? (
              <BlogLoading />
            ) : (
              <div className="space-y-4">
                {latestBlog.map(blog => (
                  <Card
                    key={blog._id}
                    className="bg-gray-100 dark:bg-gray-900 shadow-lg hover:shadow-xl transition p-4 rounded-xl"
                  >
                    <CardHeader>
                      <Image
                        src={blog.bannerUrl}
                        alt={blog.title}
                        width={100}
                        height={100}
                        className="w-full h-52 object-cover rounded-lg"
                        unoptimized
                      />
                      <CardTitle className="mt-4 text-xl font-semibold">{blog.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link
                        href={`/blog/${blog._id}`}
                        className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline hover:underline-offset-4"
                      >
                        Read More →
                      </Link>
                      <div className="flex justify-center md:justify-start gap-5 text-gray-500 dark:text-gray-400 text-xs mt-2">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" /> {blog.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <EyeIcon className="w-4 h-4" /> {blog.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" /> {blog.comments.length}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Trending Blogs */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-center md:text-left">Trending Blogs</h3>
            {loading ? (
              <BlogLoading />
            ) : (
              <div className="space-y-4">
                {trendingBlog.map(blog => (
                  <Card
                    key={blog._id}
                    className="bg-gray-100 dark:bg-gray-900 shadow-lg hover:shadow-xl transition p-4 rounded-xl"
                  >
                    <CardHeader>
                      <Image
                        src={blog.bannerUrl}
                        alt={blog.title}
                        width={100}
                        height={100}
                        className="w-full h-52 object-cover rounded-lg"
                        unoptimized
                      />
                      <CardTitle className="mt-4 text-xl font-semibold">{blog.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link
                        href={`/blog/${blog._id}`}
                        className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline hover:underline-offset-4"
                      >
                        Read More →
                      </Link>
                      <div className="flex justify-center md:justify-start gap-5 text-gray-500 dark:text-gray-400 text-xs mt-2">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" /> {blog.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <EyeIcon className="w-4 h-4" /> {blog.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" /> {blog.comments.length}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home
