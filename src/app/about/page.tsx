'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, GraduationCap, Briefcase, Award, Heart } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useLanguage } from '../../lib/language'
import {
  getAboutProfile,
  getExperiences,
  getEducation,
  getAchievements,
  getStats,
  AboutProfile,
  Experience,
  Achievement,
  Stat,
} from '../../lib/api'

export default function About() {
  const [profile, setProfile] = useState<AboutProfile | null>(null)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Experience[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
    const fetchData = async () => {
      try {
        const [profileData, expData, eduData, achData, statsData] = await Promise.all([
          getAboutProfile(),
          getExperiences(),
          getEducation(),
          getAchievements(),
          getStats(),
        ])
        setProfile(profileData)
        setExperiences(expData)
        setEducation(eduData)
        setAchievements(achData)
        setStats(statsData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <section className="pt-24 pb-16 bg-gradient-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('about.title')}</h1>
              <p className="text-gray-300 text-lg">{t('about.subtitle')}</p>
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('about.title')}</h1>
            <p className="text-gray-300 text-lg">{t('about.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="w-80 h-80 mx-auto rounded-full bg-gradient-primary p-2">
                  <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-40 h-40 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                  <div className="text-3xl font-bold text-gradient">{stats[0]?.value || '5+'}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stats[0]?.label || t('about.yearsExperience')}</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-4">{t('about.intro')}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {profile?.content || t('about.bio')}
              </p>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Heart className="w-5 h-5 text-red-500" />
                <span>{t('about.passion')}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <Briefcase className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-3xl font-bold">{t('about.workExperience')}</h2>
              <p className="text-gray-600 dark:text-gray-400">{t('about.myCareer')}</p>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
            
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative flex flex-col md:flex-row items-start gap-6 mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <div className="text-sm text-primary font-semibold mb-2">{exp.year}</div>
                    <h3 className="text-xl font-bold mb-1">{exp.title}</h3>
                    <p className="text-gray-500 mb-3">{exp.company}</p>
                    <p className="text-gray-600 dark:text-gray-400">{exp.description}</p>
                  </div>
                </div>
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <div className="md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <GraduationCap className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-3xl font-bold">{t('about.education')}</h2>
              <p className="text-gray-600 dark:text-gray-400">{t('about.myLearning')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {education.map((edu) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-primary font-semibold mb-1">{edu.year}</div>
                    <h3 className="text-lg font-bold mb-1">{edu.title}</h3>
                    <p className="text-gray-500 mb-1">{edu.school}</p>
                    <p className="text-gray-600 dark:text-gray-400">{edu.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <Award className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-3xl font-bold">{t('about.achievements')}</h2>
              <p className="text-gray-600 dark:text-gray-400">{t('about.myAchievements')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-600 dark:text-gray-400">{achievement.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}