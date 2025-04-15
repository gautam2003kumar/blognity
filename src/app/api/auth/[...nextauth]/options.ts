import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import bcrypt from 'bcryptjs'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'Credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email or Username',
          type: 'text',
          placeholder: 'Enter your email or username',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect()
        try {
          const user = await UserModel.findOne({
            $or: [{ email: credentials.identifier }, { username: credentials.identifier }],
          })

          if (!user) {
            throw new Error('User not found with provided details')
          }

          if (!user.isVerified) {
            throw new Error('Please verify your account before login')
          }

          if (!user.password) {
            throw new Error('User password is not set')
          }

          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

          if (isPasswordCorrect) {
            return user
          } else {
            throw new Error('Wrong password, enter the correct password')
          }
        } catch (err: any) {
          throw new Error(err.message || 'Login failed')
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      await dbConnect()

      // Handle Google login
      if (account?.provider === 'google') {
        let existingUser = await UserModel.findOne({ email: token.email })

        if (!existingUser) {
          // Create new Google user
          existingUser = await UserModel.create({
            email: token.email,
            username: token.email?.split('@')[0],
            isVerified: true,
            provider: 'google',
            googleId: account.providerAccountId,
          })
        }

        token._id = existingUser._id?.toString()
        token.isVerified = existingUser.isVerified
        token.isAdmin = existingUser.isAdmin
        token.username = existingUser.username
      }

      // Local auth (Credentials)
      if (user) {
        token._id = user._id?.toString()
        token.isVerified = user.isVerified
        token.isAdmin = user.isAdmin
        token.username = user.username
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token._id
        session.user.isVerified = token.isVerified
        session.user.isAdmin = token.isAdmin
        session.user.username = token.username
      }

      return session
    },
  },

  pages: {
    signIn: '/sign-in',
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
}
