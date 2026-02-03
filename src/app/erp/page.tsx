"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { Loader2, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchPurchaseOrders, fetchInventory } from "@/lib/api"
import ERPHeader from "@/components/erp/erp-header"

type PurchaseOrder = {
  id: string
  requestId: string
  sellerId: string
  sellerName: string
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  totalPrice: number
  expectedDeliveryDate: string
  status: "pending" | "shipped" | "delivered"
  createdAt: string
}

type InventoryItem = {
  id: string
  sku: string
  name: string
  description: string
  category: string
  quantity: number
  reserved: number
  available: number
  lastUpdated: string
}

export default function ERPSimulationPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [poData, invData] = await Promise.all([fetchPurchaseOrders(), fetchInventory()])
        setPurchaseOrders(poData)
        setInventory(invData)
      } catch (error) {
        console.error("Failed to load ERP data:", error)
        toast({
          title: "Error",
          description: "Failed to load ERP data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [toast])

  const filteredPOs = purchaseOrders.filter(
    (po) =>
      po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredInventory = inventory.filter(
    (item) =>
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ERPHeader />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ERP Simulation</h1>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by PO ID, product, supplier, or SKU..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="purchase-orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="purchase-orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>View all purchase orders created in the system</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPOs.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No purchase orders found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Expected Delivery</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPOs.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell className="font-medium">{po.id}</TableCell>
                        <TableCell>
                          {po.productName}
                          <div className="text-xs text-muted-foreground">SKU: {po.sku}</div>
                        </TableCell>
                        <TableCell>{po.sellerName}</TableCell>
                        <TableCell>{po.quantity}</TableCell>
                        <TableCell>${po.totalPrice.toFixed(2)}</TableCell>
                        <TableCell>{format(new Date(po.expectedDeliveryDate), "PP")}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              po.status === "delivered" ? "success" : po.status === "shipped" ? "default" : "outline"
                            }
                          >
                            {po.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>View current inventory levels and availability</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredInventory.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No inventory items found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Reserved</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>
                          {item.name}
                          <div className="text-xs text-muted-foreground line-clamp-1">{item.description}</div>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.reserved}</TableCell>
                        <TableCell>{item.available}</TableCell>
                        <TableCell>{format(new Date(item.lastUpdated), "PP")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
