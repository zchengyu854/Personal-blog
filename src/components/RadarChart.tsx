'use client'

import { motion } from 'framer-motion'

interface RadarDataItem {
  subject: string
  A: number
  fullMark: number
}

interface RadarChartProps {
  data: RadarDataItem[]
}

export default function RadarChart({ data }: RadarChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-2xl font-bold mb-6">技能雷达图</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="relative w-full aspect-square">
          <svg viewBox="0 0 260 260" className="w-full h-full">
            {[100, 80, 60, 40, 20].map((radius) => (
              <circle
                key={radius}
                cx="130"
                cy="130"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-200 dark:text-gray-700"
              />
            ))}
            {data.map((item, index) => {
              const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2
              const x = 130 + 100 * Math.cos(angle)
              const y = 130 + 100 * Math.sin(angle)
              return (
                <line
                  key={`line-${index}`}
                  x1="130"
                  y1="130"
                  x2={x}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-gray-200 dark:text-gray-700"
                />
              )
            })}
            <polygon
              points={data
                .map((item, index) => {
                  const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2
                  const x = 130 + (item.A * 100) / item.fullMark * Math.cos(angle)
                  const y = 130 + (item.A * 100) / item.fullMark * Math.sin(angle)
                  return `${x},${y}`
                })
                .join(' ')}
              fill="url(#radar-gradient)"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <defs>
              <linearGradient id="radar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {data.map((item, index) => {
              const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2
              const labelRadius = 115
              const x = 130 + labelRadius * Math.cos(angle)
              const y = 130 + labelRadius * Math.sin(angle)
              let textAnchor = 'middle'
              let dominantBaseline = 'middle'
              if (x < 130 - 20) textAnchor = 'end'
              if (x > 130 + 20) textAnchor = 'start'
              if (y < 130 - 20) dominantBaseline = 'hanging'
              if (y > 130 + 20) dominantBaseline = 'baseline'
              return (
                <text
                  key={`text-${index}`}
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  dominantBaseline={dominantBaseline}
                  className="text-xs fill-gray-600 dark:fill-gray-400 font-medium"
                >
                  {item.subject}
                </text>
              )
            })}
          </svg>
        </div>
      </div>
    </motion.div>
  )
}
