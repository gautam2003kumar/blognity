import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string
      fullName?: string
      isVerified?: boolean
      isAdmin?: boolean
      username?: string
    } & DefaultSession['user']
  }

  interface User {
    _id?: string
    fullName?: string
    isVerified?: boolean
    isAdmin?: boolean
    username?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string
    fullName?: string
    isVerified?: boolean
    isAdmin?: boolean
    username?: string
  }
}
