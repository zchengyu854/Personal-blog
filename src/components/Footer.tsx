'use client'

import { useState, useEffect } from 'react'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { useLanguage } from '../lib/language'
import Link from 'next/link'
import { getContactInfo, ContactInfo } from '../lib/api'

export default function Footer() {
  const { t } = useLanguage()
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([])
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const data = await getContactInfo()
        setContactInfo(data)
      } catch (error) {
        console.error('Failed to fetch contact info:', error)
      }
    }
    fetchContactInfo()
  }, [])

  const email = contactInfo.find(c => c.type === 'email')
  const phone = contactInfo.find(c => c.type === 'phone')
  const address = contactInfo.find(c => c.type === 'address')

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-gradient mb-4">Portfolio</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              {t('footer.welcome')}
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href={email?.link || 'mailto:email@example.com'}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors">{t('nav.home')}</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors">{t('nav.about')}</Link>
              </li>
              <li>
                <Link href="/skills" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors">{t('nav.skills')}</Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors">{t('nav.projects')}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t('footer.contactMe')}</h4>
            <ul className="space-y-2">
              {email && (
                <li className="text-gray-600 dark:text-gray-400">
                  <a href={email.link!} className="hover:text-primary dark:hover:text-primary-400 transition-colors">{email.content}</a>
                </li>
              )}
              {phone && (
                <li className="text-gray-600 dark:text-gray-400">
                  <a href={phone.link!} className="hover:text-primary dark:hover:text-primary-400 transition-colors">{phone.content}</a>
                </li>
              )}
              {address && (
                <li className="text-gray-600 dark:text-gray-400">{address.content}</li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} Portfolio. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
