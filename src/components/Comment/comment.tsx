'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'sonner'
import { Comment } from '@/types/comment'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

const CommentSection = ({ blogId }: { blogId: string }) => {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingComments, setLoadingComments] = useState(true)
  const { data: session } = useSession()
  const user = session?.user

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comment/all-comments/${blogId}`)
      if (res.data?.success) {
        setComments(res.data.data || [])
      }
    } catch (err) {
      toast.error('Failed to load comments. ' + (err as Error).message)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    try {
      await axios.delete(`/api/comment/delete/${commentId}`)
      toast.success('Comment deleted')
      await fetchComments()
    } catch (err) {
      toast.error('Failed to delete comment. ' + (err as Error).message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      toast.error('Comment cannot be empty.')
      return
    }

    try {
      setLoading(true)
      const response = await axios.post('/api/comment/new-comment', {
        userId: user?._id,
        blogId,
        content,
        name: name || user?.username || 'Anonymous',
      })
      if (response.data.success) {
        toast.success(response.data.message || '📩 Successfully posted your comment')
        setContent('')
        setName('')
        await fetchComments()
      } else {
        toast.error(response.data.message || 'Something went wrong.')
      }
    } catch (err) {
      toast.error('Failed to post comment. ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoadingComments(true)
    fetchComments()
  }, [blogId])

  return (
    <div className="space-y-8 mt-10">
      <h3 className="text-xl font-semibold">Leave a Comment</h3>

      {!user ? (
        <p className="text-gray-600 italic">
          Please{' '}
          <a href="/auth/sign-in" className="underline text-blue-600">
            login
          </a>{' '}
          to leave a comment.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
          <textarea
            placeholder="Write a comment..."
            rows={4}
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
          <div className="flex justify-center">
            <Button type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {loadingComments ? (
          <p className="text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-400 italic">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="border p-4 rounded-lg">
              <p className="text-sm">{comment.content}</p>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <div>
                  — {comment.name || user?.username || 'Anonymous'} ·{' '}
                  {new Date(comment.createdAt).toLocaleString()}
                </div>
                {(user?._id === comment.userId || user?.isAdmin) && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the comment.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleDelete(comment._id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CommentSection
