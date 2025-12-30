import NewsFeed from "@/components/news-feed"
import { fetchUfoNews } from "./actions"

export const revalidate = 0 // This ensures the page is not cached

export default async function Home() {
  const initialNews = await fetchUfoNews()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-6 container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-300 to-blue-500 bg-clip-text text-transparent transition-all duration-300 ease-in-out hover:from-blue-300 hover:via-blue-500 hover:to-white cursor-default">
          Zdarzyło się
        </h1>
        <p className="text-sm mt-1 bg-gradient-to-r from-gray-200 via-blue-200 to-blue-300 bg-clip-text text-transparent transition-all duration-300 ease-in-out hover:from-blue-200 hover:via-blue-300 hover:to-gray-200 cursor-default">
          NewsHub poczciwego polskiego Geeka
        </p>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8">
          <div>
            <NewsFeed initialNews={initialNews} />
          </div>
        </div>
      </main>
    </div>
  )
}
