"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import Link from "next/link"

// Mock catalog data
const catalogItems = [
  {
    id: "prod_1",
    name: "Developer Laptop",
    description: "High-performance laptop for software development with 16GB RAM, 512GB SSD",
    price: 1299,
    category: "electronics",
    imageUrl: "/modern-laptop-workspace.png",
  },
  {
    id: "prod_2",
    name: "Ergonomic Office Chair",
    description: "Comfortable ergonomic chair for office use with lumbar support",
    price: 249,
    category: "furniture",
    imageUrl: "/ergonomic-office-chair.png",
  },
  {
    id: "prod_3",
    name: "Wireless Keyboard and Mouse",
    description: "Wireless keyboard and mouse combo with long battery life",
    price: 89,
    category: "electronics",
    imageUrl: "/placeholder.svg?key=r8992",
  },
  {
    id: "prod_4",
    name: "27-inch 4K Monitor",
    description: "Ultra HD 4K monitor with wide color gamut for professional use",
    price: 399,
    category: "electronics",
    imageUrl: "/computer-monitor.png",
  },
  {
    id: "prod_5",
    name: "Adjustable Standing Desk",
    description: "Electric height-adjustable standing desk with memory settings",
    price: 549,
    category: "furniture",
    imageUrl: "/standing-desk-setup.png",
  },
  {
    id: "prod_6",
    name: "Wireless Headphones",
    description: "Noise-cancelling wireless headphones with 30-hour battery life",
    price: 199,
    category: "electronics",
    imageUrl: "/diverse-people-listening-headphones.png",
  },
]

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  const filteredItems = catalogItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Product Catalog</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="furniture">Furniture</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchTerm("")
              setCategoryFilter("")
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.name}
                  className="h-full w-full object-cover transition-all hover:scale-105"
                />
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
                <CardDescription className="line-clamp-2">{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button variant="outline" className="flex-1">
                  View Details
                </Button>
                <Link href={`/create-request?product=${item.id}`} className="flex-1">
                  <Button className="w-full">Request</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
