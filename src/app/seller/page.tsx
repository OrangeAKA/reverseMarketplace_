"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { type SmartRequest, RequestStatus, BidStatus } from "@/lib/types"
import { fetchOpenRequests, submitBid } from "@/lib/api"
import { format, formatDistanceToNow } from "date-fns"
import { Clock, Loader2, Package, Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import SellerHeader from "@/components/seller/seller-header"

export default function SellerPortalPage() {
  const [requests, setRequests] = useState<SmartRequest[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [selectedRequest, setSelectedRequest] = useState<SmartRequest | null>(null)
  const [bidDialogOpen, setBidDialogOpen] = useState(false)
  const [bidPrice, setBidPrice] = useState("")
  const [bidQuantity, setBidQuantity] = useState("")
  const [bidNotes, setBidNotes] = useState("")
  const [estimatedDelivery, setEstimatedDelivery] = useState("")
  const [submittingBid, setSubmittingBid] = useState(false)

  // Tiered pricing
  const [tier1Quantity, setTier1Quantity] = useState("")
  const [tier1Price, setTier1Price] = useState("")
  const [tier2Quantity, setTier2Quantity] = useState("")
  const [tier2Price, setTier2Price] = useState("")

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchOpenRequests()
        setRequests(data)
      } catch (error) {
        console.error("Failed to load requests:", error)
        toast({
          title: "Error",
          description: "Failed to load open requests. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadRequests()
  }, [toast])

  const openRequests = requests.filter((req) => req.status === RequestStatus.BIDDING)
  const biddedRequests = requests.filter((req) =>
    req.bids?.some((bid) => bid.sellerId === "seller_1" && bid.status === BidStatus.PENDING),
  )
  const awardedRequests = requests.filter((req) =>
    req.bids?.some((bid) => bid.sellerId === "seller_1" && bid.status === BidStatus.ACCEPTED),
  )

  const handleBidSubmit = async () => {
    if (!selectedRequest) return

    setSubmittingBid(true)
    try {
      const price = Number.parseFloat(bidPrice)
      const quantity = Number.parseInt(bidQuantity || String(selectedRequest.quantity))

      if (isNaN(price) || price <= 0) {
        throw new Error("Please enter a valid price")
      }

      if (isNaN(quantity) || quantity <= 0) {
        throw new Error("Please enter a valid quantity")
      }

      const deliveryDate = new Date(estimatedDelivery)
      if (isNaN(deliveryDate.getTime())) {
        throw new Error("Please enter a valid delivery date")
      }

      // Prepare tiered pricing if provided
      const tieredPricing = []

      if (tier1Quantity && tier1Price) {
        const t1Quantity = Number.parseInt(tier1Quantity)
        const t1Price = Number.parseFloat(tier1Price)

        if (!isNaN(t1Quantity) && !isNaN(t1Price) && t1Quantity > 0 && t1Price > 0) {
          tieredPricing.push({ minQuantity: t1Quantity, price: t1Price })
        }
      }

      if (tier2Quantity && tier2Price) {
        const t2Quantity = Number.parseInt(tier2Quantity)
        const t2Price = Number.parseFloat(tier2Price)

        if (!isNaN(t2Quantity) && !isNaN(t2Price) && t2Quantity > 0 && t2Price > 0) {
          tieredPricing.push({ minQuantity: t2Quantity, price: t2Price })
        }
      }

      await submitBid({
        requestId: selectedRequest.id,
        price,
        quantity,
        estimatedDeliveryDate: deliveryDate.toISOString(),
        notes: bidNotes,
        tieredPricing: tieredPricing.length > 0 ? tieredPricing : undefined,
      })

      // Refresh the requests list
      const updatedRequests = await fetchOpenRequests()
      setRequests(updatedRequests)

      toast({
        title: "Bid Submitted",
        description: "Your bid has been submitted successfully.",
      })

      // Close the dialog and reset form
      setBidDialogOpen(false)
      resetBidForm()
    } catch (error) {
      console.error("Failed to submit bid:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit bid. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmittingBid(false)
    }
  }

  const resetBidForm = () => {
    setBidPrice("")
    setBidQuantity("")
    setBidNotes("")
    setEstimatedDelivery("")
    setTier1Quantity("")
    setTier1Price("")
    setTier2Quantity("")
    setTier2Price("")
  }

  const handleOpenBidDialog = (request: SmartRequest) => {
    setSelectedRequest(request)
    setBidQuantity(String(request.quantity))

    // Set default estimated delivery date to 14 days from now
    const defaultDeliveryDate = new Date()
    defaultDeliveryDate.setDate(defaultDeliveryDate.getDate() + 14)
    setEstimatedDelivery(defaultDeliveryDate.toISOString().split("T")[0])

    setBidDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <SellerHeader />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Seller Portal</h1>
      </div>

      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="open">Open Requests ({openRequests.length})</TabsTrigger>
          <TabsTrigger value="bidded">My Bids ({biddedRequests.length})</TabsTrigger>
          <TabsTrigger value="awarded">Awarded ({awardedRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-4 mt-6">
          {openRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">There are no open requests at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            openRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {request.productInfo?.name || request.description.substring(0, 30)}
                        {request.isBulkBuy && (
                          <Badge variant="outline" className="ml-2">
                            <Users className="h-3 w-3 mr-1" /> Bulk Buy
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Request #{request.id.substring(0, 8)} • {request.quantity} units
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {request.biddingEndsAt && (
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Ends {formatDistanceToNow(new Date(request.biddingEndsAt), { addSuffix: true })}
                        </div>
                      )}
                      <Badge>Bidding</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                      <p className="text-sm line-clamp-2">{request.description}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Quantity</h4>
                      <p>{request.quantity} units</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {request.requiredBy ? "Required By" : "Amazon Benchmark"}
                      </h4>
                      <p>
                        {request.requiredBy ? (
                          format(new Date(request.requiredBy), "PPP")
                        ) : (
                          <span className="text-muted-foreground">$1,299.00</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {request.biddingEndsAt && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Bidding window</span>
                        <span>
                          {Math.max(
                            0,
                            Math.floor(
                              (new Date(request.biddingEndsAt).getTime() - new Date().getTime()) / (60 * 1000),
                            ),
                          )}{" "}
                          minutes left
                        </span>
                      </div>
                      <Progress
                        value={
                          100 -
                          (Math.max(0, new Date(request.biddingEndsAt).getTime() - new Date().getTime()) /
                            (45 * 60 * 1000)) *
                            100
                        }
                        className="h-2"
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleOpenBidDialog(request)}>
                    Submit Bid
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="bidded" className="space-y-4 mt-6">
          {biddedRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">You haven't submitted any bids yet.</p>
              </CardContent>
            </Card>
          ) : (
            biddedRequests.map((request) => {
              const myBid = request.bids?.find((bid) => bid.sellerId === "seller_1")

              return (
                <Card key={request.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {request.productInfo?.name || request.description.substring(0, 30)}
                        </CardTitle>
                        <CardDescription>
                          Request #{request.id.substring(0, 8)} • Bid #{myBid?.id.substring(0, 8)}
                        </CardDescription>
                      </div>
                      <Badge>Pending</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Your Bid</h4>
                        <p className="text-lg font-semibold">${myBid?.price.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">per unit</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Quantity</h4>
                        <p>{myBid?.quantity} units</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Estimated Delivery</h4>
                        <p>
                          {myBid?.estimatedDeliveryDate ? format(new Date(myBid.estimatedDeliveryDate), "PPP") : "N/A"}
                        </p>
                      </div>
                    </div>

                    {myBid?.notes && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Notes</h4>
                        <p className="text-sm">{myBid.notes}</p>
                      </div>
                    )}

                    {myBid?.tieredPricing && myBid.tieredPricing.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Tiered Pricing</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {myBid.tieredPricing.map((tier, index) => (
                            <div key={index} className="flex justify-between p-2 bg-muted rounded">
                              <span>{tier.minQuantity}+ units</span>
                              <span className="font-medium">${tier.price.toFixed(2)}/unit</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-sm text-muted-foreground">
                      Submitted {formatDistanceToNow(new Date(myBid?.createdAt || Date.now()), { addSuffix: true })}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="awarded" className="space-y-4 mt-6">
          {awardedRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">You don't have any awarded bids yet.</p>
              </CardContent>
            </Card>
          ) : (
            awardedRequests.map((request) => {
              const myBid = request.bids?.find(
                (bid) => bid.sellerId === "seller_1" && bid.status === BidStatus.ACCEPTED,
              )

              return (
                <Card key={request.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {request.productInfo?.name || request.description.substring(0, 30)}
                        </CardTitle>
                        <CardDescription>
                          Request #{request.id.substring(0, 8)} • Bid #{myBid?.id.substring(0, 8)}
                        </CardDescription>
                      </div>
                      <Badge variant="success">Awarded</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Your Bid</h4>
                        <p className="text-lg font-semibold">${myBid?.price.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">per unit</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Quantity</h4>
                        <p>{myBid?.quantity} units</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Order Value</h4>
                        <p className="font-semibold">${((myBid?.price || 0) * (myBid?.quantity || 0)).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted rounded-md mb-4">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 mr-2 text-primary" />
                        <div>
                          <p className="font-medium">Purchase Order Created</p>
                          <p className="text-sm text-muted-foreground">
                            PO #{request.id.substring(0, 6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Awarded {formatDistanceToNow(new Date(request.updatedAt), { addSuffix: true })}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={bidDialogOpen} onOpenChange={setBidDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Submit Bid</DialogTitle>
            <DialogDescription>{selectedRequest?.productInfo?.name || selectedRequest?.description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price per Unit ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="Quantity"
                  value={bidQuantity}
                  onChange={(e) => setBidQuantity(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery">Estimated Delivery Date</Label>
              <Input
                id="delivery"
                type="date"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tiered Pricing (Optional)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tier1-quantity">Tier 1 Quantity (min)</Label>
                  <Input
                    id="tier1-quantity"
                    type="number"
                    min="1"
                    placeholder="e.g., 10"
                    value={tier1Quantity}
                    onChange={(e) => setTier1Quantity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tier1-price">Tier 1 Price per Unit ($)</Label>
                  <Input
                    id="tier1-price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={tier1Price}
                    onChange={(e) => setTier1Price(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tier2-quantity">Tier 2 Quantity (min)</Label>
                  <Input
                    id="tier2-quantity"
                    type="number"
                    min="1"
                    placeholder="e.g., 20"
                    value={tier2Quantity}
                    onChange={(e) => setTier2Quantity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tier2-price">Tier 2 Price per Unit ($)</Label>
                  <Input
                    id="tier2-price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={tier2Price}
                    onChange={(e) => setTier2Price(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional information about your bid"
                value={bidNotes}
                onChange={(e) => setBidNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBidDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBidSubmit} disabled={submittingBid}>
              {submittingBid ? "Submitting..." : "Submit Bid"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
