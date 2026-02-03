"use client"
import type { Product } from "@/lib/product-database"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

interface ProductRecommendationsProps {
  products: Product[]
  onSelectProduct: (product: Product) => void
  selectedProductId?: string
}

export default function ProductRecommendations({
  products,
  onSelectProduct,
  selectedProductId,
}: ProductRecommendationsProps) {
  if (products.length === 0) {
    return (
      <div className="text-center p-4 border rounded-md bg-muted/50">
        <p className="text-muted-foreground">No matching products found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recommended Products</h3>
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className={`cursor-pointer transition-colors ${
              selectedProductId === product.id ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => onSelectProduct(product)}
          >
            <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-base">
                  {product.brand} {product.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-xs">{product.fullName}</CardDescription>
              </div>
              {selectedProductId === product.id && (
                <Badge className="ml-2 bg-primary">
                  <Check className="h-3 w-3 mr-1" /> Selected
                </Badge>
              )}
            </CardHeader>
            <CardContent className="p-4 pt-0 pb-2">
              <div className="flex gap-4">
                <div className="w-20 h-20 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm line-clamp-2">{product.description}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Object.entries(product.specs)
                      .slice(0, 3)
                      .map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {key}: {value}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-2 flex justify-between items-center">
              <span className="font-bold">${product.price.toFixed(2)}</span>
              <Button size="sm" variant={selectedProductId === product.id ? "default" : "outline"}>
                {selectedProductId === product.id ? "Selected" : "Select"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
