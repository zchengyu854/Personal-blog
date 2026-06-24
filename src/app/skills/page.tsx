'use client'

import dynamic from 'next/dynamic'

const SkillsClient = dynamic(() => import('./SkillsClient'), {
  ssr: false,
})

export default function Skills() {
  return <SkillsClient />
}
