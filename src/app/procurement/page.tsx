"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type SmartRequest, RequestStatus, BidStatus } from "@/lib/types"
import { fetchAllRequests, acceptBid, endBidding, createPurchaseOrder } from "@/lib/api"
import { format, formatDistanceToNow } from "date-fns"
import { Clock, Loader2, Package, Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import ProcurementHeader from "@/components/procurement/procurement-header"

export default function ProcurementDashboardPage() {
  const [requests, setRequests] = useState<SmartRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processingAction, setProcessingAction] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchAllRequests()
        setRequests(data)
      } catch (error) {
        console.error("Failed to load requests:", error)
        toast({
          title: "Error",
          description: "Failed to load requests. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadRequests()
  }, [toast])

  const biddingRequests = requests.filter((req) => req.status === RequestStatus.BIDDING)
  const paymentPendingRequests = requests.filter((req) => req.status === RequestStatus.PAYMENT_PENDING)
  const pendingRequests = requests.filter((req) => req.status === RequestStatus.AWARDED)
  const completedRequests = requests.filter((req) => req.status === RequestStatus.FULFILLED)

  const handleAcceptBid = async (requestId: string, bidId: string) => {
    setProcessingAction(`${requestId}-${bidId}`)
    try {
      await acceptBid(requestId, bidId)

      // Refresh the requests list
      const updatedRequests = await fetchAllRequests()
      setRequests(updatedRequests)

      toast({
        title: "Bid Accepted",
        description: "The bid has been accepted successfully.",
      })
    } catch (error) {
      console.error("Failed to accept bid:", error)
      toast({
        title: "Error",
        description: "Failed to accept bid. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(null)
    }
  }

  const handleEndBidding = async (requestId: string) => {
    setProcessingAction(`end-${requestId}`)
    try {
      await endBidding(requestId)

      // Refresh the requests list
      const updatedRequests = await fetchAllRequests()
      setRequests(updatedRequests)

      toast({
        title: "Bidding Ended",
        description: "The bidding period has been ended.",
      })
    } catch (error) {
      console.error("Failed to end bidding:", error)
      toast({
        title: "Error",
        description: "Failed to end bidding. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(null)
    }
  }

  const handleCreatePO = async (requestId: string, bidId: string, contestId: string) => {
    setProcessingAction(`po-${requestId}`)
    try {
      await createPurchaseOrder(requestId, bidId, contestId)

      // Refresh the requests list
      const updatedRequests = await fetchAllRequests()
      setRequests(updatedRequests)

      toast({
        title: "Purchase Order Created",
        description: "The purchase order has been created successfully.",
      })
    } catch (error) {
      console.error("Failed to create purchase order:", error)
      toast({
        title: "Error",
        description: "Failed to create purchase order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(null)
    }
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
      <ProcurementHeader />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Procurement Dashboard</h1>
      </div>

      <Tabs defaultValue="bidding" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bidding">Bidding ({biddingRequests.length})</TabsTrigger>
          <TabsTrigger value="payment">Payment Pending ({paymentPendingRequests.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending PO ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="bidding" className="space-y-4 mt-6">
          {biddingRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">There are no requests in the bidding phase.</p>
              </CardContent>
            </Card>
          ) : (
            biddingRequests.map((request) => (
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
                        Request #{request.id.substring(0, 8)} • {request.quantity} units • Customer:{" "}
                        {request.customerInfo?.name || "Unknown"}
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
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Budget</h4>
                      <p>{request.budget ? `$${request.budget.toFixed(2)} per unit` : "No budget specified"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {request.requiredBy ? "Required By" : "Created"}
                      </h4>
                      <p>
                        {request.requiredBy
                          ? format(new Date(request.requiredBy), "PPP")
                          : format(new Date(request.createdAt), "PPP")}
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

                  {request.bids && request.bids.length > 0 ? (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Bids ({request.bids.length})</h4>
                      <div className="space-y-3">
                        {request.bids.map((bid) => (
                          <div key={bid.id} className="flex justify-between items-center p-3 border rounded-md">
                            <div>
                              <p className="font-medium">
                                {bid.sellerInfo?.name || `Supplier #${bid.sellerId.substring(0, 8)}`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                ${bid.price.toFixed(2)} per unit • {bid.quantity} units • Delivery:{" "}
                                {format(new Date(bid.estimatedDeliveryDate), "PP")}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptBid(request.id, bid.id)}
                              disabled={processingAction === `${request.id}-${bid.id}`}
                            >
                              {processingAction === `${request.id}-${bid.id}` ? "Accepting..." : "Accept Bid"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-sm text-muted-foreground">No bids received yet</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => handleEndBidding(request.id)}
                    disabled={processingAction === `end-${request.id}`}
                  >
                    {processingAction === `end-${request.id}` ? "Ending..." : "End Bidding Early"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="payment" className="space-y-4 mt-6">
          {paymentPendingRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">There are no requests pending payment.</p>
              </CardContent>
            </Card>
          ) : (
            paymentPendingRequests.map((request) => {
              const acceptedBid = request.bids?.find((bid) => bid.status === BidStatus.ACCEPTED)

              return (
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
                          Request #{request.id.substring(0, 8)} • {request.quantity} units • Customer:{" "}
                          {request.customerInfo?.name || "Unknown"}
                        </CardDescription>
                      </div>
                      <Badge>Payment Pending</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {acceptedBid && (
                      <div className="mb-4 p-3 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Accepted Bid</h4>
                            <p className="text-sm">
                              Supplier:{" "}
                              {acceptedBid.sellerInfo?.name || `Supplier #${acceptedBid.sellerId.substring(0, 8)}`}
                            </p>
                            <p className="text-sm">
                              ${acceptedBid.price.toFixed(2)} per unit • Total: $
                              {(acceptedBid.price * acceptedBid.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Estimated delivery: {format(new Date(acceptedBid.estimatedDeliveryDate), "PPP")}
                            </p>
                          </div>
                          <Badge>Accepted</Badge>
                        </div>
                      </div>
                    )}
                    <div className="text-center p-3 bg-muted rounded-md">
                      <p className="text-sm">Waiting for customer payment confirmation</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">There are no requests pending purchase order creation.</p>
              </CardContent>
            </Card>
          ) : (
            pendingRequests.map((request) => {
              const acceptedBid = request.bids?.find((bid) => bid.status === BidStatus.ACCEPTED)

              return (
                <Card key={request.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {request.productInfo?.name || request.description.substring(0, 30)}
                        </CardTitle>
                        <CardDescription>
                          Request #{request.id.substring(0, 8)} • {request.quantity} units
                        </CardDescription>
                      </div>
                      <Badge variant="success">Bid Accepted</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {acceptedBid && (
                      <div className="mb-4 p-3 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Accepted Bid</h4>
                            <p className="text-sm">
                              Supplier:{" "}
                              {acceptedBid.sellerInfo?.name || `Supplier #${acceptedBid.sellerId.substring(0, 8)}`}
                            </p>
                            <p className="text-sm">
                              ${acceptedBid.price.toFixed(2)} per unit • Total: $
                              {(acceptedBid.price * acceptedBid.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Estimated delivery: {format(new Date(acceptedBid.estimatedDeliveryDate), "PPP")}
                            </p>
                          </div>
                          <Badge>Accepted</Badge>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Assign to Contest</h4>
                        <div className="flex gap-2">
                          <Select defaultValue="hdfc">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a contest" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hdfc">HDFC Smartbuy</SelectItem>
                              <SelectItem value="axis">Axis EDGE</SelectItem>
                              <SelectItem value="scb">SCB Rewards</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={() => acceptedBid && handleCreatePO(request.id, acceptedBid.id, "hdfc")}
                            disabled={!acceptedBid || processingAction === `po-${request.id}`}
                          >
                            {processingAction === `po-${request.id}` ? "Creating..." : "Create PO"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {completedRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">There are no completed requests.</p>
              </CardContent>
            </Card>
          ) : (
            completedRequests.map((request) => {
              const acceptedBid = request.bids?.find((bid) => bid.status === BidStatus.ACCEPTED)

              return (
                <Card key={request.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {request.productInfo?.name || request.description.substring(0, 30)}
                        </CardTitle>
                        <CardDescription>
                          Request #{request.id.substring(0, 8)} • PO #{request.id.substring(0, 6).toUpperCase()}
                        </CardDescription>
                      </div>
                      <Badge variant="success">Fulfilled</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Supplier</h4>
                        <p>{acceptedBid?.sellerInfo?.name || "Unknown Supplier"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Value</h4>
                        <p className="font-semibold">
                          ${((acceptedBid?.price || 0) * (acceptedBid?.quantity || 0)).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Completed Date</h4>
                        <p>{format(new Date(request.updatedAt), "PPP")}</p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-muted rounded-md">
                      <Package className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <p className="font-medium">Purchase Order Fulfilled</p>
                        <p className="text-sm text-muted-foreground">Contest: {request.contestId || "HDFC Smartbuy"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
