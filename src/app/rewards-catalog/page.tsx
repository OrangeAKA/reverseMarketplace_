"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Sparkles } from "lucide-react"
import { products } from "@/lib/product-database"
import { analyzeSearchIntent } from "@/app/actions/analyze-search"
import { Skeleton } from "@/components/ui/skeleton"
import RewardsHeader from "@/components/rewards/rewards-header"

// Convert products to catalog items with points
const catalogItems = products.slice(0, 20).map((product) => ({
  id: product.id,
  name: `${product.brand} ${product.name}`,
  description: product.description,
  imageUrl: product.imageUrl,
  itemCode: `SR${Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")}`,
  points: Math.round(product.price * 100),
  category: product.category,
  brand: product.brand,
}))

export default function RewardsCatalogPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [filteredItems, setFilteredItems] = useState(catalogItems)
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [sortOption, setSortOption] = useState("recommended")
  const [pointsRange, setPointsRange] = useState([0, 200000])
  const [searchResults, setSearchResults] = useState<typeof catalogItems | null>(null)
  const [showSmartRequestCTA, setShowSmartRequestCTA] = useState(false)

  // Get unique brands
  const brands = Array.from(new Set(catalogItems.map((item) => item.brand)))

  // Filter items based on search, brand, and points range
  useEffect(() => {
    let results = catalogItems

    // If there's a search query and search has been performed
    if (searchQuery.trim() && searchResults !== null) {
      // Use search results as the base for further filtering
      results = searchResults
    }

    // Filter by brand
    if (selectedBrand !== "all") {
      results = results.filter((item) => item.brand === selectedBrand)
    }

    // Filter by points range
    results = results.filter((item) => item.points >= pointsRange[0] && item.points <= pointsRange[1])

    // Sort items
    if (sortOption === "price-low") {
      results = [...results].sort((a, b) => a.points - b.points)
    } else if (sortOption === "price-high") {
      results = [...results].sort((a, b) => b.points - a.points)
    }

    setFilteredItems(results)

    // Show Smart Request CTA if no results after search
    setShowSmartRequestCTA(searchQuery.trim() !== "" && results.length === 0)
  }, [selectedBrand, pointsRange, sortOption, searchQuery, searchResults])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null)
      return
    }

    setIsSearching(true)

    try {
      // Use Groq to analyze search intent
      const analysis = await analyzeSearchIntent(searchQuery)
      console.log("Search analysis:", analysis)

      // Start with an empty array for strict matching
      let results: typeof catalogItems = []
      let hasMatchCriteria = false

      // Only filter if we have specific criteria
      if (analysis.category || analysis.brand || analysis.searchTerms) {
        hasMatchCriteria = true
        results = catalogItems.filter((item) => {
          let matches = true

          // Match by category if specified
          if (analysis.category && item.category.toLowerCase() !== analysis.category.toLowerCase()) {
            matches = false
          }

          // Match by brand if specified
          if (matches && analysis.brand && !item.brand.toLowerCase().includes(analysis.brand.toLowerCase())) {
            matches = false
          }

          // Match by search terms if specified
          if (matches && analysis.searchTerms) {
            const terms = analysis.searchTerms.split(",").map((term) => term.trim().toLowerCase())
            const termMatches = terms.some(
              (term) => item.name.toLowerCase().includes(term) || item.description.toLowerCase().includes(term),
            )

            if (!termMatches) {
              matches = false
            }
          }

          return matches
        })

        // Sort by relevance if we have search terms
        if (analysis.searchTerms) {
          const terms = analysis.searchTerms.split(",").map((term) => term.trim().toLowerCase())

          results.sort((a, b) => {
            const aMatches = terms.filter(
              (term) => a.name.toLowerCase().includes(term) || a.description.toLowerCase().includes(term),
            ).length

            const bMatches = terms.filter(
              (term) => b.name.toLowerCase().includes(term) || b.description.toLowerCase().includes(term),
            ).length

            return bMatches - aMatches
          })
        }
      } else if (!hasMatchCriteria) {
        // If no specific criteria, do a simple text search
        results = catalogItems.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      setSearchResults(results)

      // Show Smart Request CTA if no results
      setShowSmartRequestCTA(results.length === 0)
    } catch (error) {
      console.error("Search error:", error)
      // Fallback to simple search
      const results = catalogItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(results)
      setShowSmartRequestCTA(results.length === 0)
    } finally {
      setIsSearching(false)
    }
  }

  const handleCreateSmartRequest = () => {
    router.push(`/create-request?query=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <RewardsHeader />

      {/* Hero Banner */}
      <div className="relative h-64 bg-gradient-to-r from-primary/5 to-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Rewards Catalogue</h1>
          <div className="relative max-w-2xl">
            <Input
              type="text"
              placeholder="Search for products, brands, or categories..."
              className="pr-10 h-12 bg-background/90 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-12 w-12 text-muted-foreground"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted border-t-primary" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-medium mb-2">Points Range</h3>
            <div className="space-y-4">
              <Slider
                defaultValue={[0, 200000]}
                max={200000}
                step={1000}
                value={pointsRange}
                onValueChange={setPointsRange}
                className="my-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{pointsRange[0].toLocaleString()} Pts</span>
                <span>{pointsRange[1].toLocaleString()} Pts</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Brands</h3>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger>
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Sort By</h3>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger>
                <SelectValue placeholder="Recommended" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-low">Points: Low to High</SelectItem>
                <SelectItem value="price-high">Points: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Smart Request CTA */}
        {showSmartRequestCTA && (
          <div className="mb-8 p-6 border rounded-lg bg-primary/5 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Can't find what you're looking for?</h3>
                  <p className="text-muted-foreground">Create a Smart Request and we'll find it for you!</p>
                </div>
              </div>
              <Button onClick={handleCreateSmartRequest}>
                <Sparkles className="h-4 w-4 mr-2" />
                Create Smart Request
              </Button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {isSearching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Skeleton className="h-6 w-1/3" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search for something else.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedBrand("all")
                setSortOption("recommended")
                setPointsRange([0, 200000])
                setSearchResults(null)
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-foreground line-clamp-2">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Item Code: {item.itemCode}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <p className="text-xl font-bold text-primary">{item.points.toLocaleString()} Pts</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
