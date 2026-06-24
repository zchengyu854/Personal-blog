'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Code, Database, Server, Palette, Rocket, Shield } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import RadarChart from '../../components/RadarChart'
import { useLanguage } from '../../lib/language'
import { getSkills, getSkillCategories, Skill } from '../../lib/api'

const categoryIcons: Record<string, typeof Code> = {
  '前端技术': Code,
  'Frontend': Code,
  '后端技术': Server,
  'Backend': Server,
  '数据库': Database,
  'Database': Database,
  'DevOps & 云服务': Rocket,
  'DevOps & Cloud': Rocket,
  '设计': Palette,
  'Design': Palette,
  '安全': Shield,
  'Security': Shield,
}

const categoryColors: Record<string, string> = {
  '前端技术': 'bg-blue-500',
  'Frontend': 'bg-blue-500',
  '后端技术': 'bg-green-500',
  'Backend': 'bg-green-500',
  '数据库': 'bg-purple-500',
  'Database': 'bg-purple-500',
  'DevOps & 云服务': 'bg-orange-500',
  'DevOps & Cloud': 'bg-orange-500',
  '设计': 'bg-pink-500',
  'Design': 'bg-pink-500',
  '安全': 'bg-red-500',
  'Security': 'bg-red-500',
}

const categoryTranslationKeys: Record<string, string> = {
  '前端技术': 'category.frontend',
  'Frontend': 'category.frontend',
  '后端技术': 'category.backend',
  'Backend': 'category.backend',
  '数据库': 'category.database',
  'Database': 'category.database',
  'DevOps & 云服务': 'category.devops',
  'DevOps & Cloud': 'category.devops',
  '设计': 'category.design',
  'Design': 'category.design',
  '安全': 'category.security',
  'Security': 'category.security',
}

export default function SkillsClient() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsData, categoriesData] = await Promise.all([
          getSkills(),
          getSkillCategories(),
        ])
        setSkills(skillsData)
        setCategories(categoriesData.length > 0 ? categoriesData : ['前端技术', '后端技术', '数据库', 'DevOps & 云服务', '设计', '安全'])
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setCategories(['前端技术', '后端技术', '数据库', 'DevOps & 云服务', '设计', '安全'])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getCategoryName = (category: string) => {
    const key = categoryTranslationKeys[category]
    return key ? t(key) : category
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <section className="pt-24 pb-16 bg-gradient-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('skills.title')}</h1>
              <p className="text-gray-300 text-lg">{t('skills.subtitle')}</p>
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

  const skillsByCategory = categories.reduce((acc, category) => {
    acc[category] = skills.filter(s => s.category === category)
    if (acc[category].length === 0) {
      acc[category] = []
    }
    return acc
  }, {} as Record<string, Skill[]>)

  const radarData = categories.map((category) => {
    const catSkills = skillsByCategory[category]
    if (catSkills.length === 0) {
      return { subject: getCategoryName(category), A: 70, fullMark: 100 }
    }
    const avgLevel = catSkills.reduce((sum, s) => sum + s.level, 0) / catSkills.length
    return { subject: getCategoryName(category), A: Math.round(avgLevel), fullMark: 100 }
  })

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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('skills.title')}</h1>
            <p className="text-gray-300 text-lg">{t('skills.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <RadarChart data={radarData} />
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-6">{t('skills.overview')}</h2>
              <div className="space-y-4">
                {radarData.map((data, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {data.subject}
                      </span>
                      <span className="text-primary font-semibold">{data.A}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${data.A}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-gradient-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">{t('skills.categories')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, catIndex) => {
              const IconComponent = categoryIcons[category] || Code
              const color = categoryColors[category] || 'bg-blue-500'
              const catSkills = skillsByCategory[category]
              
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIndex * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${color}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold">{getCategoryName(category)}</h3>
                  </div>
                  <div className="space-y-3">
                    {catSkills.length > 0 ? (
                      catSkills.map((skill, skillIndex) => (
                        <div key={skill.id}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {skill.name}
                            </span>
                            <span className="text-sm text-gray-500">{skill.level}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: skillIndex * 0.05 }}
                              className={`h-full ${color}`}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-sm">{t('skills.noData')}</div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
