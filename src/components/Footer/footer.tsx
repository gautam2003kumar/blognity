import { Card } from '@/components/ui/card'
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black text-black dark:text-white py-12 px-8 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10">
        {/* Section 1 */}
        <div>
          <h3 className="font-semibold text-lg">Home</h3>
          <ul className="mt-5 text-gray-600 dark:text-gray-400">
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">Features</li>
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">Blogs</li>
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">
              Resources{' '}
              <span className="bg-yellow-400 text-black px-2 py-0.5 text-xs rounded">New</span>
            </li>
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">
              Testimonials
            </li>
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">
              Contact Us
            </li>
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">
              Newsletter
            </li>
          </ul>
        </div>

        {/* Section 2 */}
        <div>
          <h3 className="font-semibold text-lg">News</h3>
          <ul className="mt-5 text-gray-600 dark:text-gray-400">
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">
              Trending Stories
            </li>
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">
              Featured Videos
            </li>
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">
              Technology
            </li>
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">Health</li>
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">Politics</li>
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">
              Environment
            </li>
          </ul>
        </div>

        {/* Section 3 */}
        <div>
          <h3 className="font-semibold text-lg">Blogs</h3>
          <ul className="mt-5 text-gray-600 dark:text-gray-400">
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">
              Quantum Computing
            </li>
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">
              AI Ethics
            </li>
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">
              Space Exploration
            </li>
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">
              Biotechnology{' '}
              <span className="bg-yellow-400 text-black px-2 py-0.5 text-xs rounded">New</span>
            </li>
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">
              Renewable Energy
            </li>
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">
              Biohacking
            </li>
          </ul>
        </div>

        {/* Section 4 */}
        <div>
          <h3 className="font-semibold text-lg">Podcasts</h3>
          <ul className="mt-5 text-gray-600 dark:text-gray-400">
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">
              AI Revolution
            </li>
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">
              AI Revolution{' '}
              <span className="bg-yellow-400 text-black px-2 py-0.5 text-xs rounded">New</span>
            </li>
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">
              TechTalk AI
            </li>
            <li className="mt-3 hover:text-black dark:hover:text-white cursor-pointer">
              AI Conversations
            </li>
          </ul>
        </div>

        {/* Section 5 */}
        <div>
          <h3 className="font-semibold text-lg">Resources</h3>
          <div className="mt-5 space-y-3">
            {['Whitepapers', 'Ebooks', 'Reports', 'Research Papers'].map((item, i) => (
              <Card
                key={i}
                className="p-3 bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
              >
                {item} ↗
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-12 border-t border-gray-300 dark:border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <p>© 2025 Blogify. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="https://x.com" aria-label="Twitter" target="_blank">
            <Twitter className="hover:text-blue-500 transition" />
          </Link>
          <Link href="https://linkedin.com" aria-label="LinkedIn" target="_blank">
            <Linkedin className="hover:text-blue-700 transition" />
          </Link>
          <Link href="https://instagram.com" aria-label="Instagram" target="_blank">
            <Instagram className="hover:text-pink-500 transition" />
          </Link>
          <Link href="https://facebook.com" aria-label="Facebook" target="_blank">
            <Facebook className="hover:text-blue-600 transition" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
