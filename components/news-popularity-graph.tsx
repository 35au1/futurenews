"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export default function NewsPopularityGraph({ newsData }) {
  const sortedNewsData = useMemo(() => {
    return [...newsData].sort((a, b) => {
      const idA = Number.parseInt(a.id)
      const idB = Number.parseInt(b.id)
      return idB - idA // Sort in descending order
    })
  }, [newsData])

  // Calculate category popularity
  const categoryPopularity = sortedNewsData.reduce((acc, article) => {
    const category = article.category.toLowerCase()
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  // Convert to array format for Recharts
  const data = Object.entries(categoryPopularity).map(([category, count]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize first letter
    popularity: count,
  }))

  // Sort data by popularity (descending)
  data.sort((a, b) => b.popularity - a.popularity)

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Popularność newsów po kategorii</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} layout="vertical" margin={{ left: 150 }}>
            <XAxis type="number" />
            <YAxis dataKey="category" type="category" width={140} tick={{ fontSize: 12 }} />
            <Bar dataKey="popularity" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
