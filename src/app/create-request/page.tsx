"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, CalendarIcon, Minus, Plus, Sparkles, Users, Link2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { createSmartRequest } from "@/lib/api"
import { analyzeRequestIntent } from "@/app/actions/analyze-intent"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { findMatchingProducts, getProductById, type Product } from "@/lib/product-database"
import ProductRecommendations from "@/components/product-recommendations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RewardsHeader from "@/components/rewards/rewards-header"

export default function CreateRequestPage() {
  const searchParams = useSearchParams()
  const isBulkBuyMode = searchParams.get("mode") === "bulk"
  const initialQuery = searchParams.get("query") || ""
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBulkBuy, setIsBulkBuy] = useState(isBulkBuyMode)
  const [participants, setParticipants] = useState([{ email: "", name: "" }])
  const { toast } = useToast()
  const router = useRouter()

  // Form state
  const [productCategory, setProductCategory] = useState("")
  const [productName, setProductName] = useState("")
  const [description, setDescription] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [budget, setBudget] = useState<number | undefined>(undefined)
  const [requiredBy, setRequiredBy] = useState<Date | undefined>(undefined)
  const [acceptAlternatives, setAcceptAlternatives] = useState(true)
  const [authorizePayment, setAuthorizePayment] = useState(false)
  const [organizerName, setOrganizerName] = useState("")
  const [organizerPhone, setOrganizerPhone] = useState("")

  // Amazon link state
  const [amazonLink, setAmazonLink] = useState("")
  const [isParsingAmazon, setIsParsingAmazon] = useState(false)
  const [amazonProductParsed, setAmazonProductParsed] = useState(false)
  const amazonProductRef = useRef<{
    productName: string
    description: string
    productId: string
  } | null>(null)

  // AI processing state
  const [naturalLanguageInput, setNaturalLanguageInput] = useState(initialQuery)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [aiConfidence, setAiConfidence] = useState<number>(0)

  // Product recommendation state
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined)
  const [activeTab, setActiveTab] = useState<string>("form")
  const [noProductsFound, setNoProductsFound] = useState(false)

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Auto-analyze if query parameter is provided
  useEffect(() => {
    if (initialQuery) {
      setNaturalLanguageInput(initialQuery)
      handleAnalyzeIntent()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  // Update form when a product is selected
  useEffect(() => {
    if (selectedProductId) {
      const product = getProductById(selectedProductId)
      setSelectedProduct(product)

      if (product) {
        setProductCategory(product.category)
        setProductName(product.fullName)
        setDescription(product.description)
        setBudget(product.price)
      }
    }
  }, [selectedProductId])

  const addParticipant = () => {
    if (participants.length < 15) {
      setParticipants([...participants, { email: "", name: "" }])
    } else {
      toast({
        title: "Maximum participants reached",
        description: "You can add a maximum of 15 participants to a Bulk Buy request.",
        variant: "destructive",
      })
    }
  }

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      const newParticipants = [...participants]
      newParticipants.splice(index, 1)
      setParticipants(newParticipants)
    }
  }

  const updateParticipant = (index: number, field: "email" | "name", value: string) => {
    const newParticipants = [...participants]
    newParticipants[index][field] = value
    setParticipants(newParticipants)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!productCategory) {
      newErrors.productCategory = "Please select a product category"
    }

    if (!productName || productName.length < 2) {
      newErrors.productName = "Product name must be at least 2 characters"
    }

    if (!description || description.length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    if (!quantity || quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1"
    }

    if (isBulkBuy) {
      if (!organizerName) {
        newErrors.organizerName = "Organizer name is required for Bulk Buy"
      }

      if (!organizerPhone) {
        newErrors.organizerPhone = "Organizer phone is required for Bulk Buy"
      }

      const validParticipants = participants.filter((p) => p.email.trim() !== "")
      if (validParticipants.length < 3) {
        newErrors.participants = "At least 3 participants with valid emails are required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare the request data
      const requestData = {
        productCategory,
        productName,
        description,
        quantity,
        budget,
        requiredBy,
        acceptAlternatives,
        authorizePayment,
        isBulkBuy,
        organizerName: isBulkBuy ? organizerName : undefined,
        organizerPhone: isBulkBuy ? organizerPhone : undefined,
        participants: isBulkBuy ? participants.filter((p) => p.email.trim() !== "") : undefined,
      }

      console.log("Submitting request:", requestData)

      // Call the API
      const result = await createSmartRequest(requestData)

      console.log("Request created:", result)

      toast({
        title: isBulkBuy ? "Bulk Buy Created" : "Request Created",
        description: `Your ${isBulkBuy ? "Bulk Buy" : "Smart Request"} #${result.id} has been created successfully.`,
      })

      // Navigate to the request details page
      router.push(`/my-requests/${result.id}`)
    } catch (error) {
      console.error("Error creating request:", error)
      toast({
        title: "Error",
        description: "There was an error creating your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleAnalyzeIntent() {
    if (!naturalLanguageInput.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter a description of what you need.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setAiError(null)
    setAiSuggestion(null)
    setAiConfidence(0)

    // Only reset product recommendations if no Amazon product was parsed
    if (!amazonProductParsed) {
      setRecommendedProducts([])
      setSelectedProductId(undefined)
      setSelectedProduct(undefined)
      setNoProductsFound(false)
    }

    try {
      // Start the confidence animation
      const interval = setInterval(() => {
        setAiConfidence((prev) => {
          const newValue = prev + Math.random() * 5
          return newValue > 95 ? 95 : newValue
        })
      }, 100)

      // If an Amazon product has been parsed, we'll analyze the input differently
      if (amazonProductParsed && amazonProductRef.current) {
        // Call the server action to analyze the additional requirements
        const result = await analyzeRequestIntent(
          `For this product: ${amazonProductRef.current.productName}, the user wants: ${naturalLanguageInput}`,
        )

        clearInterval(interval)
        setAiConfidence(100)

        console.log("AI analysis result for Amazon product:", result)

        // Extract additional requirements from the analysis
        let additionalSpecs = ""
        if (result.description && result.description !== naturalLanguageInput) {
          additionalSpecs = result.description
        }

        // Update the product name if we have additional specifications
        if (additionalSpecs) {
          // Append additional specs to product name if they're concise
          if (additionalSpecs.length < 50) {
            setProductName(`${amazonProductRef.current.productName} with ${additionalSpecs}`)
          } else {
            setProductName(amazonProductRef.current.productName)
          }

          // Always update the description with the additional requirements
          const updatedDescription = `${amazonProductRef.current.description}\n\nAdditional Requirements: ${additionalSpecs}\n\nUser's original request: ${naturalLanguageInput}`
          setDescription(updatedDescription)

          toast({
            title: "Additional Requirements Added",
            description: "We've updated your request with the additional specifications you provided.",
          })
        }

        // Update other fields if provided
        if (result.quantity) setQuantity(result.quantity)
        if (result.budget) setBudget(result.budget)
        if (result.requiredBy) setRequiredBy(new Date(result.requiredBy))

        // Set AI suggestion if provided
        if (result.additionalSuggestions) {
          setAiSuggestion(result.additionalSuggestions)
        }
      } else {
        // Standard analysis for non-Amazon products
        const result = await analyzeRequestIntent(naturalLanguageInput)

        clearInterval(interval)
        setAiConfidence(100)

        console.log("AI analysis result:", result)

        // Check if we got a valid result
        if (!result || (Object.keys(result).length === 1 && result.description)) {
          throw new Error("Couldn't extract enough information from your request")
        }

        // Update form fields with the analyzed intent
        if (result.productCategory) setProductCategory(result.productCategory)
        if (result.productName) setProductName(result.productName)
        if (result.description) setDescription(result.description)
        if (result.quantity) setQuantity(result.quantity)
        if (result.budget) setBudget(result.budget)
        if (result.requiredBy) setRequiredBy(new Date(result.requiredBy))

        // Set AI suggestion if provided
        if (result.additionalSuggestions) {
          setAiSuggestion(result.additionalSuggestions)
        } else if (result.productCategory === "electronics" && result.budget) {
          setAiSuggestion(
            `Based on your budget of $${result.budget} per unit, you might want to consider adding specifications like RAM, storage, and processor requirements.`,
          )
        } else if (result.productCategory === "furniture") {
          setAiSuggestion(
            "Consider specifying dimensions, material preferences, and color options in your description.",
          )
        }

        // Find matching products based on the analyzed intent
        let searchQuery = ""
        if (result.searchTerms) {
          searchQuery = result.searchTerms
        } else {
          searchQuery = `${result.productName || ""} ${result.description || ""}`.trim()
        }

        const matchingProducts = findMatchingProducts(result.productCategory, searchQuery)
        setRecommendedProducts(matchingProducts)

        // Set flag if no products were found
        if (matchingProducts.length === 0) {
          setNoProductsFound(true)
        } else {
          // Switch to the recommendations tab if we have products
          setActiveTab("recommendations")
        }

        toast({
          title: "Analysis Complete",
          description:
            matchingProducts.length > 0
              ? "We've filled in the form based on your description and found matching products."
              : "We've filled in the form based on your description, but couldn't find exact product matches.",
        })
      }
    } catch (error) {
      console.error("Error analyzing intent:", error)
      setAiError(
        error instanceof Error
          ? error.message
          : "We couldn't fully analyze your request. Please review and complete the form manually.",
      )
      setAiConfidence(0)
      toast({
        title: "Analysis Error",
        description: "We couldn't fully analyze your request. Please review the form.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id)
    setActiveTab("form") // Switch back to form tab after selection
  }

  // Function to parse Amazon URL
  const parseAmazonLink = async () => {
    if (!amazonLink || !amazonLink.includes("amazon.com")) {
      toast({
        title: "Invalid Amazon Link",
        description: "Please enter a valid Amazon product URL.",
        variant: "destructive",
      })
      return
    }

    setIsParsingAmazon(true)
    setAmazonProductParsed(false)
    amazonProductRef.current = null

    try {
      // Extract product ID from URL
      let productId = ""

      // Try to extract ASIN from URL
      const asinMatch = amazonLink.match(/\/dp\/([A-Z0-9]{10})/) || amazonLink.match(/\/gp\/product\/([A-Z0-9]{10})/)
      if (asinMatch && asinMatch[1]) {
        productId = asinMatch[1]
      }

      if (!productId) {
        throw new Error("Could not extract product ID from the Amazon URL")
      }

      // In a real implementation, we would make an API call to a server endpoint that scrapes
      // or uses Amazon's API to get product details. For this demo, we'll simulate the response.

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Extract product name from URL for demo purposes
      let productName = "Amazon Product"
      const titleMatch = amazonLink.match(/\/([^/]+)\/dp\//) || amazonLink.match(/\/([^/]+)\/gp\/product\//)
      if (titleMatch && titleMatch[1]) {
        productName = titleMatch[1].replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      }

      // Store the Amazon product details for reference
      amazonProductRef.current = {
        productName,
        productId,
        description: `Product ID: ${productId}\nSource: Amazon\nURL: ${amazonLink}\n\nPlease find this specific product or an equivalent alternative.`,
      }

      // Set form fields with extracted data
      setProductName(productName)
      setProductCategory("electronics") // Default category
      setDescription(amazonProductRef.current.description)
      setAmazonProductParsed(true)

      // Clear any previous AI analysis
      setRecommendedProducts([])
      setSelectedProductId(undefined)
      setSelectedProduct(undefined)
      setNoProductsFound(false)
      setAiSuggestion(
        "You can now use the Smart Request Assistant below to add additional requirements for this product.",
      )

      toast({
        title: "Amazon Link Parsed",
        description:
          "Product information has been extracted. You can now add additional requirements using the Smart Request Assistant below.",
      })
    } catch (error) {
      console.error("Error parsing Amazon link:", error)
      toast({
        title: "Parsing Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to parse Amazon link. Please try again or enter details manually.",
        variant: "destructive",
      })
    } finally {
      setIsParsingAmazon(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <RewardsHeader />

      <div className="max-w-2xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{isBulkBuy ? "Create Bulk Buy" : "Create Smart Request"}</CardTitle>
                <CardDescription>
                  {isBulkBuy
                    ? "Create a group purchase to get better prices with more participants."
                    : "Fill out the form below to create a new Smart Request."}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="bulk-buy-mode" checked={isBulkBuy} onCheckedChange={(checked) => setIsBulkBuy(checked)} />
                <label htmlFor="bulk-buy-mode" className="text-sm font-medium flex items-center gap-1">
                  <Users className="h-4 w-4" /> Bulk Buy
                </label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Amazon Link Section */}
            <div className="mb-8 p-4 border rounded-md bg-muted/50">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" /> Amazon Product Link
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Have an Amazon link? Paste it here and we'll extract the product details for you.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="https://www.amazon.com/dp/XXXXXXXXXX"
                  value={amazonLink}
                  onChange={(e) => setAmazonLink(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={parseAmazonLink} disabled={isParsingAmazon || !amazonLink.includes("amazon.com")}>
                  {isParsingAmazon ? "Parsing..." : "Parse Link"}
                </Button>
              </div>

              {amazonProductParsed && (
                <div className="mt-4">
                  <Alert className="bg-green-50 border-green-200">
                    <Sparkles className="h-4 w-4 text-green-500" />
                    <AlertTitle>Amazon Product Parsed</AlertTitle>
                    <AlertDescription>
                      We've extracted the product details. Use the Smart Request Assistant below to add any additional
                      requirements.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>

            {/* AI Intent Analysis Section */}
            <div className="mb-8 p-4 border rounded-md bg-muted/50">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Smart Request Assistant
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {amazonProductParsed
                  ? "Describe any additional requirements for the Amazon product you've selected."
                  : "Describe what you need in natural language, and our AI will fill out the form for you and suggest matching products."}
              </p>
              <div className="flex gap-2">
                <Textarea
                  placeholder={
                    amazonProductParsed
                      ? "e.g., I need it with 32GB RAM, 1TB SSD, and it should be delivered within 2 weeks"
                      : "e.g., I need 5 Dell XPS laptops with 32GB RAM for the development team by the end of next month with a budget of $1500 each"
                  }
                  value={naturalLanguageInput}
                  onChange={(e) => setNaturalLanguageInput(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div className="mt-2 flex justify-end">
                <Button
                  type="button"
                  onClick={handleAnalyzeIntent}
                  disabled={isAnalyzing || !naturalLanguageInput.trim()}
                  size="sm"
                >
                  {isAnalyzing ? (
                    <>
                      <span className="mr-2">Analyzing...</span>
                      <span className="text-xs">{Math.floor(aiConfidence)}%</span>
                    </>
                  ) : amazonProductParsed ? (
                    "Add Requirements"
                  ) : (
                    "Analyze Request"
                  )}
                </Button>
              </div>

              {isAnalyzing && (
                <div className="mt-4 space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Processing with Groq AI</span>
                      <span>{Math.floor(aiConfidence)}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${aiConfidence}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  </div>
                </div>
              )}

              {aiSuggestion && (
                <div className="mt-4">
                  <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>AI Suggestion</AlertTitle>
                    <AlertDescription>{aiSuggestion}</AlertDescription>
                  </Alert>
                </div>
              )}

              {aiError && (
                <div className="mt-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Analysis Issue</AlertTitle>
                    <AlertDescription>{aiError}</AlertDescription>
                  </Alert>
                </div>
              )}

              {noProductsFound && !isAnalyzing && !amazonProductParsed && (
                <div className="mt-4">
                  <Alert variant="default" className="bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <AlertTitle>No Exact Matches</AlertTitle>
                    <AlertDescription>
                      We couldn't find exact product matches for your request. Please continue with the form and our
                      procurement team will find the best options for you.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>

            {recommendedProducts.length > 0 && !amazonProductParsed && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="form">Request Form</TabsTrigger>
                  <TabsTrigger value="recommendations">
                    Product Recommendations ({recommendedProducts.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="recommendations" className="mt-4">
                  <ProductRecommendations
                    products={recommendedProducts}
                    onSelectProduct={handleSelectProduct}
                    selectedProductId={selectedProductId}
                  />
                </TabsContent>
                <TabsContent value="form">
                  {selectedProduct && (
                    <div className="mb-4">
                      <Alert className="bg-primary/10 border-primary">
                        <Sparkles className="h-4 w-4" />
                        <AlertTitle>Product Selected</AlertTitle>
                        <AlertDescription className="flex items-center justify-between">
                          <span>
                            You've selected:{" "}
                            <strong>
                              {selectedProduct.brand} {selectedProduct.name}
                            </strong>
                          </span>
                          <Button variant="outline" size="sm" onClick={() => setActiveTab("recommendations")}>
                            Change
                          </Button>
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="productCategory">Product Category</Label>
                      <Select value={productCategory} onValueChange={setProductCategory}>
                        <SelectTrigger id="productCategory">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="office">Office Supplies</SelectItem>
                          <SelectItem value="furniture">Furniture</SelectItem>
                          <SelectItem value="it">IT Equipment</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Select the category that best matches your product.
                      </p>
                      {errors.productCategory && <p className="text-sm text-destructive">{errors.productCategory}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        placeholder="e.g. Dell XPS 13 9310 Laptop - 13.4-inch FHD+ Touchscreen, Intel Core i7, 16GB RAM"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">Enter the detailed name of the product you need.</p>
                      {errors.productName && <p className="text-sm text-destructive">{errors.productName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide details about your requirements, specifications, etc."
                        className="min-h-[120px]"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        The more details you provide, the better matches we can find.
                      </p>
                      {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min={1}
                          value={quantity}
                          onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                        />
                        <p className="text-sm text-muted-foreground">How many units do you need?</p>
                        {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget (Optional)</Label>
                        <Input
                          id="budget"
                          type="number"
                          min={0}
                          placeholder="Your maximum budget"
                          value={budget || ""}
                          onChange={(e) => setBudget(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                        <p className="text-sm text-muted-foreground">Your maximum budget per unit (USD).</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requiredBy">Required By (Optional)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="requiredBy"
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !requiredBy && "text-muted-foreground")}
                          >
                            {requiredBy ? format(requiredBy, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={requiredBy}
                            onSelect={setRequiredBy}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-sm text-muted-foreground">When do you need this product by?</p>
                    </div>

                    <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <Checkbox
                        id="acceptAlternatives"
                        checked={acceptAlternatives}
                        onCheckedChange={(checked) => setAcceptAlternatives(checked === true)}
                      />
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="acceptAlternatives">Accept Alternative Products</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow suppliers to suggest alternative products that meet your requirements.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <Checkbox
                        id="authorizePayment"
                        checked={authorizePayment}
                        onCheckedChange={(checked) => setAuthorizePayment(checked === true)}
                      />
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="authorizePayment">Pre-authorize Payment</Label>
                        <p className="text-sm text-muted-foreground">
                          Pre-authorize payment to speed up the procurement process once a bid is accepted.
                        </p>
                      </div>
                    </div>

                    {isBulkBuy && (
                      <>
                        <div className="border rounded-md p-4 space-y-4">
                          <h3 className="font-medium flex items-center gap-2">
                            <Users className="h-4 w-4" /> Bulk Buy Organizer Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="organizerName">Organizer Name</Label>
                              <Input
                                id="organizerName"
                                placeholder="Your full name"
                                value={organizerName}
                                onChange={(e) => setOrganizerName(e.target.value)}
                              />
                              {errors.organizerName && (
                                <p className="text-sm text-destructive">{errors.organizerName}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="organizerPhone">Organizer Phone</Label>
                              <Input
                                id="organizerPhone"
                                placeholder="Your phone number"
                                value={organizerPhone}
                                onChange={(e) => setOrganizerPhone(e.target.value)}
                              />
                              {errors.organizerPhone && (
                                <p className="text-sm text-destructive">{errors.organizerPhone}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-md p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Participants (3-15 required)</h3>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={addParticipant}
                              disabled={participants.length >= 15}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Add Participant
                            </Button>
                          </div>
                          <div className="space-y-3">
                            {participants.map((participant, index) => (
                              <div key={index} className="flex gap-2 items-start">
                                <div className="flex-1">
                                  <Input
                                    placeholder="Email address"
                                    value={participant.email}
                                    onChange={(e) => updateParticipant(index, "email", e.target.value)}
                                  />
                                </div>
                                <div className="flex-1">
                                  <Input
                                    placeholder="Name (optional)"
                                    value={participant.name}
                                    onChange={(e) => updateParticipant(index, "name", e.target.value)}
                                  />
                                </div>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => removeParticipant(index)}
                                  disabled={participants.length <= 1}
                                  className="flex-shrink-0"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Participants will receive an invitation to join this Bulk Buy. A minimum of 3 participants
                            is required.
                          </p>
                          {errors.participants && <p className="text-sm text-destructive">{errors.participants}</p>}
                        </div>
                      </>
                    )}

                    <CardFooter className="flex justify-between px-0">
                      <Button variant="outline" type="button" onClick={() => router.push("/rewards-catalog")}>
                        Back to Catalog
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : isBulkBuy ? "Create Bulk Buy" : "Create Smart Request"}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
              </Tabs>
            )}

            {(recommendedProducts.length === 0 || amazonProductParsed) && !isAnalyzing && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="productCategory">Product Category</Label>
                  <Select value={productCategory} onValueChange={setProductCategory}>
                    <SelectTrigger id="productCategory">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="office">Office Supplies</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="it">IT Equipment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Select the category that best matches your product.</p>
                  {errors.productCategory && <p className="text-sm text-destructive">{errors.productCategory}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    placeholder="e.g. Dell XPS 13 9310 Laptop - 13.4-inch FHD+ Touchscreen, Intel Core i7, 16GB RAM"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">Enter the detailed name of the product you need.</p>
                  {errors.productName && <p className="text-sm text-destructive">{errors.productName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide details about your requirements, specifications, etc."
                    className="min-h-[120px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    The more details you provide, the better matches we can find.
                  </p>
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                    />
                    <p className="text-sm text-muted-foreground">How many units do you need?</p>
                    {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (Optional)</Label>
                    <Input
                      id="budget"
                      type="number"
                      min={0}
                      placeholder="Your maximum budget"
                      value={budget || ""}
                      onChange={(e) => setBudget(e.target.value === "" ? undefined : Number(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground">Your maximum budget per unit (USD).</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requiredBy">Required By (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="requiredBy"
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !requiredBy && "text-muted-foreground")}
                      >
                        {requiredBy ? format(requiredBy, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={requiredBy}
                        onSelect={setRequiredBy}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-sm text-muted-foreground">When do you need this product by?</p>
                </div>

                <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Checkbox
                    id="acceptAlternatives"
                    checked={acceptAlternatives}
                    onCheckedChange={(checked) => setAcceptAlternatives(checked === true)}
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="acceptAlternatives">Accept Alternative Products</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow suppliers to suggest alternative products that meet your requirements.
                    </p>
                  </div>
                </div>

                <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Checkbox
                    id="authorizePayment"
                    checked={authorizePayment}
                    onCheckedChange={(checked) => setAuthorizePayment(checked === true)}
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="authorizePayment">Pre-authorize Payment</Label>
                    <p className="text-sm text-muted-foreground">
                      Pre-authorize payment to speed up the procurement process once a bid is accepted.
                    </p>
                  </div>
                </div>

                {isBulkBuy && (
                  <>
                    <div className="border rounded-md p-4 space-y-4">
                      <h3 className="font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" /> Bulk Buy Organizer Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="organizerName">Organizer Name</Label>
                          <Input
                            id="organizerName"
                            placeholder="Your full name"
                            value={organizerName}
                            onChange={(e) => setOrganizerName(e.target.value)}
                          />
                          {errors.organizerName && <p className="text-sm text-destructive">{errors.organizerName}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="organizerPhone">Organizer Phone</Label>
                          <Input
                            id="organizerPhone"
                            placeholder="Your phone number"
                            value={organizerPhone}
                            onChange={(e) => setOrganizerPhone(e.target.value)}
                          />
                          {errors.organizerPhone && <p className="text-sm text-destructive">{errors.organizerPhone}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-md p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Participants (3-15 required)</h3>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={addParticipant}
                          disabled={participants.length >= 15}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Participant
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {participants.map((participant, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <div className="flex-1">
                              <Input
                                placeholder="Email address"
                                value={participant.email}
                                onChange={(e) => updateParticipant(index, "email", e.target.value)}
                              />
                            </div>
                            <div className="flex-1">
                              <Input
                                placeholder="Name (optional)"
                                value={participant.name}
                                onChange={(e) => updateParticipant(index, "name", e.target.value)}
                              />
                            </div>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => removeParticipant(index)}
                              disabled={participants.length <= 1}
                              className="flex-shrink-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Participants will receive an invitation to join this Bulk Buy. A minimum of 3 participants is
                        required.
                      </p>
                      {errors.participants && <p className="text-sm text-destructive">{errors.participants}</p>}
                    </div>
                  </>
                )}

                <CardFooter className="flex justify-between px-0">
                  <Button variant="outline" type="button" onClick={() => router.push("/rewards-catalog")}>
                    Back to Catalog
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : isBulkBuy ? "Create Bulk Buy" : "Create Smart Request"}
                  </Button>
                </CardFooter>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
