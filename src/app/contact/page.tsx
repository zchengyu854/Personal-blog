'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Globe, MessageCircle } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useLanguage } from '../../lib/language'
import { submitContactMessage, getContactInfo, ContactInfo } from '../../lib/api'

const typeIcons: Record<string, typeof Mail> = {
  email: Mail,
  phone: Phone,
  address: MapPin,
  social: Globe,
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { t, language } = useLanguage()

  const typeLabels: Record<string, string> = {
    email: t('contact.type.email'),
    phone: t('contact.type.phone'),
    address: t('contact.type.address'),
    social: t('contact.type.social'),
  }

  const subjectOptions = [
    { value: '', label: t('contact.selectSubject') },
    { value: language === 'zh' ? '咨询' : 'Consultation', label: t('contact.consultation') },
    { value: language === 'zh' ? '合作' : 'Cooperation', label: t('contact.cooperation') },
    { value: language === 'zh' ? '招聘' : 'Job', label: t('contact.job') },
    { value: language === 'zh' ? '其他' : 'Other', label: t('contact.other') },
  ]

  useEffect(() => {
    setMounted(true)
    const fetchData = async () => {
      try {
        const data = await getContactInfo()
        setContactInfo(data)
      } catch (error) {
        console.error('Failed to fetch contact info:', error)
        setContactInfo([
          { id: 1, type: 'email', content: 'email@example.com', link: 'mailto:email@example.com', is_active: true, order: 0 },
          { id: 2, type: 'phone', content: '+86 123 4567 8900', link: 'tel:+8612345678900', is_active: true, order: 1 },
          { id: 3, type: 'address', content: language === 'zh' ? '北京市朝阳区科技园区' : 'Beijing Chaoyang District', link: null, is_active: true, order: 2 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [language])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <section className="pt-24 pb-16 bg-gradient-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('contact.title')}</h1>
              <p className="text-gray-300 text-lg">{t('contact.subtitle')}</p>
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await submitContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || undefined,
        content: formData.message,
      })
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      console.error('Failed to submit message:', error)
    } finally {
      setIsSubmitting(false)
    }
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('contact.title')}</h1>
            <p className="text-gray-300 text-lg">{t('contact.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-2xl font-bold">{t('contact.sendMessage')}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{t('contact.fillForm')}</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                    placeholder={t('contact.yourName')}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.subject')}
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  >
                    {subjectOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none"
                    placeholder={t('contact.enterMessage')}
                  />
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('contact.sending')}
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      {t('contact.sendBtn')}
                    </>
                  )}
                </motion.button>
                
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-green-600 dark:text-green-400"
                  >
                    ✓ {t('contact.success')}
                  </motion.div>
                )}
              </form>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Mail className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-2xl font-bold">{t('contact.contactInfo')}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{t('contact.variousWays')}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {contactInfo.map((info) => {
                  const IconComponent = typeIcons[info.type] || Globe
                  const label = typeLabels[info.type] || info.type
                  return (
                    <motion.div
                      key={info.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow"
                    >
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">{label}</div>
                        {info.link ? (
                          <a
                            href={info.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary-400 transition-colors"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
                            {info.content}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              
              <div className="mt-12 bg-gradient-primary rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{t('contact.readyToStart')}</h3>
                <p className="text-white/80 mb-4">
                  {t('contact.letsCreate')}
                </p>
                {contactInfo.find(c => c.type === 'email')?.link ? (
                  <a
                    href={contactInfo.find(c => c.type === 'email')?.link!}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-white dark:bg-gray-700 text-primary dark:text-white font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Mail size={20} />
                    {t('contact.sendEmail')}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 px-6 py-2 bg-white/20 text-white font-semibold rounded-lg">
                    <Mail size={20} />
                    {t('contact.contactMe')}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
