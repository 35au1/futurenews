"use server"

const SUPABASE_URL = "https://psgjojqygtktguzelpae.supabase.co"
const SUPABASE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZ2pvanF5Z3RrdGd1emVscGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMDQxOTAsImV4cCI6MjA4MjU4MDE5MH0.z6J11Sqw5mnUUVogEUqJjsViWU5pmSoIVkwqqvgYCZs"

export async function fetchUfoNews() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/ufo_news?select=*`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("Supabase response not OK:", response.status)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Debug logging
    if (data && data.length > 0) {
      console.log("First article data:", {
        id: data[0].id,
        title: data[0].title,
        hasContent: Boolean(data[0].article_content),
        contentLength: data[0].article_content?.length,
      })
    } else {
      console.log("No data received from Supabase")
    }

    return data
  } catch (error) {
    console.error("Error fetching news:", error)
    return []
  }
}
