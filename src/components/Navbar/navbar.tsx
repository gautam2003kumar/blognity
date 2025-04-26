'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Sun, Moon } from 'lucide-react'

const Navbar = () => {
  const { data: session } = useSession()
  const user = session?.user
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Set initial theme from localStorage
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

  const getInitial = () => {
    if (user?.name) return user.name[0]
    if (user?.email) return user.email[0]
    return 'U'
  }

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo */}
        <Link href="/home" className="text-2xl font-bold text-black dark:text-white mb-4 md:mb-0">
          Blognity
        </Link>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle Theme">
            {isDarkMode ? <Sun /> : <Moon />}
          </Button>

          {/* Authenticated */}
          {session ? (
            <>
              <Sheet>
                <SheetTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.image || 'https://github.com/shadcn.png'} />
                    <AvatarFallback>{getInitial()}</AvatarFallback>
                  </Avatar>
                </SheetTrigger>

                <SheetContent className="p-6 space-y-4 bg-white dark:bg-gray-900 border-none">
                  <SheetHeader>
                    <SheetTitle className="sr-only">User Menu</SheetTitle>
                    <Avatar className="mx-auto w-16 h-16">
                      <AvatarImage src={user?.image || 'https://github.com/shadcn.png'} />
                      <AvatarFallback>{getInitial()}</AvatarFallback>
                    </Avatar>
                  </SheetHeader>

                  <div className="flex flex-col space-y-3">
                    <Button variant="outline" asChild>
                      <Link href="/profile">Edit Profile</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/auth/change-password/${user?._id}`}>Change Password</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/user-blogs/${user?._id}`}>Blogs</Link>
                    </Button>
                    <Button variant="destructive" onClick={() => signOut()}>
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            // Not logged in
            <Button asChild>
              <Link href="/auth/sign-in">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
