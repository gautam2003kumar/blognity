'use client'

import React, { use, useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import EditorRenderer from '@/components/Editor/Renderer'
import BlogLoading from '@/components/Loader/BlogLoading'
import { Link, Unlink } from 'lucide-react'
import Image from 'next/image'
import { Blog } from '@/types/blog'
import CommentSection from '@/components/Comment/comment'



const BlogDetail = () => {
  const [blog, setBlog] = useState<Blog | null>(null)
  const params = useParams()
  const blogId = params.blogid as string
  const [date, setDate] = useState('')
  const [copied, setCopied] = useState(false)
  const [blogUrl, setBlogUrl] = useState('')

  useEffect(() => {
    const currentUrl = window.location.href
    setBlogUrl(currentUrl)
  }, [])

  const handleCopy = () => {
    navigator.clipboard
      .writeText(blogUrl)
      .then(() => {
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
        }, 2000)
      })
      .catch(error => {
        console.error('Failed to copy: ', error)
      })
  }

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return
      try {
        const response = await axios.get(`/api/blog/preview/${blogId}`)

        setBlog(response.data.data)
        const rawDate = response?.data?.data?.updatedAt
        const formattedDate = new Date(rawDate).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })

        setDate(formattedDate)
        console.log('Date is:', formattedDate)
      } catch (error) {
        console.error('Error fetching blog:', error)
      }
    }

    fetchBlog()
  }, [blogId])

  if (!blog) return <BlogLoading />
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* bog copy */}
      <div>
        <button
          onClick={handleCopy}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-2  rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
          title="Copy blog link"
          aria-label="Copy blog link"
        >
          {copied ? (
            <span className="flex items-center">
              <Unlink className="w-4 h-4 mr-2" />
              Copied!
            </span>
          ) : (
            <span className="flex items-center">
              <Link className="w-4 h-4 mr-2" />
              Blog link
            </span>
          )}
        </button>
      </div>

      {/* Blog Details */}
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">{blog.title}</h1>
        <div className="relative w-full h-60 md:h-80 rounded-lg overflow-hidden mb-4">
          <Image src={blog.bannerUrl} alt={blog.title} fill className="object-cover" />
        </div>
        <div className="mt-5 mb-5 flex justify-between items-center text-sm text-gray-500">
          <span>Category: {blog.category}</span>
          <span>Publish Date: {date}</span>
        </div>

        <div className="prose">
          <EditorRenderer content={blog.content} />
        </div>
      </div>
      {/* Author Section */}
      <div className="max-w-3xl mx-auto mt-12 p-4  rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">About the Author</h2>
        <p className="text-sm text-gray-500">This is a placeholder for author information.</p>
        <div className="flex items-center mt-4">
          <img src="/author-placeholder.jpg" alt="Author" className="w-12 h-12 rounded-full mr-4" />
          <div>
            <h3 className="text-lg font-semibold">Author Name</h3>
            <p className="text-sm text-gray-500">Author Bio goes here.</p>
          </div>
        </div>
      </div>
     {/* Comment Section */}
      <div className="max-w-3xl mx-auto mt-12 p-4 border-t border-gray-200">
        
        <CommentSection blogId={blogId} />
        
        </div>
    </div>
  )
}

export default BlogDetail
