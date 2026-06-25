'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Eye, Tag, Clock, Share2, ArrowRight } from 'lucide-react'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useLanguage } from '../../../lib/language'
import { apiRequestNoAuth, BlogPost } from '../../../lib/api'

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <section className="pt-24 pb-16 bg-gradient-hero">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <section className="pt-24 pb-16 bg-gradient-hero">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      
      <section className="pt-28 pb-16 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              {t('blog.backToList')}
            </Link>
            
            <span className="inline-flex items-center gap-1 px-4 py-1.5 text-sm font-medium bg-white/10 backdrop-blur-sm text-white rounded-full mb-5 border border-white/20">
              <Tag size={14} />
              {post.category}
            </span>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-gray-200 text-lg mb-8 max-w-2xl">
              {post.excerpt}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-300">
              <span className="flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                {post.created_at?.split('T')[0]}
              </span>
              <span className="flex items-center gap-2">
                <Eye size={18} className="text-primary" />
                {post.view_count} {t('blog.views')}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={18} className="text-primary" />
                {post.read_time} {t('blog.minRead')}
              </span>
              <button className="flex items-center gap-2 hover:text-white transition-colors">
                <Share2 size={18} className="text-primary" />
                {t('blog.share')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 -mt-8 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8 md:p-12 lg:p-16">
                <div className="flex flex-wrap gap-2 mb-10 pb-8 border-b border-gray-100 dark:border-gray-700">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full border border-primary/20 hover:border-primary/40 transition-colors"
                    >
                      <Tag size={13} />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-primary prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-6 prose-pre:shadow-lg prose-pre:overflow-x-auto prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-4 prose-blockquote:pr-6 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-img:rounded-xl prose-img:shadow-md prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-2">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('blog.related')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
              {t('blog.morePosts')}
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
            >
              {t('blog.viewAll')}
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}