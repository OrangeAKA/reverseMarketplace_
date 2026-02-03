"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { type SmartRequest, RequestStatus } from "@/lib/types"
import { fetchRequestDetails, confirmPayment } from "@/lib/api"
import { format, formatDistanceToNow } from "date-fns"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Loader2,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import CustomerHeader from "@/components/customer/customer-header"

export default function RequestDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [request, setRequest] = useState<SmartRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState(false)

  useEffect(() => {
    const loadRequestDetails = async () => {
      try {
        const data = await fetchRequestDetails(params.id as string)
        setRequest(data)
      } catch (error) {
        console.error("Failed to load request details:", error)
        toast({
          title: "Error",
          description: "Failed to load request details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadRequestDetails()
  }, [params.id, toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!request) {
    return (
      <div className="max-w-4xl mx-auto">
        <CustomerHeader />
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">Request Not Found</h2>
            <p className="mt-2 text-muted-foreground">
              The request you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button className="mt-4" onClick={() => router.push("/my-requests")}>
              View All Requests
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusBadgeVariant =
    request.status === RequestStatus.BIDDING
      ? "default"
      : request.status === RequestStatus.AWARDED
        ? "success"
        : request.status === RequestStatus.CANCELLED
          ? "destructive"
          : request.status === RequestStatus.PAYMENT_PENDING
            ? "secondary"
            : "outline"

  const biddingTimeLeft = request.biddingEndsAt ? new Date(request.biddingEndsAt).getTime() - new Date().getTime() : 0

  const biddingProgress = biddingTimeLeft > 0 ? 100 - (biddingTimeLeft / (45 * 60 * 1000)) * 100 : 100

  const handlePaymentConfirmation = async () => {
    setProcessingPayment(true)
    try {
      await confirmPayment(params.id as string)

      // Refresh the request data
      const updatedRequest = await fetchRequestDetails(params.id as string)
      setRequest(updatedRequest)

      toast({
        title: "Payment Confirmed",
        description: "Your payment has been confirmed and the order is being processed.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingPayment(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <CustomerHeader />
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
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
              <Badge variant={statusBadgeVariant as any} className="text-sm">
                {request.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                <p>{request.description}</p>
              </div>
              <div className="space-y-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Quantity</h3>
                  <p>{request.quantity} units</p>
                </div>
                {request.budget && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Budget</h3>
                    <p>${request.budget.toFixed(2)} per unit</p>
                  </div>
                )}
                {request.requiredBy && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Required By</h3>
                    <p>{format(new Date(request.requiredBy), "PPP")}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">Request Timeline</h3>
              <div className="relative">
                <div className="flex items-center mb-4">
                  <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium">Request Created</h4>
                    <p className="text-sm text-muted-foreground">{format(new Date(request.createdAt), "PPP")}</p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div
                    className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                      request.status === RequestStatus.DRAFT ? "bg-secondary" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium">
                      Bidding {request.status === RequestStatus.BIDDING ? "In Progress" : "Completed"}
                    </h4>
                    {request.biddingEndsAt && (
                      <p className="text-sm text-muted-foreground">
                        {request.status === RequestStatus.BIDDING ? (
                          <>Ends {formatDistanceToNow(new Date(request.biddingEndsAt), { addSuffix: true })}</>
                        ) : (
                          <>Ended {formatDistanceToNow(new Date(request.biddingEndsAt), { addSuffix: true })}</>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {request.status === RequestStatus.BIDDING && (
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Bidding in progress</span>
                      <span>
                        <Clock className="inline-block h-3 w-3 mr-1" />
                        {Math.max(0, Math.floor(biddingTimeLeft / (60 * 1000)))} minutes left
                      </span>
                    </div>
                    <Progress value={biddingProgress} className="h-2" />
                  </div>
                )}

                <div className="flex items-center mb-4">
                  <div
                    className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                      request.status === RequestStatus.AWARDED ||
                      request.status === RequestStatus.FULFILLED ||
                      request.status === RequestStatus.PAYMENT_PENDING
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium">Bid Awarded</h4>
                    {request.status === RequestStatus.AWARDED ||
                    request.status === RequestStatus.FULFILLED ||
                    request.status === RequestStatus.PAYMENT_PENDING ? (
                      <p className="text-sm text-muted-foreground">{format(new Date(request.updatedAt), "PPP")}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Pending</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <div
                    className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                      request.status === RequestStatus.FULFILLED ? "bg-primary text-primary-foreground" : "bg-secondary"
                    }`}
                  >
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium">Order Fulfilled</h4>
                    {request.status === RequestStatus.FULFILLED ? (
                      <p className="text-sm text-muted-foreground">{format(new Date(request.updatedAt), "PPP")}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Pending</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {request.isBulkBuy && request.participants && request.participants.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" /> Bulk Buy Participants
              </CardTitle>
              <CardDescription>
                {request.participants.length} participant{request.participants.length !== 1 ? "s" : ""} in this Bulk Buy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {request.participants.map((participant, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                    <div>
                      <p className="font-medium">{participant.name || "Unnamed Participant"}</p>
                      <p className="text-sm text-muted-foreground">{participant.email}</p>
                    </div>
                    <Badge variant="outline">Invited</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>Current status of your request</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              {request.status === RequestStatus.BIDDING && (
                <>
                  <TrendingUp className="mx-auto h-12 w-12 text-primary mb-2" />
                  <h3 className="text-lg font-medium mb-1">Awaiting Bids</h3>
                  <p className="text-muted-foreground">
                    Your request is currently being reviewed by suppliers. You'll be notified when a bid is accepted by
                    our procurement team.
                  </p>
                </>
              )}
              {request.status === RequestStatus.PAYMENT_PENDING && (
                <>
                  <CheckCircle className="mx-auto h-12 w-12 text-primary mb-2" />
                  <h3 className="text-lg font-medium mb-1">Bid Accepted - Payment Required</h3>
                  <p className="text-muted-foreground mb-4">
                    A bid has been accepted for your request. Please confirm payment to proceed with the order.
                  </p>
                  <Button onClick={handlePaymentConfirmation} disabled={processingPayment} className="mx-auto">
                    {processingPayment ? "Processing..." : "Confirm Payment"}
                  </Button>
                </>
              )}
              {request.status === RequestStatus.AWARDED && (
                <>
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
                  <h3 className="text-lg font-medium mb-1">Payment Confirmed</h3>
                  <p className="text-muted-foreground">
                    Your payment has been confirmed. Your order is being processed.
                  </p>
                </>
              )}
              {request.status === RequestStatus.FULFILLED && (
                <>
                  <Package className="mx-auto h-12 w-12 text-green-500 mb-2" />
                  <h3 className="text-lg font-medium mb-1">Order Fulfilled</h3>
                  <p className="text-muted-foreground">Your order has been fulfilled and is on its way to you.</p>
                </>
              )}
              {request.status === RequestStatus.CANCELLED && (
                <>
                  <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-2" />
                  <h3 className="text-lg font-medium mb-1">Request Cancelled</h3>
                  <p className="text-muted-foreground">
                    This request has been cancelled. Please create a new request if you still need this item.
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
