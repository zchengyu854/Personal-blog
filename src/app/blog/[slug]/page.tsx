'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Eye, Tag } from 'lucide-react'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import Link from 'next/link'
import { useLanguage } from '../../../lib/language'
import { apiRequestNoAuth, ApiResponse, BlogPost } from '../../../lib/api'

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
    const fetchPost = async () => {
      try {
        const response = await apiRequestNoAuth<BlogPost>(`/api/blog/posts/slug/${params.slug}`)
        setPost(response.data)
      } catch (error) {
        console.error('Failed to fetch blog post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.slug])

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

  if (!post) {
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
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">{t('blog.notFound')}</p>
            <Link href="/blog" className="inline-flex items-center gap-2 mt-4 text-primary hover:underline">
              <ArrowLeft size={20} />
              {t('blog.backToList')}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              {t('blog.backToList')}
            </Link>
            <span className="inline-block px-3 py-1 text-xs font-medium bg-white/10 text-white rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-300">
              <span className="flex items-center gap-2">
                <Calendar size={18} />
                {post.created_at?.split('T')[0]}
              </span>
              <span className="flex items-center gap-2">
                <Eye size={18} />
                {post.view_count} {t('blog.views')}
              </span>
              <span className="flex items-center gap-2">
                {post.read_time} {t('blog.minRead')}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none dark:prose-invert"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12">
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
                  >
                    <Tag size={14} />
                    {tag}
                  </span>
                ))}
              </div>
              <div
                className="prose prose-gray dark:prose-light"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </motion.article>
        </div>
      </section>

      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t('blog.related')}</h2>
            <p className="text-gray-500 dark:text-gray-400">{t('blog.morePosts')}</p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 mt-6 text-primary font-semibold hover:underline"
            >
              {t('blog.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}