'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'

export default function UserProfile() {
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [urls, setUrls] = useState<string[]>([''])
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const params = useParams()
  const { userId } = params

  // Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/auth/${userId}/profile`)
        const data = await res.json()
        if (res.ok) {
          const { fullName, bio, socialUrl } = data.data
          setFullName(fullName || '')
          setBio(bio || '')
          setUrls(socialUrl?.length ? socialUrl : [''])
        } else {
          toast.error(data.message || 'Failed to load profile')
        }
      } catch (error) {
        console.error('Failed to load profile', error)
        toast.error('Something went wrong.')
      } finally {
        setInitializing(false)
      }
    }

    fetchProfile()
  }, [])

  const handleAddUrl = () => setUrls([...urls, ''])

  const handleUrlChange = (index: number, value: string) => {
    const updated = [...urls]
    updated[index] = value
    setUrls(updated)
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/auth/${userId}/update-profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          bio,
          socialUrl: urls.filter(url => url.trim() !== ''),
        }),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success(data.message || 'Profile updated successfully!')
      } else {
        toast.error(data.message || 'Something went wrong.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  if (initializing) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto mt-10 p-6">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <p className="text-sm text-muted-foreground">Update your profile</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Full Name */}
        <div>
          <Label className="mb-2">Full Name</Label>
          <Input
            placeholder="John Doe"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        </div>

        {/* Bio */}
        <div>
          <Label className="mb-2">Bio</Label>
          <Textarea
            placeholder="I am a developer..."
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
        </div>

        {/* Social URLs */}
        <div>
          <Label className="mb-2">Social Media URLs</Label>
          <div className="space-y-2">
            {urls.map((url, idx) => (
              <Input
                key={idx}
                placeholder="https://..."
                value={url}
                onChange={e => handleUrlChange(idx, e.target.value)}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddUrl}
              className="mt-1"
            >
              <Plus className="w-4 h-4 mr-2" /> Add URL
            </Button>
          </div>
        </div>

        {/* Update Button */}
        <div>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
