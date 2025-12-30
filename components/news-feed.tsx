"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import NewsPopularityGraph from "./news-popularity-graph"
import CategoryFilter from "./category-filter"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NewsItem {
  id: string
  title: string
  description: string
  category: string
  source: string
  created_at: string
  link: string
  image_url: string
  content?: string
  tags?: string[]
}

interface NewsFeedProps {
  initialNews: NewsItem[]
}

export default function NewsFeed({ initialNews }: NewsFeedProps) {
  const [news, setNews] = useState(initialNews)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [visibleItems, setVisibleItems] = useState(12)
  const [openDialogs, setOpenDialogs] = useState<{ [key: string]: boolean }>({})

  const handleClose = (id: string) => setOpenDialogs((prev) => ({ ...prev, [id]: false }))

  //const handleOpen = (id: string) => setOpenDialogs((prev) => ({ ...prev, [id]: true }))

  const sortedNews = useMemo(() => {
    return [...news].sort((a, b) => {
      const idA = Number.parseInt(a.id)
      const idB = Number.parseInt(b.id)
      return idB - idA // Sort in descending order
    })
  }, [news])

  const allTags = [...new Set(sortedNews.flatMap((article) => article.tags || []))]
  const allCategories = [...new Set(sortedNews.map((article) => article.category))]

  const filteredNews = sortedNews.filter(
    (article) =>
      (selectedCategory === null || article.category === selectedCategory) &&
      (selectedTags.length === 0 || selectedTags.some((tag) => article.tags && article.tags.includes(tag))),
  )

  const visibleNews = filteredNews.slice(0, visibleItems)

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const loadMore = () => {
    setVisibleItems((prev) => prev + 12)
  }

  const renderArticleContent = (articleContent: string | null | undefined) => {
    if (!articleContent) {
      console.log("No content available for article")
      return "<p>Content not available</p>"
    }

    if (!articleContent.trim().startsWith("<div")) {
      articleContent = `<div class="article-content">${articleContent}</div>`
    }

    return articleContent
  }

  return (
    <>
      <CategoryFilter
        categories={allCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <div className="mb-4 mt-2">
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {visibleNews.map((article) => (
          <div key={article.id} className="group h-full">
            <Card className="overflow-hidden flex flex-col h-full transition-all duration-200 hover:bg-card-hover hover:shadow-lg hover:scale-105">
              <Dialog
                open={openDialogs[article.id]}
                onOpenChange={(isOpen) => setOpenDialogs((prev) => ({ ...prev, [article.id]: isOpen }))}
              >
                <CardHeader className="relative p-0">
                  <DialogTrigger className="w-full">
                    {article.image_url && (
                      <div className="relative w-full h-48 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-shimmer"></div>
                        <Image
                          src={article.image_url || "/placeholder.svg"}
                          alt={article.title}
                          layout="fill"
                          objectFit="cover"
                          className="cursor-pointer transition-all duration-500 ease-in-out transform group-hover:scale-110 opacity-0 animate-fade-in"
                          onLoadingComplete={(image) => image.classList.remove("opacity-0")}
                        />
                        <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none"></div>
                      </div>
                    )}
                  </DialogTrigger>
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    {article.category}
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <DialogTrigger asChild>
                      <CardTitle className="text-xl mb-2 cursor-pointer transition-all duration-200">
                        <span className="bg-gradient-to-r from-white to-blue-400 bg-[length:0%_2px] hover:bg-[length:100%_2px] bg-left-bottom bg-no-repeat transition-all duration-500 ease-out">
                          {article.title}
                        </span>
                      </CardTitle>
                    </DialogTrigger>
                    <p className="text-sm text-muted-foreground mb-4">
                      {article.source} • {new Date(article.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm mb-4">{article.description}</p>
                  </div>
                  {article.tags && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <DialogContent className="sm:max-w-[425px] md:max-w-[640px] lg:max-w-[900px] max-w-full w-full h-full sm:h-auto overflow-hidden flex flex-col">
                  <div className="flex-1 overflow-hidden flex">
                    <ScrollArea className="h-[calc(100vh-8rem)] w-full lg:w-2/3 pr-4">
                      <div className="px-6 pb-32">
                        {" "}
                        {/* Changed from pb-20 to pb-32 for more padding at the bottom */}
                        <DialogHeader className="space-y-4">
                          <DialogTitle className="text-xl leading-relaxed bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                            {article.title}
                          </DialogTitle>
                          <DialogDescription className="text-sm">
                            {article.source} • {new Date(article.created_at).toLocaleDateString()}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-6">
                          {article.image_url && (
                            <div className="relative w-full h-64 mb-6">
                              <Image
                                src={article.image_url || "/placeholder.svg"}
                                alt={article.title}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg"
                              />
                            </div>
                          )}
                          <article
                            className="prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: renderArticleContent(article.content),
                            }}
                          />
                        </div>
                      </div>
                    </ScrollArea>
                    <div className="hidden lg:block w-1/3 border-l border-gray-700 pl-4">
                      <h3 className="text-lg font-semibold mb-4">Więcej wiadomości</h3>
                      <ScrollArea className="h-[calc(100vh-10rem)]">
                        {sortedNews.slice(0, 5).map((relatedArticle) => (
                          <div key={relatedArticle.id} className="mb-4">
                            <DialogTrigger asChild>
                              <div
                                className="cursor-pointer"
                                onClick={() => setOpenDialogs((prev) => ({ ...prev, [relatedArticle.id]: true }))}
                              >
                                <div className="relative w-full h-24 mb-2">
                                  <Image
                                    src={relatedArticle.image_url || "/placeholder.svg"}
                                    alt={relatedArticle.title}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-md"
                                  />
                                </div>
                                <h4 className="text-sm font-medium">{relatedArticle.title}</h4>
                                <p className="text-xs text-gray-400">
                                  {new Date(relatedArticle.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </DialogTrigger>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  </div>
                  <div className="flex-shrink-0 mt-auto border-t">
                    <Button variant="ghost" className="w-full h-12" onClick={() => handleClose(article.id)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Wstecz
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>
          </div>
        ))}
      </div>
      {visibleItems < filteredNews.length && (
        <div className="mt-8 text-center">
          <Button onClick={loadMore}>Więcej</Button>
        </div>
      )}
      <div className="mt-12">
        <NewsPopularityGraph newsData={news} />
      </div>
    </>
  )
}
