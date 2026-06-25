'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Tag, Search, BookOpen } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { useLanguage } from '../../lib/language'
import { getBlogPosts, BlogPost } from '../../lib/api'

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()

  const allLabel = t('projects.all')

  useEffect(() => {
    setMounted(true)
    const fetchData = async () => {
      try {
        const postsData = await getBlogPosts()
        setBlogPosts(postsData.items)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const categories = [allLabel, ...new Set(blogPosts.map(p => p.category))]
  const allTags = [...new Set(blogPosts.flatMap(p => p.tags))]

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === allLabel || selectedCategory === '' || post.category === selectedCategory
    const matchesTag = !selectedTag || post.tags.includes(selectedTag)
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesTag && matchesSearch
  })

  if (!mounted || loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <section className="pt-24 pb-16 bg-gradient-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('blog.title')}</h1>
              <p className="text-gray-300 text-lg">{t('blog.subtitle')}</p>
            </div>
          </div>
        </section>
        <div className="flex items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('blog.title')}</h1>
            <p className="text-gray-300 text-lg">{t('blog.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('blog.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <span className="flex items-center gap-2 text-gray-500 text-sm">{t('blog.category')}：</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category)
                  setSelectedTag(null)
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-12">
            <span className="flex items-center gap-2 text-gray-500 text-sm">{t('blog.tag')}：</span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTag === tag
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <Link
                href={`/blog/${post.slug}`}
                key={post.id}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3">
                  <Tag size={12} />
                  {post.category}
                </span>
                <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {post.created_at?.split('T')[0] || ''}
                  </span>
                  <span>{post.read_time}{t('blog.readTime')}</span>
                </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t('blog.noResults')}</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}