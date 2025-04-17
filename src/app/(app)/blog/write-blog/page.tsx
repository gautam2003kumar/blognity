'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation' // Import from next/navigation
import axios from 'axios'
import { toast } from 'sonner'
import EditorJS from '@editorjs/editorjs'
import { Category } from '@/utils/Category'
import Editor from '@/components/Editor/editor'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectTrigger,
} from '@/components/ui/select'

const Page = () => {
  const router = useRouter() // Use router instead of useNavigate()

  const [formData, setFormData] = useState({
    bannerUrl: '',
    title: '',
    description: '',
    category: '',
    status: 'draft',
  })

  const editorRef = useRef<EditorJS | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async (status: 'draft' | 'published') => {
    if (!editorRef.current) {
      return toast.error('Editor is not initialized.')
    }

    try {
      const editorData = await editorRef.current.save()

      if (!formData.title || !formData.description) {
        return toast.error('Title and Description are required.')
      }

      const blogData = {
        ...formData,
        content: editorData,
        status,
      }

      const response = await axios('/api/blog/create', {
        method: 'POST',
        data: JSON.stringify(blogData),
        headers: { 'Content-Type': 'application/json' },
      })

      const blogId = response.data.data
      const result = response.data

      if (response.status >= 200 && response.status < 300) {
        toast.success(result.message)
        router.push(`/blog/pre-view/${blogId}`) // Use router.push instead of navigate
      } else {
        toast.error(result.error || 'Failed to create blog.')
      }
    } catch (error) {
      console.error('Error saving blog:', error)
      toast.error('Error while saving the blog.')
    }
  }

  return (
    <div className=" bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Share the knowledge with the world</h1>

        {/* Banner URL */}
        <label htmlFor="bannerUrl" className="font-semibold mb-2 block">
          Blog Banner URL
        </label>
        <input
          type="text"
          name="bannerUrl"
          value={formData.bannerUrl}
          onChange={handleChange}
          placeholder="Blog Banner URL"
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-gray-600"
        />

        {/* Title */}
        <label htmlFor="title" className="font-semibold mb-2 block">
          Blog Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Blog Title"
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-gray-600"
        />

        {/* Description */}
        <label htmlFor="description" className="font-semibold mb-2 block">
          Blog Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Blog Description"
          rows={4}
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-gray-600"
        />

        {/* Category */}
        <label htmlFor="category" className="font-semibold mb-2 block">
          Blog Category
        </label>
        <div className="mb-4">
          <Select
            name="category"
            onValueChange={value => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-600">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                {Category.map((category, index) => (
                  <SelectItem key={index} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Editor */}
        <label htmlFor="editorjs" className="font-semibold mb-2 block">
          Write the main content
        </label>
        <div className="border border-gray-300 rounded-lg p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-gray-600">
          <Editor ref={editorRef} />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => handleSave('published')} className="rounded-lg px-4 py-2">
            Publish Blog
          </Button>
          <Button onClick={() => handleSave('draft')}>Save as Draft</Button>
          <Button>Preview</Button>
        </div>
      </div>
    </div>
  )
}

export default Page
