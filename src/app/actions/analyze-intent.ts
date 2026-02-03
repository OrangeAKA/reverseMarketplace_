"use server"

// This interface defines the structure of the analyzed intent
export interface AnalyzedIntent {
  productCategory?: string
  productName?: string
  description?: string
  quantity?: number
  budget?: number
  requiredBy?: string
  additionalSuggestions?: string
  searchTerms?: string // Added to help with product matching
}

/**
 * Server Action that analyzes a natural language request to extract structured information
 * @param input The natural language input from the user
 * @returns Structured information about the request
 */
export async function analyzeRequestIntent(input: string): Promise<AnalyzedIntent> {
  console.log("Analyzing intent with Groq:", input)

  try {
    // Direct API call to Groq with an updated model
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // Updated to a currently supported model
        messages: [
          {
            role: "system",
            content: `
              Extract structured information from the user's product request.
              Return a JSON object with these fields:
              - productCategory: One of [electronics, office, furniture, it, other]
              - productName: The name or type of product
              - description: A detailed description based on the request
              - quantity: The number of items requested (default to 1 if not specified)
              - budget: The budget per unit (if mentioned)
              - requiredBy: The required date in YYYY-MM-DD format (if mentioned)
              - additionalSuggestions: Provide helpful suggestions based on the request (e.g., "Consider adding specifications for RAM and storage" for laptops)
              - searchTerms: A comma-separated list of key terms that would help find matching products (e.g., "laptop, dell, 16gb, ssd" for a Dell laptop request)
              
              Only include fields that can be confidently extracted from the input.
              Format your response as valid JSON without any additional text.
            `,
          },
          {
            role: "user",
            content: `Analyze this product request: "${input}"`,
          },
        ],
        temperature: 0.2,
        max_tokens: 1000,
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
      return fallbackAnalysis(input)
    }
  } catch (error) {
    console.error("Error calling Groq API:", error)

    // Fallback to the simplified version if the API call fails
    return fallbackAnalysis(input)
  }
}

/**
 * Fallback function that uses regex pattern matching when the API call fails
 */
function fallbackAnalysis(input: string): AnalyzedIntent {
  const result: AnalyzedIntent = {}

  // Extract quantity (numbers followed by optional words like "units", "pieces", etc.)
  const quantityMatch = input.match(/(\d+)\s*(units?|pieces?|items?|laptops?|monitors?|desks?)?/i)
  if (quantityMatch) {
    result.quantity = Number.parseInt(quantityMatch[1], 10)
  }

  // Extract budget (numbers preceded by optional $ or followed by optional "dollars", etc.)
  const budgetMatch = input.match(/\$?(\d+(?:\.\d+)?)\s*(dollars?|USD|per\s*unit)?/i)
  if (budgetMatch) {
    result.budget = Number.parseFloat(budgetMatch[1])
  }

  // Extract product category based on keywords
  if (
    /laptop|computer|monitor|keyboard|mouse|headphone|tablet|phone|iphone|macbook|dell|lenovo|asus|samsung/i.test(input)
  ) {
    result.productCategory = "electronics"
  } else if (/chair|desk|table|furniture|cabinet|bookcase|shelf|filing|drawer/i.test(input)) {
    result.productCategory = "furniture"
  } else if (/paper|pen|pencil|stapler|supplies|printer|ink|toner|shredder/i.test(input)) {
    result.productCategory = "office"
  } else if (/server|network|switch|router|firewall|software|license|nas|ups|backup/i.test(input)) {
    result.productCategory = "it"
  } else {
    result.productCategory = "other"
  }

  // Extract product name (this is simplified)
  if (/laptop/i.test(input)) {
    result.productName = "Laptop"
  } else if (/monitor/i.test(input)) {
    result.productName = "Monitor"
  } else if (/desk/i.test(input)) {
    result.productName = "Desk"
  } else if (/chair/i.test(input)) {
    result.productName = "Office Chair"
  } else if (/phone|iphone|smartphone/i.test(input)) {
    result.productName = "Smartphone"
  } else if (/server/i.test(input)) {
    result.productName = "Server"
  } else if (/printer/i.test(input)) {
    result.productName = "Printer"
  } else {
    // Extract the first few words after common phrases
    const nameMatch = input.match(/need\s+(?:a|an|some)?\s+([a-z\s]+)/i)
    if (nameMatch) {
      result.productName = nameMatch[1].trim()
    }
  }

  // Use the input as the description, but clean it up
  result.description = input.trim()

  // Extract date (this is very simplified)
  if (/by\s+(?:the\s+)?end\s+of\s+(\w+)/i.test(input)) {
    const monthMatch = input.match(/by\s+(?:the\s+)?end\s+of\s+(\w+)/i)
    if (monthMatch) {
      const month = monthMatch[1].toLowerCase()
      const date = new Date()

      // Map month names to numbers
      const months: Record<string, number> = {
        january: 0,
        february: 1,
        march: 2,
        april: 3,
        may: 4,
        june: 5,
        july: 6,
        august: 7,
        september: 8,
        october: 9,
        november: 10,
        december: 11,
        jan: 0,
        feb: 1,
        mar: 2,
        apr: 3,
        jun: 5,
        jul: 6,
        aug: 7,
        sep: 8,
        oct: 9,
        nov: 10,
        dec: 11,
      }

      if (months[month] !== undefined) {
        date.setMonth(months[month])
        date.setDate(28) // End of month approximation
        result.requiredBy = date.toISOString().split("T")[0]
      }
    }
  } else if (/next\s+(\w+)/i.test(input)) {
    const timeMatch = input.match(/next\s+(\w+)/i)
    if (timeMatch) {
      const timeUnit = timeMatch[1].toLowerCase()
      const date = new Date()

      if (timeUnit === "week") {
        date.setDate(date.getDate() + 7)
      } else if (timeUnit === "month") {
        date.setMonth(date.getMonth() + 1)
      } else if (timeUnit === "year") {
        date.setFullYear(date.getFullYear() + 1)
      }

      result.requiredBy = date.toISOString().split("T")[0]
    }
  }

  // Extract search terms for product matching
  const searchTerms: string[] = []

  // Add brand names if detected
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
    if (input.toLowerCase().includes(brand.toLowerCase())) {
      searchTerms.push(brand)
    }
  }

  // Add product types
  if (result.productName) {
    searchTerms.push(result.productName)
  }

  // Add specs if mentioned
  const specKeywords = ["i7", "i5", "ryzen", "ssd", "hdd", "ram", "16gb", "32gb", "4k", "uhd", "fhd", "touchscreen"]
  for (const keyword of specKeywords) {
    if (input.toLowerCase().includes(keyword.toLowerCase())) {
      searchTerms.push(keyword)
    }
  }

  if (searchTerms.length > 0) {
    result.searchTerms = searchTerms.join(", ")
  }

  return result
}
