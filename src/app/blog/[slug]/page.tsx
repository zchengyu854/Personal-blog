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
            <div className="flex items-start justify-between mb-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                {t('blog.backToList')}
              </Link>
              
              <span className="inline-flex items-center gap-1 px-4 py-1.5 text-sm font-medium bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20">
                <Tag size={14} />
                {post.category}
              </span>
            </div>
            
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
                <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-8 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {t('blog.tag')}
                  </span>
                  <div className="flex flex-wrap gap-2 justify-end">
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
                </div>

                <div className="markdown-body prose prose-lg max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 flex items-center gap-3">
                          <span className="w-1 h-7 bg-gradient-to-b from-primary to-secondary rounded-full" />
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-5 mb-2">
                          {children}
                        </h4>
                      ),
                      p: ({ children }) => (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed my-4 text-base">
                          {children}
                        </p>
                      ),
                      a: ({ href, children }) => (
                        <a href={href} className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-bold text-gray-900 dark:text-white">
                          {children}
                        </strong>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-6 my-4 space-y-2 text-gray-700 dark:text-gray-300">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-6 my-4 space-y-2 text-gray-700 dark:text-gray-300">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="leading-relaxed">
                          {children}
                        </li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary bg-primary/5 py-4 px-6 my-6 rounded-r-lg text-gray-700 dark:text-gray-300 italic">
                          {children}
                        </blockquote>
                      ),
                      code: ({ className, children }) => {
                        const isBlock = className?.includes('language-')
                        if (isBlock) {
                          return (
                            <pre className="bg-gray-900 text-gray-100 rounded-xl p-5 my-6 overflow-x-auto shadow-lg">
                              <code className="text-sm">{children}</code>
                            </pre>
                          )
                        }
                        return (
                          <code className="bg-gray-100 dark:bg-gray-700 text-primary px-2 py-0.5 rounded text-sm font-mono">
                            {children}
                          </code>
                        )
                      },
                      pre: ({ children }) => (
                        <pre className="bg-gray-900 text-gray-100 rounded-xl p-5 my-6 overflow-x-auto shadow-lg">
                          {children}
                        </pre>
                      ),
                      img: ({ src, alt }) => (
                        <img
                          src={src}
                          alt={alt || ''}
                          className="rounded-xl shadow-md my-6 max-w-full h-auto"
                        />
                      ),
                      hr: () => (
                        <hr className="my-8 border-gray-200 dark:border-gray-700" />
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-6">
                          <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th className="bg-gray-100 dark:bg-gray-700 px-4 py-3 text-left font-bold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                          {children}
                        </td>
                      ),
                    }}
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