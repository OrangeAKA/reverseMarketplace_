import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

// This interface defines the structure of the analyzed intent
interface AnalyzedIntent {
  productCategory?: string
  productName?: string
  description?: string
  quantity?: number
  budget?: number
  requiredBy?: string
}

/**
 * Analyzes a natural language request to extract structured information
 * @param input The natural language input from the user
 * @returns Structured information about the request
 */
export async function analyzeRequestIntent(input: string): Promise<AnalyzedIntent> {
  try {
    // Using Groq's powerful LLM to analyze the request
    const result = await generateText({
      model: groq("llama-3.1-70b-versatile", {
        apiKey: process.env.GROQ_API_KEY,
      }),
      prompt: `Analyze this product request: "${input}"`,
      system: `
        Extract structured information from the user's product request.
        Return a JSON object with these fields:
        - productCategory: One of [electronics, office, furniture, it, other]
        - productName: The name or type of product
        - description: A detailed description based on the request
        - quantity: The number of items requested (default to 1 if not specified)
        - budget: The budget per unit (if mentioned)
        - requiredBy: The required date in YYYY-MM-DD format (if mentioned)
        
        Only include fields that can be confidently extracted from the input.
        Format your response as valid JSON without any additional text.
      `,
    })

    try {
      // Parse the JSON response
      return JSON.parse(result.text)
    } catch (parseError) {
      console.error("Failed to parse LLM response:", parseError)
      console.log("Raw response:", result.text)

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
  if (/laptop|computer|monitor|keyboard|mouse|headphone|tablet|phone/i.test(input)) {
    result.productCategory = "electronics"
  } else if (/chair|desk|table|furniture|cabinet/i.test(input)) {
    result.productCategory = "furniture"
  } else if (/paper|pen|pencil|stapler|supplies/i.test(input)) {
    result.productCategory = "office"
  } else if (/server|network|software|license/i.test(input)) {
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

  return result
}
