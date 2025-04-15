// pages/index.tsx

import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-white text-gray-900">
      {/* Header */}
      <header className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-800 text-white">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold">Blognity</h1>
          <nav className="space-x-6">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <Link href="/about" className="hover:text-gray-300">
              About
            </Link>
            <Link href="/login" className="hover:text-gray-300">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-semibold mb-4">
            Share Your Ideas with the World
          </h2>
          <p className="text-xl mb-6">
            Join Blognity today and start writing your own stories, share insights, and connect with
            like-minded people.
          </p>
          <Link
            href="/write"
            className="inline-block px-6 py-3 text-lg font-semibold bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-500"
          >
            Start Writing
          </Link>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Featured Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">How to Start Blogging</h3>
              <p className="text-lg mb-4">
                Tips for beginners to make their first blog post stand out!
              </p>
              <Link href="/post/1" className="text-indigo-600 font-semibold">
                Read More →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Creative Writing Ideas</h3>
              <p className="text-lg mb-4">
                Unleash your creativity and inspire others with unique writing ideas.
              </p>
              <Link href="/post/2" className="text-indigo-600 font-semibold">
                Read More →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Building Your Audience</h3>
              <p className="text-lg mb-4">Practical strategies to grow and engage your audience.</p>
              <Link href="/post/3" className="text-indigo-600 font-semibold">
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-screen-xl mx-auto text-center">
          <p>&copy; 2025 Blognity. All rights reserved.</p>
          <div className="space-x-6 mt-4">
            <Link href="/privacy-policy" className="hover:text-gray-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-400">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-gray-400">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
