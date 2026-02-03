"use server"

// This interface defines the structure of the analyzed search intent
export interface SearchAnalysis {
  category?: string
  brand?: string
  searchTerms?: string
  priceRange?: {
    min?: number
    max?: number
  }
}

/**
 * Server Action that analyzes a search query to extract structured information
 * @param query The search query from the user
 * @returns Structured information about the search intent
 */
export async function analyzeSearchIntent(query: string): Promise<SearchAnalysis> {
  console.log("Analyzing search intent with Groq:", query)

  try {
    // Direct API call to Groq
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
              Extract structured information from the user's product search query.
              Return a JSON object with these fields:
              - category: One of [electronics, office, furniture, it, other] or null if not specified
              - brand: The brand name mentioned in the query or null if not specified
              - searchTerms: A comma-separated list of key terms that would help find matching products
              - priceRange: An object with min and max fields (in points, where 1 USD = 100 points) or null if not specified
              
              Only include fields that can be confidently extracted from the input.
              Format your response as valid JSON without any additional text.
            `,
          },
          {
            role: "user",
            content: `Analyze this search query: "${query}"`,
          },
        ],
        temperature: 0.2,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API returned ${response.status}: ${await response.text()}`)
    }

    const result = await response.json()
    const responseText = result.choices[0].message.content

    console.log("Groq response:", responseText)

    try {
      // Parse the JSON response
      return JSON.parse(responseText)
    } catch (parseError) {
      console.error("Failed to parse LLM response:", parseError)
      console.log("Raw response:", responseText)

      // Fallback to the simplified version if parsing fails
      return fallbackAnalysis(query)
    }
  } catch (error) {
    console.error("Error calling Groq API:", error)

    // Fallback to the simplified version if the API call fails
    return fallbackAnalysis(query)
  }
}

/**
 * Fallback function that uses regex pattern matching when the API call fails
 */
function fallbackAnalysis(query: string): SearchAnalysis {
  const result: SearchAnalysis = {}

  // Extract category based on keywords
  if (
    /laptop|computer|monitor|keyboard|mouse|headphone|tablet|phone|iphone|macbook|dell|lenovo|asus|samsung/i.test(query)
  ) {
    result.category = "electronics"
  } else if (/chair|desk|table|furniture|cabinet|bookcase|shelf|filing|drawer/i.test(query)) {
    result.category = "furniture"
  } else if (/paper|pen|pencil|stapler|supplies|printer|ink|toner|shredder/i.test(query)) {
    result.category = "office"
  } else if (/server|network|switch|router|firewall|software|license|nas|ups|backup/i.test(query)) {
    result.category = "it"
  }

  // Extract brand names
  const brands = [
    "dell",
    "apple",
    "hp",
    "lenovo",
    "asus",
    "microsoft",
    "samsung",
    "lg",
    "acer",
    "sony",
    "herman miller",
    "steelcase",
    "autonomous",
    "uplift",
    "fully",
    "cisco",
    "ubiquiti",
    "fortinet",
  ]

  for (const brand of brands) {
    if (query.toLowerCase().includes(brand.toLowerCase())) {
      result.brand = brand
      break
    }
  }

  // Extract search terms
  const searchTerms: string[] = []
  const words = query.toLowerCase().split(/\s+/)

  // Add words that are not stop words
  const stopWords = ["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by"]
  for (const word of words) {
    if (!stopWords.includes(word) && word.length > 2) {
      searchTerms.push(word)
    }
  }

  if (searchTerms.length > 0) {
    result.searchTerms = searchTerms.join(", ")
  }

  return result
}
