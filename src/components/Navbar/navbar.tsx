'use client'

import Link from 'next/link'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetFooter,
  SheetTitle,
} from '@/components/ui/sheet'

// Extend NextAuth User type to include _id and username
interface CustomUser {
  name?: string | null
  email?: string | null
  image?: string | null
  username?: string
  _id?: string
}

const Navbar = () => {
  const { data: session } = useSession()
  const user = session?.user as CustomUser | undefined

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
      setIsDarkMode(true)
    } else {
      document.documentElement.classList.remove('dark')
      setIsDarkMode(false)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark'
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    setIsDarkMode(!isDarkMode)
  }

  const getFallbackInitial = () => {
    if (user?.name) return user.name[0]
    if (user?.email) return user.email[0]
    return 'U'
  }

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/home" className="text-2xl font-bold mb-4 md:mb-0 text-black dark:text-white">
          Blognity
        </Link>

        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <div className="flex items-center space-x-2 text-black dark:text-white">
                <span className="text-base">Welcome</span>
                <span className="font-bold text-xl">{user?.username || user?.email}</span>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.image || 'https://github.com/shadcn.png'} />
                    <AvatarFallback>{getFallbackInitial()}</AvatarFallback>
                  </Avatar>
                </SheetTrigger>

                <SheetContent className="border-none p-6 space-y-4   max-w-xs mx-auto bg-transparent">
                  <SheetHeader className="text-center">
                    <SheetTitle className="sr-only">User Menu</SheetTitle>
                    <Avatar className="mx-auto w-16 h-16">
                      <AvatarImage src={user?.image || 'https://github.com/shadcn.png'} />
                      <AvatarFallback>{getFallbackInitial()}</AvatarFallback>
                    </Avatar>
                  </SheetHeader>

                  <div className="flex flex-col space-y-3 bg-transparent">
                    <Button variant="outline" asChild>
                      <Link href="/profile">Edit Profile</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/admin-dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/auth/change-password/${user?._id}`}>Change Password</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/user-blogs/${user?._id}`}>Blogs</Link>
                    </Button>
                    <Button variant="outline" onClick={toggleTheme}>
                      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </Button>
                    <Button variant="destructive" onClick={() => signOut()}>
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <Button asChild className="w-full md:w-auto">
              <Link href="/auth/sign-in">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
